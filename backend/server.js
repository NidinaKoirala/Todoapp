const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // CORS middleware
const app = express();
const PORT = 5001; // Updated to port 5001

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// File path for tasks
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Function to ensure tasks.json file exists
function ensureTasksFileExists() {
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([], null, 2), 'utf8');
  }
}

// Get all tasks
app.get('/tasks', (req, res) => {
  ensureTasksFileExists();
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    res.json(JSON.parse(data));
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  ensureTasksFileExists();
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    const tasks = JSON.parse(data);
    tasks.push(newTask);
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.json(newTask);
    });
  });
});

// Update a task
app.put('/tasks/:index', (req, res) => {
  const updatedTask = req.body;
  const index = req.params.index;
  ensureTasksFileExists();
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    const tasks = JSON.parse(data);
    tasks[index] = updatedTask;
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.json(updatedTask);
    });
  });
});

// Delete a task
app.delete('/tasks/:index', (req, res) => {
  const index = req.params.index;
  ensureTasksFileExists();
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    const tasks = JSON.parse(data);
    tasks.splice(index, 1);
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.status(204).send();
    });
  });
});

// Ensure the file exists on server start
ensureTasksFileExists();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
