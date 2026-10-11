import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import { GroupedMessageDto } from '../../../types/messageType';
import { useInboxGrouped } from '../../api/mutations/messages/useInboxGrouped';
import MessageItem from '../MessageItem';


interface Props {
  inboxData: GroupedMessageDto[];
}

const GroupedInbox: React.FC<Props> = ({inboxData}) => {
  // گروه‌بندی پیام‌ها بر اساس userId
  const groupedByUser = inboxData.reduce((acc, msg) => {
    if (!acc[msg.userId]) acc[msg.userId] = [];
    acc[msg.userId].push(msg);
    return acc;
  }, {} as Record<number, GroupedMessageDto[]>);
  const {data, isLoading} = useInboxGrouped(user.id);
  {
    !isLoading && data && <GroupedInbox inboxData={data} />;
  }
  return (
    <ScrollView contentContainerStyle={{padding: 12}}>
      {Object.values(groupedByUser).map((messages, index) => (
        <View key={index} style={styles.groupBox}>
          {messages.map((msg, i) => (
            <MessageItem key={i} data={msg} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  groupBox: {
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    padding: 6,
    marginBottom: 14,
    borderRadius: 8,
    backgroundColor: '#001f3f',
  },
});

export default GroupedInbox;
