
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

export const useChatMessages = (user: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!user) {
          console.log("Aucun utilisateur connecté");
          setIsLoading(false);
          setMessages([{
            id: '1',
            content: "Bonjour ! Je suis votre assistant virtuel. Connectez-vous pour bénéficier d'un historique personnalisé.",
            type: 'bot',
            timestamp: new Date()
          }]);
          return;
        }

        console.log("Chargement des messages pour l'utilisateur:", user.id);
        const { data, error } = await supabase
          .from('message')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error("Erreur lors du chargement des messages:", error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger l'historique des conversations.",
            variant: "destructive"
          });
          setIsLoading(false);
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
          setMessages([{
            id: '1',
            content: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
            type: 'bot',
            timestamp: new Date()
          }]);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des messages:", err);
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
  }, [toast, user]);

  const handleSendMessage = async (content: string) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour envoyer des messages.",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      const { data: messageData, error } = await supabase
        .from('message')
        .insert([
          { 
            user_message: content,
            bot_response: null,
            user_id: user.id,
            user_email: user.email
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
      
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      
      const response = await fetch('https://yeynylfasudfjfxzgtbo.supabase.co/functions/v1/hyper-worker', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'appel à l'IA: ${response.statusText}`);
      }
      
      const aiData = await response.json();
      setIsTyping(false);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiData.response || "Désolé, je n'ai pas pu générer une réponse.",
        type: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      if (messageData && messageData[0]) {
        const { error: updateError } = await supabase
          .from('message')
          .update({ bot_response: botResponse.content })
          .eq('id', messageData[0].id);
          
        if (updateError) {
          console.error("Erreur lors de la mise à jour de la réponse:", updateError);
          toast({
            title: "Erreur",
            description: "Impossible d'enregistrer la réponse de l'IA.",
            variant: "destructive"
          });
        }
      }
      
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setIsTyping(false);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, une erreur est survenue lors de la génération de la réponse.",
        type: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec l'IA.",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    isLoading,
    isTyping,
    handleSendMessage
  };
};
