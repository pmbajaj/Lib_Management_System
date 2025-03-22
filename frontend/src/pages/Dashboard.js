import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Container, Grid, Typography, Paper, Box, Button, Divider,
  Card, CardContent, CardActions, CircularProgress, Alert, Tabs, Tab
} from '@mui/material';
import {
  AutoStories as BookIcon,
  Assignment as TransactionIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    borrowedBooks: [],
    recentTransactions: [],
    notifications: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, this would be real API calls
        // const borrowedBooks = await axios.get('/api/user/books/borrowed');
        // const recentTransactions = await axios.get('/api/user/transactions/recent');
        // const notifications = await axios.get('/api/user/notifications');

        // Mock data for demonstration
        const mockBorrowedBooks = [
          {
            id: 1,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            coverImageUrl: 'https://source.unsplash.com/random/?book,1'
          },
          {
            id: 2,
            title: '1984',
            author: 'George Orwell',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            coverImageUrl: 'https://source.unsplash.com/random/?book,2'
          }
        ];

        const mockRecentTransactions = [
          {
            id: 1,
            type: 'BORROW',
            bookTitle: 'To Kill a Mockingbird',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'COMPLETED'
          },
          {
            id: 2,
            type: 'RETURN',
            bookTitle: 'The Great Gatsby',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'COMPLETED'
          },
          {
            id: 3,
            type: 'BORROW',
            bookTitle: '1984',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'COMPLETED'
          }
        ];

        const mockNotifications = [
          {
            id: 1,
            message: 'Your book "To Kill a Mockingbird" is due in 7 days',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            isRead: false
          },
          {
            id: 2,
            message: 'Your book request for "Lord of the Rings" has been approved',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            isRead: true
          }
        ];

        setDashboardData({
          borrowedBooks: mockBorrowedBooks,
          recentTransactions: mockRecentTransactions,
          notifications: mockNotifications
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  // Redirect admin users to the admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.firstName || 'Reader'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your books, track your transactions, and view your notifications all in one place.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: 'primary.light', 
              color: 'primary.contrastText',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BookIcon fontSize="large" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Borrowed Books
              </Typography>
            </Box>
            <Typography variant="h3" component="div" gutterBottom>
              {dashboardData.borrowedBooks.length}
            </Typography>
            <Button 
              component={Link} 
              to="/books/borrowed" 
              variant="outlined" 
              color="inherit" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 1 }}
            >
              View All
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: 'secondary.light', 
              color: 'secondary.contrastText',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TransactionIcon fontSize="large" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Transactions
              </Typography>
            </Box>
            <Typography variant="h3" component="div" gutterBottom>
              {dashboardData.recentTransactions.length}
            </Typography>
            <Button 
              component={Link} 
              to="/transactions" 
              variant="outlined" 
              color="inherit" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 1 }}
            >
              View All
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: 'info.light', 
              color: 'info.contrastText',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon fontSize="large" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Notifications
              </Typography>
            </Box>
            <Typography variant="h3" component="div" gutterBottom>
              {dashboardData.notifications.filter(n => !n.isRead).length}
            </Typography>
            <Button 
              component={Link} 
              to="/notifications" 
              variant="outlined" 
              color="inherit" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 1 }}
            >
              View All
            </Button>
          </Paper>
        </Grid>

        {/* Tabbed Content */}
        <Grid item xs={12}>
          <Paper sx={{ mt: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Borrowed Books" />
              <Tab label="Recent Transactions" />
              <Tab label="Notifications" />
            </Tabs>
            <Divider />
            
            {/* Borrowed Books Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                {dashboardData.borrowedBooks.length === 0 ? (
                  <Alert severity="info">You don't have any borrowed books at the moment.</Alert>
                ) : (
                  <Grid container spacing={3}>
                    {dashboardData.borrowedBooks.map((book) => (
                      <Grid item xs={12} sm={6} md={4} key={book.id}>
                        <Card sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: 3
                          }
                        }}>
                          <Box
                            sx={{
                              pt: '56.25%', // 16:9 aspect ratio
                              position: 'relative'
                            }}
                          >
                            <Box
                              component="img"
                              src={book.coverImageUrl}
                              alt={book.title}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {book.author}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2">
                                Due Date:
                              </Typography>
                              <Typography variant="body2" color="error.main" fontWeight="bold">
                                {book.dueDate}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button size="small" component={Link} to={`/books/${book.id}`}>View Details</Button>
                            <Button size="small" color="primary">Return Book</Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Recent Transactions Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                {dashboardData.recentTransactions.length === 0 ? (
                  <Alert severity="info">You don't have any recent transactions.</Alert>
                ) : (
                  dashboardData.recentTransactions.map((transaction) => (
                    <Paper 
                      key={transaction.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2} sm={1}>
                          <Box 
                            sx={{ 
                              bgcolor: transaction.type === 'BORROW' ? 'primary.main' : 'secondary.main', 
                              color: 'white',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {transaction.type === 'BORROW' ? <BookIcon /> : <TransactionIcon />}
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={8}>
                          <Typography variant="subtitle1">
                            {transaction.type === 'BORROW' ? 'Borrowed: ' : 'Returned: '}
                            <strong>{transaction.bookTitle}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sm={3} sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              display: 'inline-block',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: transaction.status === 'COMPLETED' ? 'success.light' : 'warning.light'
                            }}
                          >
                            {transaction.status}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                )}
              </Box>
            )}

            {/* Notifications Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                {dashboardData.notifications.length === 0 ? (
                  <Alert severity="info">You don't have any notifications.</Alert>
                ) : (
                  dashboardData.notifications.map((notification) => (
                    <Paper 
                      key={notification.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        bgcolor: notification.isRead ? 'background.paper' : 'action.hover',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={1}>
                          <Box 
                            sx={{ 
                              bgcolor: notification.isRead ? 'grey.400' : 'info.main', 
                              color: 'white',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <NotificationsIcon />
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body1">
                            {notification.message}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'right' }}>
                          <Button size="small" color="primary">
                            {notification.isRead ? 'View' : 'Mark as Read'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 