
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Charger l'historique des messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('message')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error("Erreur lors du chargement des messages:", error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger l'historique des conversations.",
            variant: "destructive"
          });
          setIsLoading(false);
          // Afficher un message par défaut
          setMessages([{
            id: '1',
            content: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
            type: 'bot',
            timestamp: new Date()
          }]);
          return;
        }
        
        if (data && data.length > 0) {
          const formattedMessages: Message[] = [];
          
          // Convertir les données de la base en messages pour l'interface
          data.forEach(item => {
            if (item.user_message) {
              formattedMessages.push({
                id: `user-${item.id}`,
                content: item.user_message,
                type: 'user',
                timestamp: new Date(item.created_at)
              });
            }
            
            if (item.bot_response) {
              formattedMessages.push({
                id: `bot-${item.id}`,
                content: item.bot_response,
                type: 'bot',
                timestamp: new Date(item.created_at)
              });
            }
          });
          
          setMessages(formattedMessages);
        } else {
          // Aucun message dans l'historique, afficher un message par défaut
          setMessages([{
            id: '1',
            content: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
            type: 'bot',
            timestamp: new Date()
          }]);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des messages:", err);
        // Message par défaut en cas d'erreur
        setMessages([{
          id: '1',
          content: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
          type: 'bot',
          timestamp: new Date()
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [toast]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // Ajouter le message de l'utilisateur à l'interface
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
        setIsTyping(false);
        return;
      }
      
      // Simuler une réponse du bot
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
            toast({
              title: "Erreur",
              description: "Impossible d'enregistrer la réponse du bot.",
              variant: "destructive"
            });
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chatbot-primary"></div>
          </div>
        ) : (
          <>
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
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping || isLoading} 
      />
    </div>
  );
};

export default ChatInterface;
