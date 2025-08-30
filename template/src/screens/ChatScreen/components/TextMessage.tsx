import { View, Text } from 'react-native';
import React from 'react';

type Props = {
  message: string;
};

export default function TextMessage({ message }: Props) {
  return <Text>{message}</Text>;
}
