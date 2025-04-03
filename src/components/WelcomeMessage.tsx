
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
        
        // Récupérer le token d'authentification de la session
        const { data: { session } } = await supabase.auth.getSession();
        const authToken = session?.access_token;
        
        // Utiliser l'URL complète de la fonction edge Supabase
        const response = await fetch('https://yeynylfasudfjfxzgtbo.supabase.co/functions/v1/hello', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: email
          }),
        });
        
        const data = await response.json();
        
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
