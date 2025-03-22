import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Grid, Typography, Paper, Box, Button, Divider,
  Card, CardContent, CircularProgress, Alert, Tabs, Tab
} from '@mui/material';
import {
  Book as BookIcon,
  People as PeopleIcon,
  Assignment as TransactionIcon,
  ArrowForward as ArrowForwardIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeTransactions: 0,
    pendingReturns: 0,
    recentTransactions: [],
    recentUsers: []
  });

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, this would be real API calls
        // const stats = await axios.get('/api/admin/dashboard/stats');
        // const recentTransactions = await axios.get('/api/admin/transactions/recent');
        // const recentUsers = await axios.get('/api/admin/users/recent');

        // Mock data for demonstration
        const mockStats = {
          totalBooks: 352,
          totalUsers: 127,
          activeTransactions: 48,
          pendingReturns: 12
        };

        const mockRecentTransactions = [
          {
            id: 1,
            type: 'BORROW',
            username: 'johndoe',
            bookTitle: 'To Kill a Mockingbird',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'COMPLETED'
          },
          {
            id: 2,
            type: 'RETURN',
            username: 'janedoe',
            bookTitle: 'The Great Gatsby',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'COMPLETED'
          },
          {
            id: 3,
            type: 'BORROW',
            username: 'michaelsmith',
            bookTitle: '1984',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'PENDING'
          },
          {
            id: 4,
            type: 'BORROW',
            username: 'sarahwilliams',
            bookTitle: 'Pride and Prejudice',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'COMPLETED'
          },
          {
            id: 5,
            type: 'RETURN',
            username: 'robertjohnson',
            bookTitle: 'The Hobbit',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'PENDING'
          }
        ];

        const mockRecentUsers = [
          {
            id: 1,
            username: 'johndoe',
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            booksCount: 3
          },
          {
            id: 2,
            username: 'janedoe',
            fullName: 'Jane Doe',
            email: 'jane.doe@example.com',
            registrationDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            booksCount: 2
          },
          {
            id: 3,
            username: 'michaelsmith',
            fullName: 'Michael Smith',
            email: 'michael.smith@example.com',
            registrationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            booksCount: 1
          },
          {
            id: 4,
            username: 'sarahwilliams',
            fullName: 'Sarah Williams',
            email: 'sarah.williams@example.com',
            registrationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            booksCount: 5
          }
        ];

        setDashboardData({
          ...mockStats,
          recentTransactions: mockRecentTransactions,
          recentUsers: mockRecentUsers
        });
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load admin dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboardData();
  }, []);

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
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage library resources, track user activity, and monitor system performance.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
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
                Total Books
              </Typography>
            </Box>
            <Typography variant="h3" component="div" gutterBottom>
              {dashboardData.totalBooks}
            </Typography>
            <Button 
              component={Link} 
              to="/admin/books" 
              variant="outlined" 
              color="inherit" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 1 }}
            >
              Manage Books
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
              <PeopleIcon fontSize="large" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Total Users
              </Typography>
            </Box>
            <Typography variant="h3" component="div" gutterBottom>
              {dashboardData.totalUsers}
            </Typography>
            <Button 
              component={Link} 
              to="/admin/users" 
              variant="outlined" 
              color="inherit" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 1 }}
            >
              Manage Users
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
              <TransactionIcon fontSize="large" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Active Loans
              </Typography>
            </Box>
            <Typography variant="h3" component="div" gutterBottom>
              {dashboardData.activeTransactions}
            </Typography>
            <Button 
              component={Link} 
              to="/admin/transactions" 
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

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: 'warning.light', 
              color: 'warning.contrastText',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChartIcon fontSize="large" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Pending Returns
              </Typography>
            </Box>
            <Typography variant="h3" component="div" gutterBottom>
              {dashboardData.pendingReturns}
            </Typography>
            <Button 
              component={Link} 
              to="/admin/transactions/pending" 
              variant="outlined" 
              color="inherit" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 1 }}
            >
              Process Returns
            </Button>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/admin/books/add" 
                  startIcon={<BookIcon />}
                  sx={{ mr: 2 }}
                >
                  Add New Book
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  component={Link} 
                  to="/admin/users/add" 
                  startIcon={<PeopleIcon />}
                  sx={{ mr: 2 }}
                >
                  Add New User
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="info" 
                  component={Link} 
                  to="/admin/reports" 
                  startIcon={<TrendingUpIcon />}
                >
                  Generate Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Tabbed Content */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Recent Transactions" />
              <Tab label="Recent Users" />
            </Tabs>
            <Divider />
            
            {/* Recent Transactions Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Transactions
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/admin/transactions" 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                  >
                    View All
                  </Button>
                </Box>
                
                {dashboardData.recentTransactions.length === 0 ? (
                  <Alert severity="info">No recent transactions found.</Alert>
                ) : (
                  dashboardData.recentTransactions.map((transaction, index) => (
                    <Paper 
                      key={transaction.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        bgcolor: index % 2 === 0 ? 'background.paper' : 'action.hover',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle1">
                            {transaction.type === 'BORROW' ? 'Borrowed: ' : 'Returned: '}
                            <Link to={`/admin/books/${transaction.id}`} style={{ textDecoration: 'none' }}>
                              <Typography component="span" color="primary" fontWeight="bold">
                                {transaction.bookTitle}
                              </Typography>
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2">
                            User: 
                            <Link to={`/admin/users/${transaction.id}`} style={{ textDecoration: 'none', marginLeft: 4 }}>
                              <Typography component="span" color="primary">
                                {transaction.username}
                              </Typography>
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
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

            {/* Recent Users Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recently Registered Users
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/admin/users" 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                  >
                    View All
                  </Button>
                </Box>
                
                {dashboardData.recentUsers.length === 0 ? (
                  <Alert severity="info">No recent users found.</Alert>
                ) : (
                  <Grid container spacing={3}>
                    {dashboardData.recentUsers.map((user) => (
                      <Grid item xs={12} sm={6} key={user.id}>
                        <Card sx={{ 
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 3
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              <Link to={`/admin/users/${user.id}`} style={{ textDecoration: 'none' }}>
                                {user.fullName}
                              </Link>
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                              @{user.username}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" gutterBottom>
                                Email: {user.email}
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                Registered: {user.registrationDate}
                              </Typography>
                              <Typography variant="body2">
                                Books Borrowed: <strong>{user.booksCount}</strong>
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 