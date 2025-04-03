
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/hooks/useChatMessages';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  isTyping
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chatbot-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          content={message.content}
          type={message.type}
          timestamp={message.timestamp}
        />
      ))}
      
      {isTyping && (
        <ChatMessage
          content=""
          type="bot"
          timestamp={new Date()}
          isTyping={true}
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
