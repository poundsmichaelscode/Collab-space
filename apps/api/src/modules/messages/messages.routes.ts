import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../../common/middleware/auth.middleware.js';
import { MessageModel } from '../../db/models/message.model.js';
import { UserModel } from '../../db/models/user.model.js';
import { NotificationModel } from '../../db/models/notification.model.js';
import { created, ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';

const router = Router();

router.get('/channels/:channelId/messages', requireAuth, catchAsync(async (req, res) => {
  const messages = await MessageModel.find({ channelId: req.params.channelId })
    .sort({ createdAt: 1 })
    .limit(Number(req.query.limit ?? 50))
    .lean();

  const senderIds = [...new Set(messages.map((message) => String(message.senderId)))];
  const users = await UserModel.find({ _id: { $in: senderIds } }).lean();
  const byId = new Map(users.map((user) => [String(user._id), user.fullName]));

  return ok(res, messages.map((message) => ({ ...message, senderName: byId.get(String(message.senderId)) ?? 'Teammate' })));
}));

router.post('/channels/:channelId/messages', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const message = await MessageModel.create({
    workspaceId: req.body.workspaceId,
    channelId: req.params.channelId,
    senderId: req.user!.sub,
    body: req.body.body,
    mentions: req.body.mentions ?? []
  });

  if (Array.isArray(req.body.mentions) && req.body.mentions.length > 0) {
    await NotificationModel.insertMany(
      req.body.mentions.map((userId: string) => ({
        workspaceId: req.body.workspaceId,
        userId,
        type: 'mention',
        title: 'You were mentioned in chat',
        body: req.body.body,
        entityType: 'message',
        entityId: message._id,
        actorId: req.user!.sub
      }))
    );
  }

  const sender = await UserModel.findById(req.user!.sub).lean();
  return created(res, { ...message.toObject(), senderName: sender?.fullName ?? 'Teammate' });
}));

export default router;
