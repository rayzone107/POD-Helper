import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000; // Change the port if needed

app.use(cors());
app.use(express.json());

const PRINTIFY_ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6ImM3MTc2ZDc3YzUxMDZhMDE1ZGRmZjcyOWNhMDgxOWM2MTQyNDE5Njk4MGRhZDQ3ODFmYjE5NjFiODVlNDEwNWM0NDFjYmNlZmY0OTZhMGU1IiwiaWF0IjoxNzMzNjc1Mjk4LjgzMTEyNywibmJmIjoxNzMzNjc1Mjk4LjgzMTEzLCJleHAiOjE3NjUyMTEyOTguODA5MDY3LCJzdWIiOiIxODEyMTc2MiIsInNjb3BlcyI6WyJzaG9wcy5tYW5hZ2UiLCJzaG9wcy5yZWFkIiwiY2F0YWxvZy5yZWFkIiwib3JkZXJzLnJlYWQiLCJvcmRlcnMud3JpdGUiLCJwcm9kdWN0cy5yZWFkIiwicHJvZHVjdHMud3JpdGUiLCJ3ZWJob29rcy5yZWFkIiwid2ViaG9va3Mud3JpdGUiLCJ1cGxvYWRzLnJlYWQiLCJ1cGxvYWRzLndyaXRlIiwicHJpbnRfcHJvdmlkZXJzLnJlYWQiLCJ1c2VyLmluZm8iXX0.Ac4oWgUGYpjV_rEwRQMM7Klz-7EyJ6vmPE6aaPspOaq9I_tO9y0nx7QnmL4S5yEs1lZ8gyQzHWKr0MPMMCk'; // Replace with your token

// Proxy route for Printify Shops API
app.get('/', (req, res) => {
    res.send('Welcome to the POD Helper Backend!');
  });
  app.get('/api/shops', async (req, res) => {
    try {
      const response = await axios.get('https://api.printify.com/v1/shops.json', {
        headers: { Authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}` },
      });
      res.json(response.data); // Return the shops to the frontend
    } catch (error) {
      console.error('Error fetching shops:', error);
      res.status(500).json({ error: 'Failed to fetch shops' });
    }
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
