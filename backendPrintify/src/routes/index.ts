import { Router } from 'express';
import shopsRoutes from './shops.routes';

const router = Router();

// Mount the `/shops` route
router.use('/shops', shopsRoutes);

export default router;
