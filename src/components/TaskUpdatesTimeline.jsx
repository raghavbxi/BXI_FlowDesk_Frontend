import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
} from '@mui/material';
import {
  FiberManualRecord,
  Add,
  Delete,
  CalendarToday,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { updatesAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const TaskUpdatesTimeline = ({ task }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const isAssigned = task?.assignedUsers?.some(
    (u) => (u._id || u) === user?.id
  );
  const isCreator = (task?.createdBy?._id || task?.createdBy) === user?.id;
  const canAddUpdate = isAssigned || isCreator;

  useEffect(() => {
    if (task?._id) {
      fetchUpdates();
    }
  }, [task?._id]);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await updatesAPI.getTaskUpdates(task._id);
      setUpdates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
      setError('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    // Set default date to today, but within task date range
    const today = new Date();
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    let defaultDate = today;
    if (today < taskStart) {
      defaultDate = taskStart;
    } else if (today > taskEnd) {
      defaultDate = taskEnd;
    }
    
    setUpdateDate(dayjs(defaultDate).format('YYYY-MM-DD'));
    setUpdateText('');
    setError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUpdateText('');
    setUpdateDate('');
    setError(null);
  };

  const handleSubmitUpdate = async () => {
    if (!updateText.trim()) {
      setError('Please provide an update text');
      return;
    }

    if (!updateDate) {
      setError('Please select a date for this update');
      return;
    }

    // Validate date is within task range
    const selectedDate = new Date(updateDate);
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);

    if (selectedDate < taskStart || selectedDate > taskEnd) {
      setError('Update date must be between task start date and end date');
      return;
    }

    try {
      await updatesAPI.createTaskUpdate(task._id, {
        updateText: updateText.trim(),
        updateDate: selectedDate.toISOString(),
      });
      await fetchUpdates();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add update');
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      await updatesAPI.deleteTaskUpdate(updateId);
      await fetchUpdates();
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Failed to delete update');
    }
  };

  // Sort updates by date (newest first)
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          Task Updates ({updates.length})
        </Typography>
        {canAddUpdate && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleOpenDialog}
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 0,
              textTransform: 'none',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'transparent',
              },
            }}
          >
            Add Update
          </Button>
        )}
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 0,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          minHeight: 200,
        }}
      >
        {loading ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Loading updates...
          </Typography>
        ) : sortedUpdates.length > 0 ? (
          <Box>
            {sortedUpdates.map((update, index) => {
              const updateUser = update.userId || {};
              const canDelete =
                (updateUser._id || updateUser) === user?.id ||
                isCreator ||
                user?.role === 'admin' ||
                user?.role === 'superadmin';

              return (
                <Box key={update._id}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <FiberManualRecord
                        sx={{
                          color: '#0071e3',
                          fontSize: 16,
                        }}
                      />
                      {index < sortedUpdates.length - 1 && (
                        <Box
                          sx={{
                            width: 2,
                            height: 60,
                            backgroundColor: 'divider',
                            mt: 0.5,
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 0,
                            fontSize: '0.875rem',
                            bgcolor: 'primary.main',
                          }}
                        >
                          {updateUser.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              fontSize: '0.9375rem',
                            }}
                          >
                            {updateUser.name || 'Unknown User'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}
                            >
                              {dayjs(update.updateDate).format('MMM DD, YYYY')}
                            </Typography>
                          </Box>
                        </Box>
                        {canDelete && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUpdate(update._id)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'error.main',
                                backgroundColor: 'transparent',
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          fontSize: '0.9375rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          mb: 1,
                        }}
                      >
                        {update.updateText}
                      </Typography>
                    </Box>
                  </Box>
                  {index < sortedUpdates.length - 1 && <Divider sx={{ mb: 2 }} />}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No updates yet. {canAddUpdate && 'Add an update to track progress!'}
          </Typography>
        )}
      </Paper>

      {/* Add Update Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 400, pb: 1 }}>Add Task Update</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Update Date"
            type="date"
            value={updateDate}
            onChange={(e) => setUpdateDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: dayjs(task.startDate).format('YYYY-MM-DD'),
              max: dayjs(task.endDate).format('YYYY-MM-DD'),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Update Text"
            placeholder="Describe what has been accomplished, any challenges faced, or next steps..."
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
            Task period: {dayjs(task.startDate).format('MMM DD, YYYY')} -{' '}
            {dayjs(task.endDate).format('MMM DD, YYYY')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              borderRadius: 0,
              textTransform: 'none',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitUpdate}
            variant="contained"
            sx={{
              borderRadius: 0,
              textTransform: 'none',
            }}
          >
            Add Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskUpdatesTimeline;



