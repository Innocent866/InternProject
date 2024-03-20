import express from 'express';
import cors from 'cors';
import connect from './database/mongodb.js';
import morgan from 'morgan';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5858;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', userRoutes);
app.use('/', authRoutes);

// Error Handling Middleware
app.use((req, res) => {
  res.status(404).json({ message: "That route doesn't exist" });
});

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is connected to http://localhost:${port}`);
    }).on('error', (error) => {
      console.log('Cannot connect to the server:', error);
    });

    process.on('SIGINT', () => {
      console.log('Server is shutting down...');
      process.exit(0);
    });
  })
  .catch((error) => {
    console.log('Invalid database connection:', error);
  });
