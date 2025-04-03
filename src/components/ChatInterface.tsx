
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import { useChatMessages } from '@/hooks/useChatMessages';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { messages, isLoading, isTyping, handleSendMessage } = useChatMessages(user);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 rounded-lg overflow-hidden border border-border shadow-md">
      <ChatHeader title="Assistant Virtuel" />
      
      {user && <WelcomeMessage email={user.email || ''} />}
      
      <ChatMessageList 
        messages={messages} 
        isLoading={isLoading} 
        isTyping={isTyping} 
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping || isLoading || !user} 
      />
    </div>
  );
};

export default ChatInterface;
