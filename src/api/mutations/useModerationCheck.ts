import { useMutation } from '@tanstack/react-query';
import { checkMessage } from '../queries/moderation';


export const useModerationCheck = () => {
  return useMutation({
    mutationFn: (params: { text: string; receiverId: number }) =>
      checkMessage(params.text, params.receiverId),
  });
};