import { Router } from 'express';
import { getShops } from '../api/shops/controllers/shops.controller';
import { getProducts } from '../api/shops/controllers/products.controller';

const router = Router();

// Route for shops
router.get('/', getShops);

// Route for products in a specific shop
router.get('/:shop_id/products', getProducts);

export default router;
