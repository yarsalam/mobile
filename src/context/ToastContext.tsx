import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import {Text, StyleSheet, Animated, TouchableOpacity} from 'react-native';

type ToastType = 'success' | 'error' | 'info';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  onPress?: () => void; // اختیاری
  notificationType?: 'message' | 'visitor'; // برای آیکن
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    onPress?: () => void,
    notificationType?: 'message' | 'visitor',
  ) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({children}: {children: React.ReactNode}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      onPress?: () => void,
      notificationType?: 'message' | 'visitor',
    ) => {
      const id = generateId();
      setToasts(prev => [
        ...prev,
        {id, message, type, onPress, notificationType},
      ]);
    },
    [],
  );

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          onPress={toast.onPress}
          notificationType={toast.notificationType}
          topOffset={200 + index * 55}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast باید داخل ToastProvider استفاده شود');
  return context;
};

// کامپوننت Toast
const Toast = ({
  message,
  type = 'info',
  onClose,
  onPress,
  notificationType,
  topOffset,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
  onPress?: () => void;
  notificationType?: 'message' | 'visitor';
  topOffset?: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timeout);
  }, [onClose, fadeAnim]);

  const getIcon = () => {
    if (type !== 'info') return null;
    return notificationType === 'message' ? '💬' : '👀';
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        type === 'error'
          ? styles.error
          : type === 'success'
          ? styles.success
          : styles.info,
        {opacity: fadeAnim, top: topOffset || 100},
      ]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (onPress) onPress();
          onClose();
        }}
        style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        {getIcon() && (
          <Text style={{fontSize: 20, marginRight: 8}}>{getIcon()}</Text>
        )}
        <Text style={styles.message}>{message}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>✖</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    minWidth: '70%',
    zIndex: 999,
    elevation: 5,
  },
  success: {backgroundColor: '#4BB543'},
  error: {backgroundColor: '#F44336'},
  info: {
    backgroundColor: '#ff5bfa',
    borderWidth: 1,
    borderColor: '#ff8c00',
  },
  message: {
    color: '#fff',
    flex: 1,
    fontSize: 15,
    textAlign: 'right',
  },
  closeButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
