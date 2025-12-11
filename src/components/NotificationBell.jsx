import React, { useEffect, useState } from 'react';
import { IconButton, Badge, Popover, Box, Typography, Button, Divider, List, ListItem, ListItemText, ListItemButton, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useNotificationStore from '../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetchNotifications({ limit: 20 });
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (anchorEl) {
        fetchNotifications({ limit: 20 });
      }
    }, 30000);

    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications({ limit: 20 });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    if (notification.taskId) {
      navigate(`/tasks/${notification.taskId}`);
    }
    handleClose();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned':
      case 'step_assigned':
        return '📋';
      case 'task_mentioned':
        return '💬';
      case 'task_comment':
        return '💭';
      case 'task_updated':
        return '✏️';
      case 'task_completed':
        return '✅';
      case 'help_request':
        return '🆘';
      case 'step_activated':
        return '▶️';
      case 'task_overdue':
        return '⚠️';
      case 'task_due_soon':
        return '⏰';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task_assigned':
      case 'step_assigned':
        return '#0071e3';
      case 'task_mentioned':
        return '#ff9500';
      case 'task_comment':
        return '#34c759';
      case 'task_updated':
        return '#5856d6';
      case 'task_completed':
        return '#34c759';
      case 'help_request':
        return '#ff3b30';
      case 'task_overdue':
        return '#ff3b30';
      default:
        return '#8e8e93';
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          width: 36,
          height: 36,
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderColor: 'primary.main',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: '90vw',
            maxHeight: 500,
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
            mt: 1,
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.0625rem' }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllRead}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  color: 'primary.main',
                  minWidth: 'auto',
                  px: 1,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 1 }} />
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No notifications
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  disablePadding
                  sx={{
                    backgroundColor: notification.isRead ? 'transparent' : 'rgba(0, 113, 227, 0.05)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                    sx={{ py: 1.5, px: 2 }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: getNotificationColor(notification.type) + '15',
                          borderRadius: 0,
                          border: '1px solid',
                          borderColor: getNotificationColor(notification.type) + '40',
                          flexShrink: 0,
                        }}
                      >
                        <Typography sx={{ fontSize: '1.25rem' }}>
                          {getNotificationIcon(notification.type)}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            fontSize: '0.9375rem',
                            mb: 0.5,
                            color: 'text.primary',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.8125rem',
                            color: 'text.secondary',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                          }}
                        >
                          {dayjs(notification.createdAt).fromNow()}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;

