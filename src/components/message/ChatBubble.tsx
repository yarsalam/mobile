import React from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import GlobalText from '../GlobalText';
import {useTheme} from '../../context/MainContext';

interface MessageType {
  id: number;
  from_id: number;
  to_id: number;
  content: string;
  created_at: string;
  read_at: string | null;
  clientStatus?: 'sending';
  tempId?: number; // اضافه کردن tempId به MessageType
}

interface ChatBubbleProps {
  message: MessageType;
  isOwn: boolean;
  onLongPress: (messageId: number, currentContent: string, isOwn: boolean, isRead: boolean) => void;
  onReport: (messageId: number) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({message, isOwn, onLongPress, onReport}) => {
  const {theme} = useTheme();
  const alignment = isOwn ? 'flex-end' : 'flex-start';
  const bubbleColor = isOwn ? theme.colors.primary : theme.colors.card;
  const textColor = isOwn ? '#fff' : theme.colors.text;

  let checks = '';
  const isRead = !!message.read_at;

  if (isOwn) {
    if (message.clientStatus === 'sending') {
      checks = '⏳';
    } else if (isRead) {
      checks = '✓✓';
    } else {
      checks = '✓';
    }
  }

  const formattedTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <TouchableOpacity
      // !!! این خطوط برای عیب‌یابی Long Press هستند !!!
      activeOpacity={0.7} // برای نمایش اینکه دکمه فشرده می‌شود
      delayLongPress={300} // کاهش زمان لازم برای Long Press
      onPress={() => console.log('CHATBUBBLE: Short Press on Message:', message.id || message.tempId, 'isOwn:', isOwn, 'isRead:', isRead)}
      onLongPress={() => {
        console.log('CHATBUBBLE: LONG PRESS DETECTED for Message:', {
          id: message.id,
          tempId: message.tempId,
          clientStatus: message.clientStatus,
          read_at: message.read_at,
          isOwn: isOwn,
          isRead: isRead,
        });
        onLongPress(message.id ?? message.tempId, message.content, isOwn, isRead); // استفاده از ?? برای tempId
      }}
      // !!! پایان خطوط عیب‌یابی !!!
      style={[styles.bubbleContainer, {alignSelf: alignment}]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleColor,
            borderBottomRightRadius: isOwn ? 0 : 16,
            borderBottomLeftRadius: isOwn ? 16 : 0,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        ]}>
        <GlobalText style={{color: textColor}}>{message.content}</GlobalText>
        <View style={styles.metaContainer}>
          <GlobalText style={styles.timeText}>{formattedTime}</GlobalText>
          {isOwn && (
            <View style={styles.checkContainer}>
              <GlobalText style={[styles.statusChecks, isRead && styles.statusChecksRead]}>
                {checks}
              </GlobalText>
            </View>
          )}
          {!isOwn && (
            <TouchableOpacity onPress={() => onReport(message.id)} style={styles.reportBtn}>
              <GlobalText>🚩</GlobalText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: 4,
    maxWidth: '80%',
    marginHorizontal: 10,
  },
  bubble: {
    padding: 10,
    borderRadius: 16,
    minHeight: 40,
    justifyContent: 'center',
  },
  metaContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginRight: 4,
  },
  checkContainer: {
    marginLeft: 4,
  },
  statusChecks: {
    fontSize: 12,
    color: '#999',
  },
  statusChecksRead: {
    color: '#0066ff',
  },
  reportBtn: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ChatBubble;