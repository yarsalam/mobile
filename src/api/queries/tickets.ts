import { fetchWithAuth } from '../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001';

// گرفتن لیست تیکت‌های کاربر
export const fetchUserTickets = (userId: number) =>
  fetchWithAuth(`${BASE}/tickets/user/${userId}`);

// گرفتن جزئیات یک تیکت (همراه با پیام‌ها)
export const fetchTicketDetail = (ticketId: number) =>
  fetchWithAuth(`${BASE}/tickets/${ticketId}`);

// ایجاد تیکت جدید
export const createTicket = (data: {
  title: string;
  description: string;
  category?: string;
  metadata?: any;
}) =>
  fetchWithAuth(`${BASE}/tickets`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// ارسال پیام در تیکت
export const addMessageToTicket = (ticketId: number, content: string) =>
  fetchWithAuth(`${BASE}/tickets/${ticketId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

// حل شدن تیکت (توسط کاربر یا پشتیبانی)
export const resolveTicket = (ticketId: number, resolution: string) =>
  fetchWithAuth(`${BASE}/tickets/${ticketId}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ resolution }),
  });

// ثبت بازخورد (امتیاز ۱ تا ۵ و توضیح)
export const submitFeedback = (
  ticketId: number,
  rating: number,
  comment?: string
) =>
  fetchWithAuth(`${BASE}/tickets/${ticketId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  });