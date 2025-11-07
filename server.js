
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import todoRoutes from './src/routes/todoRoutes.js';
import * as db from './src/config/db.js';
import * as pg from './src/config/pg.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/swaggerDoc.js';
import authRoutes from './src/routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRoutes);
app.use('/tasks', todoRoutes);

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'public', 'index.html')));

app.get('/api', (req, res) => res.send('Todolist API is running'));

const PORT = process.env.PORT || 3000;

// Serve API docs (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);

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
      } catch (e) {}
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