import { Request, Response } from 'express';
import { fetchShops } from '../services/shops.service';

export const getShops = async (req: Request, res: Response) => {
  try {
    console.log('Fetching shops...');
    const shops = await fetchShops();
    console.log('Shops fetched:', shops);
    res.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
};
