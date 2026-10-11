import { useForm, DefaultValues, UseFormReturn, UseFormProps } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersistedForm<T extends Record<string, any>>(
  key: string,
  defaultValues: DefaultValues<T>,
  options?: UseFormProps<T> & { persist?: boolean }
): UseFormReturn<T> & { stopPersisting: () => void } {
  const { persist = true, ...formOptions } = options || {};

  const form = useForm<T>({
    defaultValues,
    ...formOptions, // 👈 اینطوری resolver, mode و ... هم پاس داده میشه
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          form.reset(parsed);
        }
      } catch (error) {
        console.error('خطا در خواندن فرم ذخیره‌شده:', error);
      }
    };
    loadData();
  }, [key]);

  const unsubscribeRef = useRef<ReturnType<typeof form.watch> | null>(null);

  useEffect(() => {
    if (!persist) return;
    const subscription = form.watch((value) => {
      AsyncStorage.setItem(key, JSON.stringify(value)).catch((err) =>
        console.error('خطا در ذخیره فرم:', err)
      );
    });
    unsubscribeRef.current = subscription;
    return () => subscription.unsubscribe();
  }, [form, key, persist]);

  const stopPersisting = () => {
    unsubscribeRef.current?.unsubscribe();
  };

  return { ...form, stopPersisting };
}
