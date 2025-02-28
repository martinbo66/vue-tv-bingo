import type { Show } from '../types/Show';
import { openDB, type DBSchema } from 'idb';
import { SHOWS } from '../assets/mock-shows';

interface TVBingoDB extends DBSchema {
  shows: {
    key: number;
    value: Show;
    indexes: { 'by-title': string };
  };
}

const DB_NAME = 'tv-bingo';
const STORE_NAME = 'shows';
const DB_VERSION = 1;

const dbPromise = openDB<TVBingoDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    store.createIndex('by-title', 'showTitle');
    
    // Populate with initial data if empty
    store.transaction.oncomplete = () => {
      const showsStore = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
      SHOWS.forEach(show => {
        showsStore.add(show);
      });
    };
  },
});

export const showService = {
  async getShows(): Promise<Show[]> {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async getShowById(id: number): Promise<Show | undefined> {
    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  async addShow(show: Show): Promise<void> {
    const db = await dbPromise;
    await db.put(STORE_NAME, show);
  },

  async updateShow(show: Show): Promise<void> {
    const db = await dbPromise;
    await db.put(STORE_NAME, show);
  },

  async deleteShow(id: number): Promise<void> {
    const db = await dbPromise;
    await db.delete(STORE_NAME, id);
  },

  async searchShowsByTitle(query: string): Promise<Show[]> {
    const db = await dbPromise;
    const shows = await db.getAllFromIndex(STORE_NAME, 'by-title');
    return shows.filter(show => 
      show.showTitle.toLowerCase().includes(query.toLowerCase())
    );
  }
};
