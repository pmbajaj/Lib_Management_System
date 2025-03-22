import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Typography, TextField, Button, Box, 
  Paper, Avatar, Alert
} from '@mui/material';
import { LockResetOutlined } from '@mui/icons-material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Email address is required');
      setLoading(false);
      return;
    }

    try {
      // In a real application, this would be an actual API call
      // For demo purposes, just simulate a successful password reset request
      // const response = await axios.post('/api/auth/forgot-password', { email });
      
      // Simulated success
      setSuccess('If a user with that email exists, we have sent password reset instructions to your email.');
      setEmail('');
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockResetOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
            {success}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Typography sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword; 