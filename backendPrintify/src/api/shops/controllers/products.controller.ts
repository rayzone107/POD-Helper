import { Request, Response } from 'express';
import axios from 'axios';
import { BASE_URL, PRINTIFY_ACCESS_TOKEN } from '../../../config/config';
import { Product } from 'shared/types/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const response = await axios.get<{
      data: Product[];
    }>(BASE_URL + 'products.json', {
      headers: {
        Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}`,
      },
    });

    res.json({ products: response.data.data });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const response = await axios.get<Product>(BASE_URL + `products/${productId}.json`, {
      headers: {
        Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};
