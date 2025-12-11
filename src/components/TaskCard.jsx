import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  HelpOutline,
  Edit,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import ProgressBarDynamic from './ProgressBarDynamic';
import PriorityBadge from './PriorityBadge';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { stopWork, resumeWork, requestHelp } = useTaskStore();
  const { user } = useAuthStore();

  const isAssigned = task.assignedUsers?.some(
    (u) => u._id === user?.id || u === user?.id
  );
  const isCreator = task.createdBy?._id === user?.id || task.createdBy === user?.id;
  const canEdit = isCreator || user?.role === 'admin' || user?.role === 'superadmin';

  const handleStopWork = async (e) => {
    e.stopPropagation();
    const reason = prompt('Please provide a reason for stopping work:');
    if (reason) {
      await stopWork(task._id, reason);
    }
  };

  const handleResumeWork = async (e) => {
    e.stopPropagation();
    await resumeWork(task._id);
  };

  const handleRequestHelp = async (e) => {
    e.stopPropagation();
    await requestHelp(task._id);
    alert('Help request sent!');
  };

  const getStatusColor = (status) => {
    return 'default';
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)',
        },
      }}
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 400, flex: 1, mr: 2 }}>
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {task.priority && <PriorityBadge priority={task.priority} />}
            <Chip
              label={task.status?.replace('-', ' ').toUpperCase()}
              color={getStatusColor(task.status)}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        </Box>

        {task.description && (
            <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.9375rem' }}
          >
            {task.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <ProgressBarDynamic
            progress={task.displayProgress !== undefined ? task.displayProgress : (task.manualProgress !== null && task.manualProgress !== undefined ? task.manualProgress : task.autoProgress)}
            daysRemaining={task.daysRemaining}
            totalDays={task.totalDays}
            progressColor={task.progressColor}
            overdue={task.overdue}
          />
          {task.manualProgress !== null && task.manualProgress !== undefined && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                Manual Progress: {task.manualProgress}%
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.8125rem' }}>
              Due: {dayjs(task.endDate).format('MMM DD, YYYY')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.8125rem' }}>
              Created: {dayjs(task.createdAt).format('MMM DD, YYYY')}
            </Typography>
          </Box>
          {task.assignedUsers && task.assignedUsers.length > 0 && (
            <AvatarGroup max={3}>
              {task.assignedUsers.map((user) => (
                <Avatar
                  key={user._id || user}
                  alt={user.name || 'User'}
                  src={user.avatar}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.name?.charAt(0) || 'U'}
                </Avatar>
              ))}
            </AvatarGroup>
          )}
        </Box>

        {(isAssigned || isCreator) && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {task.status === 'paused' ? (
              <Tooltip title="Resume Work">
                <IconButton size="small" onClick={handleResumeWork} color="primary">
                  <PlayArrow />
                </IconButton>
              </Tooltip>
            ) : task.status !== 'completed' ? (
              <Tooltip title="Stop Work">
                <IconButton size="small" onClick={handleStopWork} color="warning">
                  <Pause />
                </IconButton>
              </Tooltip>
            ) : null}
            {isAssigned && task.status !== 'completed' && (
              <Tooltip title="Request Help">
                <IconButton size="small" onClick={handleRequestHelp} color="secondary">
                  <HelpOutline />
                </IconButton>
              </Tooltip>
            )}
            {canEdit && (
              <Tooltip title="Edit Task">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tasks/${task._id}`);
                  }}
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;

