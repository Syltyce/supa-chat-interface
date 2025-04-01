
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/ChatInterface';
import { Bot, Database } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  
  const showSupabaseToast = () => {
    toast({
      title: "Connexion Supabase",
      description: "Pour utiliser toutes les fonctionnalités, vous devez connecter ce projet à Supabase.",
    });
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
            variant="outline" 
            className="flex items-center gap-2"
            onClick={showSupabaseToast}
          >
            <Database size={16} />
            Connexion Base de Données
          </Button>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold text-center">Assistant Virtuel</h2>
          <p className="text-center text-muted-foreground mb-6">
            Interface de chatbot prête à être connectée à Supabase
          </p>
          
          <div className="h-[600px] w-full animate-fade-in">
            <ChatInterface />
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          Interface de chatbot créée avec Lovable
        </div>
      </footer>
    </div>
  );
};

export default Index;
