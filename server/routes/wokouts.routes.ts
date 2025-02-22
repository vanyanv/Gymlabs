import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const workouts = await prisma.workout.findMany();
  
  if (!workouts) {
    res.status(404).json({ error: 'No workouts found' });
  } else {
    console.log("Got workouts", workouts);
    res.status(200).json(workouts);
  }
});

router.post('/', (req: Request, res: Response) => {
  // TODO: Add workout
  res.json({ message: 'Create workout' });
});

export default router;