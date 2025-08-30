import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSetHeaderActions } from '@/components/templates';
import { FlashList } from '@shopify/flash-list';
import {
  KeyboardAwareScrollView,
  useKeyboardAnimation,
  useKeyboardHandler,
} from 'react-native-keyboard-controller';
import ImageView from 'react-native-image-viewing';

import { viewDocument } from '@react-native-documents/viewer';

import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import { scheduleOnRN } from 'react-native-worklets';
import { useHandleError } from './hooks';

export default function ChatScreen() {
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageToView, setImageToView] = useState<{ uri: string }[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const { height: keyboardHeight } = useKeyboardAnimation();

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }
    }, 100);
  }, [keyboardHeight]);

  useKeyboardHandler({
    onStart: () => {
      'worklet';
      scheduleOnRN(scrollToEnd);
    },
  });
  const handleError = useHandleError();

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      type: 'text',
      sender: 'me',
      content: 'Hello! How are you?',
      timestamp: Date.now() - 1000 * 60 * 60,
    },
    {
      id: '2',
      type: 'image',
      sender: 'other',
      content: [
        { uri: 'https://unsplash.it/400/400?image=1' },
        { uri: 'https://unsplash.it/400/400?image=2' },
      ],
      timestamp: Date.now() - 1000 * 60 * 45,
    },
    {
      id: '4',
      type: 'text',
      sender: 'other',
      content: 'Nice pictures!',
      timestamp: Date.now() - 1000 * 60 * 10,
    },
    {
      id: '5',
      type: 'image',
      sender: 'other',
      content: [
        { uri: 'https://unsplash.it/400/400?image=3' },
        { uri: 'https://unsplash.it/400/400?image=4' },
        { uri: 'https://unsplash.it/400/400?image=5' },
        { uri: 'https://unsplash.it/400/400?image=6' },
        { uri: 'https://unsplash.it/400/400?image=7' },
        { uri: 'https://unsplash.it/400/400?image=8' },
        { uri: 'https://unsplash.it/400/400?image=9' },
        { uri: 'https://unsplash.it/400/400?image=10' },
        { uri: 'https://unsplash.it/400/400?image=11' },
      ],
      timestamp: Date.now() - 1000 * 60 * 5,
    },
  ]);

  // Header actions handlers
  const handleCallPress = useCallback(() => {
    console.log('Call button pressed!');
  }, []);

  const handleVideoPress = useCallback(() => {
    console.log('Video button pressed!');
  }, []);

  const handleAvatarPress = useCallback(() => {
    console.log('Avatar pressed!');
  }, []);

  const handleNamePress = useCallback(() => {
    console.log('Name pressed!');
  }, []);

  const headerActions = useMemo(
    () => ({
      onCallPress: handleCallPress,
      onVideoPress: handleVideoPress,
      onAvatarPress: handleAvatarPress,
      onNamePress: handleNamePress,
    }),
    [handleCallPress, handleVideoPress, handleAvatarPress, handleNamePress],
  );

  useSetHeaderActions(headerActions);

  const handleViewDocument = useCallback(
    (uriToOpen: string) => {
      viewDocument({ uri: uriToOpen, mimeType: 'application/pdf' }).catch(
        handleError,
      );
    },
    [handleError],
  );

  const RenderScrollComponent = useMemo(
    () =>
      React.forwardRef<ScrollView, ScrollViewProps>((props, ref) => (
        <KeyboardAwareScrollView
          {...props}
          ref={scrollRef => {
            scrollViewRef.current = scrollRef;
            if (typeof ref === 'function') {
              ref(scrollRef);
            } else if (ref) {
              ref.current = scrollRef;
            }
          }}
        />
      )),
    [],
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={messages}
        renderItem={item => (
          <MessageBubble
            item={item.item}
            setImageViewVisible={setImageViewVisible}
            setImageToView={setImageToView}
            setImageIndex={setImageIndex}
            handleViewDocument={handleViewDocument}
          />
        )}
        showsVerticalScrollIndicator={false}
        optimizeItemArrangement={true}
        getItemType={item => item.type}
        initialScrollIndex={messages.length - 1}
        renderScrollComponent={RenderScrollComponent}
        keyExtractor={(item, index) => item.id}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={
          <Text style={styles.placeholder}>
            No messages yet. Start the conversation!
          </Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <ChatInput setMessages={setMessages} messages={messages} />

      <ImageView
        images={imageToView}
        imageIndex={imageIndex}
        visible={imageViewVisible}
        animationType="slide"
        doubleTapToZoomEnabled={true}
        swipeToCloseEnabled={true}
        keyExtractor={(_, index) => index.toString()}
        onRequestClose={() => setImageViewVisible(false)}
        FooterComponent={({ imageIndex: index }) => (
          <View style={styles.imageViewFooter}>
            <Text style={styles.imageViewFooterText}>
              Image {index + 1} of {imageToView.length}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContainer: {
    justifyContent: 'flex-end',
    padding: 20,
  },
  separator: {
    height: 5,
  },
  placeholder: {
    fontSize: 16,
    color: '#727272',
    textAlign: 'center',
  },
  imageViewFooter: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 50,
  },
  imageViewFooterText: {
    color: 'white',
  },
});
