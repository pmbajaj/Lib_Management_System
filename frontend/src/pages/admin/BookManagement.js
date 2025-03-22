import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, TextField, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Chip, InputAdornment, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress, Alert, Menu, MenuItem, Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real application, this would be an API call
        // const response = await axios.get('/api/admin/books');
        
        // Mock data for demonstration
        const mockBooks = Array(23).fill().map((_, idx) => ({
          id: idx + 1,
          title: ['To Kill a Mockingbird', '1984', 'The Great Gatsby', 'Pride and Prejudice', 'The Hobbit'][idx % 5],
          author: ['Harper Lee', 'George Orwell', 'F. Scott Fitzgerald', 'Jane Austen', 'J.R.R. Tolkien'][idx % 5],
          isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          publishYear: [1960, 1949, 1925, 1813, 1937][idx % 5],
          totalCopies: Math.floor(3 + Math.random() * 10),
          availableCopies: Math.floor(1 + Math.random() * 5),
          categories: [
            [{ name: 'Fiction' }, { name: 'Classic' }],
            [{ name: 'Fiction' }, { name: 'Dystopian' }],
            [{ name: 'Fiction' }, { name: 'Classic' }],
            [{ name: 'Fiction' }, { name: 'Romance' }],
            [{ name: 'Fiction' }, { name: 'Fantasy' }]
          ][idx % 5],
          addedDate: new Date(Date.now() - (idx * 10) * 24 * 60 * 60 * 1000).toLocaleDateString()
        }));
        
        setBooks(mockBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDeleteDialog = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
    setDeleteError('');
    setDeleteSuccess(false);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;
    
    setDeleteLoading(true);
    setDeleteError('');
    
    try {
      // In a real application, this would be an API call
      // await axios.delete(`/api/admin/books/${bookToDelete.id}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the books list
      setBooks(books.filter(book => book.id !== bookToDelete.id));
      setDeleteSuccess(true);
      
      // Close dialog after success message
      setTimeout(() => {
        closeDeleteDialog();
        setDeleteSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error deleting book:', err);
      setDeleteError('Failed to delete book. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMenuOpen = (event, bookId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookId(bookId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBookId(null);
  };

  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  // Get current page items
  const paginatedBooks = filteredBooks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Book Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/admin/books/add"
        >
          Add New Book
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            label="Search Books"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search by title, author, or ISBN..."
          />
          <Tooltip title="Filter options">
            <IconButton sx={{ ml: 1 }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredBooks.length === 0 ? (
          <Alert severity="info">
            No books found matching your search criteria.
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>ISBN</TableCell>
                    <TableCell>Publication Year</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell align="center">Available / Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBooks.map((book) => (
                    <TableRow key={book.id} hover>
                      <TableCell component="th" scope="row">
                        {book.title}
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>{book.publishYear}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {book.categories.map((category, idx) => (
                            <Chip 
                              key={idx} 
                              label={category.name} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${book.availableCopies} / ${book.totalCopies}`} 
                          color={book.availableCopies > 0 ? "success" : "error"} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              component={Link} 
                              to={`/books/${book.id}`}
                              size="small" 
                              color="info"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Book">
                            <IconButton 
                              component={Link} 
                              to={`/admin/books/edit/${book.id}`}
                              size="small" 
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Book">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => openDeleteDialog(book)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Actions">
                            <IconButton 
                              size="small"
                              onClick={(e) => handleMenuOpen(e, book.id)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredBooks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          {deleteSuccess ? (
            <Alert severity="success">
              Book deleted successfully!
            </Alert>
          ) : (
            <>
              {deleteError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {deleteError}
                </Alert>
              )}
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete "{bookToDelete?.title}" by {bookToDelete?.author}? 
                This action cannot be undone.
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeDeleteDialog} 
            disabled={deleteLoading || deleteSuccess}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            autoFocus
            disabled={deleteLoading || deleteSuccess}
            startIcon={deleteLoading && <CircularProgress size={20} />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* More Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          component={Link} 
          to={`/admin/books/inventory/${selectedBookId}`}
          onClick={handleMenuClose}
        >
          Manage Inventory
        </MenuItem>
        <MenuItem 
          component={Link} 
          to={`/admin/books/history/${selectedBookId}`}
          onClick={handleMenuClose}
        >
          View Loan History
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default BookManagement; 