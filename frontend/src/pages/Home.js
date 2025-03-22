import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, Button, Grid, Card, CardMedia,
  CardContent, Container, Paper
} from '@mui/material';
import { LibraryBooks, Search, Person, MenuBook } from '@mui/icons-material';

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Paper 
        sx={{
          position: 'relative',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://source.unsplash.com/random/?library,books)`,
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
            sx={{ animation: 'fadeIn 2s' }}
          >
            Library Management System
          </Typography>
          <Typography variant="h5" color="inherit" paragraph sx={{ mb: 4 }}>
            Discover a world of knowledge with our comprehensive collection of books.
            Borrow, read, and expand your horizons with just a few clicks.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/books"
            sx={{ 
              mr: 2,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            Browse Books
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            to="/register"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              transition: 'transform 0.3s',
              '&:hover': {
                borderColor: 'white',
                transform: 'scale(1.05)'
              }
            }}
          >
            Join Now
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              className="feature-card"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                } 
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Search color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Search & Find
                </Typography>
                <Typography>
                  Easily search and filter our extensive library of books by title, author, category, and availability.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              className="feature-card"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                } 
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <MenuBook color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Borrow & Return
                </Typography>
                <Typography>
                  Borrow books with just a few clicks and manage your returns with our intuitive interface.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              className="feature-card"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                } 
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Person color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="h2">
                  User Profiles
                </Typography>
                <Typography>
                  Manage your personal information and track your borrowing history with your own user profile.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              className="feature-card"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                } 
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <LibraryBooks color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Admin Dashboard
                </Typography>
                <Typography>
                  Comprehensive admin tools for library management, including book and user administration.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="sm">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            About Our Library
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" paragraph>
            Our Library Management System is designed to provide a seamless experience for book lovers.
            With our advanced features, you can easily find, borrow, and return books without hassle.
            Join our community today and embark on a journey of knowledge and discovery!
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/register"
              sx={{ 
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              Register Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 