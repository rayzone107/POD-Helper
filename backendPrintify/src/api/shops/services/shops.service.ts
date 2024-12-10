import axios from 'axios';
import { PRINTIFY_ACCESS_TOKEN } from '../../../config/config';

export const fetchShops = async () => {
  try {
    const response = await axios.get('https://api.printify.com/v1/shops.json', {
      headers: {
        Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw new Error('Failed to fetch shops');
  }
};
