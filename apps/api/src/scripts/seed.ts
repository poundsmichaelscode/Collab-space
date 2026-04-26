import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import { UserModel } from '../db/models/user.model.js';
import { WorkspaceModel } from '../db/models/workspace.model.js';
import { MemberModel } from '../db/models/member.model.js';
import { ChannelModel } from '../db/models/channel.model.js';
import { DocumentModel } from '../db/models/document.model.js';
import { TaskModel } from '../db/models/task.model.js';
import { NotificationModel } from '../db/models/notification.model.js';

async function seed() {
  await connectDatabase();

  const email = 'demo@collabspace.dev';
  const existing = await UserModel.findOne({ email });

  if (existing) {
    console.log('Seed already exists for demo@collabspace.dev');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await UserModel.create({
    email,
    username: 'collabdemo',
    fullName: 'CollabSpace Demo',
    passwordHash,
    emailVerified: true
  });

  const workspace = await WorkspaceModel.create({
    name: 'CollabSpace Demo Workspace',
    slug: 'collabspace-demo',
    ownerId: user._id,
    plan: 'free'
  });

  await MemberModel.create({
    workspaceId: workspace._id,
    userId: user._id,
    role: 'admin',
    status: 'active'
  });

  const channel = await ChannelModel.create({
    workspaceId: workspace._id,
    name: 'general',
    slug: 'general',
    topic: 'Demo workspace channel',
    createdBy: user._id
  });

  const document = await DocumentModel.create({
    workspaceId: workspace._id,
    title: 'Getting Started',
    slug: 'getting-started',
    content: {
      type: 'doc',
      version: 1,
      blocks: [
        { id: '1', type: 'heading', text: 'Welcome to CollabSpace' },
        { id: '2', type: 'paragraph', text: 'This seeded workspace is ready for local demos and deployment smoke tests.' }
      ]
    },
    createdBy: user._id,
    lastEditedBy: user._id
  });

  await TaskModel.insertMany([
    {
      workspaceId: workspace._id,
      boardId: 'main',
      columnKey: 'todo',
      title: 'Invite your first team member',
      description: 'Extend the invite flow with email delivery.',
      reporterId: user._id,
      priority: 'medium',
      order: 1
    },
    {
      workspaceId: workspace._id,
      boardId: 'main',
      columnKey: 'in_progress',
      title: 'Review chat experience',
      description: 'Open the seeded general channel and send messages.',
      reporterId: user._id,
      priority: 'high',
      order: 1
    }
  ]);

  await NotificationModel.create({
    workspaceId: workspace._id,
    userId: user._id,
    type: 'system',
    title: 'Demo workspace seeded',
    body: 'Use the seeded account to explore the MVP locally.',
    entityType: 'workspace',
    entityId: workspace._id,
    actorId: user._id
  });

  console.log('Seed complete');
  console.log({
    email,
    password: 'Password123!',
    workspaceId: String(workspace._id),
    channelId: String(channel._id),
    documentId: String(document._id)
  });
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
