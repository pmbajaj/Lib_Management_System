import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Box, Grid, Paper, Button, Chip, Avatar,
  Card, CardContent, CardActions, CardMedia, CircularProgress, Alert,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField
} from '@mui/material';
import {
  Book as BookIcon,
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  EventNote as EventNoteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const MyBorrowedBooks = () => {
  const { user } = useContext(AuthContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [renewReason, setRenewReason] = useState('');
  const [renewLoading, setRenewLoading] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockBooks = [
        {
          id: 1,
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          coverImage: 'https://source.unsplash.com/random/500x700/?book,classic',
          borrowDate: '2023-04-15',
          dueDate: '2023-05-15',
          status: 'BORROWED',
          renewals: 0,
          maxRenewals: 2
        },
        {
          id: 2,
          title: '1984',
          author: 'George Orwell',
          coverImage: 'https://source.unsplash.com/random/500x700/?book,dystopian',
          borrowDate: '2023-04-20',
          dueDate: '2023-05-20',
          status: 'BORROWED',
          renewals: 1,
          maxRenewals: 2
        },
        {
          id: 3,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          coverImage: 'https://source.unsplash.com/random/500x700/?book,gatsby',
          borrowDate: '2023-03-15',
          dueDate: '2023-04-01',
          status: 'OVERDUE',
          renewals: 2,
          maxRenewals: 2
        }
      ];
      
      setBorrowedBooks(mockBooks);
    } catch (err) {
      console.error('Error fetching borrowed books:', err);
      setError('Failed to load borrowed books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRenewClick = (book) => {
    setSelectedBook(book);
    setRenewReason('');
    setRenewDialogOpen(true);
  };

  const handleRenewSubmit = async () => {
    if (!selectedBook) return;
    
    setRenewLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedBooks = borrowedBooks.map(book => {
        if (book.id === selectedBook.id) {
          // Add 30 days to due date
          const dueDate = new Date(book.dueDate);
          dueDate.setDate(dueDate.getDate() + 30);
          
          return {
            ...book,
            dueDate: dueDate.toISOString().split('T')[0],
            renewals: book.renewals + 1,
            status: 'BORROWED'
          };
        }
        return book;
      });
      
      setBorrowedBooks(updatedBooks);
      setRenewDialogOpen(false);
      setRenewReason('');
    } catch (err) {
      console.error('Error renewing book:', err);
      setError('Failed to renew book. Please try again later.');
    } finally {
      setRenewLoading(false);
    }
  };

  const handleReturnClick = (book) => {
    setSelectedBook(book);
    setReturnDialogOpen(true);
  };

  const handleReturnSubmit = async () => {
    if (!selectedBook) return;
    
    setReturnLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from list
      const updatedBooks = borrowedBooks.filter(book => book.id !== selectedBook.id);
      setBorrowedBooks(updatedBooks);
      setReturnDialogOpen(false);
    } catch (err) {
      console.error('Error returning book:', err);
      setError('Failed to process return. Please try again later.');
    } finally {
      setReturnLoading(false);
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderDueStatus = (book) => {
    const daysRemaining = getDaysRemaining(book.dueDate);
    
    if (book.status === 'OVERDUE') {
      return (
        <Chip
          icon={<WarningIcon />}
          label={`Overdue by ${Math.abs(daysRemaining)} days`}
          color="error"
          size="small"
        />
      );
    } else if (daysRemaining <= 5) {
      return (
        <Chip
          icon={<EventNoteIcon />}
          label={`Due in ${daysRemaining} days`}
          color="warning"
          size="small"
        />
      );
    } else {
      return (
        <Chip
          icon={<EventNoteIcon />}
          label={`Due in ${daysRemaining} days`}
          color="primary"
          size="small"
        />
      );
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning">Please login to view your borrowed books.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          component={Link}
          to="/dashboard"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1">
          My Borrowed Books
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : borrowedBooks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            You don't have any borrowed books
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Visit our catalog to find your next great read!
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/books"
          >
            Browse Books
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {borrowedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  sx={{ height: 200, objectFit: 'cover' }}
                  image={book.coverImage}
                  alt={book.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  
                  <Box sx={{ mt: 2, mb: 1 }}>
                    {renderDueStatus(book)}
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Borrowed on:</strong> {new Date(book.borrowDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Due date:</strong> {new Date(book.dueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Renewals:</strong> {book.renewals}/{book.maxRenewals}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleReturnClick(book)}
                  >
                    Return Book
                  </Button>
                  <Button
                    size="small"
                    disabled={book.renewals >= book.maxRenewals}
                    onClick={() => handleRenewClick(book)}
                  >
                    Renew
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Renew Dialog */}
      <Dialog open={renewDialogOpen} onClose={() => setRenewDialogOpen(false)}>
        <DialogTitle>Renew Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to renew "{selectedBook?.title}"? 
            This will extend the due date by 30 days.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason for renewal (optional)"
            fullWidth
            multiline
            rows={3}
            value={renewReason}
            onChange={(e) => setRenewReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRenewDialogOpen(false)} 
            disabled={renewLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRenewSubmit} 
            variant="contained"
            disabled={renewLoading}
          >
            {renewLoading ? 'Processing...' : 'Confirm Renewal'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Return Dialog */}
      <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
        <DialogTitle>Return Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to return "{selectedBook?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setReturnDialogOpen(false)} 
            disabled={returnLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReturnSubmit} 
            variant="contained"
            color="primary"
            disabled={returnLoading}
          >
            {returnLoading ? 'Processing...' : 'Confirm Return'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBorrowedBooks; 