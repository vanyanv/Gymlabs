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

router.get('/:id', async (req: Request, res: Response) => {
  const {id} = req.params;
  const workouts = await prisma.workout.findMany({
    where: { 
      id: Number(id)
    }
  });
  
  if (!workouts) {
    res.status(404).json({ error: 'No workouts found' });
  } else {
    console.log("Got workouts", workouts);
    res.status(200).json(workouts);
  }
});

router.post("/", async(req: Request, res: Response) => {
  const {title, description, userId} = req.body;

  const result = await prisma.workout.create({
    data: {
      title,
      description,
      userId: Number(userId)
    }
  });
  
  res.status(201).json(result);
});

router.delete("/:id", async(req: Request, res: Response) => {
  const {id} = req.params;

  const result = await prisma.workout.delete({
    where: {
      id: Number(id)
    }
  });
  
  res.status(200).json(result);
});

export default router;