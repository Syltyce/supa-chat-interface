
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ChatHeader from './ChatHeader';
import ChatMessage, { MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSendMessage = async (content: string) => {
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simuler l'attente de réponse du chatbot
    setIsTyping(true);
    
    try {
      // Enregistrer le message utilisateur dans Supabase
      const { data, error } = await supabase
        .from('message')
        .insert([
          { 
            user_message: content,
            bot_response: null
          }
        ])
        .select();

      if (error) {
        console.error("Erreur lors de l'enregistrement du message:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre message.",
          variant: "destructive"
        });
        return;
      }
      
      // Simuler une réponse
      setTimeout(async () => {
        setIsTyping(false);
        
        // Réponse du chatbot
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `J'ai bien reçu votre message : "${content}"\n\nComment puis-je vous aider davantage ?`,
          type: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // Mettre à jour la réponse du bot dans Supabase
        if (data && data[0]) {
          const { error: updateError } = await supabase
            .from('message')
            .update({ bot_response: botResponse.content })
            .eq('id', data[0].id);
            
          if (updateError) {
            console.error("Erreur lors de la mise à jour de la réponse:", updateError);
          }
        }
      }, 1500);
      
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setIsTyping(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec Supabase.",
        variant: "destructive"
      });
    }
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
