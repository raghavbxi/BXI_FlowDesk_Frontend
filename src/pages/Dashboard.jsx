import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { tasks, loading, error, fetchTasks, filters, setFilters } = useTaskStore();
  const { user } = useAuthStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeStatFilter, setActiveStatFilter] = useState(null); // 'all', 'today', 'upcoming', 'overdue'

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
    // Clear stat filter when other filters change
    if (key !== 'statFilter') {
      setActiveStatFilter(null);
    }
  };

  const handleStatFilter = (filterType) => {
    if (activeStatFilter === filterType) {
      // If clicking the same filter, clear it
      setActiveStatFilter(null);
    } else {
      setActiveStatFilter(filterType);
    }
  };

  // Calculate stats from all tasks (before filtering)
  const allTasks = tasks;
  const todayTasks = allTasks.filter((task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(task.endDate);
    endDate.setHours(0, 0, 0, 0);
    return endDate.getTime() === today.getTime();
  });

  const overdueTasks = allTasks.filter((task) => task.overdue);
  const upcomingTasks = allTasks.filter((task) => !task.overdue && task.status !== 'completed');

  const filteredTasks = tasks.filter((task) => {
    // Apply stat filter first
    if (activeStatFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(task.endDate);
      endDate.setHours(0, 0, 0, 0);
      if (endDate.getTime() !== today.getTime()) {
        return false;
      }
    } else if (activeStatFilter === 'overdue') {
      if (!task.overdue) {
        return false;
      }
    } else if (activeStatFilter === 'upcoming') {
      if (task.overdue || task.status === 'completed') {
        return false;
      }
    }
    // activeStatFilter === 'all' or null shows all tasks

    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 8 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            Welcome back, {user?.name || 'User'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1875rem' }}>
            Manage your tasks and stay on track
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: { xs: '100%', sm: 200 } }}
            size="small"
          />
          <FormControl sx={{ minWidth: { xs: '100%', sm: 150 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="not-started">Not Started</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 150 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }} size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority || 'all'}
              label="Priority"
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 150 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }} size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="endDate">Due Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => handleStatFilter('all')}
              sx={{
                p: 4,
                borderRadius: 0,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: activeStatFilter === 'all' ? 'primary.main' : 'divider',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                {allTasks.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>Total Tasks</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => handleStatFilter('today')}
              sx={{
                p: 4,
                borderRadius: 0,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: activeStatFilter === 'today' ? 'primary.main' : 'divider',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                {todayTasks.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>Due Today</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => handleStatFilter('upcoming')}
              sx={{
                p: 4,
                borderRadius: 0,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: activeStatFilter === 'upcoming' ? 'primary.main' : 'divider',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                {upcomingTasks.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>Upcoming</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              onClick={() => handleStatFilter('overdue')}
              sx={{
                p: 4,
                borderRadius: 0,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: activeStatFilter === 'overdue' ? 'primary.main' : 'divider',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                {overdueTasks.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>Overdue</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Tasks */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredTasks.length > 0 ? (
          <Grid container spacing={3}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={task._id}>
                <TaskCard task={task} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: 0,
              backgroundColor: 'background.paper',
              border: '1px solid #333333',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}>
              No tasks found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create your first task to get started
            </Typography>
          </Box>
        )}

        {/* Create Task FAB */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            borderRadius: 0,
          }}
          onClick={() => setCreateModalOpen(true)}
        >
          <AddIcon />
        </Fab>

        <CreateTaskModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;

