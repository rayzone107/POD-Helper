import { Router } from 'express';
import { getProductById, getProducts, getShippingDetails } from '../api/shops/controllers/products.controller';

const router = Router();

// Route for fetching all products
router.get('/products', getProducts);

// Route for fetching a single product by ID
router.get('/products/:productId', getProductById);

// Route for fetching shipping information for a provider
router.get('/shipping/:blueprintId/:printProviderId', getShippingDetails);

export default router;
