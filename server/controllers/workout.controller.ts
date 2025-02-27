import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { error } from 'console';

export const getWorkouts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
  } catch (error) {
    console.log('Error in Get Workouts Controller');
    res.status(500).json({
      error: 'Failed to get workouts',
    });
  }
};

export const getWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'No Workout Id' });
      return;
    }
    const workouts = await prisma.workout.findMany({
      where: {
        id: id,
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
  } catch (error) {
    console.log('Error in Get Workout Controller');
    res.status(500).json({
      error: 'Failed to get workout',
    });
  }
};

export const createWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Please enter a Title and Description' });
      return;
    }
    const result = await prisma.workout.create({
      data: {
        title,
        description,
        user: {
          connect: { id: req.user.id },
        },
      },
    });

    res
      .status(201)
      .json({ message: 'Workout created successfully', workout: result });
  } catch (error) {
    console.log('Error in Create Workout Controller');
    res.status(500).json({
      error: 'Failed to create workout',
    });
  }
};

export const updateeWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const deleteWorkout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'No Workout Id' });
      return;
    }

    const result = await prisma.workout.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log('Error in Delete Workout Controller');
    res.status(500).json({
      error: 'Failed to Delete Workout',
    });
  }
};
