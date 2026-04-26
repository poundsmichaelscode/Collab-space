import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { MessageModel } from '../../db/models/message.model.js';
import { DocumentModel } from '../../db/models/document.model.js';
import { TaskModel } from '../../db/models/task.model.js';
import { ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';

const router = Router();

router.get('/', requireAuth, catchAsync(async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const workspaceId = String(req.query.workspaceId ?? '');
  const regex = new RegExp(q, 'i');

  const [messages, documents, tasks] = await Promise.all([
    MessageModel.find({ workspaceId, body: regex }).limit(10).lean(),
    DocumentModel.find({ workspaceId, title: regex }).limit(10).lean(),
    TaskModel.find({ workspaceId, title: regex }).limit(10).lean()
  ]);

  return ok(res, { messages, documents, tasks });
}));

export default router;
