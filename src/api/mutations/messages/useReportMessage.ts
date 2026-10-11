import {useMutation} from '@tanstack/react-query';
import {Alert} from 'react-native';
import {reportMessage} from '../../queries/messages';

export const useReportMessage = () => {
  return useMutation({
    mutationFn: reportMessage,
    onSuccess: () => Alert.alert('گزارش با موفقیت ثبت شد'),
  });
};
