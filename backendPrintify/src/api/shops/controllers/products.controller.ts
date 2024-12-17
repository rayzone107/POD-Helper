import { Request, Response } from 'express';
import axios from 'axios';
import { BASE_URL, PRINTIFY_ACCESS_TOKEN } from '../../../config/config';
import { Product } from 'shared/types/Product';

const HEADERS = {
  Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}`,
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const response = await axios.get<{
      data: Product[];
    }>(BASE_URL + 'products.json', {
      headers: HEADERS,
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
      headers: HEADERS,
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

export const getShippingDetails = async (req: Request, res: Response) => {
  const { blueprintId, printProviderId } = req.params;

  try {
    const response = await axios.get(
      `https://api.printify.com/v1/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/shipping.json`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching shipping details:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch shipping details' });
  }
};