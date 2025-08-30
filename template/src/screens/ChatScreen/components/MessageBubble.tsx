import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import moment from 'moment';
import { width } from '../hooks';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import DocumentMessage from './DocumentMessage';

type props = {
  item: MessageType;
  setImageToView: React.Dispatch<React.SetStateAction<{ uri: string }[]>>;
  setImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setImageViewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleViewDocument: (uri: string) => void;
};

export default function MessageBubble({
  item,
  setImageToView,
  setImageIndex,
  setImageViewVisible,
  handleViewDocument,
}: props) {
  const isMyMessage = item.sender === 'me';

  const renderMessageContent = () => {
    switch (item.type) {
      case 'text':
        return <TextMessage message={item.content as string} />;
        break;

      case 'image':
        return (
          <ImageMessage
            setImageViewVisible={setImageViewVisible}
            setImageToView={setImageToView}
            setImageIndex={setImageIndex}
            images={item.content as { uri: string }[]}
          />
        );
        break;
      case 'document':
        return (
          <DocumentMessage
            documentItems={item.content as { uri: string }[]}
            handleViewDocument={handleViewDocument}
          />
        );
        break;
      default:
        return <Text>Unsupported message type</Text>;
        break;
    }
  };

  return (
    <View
      style={[
        styles.messageContainer,
        {
          backgroundColor: isMyMessage ? '#DCF8C6' : 'white',
          alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
          width: width * 0.7,
        },
      ]}
    >
      <View style={styles.messageContent}>{renderMessageContent()}</View>
      <Text style={styles.timestamp}>
        {moment(new Date(item.timestamp)).format('LT')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    minHeight: 50,
    marginVertical: 5,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
    borderRadius: 5,
  },
  timestamp: {
    fontSize: 9,
    textAlignVertical: 'bottom',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
