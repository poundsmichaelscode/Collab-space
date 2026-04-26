export interface User { _id: string; email: string; username: string; fullName: string; avatarUrl?: string; }
export interface Workspace { _id: string; name: string; slug: string; ownerId: string; plan: 'free' | 'pro' | 'business'; }
export interface Channel { _id: string; workspaceId: string; name: string; slug: string; type: 'public' | 'private' | 'direct'; topic?: string; }
export interface Message { _id: string; workspaceId: string; channelId: string; senderId: string; senderName?: string; body: string; createdAt: string; updatedAt: string; }
export interface DocumentBlock { id: string; type: 'heading' | 'paragraph' | 'checklist'; text?: string; items?: { id: string; text: string; checked: boolean }[]; }
export interface CollabDocument { _id: string; workspaceId: string; title: string; slug: string; content: { type: 'doc'; version: number; blocks: DocumentBlock[]; }; createdAt: string; updatedAt: string; }
export interface Task { _id: string; workspaceId: string; boardId: string; columnKey: 'todo' | 'in_progress' | 'review' | 'done'; title: string; description?: string; priority: 'low' | 'medium' | 'high' | 'urgent'; assigneeIds: string[]; order: number; }
export interface NotificationItem { _id: string; title: string; body?: string; type: string; readAt?: string; createdAt: string; }
export interface InviteResponse { invitation: { _id: string; token: string; email: string; role: 'admin' | 'member'; }; inviteUrl: string; }
export interface ApiEnvelope<T> { success: boolean; data: T; meta?: Record<string, unknown>; }
