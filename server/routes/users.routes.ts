// routes/users.routes.ts
import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { protect } from '../middleware/auth';
import { loginUser, registerUser } from '../controllers/user.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

//protected route to check for JWT
router.use(protect);

// Add implementation for protected routes
router.post('/', async (req: Request, res: Response): Promise<void> => {
  // Your implementation here
  res.status(501).json({ message: 'Not implemented yet' });
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  // Your implementation here
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
