const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const AGENTS_FILE = path.join(__dirname, 'agents.json');

// Middleware
app.use(bodyParser.json());

// Helper function to read agents from JSON file
async function readAgents() {
  try {
    const data = await fs.readFile(AGENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      await fs.writeFile(AGENTS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
}

// Helper function to write agents to JSON file
async function writeAgents(agents) {
  await fs.writeFile(AGENTS_FILE, JSON.stringify(agents, null, 2));
}

// POST /api/agents - Register new agent
app.post('/api/agents', async (req, res) => {
  try {
    const { 
      name, 
      type, 
      specialization, 
      abilities, 
      stats, 
      twitterHandle, 
      verified 
    } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const newAgent = {
      id: uuidv4(),
      name,
      type,
      specialization: specialization || '',
      abilities: abilities || [],
      stats: stats || { speed: 0, accuracy: 0, cost: 0 },
      twitterHandle: twitterHandle || '',
      verified: verified || false
    };

    const agents = await readAgents();
    agents.push(newAgent);
    await writeAgents(agents);

    res.status(201).json(newAgent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register agent', details: error.message });
  }
});

// GET /api/agents - List all agents
app.get('/api/agents', async (req, res) => {
  try {
    const agents = await readAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve agents', details: error.message });
  }
});

// GET /api/agents/:id - Get specific agent
app.get('/api/agents/:id', async (req, res) => {
  try {
    const agents = await readAgents();
    const agent = agents.find(a => a.id === req.params.id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve agent', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`AgentDex API running on port ${PORT}`);
});