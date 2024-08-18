import React, { useState } from 'react';
import { List, ListItem, Typography, Drawer, Divider, IconButton } from '@mui/material';
import { Home, ListAlt, CalendarToday, Menu } from '@mui/icons-material';

const Sidebar = ({ onViewChange }) => {
  const [activeView, setActiveView] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleViewChange = (view) => {
    setActiveView(view);
    onViewChange(view);
    setMobileOpen(false); // Close the drawer on mobile after a selection
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <div>
      <List>
        <ListItem
          button
          onClick={() => handleViewChange('overview')}
          sx={{
            backgroundColor: activeView === 'overview' ? '#e3f2fd' : 'transparent',
            mb: 2,
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: '#e8f5fe',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Home
            sx={{ mr: 2, color: activeView === 'overview' ? '#1e88e5' : '#9e9e9e' }}
          />
          <Typography sx={{ fontWeight: 600, color: activeView === 'overview' ? '#1e88e5' : '#555' }}>
            Overview
          </Typography>
        </ListItem>

        <ListItem
          button
          onClick={() => handleViewChange('todoList')}
          sx={{
            backgroundColor: activeView === 'todoList' ? '#fff3e0' : 'transparent',
            mb: 2,
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: '#fff8e1',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <ListAlt
            sx={{ mr: 2, color: activeView === 'todoList' ? '#ff7043' : '#9e9e9e' }}
          />
          <Typography sx={{ fontWeight: 600, color: activeView === 'todoList' ? '#ff7043' : '#555' }}>
            Todo List
          </Typography>
        </ListItem>

        <ListItem
          button
          onClick={() => handleViewChange('calendar')}
          sx={{
            backgroundColor: activeView === 'calendar' ? '#e8f5e9' : 'transparent',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: '#edf7ee',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <CalendarToday
            sx={{ mr: 2, color: activeView === 'calendar' ? '#66bb6a' : '#9e9e9e' }}
          />
          <Typography sx={{ fontWeight: 600, color: activeView === 'calendar' ? '#66bb6a' : '#555' }}>
            Calendar
          </Typography>
        </ListItem>
      </List>

      <Divider sx={{ mb: 2 }} />
      <Typography
        sx={{
          fontSize: '12px',
          color: '#9e9e9e',
          textAlign: 'center',
        }}
      >
        © 2024 Nidina Todo App
      </Typography>
    </div>
  );

  return (
    <>
      {/* Hamburger menu button for small screens */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', top: '10px', left: '10px', zIndex: 1200 }}
      >
        <Menu />
      </IconButton>

      {/* Permanent drawer for larger screens */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: { sm: 240 },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#fafafa',
            color: '#333',
            borderRight: 'none',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Temporary drawer for mobile screens */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: '80%',
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
