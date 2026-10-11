// src/hooks/useSocket.ts
import {useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {useAuth} from '../context/AuthContext'; // دسترسی به توکن

export const useSocket = () => {
  const {token} = useAuth(); // فرض کن `token` در AuthContext ذخیره شده
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    const s = io('http://192.168.0.133:5001', {
      auth: {token},
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [token]);

  return {socket};
};