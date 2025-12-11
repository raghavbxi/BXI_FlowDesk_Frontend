import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';

const StopModal = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason('');
      onClose();
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Stop Work</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Please provide a reason for stopping work on this task.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason for stopping work..."
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!reason.trim()}
          color="warning"
        >
          Stop Work
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StopModal;

