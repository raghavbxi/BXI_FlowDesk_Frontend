import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

const ProgressUpdateModal = ({ open, onClose, onConfirm, currentProgress, newProgress }) => {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    if (comment.trim()) {
      onConfirm(comment);
      setComment('');
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Progress</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Progress: {currentProgress}% → {newProgress}%
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Please provide a comment explaining this progress update.
          </Typography>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Explain what was completed or why the progress changed..."
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!comment.trim()}
        >
          Update Progress
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressUpdateModal;

