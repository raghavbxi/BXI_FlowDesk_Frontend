import React from 'react';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const ProgressBarDynamic = ({ progress, daysRemaining, totalDays, progressColor, overdue }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  
  // Ensure progress is a valid number
  const progressValue = Number(progress) || 0;
  
  const getProgressColorValue = () => {
    // If progress is 100%, always show green (completed)
    if (progressValue >= 100) {
      return '#34c759'; // Apple green for completed
    }
    
    if (overdue) {
      return '#ff3b30'; // Apple red for overdue
    }
    
    // If we don't have days information, use default
    if (!totalDays || totalDays <= 0 || daysRemaining === undefined || daysRemaining === null) {
      return '#0071e3'; // Apple blue default
    }
    
    // Convert daysRemaining to number to ensure proper comparison
    const daysRemainingNum = Number(daysRemaining);
    
    // Critical: If 1-2 days remaining, always show red (regardless of percentage)
    if (daysRemainingNum <= 2 && daysRemainingNum > 0) {
      return '#ff3b30'; // Apple red for critical deadline
    }
    
    // Calculate percentage of time remaining
    const remainingPercentage = (daysRemainingNum / totalDays) * 100;
    
    // Green: More than 60% time remaining
    if (remainingPercentage > 60) {
      return '#34c759'; // Apple green
    }
    // Yellow: 40-60% time remaining
    if (remainingPercentage >= 40 && remainingPercentage <= 60) {
      return '#ffcc00'; // Yellow
    }
    // Orange: 20-40% time remaining
    if (remainingPercentage >= 20 && remainingPercentage < 40) {
      return '#ff9500'; // Apple orange
    }
    // Red: Less than 20% time remaining
    return '#ff3b30'; // Apple red
  };

  const getStatusText = () => {
    // If progress is 100%, show completed
    if (progressValue >= 100) {
      return 'Completed';
    }
    if (overdue) {
      return 'Overdue';
    }
    if (daysRemaining < 0) {
      return `${Math.abs(daysRemaining)} days overdue`;
    }
    if (daysRemaining === 0) {
      return 'Due today';
    }
    if (daysRemaining === 1) {
      return '1 day left';
    }
    return `${daysRemaining} days left`;
  };

  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            fontSize: '0.9375rem',
          }}
        >
          {Math.round(progressValue)}%
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {overdue && progressValue < 100 && (
            <WarningIcon
              sx={{
                color: '#ff3b30',
                fontSize: 18,
                animation: `${pulse} 1.5s ease-in-out infinite`,
              }}
            />
          )}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontSize: '0.875rem',
            }}
          >
            {getStatusText()}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 12,
          borderRadius: 0,
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          border: 'none',
          overflow: 'hidden',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={Math.min(100, Math.max(0, progressValue))}
          sx={{
            height: '100%',
            borderRadius: 0,
            backgroundColor: 'transparent',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getProgressColorValue(),
              borderRadius: 0,
              animation: (overdue && progressValue < 100) ? `${pulse} 1.5s ease-in-out infinite` : 'none',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProgressBarDynamic;

