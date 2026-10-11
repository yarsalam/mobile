import {useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {useAuth} from '../context/AuthContext';
import {API_BASE_URL} from '../config/api';

export const useSocket = () => {
  const {token} = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }
    const nextSocket = io(API_BASE_URL, {auth: {token}});
    setSocket(nextSocket);
    return () => {
      nextSocket.disconnect();
      setSocket(current => (current === nextSocket ? null : current));
    };
  }, [token]);

  return {socket};
};
