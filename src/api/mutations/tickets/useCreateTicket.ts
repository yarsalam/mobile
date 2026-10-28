import {useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';
import {useToast} from '../../../context/ToastContext';

interface CreateTicketPayload {
  title: string;
  description: string;
  category?: string;
}

const createTicketFn = (data: CreateTicketPayload) =>
  fetchWithAuth('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const {showToast} = useToast();

  return useMutation({
    mutationFn: createTicketFn,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tickets']});
      showToast('تیکت شما با موفقیت ثبت شد', 'success');
    },
    onError: () => {
      showToast('ثبت تیکت با مشکل مواجه شد', 'error');
    },
  });
};