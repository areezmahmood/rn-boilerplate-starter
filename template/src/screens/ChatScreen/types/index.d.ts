type MessageContent = string | { uri: string }[];

type MessageType = {
  id: string;
  type: 'text' | 'image' | 'document';
  sender: 'me' | 'other';
  content: MessageContent;
  timestamp: number;
};
