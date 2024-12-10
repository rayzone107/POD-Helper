import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../../types/Product'; // Adjust the import path as needed
import './ProductList.css'; // Add custom styles here

const ProductList: React.FC = () => {
  const ETSY_SHOP_ID = '15816012'; // Replace with your shop ID or fetch from constants
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<{ data: Product[] }>(
          `http://localhost:5000/api/shops/${ETSY_SHOP_ID}/products`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_PRINTIFY_ACCESS_TOKEN}`,
            },
          }
        );
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.images[0]?.src || '/placeholder.png'}
              alt={product.title}
              className="product-image"
            />
            <h2 className="product-title">{product.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
