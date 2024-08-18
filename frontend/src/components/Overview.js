import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneIcon from '@mui/icons-material/Done';
import EventIcon from '@mui/icons-material/Event';
import { format } from 'date-fns';

const Overview = ({ todos }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if this is the first time the app is being loaded
    const hasLoadedBefore = localStorage.getItem('appLoaded');

    if (!hasLoadedBefore) {
      // If it's the first time, show the loading screen
      setLoading(true);

      // Set a timer for the loading animation duration
      const timer = setTimeout(() => {
        setLoading(false);
        // Set the flag in localStorage to avoid showing the loading screen again
        localStorage.setItem('appLoaded', 'true');
      }, 1500); // Adjust the duration as needed

      return () => clearTimeout(timer);
    }
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Gradient background
          animation: 'backgroundAnimation 5s infinite alternate', // Subtle background animation
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #1e88e5, #ff5722)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'textGradient 3s ease-in-out infinite',
          }}
        >
          Loading Nidina Todo App
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginTop: 2,
            color: '#555',
            opacity: 0.8,
            animation: 'fadeInText 3s infinite ease-in-out',
          }}
        >
          Please be patient...
        </Typography>

        {/* CSS for animations */}
        <style>{`
          @keyframes backgroundAnimation {
            0% { background: linear-gradient(135deg, #f5f7fa, #c3cfe2); }
            100% { background: linear-gradient(135deg, #c3cfe2, #f5f7fa); }
          }
          
          @keyframes textGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            50% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
          }
          
          @keyframes fadeInText {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>
      </Box>
    );
  }

  // Main content after loading is complete or skipped
  const pendingTasks = todos.filter((task) => task.status === 'Pending');
  const completedTasks = todos.filter((task) => task.status === 'Done');
  const upcomingTasks = todos.filter(
    (task) =>
      task.status === 'Pending' && new Date(task.date) > new Date()
  );

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#f5f5f5', // Subtle, light grey background
        minHeight: '100vh', // Ensure it takes the full height of the viewport
        borderRadius: '15px', // Rounded corners for the overall section
        animation: 'fadeInContent 0.5s ease-in-out', // Smooth fade-in effect for content
        '@keyframes fadeInContent': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1e88e5' }}>
        Overview
      </Typography>

      <Grid container spacing={4}>
        {/* Pending Tasks */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              backgroundColor: '#ffeb3b',
              borderRadius: '15px',
              color: '#000',
              textAlign: 'center',
              transition: 'transform 0.3s ease', // Add transform effect
              '&:hover': {
                transform: 'scale(1.05)', // Slight zoom effect on hover
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <PendingActionsIcon fontSize="large" />
              <Typography variant="h5">Pending Tasks</Typography>
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 2 }}>
              {pendingTasks.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Completed Tasks */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              backgroundColor: '#4caf50',
              borderRadius: '15px',
              color: '#fff',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <DoneIcon fontSize="large" />
              <Typography variant="h5">Completed Tasks</Typography>
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 2 }}>
              {completedTasks.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              backgroundColor: '#1e88e5',
              borderRadius: '15px',
              color: '#fff',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <EventIcon fontSize="large" />
              <Typography variant="h5">Upcoming Tasks</Typography>
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 2 }}>
              {upcomingTasks.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: '15px' }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ff5722' }}>
              Recent Tasks
            </Typography>
            <List>
              {todos.slice(0, 5).map((task) => (
                <ListItem key={task.id}>
                  <ListItemText
                    primary={task.text}
                    secondary={format(new Date(task.date), 'MMMM dd, yyyy, hh:mm a')}
                    primaryTypographyProps={{
                      sx: {
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: '15px' }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1e88e5' }}>
              Upcoming Tasks
            </Typography>
            <List>
              {upcomingTasks.slice(0, 5).map((task) => (
                <ListItem key={task.id}>
                  <ListItemText
                    primary={task.text}
                    secondary={format(new Date(task.date), 'MMMM dd, yyyy, hh:mm a')}
                    primaryTypographyProps={{
                      sx: {
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
