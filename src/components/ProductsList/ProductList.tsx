import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, List, ListItem, Typography } from '@mui/material';

interface Shop {
  id: number;
  title: string;
  sales_channel: string;
}

const ProductList: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get<Shop[]>('http://localhost:5000/api/shops'); // Call backend API
        setShops(response.data);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Failed to load shops');
      }
    };

    fetchShops();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product List - Shops
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {shops.map((shop) => (
          <ListItem key={shop.id}>
            <Typography>
              {shop.title} - ({shop.sales_channel})
            </Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ProductList;
