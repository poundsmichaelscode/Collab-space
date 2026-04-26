import crypto from 'node:crypto';
import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../../common/middleware/auth.middleware.js';
import { WorkspaceModel } from '../../db/models/workspace.model.js';
import { MemberModel } from '../../db/models/member.model.js';
import { ChannelModel } from '../../db/models/channel.model.js';
import { DocumentModel } from '../../db/models/document.model.js';
import { TaskModel } from '../../db/models/task.model.js';
import { NotificationModel } from '../../db/models/notification.model.js';
import { InvitationModel } from '../../db/models/invitation.model.js';
import { UserModel } from '../../db/models/user.model.js';
import { AppError } from '../../common/utils/app-error.js';
import { created, ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';
import { env } from '../../config/env.js';

const router = Router();


async function ensureAdmin(workspaceId: string, userId: string) {
  const member = await MemberModel.findOne({ workspaceId, userId, status: 'active' }).lean();
  if (!member || member.role !== 'admin') {
    throw new AppError('Admin access required', 403, 'FORBIDDEN');
  }
}

router.get('/', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const members = await MemberModel.find({ userId: req.user!.sub, status: 'active' }).lean();
  const workspaceIds = members.map((member) => member.workspaceId);
  const workspaces = await WorkspaceModel.find({ _id: { $in: workspaceIds } }).sort({ createdAt: 1 }).lean();
  return ok(res, workspaces);
}));

router.post('/', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const workspace = await WorkspaceModel.create({
    name: req.body.name,
    slug: req.body.slug,
    ownerId: req.user!.sub
  });

  await MemberModel.create({
    workspaceId: workspace._id,
    userId: req.user!.sub,
    role: 'admin',
    status: 'active'
  });

  return created(res, workspace);
}));

router.get('/:workspaceId/members', requireAuth, catchAsync(async (req, res) => {
  const workspaceId = String(req.params.workspaceId);
  const members = await MemberModel.find({ workspaceId, status: 'active' }).lean();
  return ok(res, members);
}));

router.post('/:workspaceId/invite', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const workspaceId = String(req.params.workspaceId);
  await ensureAdmin(workspaceId, req.user!.sub);

  const token = crypto.randomBytes(24).toString('hex');
  const invitation = await InvitationModel.create({
    workspaceId,
    email: String(req.body.email).toLowerCase(),
    role: req.body.role === 'admin' ? 'admin' : 'member',
    token,
    invitedBy: req.user!.sub,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });

  const requestOrigin = typeof req.headers.origin === 'string' ? req.headers.origin : env.CLIENT_URL;

  return created(res, {
    invitation,
    inviteUrl: `${requestOrigin}/invite/${token}`
  });
}));

router.post('/accept-invite/:token', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const token = String(req.params.token);
  const invite = await InvitationModel.findOne({ token, acceptedAt: { $exists: false } });
  if (!invite || invite.expiresAt < new Date()) {
    throw new AppError('Invite is invalid or expired', 404, 'INVITE_INVALID');
  }

  const user = await UserModel.findById(req.user!.sub).lean();
  if (!user || user.email.toLowerCase() !== invite.email) {
    throw new AppError('This invite is for a different email address', 403, 'INVITE_EMAIL_MISMATCH');
  }

  await MemberModel.updateOne(
    { workspaceId: invite.workspaceId, userId: req.user!.sub },
    { $set: { role: invite.role, status: 'active' } },
    { upsert: true }
  );

  invite.acceptedAt = new Date();
  await invite.save();

  const workspace = await WorkspaceModel.findById(invite.workspaceId).lean();
  return ok(res, { workspace });
}));

router.post('/bootstrap', requireAuth, catchAsync(async (req: AuthRequest, res) => {
  const existingMembership = await MemberModel.findOne({ userId: req.user!.sub, status: 'active' }).lean();

  if (existingMembership) {
    const workspace = await WorkspaceModel.findById(existingMembership.workspaceId).lean();
    const channel = workspace
      ? await ChannelModel.findOne({ workspaceId: workspace._id }).sort({ createdAt: 1 }).lean()
      : null;
    const document = workspace
      ? await DocumentModel.findOne({ workspaceId: workspace._id }).sort({ createdAt: 1 }).lean()
      : null;

    return ok(res, { workspace, channel, document, boardId: 'main' });
  }

  const workspace = await WorkspaceModel.create({
    name: 'CollabSpace HQ',
    slug: `collabspace-${String(req.user!.sub).slice(-6)}`,
    ownerId: req.user!.sub
  });

  await MemberModel.create({ workspaceId: workspace._id, userId: req.user!.sub, role: 'admin', status: 'active' });

  const channel = await ChannelModel.create({
    workspaceId: workspace._id,
    name: 'general',
    slug: 'general',
    topic: 'Company-wide announcements and team collaboration',
    createdBy: req.user!.sub
  });

  const document = await DocumentModel.create({
    workspaceId: workspace._id,
    title: 'Workspace Overview',
    slug: 'workspace-overview',
    content: {
      type: 'doc',
      version: 1,
      blocks: [
        { id: '1', type: 'heading', text: 'Workspace Overview' },
        {
          id: '2',
          type: 'paragraph',
          text: 'Welcome to CollabSpace. Invite teammates, share files, and move tasks with drag-and-drop.'
        }
      ]
    },
    createdBy: req.user!.sub,
    lastEditedBy: req.user!.sub
  });

  await TaskModel.insertMany([
    {
      workspaceId: workspace._id,
      boardId: 'main',
      columnKey: 'todo',
      title: 'Invite your first teammate',
      description: 'Use the invite flow from workspace settings.',
      reporterId: req.user!.sub,
      priority: 'medium',
      order: 1
    },
    {
      workspaceId: workspace._id,
      boardId: 'main',
      columnKey: 'in_progress',
      title: 'Wire chat to real-time events',
      description: 'Validate socket events and refresh the message list live.',
      reporterId: req.user!.sub,
      priority: 'high',
      order: 1
    },
    {
      workspaceId: workspace._id,
      boardId: 'main',
      columnKey: 'done',
      title: 'Design system foundation',
      description: 'Purple + black theme and dark mode are already included.',
      reporterId: req.user!.sub,
      priority: 'low',
      order: 1
    }
  ]);

  await NotificationModel.create({
    workspaceId: workspace._id,
    userId: req.user!.sub,
    type: 'system',
    title: 'Workspace ready',
    body: 'Your starter workspace, channels, docs, and task board are ready.',
    entityType: 'workspace',
    entityId: workspace._id,
    actorId: req.user!.sub
  });

  return created(res, { workspace, channel, document, boardId: 'main' });
}));

export default router;
