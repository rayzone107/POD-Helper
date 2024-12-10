import { Request, Response } from 'express';
import axios from 'axios';
import { ETSY_SHOP_ID, PRINTIFY_ACCESS_TOKEN } from '../../../config/config';

export const getProducts = async (req: Request, res: Response) => {

  try {
    const response = await axios.get(
      `https://api.printify.com/v1/shops/${ETSY_SHOP_ID}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}`,
        },
      }
    );
    res.json(response.data); // Return the products to the frontend
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
