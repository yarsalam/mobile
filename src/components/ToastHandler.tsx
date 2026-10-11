import {useEffect, useRef} from 'react';
import {useToast} from '../context/ToastContext';

interface FormErrorToastHandlerProps {
  errors?: Record<string, any>;  // 👈 اختیاری شد
  submitCount?: number;
}

const ToastHandler = ({errors = {}, submitCount}: FormErrorToastHandlerProps) => {
  const {showToast} = useToast();
  const shownKeysRef = useRef<Set<string>>(new Set());
  const lastSubmitCountRef = useRef<number | undefined>(0);

  useEffect(() => {
    if (submitCount !== lastSubmitCountRef.current) {
      shownKeysRef.current.clear();
      lastSubmitCountRef.current = submitCount;
    }

    const shownKeys = shownKeysRef.current;
    const currentErrorKeys = new Set(Object.keys(errors ?? {}));

    // 🔁 حذف کلیدهایی که دیگر اروری ندارند
    shownKeys.forEach(key => {
      if (!currentErrorKeys.has(key)) {
        shownKeys.delete(key);
      }
    });

    Object.entries(errors ?? {}).forEach(([key, value]) => {
      if (value?.message && !shownKeys.has(key)) {
        showToast(value.message, 'error');
        shownKeys.add(key);
      }
    });
  }, [errors, showToast, submitCount]);

  return null;
};

export default ToastHandler;
