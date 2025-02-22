import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Workouts endpoint' });
});

router.post('/', (req: Request, res: Response) => {
  // TODO: Add workout
  res.json({ message: 'Create workout' });
});

export default router;