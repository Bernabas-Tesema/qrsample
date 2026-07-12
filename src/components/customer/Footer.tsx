import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Share2 } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { PRICE_NOTE } from '@/data/daros-menu';
import { capitalizeDay } from '@/utils';

export function CustomerFooter() {
  const { restaurant, slug } = useRestaurant();
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
            <h4 className="text-sm font-semibold text-text-primary">Contact</h4>
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
            <h4 className="text-sm font-semibold text-text-primary">Opening Hours</h4>
            <ul className="mt-3 space-y-1.5">
              {hours && Object.entries(hours).map(([day, time]) => (
                <li key={day} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="font-medium text-text-primary w-24">{capitalizeDay(day)}</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to={basePath} className="text-sm text-text-secondary hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to={`${basePath}/menu`} className="text-sm text-text-secondary hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link to={`${basePath}/categories`} className="text-sm text-text-secondary hover:text-primary">
                  Categories
                </Link>
              </li>
            </ul>

            {(social?.facebook || social?.instagram) && (
              <div className="mt-4 flex gap-3">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white p-2 shadow-sm text-text-secondary hover:text-primary hover:shadow-md transition-all"
                    aria-label="Facebook"
                  >
                    <Share2 className="h-4 w-4" />
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white p-2 shadow-sm text-text-secondary hover:text-primary hover:shadow-md transition-all"
                    aria-label="Instagram"
                  >
                    <Share2 className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-text-secondary">
          <p className="italic">{PRICE_NOTE}</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} {restaurant?.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
