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
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, sendOTP, loading, error, isAuthenticated } = useAuthStore();
  const { mode } = useThemeStore();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    const result = await sendOTP(formData.email);
    if (result.success) {
      setOtpSent(true);
      setOtpMessage(result.message || 'OTP has been sent to your email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginMethod === 'otp') {
      if (!otpSent) {
        // First step: send OTP
        await handleSendOTP(e);
        return;
      }
      // Second step: verify OTP
      const result = await login(formData.email, null, formData.otp);
      if (result.success) {
        navigate('/dashboard');
      }
    } else {
      // Password login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      }
    }
  };

  const switchToOTP = () => {
    setLoginMethod('otp');
    setOtpSent(false);
    setFormData({ ...formData, password: '', otp: '' });
    setOtpMessage('');
  };

  const switchToPassword = () => {
    setLoginMethod('password');
    setOtpSent(false);
    setFormData({ ...formData, password: '', otp: '' });
    setOtpMessage('');
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

            {otpMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {otpMessage}
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
                disabled={otpSent && loginMethod === 'otp'}
                sx={{ mb: 2 }}
              />

              {loginMethod === 'password' ? (
                <>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="button"
                    fullWidth
                    variant="text"
                    onClick={switchToOTP}
                    sx={{ 
                      mb: 2,
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontSize: '0.9375rem',
                    }}
                  >
                    Login with OTP instead
                  </Button>
                </>
              ) : (
                <>
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
                        inputProps={{ maxLength: 6 }}
                        placeholder="000000"
                        sx={{ mb: 2 }}
                        helperText="Enter the 6-digit OTP sent to your email"
                      />
                      <Button
                        type="button"
                        fullWidth
                        variant="text"
                        onClick={handleSendOTP}
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
                  ) : (
                    <Button
                      type="button"
                      fullWidth
                      variant="text"
                      onClick={switchToPassword}
                      sx={{ 
                        mb: 2,
                        textTransform: 'none',
                        color: 'text.secondary',
                        fontSize: '0.9375rem',
                      }}
                    >
                      Login with password instead
                    </Button>
                  )}
                </>
              )}

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
                  ? (loginMethod === 'otp' && !otpSent ? 'Sending OTP...' : 'Signing in...')
                  : (loginMethod === 'otp' && !otpSent ? 'Send OTP' : 'Sign In')
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
