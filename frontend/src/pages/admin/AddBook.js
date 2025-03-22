import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, TextField, Button, Paper,
  FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput,
  Alert, CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Sample categories - in a real app, these would be fetched from API
const categories = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance',
  'Fantasy', 'Thriller', 'Biography', 'History', 'Self-Help',
  'Children', 'Young Adult', 'Poetry', 'Science', 'Technology',
  'Business', 'Philosophy', 'Religion', 'Travel', 'Art'
];

const AddBook = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishYear: '',
    publisher: '',
    description: '',
    totalCopies: 1,
    coverImageUrl: '',
    selectedCategories: []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    
    setFormData((prev) => ({
      ...prev,
      selectedCategories: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.publishYear.trim()) {
      newErrors.publishYear = 'Publication year is required';
    } else if (!/^\d{4}$/.test(formData.publishYear)) {
      newErrors.publishYear = 'Publication year should be a 4-digit number';
    }
    
    if (!formData.totalCopies || formData.totalCopies < 1) {
      newErrors.totalCopies = 'At least 1 copy is required';
    }
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitSuccess(false);
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real application, this would be an API call
      // await axios.post('/api/admin/books', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publishYear: '',
        publisher: '',
        description: '',
        totalCopies: 1,
        coverImageUrl: '',
        selectedCategories: []
      });
      
      // Redirect to books management page after a delay
      setTimeout(() => {
        navigate('/admin/books');
      }, 2000);
    } catch (error) {
      console.error('Error adding book:', error);
      setSubmitError('Failed to add book. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4">Add New Book</Typography>
        </Box>
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 4 }}>
            Book added successfully! Redirecting to book management...
          </Alert>
        )}
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {submitError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                error={!!errors.author}
                helperText={errors.author}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                error={!!errors.isbn}
                helperText={errors.isbn}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Publication Year"
                name="publishYear"
                value={formData.publishYear}
                onChange={handleChange}
                error={!!errors.publishYear}
                helperText={errors.publishYear}
                required
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Copies"
                name="totalCopies"
                type="number"
                value={formData.totalCopies}
                onChange={handleChange}
                error={!!errors.totalCopies}
                helperText={errors.totalCopies}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cover Image URL"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="categories-label">Categories</InputLabel>
                <Select
                  labelId="categories-label"
                  multiple
                  value={formData.selectedCategories}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                      style={{
                        fontWeight:
                          formData.selectedCategories.indexOf(category) === -1
                            ? theme.typography.fontWeightRegular
                            : theme.typography.fontWeightBold,
                      }}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            
            {formData.coverImageUrl && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Cover Preview:
                </Typography>
                <Box
                  component="img"
                  src={formData.coverImageUrl}
                  alt="Book cover preview"
                  sx={{
                    width: 150,
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                    boxShadow: 2,
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x200?text=Invalid+URL';
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Book'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddBook; 