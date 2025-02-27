import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { protect } from '../middleware/auth';
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  getWorkouts,
} from '../controllers/workout.controller';

const router = Router();

router.use(protect);

router.get('/', getWorkouts);

router.get('/:id', getWorkout);

router.post('/', createWorkout);

router.delete('/:id', deleteWorkout);

export default router;
