import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // Import CORS middleware

const PORT = 8888;
const app = express();
const { get } = axios;

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS
app.use(cors()); // Enable CORS for all routes

// Load JSON data from db.json
const dbPath = path.join(__dirname, 'db.json');
let portfolios = [];

// Read the db.json file on server start
fs.readFile(dbPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading db.json file:', err);
    return;
  }
  portfolios = JSON.parse(data).portfolios;
});

// Route to get the API welcome message
app.get('/', (req, res) => {
  res.json('Welcome to My Crypto Portfolio API');
});

// Route to get all portfolios
app.get('/portfolios', (req, res) => {
  res.json(portfolios);
});

// Route to get a specific portfolio by ID
app.get('/portfolios/:id', (req, res) => {
  const portfolio = portfolios.find(p => p.id === req.params.id);
  if (portfolio) {
    res.json(portfolio);
  } else {
    res.status(404).json({ error: 'Portfolio not found' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
