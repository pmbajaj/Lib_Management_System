import React, { useState, useContext, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, TextField, Button, Paper, Avatar,
  Divider, Chip, CircularProgress, Alert, Tabs, Tab, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  VpnKey as VpnKeyIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Tabs
  const [activityHistory, setActivityHistory] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    
    // Fetch activity history
    fetchActivityHistory();
  }, [user]);

  const fetchActivityHistory = async () => {
    setActivityLoading(true);
    try {
      // Simulate API call to get user activity
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockHistory = [
        {
          id: 1,
          type: 'BORROW',
          bookTitle: 'To Kill a Mockingbird',
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Borrowed "To Kill a Mockingbird"'
        },
        {
          id: 2,
          type: 'RETURN',
          bookTitle: 'The Great Gatsby',
          timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Returned "The Great Gatsby"'
        },
        {
          id: 3,
          type: 'LOGIN',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Logged in to the system'
        },
        {
          id: 4,
          type: 'PROFILE_UPDATE',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Updated profile information'
        },
        {
          id: 5,
          type: 'BORROW',
          bookTitle: '1984',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Borrowed "1984"'
        }
      ];
      
      setActivityHistory(mockHistory);
    } catch (err) {
      console.error('Error fetching activity history:', err);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form data if canceling edit
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    setEditMode(!editMode);
    setSuccess('');
    setError('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const result = await updateUserProfile(profileData);
      if (result.success) {
        setSuccess(result.message);
        setEditMode(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful password change
      setPasswordSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setPasswordDialogOpen(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">Please login to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              mr: 3
            }}
          >
            {user.firstName?.[0] || user.username?.[0]}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip
                icon={<PersonIcon />}
                label={`@${user.username}`}
                size="small"
                sx={{ mr: 1 }}
              />
              {user.role && (
                <Chip
                  label={user.role}
                  color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Member since: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box>
            <Button
              variant={editMode ? "outlined" : "contained"}
              color={editMode ? "error" : "primary"}
              startIcon={editMode ? <CancelIcon /> : <EditIcon />}
              onClick={handleEditToggle}
              sx={{ mb: 1 }}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<VpnKeyIcon />}
              onClick={() => setPasswordDialogOpen(true)}
              sx={{ display: 'block' }}
            >
              Change Password
            </Button>
          </Box>
        </Box>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ mb: 4 }} />
        
        <Box component="form" onSubmit={handleProfileSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={profileData.address}
                onChange={handleProfileChange}
                disabled={!editMode}
              />
            </Grid>
            
            {editMode && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<HistoryIcon />} label="Activity History" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
        </Tabs>
        
        <Divider />
        
        {/* Activity History Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity History
            </Typography>
            
            {activityLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : activityHistory.length === 0 ? (
              <Alert severity="info">No activity history found.</Alert>
            ) : (
              activityHistory.map((activity) => (
                <Card key={activity.id} sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="body1">
                          {activity.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                        <Chip
                          size="small"
                          label={activity.type}
                          color={
                            activity.type === 'BORROW' ? 'primary' :
                            activity.type === 'RETURN' ? 'success' :
                            'default'
                          }
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" component="span">
                          {activity.timestamp}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            
            <Alert severity="info">
              You have no new notifications.
            </Alert>
          </Box>
        )}
      </Paper>
      
      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {passwordSuccess}
            </Alert>
          )}
          
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Current Password"
              type="password"
              fullWidth
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type="password"
              fullWidth
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPasswordDialogOpen(false)} 
            disabled={passwordLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordSubmit}
            variant="contained"
            color="primary"
            disabled={passwordLoading}
            startIcon={passwordLoading && <CircularProgress size={20} />}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 