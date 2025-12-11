import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { usersAPI } from '../services/api';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';

const EditTaskModal = ({ open, onClose, task }) => {
  const { updateTask } = useTaskStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUsers: [],
    startDate: null,
    endDate: null,
    status: 'not-started',
    priority: 'medium',
  });

  useEffect(() => {
    if (open && task) {
      // Initialize form with task data
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignedUsers: task.assignedUsers || [],
        startDate: task.startDate ? dayjs(task.startDate) : dayjs(),
        endDate: task.endDate ? dayjs(task.endDate) : dayjs().add(7, 'day'),
        status: task.status || 'not-started',
        priority: task.priority || 'medium',
      });
      fetchUsers();
    }
  }, [open, task]);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;

    setLoading(true);
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        assignedUsers: formData.assignedUsers.map((u) => (u._id || u)),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        status: formData.status,
        priority: formData.priority,
      };
      const result = await updateTask(task._id, taskData);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name || option}
              value={formData.assignedUsers}
              onChange={(e, newValue) => {
                setFormData({ ...formData, assignedUsers: newValue });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Assign Users" sx={{ mb: 2 }} />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name || option}
                    {...getTagProps({ index })}
                    key={option._id || option}
                  />
                ))
              }
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) => {
                  setFormData({ ...formData, startDate: newValue });
                }}
                sx={{ flex: 1 }}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) => {
                  setFormData({ ...formData, endDate: newValue });
                }}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="not-started">Not Started</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={handleChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Updating...' : 'Update Task'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditTaskModal;

