import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import GlobalText from '../GlobalText';
import {useQuickFeedback} from '../../api/mutations/aiFeedback/useFeedback';

interface Props {
  feature: string;
  context?: string;
}

const FeedbackWidget: React.FC<Props> = ({feature, context}) => {
  const {send} = useQuickFeedback();

  const handleRate = (score: number) => {
    send(feature, {score}, {context: {source: context}});
  };

  return (
    <View style={styles.container}>
      <GlobalText style={styles.label}>آیا این مفید بود؟</GlobalText>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleRate(0)} style={styles.btn}>
          <GlobalText style={styles.emoji}>👎</GlobalText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRate(1)} style={styles.btn}>
          <GlobalText style={styles.emoji}>👍</GlobalText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    padding: 6,
  },
  emoji: {
    fontSize: 22,
  },
});

export default FeedbackWidget;
