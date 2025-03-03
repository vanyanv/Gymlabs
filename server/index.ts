import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import workoutsRoutes from './routes/wokouts.routes';
import userRoutes from './routes/users.routes';
import exerciseNames from './routes/exerciseNames.routes';
import wgerApiService from './services/wgerApiService';

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
app.use('/api/exerciseNames', exerciseNames);
app.use('/api/workouts', workoutsRoutes);

// Initialize authentication when the server starts
const startServer = async () => {
  try {
    await wgerApiService.initializeAuthentication();
    console.log('Successfully authenticated with wger API');
  } catch (error) {
    console.error('Warning: Failed to authenticate with wger API:', error);
    // Continue anyway - the service will try to authenticate on each request
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();

export default app;
