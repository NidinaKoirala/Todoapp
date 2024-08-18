import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Stack,
  Chip,
  Box,
  Tabs,
  Tab,
  Paper,
  Modal,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import NepaliDate from 'nepali-date';  // Import nepali-date

function TodoApp({ todos, onTaskAdded, onTaskUpdated, onTaskDeleted }) {
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [editTime, setEditTime] = useState(new Date());
  const [tab, setTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      const taskDateTime = new Date(selectedDate);
      taskDateTime.setHours(selectedTime.getHours());
      taskDateTime.setMinutes(selectedTime.getMinutes());

      const newTask = {
        text: newTodo,
        date: taskDateTime,
        status: taskDateTime > new Date() ? 'Pending' : 'Overdue',
      };

      onTaskAdded(newTask);
      setNewTodo('');
      setSelectedDate(new Date());
      setSelectedTime(new Date());
    }
  };

  const handleEditTodo = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
    setEditDate(new Date(todos[index].date));
    setEditTime(new Date(todos[index].date));
    setEditModalOpen(true); // Open the modal when Edit is clicked
  };

  const handleSaveEdit = () => {
    if (editText.trim() !== '') {
      const taskDateTime = new Date(editDate);
      taskDateTime.setHours(editTime.getHours());
      taskDateTime.setMinutes(editTime.getMinutes());

      const updatedTask = { ...todos[editIndex], text: editText, date: taskDateTime };
      onTaskUpdated(editIndex, updatedTask);
      setEditModalOpen(false); // Close the modal after saving
      setEditIndex(null); // Reset the editIndex
    }
  };

  const handleDeleteTodo = (index) => {
    onTaskDeleted(index);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false); // Close the modal without saving
    setEditIndex(null); // Reset the editIndex
  };

  const isOverdue = (date) => new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  const isPending = (date) => new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);

  const getFilteredTodos = () => {
    if (tab === 0) {
      return todos.filter((todo) => todo.status !== 'Done');
    }
    if (tab === 1) {
      return todos.filter((todo) => todo.status === 'Done');
    }
  };

  const getCardColor = (status) => {
    switch (status) {
      case 'Done':
        return '#d1e7dd'; // Green for done
      case 'Overdue':
        return '#f8d7da'; // Red for overdue
      case 'Pending':
        return '#fff3cd'; // Yellow for pending
      default:
        return '#fff';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f4f8', paddingTop: 5, paddingBottom: 5 }}>
        <Container maxWidth="lg">
          {/* Add a New Task Form */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Todo List
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
              <TextField
                variant="outlined"
                label="Add a new task"
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTodo}
                sx={{ px: 4, fontWeight: 'bold', alignSelf: 'center' }}
              >
                Add Task
              </Button>
            </Stack>
          </Paper>

          {/* Tabs for filtering tasks */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tab} onChange={handleTabChange} centered>
              <Tab label="Pending/Overdue" />
              <Tab label="Done" />
            </Tabs>
          </Box>

          {/* Task Cards */}
          <Grid container spacing={2}>
            {getFilteredTodos().map((todo, index) => {
              const nepaliDate = new NepaliDate(new Date(todo.date));
              const nepaliDateFormatted = nepaliDate.format('YYYY-MM-DD');

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}> {/* Adjust for responsive columns */}
                  <Card sx={{ backgroundColor: getCardColor(todo.status), boxShadow: 3 }}>
                    <CardContent sx={{ minHeight: 100 }}> {/* Adjusted minHeight */}
                      <Typography variant="body1" gutterBottom>
                        {todo.text}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {format(new Date(todo.date), 'MMMM dd, yyyy, hh:mm a')} ({nepaliDateFormatted})
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={
                            todo.status === 'Done'
                              ? 'Done'
                              : isOverdue(todo.date)
                              ? 'Overdue'
                              : 'Pending'
                          }
                          color={
                            todo.status === 'Done'
                              ? 'success'
                              : isOverdue(todo.date)
                              ? 'error'
                              : 'warning'
                          }
                          size="small" // Make chips smaller
                          sx={{ fontSize: '0.75rem' }} // Smaller text for status labels
                        />
                        {todo.status !== 'Done' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => onTaskUpdated(index, { ...todo, status: 'Done' })}
                            sx={{ fontSize: '0.75rem', padding: '4px 8px' }} // Smaller button
                          >
                            Done
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditTodo(index)}
                        sx={{ fontSize: '0.75rem' }} // Smaller icons
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteTodo(index)}
                        sx={{ fontSize: '0.75rem' }} // Smaller icons
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>

        {/* Edit Task Modal */}
        <Modal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          aria-labelledby="edit-task-modal"
          aria-describedby="edit-task-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 }, // Responsive width for modal
              maxHeight: '90vh', // Ensure the modal doesn't exceed the screen height
              overflowY: 'auto', // Allow scrolling if the content overflows
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="edit-task-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
              Edit Task
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Task Name"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              multiline // Enable multi-line input
              rows={3} // Set an initial number of rows
              sx={{ mb: 2, wordWrap: 'break-word' }} // Wrap long words and maintain responsiveness
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <DatePicker
                  label="Task Date"
                  value={editDate}
                  onChange={(newValue) => setEditDate(newValue)}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="Task Time"
                  value={editTime}
                  onChange={(newValue) => setEditTime(newValue)}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="space-between">
              <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCloseEditModal}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Modal>

      </Box>
    </LocalizationProvider>
  );
}

export default TodoApp;
