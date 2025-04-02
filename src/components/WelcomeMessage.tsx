
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WelcomeMessageProps {
  email: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ email }) => {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        setIsLoading(true);
        
        // Appel de votre edge function Supabase
        const { data, error } = await supabase.functions.invoke('hello', {
          body: { name: email }
        });

        if (error) {
          console.error('Erreur lors de l\'appel à l\'edge function:', error);
          return;
        }
        
        if (data && data.message) {
          setGreeting(data.message);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du message de bienvenue:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      fetchGreeting();
    }
  }, [email]);

  if (isLoading) {
    return (
      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
        <div className="animate-pulse h-4 w-56 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (!greeting) {
    return null;
  }

  return (
    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-border">
      <p className="text-sm font-medium">{greeting}</p>
    </div>
  );
};

export default WelcomeMessage;
