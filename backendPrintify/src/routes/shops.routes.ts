import { Router } from 'express';
import shops from '../api/shops';

const router = Router();

router.use('/shops', shops);

export default router;
