import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import React, { useCallback, useState } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import RNBounceable from '@freakycoder/react-native-bounceable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EmojiPicker from 'rn-emoji-keyboard';
import { pick } from '@react-native-documents/picker';
import { useHandleError, width } from '../hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { errorCodes, isErrorWithCode } from '@react-native-documents/viewer';
import { toast } from '@backpackapp-io/react-native-toast';

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  messages: MessageType[];
};

export default function ChatInput({ setMessages, messages }: Props) {
  const offset = { closed: 0, opened: 20 };
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const handleError = useHandleError();

  const handleSend = useCallback(() => {
    if (text.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'text',
          sender: 'me',
          content: text,
          timestamp: Date.now(),
        },
      ]);
      setText('');
      Keyboard.dismiss();
    }
  }, [text]);

  const handleAttachment = useCallback(async () => {
    try {
      const [pickResult] = await pick({
        allowVirtualFiles: false,
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'document',
          sender: 'me',
          content: [{ uri: pickResult.uri }],
          timestamp: Date.now(),
        },
      ]);
    } catch (err: unknown) {
      handleError(err);
    }
  }, [handleError]);
  const handleCamera = useCallback(() => {
    console.log('Camera pressed');
  }, []);

  const handleEmojiPress = useCallback(() => {
    setIsOpen(true);
  }, []);
  const insets = useSafeAreaInsets();

  return (
    <KeyboardStickyView offset={offset}>
      <View
        style={[styles.inputContainer, { paddingBottom: insets.bottom || 10 }]}
      >
        <View style={styles.inputRow}>
          <View style={[styles.actionsContainer, { maxWidth: width * 0.2 }]}>
            <RNBounceable
              onPress={handleAttachment}
              style={styles.actionButton}
            >
              <MaterialIcons name="attach-file" size={24} color="#727272" />
            </RNBounceable>
            <RNBounceable
              onPress={handleEmojiPress}
              style={styles.actionButton}
            >
              <MaterialIcons name="emoji-emotions" size={24} color="#727272" />
            </RNBounceable>
          </View>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message"
              placeholderTextColor="#727272"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
              textAlignVertical="center"
            />
            {!text.trim() && (
              <RNBounceable style={styles.cameraButton} onPress={handleCamera}>
                <MaterialIcons name="camera-alt" size={24} color="#727272" />
              </RNBounceable>
            )}
          </View>

          <RNBounceable style={styles.sendButton} onPress={handleSend}>
            <MaterialIcons name="send" size={20} color="white" />
          </RNBounceable>
        </View>
      </View>

      <EmojiPicker
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onEmojiSelected={emoji => {
          setText(prev => prev + emoji.emoji);
        }}
        categoryPosition="top"
      />
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 1,
    padding: 5,
    flex: 1,
    alignItems: 'flex-end',
    height: '100%',
  },
  actionButton: {
    padding: 5,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(226,226,266,0.5)',
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center',
    minHeight: 35,
    maxHeight: 90,
  },
  cameraButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
