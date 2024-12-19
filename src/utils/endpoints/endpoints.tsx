const API_BASE_URL = 'http://localhost:5000/api';

export const ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_DETAILS: (productId: string) => `${API_BASE_URL}/products/${productId}`,
  SHIPPING_INFO: (blueprintId: number, printProviderId: number) =>
    `${API_BASE_URL}/shipping/${blueprintId}/${printProviderId}`,
};