import { AlertCircle, Inbox } from 'lucide-react';
import { cn } from '@/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 rounded-full bg-gray-100 p-4 text-text-secondary">
        {icon || <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-error/10 p-4 text-error">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-primary hover:text-primary-hover"
        >
          Try again
        </button>
      )}
    </div>
  );
}
