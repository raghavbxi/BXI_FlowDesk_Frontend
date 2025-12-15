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
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { signInWithGoogle } from '../services/googleAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin, loading, error, isAuthenticated } = useAuthStore();
  const { mode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Sign in with Google using Firebase
      const result = await signInWithGoogle();
      
      if (!result.success) {
        setGoogleLoading(false);
        return;
      }
      
      // Send ID token to backend
      const loginResult = await googleLogin(result.idToken);
      
      if (loginResult.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('[Register] Google login error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

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
    const result = await register(formData.name, formData.email);
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
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary', fontSize: '1.0625rem' }}>
              Sign up to get started
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Google OAuth Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              sx={{
                mb: 3,
                py: 1.5,
                fontSize: '1.0625rem',
                fontWeight: 400,
                borderRadius: 0,
                borderColor: 'divider',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
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
                  borderRadius: 0,
                }}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.9375rem' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#0071e3', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
