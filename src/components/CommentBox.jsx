import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { commentsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import dayjs from 'dayjs';

const CommentBox = ({ taskId, comments: initialComments, onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await commentsAPI.addComment(taskId, { text: newComment });
      setComments([...comments, response.data.data]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.deleteComment(taskId, commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Comments ({comments.length})
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Add a comment... Use @username to mention someone"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleAddComment}
          disabled={loading || !newComment.trim()}
        >
          Post Comment
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {comments.map((comment) => {
          const commentUser = comment.userId || comment;
          const isOwner = commentUser._id === user?.id || commentUser === user?.id;
          const canDelete = isOwner || user?.role === 'admin' || user?.role === 'superadmin';

          return (
            <Paper
              key={comment._id}
              sx={{
                p: 2.5,
                mb: 2,
                borderRadius: 0,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: 'none',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar
                  src={commentUser.avatar}
                  sx={{ width: 40, height: 40 }}
                >
                  {commentUser.name?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                      {commentUser.name || 'Unknown User'}
                    </Typography>
                    {canDelete && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteComment(comment._id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap', color: 'text.primary', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                    {comment.text}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                    {dayjs(comment.timestamp || comment.createdAt).format('MMM DD, YYYY hh:mm A')}
                  </Typography>
                  {comment.mentions && comment.mentions.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ color: 'primary.main' }}>
                        Mentioned: {comment.mentions.map((m) => m.name || m).join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default CommentBox;

