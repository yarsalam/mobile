import React from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useNavigation} from '@react-navigation/native';
import {
  useConversations,
  useStartConversation,
} from '../../api/mutations/assistant/aiAssistantHooks';

const AiAssistantMain = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {data: conversations, isLoading, refetch} = useConversations();
  const startMutation = useStartConversation();

  const handleStartNew = () => {
    // userId حذف شد — بک‌اند از JWT می‌گیرد
    startMutation.mutate(undefined, {
      onSuccess: newConv => navigation.navigate('AiChat', {convId: newConv.id}),
    });
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: theme.colors.card}]}
      onPress={() => navigation.navigate('AiChat', {convId: item.id})}>
      <GlobalText style={styles.convTitle}>گفتگو #{item.id}</GlobalText>
      <GlobalText style={styles.convDate}>
        {new Date(item.updatedAt).toLocaleDateString('fa-IR')}
      </GlobalText>
    </TouchableOpacity>
  );

  return (
    <MainLayout>
      <SectionWithLine text="دستیار هوشمند" />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.newBtn, {backgroundColor: theme.colors.primary}]}
          onPress={handleStartNew}
          disabled={startMutation.isPending}>
          <GlobalText style={{color: '#fff'}}>+ گفتگوی جدید</GlobalText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.adviceBtn, {backgroundColor: theme.colors.secondary}]}
          onPress={() => navigation.navigate('AiAdvice' as never)}>
          <GlobalText style={{color: '#fff'}}>📊 مشاوره و راهنما</GlobalText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: 16}}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <GlobalText style={styles.empty}>هنوز گفتگویی شروع نشده</GlobalText>
        }
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  newBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  adviceBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  convTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  convDate: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
  },
});

export default AiAssistantMain;
