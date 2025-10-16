const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
// API routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/tasks', taskRoutes);

// Serve static UI
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Todolist API is running');
});

// Optional UI route (index.html in public)
app.get('/ui', (req, res) => {
  res.sendFile(require('path').join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;