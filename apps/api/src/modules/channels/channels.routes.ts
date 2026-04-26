import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../../common/middleware/auth.middleware.js';
import { ChannelModel } from '../../db/models/channel.model.js';
import { created, ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';

const router = Router();

router.get('/workspaces/:workspaceId/channels', requireAuth, catchAsync(async (req, res) => {
  const channels = await ChannelModel.find({ workspaceId: req.params.workspaceId }).sort({ createdAt: 1 }).lean();
  return ok(res, channels);
}));

router.post('/workspaces/:workspaceId/channels', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const channel = await ChannelModel.create({
    workspaceId: req.params.workspaceId,
    name: req.body.name,
    slug: req.body.slug,
    topic: req.body.topic,
    createdBy: req.user!.sub
  });
  return created(res, channel);
}));

export default router;
