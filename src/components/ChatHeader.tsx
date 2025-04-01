
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  title: string;
  status?: 'online' | 'offline';
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, status = 'online' }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">{title}</h2>
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs", 
            status === 'online' ? "bg-green-100 text-green-700 border-green-200" : 
            "bg-gray-100 text-gray-700 border-gray-200"
          )}
        >
          {status === 'online' ? 'En ligne' : 'Hors ligne'}
        </Badge>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';

export default ChatHeader;
