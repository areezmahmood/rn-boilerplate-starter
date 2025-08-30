import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import RNBounceable from '@freakycoder/react-native-bounceable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  documentItems: { uri: string }[];
  handleViewDocument: (uri: string) => void;
};
export default function DocumentMessage({
  documentItems,
  handleViewDocument,
}: Props) {
  return (
    <RNBounceable onPress={() => handleViewDocument(documentItems[0].uri)}>
      <View style={styles.documentContainer}>
        <MaterialIcons name="insert-drive-file" size={40} color="#727272" />
        <Text style={styles.documentText}>View Document</Text>
      </View>
    </RNBounceable>
  );
}

const styles = StyleSheet.create({
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  documentText: {
    color: '#727272',
  },
});
