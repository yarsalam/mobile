import {fetchWithAuth} from '../../lib/fetchWithAuth';

const API_BASE = 'http://192.168.0.133:5001'; // مطمئن شوید که این آدرس صحیح است

export const fetchMessages = (targetId: number, page: number) =>
  fetchWithAuth(
    `${API_BASE}/messages/conversation/${targetId}?page=${page}&limit=20`,
  );

export const sendMessage = (body: {to_id: number; content: string}) =>
  fetchWithAuth(`${API_BASE}/messages`, {
    method: 'POST',
    body: JSON.stringify({to_id: body.to_id, content: body.content}),
  });

export const editMessage = (body: {messageId: number; content: string}) =>
  fetchWithAuth(`${API_BASE}/messages/${body.messageId}`, {
    method: 'PATCH',
    body: JSON.stringify({content: body.content}),
  });

export const reportMessage = (messageId: number) =>
  fetchWithAuth(`${API_BASE}/messages/${messageId}/report`, {
    method: 'POST',
  });

export const fetchGroupedInbox = () =>
  fetchWithAuth(`${API_BASE}/messages/inbox/grouped`);

export const fetchGroupedSent = () =>
  fetchWithAuth(`${API_BASE}/messages/sent/grouped`);

export const fetchUnreadCount = () =>
  fetchWithAuth(`${API_BASE}/messages/unread-count`);

export const markAsRead = (targetUserId: number) =>
  fetchWithAuth(`${API_BASE}/messages/read-all/${targetUserId}`, {
    method: 'PATCH',
  });

export const deleteAllMessages = () =>
  fetchWithAuth(`${API_BASE}/messages/all`, {method: 'DELETE'});

export const deleteConversation = (targetUserId: number) =>
  fetchWithAuth(`${API_BASE}/messages/conversation/${targetUserId}`, {
    method: 'DELETE',
  });

export const deleteSingleMessage = (messageId: number) =>
  fetchWithAuth(`${API_BASE}/messages/single/${messageId}`, {
    method: 'DELETE',
  });
