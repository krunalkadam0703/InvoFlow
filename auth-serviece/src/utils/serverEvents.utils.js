import prisma from '../config/database.config.js';
import { redis } from '../config/redis.config.js';

class ServerEvents {
  constructor() {
    this.shutdownHandlers = [];
    this.startupHandlers = [];
    this.isShuttingDown = false;
  }

  onStart(handler) {
    this.startupHandlers.push(handler);
  }

  onStop(handler) {
    this.shutdownHandlers.push(handler);
  }

  async executeStartup(port) {
    try {
      await prisma.$connect();
      console.log('Database connected');

      for (const handler of this.startupHandlers) {
        await handler();
      }

      if (port) {
        console.log(`Auth service running on port ${port}`);
      }
    } catch (error) {
      console.error('Startup failed:', error);
      throw error;
    }
  }

  async executeShutdown() {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log('Shutting down server');

    try {
      for (let i = this.shutdownHandlers.length - 1; i >= 0; i--) {
        await this.shutdownHandlers[i]();
      }

      await prisma.$disconnect();
      redis.disconnect()
      console.log('Database disconnected');

      console.log('Shutdown complete');
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }

  setupGracefulShutdown(server) {
    const shutdown = async (signal) => {
      console.log(`Received ${signal}`);

      if (this.isShuttingDown) return;

      server.close(async () => {
        await this.executeShutdown();
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', async (reason) => {
      console.error('Unhandled Rejection:', reason);
      await this.executeShutdown();
      process.exit(1);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }
}

const serverEvents = new ServerEvents();
export default serverEvents;

export const onServerStart = (port) => serverEvents.executeStartup(port);
export const onServerStop = () => serverEvents.executeShutdown();
export const setupGracefulShutdown = (server) =>
  serverEvents.setupGracefulShutdown(server);
