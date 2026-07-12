import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-secondary/60 transition-colors duration-200 resize-none',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
