import { Server, Socket } from 'socket.io';
import { MessageModel } from '../../db/models/message.model.js';
import { UserModel } from '../../db/models/user.model.js';
import { verifyAccessToken } from '../../common/middleware/auth.middleware.js';

export function registerMessageEvents(io: Server, socket: Socket) {
  socket.on('workspace:join', (workspaceId: string) => {
    socket.join(`workspace:${workspaceId}`);
  });

  socket.on('channel:join', (channelId: string) => {
    socket.join(`channel:${channelId}`);
  });

  socket.on('message:typing:start', ({ channelId, userName }) => {
    socket.to(`channel:${channelId}`).emit('message:typing', { channelId, userName, active: true });
  });

  socket.on('message:typing:stop', ({ channelId, userName }) => {
    socket.to(`channel:${channelId}`).emit('message:typing', { channelId, userName, active: false });
  });

  socket.on('message:send', async (payload) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return;

    const decoded = verifyAccessToken(token);
    const sender = await UserModel.findById(decoded.sub).lean();
    const message = await MessageModel.create({
      workspaceId: payload.workspaceId,
      channelId: payload.channelId,
      senderId: decoded.sub,
      body: payload.body,
      mentions: payload.mentions ?? []
    });

    io.to(`channel:${payload.channelId}`).emit('message:new', {
      ...message.toObject(),
      senderName: sender?.fullName ?? 'Teammate'
    });
  });
}
