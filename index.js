import express from 'express';
import axios from 'axios';
import fs from 'fs/promises'; // Use the fs.promises version
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
app.use(express.json()); // Middleware to parse JSON bodies

// Load JSON data from db.json
const dbPath = path.join(__dirname, 'db.json');
let portfolios = [];

// Function to load portfolios from the file
const loadPortfolios = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    portfolios = JSON.parse(data).portfolios || []; // Ensure portfolios is an array
  } catch (err) {
    console.error('Error reading db.json file:', err);
  }
};

// Function to save portfolios to the file
const savePortfolios = async () => {
  try {
    await fs.writeFile(dbPath, JSON.stringify({ portfolios }, null, 2)); // Pretty-print JSON for readability
  } catch (err) {
    console.error('Error writing to db.json:', err);
    throw err;
  }
};

// Load portfolios on server start
await loadPortfolios();

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

// POST route to add a new portfolio
app.post('/portfolios', async (req, res) => {
  const newPortfolio = req.body; // Portfolio object from the client request

  // Add the new portfolio to the array
  portfolios.push(newPortfolio);

  // Save the updated portfolios back to the db.json file
  try {
    await savePortfolios();
    res.status(201).json(newPortfolio); // Respond with the newly added portfolio
  } catch (err) {
    res.status(500).json({ error: 'Failed to save new portfolio' });
  }
});

// DELETE route to remove a portfolio by ID
app.delete('/portfolios/:id', async (req, res) => {
  const { id } = req.params;
  const portfolioIndex = portfolios.findIndex(p => p.id === id);

  if (portfolioIndex === -1) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  // Remove the portfolio from the array
  portfolios.splice(portfolioIndex, 1);

  // Save the updated portfolios back to the db.json file
  try {
    await savePortfolios();
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// PUT route to update the portfolio name by ID
app.put('/portfolios/:id', async (req, res) => {
  const { id } = req.params;
  const updatedPortfolio = req.body;

  // Find the portfolio by ID
  const portfolioIndex = portfolios.findIndex(p => p.id === id);

  if (portfolioIndex === -1) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  // Update the portfolio
  portfolios[portfolioIndex] = { ...portfolios[portfolioIndex], ...updatedPortfolio };

  // Save the updated portfolios
  try {
    await savePortfolios();
    res.json({ message: 'Portfolio updated successfully', portfolio: portfolios[portfolioIndex] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});



// PATCH route to update the portfolio by ID
app.patch('/portfolios/:id', async (req, res) => {
  const { id } = req.params;
  const { analysis, coins, values } = req.body;  // Extract `analysis` and `coins`

  // Find the portfolio by ID
  const portfolioIndex = portfolios.findIndex(p => p.id === id);

  if (portfolioIndex === -1) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  // Update the analysis array if provided
  if (analysis) {
    portfolios[portfolioIndex].analysis = analysis; // Replace the existing analysis array
  }

  // Update coins if provided
  if (coins) {
    portfolios[portfolioIndex].coins = coins; // Replace or update coins
  }

  // Update values if provided
  if (values) {
    portfolios[portfolioIndex].values = values; // Replace or update values
  }

  // Save the updated portfolios back to the db.json file
  try {
    await savePortfolios();
    res.json({ message: 'Portfolio updated successfully', portfolio: portfolios[portfolioIndex] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
