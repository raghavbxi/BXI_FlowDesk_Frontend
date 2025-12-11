import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const HelpRequestModal = ({ open, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request Help</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to request help for this task?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          An email notification will be sent to the task creator and all assigned members.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="secondary">
          Send Help Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpRequestModal;

