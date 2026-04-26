import mongoose, { Schema } from 'mongoose';

const MemberSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    status: { type: String, enum: ['active', 'invited', 'removed'], default: 'active' },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

MemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export const MemberModel = mongoose.model('Member', MemberSchema);
