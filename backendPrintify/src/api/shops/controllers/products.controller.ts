import { Request, Response } from 'express';
import axios from 'axios';
import { BASE_URL, PRINTIFY_ACCESS_TOKEN } from '../../../config/config';
import { Product } from 'shared/types/Product';
import { ShippingDetailsResponse } from '../types/shops.types';

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
    const response = await axios.get<ShippingDetailsResponse>(
      `https://api.printify.com/v1/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/shipping.json`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}`,
        },
      }
    );

    const { profiles } = response.data;

    res.json(profiles);
  } catch (error: any) {
    console.error('Error fetching shipping details:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch shipping details' });
  }
};

export const updateProductVariants = async (req: Request, res: Response) => {
  const { productId } = req.params; // Product ID from URL params
  const { variants } = req.body; // Updated variants from the request payload

  if (!variants || !Array.isArray(variants)) {
    return res.status(400).json({ error: 'Invalid request: variants are required' });
  }

  try {
    // Prepare the payload to send to Printify
    const payload = {
      variants,
    };

    // Call Printify API to update the product
    const response = await axios.put(
      `${BASE_URL}products/${productId}.json`,
      payload,
      { headers: HEADERS }
    );

    // Respond with success message
    res.json({
      message: 'Product variants updated successfully',
      data: response.data,
    });
  } catch (error: any) {
    console.error(`Error updating product variants:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    res.status(500).json({
      error: 'Failed to update product variants',
      details: error.response?.data || error.message,
    });
  }
};
