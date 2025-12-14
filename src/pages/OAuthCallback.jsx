import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import useAuthStore from '../store/authStore';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback, loading, error } = useAuthStore();

  useEffect(() => {
    const processOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const provider = searchParams.get('provider') || 'google'; // Default to google, or extract from state/URL

      if (!code) {
        // If no code, redirect to login
        navigate('/login');
        return;
      }

      const result = await handleOAuthCallback(provider, code, state);
      if (result.success) {
        navigate('/dashboard');
      } else {
        // Error will be shown in the UI
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        gap: 3,
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Authenticating...
          </Typography>
        </>
      ) : error ? (
        <>
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Redirecting to login...
          </Typography>
        </>
      ) : (
        <>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Processing authentication...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default OAuthCallback;

