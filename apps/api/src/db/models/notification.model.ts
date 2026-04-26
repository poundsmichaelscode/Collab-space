import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['mention', 'task_assigned', 'doc_updated', 'channel_invite', 'system'], required: true },
    title: { type: String, required: true },
    body: { type: String },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date }
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });

export const NotificationModel = mongoose.model('Notification', NotificationSchema);
