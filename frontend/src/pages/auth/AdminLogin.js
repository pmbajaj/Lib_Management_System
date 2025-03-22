import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockIcon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';

const AdminLogin = () => {
  const { login, isAuthenticated, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If the user is already authenticated and is an admin, redirect to admin dashboard
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
    // If the user is authenticated but not an admin, redirect to user dashboard
    else if (isAuthenticated && !isAdmin) {
      navigate('/dashboard');
      // You might want to show an error message that they don't have admin privileges
      // This could be done through a toast notification or an alert
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        // Login successful, redirection will happen in useEffect
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)'
        }}
      >
        <Box sx={{ 
          backgroundColor: 'primary.main', 
          borderRadius: '50%', 
          p: 1.5, 
          mb: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <AdminIcon fontSize="large" sx={{ color: 'white' }} />
        </Box>
        
        <Typography component="h1" variant="h4" gutterBottom>
          Admin Portal
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Sign in to access the library management system administration
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Admin Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
            sx={{ 
              mt: 2, 
              mb: 3,
              py: 1.5,
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              component={Link} 
              to="/login" 
              variant="outlined" 
              color="secondary"
              sx={{ mx: 1 }}
            >
              User Login
            </Button>
            <Button 
              component={Link} 
              to="/" 
              variant="text" 
              sx={{ mx: 1 }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Library Management System © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminLogin; 