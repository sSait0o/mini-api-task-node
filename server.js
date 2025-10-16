// server.js: configure and start the Express app
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const todoRoutes = require('./src/routes/todoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes (mount for compatibility)
app.use('/api/todos', todoRoutes);
app.use('/tasks', todoRoutes);

// Serve UI
app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(require('path').resolve(__dirname, 'public', 'index.html')));

// API root (optional)
app.get('/api', (req, res) => res.send('Todolist API is running'));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use.`);
    process.exit(1);
  }
  throw err;
});