import { cn } from '@/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={cn(
        'inline-flex rounded-full border border-border bg-white p-0.5 text-xs font-semibold',
        className
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          lang === 'en' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('am')}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          lang === 'am' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'
        )}
      >
        አማ
      </button>
    </div>
  );
}
