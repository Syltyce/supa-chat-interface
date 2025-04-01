
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

export type MessageType = 'user' | 'bot';

interface ChatMessageProps {
  content: string;
  type: MessageType;
  timestamp?: Date;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  type, 
  timestamp = new Date(), 
  isTyping = false
}) => {
  const isUser = type === 'user';
  
  return (
    <div className={cn(
      "flex w-full items-start gap-2 py-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 bg-chatbot-primary text-white">
            <Bot size={16} />
          </Avatar>
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2",
        isUser 
          ? "bg-chatbot-primary text-white" 
          : "bg-gray-100 dark:bg-gray-800 text-foreground",
        isTyping && "animate-pulse"
      )}>
        {isTyping ? (
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-current animate-bounce-subtle"></div>
            <div className="h-2 w-2 rounded-full bg-current animate-bounce-subtle" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 rounded-full bg-current animate-bounce-subtle" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {content}
          </div>
        )}
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 bg-gray-300 dark:bg-gray-600">
            <User size={16} />
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
