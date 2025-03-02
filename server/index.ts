import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import workoutsRoutes from './routes/wokouts.routes';
import userRoutes from './routes/users.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Basic test route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutsRoutes);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
