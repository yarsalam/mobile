import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import * as api from '../../queries/aiAssistant';

// ─── Queries ──────────────────────────────────────────────────────────────────

// userId دیگر لازم نیست — بک‌اند از JWT می‌گیرد
export const useConversations = () =>
  useQuery({
    queryKey: ['assistant-conversations'],
    queryFn: () => api.fetchConversations(),
  });

export const useConversation = (convId: number) =>
  useQuery({
    queryKey: ['assistant-conversation', convId],
    queryFn: () => api.fetchConversation(convId),
    enabled: !!convId,
  });

export const useAdvice = () =>
  useQuery({
    queryKey: ['assistant-advice'],
    queryFn: () => api.fetchAdvice(),
  });

export const useGuidance = () =>
  useQuery({
    queryKey: ['assistant-guidance'],
    queryFn: () => api.fetchGuidance(),
  });

export const useOptimizationPlan = () =>
  useQuery({
    queryKey: ['assistant-optimization'],
    queryFn: () => api.fetchOptimizationPlan(),
  });

export const useProblems = () =>
  useQuery({
    queryKey: ['assistant-problems'],
    queryFn: () => api.fetchProblems(),
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: {initialMessage?: string}) =>
      api.startConversation(params?.initialMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['assistant-conversations']});
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({convId, message}: {convId: number; message: string}) =>
      api.sendMessage(convId, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['assistant-conversation', variables.convId],
      });
    },
  });
};

export const useSuggestReply = () =>
  useMutation({
    mutationFn: ({convId, message}: {convId: number; message: string}) =>
      api.fetchSuggestReply(convId, message),
  });
