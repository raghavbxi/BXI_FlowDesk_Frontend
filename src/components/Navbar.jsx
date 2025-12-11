import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'background.default',
        backdropFilter: 'saturate(180%) blur(20px)',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar 
        sx={{ 
          maxWidth: '1400px', 
          width: '100%', 
          mx: 'auto', 
          px: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 600, 
            cursor: 'pointer',
            fontSize: '1.0625rem',
            color: 'text.primary',
            letterSpacing: '-0.011em',
          }}
          onClick={() => navigate('/dashboard')}
        >
          Task Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Button
            onClick={() => navigate('/dashboard')}
            sx={{ 
              textTransform: 'none',
              color: 'text.primary',
              fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
              fontWeight: 400,
              minWidth: 'auto',
              px: { xs: 1, sm: 2 },
              display: { xs: 'none', sm: 'block' },
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => navigate('/calendar')}
            sx={{ 
              textTransform: 'none',
              color: 'text.primary',
              fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
              fontWeight: 400,
              minWidth: 'auto',
              px: { xs: 1, sm: 2 },
              display: { xs: 'none', sm: 'block' },
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
            }}
          >
            Calendar
          </Button>
          <NotificationBell />
          <IconButton
            onClick={toggleTheme}
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
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              px: 1.5,
              py: 0.5,
              borderRadius: 0,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'transparent',
              },
            }}
            onClick={handleMenuOpen}
          >
            <Avatar
              sx={{ 
                width: 28, 
                height: 28, 
                bgcolor: 'primary.main',
                fontSize: '0.8125rem',
                fontWeight: 500,
                borderRadius: 0,
              }}
              src={user?.avatar}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.9375rem', fontWeight: 400 }}>
              {user?.name || 'User'}
            </Typography>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              Profile
            </MenuItem>
            {user?.role === 'superadmin' && (
              <MenuItem disabled>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 400 }}>
                  Super Admin
                </Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

