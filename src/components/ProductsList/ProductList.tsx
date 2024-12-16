import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductListItem from './ProductListItem/ProductListItem';
import SearchBar from '../common/SearchBar/SearchBar';
import { Product } from 'shared/types/Product';
import './ProductList.css';
import { ENDPOINTS } from '../../utils/endpoints/endpoints';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<{ products: Product[] }>(ENDPOINTS.PRODUCTS);
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (term: string) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="product-list">
      <h1>Products</h1>
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Search products by title..." 
        debounceDelay={500} 
      />
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
