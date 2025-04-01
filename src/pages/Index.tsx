
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/ChatInterface';
import { Bot, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  // Vérifier la connexion à Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Tentative simple de requête à Supabase
        const { data, error } = await supabase
          .from('message')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error('Erreur de connexion Supabase:', error);
          setIsConnected(false);
          toast({
            title: "Problème de connexion",
            description: "Impossible de se connecter à Supabase.",
            variant: "destructive",
          });
        } else {
          console.log('Connexion Supabase établie:', data);
          setIsConnected(true);
          toast({
            title: "Connexion réussie",
            description: "Votre application est connectée à Supabase.",
          });
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de connexion:', err);
        setIsConnected(false);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la vérification de connexion à Supabase.",
          variant: "destructive",
        });
      }
    };

    checkConnection();
  }, [toast]);
  
  const showSupabaseStatus = () => {
    if (isConnected === null) {
      toast({
        title: "Vérification en cours",
        description: "La connexion à Supabase est en cours de vérification...",
      });
    } else if (isConnected) {
      toast({
        title: "Connecté à Supabase",
        description: "Votre application est correctement connectée à la base de données.",
      });
    } else {
      toast({
        title: "Non connecté",
        description: "Votre application n'est pas connectée à Supabase.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-chatbot-light to-white dark:from-gray-900 dark:to-gray-950">
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-chatbot-primary" />
            <h1 className="text-2xl font-bold">SupaChat</h1>
          </div>
          <Button 
            variant={isConnected ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={showSupabaseStatus}
          >
            <Database size={16} />
            {isConnected === true ? "Connecté à Supabase" : 
             isConnected === false ? "Connexion échouée" : 
             "Vérifier la connexion"}
          </Button>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold text-center">Assistant Virtuel</h2>
          <p className="text-center text-muted-foreground mb-6">
            {isConnected ? "Interface de chatbot connectée à Supabase" : 
                          "Interface de chatbot en attente de connexion"}
          </p>
          
          <div className="h-[600px] w-full animate-fade-in">
            <ChatInterface />
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          Interface de chatbot créée avec Lovable
          {isConnected !== null && (
            <span className="ml-2">
              • {isConnected ? "Connectée à Supabase" : "Non connectée à Supabase"}
            </span>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Index;
