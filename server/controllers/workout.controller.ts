import { Request, Response } from 'express';
import prisma from '../lib/prisma';

//get workouts
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

    if (workouts.length === 0) {
      //return an empty array if no workouts found
      res.status(200).json([]);
    } else {
      console.log('Got workouts', workouts);
      res.status(200).json(workouts);
    }
  } catch (error) {
    console.error('Error in Get Workouts Controller:', error);
    res.status(500).json({
      error: 'Failed to get workouts',
    });
  }
};

//get workout
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
    const workout = await prisma.workout.findUnique({
      where: {
        id: id,
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

    if (!workout) {
      //return an error if we did not a find the workout
      res.status(404).json({ error: 'Workout not found' });
    } else {
      console.log('Got workout', workout);
      res.status(200).json(workout);
    }
  } catch (error) {
    console.log('Error in Get Workout Controller', error);
    res.status(500).json({
      error: 'Failed to get workout',
    });
  }
};

//create workout
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
    console.log('Error in Create Workout Controller', error);
    res.status(500).json({
      error: 'Failed to create workout',
    });
  }
};

//delete workout
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

    const existingWorkout = await prisma.workout.findUnique({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    if (!existingWorkout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    const result = await prisma.workout.delete({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    res
      .status(200)
      .json({ message: 'Workout deleted successfully', workout: result });
  } catch (error) {
    console.log('Error in Delete Workout Controller', error);
    res.status(500).json({
      error: 'Failed to delete workout',
    });
  }
};
