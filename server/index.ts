import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import workoutsRoutes from './routes/wokouts.routes';
import prisma from './lib/prisma';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

// Test Prisma connectio
 app.get("/test", async (req: Request, res: Response) => {
   // Try to create a test record
   const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User'
    }
  });

  // Try to read it back
  const users = await prisma.user.findMany();

  res.json({ 
    message: 'Database connection successful',
    testUser,
    totalUsers: users.length 
  });
  
 });
// Routes
app.use('/workouts', workoutsRoutes);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});