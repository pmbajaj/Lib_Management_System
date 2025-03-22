import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  Today as TodayIcon,
  TrendingUp as TrendingUpIcon,
  Book as BookIcon,
  Person as PersonIcon,
  LocalLibrary as LibraryIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import AuthContext from '../../context/AuthContext';

// Mock data for demonstration purposes
const generateMockData = () => {
  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Monthly statistics for the past 12 months
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    return {
      name: `${month} ${year}`,
      borrowings: Math.floor(Math.random() * 100) + 20,
      returns: Math.floor(Math.random() * 80) + 15,
      newUsers: Math.floor(Math.random() * 30) + 5,
      newBooks: Math.floor(Math.random() * 20) + 3
    };
  });
  
  // Book genre distribution
  const genreData = [
    { name: 'Fiction', value: 42 },
    { name: 'Science', value: 28 },
    { name: 'History', value: 15 },
    { name: 'Biography', value: 10 },
    { name: 'Philosophy', value: 5 }
  ];
  
  // User demographic data
  const userDemographicData = [
    { name: 'Students', value: 65 },
    { name: 'Faculty', value: 15 },
    { name: 'Staff', value: 10 },
    { name: 'Community', value: 10 }
  ];
  
  // Top borrowed books
  const topBorrowedBooks = [
    { name: 'To Kill a Mockingbird', value: 42 },
    { name: '1984', value: 38 },
    { name: 'The Great Gatsby', value: 34 },
    { name: 'Pride and Prejudice', value: 29 },
    { name: 'The Hobbit', value: 25 }
  ];
  
  // Weekly borrowings data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const day = date.toLocaleString('default', { weekday: 'short' });
    
    return {
      name: day,
      borrowings: Math.floor(Math.random() * 15) + 2,
      returns: Math.floor(Math.random() * 10) + 1
    };
  });
  
  // Summary statistics
  const summaryData = {
    totalBooks: 2458,
    availableBooks: 1872,
    totalUsers: 843,
    activeUsers: 421,
    overdueBooks: 37,
    totalBorrowings: 12547
  };
  
  return {
    monthlyData,
    genreData,
    userDemographicData,
    topBorrowedBooks,
    weeklyData,
    summaryData,
    COLORS
  };
};

const Reports = () => {
  const { isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState('year');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchReportData();
  }, [dateRange]);
  
  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would be an API call with dateRange as a parameter
      // const response = await axios.get(`/api/admin/reports?range=${dateRange}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use mock data for demonstration
      const mockData = generateMockData();
      setData(mockData);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleExportData = () => {
    // In a real app, this would generate and download a report
    alert('Report export functionality would be implemented here.');
  };
  
  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You don't have permission to access this page. This page is only accessible to administrators.
        </Alert>
      </Container>
    );
  }
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchReportData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <AssessmentIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Library Analytics
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="date-range-select-label">Time Period</InputLabel>
            <Select
              labelId="date-range-select-label"
              id="date-range-select"
              value={dateRange}
              label="Time Period"
              onChange={handleDateRangeChange}
              size="small"
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchReportData} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Export
          </Button>
        </Box>
      </Box>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        aria-label="report tabs"
      >
        <Tab icon={<TrendingUpIcon />} label="Overview" />
        <Tab icon={<TimelineIcon />} label="Activity" />
        <Tab icon={<PieChartIcon />} label="Categories" />
        <Tab icon={<BarChartIcon />} label="Top Items" />
      </Tabs>
      
      {/* Summary Cards */}
      {tabValue === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                      Books
                    </Typography>
                    <BookIcon />
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mt: 2, mb: 1 }}>
                    {data.summaryData.totalBooks.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    {data.summaryData.availableBooks.toLocaleString()} available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                      Users
                    </Typography>
                    <PersonIcon />
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mt: 2, mb: 1 }}>
                    {data.summaryData.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    {data.summaryData.activeUsers.toLocaleString()} active this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                      Borrowings
                    </Typography>
                    <LibraryIcon />
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mt: 2, mb: 1 }}>
                    {data.summaryData.totalBorrowings.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    {data.summaryData.overdueBooks.toLocaleString()} overdue books
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Activity Overview
            </Typography>
            <Box sx={{ height: 350, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="borrowings" stackId="1" stroke="#8884d8" fill="#8884d8" name="Borrowings" />
                  <Area type="monotone" dataKey="returns" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Returns" />
                  <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#ffc658" fill="#ffc658" name="New Users" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Book Genre Distribution
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={data.COLORS[index % data.COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  User Demographics
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.userDemographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.userDemographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={data.COLORS[index % data.COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
      
      {/* Activity Tab */}
      {tabValue === 1 && (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Daily Activity (Last Week)
            </Typography>
            <Box sx={{ height: 350, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.weeklyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="borrowings" fill="#8884d8" name="Borrowings" />
                  <Bar dataKey="returns" fill="#82ca9d" name="Returns" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Trends
            </Typography>
            <Box sx={{ height: 350, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="borrowings" stroke="#8884d8" activeDot={{ r: 8 }} name="Borrowings" />
                  <Line type="monotone" dataKey="returns" stroke="#82ca9d" name="Returns" />
                  <Line type="monotone" dataKey="newUsers" stroke="#ffc658" name="New Users" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </>
      )}
      
      {/* Categories Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Book Genre Distribution
              </Typography>
              <Box sx={{ height: 350, mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.genreData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {data.genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={data.COLORS[index % data.COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Demographics
              </Typography>
              <Box sx={{ height: 350, mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.userDemographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {data.userDemographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={data.COLORS[index % data.COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Top Items Tab */}
      {tabValue === 3 && (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Top Borrowed Books
            </Typography>
            <Box sx={{ height: 350, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topBorrowedBooks}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Borrow Count">
                    {data.topBorrowedBooks.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={data.COLORS[index % data.COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly New Books & Users
            </Typography>
            <Box sx={{ height: 350, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="newBooks" fill="#8884d8" name="New Books" />
                  <Bar dataKey="newUsers" fill="#82ca9d" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Reports; 