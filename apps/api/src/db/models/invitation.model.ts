import mongoose, { Schema } from 'mongoose';

const InvitationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    token: { type: String, required: true, unique: true, index: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    acceptedAt: { type: Date },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

InvitationSchema.index({ token: 1, expiresAt: 1 });

export const InvitationModel = mongoose.model('Invitation', InvitationSchema);
