import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import './ProductListCard.css';

const ProductListCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="home-card" onClick={() => navigate('/product-list')}>
      <CardContent className="card-content">
        <ListAltIcon className="card-icon" />
        <Typography variant="h4" component="div" className="card-title">
          Product List
        </Typography>
        <Typography variant="body1" className="card-description">
          View and manage all your products fetched from Printify.
        </Typography>
        <Button variant="outlined" color="primary">
          Go to Product List
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductListCard;
