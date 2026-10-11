import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActionSheetIOS,
  ActivityIndicator,
  Text,
} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useAuth} from '../../context/AuthContext';
import {useSocket} from '../../lib/useSocket';
import {useSendMessage} from '../../api/mutations/messages/useSendMessage';
import {useEditMessage} from '../../api/mutations/messages/useEditMessage';
import {useReportMessage} from '../../api/mutations/messages/useReportMessage';
import {useDeleteSingleMessage} from '../../api/mutations/messages/useDeleteSingleMessage';
import {StyleSheet} from 'react-native';
import ChatBubble from '../../components/message/ChatBubble';
import {useModeratedSend} from '../../lib/useModeratedSend';
import {useQueryClient} from '@tanstack/react-query';
import {useChatMessages} from '../../api/mutations/messages/useChatMessages';

// ═══ HELPERS ═══
const getChatRoom = (a: number, b: number) =>
  `chat_${Math.min(a, b)}_${Math.max(a, b)}`;

// ═══ COMPONENT ═══
const ChatScreen = ({route}) => {
  const {userId, nickname} = route.params;
  const {user: authUser} = useAuth();
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList<any>>(null);

  // ═══ STATE ═══
  const [inputText, setInputText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState<any[]>([]);

  // ═══ QUERIES & MUTATIONS ═══
  const {data, fetchNextPage, hasNextPage, isLoading} = useChatMessages(
    authUser?.id,
    userId,
  );
  const sendMutation = useSendMessage();
  const editMutation = useEditMessage();
  const reportMutation = useReportMessage();
  const deleteMutation = useDeleteSingleMessage();
  const {socket} = useSocket();

  // ═══ DERIVED ═══
  const messages = useMemo(
    () => data?.pages?.flatMap(page => page) || [],
    [data],
  );
  const chatRoom = useMemo(
    () => (authUser?.id ? getChatRoom(authUser.id, userId) : ''),
    [authUser?.id, userId],
  );

  // ═══ MODAL ═══
  const showModal = useCallback(
    (title: string, message: string, buttons: any[]) => {
      setModalTitle(title);
      setModalMessage(message);
      setModalButtons(buttons);
      setModalVisible(true);
    },
    [],
  );
  const hideModal = useCallback(() => setModalVisible(false), []);

  // ═══ SOCKET ═══
  useEffect(() => {
    if (!socket || !authUser?.id || !chatRoom) return;
    socket.emit('join', {room: chatRoom});

    const onNewMessage = (msg: any) => {
      const belongs =
        (msg.from_id === authUser.id && msg.to_id === userId) ||
        (msg.from_id === userId && msg.to_id === authUser.id);
      if (!belongs) return;

      queryClient.setQueryData(['chat', authUser.id, userId], (old: any) => {
        if (!old) return {pages: [[msg]], pageParams: [0]};
        const pages = old.pages.map((page: any[], i: number) => {
          if (i !== 0) return page;
          const idx = page.findIndex(
            (m: any) => m.clientStatus === 'sending' && m.tempId === msg.tempId,
          );
          if (idx !== -1) {
            const copy = [...page];
            copy[idx] = {...msg, clientStatus: undefined};
            return copy;
          }
          return [msg, ...page];
        });
        return {...old, pages};
      });
    };

    socket.on('new_message', onNewMessage);
    return () => {
      socket.emit('leave', {room: chatRoom});
      socket.off('new_message', onNewMessage);
    };
  }, [socket, authUser?.id, userId, chatRoom, queryClient]);

  // ═══ SEND / EDIT ═══
  const proceedToSend = useCallback(
    (text: string) => {
      if (!authUser?.id) return;

      if (editingMessageId) {
        editMutation.mutate(
          {messageId: editingMessageId, content: text},
          {
            onSuccess: () => {
              setEditingMessageId(null);
              setInputText('');
              queryClient.invalidateQueries({
                queryKey: ['chat', authUser.id, userId],
              });
            },
            onError: (e: any) =>
              showModal('خطا', e?.response?.data?.message || 'ویرایش ناموفق', [
                {text: 'باشه', onPress: hideModal},
              ]),
          },
        );
      } else {
        const tempId = Date.now() + Math.random();
        sendMutation.mutate(
          {senderId: authUser.id, receiverId: userId, content: text, tempId},
          {
            onSuccess: () => setInputText(''),
            onError: (e: any) =>
              showModal('خطا', e?.response?.data?.message || 'ارسال ناموفق', [
                {text: 'باشه', onPress: hideModal},
              ]),
          },
        );
      }
    },
    [
      editingMessageId,
      authUser?.id,
      userId,
      editMutation,
      sendMutation,
      queryClient,
      hideModal,
      showModal,
    ],
  );

  const {sendWithModeration, checking} = useModeratedSend({
    receiverId: userId,
    onSend: proceedToSend,
  });

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    sendWithModeration(inputText);
  }, [inputText, sendWithModeration]);

  // ═══ DELETE ═══
  const handleDelete = useCallback(
    (messageId: number) => {
      hideModal();
      showModal('حذف پیام', 'آیا مطمئن هستید؟', [
        {text: 'لغو', onPress: hideModal},
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            hideModal();
            deleteMutation.mutate(messageId, {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ['chat', authUser?.id, userId],
                });
                showModal('موفقیت', 'پیام حذف شد.', [
                  {text: 'باشه', onPress: hideModal},
                ]);
              },
              onError: (e: any) =>
                showModal('خطا', e?.response?.data?.message || 'حذف ناموفق', [
                  {text: 'باشه', onPress: hideModal},
                ]),
            });
          },
        },
      ]);
    },
    [deleteMutation, queryClient, authUser?.id, userId, hideModal, showModal],
  );

  // ═══ EDIT START ═══
  const startEdit = useCallback(
    (messageId: number, content: string) => {
      const msg = messages.find(
        (m: any) => m.id === messageId || m.tempId === messageId,
      );
      if (msg) {
        setEditingMessageId(messageId);
        setInputText(content);
      } else {
        showModal('خطا', 'پیام یافت نشد.', [
          {text: 'باشه', onPress: hideModal},
        ]);
      }
    },
    [messages, hideModal, showModal],
  );

  // ═══ LONG PRESS ═══
  const handleLongPress = useCallback(
    (messageId: number, content: string, isOwn: boolean, isRead: boolean) => {
      if (!isOwn) return;
      const msg = messages.find(
        (m: any) => m.id === messageId || m.tempId === messageId,
      );
      if (!msg || msg.clientStatus === 'sending') return;
      if (msg.read_at) return;

      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['لغو', 'ویرایش', 'حذف'],
            cancelButtonIndex: 0,
            destructiveButtonIndex: 2,
            title: 'عملیات پیام',
          },
          index => {
            if (index === 1) startEdit(messageId, content);
            else if (index === 2) handleDelete(messageId);
          },
        );
      } else {
        showModal('عملیات پیام', '', [
          {
            text: 'ویرایش',
            onPress: () => {
              hideModal();
              startEdit(messageId, content);
            },
          },
          {
            text: 'حذف',
            style: 'destructive',
            onPress: () => handleDelete(messageId),
          },
          {text: 'لغو', onPress: hideModal},
        ]);
      }
    },
    [messages, startEdit, handleDelete, hideModal, showModal],
  );

  // ═══ RENDER ═══
  const renderItem = useCallback(
    ({item}: any) => (
      <ChatBubble
        message={item}
        isOwn={item.from_id === authUser?.id}
        onLongPress={handleLongPress}
        onReport={(id: number) =>
          reportMutation.mutate(id, {
            onSuccess: () =>
              showModal('گزارش', 'پیام گزارش شد.', [
                {text: 'باشه', onPress: hideModal},
              ]),
            onError: (e: any) =>
              showModal('خطا', e?.response?.data?.message || 'گزارش ناموفق', [
                {text: 'باشه', onPress: hideModal},
              ]),
          })
        }
      />
    ),
    [authUser?.id, handleLongPress, reportMutation, showModal, hideModal],
  );

  // ═══ SCROLL TO END ═══
  useEffect(() => {
    if (messages.length && flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  }, [messages]);

  // ═══ RENDER ═══
  return (
    <MainLayout>
      <View style={styles.header}>
        <GlobalText style={styles.headerText}>{nickname}</GlobalText>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item: any) => (item.id ?? item.tempId)?.toString()}
        inverted
        onEndReached={hasNextPage ? () => fetchNextPage() : null}
        onEndReachedThreshold={0.5}
        refreshing={isLoading && !messages.length}
        onRefresh={() =>
          queryClient.invalidateQueries({
            queryKey: ['chat', authUser?.id, userId],
          })
        }
        ListEmptyComponent={
          isLoading ? null : (
            <GlobalText style={styles.empty}>گفتگویی وجود ندارد.</GlobalText>
          )
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              editingMessageId ? 'ویرایش پیام...' : 'پیام خود را بنویسید...'
            }
            style={styles.textInput}
            multiline
            textAlignVertical="center"
          />
          <TouchableOpacity
            onPress={handleSend}
            style={styles.sendBtn}
            disabled={checking || !inputText.trim()}>
            {checking ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <GlobalText style={styles.sendIcon}>📨</GlobalText>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, {backgroundColor: theme.colors.card}]}>
            {modalTitle ? (
              <GlobalText
                style={[styles.modalTitle, {color: theme.colors.text}]}>
                {modalTitle}
              </GlobalText>
            ) : null}
            {modalMessage ? (
              <GlobalText
                style={[styles.modalDesc, {color: theme.colors.text}]}>
                {modalMessage}
              </GlobalText>
            ) : null}
            <View style={styles.modalActions}>
              {modalButtons.map((btn, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={btn.onPress}
                  style={[
                    styles.modalBtn,
                    btn.style === 'destructive'
                      ? {backgroundColor: '#d63638'}
                      : {backgroundColor: theme.colors.border},
                  ]}>
                  <Text
                    style={{
                      color:
                        btn.style === 'destructive'
                          ? '#fff'
                          : theme.colors.text,
                    }}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
};

// ═══ STYLES ═══
const getStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginRight: 10,
    },
    empty: {textAlign: 'center', marginTop: 20},
    inputBar: {
      flexDirection: 'row-reverse',
      alignItems: 'flex-end',
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    textInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingTop: Platform.OS === 'ios' ? 10 : 8,
      paddingBottom: Platform.OS === 'ios' ? 10 : 8,
      fontSize: 16,
      textAlign: 'right',
      marginLeft: 8,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendIcon: {fontSize: 22, color: '#fff'},
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
    modalTitle: {fontSize: 18, fontWeight: 'bold'},
    modalDesc: {fontSize: 14, opacity: 0.7, textAlign: 'center'},
    modalActions: {flexDirection: 'row', gap: 12, marginTop: 8},
    modalBtn: {paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8},
  });

export default ChatScreen;
