import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import AuthContext from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, isAdmin } = useContext(AuthContext);

  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated and is admin, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  // If authenticated and not admin, render children
  return <Outlet />;
};

export default ProtectedRoute; 