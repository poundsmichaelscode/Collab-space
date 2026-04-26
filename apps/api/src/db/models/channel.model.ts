import mongoose, { Schema } from 'mongoose';

const ChannelSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, enum: ['public', 'private', 'direct'], default: 'public' },
    topic: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    archivedAt: { type: Date }
  },
  { timestamps: true }
);

ChannelSchema.index({ workspaceId: 1, slug: 1 });

export const ChannelModel = mongoose.model('Channel', ChannelSchema);
