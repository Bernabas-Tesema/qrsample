import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { capitalizeDay } from '@/utils';

export function AboutPage() {
  const { restaurant } = useRestaurant();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          About {restaurant?.name}
        </h1>
      </div>

      {restaurant?.description && (
        <div className="mt-8 rounded-2xl border border-border bg-white p-8 shadow-sm">
          <p className="text-lg leading-relaxed text-text-secondary">
            {restaurant.description}
          </p>
        </div>
      )}

      {restaurant?.welcome_message && (
        <blockquote className="mt-8 border-l-4 border-primary pl-6">
          <p className="font-display text-xl italic text-text-primary">
            &ldquo;{restaurant.welcome_message}&rdquo;
          </p>
        </blockquote>
      )}

      {restaurant?.opening_hours && (
        <div className="mt-8 rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-text-primary">
            <Clock className="h-5 w-5 text-primary" />
            Opening Hours
          </h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(restaurant.opening_hours).map(([day, time]) => (
              <li key={day} className="flex justify-between text-sm">
                <span className="font-medium text-text-primary">{capitalizeDay(day)}</span>
                <span className="text-text-secondary">{time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ContactPage() {
  const { restaurant } = useRestaurant();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-text-secondary">
          We&apos;d love to hear from you
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {restaurant?.address && (
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-primary/10 p-3">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Address</h3>
              <p className="mt-1 text-text-secondary">{restaurant.address}</p>
              {restaurant.google_maps_url && (
                <a
                  href={restaurant.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover"
                >
                  View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {restaurant?.phone && (
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-primary/10 p-3">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Phone</h3>
              <a href={`tel:${restaurant.phone}`} className="mt-1 text-text-secondary hover:text-primary">
                {restaurant.phone}
              </a>
            </div>
          </div>
        )}

        {restaurant?.email && (
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-primary/10 p-3">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Email</h3>
              <a href={`mailto:${restaurant.email}`} className="mt-1 text-text-secondary hover:text-primary">
                {restaurant.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
