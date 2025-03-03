// src/routes/apiRoutes.ts
import express from 'express';
import {
  getExerciseNames,
  getExerciseName,
} from '../controllers/exerciseNames.controller';

const router = express.Router();

// Public routes
router.get('/', getExerciseNames);
router.post('/', getExerciseName);

export default router;
