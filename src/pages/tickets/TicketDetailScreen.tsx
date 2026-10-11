import React, {useState} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useAuth} from '../../context/AuthContext';
import {useAddMessage} from '../../api/mutations/tickets/useAddMessage';
import {useSubmitFeedback} from '../../api/mutations/tickets/useSubmitFeedback';
import {useTicketDetail} from '../../api/mutations/tickets/useTicketDetail';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetail'>;

const TicketDetailScreen = ({route, navigation}: Props) => {
  const {ticketId} = route.params;
  const {user} = useAuth();
  const {theme} = useTheme();
  const styles = getStyles(theme);

  const {data: ticket, isLoading} = useTicketDetail(ticketId);
  const addMessageMutation = useAddMessage(ticketId);
  const feedbackMutation = useSubmitFeedback(ticketId);

  const [messageText, setMessageText] = useState('');
  const [modalFeedback, setModalFeedback] = useState(false);

  const handleSend = () => {
    if (!messageText.trim()) return;
    addMessageMutation.mutate(messageText, {
      onSuccess: () => setMessageText(''),
    });
  };

  const handleFeedback = (rating: number) => {
    setModalFeedback(false);
    feedbackMutation.mutate({rating});
  };

  const renderMessage = ({item}: any) => {
    const isMine = item.sender?.id === user?.id || item.type === 'user';
    const alignment = isMine ? 'flex-end' : 'flex-start';
    const bubbleColor = isMine
      ? theme.colors.card || '#dcf8c6'
      : theme.colors.primary || theme.colors.card;

    return (
      <View style={[styles.messageRow, {alignSelf: alignment}]}>
        <GlobalText
          style={[styles.senderName, {textAlign: isMine ? 'right' : 'left'}]}>
          {item.type === 'ai'
            ? '🤖 دستیار هوش مصنوعی'
            : item.sender?.nickname || 'پشتیبانی'}
        </GlobalText>
        <View
          style={[
            styles.bubble,
            {backgroundColor: bubbleColor, borderColor: theme.colors.border},
          ]}>
          <GlobalText
            style={[styles.messageContent, {color: theme.colors.text}]}>
            {item.content}
          </GlobalText>
          <View style={styles.messageFooter}>
            <GlobalText style={styles.timeText}>
              {new Date(item.createdAt).toLocaleTimeString('fa-IR')}
            </GlobalText>
            {item.type === 'ai' && item.aiConfidence && (
              <GlobalText style={styles.confidence}>
                {(item.aiConfidence * 100).toFixed(0)}%
              </GlobalText>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isLoading || !ticket) return null;

  return (
    <MainLayout>
      {/* هدر تیکت */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}>
        <GlobalText style={[styles.ticketTitle, {color: theme.colors.text}]}>
          {ticket.title}
        </GlobalText>
        <View style={styles.metaRow}>
          <GlobalText style={{color: theme.colors.text, opacity: 0.7}}>
            وضعیت: {ticket.status}
          </GlobalText>
          {ticket.priority && (
            <GlobalText style={{color: theme.colors.text, opacity: 0.7}}>
              اولویت: {ticket.priority}
            </GlobalText>
          )}
        </View>
      </View>

      <FlatList
        data={ticket.messages}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
      />

      {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}>
          <View
            style={[
              styles.inputBar,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="پیام خود را بنویسید..."
              placeholderTextColor={theme.colors.text + '88'}
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <GlobalText style={{color: '#fff'}}>ارسال</GlobalText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* دکمه‌های عملیاتی */}
      <View style={styles.actions}>
        {ticket.status === 'resolved' && !ticket.feedback && (
          <TouchableOpacity
            onPress={() => setModalFeedback(true)}
            style={[styles.actionBtn, {backgroundColor: '#f0ad4e'}]}>
            <GlobalText style={{color: '#fff'}}>امتیاز به پشتیبانی</GlobalText>
          </TouchableOpacity>
        )}
      </View>

      {/* مودال امتیازدهی */}
      <Modal visible={modalFeedback} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, {backgroundColor: theme.colors.card}]}>
            <GlobalText style={[styles.modalTitle, {color: theme.colors.text}]}>
             چقدر از پاسخگویی به این تیکت راضی بودید؟
            </GlobalText>
            <GlobalText style={[styles.modalDesc, {color: theme.colors.text}]}>
              لطفاً امتیاز بدهید
            </GlobalText>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleFeedback(star)}
                  style={styles.starBtn}>
                  <GlobalText style={styles.starText}>{star}⭐</GlobalText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      padding: 16,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#efefef',
    },
    ticketTitle: {fontSize: 18, fontWeight: 'bold', textAlign: 'right'},
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    listContent: {padding: 12},
    messageRow: {
      width: '100%',
      marginVertical: 4,
    },
    senderName: {
      fontSize: 15,
      color: theme.colors.text,
      marginBottom: 4,
      marginHorizontal: 8,
    },
    bubble: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginHorizontal: 8,
      width: '100%',
    },
    messageContent: {fontSize: 16, textAlign: 'right'},
    messageFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    timeText: {fontSize: 10, color: '#999'},
    confidence: {fontSize: 10, color: '#8bc34a'},
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 8,
      borderTopWidth: 1,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingTop: 8,
      fontSize: 16,
      textAlign: 'right',
      marginRight: 8,
      minHeight: 40,
      maxHeight: 100,
    },
    sendBtn: {
      backgroundColor: '#007bff',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 12,
      gap: 12,
    },
    actionBtn: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    // مودال
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCard: {
      width: '85%',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      gap: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign:'center'
    },
    modalDesc: {
      fontSize: 14,
      opacity: 0.7,
      textAlign: 'center',
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    modalBtn: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 8,
    },
    starRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    starBtn: {
      padding: 8,
    },
    starText: {
      fontSize: 24,
    },
  });

export default TicketDetailScreen;
