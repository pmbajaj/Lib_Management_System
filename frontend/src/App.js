import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

// Layout components
import Layout from './components/layout/Layout';

// Authentication pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLogin from './pages/auth/AdminLogin';

// Public pages
import Home from './pages/Home';
import BookCatalog from './pages/BookCatalog';
import BookDetails from './pages/BookDetails';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BookManagement from './pages/admin/BookManagement';
import AddBook from './pages/admin/AddBook';
import AddUser from './pages/admin/AddUser';
import Reports from './pages/admin/Reports';

// User pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyBorrowedBooks from './pages/MyBorrowedBooks';
import Transactions from './pages/Transactions';
import Notifications from './pages/Notifications';

// Routes protection
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoute';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
      light: '#3e5771',
      dark: '#1a252f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e74c3c',
      light: '#ff7961',
      dark: '#ba000d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f7',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="books" element={<BookCatalog />} />
              <Route path="books/:id" element={<BookDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="admin-login" element={<AdminLogin />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="borrowed" element={<MyBorrowedBooks />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin">
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="books">
                    <Route index element={<BookManagement />} />
                    <Route path="add" element={<AddBook />} />
                    <Route path="edit/:id" element={<div>Edit Book Page (Coming Soon)</div>} />
                    <Route path="inventory/:id" element={<div>Book Inventory Management (Coming Soon)</div>} />
                    <Route path="history/:id" element={<div>Book Loan History (Coming Soon)</div>} />
                  </Route>
                  <Route path="users">
                    <Route index element={<div>User Management (Coming Soon)</div>} />
                    <Route path="add" element={<AddUser />} />
                    <Route path=":id" element={<div>User Details (Coming Soon)</div>} />
                  </Route>
                  <Route path="transactions">
                    <Route index element={<div>Transactions Management (Coming Soon)</div>} />
                    <Route path="pending" element={<div>Pending Returns (Coming Soon)</div>} />
                  </Route>
                  <Route path="reports" element={<Reports />} />
                </Route>
              </Route>
            
              {/* Not Found Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 