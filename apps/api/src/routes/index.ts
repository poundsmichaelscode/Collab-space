// import { Router } from 'express';
// import authRoutes from '../modules/auth/auth.routes.js';
// import workspaceRoutes from '../modules/workspaces/workspaces.routes.js';
// import channelRoutes from '../modules/channels/channels.routes.js';
// import messageRoutes from '../modules/messages/messages.routes.js';
// import documentRoutes from '../modules/documents/documents.routes.js';
// import taskRoutes from '../modules/tasks/tasks.routes.js';
// import notificationRoutes from '../modules/notifications/notifications.routes.js';
// import searchRoutes from '../modules/search/search.routes.js';
// import uploadRoutes from '../modules/uploads/uploads.routes.js';

// const router = Router();

// router.use('/auth', authRoutes);
// router.use('/workspaces', workspaceRoutes);
// router.use('/', channelRoutes);
// router.use('/', messageRoutes);
// router.use('/', documentRoutes);
// router.use('/', taskRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/search', searchRoutes);
// router.use('/uploads', uploadRoutes);

// export default router;



// FOR DEPLOYMENT ___ PRODUCTION



import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import workspaceRoutes from '../modules/workspaces/workspaces.routes.js';
import channelRoutes from '../modules/channels/channels.routes.js';
import messageRoutes from '../modules/messages/messages.routes.js';
import documentRoutes from '../modules/documents/documents.routes.js';
import taskRoutes from '../modules/tasks/tasks.routes.js';
import notificationRoutes from '../modules/notifications/notifications.routes.js';
import searchRoutes from '../modules/search/search.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/', channelRoutes);
router.use('/', messageRoutes);
router.use('/', documentRoutes);
router.use('/', taskRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', searchRoutes);

export default router;