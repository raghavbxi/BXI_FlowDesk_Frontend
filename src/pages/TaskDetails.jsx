import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Slider,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Pause,
  PlayArrow,
  HelpOutline,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import ProgressBarDynamic from '../components/ProgressBarDynamic';
import CommentBox from '../components/CommentBox';
import AssignedUsersBar from '../components/AssignedUsersBar';
import TaskTimeline from '../components/TaskTimeline';
import StopModal from '../components/StopModal';
import HelpRequestModal from '../components/HelpRequestModal';
import EditTaskModal from '../components/EditTaskModal';
import ProgressUpdateModal from '../components/ProgressUpdateModal';
import ActivityTrail from '../components/ActivityTrail';
import StepList from '../components/StepList';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTask, loading, error, fetchTask, stopWork, resumeWork, updateProgress, requestHelp } = useTaskStore();
  const { user } = useAuthStore();
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [manualProgress, setManualProgress] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id, fetchTask]);

  useEffect(() => {
    if (currentTask) {
      setManualProgress(currentTask.manualProgress || 0);
    }
  }, [currentTask]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentTask) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Task not found'}</Alert>
      </Container>
    );
  }

  const isAssigned = currentTask.assignedUsers?.some(
    (u) => (u._id || u) === user?.id
  );
  const isCreator = (currentTask.createdBy?._id || currentTask.createdBy) === user?.id;
  const canEdit = isCreator || user?.role === 'admin' || user?.role === 'superadmin';

  const handleProgressChange = (event, newValue) => {
    setManualProgress(newValue);
  };

  const handleProgressSubmit = async (comment) => {
    await updateProgress(currentTask._id, manualProgress, comment);
    setProgressModalOpen(false);
    fetchTask(id); // Refresh to get updated activities
  };

  const handleStopWork = async (reason) => {
    await stopWork(currentTask._id, reason);
    fetchTask(id); // Refresh to get updated activities
  };

  const handleResumeWork = async () => {
    await resumeWork(currentTask._id);
    fetchTask(id); // Refresh to get updated activities
  };

  const handleRequestHelp = async () => {
    await requestHelp(currentTask._id);
    fetchTask(id); // Refresh to get updated activities
    alert('Help request sent!');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/dashboard')}
            sx={{
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 600, 
              flex: 1,
              color: 'text.primary',
            }}
          >
            {currentTask.title}
          </Typography>
          <Chip
            label={currentTask.status?.replace('-', ' ').toUpperCase()}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                  {currentTask.description || 'No description provided'}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                  Progress
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 400 }}>
                    Progress
                  </Typography>
                  <ProgressBarDynamic
                    progress={currentTask.displayProgress !== undefined ? currentTask.displayProgress : (currentTask.manualProgress !== null && currentTask.manualProgress !== undefined ? currentTask.manualProgress : currentTask.autoProgress)}
                    daysRemaining={currentTask.daysRemaining}
                    totalDays={currentTask.totalDays}
                    progressColor={currentTask.progressColor}
                    overdue={currentTask.overdue}
                  />
                  {currentTask.manualProgress !== null && currentTask.manualProgress !== undefined && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                      Manual Progress: {currentTask.manualProgress}% | Time-based: {currentTask.autoProgress}%
                    </Typography>
                  )}
                </Box>
                {(isAssigned || isCreator) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 400 }}>
                      Manual Progress: {manualProgress}%
                    </Typography>
                    <Slider
                      value={manualProgress}
                      onChange={handleProgressChange}
                      min={0}
                      max={100}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => setProgressModalOpen(true)}
                      sx={{ mt: 1 }}
                    >
                      Update Progress
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <StepList
                  taskId={currentTask._id}
                  taskCreatedBy={currentTask.createdBy?._id || currentTask.createdBy}
                  userRole={user?.role}
                />
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <CommentBox
                  taskId={currentTask._id}
                  comments={currentTask.comments}
                  onCommentAdded={() => fetchTask(id)}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                  Task Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Created By
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 400 }}>
                    {currentTask.createdBy?.name || 'Unknown User'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Start Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 400 }}>
                    {dayjs(currentTask.startDate).format('MMM DD, YYYY')}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    End Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 400,
                      color: currentTask.overdue ? 'error.main' : 'inherit',
                    }}
                  >
                    {dayjs(currentTask.endDate).format('MMM DD, YYYY')}
                  </Typography>
                </Box>
                <AssignedUsersBar assignedUsers={currentTask.assignedUsers} />
              </CardContent>
            </Card>

            {(isAssigned || isCreator) && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                    Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {currentTask.status === 'paused' ? (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={handleResumeWork}
                        color="primary"
                      >
                        Resume Work
                      </Button>
                    ) : currentTask.status !== 'completed' ? (
                      <Button
                        variant="outlined"
                        startIcon={<Pause />}
                        onClick={() => setStopModalOpen(true)}
                        color="warning"
                      >
                        Stop Work
                      </Button>
                    ) : null}
                    {isAssigned && currentTask.status !== 'completed' && (
                      <Button
                        variant="outlined"
                        startIcon={<HelpOutline />}
                        onClick={() => setHelpModalOpen(true)}
                        color="secondary"
                      >
                        Request Help
                      </Button>
                    )}
                    {canEdit && (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setEditModalOpen(true)}
                        color="primary"
                      >
                        Edit Task
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )}

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <TaskTimeline task={currentTask} />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <ActivityTrail taskId={currentTask._id} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <StopModal
          open={stopModalOpen}
          onClose={() => setStopModalOpen(false)}
          onConfirm={handleStopWork}
        />
        <HelpRequestModal
          open={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
          onConfirm={handleRequestHelp}
        />
        <EditTaskModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            fetchTask(id); // Refresh task data after edit
          }}
          task={currentTask}
        />
        <ProgressUpdateModal
          open={progressModalOpen}
          onClose={() => setProgressModalOpen(false)}
          onConfirm={handleProgressSubmit}
          currentProgress={currentTask?.manualProgress || 0}
          newProgress={manualProgress}
        />
      </Container>
    </Box>
  );
};

export default TaskDetails;

