import React, { useState, useEffect } from 'react';
import ProductListItem from './ProductListItem/ProductListItem';
import SearchBar from '../common/SearchBar/SearchBar';
import { Product } from 'shared/types/Product';
import './ProductList.css';
import { fetchProducts, filterProducts } from 'src/services/productList';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products.');
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(filterProducts(products, searchTerm));
  }, [products, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
