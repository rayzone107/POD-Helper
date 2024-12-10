import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', (req, res, next) => {
  console.log(`API Route hit: ${req.method} ${req.url}`);
  next();
}, routes);

// Log incoming requests (optional for debugging)
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api', routes);

export default app;
