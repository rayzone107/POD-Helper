import axios from 'axios';
import { Product } from 'shared/types/Product';
import { ENDPOINTS } from '../utils/endpoints/endpoints';

/**
 * Fetches the list of products from the API.
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<{ products: Product[] }>(ENDPOINTS.PRODUCTS);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products.');
  }
};

/**
 * Filters products based on a search term.
 * @param {Product[]} products - The array of products to filter.
 * @param {string} searchTerm - The search term to filter by.
 * @returns {Product[]} The filtered list of products.
 */
export const filterProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm) return products;
  return products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
