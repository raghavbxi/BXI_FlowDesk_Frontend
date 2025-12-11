import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import useTaskStore from '../store/taskStore';
import PriorityBadge from '../components/PriorityBadge';

const Calendar = () => {
  const navigate = useNavigate();
  const { tasks, loading, error, fetchTasks } = useTaskStore();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfWeek = startOfMonth.day();

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      const taskDate = dayjs(task.endDate);
      return taskDate.isSame(date, 'day');
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 8 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Calendar View
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              onClick={handlePrevMonth}
              sx={{
                cursor: 'pointer',
                px: 2,
                py: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              ← Prev
            </Box>
            <Box
              sx={{
                px: 3,
                py: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                fontWeight: 600,
              }}
            >
              {currentMonth.format('MMMM YYYY')}
            </Box>
            <Box
              onClick={handleNextMonth}
              sx={{
                cursor: 'pointer',
                px: 2,
                py: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              Next →
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
              }}
            >
              <Grid container spacing={0}>
                {weekDays.map((day) => (
                  <Grid item xs={12 / 7} key={day}>
                    <Box
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {day}
                    </Box>
                  </Grid>
                ))}
                {days.map((day, index) => {
                  const date = day ? startOfMonth.add(day - 1, 'day') : null;
                  const dateTasks = date ? getTasksForDate(date) : [];
                  const isToday = date && date.isSame(dayjs(), 'day');
                  const isSelected = date && date.isSame(selectedDate, 'day');

                  return (
                    <Grid item xs={12 / 7} key={index}>
                      <Box
                        onClick={() => date && handleDateClick(date)}
                        sx={{
                          minHeight: 100,
                          p: 1,
                          borderBottom: '1px solid',
                          borderRight: '1px solid',
                          borderColor: 'divider',
                          cursor: date ? 'pointer' : 'default',
                          backgroundColor: isSelected
                            ? 'rgba(0, 113, 227, 0.1)'
                            : isToday
                            ? 'rgba(0, 113, 227, 0.05)'
                            : 'transparent',
                          '&:hover': date
                            ? {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              }
                            : {},
                        }}
                      >
                        {day && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isToday ? 700 : isSelected ? 600 : 400,
                                mb: 0.5,
                                color: isToday ? 'primary.main' : 'text.primary',
                              }}
                            >
                              {day}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {dateTasks.slice(0, 2).map((task) => (
                                <Chip
                                  key={task._id}
                                  label={task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title}
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/tasks/${task._id}`);
                                  }}
                                  sx={{
                                    height: 20,
                                    fontSize: '0.6875rem',
                                    borderRadius: 0,
                                    cursor: 'pointer',
                                    backgroundColor: task.overdue
                                      ? '#ff3b30'
                                      : task.priority === 'critical'
                                      ? '#ff3b30'
                                      : task.priority === 'high'
                                      ? '#ff9500'
                                      : task.priority === 'medium'
                                      ? '#ffcc00'
                                      : '#34c759',
                                    color: task.priority === 'medium' ? '#000' : '#fff',
                                    '&:hover': {
                                      opacity: 0.8,
                                    },
                                  }}
                                />
                              ))}
                              {dateTasks.length > 2 && (
                                <Typography variant="caption" sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
                                  +{dateTasks.length - 2} more
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                position: 'sticky',
                top: 80,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedDate.format('MMMM DD, YYYY')}
              </Typography>
              {selectedDateTasks.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No tasks due on this date
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedDateTasks.map((task) => (
                    <Box
                      key={task._id}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 0,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                          {task.title}
                        </Typography>
                        {task.priority && <PriorityBadge priority={task.priority} />}
                      </Box>
                      {task.description && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.875rem' }}>
                          {task.description.length > 100
                            ? task.description.substring(0, 100) + '...'
                            : task.description}
                        </Typography>
                      )}
                      <Chip
                        label={task.status?.replace('-', ' ')}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          fontSize: '0.6875rem',
                          height: 20,
                          borderRadius: 0,
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Calendar;

