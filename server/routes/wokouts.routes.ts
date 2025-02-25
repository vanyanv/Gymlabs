import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', async (req: Request, res: Response) => {
  const workouts = await prisma.workout.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  if (!workouts) {
    res.status(404).json({ error: 'No workouts found' });
  } else {
    console.log('Got workouts', workouts);
    res.status(200).json(workouts);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const workouts = await prisma.workout.findMany({
    where: {
      id: Number(id),
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  if (!workouts) {
    res.status(404).json({ error: 'No workouts found' });
  } else {
    console.log('Got workouts', workouts);
    res.status(200).json(workouts);
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const result = await prisma.workout.create({
    data: {
      title,
      description,
      user: {
        connect: { id: req.user.id },
      },
    },
  });

  res.status(201).json(result);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await prisma.workout.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(200).json(result);
});

export default router;
