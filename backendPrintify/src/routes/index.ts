import { Router } from 'express';
import { getShops } from '../api/shops/controllers/shops.controller';

const router = Router();

router.get('/', getShops);

export default router;
