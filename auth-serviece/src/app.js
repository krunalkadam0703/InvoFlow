import express from 'express';
import http from 'http';
import {
  onServerStart,
  setupGracefulShutdown
} from './utils/serverEvents.js';

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

// Create HTTP server explicitly
const server = http.createServer(app);

// Start server
server.listen(PORT, async () => {
  await onServerStart(PORT);
});

// Setup graceful shutdown
setupGracefulShutdown(server);
