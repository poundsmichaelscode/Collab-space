import http from 'node:http';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { createSocketServer } from './socket/index.js';

const PORT = Number(env.PORT || 8000);

async function bootstrap() {
  try {
    console.log('Starting API bootstrap...');
    console.log('Connecting to database...');

    await connectDatabase();
    console.log('Database connected successfully');

    const app = createApp();
    const server = http.createServer(app);

    createSocketServer(server);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`API listening on port ${PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

void bootstrap();