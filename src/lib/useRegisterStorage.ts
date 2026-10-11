// hooks/useRegisterStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveRegisterStep = async (step: number) => {
  await AsyncStorage.setItem('registerStep', String(step));
};

export const getRegisterStep = async (): Promise<number> => {
  const step = await AsyncStorage.getItem('registerStep');
  return step ? Number(step) : 1;
};

export const saveRegisterPhone = async (phone: string) => {
  await AsyncStorage.setItem('registerPhone', phone);
};

export const getRegisterPhone = async (): Promise<string> => {
  return (await AsyncStorage.getItem('registerPhone')) || '';
};

export const saveRegisterChannel = async (channel?: string) => {
  await AsyncStorage.setItem('registerChannel', channel ?? '');
};

export const getRegisterChannel = async (): Promise<string> => {
  return (await AsyncStorage.getItem('registerChannel')) ?? '';
};


