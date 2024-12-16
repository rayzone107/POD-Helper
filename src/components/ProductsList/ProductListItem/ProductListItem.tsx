import React from 'react';
import { Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Product } from 'shared/types/Product';
import './ProductListItem.css';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const openExternalLink = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent the card click event
    window.open(product.external?.handle, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <CardMedia
          component="img"
          className="product-image"
          image={product.images[0]?.src || '/placeholder.png'}
          alt={product.title}
        />
        <CardContent className="product-details">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">{product.description}</p>
        </CardContent>
      </Link>
      <Button
        className="external-link-button"
        onClick={openExternalLink}
      >
        View
      </Button>
    </Card>
  );
};

export default ProductListItem;
