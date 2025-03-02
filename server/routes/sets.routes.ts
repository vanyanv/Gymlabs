import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  addSet,
  deleteSet,
  getSet,
  getSets,
} from '../controllers/set.controller';

const router = Router();

router.use(protect);

router.get('/', getSets);

router.get('/exerciseId/:id', getSet);

router.post('/:exerciseId/:id', addSet);

router.delete('/:id', deleteSet);

export default router;
