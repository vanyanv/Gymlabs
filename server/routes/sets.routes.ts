import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/');

router.get('/:id');

router.post('/');

router.delete('/:id');

export default router;
