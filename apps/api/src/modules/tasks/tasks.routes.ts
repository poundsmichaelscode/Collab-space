import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../../common/middleware/auth.middleware.js';
import { TaskModel } from '../../db/models/task.model.js';
import { NotificationModel } from '../../db/models/notification.model.js';
import { created, ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';

const router = Router();

router.get('/boards/:boardId/tasks', requireAuth, catchAsync(async (req, res) => {
  const tasks = await TaskModel.find({ boardId: req.params.boardId }).sort({ columnKey: 1, order: 1 }).lean();
  return ok(res, tasks);
}));

router.post('/boards/:boardId/tasks', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const task = await TaskModel.create({
    workspaceId: req.body.workspaceId,
    boardId: req.params.boardId,
    title: req.body.title,
    description: req.body.description,
    reporterId: req.user!.sub,
    assigneeIds: req.body.assigneeIds ?? [],
    priority: req.body.priority ?? 'medium',
    columnKey: req.body.columnKey ?? 'todo',
    order: req.body.order ?? 0
  });
  return created(res, task);
}));

router.post('/tasks/:taskId/move', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const task = await TaskModel.findByIdAndUpdate(
    req.params.taskId,
    { columnKey: req.body.columnKey, order: req.body.order },
    { new: true }
  );

  if (task) {
    await NotificationModel.create({
      workspaceId: task.workspaceId,
      userId: req.user!.sub,
      type: 'system',
      title: 'Task updated',
      body: `${task.title} moved to ${req.body.columnKey}`,
      entityType: 'task',
      entityId: task._id,
      actorId: req.user!.sub
    });
  }

  return ok(res, task);
}));

export default router;
