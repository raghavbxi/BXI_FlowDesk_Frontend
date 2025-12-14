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

const Login = () => {
  const navigate = useNavigate();
  const { login, sendOTP, loading, error, isAuthenticated, initiateOAuth } = useAuthStore();
  const { mode } = useThemeStore();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      return;
    }

    setOtpMessage('');
    const result = await sendOTP(formData.email);
    if (result.success) {
      setOtpSent(true);
      setOtpMessage(result.message || 'OTP has been sent to your email');
    } else {
      setOtpMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpSent) {
      // First step: send OTP
      await handleSendOTP(e);
      return;
    }
    
    // Second step: verify OTP and login
    if (!formData.otp) {
      return;
    }
    
    const result = await login(formData.email, formData.otp);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleResendOTP = async () => {
    setOtpSent(false);
    setFormData({ ...formData, otp: '' });
    setOtpMessage('');
    await handleSendOTP({ preventDefault: () => {} });
  };

  const handleOAuthLogin = async (provider) => {
    await initiateOAuth(provider);
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
              Sign in with OTP
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {otpMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {otpMessage}
              </Alert>
            )}

            {/* OAuth Buttons */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
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
              Continue with Google
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
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={otpSent}
                sx={{ mb: 2 }}
              />

              {otpSent ? (
                <>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    name="otp"
                    type="text"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                    placeholder="000000"
                    sx={{ mb: 2 }}
                    helperText="Enter the 6-digit OTP sent to your email"
                  />
                  <Button
                    type="button"
                    fullWidth
                    variant="text"
                    onClick={handleResendOTP}
                    disabled={loading}
                    sx={{ 
                      mb: 2,
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontSize: '0.9375rem',
                    }}
                  >
                    Resend OTP
                  </Button>
                </>
              ) : null}

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
                {loading 
                  ? (otpSent ? 'Signing in...' : 'Sending OTP...')
                  : (otpSent ? 'Sign In' : 'Send OTP')
                }
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
