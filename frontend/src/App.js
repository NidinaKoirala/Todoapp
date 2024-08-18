import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './components/Sidebar';
import TodoCalendar from './components/TodoCalendar';
import TodoApp from './components/TodoApp';
import Overview from './components/Overview'; // Import Overview

function App() {
  const [view, setView] = useState('overview');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5001/tasks')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const handleTaskAdded = (newTask) => {
    axios.post('http://localhost:5001/tasks', newTask)
      .then(response => {
        setTodos([...todos, response.data]);
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const handleTaskUpdated = (index, updatedTask) => {
    axios.put(`http://localhost:5001/tasks/${index}`, updatedTask)
      .then(response => {
        const updatedTodos = [...todos];
        updatedTodos[index] = response.data;
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const handleTaskDeleted = (index) => {
    axios.delete(`http://localhost:5001/tasks/${index}`)
      .then(() => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const renderView = () => {
    switch (view) {
      case 'todoList':
        return <TodoApp todos={todos} onTaskAdded={handleTaskAdded} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />;
      case 'calendar':
        return <TodoCalendar todos={todos} onTaskAdded={handleTaskAdded} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />; // Pass handleTaskAdded to TodoCalendar
      case 'overview':
        return <Overview todos={todos} />; // Render Overview with todos data
      default:
        return <div>Overview - Choose an option from the sidebar.</div>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar onViewChange={setView} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderView()}
      </Box>
    </Box>
  );
}

export default App;
