import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAuthStore();
  const { mode } = useThemeStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        backgroundImage: mode === 'dark' 
          ? 'linear-gradient(180deg, #000000 0%, #1d1d1f 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card 
          sx={{ 
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            maxWidth: 440,
            mx: 'auto',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary', fontSize: '1.0625rem' }}>
              Sign in to your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mb: 3, 
                  py: 1.5,
                  fontSize: '1.0625rem',
                  fontWeight: 400,
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.9375rem' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#0071e3', textDecoration: 'none' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;

