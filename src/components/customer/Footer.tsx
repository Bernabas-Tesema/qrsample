import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { capitalizeDay } from '@/utils';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .55.04.81.11v-3.55a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.32a8.27 8.27 0 0 0 4.84 1.56V7.42a4.85 4.85 0 0 1-1.08-.73z" />
    </svg>
  );
}

export function CustomerFooter() {
  const { restaurant, slug } = useRestaurant();
  const { t } = useLanguage();
  const basePath = `/r/${slug}`;
  const hours = restaurant?.opening_hours;
  const social = restaurant?.social_links;

  return (
    <footer className="border-t border-border bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-text-primary">
              {restaurant?.name}
            </h3>
            {restaurant?.description && (
              <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                {restaurant.description}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">{t('contactTitle')}</h4>
            <ul className="mt-3 space-y-2">
              {restaurant?.address && (
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {restaurant.address}
                </li>
              )}
              {restaurant?.phone && (
                <li className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`tel:${restaurant.phone}`} className="hover:text-primary">
                    {restaurant.phone}
                  </a>
                </li>
              )}
              {restaurant?.email && (
                <li className="flex items-center gap-2 text-sm text-text-secondary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${restaurant.email}`} className="hover:text-primary">
                    {restaurant.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">{t('openingHours')}</h4>
            <ul className="mt-3 space-y-1.5">
              {hours &&
                Object.entries(hours).map(([day, time]) => (
                  <li key={day} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="w-24 font-medium text-text-primary">{capitalizeDay(day)}</span>
                    <span>{time}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">{t('quickLinks')}</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to={basePath} className="text-sm text-text-secondary hover:text-primary">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  to={`${basePath}/menu`}
                  className="text-sm text-text-secondary hover:text-primary"
                >
                  {t('menu')}
                </Link>
              </li>
              <li>
                <Link
                  to={`${basePath}/categories`}
                  className="text-sm text-text-secondary hover:text-primary"
                >
                  {t('categories')}
                </Link>
              </li>
            </ul>

            <h4 className="mt-5 text-sm font-semibold text-text-primary">{t('followUs')}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white p-2 shadow-sm text-text-secondary hover:text-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white p-2 shadow-sm text-text-secondary hover:text-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {social?.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white p-2 shadow-sm text-text-secondary hover:text-primary"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white p-2 shadow-sm text-text-secondary hover:text-primary"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {social?.whatsapp && (
                <a
                  href={social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white p-2 shadow-sm text-text-secondary hover:text-primary"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-text-secondary">
          <p className="italic">{t('priceNote')}</p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} {restaurant?.name}. All rights reserved.
          </p>
          <p className="mt-4 text-xs">
            {t('developedBy')}{' '}
            <span className="font-semibold text-text-primary">KOKO tech soln</span>
          </p>
          <p className="mt-1 text-xs">
            <a href="tel:0979858938" className="hover:text-primary">
              0979858938
            </a>
            {' · '}
            <a href="tel:0991394509" className="hover:text-primary">
              0991394509
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
