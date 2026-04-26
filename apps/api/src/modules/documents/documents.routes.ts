import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../../common/middleware/auth.middleware.js';
import { DocumentModel } from '../../db/models/document.model.js';
import { NotificationModel } from '../../db/models/notification.model.js';
import { created, ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';

const router = Router();

router.get('/workspaces/:workspaceId/documents', requireAuth, catchAsync(async (req, res) => {
  const docs = await DocumentModel.find({ workspaceId: req.params.workspaceId }).sort({ updatedAt: -1 }).lean();
  return ok(res, docs);
}));

router.get('/documents/:documentId', requireAuth, catchAsync(async (req, res) => {
  const doc = await DocumentModel.findById(req.params.documentId).lean();
  return ok(res, doc);
}));

router.post('/workspaces/:workspaceId/documents', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const doc = await DocumentModel.create({
    workspaceId: req.params.workspaceId,
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    createdBy: req.user!.sub,
    lastEditedBy: req.user!.sub
  });
  return created(res, doc);
}));

router.patch('/documents/:documentId', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const doc = await DocumentModel.findByIdAndUpdate(
    req.params.documentId,
    {
      title: req.body.title,
      content: req.body.content,
      lastEditedBy: req.user!.sub
    },
    { new: true }
  );

  if (doc) {
    await NotificationModel.create({
      workspaceId: doc.workspaceId,
      userId: req.user!.sub,
      type: 'doc_updated',
      title: 'Document updated',
      body: doc.title,
      entityType: 'document',
      entityId: doc._id,
      actorId: req.user!.sub
    });
  }

  return ok(res, doc);
}));

export default router;
