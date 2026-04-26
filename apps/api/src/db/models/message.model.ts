import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attachments: [
      { url: String, fileName: String, mimeType: String, size: Number }
    ],
    editedAt: { type: Date },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

MessageSchema.index({ channelId: 1, createdAt: -1 });

export const MessageModel = mongoose.model('Message', MessageSchema);
