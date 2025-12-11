import React from 'react';
import { Chip } from '@mui/material';

const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return { bg: '#ff3b30', color: '#fff' };
      case 'high':
        return { bg: '#ff9500', color: '#fff' };
      case 'medium':
        return { bg: '#ffcc00', color: '#000' };
      case 'low':
        return { bg: '#34c759', color: '#fff' };
      default:
        return { bg: '#8e8e93', color: '#fff' };
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical':
        return 'Critical';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Medium';
    }
  };

  const colors = getPriorityColor(priority);

  return (
    <Chip
      label={getPriorityLabel(priority)}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: '0.6875rem',
        height: 20,
        borderRadius: 0,
        border: 'none',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

export default PriorityBadge;

