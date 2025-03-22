import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Box, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar, Divider, IconButton, Paper, 
  Button, Chip, CircularProgress, Alert, Tabs, Tab
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  MarkunreadMailbox as MailboxIcon,
  Event as EventIcon,
  BookmarkBorder as BookmarkIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get the appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'due_date':
        return <EventIcon color="warning" />;
      case 'overdue':
        return <WarningIcon color="error" />;
      case 'return_confirmation':
        return <MailboxIcon color="success" />;
      case 'book_available':
        return <BookmarkIcon color="primary" />;
      case 'system':
        return <InfoIcon color="info" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };

  // Get the severity level based on notification type
  const getNotificationSeverity = (type) => {
    switch (type.toLowerCase()) {
      case 'overdue':
        return 'error';
      case 'due_date':
        return 'warning';
      case 'return_confirmation':
        return 'success';
      case 'book_available':
        return 'primary';
      case 'system':
        return 'info';
      default:
        return 'default';
    }
  };

  // Calculate the relative time for notifications
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/notifications');
        
        // Mock data for demonstration
        const mockNotifications = [
          {
            id: 1,
            type: 'due_date',
            bookId: 1,
            bookTitle: 'To Kill a Mockingbird',
            message: 'Your book "To Kill a Mockingbird" is due tomorrow. Please return or renew it.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            isRead: false,
            url: '/borrowed'
          },
          {
            id: 2,
            type: 'return_confirmation',
            bookId: 2,
            bookTitle: '1984',
            message: 'Thank you for returning "1984". We hope you enjoyed reading it!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            isRead: true,
            url: '/transactions'
          },
          {
            id: 3,
            type: 'overdue',
            bookId: 3,
            bookTitle: 'The Great Gatsby',
            message: 'Your book "The Great Gatsby" is overdue by 5 days. A fine of $5.50 has been applied.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
            isRead: false,
            url: '/borrowed'
          },
          {
            id: 4,
            type: 'book_available',
            bookId: 4,
            bookTitle: 'Pride and Prejudice',
            message: 'Good news! "Pride and Prejudice" that you reserved is now available for borrowing.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            isRead: false,
            url: '/books/4'
          },
          {
            id: 5,
            type: 'system',
            message: 'Library opening hours will be extended starting next week. We will be open until 9 PM on weekdays.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            isRead: true,
            url: '/'
          }
        ];

        // Filter based on current tab
        let filteredNotifications;
        if (currentTab === 0) {
          // All notifications
          filteredNotifications = mockNotifications;
        } else if (currentTab === 1) {
          // Unread notifications
          filteredNotifications = mockNotifications.filter(note => !note.isRead);
        } else {
          // Read notifications
          filteredNotifications = mockNotifications.filter(note => note.isRead);
        }

        setNotifications(filteredNotifications);
        setUnreadCount(mockNotifications.filter(note => !note.isRead).length);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentTab]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const markAsRead = async (notificationId) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/notifications/${notificationId}/read`);
      
      // Update state to mark as read
      setNotifications(prev => 
        prev.map(note => 
          note.id === notificationId ? { ...note, isRead: true } : note
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // In a real app, this would be an API call
      // await axios.delete(`/api/notifications/${notificationId}`);
      
      // Update state to remove notification
      const noteToDelete = notifications.find(note => note.id === notificationId);
      setNotifications(prev => prev.filter(note => note.id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      if (noteToDelete && !noteToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate to the relevant page if URL is provided
    if (notification.url) {
      navigate(notification.url);
    }
  };

  const markAllAsRead = async () => {
    try {
      // In a real app, this would be an API call
      // await axios.put('/api/notifications/mark-all-read');
      
      // Update state to mark all as read
      setNotifications(prev => 
        prev.map(note => ({ ...note, isRead: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h4" component="h1">
            Notifications
            {unreadCount > 0 && (
              <Chip 
                label={unreadCount} 
                color="primary" 
                size="small" 
                sx={{ ml: 2, height: 22 }}
              />
            )}
          </Typography>
        </Box>
        
        {unreadCount > 0 && (
          <Button 
            variant="outlined" 
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="notification tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label={`Unread (${unreadCount})`} />
          <Tab label="Read" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentTab === 1 
                ? 'You have no unread notifications' 
                : currentTab === 2 
                  ? 'You have no read notifications' 
                  : 'You will be notified about important library updates'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{ 
                    bgcolor: !notification.isRead ? 'action.hover' : 'inherit',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer'
                    }
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: !notification.isRead ? 'bold' : 'normal' }}
                        >
                          {notification.bookTitle || 'System Notification'}
                        </Typography>
                        {!notification.isRead && (
                          <Chip 
                            label="New" 
                            size="small" 
                            color={getNotificationSeverity(notification.type)}
                            sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          display="block"
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {getRelativeTime(notification.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Notifications; 