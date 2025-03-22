import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';
import AuthContext from '../../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  // If authenticated but not an admin, show an error or redirect
  if (!isAdmin) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          You don't have administrator privileges to access this area.
          Redirecting to user dashboard...
        </Alert>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
        <Navigate to="/dashboard" />
      </Box>
    );
  }

  // If authenticated and is admin, render admin routes
  return <Outlet />;
};

export default AdminRoute; 