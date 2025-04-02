
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { LogOut } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground rounded-t-lg">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center gap-2">
        {user && (
          <span className="text-sm hidden md:inline">
            {user.email}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent hover:bg-primary-foreground hover:text-primary border-primary-foreground text-primary-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
