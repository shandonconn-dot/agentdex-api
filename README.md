# AgentDex API

A simple Express.js backend for managing agents with JSON file storage.

## Endpoints

- `POST /api/agents`: Register a new agent
- `GET /api/agents`: List all agents
- `GET /api/agents/:id`: Get a specific agent by ID

## Deployment

Deployed on Railway. Use `railway up` to deploy.

### Local Development

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` for development
4. Run `npm start` for production

## Storage

Uses `agents.json` for persistent storage of agent information.