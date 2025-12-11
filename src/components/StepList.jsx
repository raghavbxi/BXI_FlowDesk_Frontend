import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { stepsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import dayjs from 'dayjs';

const StepList = ({ taskId, taskCreatedBy, userRole }) => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [users, setUsers] = useState([]);
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUsers: [],
    startDate: '',
    endDate: '',
  });

  const canManage = user?.id === taskCreatedBy || userRole === 'admin' || userRole === 'superadmin';

  useEffect(() => {
    fetchSteps();
    fetchUsers();
  }, [taskId]);

  const fetchSteps = async () => {
    try {
      const response = await stepsAPI.getTaskSteps(taskId);
      setSteps(response.data.data);
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenModal = (step = null) => {
    if (step) {
      setEditingStep(step);
      setFormData({
        title: step.title || '',
        description: step.description || '',
        assignedUsers: step.assignedUsers?.map((u) => u._id || u) || [],
        startDate: step.startDate ? dayjs(step.startDate).format('YYYY-MM-DD') : '',
        endDate: step.endDate ? dayjs(step.endDate).format('YYYY-MM-DD') : '',
      });
    } else {
      setEditingStep(null);
      setFormData({
        title: '',
        description: '',
        assignedUsers: [],
        startDate: '',
        endDate: '',
      });
    }
    setStepModalOpen(true);
  };

  const handleCloseModal = () => {
    setStepModalOpen(false);
    setEditingStep(null);
    setFormData({
      title: '',
      description: '',
      assignedUsers: [],
      startDate: '',
      endDate: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingStep) {
        await stepsAPI.updateStep(editingStep._id, {
          ...formData,
          taskId,
        });
      } else {
        await stepsAPI.createStep({
          ...formData,
          taskId,
        });
      }
      fetchSteps();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving step:', error);
      alert('Failed to save step');
    }
  };

  const handleActivate = async (stepId) => {
    try {
      await stepsAPI.activateStep(stepId);
      fetchSteps();
    } catch (error) {
      console.error('Error activating step:', error);
      alert('Failed to activate step');
    }
  };

  const handleComplete = async (stepId) => {
    try {
      await stepsAPI.completeStep(stepId);
      fetchSteps();
    } catch (error) {
      console.error('Error completing step:', error);
      alert('Failed to complete step');
    }
  };

  const handleDelete = async (stepId) => {
    if (!window.confirm('Are you sure you want to delete this step?')) return;
    try {
      await stepsAPI.deleteStep(stepId);
      fetchSteps();
    } catch (error) {
      console.error('Error deleting step:', error);
      alert('Failed to delete step');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      'in-progress': 'primary',
      completed: 'success',
      blocked: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Typography>Loading steps...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          Steps ({steps.length})
        </Typography>
        {canManage && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
            size="small"
          >
            Add Step
          </Button>
        )}
      </Box>

      {steps.length === 0 ? (
        <Alert severity="info">No steps defined. Add steps to assign users at different stages.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((step) => (
            <Card
              key={step._id}
              sx={{
                border: step.isActive ? '2px solid' : '1px solid',
                borderColor: step.isActive ? 'primary.main' : 'divider',
                borderRadius: 0,
                boxShadow: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 400 }}>
                        Step {step.stepNumber}: {step.title}
                      </Typography>
                      <Chip
                        label={step.status.replace('-', ' ').toUpperCase()}
                        size="small"
                        color={getStatusColor(step.status)}
                      />
                      {step.isActive && (
                        <Chip label="ACTIVE" size="small" color="primary" />
                      )}
                    </Box>
                    {step.description && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {step.description}
                      </Typography>
                    )}
                    {step.assignedUsers && step.assignedUsers.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          Assigned Users:
                        </Typography>
                        <AvatarGroup max={5}>
                          {step.assignedUsers.map((user) => (
                            <Avatar
                              key={user._id || user}
                              src={user.avatar}
                              sx={{ width: 32, height: 32 }}
                            >
                              {user.name?.charAt(0) || 'U'}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </Box>
                    )}
                    {(step.startDate || step.endDate) && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {step.startDate && `Start: ${dayjs(step.startDate).format('MMM DD, YYYY')}`}
                          {step.startDate && step.endDate && ' | '}
                          {step.endDate && `End: ${dayjs(step.endDate).format('MMM DD, YYYY')}`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {canManage && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!step.isActive && step.status !== 'completed' && (
                        <IconButton
                          size="small"
                          onClick={() => handleActivate(step._id)}
                          title="Activate Step"
                        >
                          <PlayArrow />
                        </IconButton>
                      )}
                      {step.isActive && step.status !== 'completed' && (
                        <IconButton
                          size="small"
                          onClick={() => handleComplete(step._id)}
                          title="Complete Step"
                          color="success"
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(step)}
                        title="Edit Step"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(step._id)}
                        title="Delete Step"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={stepModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStep ? 'Edit Step' : 'Create Step'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Step Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Assigned Users"
            value={formData.assignedUsers}
            onChange={(e) => setFormData({ ...formData, assignedUsers: e.target.value })}
            margin="normal"
            SelectProps={{ multiple: true }}
          >
            {users.map((u) => (
              <MenuItem key={u._id} value={u._id}>
                {u.name} ({u.email})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.title}>
            {editingStep ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StepList;

