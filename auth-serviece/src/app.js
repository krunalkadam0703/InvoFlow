import express from 'express';
import http from 'http';
import cors from 'cors'
import {
  onServerStart,
  setupGracefulShutdown
} from './utils/serverEvents.utils.js';

const app = express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({
  limit:"16kb"
}))

app.use(express.urlencoded({
  extended:true,
  limit:true
}))

app.use(express.static("public"))


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
