import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  Grid,
  Divider,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(new Date());

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      const newTask = {
        text: newTodo,
        date: selectedDate,
      };
      setTodos([...todos, newTask]);
      setNewTodo('');
      setSelectedDate(new Date());
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
    setEditDate(todos[index].date);
  };

  const handleSaveEdit = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = { ...updatedTodos[index], text: editText, date: editDate };
    setTodos(updatedTodos);
    setEditIndex(null);
    setEditText('');
  };

  const groupedTodos = todos.reduce((acc, todo) => {
    const date = format(new Date(todo.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {});

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: '20px',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#3f51b5' }}
          >
            My To-Do List
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                variant="outlined"
                label="Add a new task"
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddTodo}
            sx={{
              backgroundColor: '#3f51b5',
              ':hover': { backgroundColor: '#303f9f' },
              py: 1.5,
              fontWeight: 'bold',
              mt: 2,
            }}
          >
            Add Task
          </Button>
          <List sx={{ mt: 4 }}>
            {Object.keys(groupedTodos).map((date) => (
              <div key={date}>
                <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold', color: '#3f51b5' }}>
                  {format(new Date(date), 'MMMM dd, yyyy')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {groupedTodos[date].map((todo, index) => renderTodoItem(todo, index))}
              </div>
            ))}
          </List>
        </Paper>
      </Box>
    </LocalizationProvider>
  );

  function renderTodoItem(todo, index) {
    const taskIndex = todos.indexOf(todo);
    return (
      <ListItem
        key={taskIndex}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
          mb: 2,
          px: 2,
          py: 1,
        }}
      >
        {editIndex === taskIndex ? (
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                value={editDate}
                onChange={(newValue) => setEditDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
              <IconButton color="primary" onClick={() => handleSaveEdit(taskIndex)}>
                <SaveIcon />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <ListItemText primary={todo.text} secondary={format(new Date(todo.date), 'MMMM dd, yyyy')} />
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <IconButton color="primary" onClick={() => handleEditTodo(taskIndex)}>
                <EditIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleDeleteTodo(taskIndex)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </ListItem>
    );
  }
}

export default TodoApp;
