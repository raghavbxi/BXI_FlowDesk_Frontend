import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import dayjs from 'dayjs';
import { activitiesAPI } from '../services/api';

const ActivityTrail = ({ taskId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [taskId]);

  const fetchActivities = async () => {
    try {
      const response = await activitiesAPI.getTaskActivities(taskId);
      setActivities(response.data.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      created: '●',
      updated: '●',
      paused: '⏸',
      resumed: '▶',
      progress_updated: '●',
      commented: '●',
      assigned: '●',
      unassigned: '●',
      status_changed: '●',
      help_requested: '●',
    };
    return icons[action] || '●';
  };

  const getActionColor = (action) => {
    // Apple-inspired colors
    const colors = {
      created: '#0071e3',
      updated: '#0071e3',
      paused: '#ff9500',
      resumed: '#34c759',
      progress_updated: '#0071e3',
      commented: '#8b5cf6',
      assigned: '#34c759',
      unassigned: '#ff3b30',
      status_changed: '#0071e3',
      help_requested: '#ff3b30',
    };
    return colors[action] || '#86868b';
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
          Activity Trail
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Activity Trail
      </Typography>
      <Paper sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        {activities.length > 0 ? (
          <Box>
            {activities.map((activity, index) => {
              const user = activity.userId || {};
              return (
                <Box key={activity._id || index}>
                  <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar
                        src={user.avatar}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'text.primary',
                          color: 'background.paper',
                          fontSize: '0.75rem',
                          borderRadius: 0,
                        }}
                      >
                        {user.name?.charAt(0) || 'U'}
                      </Avatar>
                      {index < activities.length - 1 && (
                        <Box
                          sx={{
                            width: 2,
                            height: 40,
                            backgroundColor: 'divider',
                            mt: 1,
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: getActionColor(activity.action),
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {getActionIcon(activity.action)} {activity.action.replace('_', ' ')}
                      </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 0.5, color: 'text.primary', fontSize: '0.9375rem' }}>
                        <strong>{user.name || 'Unknown User'}</strong> {activity.description}
                      </Typography>
                      {activity.metadata?.comment && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            ml: 2,
                            mb: 0.5,
                          }}
                        >
                          "{activity.metadata.comment}"
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                        {dayjs(activity.createdAt).format('MMM DD, YYYY hh:mm A')}
                      </Typography>
                    </Box>
                  </Box>
                  {index < activities.length - 1 && <Divider />}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No activities yet
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ActivityTrail;

