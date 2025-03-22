import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, Divider, Box,
  Container, CssBaseline, Menu, MenuItem, Avatar, ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Book as BookIcon,
  Dashboard as DashboardIcon,
  LibraryBooks as LibraryBooksIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';

const Layout = () => {
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Book Catalog', icon: <BookIcon />, path: '/books' },
  ];

  const authenticatedMenuItems = [
    { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const adminMenuItems = [
    { text: 'Admin Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Manage Books', icon: <BookIcon />, path: '/admin/books' },
    { text: 'Manage Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Transaction History', icon: <AssignmentIcon />, path: '/admin/transactions' },
  ];

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div">
          Library Management
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      {/* Show these items when user is authenticated */}
      {isAuthenticated ? (
        <>
          <List>
            {authenticatedMenuItems.map((item) => (
              <ListItem disablePadding key={item.text}>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            {/* Only show Dashboard and My Borrowed Books for non-admin users */}
            {!isAdmin && (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/dashboard">
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/borrowed">
                    <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
                    <ListItemText primary="My Borrowed Books" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin/dashboard">
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      ) : (
        // Items that show for unauthenticated users
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/register">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin-login">
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Portal" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            Library Management System
          </Typography>
          
          {isAuthenticated ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Hello, {user?.firstName || user?.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>
      
      <Container sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout; 