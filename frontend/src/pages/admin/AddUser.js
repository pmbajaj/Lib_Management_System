import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';

const AddUser = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    role: 'USER'
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'username', 'email', 
      'password', 'confirmPassword', 'role'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Username validation (alphanumeric + underscore, 3-20 chars)
    if (formData.username && !/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters using only letters, numbers, and underscores';
    }
    
    // Password validation (min 8 chars, must include number and special char)
    if (formData.password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters and include a number and a special character';
    }
    
    // Confirm password validation
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone number validation (optional, but if provided, validate format)
    if (formData.phoneNumber && !/^\+?[0-9()-\s]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset submission state
    setSubmitError('');
    setSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real application, this would be an API call
      // const response = await axios.post('/api/admin/users', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful user creation
      setSuccess(true);
      
      // Clear form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        role: 'USER'
      });
      
      // Redirect to user management after short delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setSubmitError(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate a random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
    let password = '';
    
    // Ensure at least one uppercase, one lowercase, one digit, one special char
    password += chars.charAt(Math.floor(Math.random() * 26)); // uppercase
    password += chars.charAt(26 + Math.floor(Math.random() * 26)); // lowercase
    password += chars.charAt(52 + Math.floor(Math.random() * 10)); // digit
    password += chars.charAt(62 + Math.floor(Math.random() * 7)); // special
    
    // Add random chars to reach minimum length of 8
    for (let i = 0; i < 4; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    setFormData({
      ...formData,
      password,
      confirmPassword: password
    });
    
    // Clear any existing password errors
    setErrors({
      ...errors,
      password: '',
      confirmPassword: ''
    });
    
    // Show the generated password
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          You don't have permission to access this page. This page is only accessible to administrators.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonAddIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Add New User
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            User created successfully! Redirecting to user management...
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username || 'Use 3-20 characters, letters, numbers and underscores only'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || 'Min 8 characters with at least 1 number and 1 special character'}
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
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={generateRandomPassword}
                sx={{ mb: 2 }}
              >
                Generate Random Password
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber || 'Optional'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl required fullWidth error={!!errors.role}>
                <InputLabel id="role-select-label">User Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  name="role"
                  value={formData.role}
                  label="User Role *"
                  onChange={handleChange}
                >
                  <MenuItem value="USER">Regular User</MenuItem>
                  <MenuItem value="LIBRARIAN">Librarian</MenuItem>
                  <MenuItem value="ADMIN">Administrator</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address || 'Optional'}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/admin/users')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Creating User...' : 'Create User'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddUser; 