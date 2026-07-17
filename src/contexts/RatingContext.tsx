import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface RatingEntry {
  sum: number;
  count: number;
  /** last rating by this browser session (optional) */
  myRating?: number;
}

type RatingsMap = Record<string, RatingEntry>;

interface RatingContextType {
  rateItem: (itemId: string, stars: number) => void;
  getRating: (itemId: string) => { average: number; count: number; myRating?: number };
  getAllRatings: () => RatingsMap;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);
const STORAGE_KEY = 'wubate-ratings';

function loadRatings(): RatingsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as RatingsMap;
  } catch {
    return {};
  }
}

export function RatingProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<RatingsMap>(() =>
    typeof localStorage !== 'undefined' ? loadRatings() : {}
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const rateItem = (itemId: string, stars: number) => {
    const value = Math.min(5, Math.max(1, Math.round(stars)));
    setRatings((prev) => {
      const current = prev[itemId];
      if (current?.myRating) {
        // Replace previous rating from this device
        const sum = current.sum - current.myRating + value;
        return {
          ...prev,
          [itemId]: { sum, count: current.count, myRating: value },
        };
      }
      return {
        ...prev,
        [itemId]: {
          sum: (current?.sum || 0) + value,
          count: (current?.count || 0) + 1,
          myRating: value,
        },
      };
    });
  };

  const getRating = (itemId: string) => {
    const entry = ratings[itemId];
    if (!entry || entry.count === 0) return { average: 0, count: 0 };
    return {
      average: entry.sum / entry.count,
      count: entry.count,
      myRating: entry.myRating,
    };
  };

  const getAllRatings = () => ratings;

  return (
    <RatingContext.Provider value={{ rateItem, getRating, getAllRatings }}>
      {children}
    </RatingContext.Provider>
  );
}

export function useRatings() {
  const ctx = useContext(RatingContext);
  if (!ctx) throw new Error('useRatings must be used within RatingProvider');
  return ctx;
}
