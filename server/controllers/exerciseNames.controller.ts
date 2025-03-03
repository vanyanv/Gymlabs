// src/controllers/exerciseController.ts
import { Request, Response } from 'express';
import exerciseRepository from '../repositories/exerciseRepository';

export const getExerciseNames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get language from query param or default to English (2)
    const language = parseInt(req.query.language as string) || 2;

    const exerciseNames = await exerciseRepository.getExerciseNames(language);
    res.status(200).json(exerciseNames);
  } catch (error) {
    console.error('Error fetching exercise names:', error);
    res.status(500).json({ error: 'Failed to fetch exercise names' });
  }
};

export const getExerciseName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'No Name, Please enter an exercise name' });
      return;
    }

    const searchName = name.trim().toLowerCase();

    // Get language from query param or default to English (2)
    const language = parseInt(req.query.language as string) || 2;

    const exerciseNames = await exerciseRepository.getExerciseNames(language);

    const exercise = exerciseNames.find(
      (exerciseNames) => exerciseNames.name.toLocaleLowerCase() === searchName
    );

    if (!exercise) {
      res.status(404).json({ message: 'Did not find any Exercise' });
      return;
    }

    res.status(200).json(exercise);
  } catch (error) {
    console.error('Error fetching exercise', error);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
};
