import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, TextField, InputAdornment, Box,
  Pagination, CircularProgress, Chip, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { Search as SearchIcon, Book as BookIcon } from '@mui/icons-material';
import axios from 'axios';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'title', 'author'
  
  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '';
      
      switch (filter) {
        case 'available':
          url = `/api/books/public/available?page=${page - 1}&size=8`;
          break;
        case 'search':
          if (search.trim() === '') {
            url = `/api/books/public/all?page=${page - 1}&size=8`;
          } else {
            url = `/api/books/public/search?query=${search}&page=${page - 1}&size=8`;
          }
          break;
        default:
          url = `/api/books/public/all?page=${page - 1}&size=8`;
      }
      
      // For demo purposes, simulate API response with mock data
      // In a real app, this would be an axios call to the backend
      // const response = await axios.get(url);
      
      // Simulate API response with mock data
      const mockData = {
        content: [
          {
            id: 1,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            publishYear: 1960,
            isbn: '978-0061120084',
            description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
            availableCopies: 5,
            totalCopies: 10,
            coverImageUrl: 'https://source.unsplash.com/random/?book,classic',
            categories: [{ name: 'Fiction' }, { name: 'Classic' }]
          },
          {
            id: 2,
            title: '1984',
            author: 'George Orwell',
            publishYear: 1949,
            isbn: '978-0451524935',
            description: 'A dystopian novel set in Airstrip One, a province of the superstate Oceania in a world of perpetual war.',
            availableCopies: 3,
            totalCopies: 7,
            coverImageUrl: 'https://source.unsplash.com/random/?book,dystopia',
            categories: [{ name: 'Fiction' }, { name: 'Dystopian' }]
          },
          {
            id: 3,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            publishYear: 1925,
            isbn: '978-0743273565',
            description: 'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
            availableCopies: 0,
            totalCopies: 5,
            coverImageUrl: 'https://source.unsplash.com/random/?book,gatsby',
            categories: [{ name: 'Fiction' }, { name: 'Classic' }]
          },
          {
            id: 4,
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            publishYear: 1813,
            isbn: '978-0141439518',
            description: 'The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage.',
            availableCopies: 2,
            totalCopies: 6,
            coverImageUrl: 'https://source.unsplash.com/random/?book,romance',
            categories: [{ name: 'Fiction' }, { name: 'Romance' }]
          },
          {
            id: 5,
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            publishYear: 1937,
            isbn: '978-0547928227',
            description: 'The adventure of Bilbo Baggins as he journeys to the Lonely Mountain with a group of dwarves.',
            availableCopies: 4,
            totalCopies: 8,
            coverImageUrl: 'https://source.unsplash.com/random/?book,fantasy',
            categories: [{ name: 'Fiction' }, { name: 'Fantasy' }]
          },
          {
            id: 6,
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            publishYear: 1951,
            isbn: '978-0316769488',
            description: 'The story of Holden Caulfield, a teenage boy who has been expelled from prep school and is wandering around New York City.',
            availableCopies: 1,
            totalCopies: 4,
            coverImageUrl: 'https://source.unsplash.com/random/?book,youth',
            categories: [{ name: 'Fiction' }, { name: 'Coming-of-Age' }]
          },
          {
            id: 7,
            title: 'Lord of the Flies',
            author: 'William Golding',
            publishYear: 1954,
            isbn: '978-0399501487',
            description: 'The story of a group of British boys stuck on an uninhabited island who try to govern themselves with disastrous results.',
            availableCopies: 0,
            totalCopies: 3,
            coverImageUrl: 'https://source.unsplash.com/random/?book,island',
            categories: [{ name: 'Fiction' }, { name: 'Dystopian' }]
          },
          {
            id: 8,
            title: 'Animal Farm',
            author: 'George Orwell',
            publishYear: 1945,
            isbn: '978-0451526342',
            description: 'A satire about a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy.',
            availableCopies: 3,
            totalCopies: 5,
            coverImageUrl: 'https://source.unsplash.com/random/?book,farm',
            categories: [{ name: 'Fiction' }, { name: 'Political' }]
          }
        ],
        totalPages: 3,
        totalElements: 24,
        size: 8,
        number: page - 1
      };
      
      // Filter by availability if needed
      if (filter === 'available') {
        mockData.content = mockData.content.filter(book => book.availableCopies > 0);
      }
      
      // Filter by search if needed
      if (filter === 'search' && search.trim() !== '') {
        const searchLower = search.toLowerCase();
        mockData.content = mockData.content.filter(book => 
          book.title.toLowerCase().includes(searchLower) || 
          book.author.toLowerCase().includes(searchLower) ||
          book.isbn.includes(searchLower) ||
          book.description.toLowerCase().includes(searchLower) ||
          book.categories.some(cat => cat.name.toLowerCase().includes(searchLower))
        );
      }
      
      setBooks(mockData.content);
      setTotalPages(mockData.totalPages);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setFilter('search');
    fetchBooks();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Book Catalog
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            label="Search Books"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ ml: 1 }}
                >
                  Search
                </Button>
              )
            }}
          />
        </Box>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filter}
            label="Filter By"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Books</MenuItem>
            <MenuItem value="available">Available Books</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
          {error}
        </Typography>
      ) : books.length === 0 ? (
        <Typography sx={{ mt: 4, textAlign: 'center' }}>
          No books found matching your criteria.
        </Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {books.map((book) => (
              <Grid item key={book.id} xs={12} sm={6} md={3}>
                <Card 
                  className="book-card"
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{ height: 200, backgroundSize: 'cover' }}
                    image={book.coverImageUrl || 'https://source.unsplash.com/random/?book'}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      by {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Published: {book.publishYear}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1 }}>
                      {book.categories.map((category, index) => (
                        <Chip 
                          key={index} 
                          label={category.name} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                        />
                      ))}
                    </Box>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: book.availableCopies > 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      <BookIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {book.availableCopies} / {book.totalCopies} available
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/books/${book.id}`}
                    >
                      Details
                    </Button>
                    <Button 
                      size="small"
                      color="primary"
                      disabled={book.availableCopies === 0}
                    >
                      Borrow
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default BookCatalog; 