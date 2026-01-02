import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Container, Typography, Box } from '@mui/material';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your Email: {user?.email}
        </Typography>
        
        <Button variant="outlined" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;