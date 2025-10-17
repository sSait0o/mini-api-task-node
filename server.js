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

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(require('path').resolve(__dirname, 'public', 'index.html')));


app.get('/api', (req, res) => res.send('Todolist API is running'));

const PORT = process.env.PORT || 3000;

// connect to DBs (Postgres first, then Mongo) then start server
const db = require('./src/config/db');
const pg = require('./src/config/pg');

Promise.resolve()
  .then(() => pg.connect(process.env.POSTGRES_URL))
  .then((pgClient) => {
    if (pgClient) app.locals.pgClient = pgClient;
    return db.connect(process.env.MONGODB_URI);
  })
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log('Serveur démarré avec succès !');
      console.log(`Port: ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log('========================');
      try {
        if (app.locals.pgClient) {
          console.log('Postgres connecté avec succès !');
          console.log('========================');
        }
        if (db.mongoose && db.mongoose.connection && db.mongoose.connection.readyState === 1) {
          console.log('MongoDB connecté avec succès !');
          console.log(`Base de données: ${db.mongoose.connection.name || process.env.MONGODB_DB || 'todolist'}`);
          console.log('========================');
        }
      } catch (e) {
        // ignore
      }
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} already in use.`);
        process.exit(1);
      }
      throw err;
    });
  })
  .catch((err) => {
    console.error('Failed to start server because DB connection failed');
    console.error(err);
    process.exit(1);
  });