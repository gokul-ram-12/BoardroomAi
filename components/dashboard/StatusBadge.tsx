import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'working':
      case 'completed':
        return 'default'; // Green/primary styling can be applied in CSS
      case 'at risk':
      case 'error':
        return 'destructive';
      case 'planning':
      case 'idle':
        return 'secondary';
      case 'offline':
      default:
        return 'outline';
    }
  };

  const getCustomColors = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'working':
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'at risk':
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'planning':
      case 'idle':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'offline':
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Badge variant={getVariant()} className={cn("font-medium", getCustomColors())}>
      {status}
    </Badge>
  );
}
