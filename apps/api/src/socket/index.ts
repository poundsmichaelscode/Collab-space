import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { registerMessageEvents } from './events/message.events.js';

export function createSocketServer(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    registerMessageEvents(io, socket);
  });

  return io;
}
