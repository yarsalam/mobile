import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {
  useConversation,
  useSendMessage,
} from '../../api/mutations/assistant/aiAssistantHooks';

const AiChat = ({route}) => {
  const {convId} = route.params;
  const {theme} = useTheme();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const {data: conversation, isLoading} = useConversation(convId);
  const sendMutation = useSendMessage();

  const messages = conversation?.messages || [];

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    sendMutation.mutate(
      {convId, message: inputText},
      {onSuccess: () => setInputText('')},
    );
  }, [inputText, convId]);

  const renderMessage = ({item}: any) => {
    const isUser = item.sender === 'user';
    const alignment = isUser ? 'flex-end' : 'flex-start';
    const bubbleColor = isUser ? '#dcf8c6' : '#fff';
    return (
      <View style={[styles.messageRow, {alignSelf: alignment}]}>
        <View style={[styles.bubble, {backgroundColor: bubbleColor}]}>
          <GlobalText style={styles.sender}>
            {isUser ? 'شما' : 'دستیار'}
          </GlobalText>
          <GlobalText>{item.content}</GlobalText>
        </View>
      </View>
    );
  };

  return (
    <MainLayout>
      <View style={styles.header}>
        <GlobalText style={styles.headerTitle}>دستیار هوشمند</GlobalText>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{padding: 12}}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
        refreshing={isLoading}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="پیام خود را بنویسید..."
            style={styles.textInput}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <GlobalText style={{color: '#fff'}}>ارسال</GlobalText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageRow: {
    maxWidth: '80%',
    marginVertical: 4,
  },
  bubble: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 8,
    fontSize: 16,
    textAlign: 'right',
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  sendBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
});

export default AiChat;
