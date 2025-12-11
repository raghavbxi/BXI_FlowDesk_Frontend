import React from 'react';
import { Box, Avatar, AvatarGroup, Typography, Chip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AssignedUsersBar = ({ assignedUsers, onAddUser }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 400, minWidth: 100 }}>
        Assigned Users:
      </Typography>
      {assignedUsers && assignedUsers.length > 0 ? (
        <AvatarGroup max={5}>
          {assignedUsers.map((user) => (
            <Avatar
              key={user._id || user}
              alt={user.name || 'User'}
              src={user.avatar}
              sx={{ width: 40, height: 40 }}
            >
              {user.name?.charAt(0) || 'U'}
            </Avatar>
          ))}
        </AvatarGroup>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No users assigned
        </Typography>
      )}
      {onAddUser && (
        <Chip
          icon={<PersonAddIcon />}
          label="Add User"
          onClick={onAddUser}
          color="primary"
          variant="outlined"
          sx={{ cursor: 'pointer' }}
        />
      )}
    </Box>
  );
};

export default AssignedUsersBar;

