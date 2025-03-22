import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Box, Grid, Paper, Divider, Chip, 
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  TablePagination, CircularProgress, Button, Alert, TextField, MenuItem
} from '@mui/material';
import {
  History as HistoryIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Define status colors for visual representation
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'borrowed':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      case 'renewed':
        return 'info';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/transactions/user?page=${page}&limit=${rowsPerPage}&status=${statusFilter}&search=${searchQuery}`);
        
        // Mock data for demonstration
        const mockTransactions = [
          {
            id: 1,
            bookId: 1,
            bookTitle: 'To Kill a Mockingbird',
            bookCoverUrl: 'https://source.unsplash.com/random/?book,1',
            transactionDate: '2023-10-15T08:30:00',
            dueDate: '2023-11-15T08:30:00',
            returnDate: null,
            status: 'Borrowed',
            fineAmount: 0,
            renewalCount: 0
          },
          {
            id: 2,
            bookId: 2,
            bookTitle: '1984',
            bookCoverUrl: 'https://source.unsplash.com/random/?book,2',
            transactionDate: '2023-09-10T14:15:00',
            dueDate: '2023-10-10T14:15:00',
            returnDate: '2023-10-09T11:20:00',
            status: 'Returned',
            fineAmount: 0,
            renewalCount: 1
          },
          {
            id: 3,
            bookId: 3,
            bookTitle: 'The Great Gatsby',
            bookCoverUrl: 'https://source.unsplash.com/random/?book,3',
            transactionDate: '2023-08-05T10:45:00',
            dueDate: '2023-09-05T10:45:00',
            returnDate: null,
            status: 'Overdue',
            fineAmount: 5.50,
            renewalCount: 0
          },
          {
            id: 4,
            bookId: 4,
            bookTitle: 'Pride and Prejudice',
            bookCoverUrl: 'https://source.unsplash.com/random/?book,4',
            transactionDate: '2023-09-25T16:20:00',
            dueDate: '2023-10-25T16:20:00',
            returnDate: null,
            status: 'Renewed',
            fineAmount: 0,
            renewalCount: 1
          },
          {
            id: 5,
            bookId: 5,
            bookTitle: 'The Hobbit',
            bookCoverUrl: 'https://source.unsplash.com/random/?book,5',
            transactionDate: '2023-10-01T09:00:00',
            dueDate: '2023-11-01T09:00:00',
            returnDate: null,
            status: 'Borrowed',
            fineAmount: 0,
            renewalCount: 0
          }
        ];

        // Filter by status if needed
        let filteredTransactions = [...mockTransactions];
        if (statusFilter !== 'all') {
          filteredTransactions = mockTransactions.filter(
            transaction => transaction.status.toLowerCase() === statusFilter.toLowerCase()
          );
        }

        // Filter by search query if provided
        if (searchQuery) {
          filteredTransactions = filteredTransactions.filter(
            transaction => transaction.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setTransactions(filteredTransactions);
        setTotalTransactions(filteredTransactions.length);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, rowsPerPage, statusFilter, searchQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // The search will be triggered by the useEffect
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const viewBookDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
          <HistoryIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h4" component="h1">
            Transaction History
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex' }}>
            <TextField
              size="small"
              placeholder="Search by book title"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: <SearchIcon color="action" />
              }}
            />
          </Box>
          
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
            InputProps={{
              startAdornment: <FilterIcon fontSize="small" sx={{ mr: 1 }} />
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Transactions</MenuItem>
            <MenuItem value="borrowed">Borrowed</MenuItem>
            <MenuItem value="returned">Returned</MenuItem>
            <MenuItem value="renewed">Renewed</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </TextField>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No transaction records found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try changing your search criteria or filter'
                : 'Borrow some books to see your transaction history'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/books')}
            >
              Browse Books
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
              <Table stickyHeader aria-label="transaction history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Book</TableCell>
                    <TableCell>Borrowed On</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Return Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Fine</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow hover key={transaction.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={transaction.bookCoverUrl}
                            alt={transaction.bookTitle}
                            sx={{ width: 40, height: 60, mr: 2, borderRadius: 1 }}
                          />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {transaction.bookTitle}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                      <TableCell>{formatDate(transaction.dueDate)}</TableCell>
                      <TableCell>{formatDate(transaction.returnDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.status} 
                          color={getStatusColor(transaction.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {transaction.fineAmount > 0 
                          ? <Typography color="error">${transaction.fineAmount.toFixed(2)}</Typography>
                          : '$0.00'
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => viewBookDetails(transaction.bookId)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalTransactions}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Transactions; 