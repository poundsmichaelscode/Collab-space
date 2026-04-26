import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Document' },
    content: {
      type: Schema.Types.Mixed,
      default: { type: 'doc', version: 1, blocks: [] }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

DocumentSchema.index({ workspaceId: 1, slug: 1 });

export const DocumentModel = mongoose.model('Document', DocumentSchema);
