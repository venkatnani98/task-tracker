const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();

// Allow the React dev server (different origin) to call this API
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Mount routes
app.use('/api/tasks', tasksRouter);

// Health check - useful for Docker healthchecks and load balancers
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Catch-all for unknown routes
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;