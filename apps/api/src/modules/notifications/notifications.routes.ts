import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../../common/middleware/auth.middleware.js';
import { NotificationModel } from '../../db/models/notification.model.js';
import { ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';

const router = Router();

router.get('/', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const notifications = await NotificationModel.find({ userId: req.user!.sub })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return ok(res, notifications);
}));

router.patch('/:notificationId/read', requireAuth, catchAsync(async (req, res) => {
  const notification = await NotificationModel.findByIdAndUpdate(
    req.params.notificationId,
    { readAt: new Date() },
    { new: true }
  );
  return ok(res, notification);
}));

export default router;
