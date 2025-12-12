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

const CreateTaskModal = ({ open, onClose }) => {
  const { createTask } = useTaskStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUsers: [],
    startDate: dayjs(),
    endDate: dayjs().add(7, 'day'),
    status: 'not-started',
    priority: 'medium',
  });

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      console.log('Users API Response:', response.data);
      const usersList = response.data?.data || response.data || [];
      console.log('Users list:', usersList);
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
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
    setLoading(true);
    try {
      const taskData = {
        ...formData,
        assignedUsers: formData.assignedUsers.map((u) => u._id || u),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      };
      const result = await createTask(taskData);
      if (result.success) {
        setFormData({
          title: '',
          description: '',
          assignedUsers: [],
          startDate: dayjs(),
          endDate: dayjs().add(7, 'day'),
          status: 'not-started',
          priority: 'medium',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
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
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return `${option.name || 'Unknown'} (${option.email || ''})`;
              }}
              value={formData.assignedUsers}
              onChange={(e, newValue) => {
                setFormData({ ...formData, assignedUsers: newValue });
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof option === 'object' && typeof value === 'object') {
                  return option._id === value._id;
                }
                return option === value;
              }}
              renderInput={(params) => (
                <TextField {...params} label="Assign Users" sx={{ mb: 2 }} />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={typeof option === 'object' ? `${option.name || 'Unknown'} (${option.email || ''})` : option}
                    {...getTagProps({ index })}
                    key={typeof option === 'object' ? (option._id || index) : option}
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
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateTaskModal;

