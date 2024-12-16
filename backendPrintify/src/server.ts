import express from 'express';
import cors from 'cors';
import shopsRoutes from './routes/shops.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins or specific frontend origin
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());

// Mount the shops routes
app.use('/api', shopsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
