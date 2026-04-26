import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'invited', 'suspended'], default: 'active' },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
    },
    refreshTokenVersion: { type: Number, default: 0 },
    lastActiveAt: { type: Date }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
