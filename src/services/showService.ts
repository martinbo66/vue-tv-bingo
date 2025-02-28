import type { Show } from '../types/Show';
import { SHOWS } from '../assets/mock-shows';

export const showService = {
  getShows: async (): Promise<Show[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return SHOWS;
  },

  getShowById: async (id: number): Promise<Show | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return SHOWS.find(show => show.id === id);
  }
};
