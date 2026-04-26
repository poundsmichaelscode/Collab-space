import mongoose, { Schema } from 'mongoose';

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logoUrl: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' }
  },
  { timestamps: true }
);

export const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);
