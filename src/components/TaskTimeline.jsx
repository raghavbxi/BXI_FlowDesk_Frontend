import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import dayjs from 'dayjs';

const TaskTimeline = ({ task }) => {
  const events = [];

  // Add creation event
  const creator = task.createdBy || {};
  events.push({
    date: task.createdAt,
    title: 'Task Created',
    description: `Created by ${creator.name || 'Unknown User'}`,
    color: '#0071e3', // Apple blue
  });

  // Add stop logs
  if (task.stopLogs && task.stopLogs.length > 0) {
    task.stopLogs.forEach((log) => {
      const user = log.userId || {};
      events.push({
        date: log.timestamp,
        title: 'Work Stopped',
        description: `${user.name || 'Unknown User'} paused work. Reason: ${log.reason}`,
        color: '#ff9500', // Apple orange
      });
    });
  }

  // Add comments
  if (task.comments && task.comments.length > 0) {
    task.comments.forEach((comment) => {
      const user = comment.userId || {};
      events.push({
        date: comment.timestamp || comment.createdAt,
        title: 'Comment Added',
        description: `${user.name || 'Unknown User'}: ${comment.text.substring(0, 50)}${comment.text.length > 50 ? '...' : ''}`,
        color: '#8b5cf6', // Purple
      });
    });
  }

  // Sort events by date
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Timeline
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        {events.length > 0 ? (
          <Box>
            {events.map((event, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FiberManualRecordIcon sx={{ color: event.color, fontSize: 16 }} />
                    {index < events.length - 1 && (
                      <Box
                        sx={{
                          width: 2,
                          height: 40,
                          backgroundColor: 'divider',
                          mt: 0.5,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9375rem' }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.875rem' }}>
                      {event.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                      {dayjs(event.date).format('MMM DD, YYYY hh:mm A')}
                    </Typography>
                  </Box>
                </Box>
                {index < events.length - 1 && <Divider sx={{ mb: 2 }} />}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No timeline events yet
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TaskTimeline;

