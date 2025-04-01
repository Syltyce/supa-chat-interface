
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ChatHeader from './ChatHeader';
import ChatMessage, { MessageType } from './ChatMessage';
import ChatInput from './ChatInput';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
      type: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simuler la réponse du chatbot
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Normalement, ici vous feriez un appel à votre API Supabase
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `J'ai reçu votre message : "${content}"\n\nPour connecter ce chatbot à Supabase, nous aurons besoin d'implémenter l'API dans une prochaine étape.`,
        type: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Notification pour rappeler de connecter à Supabase
      toast({
        title: "Rappel",
        description: "Ce chatbot n'est pas encore connecté à Supabase.",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 rounded-lg overflow-hidden border border-border shadow-md">
      <ChatHeader title="Assistant Virtuel" />
      
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
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping} 
      />
    </div>
  );
};

export default ChatInterface;
