import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSets = (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    console.log('Error or Get Sets Controller', error);
    res.status(500).json({ error: 'Failed to get Sets' });
  }
};

export const getSet = (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    console.log('Error or Get Set Controller', error);
    res.status(500).json({ error: 'Failed to get Set' });
  }
};

export const addSet = (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    console.log('Error or Add Set Controller', error);
    res.status(500).json({ error: 'Failed to Add Sets' });
  }
};

export const deleteSet = (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    console.log('Error or Delete Set Controller', error);
    res.status(500).json({ error: 'Failed to Delete Set' });
  }
};
