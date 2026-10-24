import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const fetchMessages = (targetId: number, page: number) =>
  fetchWithAuth(`/messages/conversation/${targetId}?page=${page}&limit=20`);

export const sendMessage = (body: {to_id: number; content: string}) =>
  fetchWithAuth('/messages', {
    method: 'POST',
    body: JSON.stringify({to_id: body.to_id, content: body.content}),
  });

export const editMessage = (body: {messageId: number; content: string}) =>
  fetchWithAuth(`/messages/${body.messageId}`, {
    method: 'PATCH',
    body: JSON.stringify({content: body.content}),
  });

export const reportMessage = (messageId: number) =>
  fetchWithAuth(`/messages/${messageId}/report`, {method: 'POST'});

export const fetchGroupedInbox = () => fetchWithAuth('/messages/inbox/grouped');
export const fetchGroupedSent = () => fetchWithAuth('/messages/sent/grouped');
export const fetchUnreadCount = () => fetchWithAuth('/messages/unread-count');

export const markAsRead = (targetUserId: number) =>
  fetchWithAuth(`/messages/read-all/${targetUserId}`, {method: 'PATCH'});

export const deleteAllMessages = () =>
  fetchWithAuth('/messages/all', {method: 'DELETE'});

export const deleteConversation = (targetUserId: number) =>
  fetchWithAuth(`/messages/conversation/${targetUserId}`, {method: 'DELETE'});

export const deleteSingleMessage = (messageId: number) =>
  fetchWithAuth(`/messages/single/${messageId}`, {method: 'DELETE'});
