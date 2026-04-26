'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Channel, CollabDocument, InviteResponse, Message, NotificationItem, Task, Workspace } from '@/types';

export function useWorkspaces() { return useQuery({ queryKey: ['workspaces'], queryFn: () => apiClient<Workspace[]>('/workspaces') }); }
export function useBootstrapWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: () => apiClient<{ workspace: Workspace; channel: Channel; document: CollabDocument; boardId: string }>('/workspaces/bootstrap', { method: 'POST' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workspaces'] }) });
}
export function useChannels(workspaceId: string) { return useQuery({ queryKey: ['channels', workspaceId], queryFn: () => apiClient<Channel[]>(`/workspaces/${workspaceId}/channels`), enabled: Boolean(workspaceId) }); }
export function useMessages(channelId: string) { return useQuery({ queryKey: ['messages', channelId], queryFn: () => apiClient<Message[]>(`/channels/${channelId}/messages`), enabled: Boolean(channelId) }); }
export function useCreateMessage(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: { workspaceId: string; body: string }) => apiClient<Message>(`/channels/${channelId}/messages`, { method: 'POST', body: JSON.stringify(payload) }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages', channelId] }) });
}
export function useDocuments(workspaceId: string) { return useQuery({ queryKey: ['documents', workspaceId], queryFn: () => apiClient<CollabDocument[]>(`/workspaces/${workspaceId}/documents`), enabled: Boolean(workspaceId) }); }
export function useDocument(documentId: string) { return useQuery({ queryKey: ['document', documentId], queryFn: () => apiClient<CollabDocument>(`/documents/${documentId}`), enabled: Boolean(documentId) }); }
export function useUpdateDocument(documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: { title: string; content: CollabDocument['content'] }) => apiClient<CollabDocument>(`/documents/${documentId}`, { method: 'PATCH', body: JSON.stringify(payload) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['document', documentId] }); queryClient.invalidateQueries({ queryKey: ['documents'] }); } });
}
export function useTasks(boardId: string) { return useQuery({ queryKey: ['tasks', boardId], queryFn: () => apiClient<Task[]>(`/boards/${boardId}/tasks`), enabled: Boolean(boardId) }); }
export function useMoveTask() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: { taskId: string; columnKey: Task['columnKey']; order: number; boardId: string }) => apiClient<Task>(`/tasks/${payload.taskId}/move`, { method: 'POST', body: JSON.stringify({ columnKey: payload.columnKey, order: payload.order }) }), onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] }) });
}
export function useNotifications() { return useQuery({ queryKey: ['notifications'], queryFn: () => apiClient<NotificationItem[]>('/notifications') }); }
export function useInviteToWorkspace(workspaceId: string) {
  return useMutation({ mutationFn: (payload: { email: string; role: 'admin' | 'member' }) => apiClient<InviteResponse>(`/workspaces/${workspaceId}/invite`, { method: 'POST', body: JSON.stringify(payload) }) });
}
