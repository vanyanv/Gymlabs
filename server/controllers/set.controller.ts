import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { exerciseId } = req.params;

    if (!exerciseId) {
      res.status(400).json({ error: 'No Exercise ID' });
      return;
    }
    const sets = await prisma.set.findMany({
      where: {
        userId: req.user.id,
        exerciseId,
      },
    });

    if (sets.length === 0) {
      res.status(200).json([]);
    } else {
      console.log('Got Sets', sets);
      res.status(200).json(sets);
    }
  } catch (error) {
    console.log('Error or Get Sets Controller', error);
    res.status(500).json({ error: 'Failed to get Sets' });
  }
};

export const getSet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { exerciseId, id } = req.params;

    if (!exerciseId || !id) {
      res.status(400).json({ error: 'No ID found' });
      return;
    }

    const set = await prisma.set.findFirst({
      where: {
        id,
        exerciseId,
        userId: req.user.id,
      },
    });

    if (!set) {
      res.status(404).json({ error: 'No set Found' });
      return;
    }
    console.log('Got Set', set);
    res.status(200).json(set);
  } catch (error) {
    console.log('Error or Get Set Controller', error);
    res.status(500).json({ error: 'Failed to get Set' });
  }
};

export const addSet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { weight, reps, completed } = req.body;
    const { exerciseId } = req.params;

    if (!weight == null || !reps == null || !completed == null) {
      res.status(400).json({ error: 'Please enter weight, reps' });
      return;
    }

    if (!exerciseId) {
      res.status(400).json({ error: 'No ID found' });
      return;
    }
    const result = await prisma.set.create({
      data: {
        weight,
        reps,
        completed,
        exerciseId,
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: 'added set', set: result });
  } catch (error) {
    console.log('Error or Add Set Controller', error);
    res.status(500).json({ error: 'Failed to Add Sets' });
  }
};

export const deleteSet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'No Set Id' });
      return;
    }

    const existingSet = prisma.set.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingSet) {
      res.status(404).json({
        error: 'Set not found or not authorized',
      });
      return;
    }

    await prisma.set.delete({
      where: {
        id,
        userId: req.user.id,
      },
    });

    res.status(200).json({ message: 'deleted set' });
  } catch (error) {
    console.log('Error or Delete Set Controller', error);
    res.status(500).json({ error: 'Failed to Delete Set' });
  }
};
