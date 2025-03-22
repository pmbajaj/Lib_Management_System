import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Paper, Button, Chip, Box,
  Divider, CircularProgress, Alert, Card, CardContent
} from '@mui/material';
import {
  Book as BookIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  LocalLibrary as LibraryIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [borrowError, setBorrowError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real app, this would be an axios call to the backend
        // const response = await axios.get(`/api/books/public/${id}`);
        
        // Simulate API response with mock data
        // Use the ID from params to simulate different books
        const mockBook = {
          id: parseInt(id),
          title: ['To Kill a Mockingbird', '1984', 'The Great Gatsby', 'Pride and Prejudice', 'The Hobbit'][parseInt(id) % 5],
          author: ['Harper Lee', 'George Orwell', 'F. Scott Fitzgerald', 'Jane Austen', 'J.R.R. Tolkien'][parseInt(id) % 5],
          publishYear: [1960, 1949, 1925, 1813, 1937][parseInt(id) % 5],
          isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          description: [
            'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
            'A dystopian novel set in Airstrip One, a province of the superstate Oceania in a world of perpetual war.',
            'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
            'The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage.',
            'The adventure of Bilbo Baggins as he journeys to the Lonely Mountain with a group of dwarves.'
          ][parseInt(id) % 5],
          publisher: ['Harper Collins', 'Penguin Books', 'Scribner', 'T. Egerton, Whitehall', 'George Allen & Unwin'][parseInt(id) % 5],
          availableCopies: parseInt(id) % 2 === 0 ? 3 : 0,
          totalCopies: 5,
          coverImageUrl: `https://source.unsplash.com/random/?book,${parseInt(id)}`,
          categories: [
            [{ name: 'Fiction' }, { name: 'Classic' }],
            [{ name: 'Fiction' }, { name: 'Dystopian' }],
            [{ name: 'Fiction' }, { name: 'Classic' }],
            [{ name: 'Fiction' }, { name: 'Romance' }],
            [{ name: 'Fiction' }, { name: 'Fantasy' }]
          ][parseInt(id) % 5]
        };
        
        setBook(mockBook);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to fetch book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // In a real app, this would be an axios call to the backend
      // const response = await axios.post('/api/transactions/borrow', { bookId: parseInt(id) });
      
      // Simulate API response
      if (book.availableCopies > 0) {
        setBorrowSuccess(true);
        setBorrowError('');
        // Update available copies in UI
        setBook(prev => ({
          ...prev,
          availableCopies: prev.availableCopies - 1
        }));
      } else {
        setBorrowError('This book is currently unavailable for borrowing.');
        setBorrowSuccess(false);
      }
    } catch (err) {
      console.error('Error borrowing book:', err);
      setBorrowError('Failed to borrow book. Please try again later.');
      setBorrowSuccess(false);
    }
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

  if (!book) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="warning">Book not found!</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Books
      </Button>

      {borrowSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Book borrowed successfully! You can find it in your borrowed books.
        </Alert>
      )}

      {borrowError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {borrowError}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={book.coverImageUrl || 'https://source.unsplash.com/random/?book'}
              alt={book.title}
              sx={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: 1,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>{book.title}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">
                {book.author}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body1">ISBN: {book.isbn}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body1">Published: {book.publishYear}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LibraryIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography 
                  variant="body1"
                  color={book.availableCopies > 0 ? 'success.main' : 'error.main'}
                >
                  {book.availableCopies} of {book.totalCopies} available
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CategoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body1">Categories:</Typography>
              </Box>
              <Box>
                {book.categories && book.categories.map((category, index) => (
                  <Chip 
                    key={index} 
                    label={category.name} 
                    sx={{ mr: 1, mb: 1 }} 
                    color="primary" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleBorrow}
              disabled={book.availableCopies === 0}
              sx={{ 
                mt: 2,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {book.availableCopies > 0 ? 'Borrow Now' : 'Currently Unavailable'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {book.description}
          </Typography>
          {book.publisher && (
            <Typography variant="body2" color="text.secondary">
              Publisher: {book.publisher}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookDetails; 