import {useMutation, useQueryClient} from '@tanstack/react-query';
import {sendMessage} from '../../queries/messages';
import {Alert} from 'react-native';

interface SendMessageVariables {
  senderId: number;
  receiverId: number;
  content: string;
  tempId: number;
  from_id?: number;
  to_id?: number;
  read_at?: null;
  created_at?: string;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: SendMessageVariables) => {
      return sendMessage({
        to_id: variables.receiverId,
        content: variables.content,
      });
    },
    // این متد قبل از mutationFn فراخوانی می‌شود و امکان optimistic update را می‌دهد
    onMutate: async (newMsg: SendMessageVariables) => {
      // هر گونه refetch در حال انجام برای query چت را کنسل کنید
      await queryClient.cancelQueries({
        queryKey: ['chat', newMsg.senderId, newMsg.receiverId],
      });

      // مقدار قبلی را snapshot کنید
      const previousChatData = queryClient.getQueryData([
        'chat',
        newMsg.senderId,
        newMsg.receiverId,
      ]);

      // به صورت خوشبینانه (optimistically) با پیام جدید (با وضعیت 'sending') به‌روزرسانی کنید
      queryClient.setQueryData(
        ['chat', newMsg.senderId, newMsg.receiverId],
        (old: any) => {
          if (!old) {
            return {
              pages: [
                [
                  {
                    id: newMsg.tempId, // از tempId برای پیام optimistic استفاده کنید
                    from_id: newMsg.senderId,
                    to_id: newMsg.receiverId,
                    content: newMsg.content,
                    created_at: new Date().toISOString(), // Timestamp در سمت کلاینت
                    read_at: null,
                    clientStatus: 'sending', // وضعیت سفارشی در سمت کلاینت
                  },
                ],
              ],
              pageParams: [0],
            };
          }
          const newPages = old.pages.map((page: any, index: number) => {
            if (index === 0) {
              return [
                {
                  id: newMsg.tempId, // از tempId برای پیام optimistic استفاده کنید
                  from_id: newMsg.senderId,
                  to_id: newMsg.receiverId,
                  content: newMsg.content,
                  created_at: new Date().toISOString(), // Timestamp در سمت کلاینت
                  read_at: null,
                  clientStatus: 'sending', // وضعیت سفارشی در سمت کلاینت
                },
                ...page,
              ];
            }
            return page;
          });
          return {...old, pages: newPages};
        },
      );

      return {previousChatData}; // Context برای onError
    },
    onSuccess: (serverData, variables) => {
      // پس از فراخوانی موفقیت‌آمیز API، پیام optimistic را با پیام واقعی سرور جایگزین کنید
      queryClient.setQueryData(
        ['chat', variables.senderId, variables.receiverId],
        (old: any) => {
          if (!old) return old;
          const newPages = old.pages.map((page: any[]) =>
            page.map(msg =>
              msg.id === variables.tempId // پیام optimistic را با tempId پیدا کنید
                ? {...serverData, clientStatus: undefined} // با داده سرور جایگزین کنید، clientStatus را حذف کنید
                : msg,
            ),
          );
          return {...old, pages: newPages};
        },
      );

      queryClient.invalidateQueries({queryKey: ['inboxGrouped']});
      queryClient.invalidateQueries({queryKey: ['sentGrouped']});
      queryClient.invalidateQueries({queryKey: ['unreadMessages']});
    },
    onError: (err, newMsg, context) => {
      console.error(
        'Error sending message, rolling back optimistic update:',
        err,
      );
      // اگر mutation شکست خورد، به وضعیت قبلی برگردید
      queryClient.setQueryData(
        ['chat', newMsg.senderId, newMsg.receiverId],
        context?.previousChatData,
      );
      Alert.alert('خطا', 'مشکلی در ارسال پیام پیش آمد.');
    },
    onSettled: (data, error, variables) => {
      // اطمینان حاصل کنید که کش برای این چت (صرف نظر از موفقیت یا خطا) تمیز است
      queryClient.invalidateQueries({
        queryKey: ['chat', variables.senderId, variables.receiverId],
      });
    },
  });
};
