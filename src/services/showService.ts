interface Show {
  id: number;
  title: string;
  description: string;
  genre: string;
  imageUrl?: string;
  active: boolean;
}

const mockShows: Show[] = [
  {
    id: 1,
    title: "Survivor",
    description: "Reality competition show where contestants compete in challenges while living on a remote island",
    genre: "Reality",
    active: true
  },
  {
    id: 2,
    title: "The Bachelor",
    description: "Dating reality show where one person dates multiple contestants",
    genre: "Reality",
    active: true
  },
  {
    id: 3,
    title: "Big Brother",
    description: "Reality show where contestants live together in a house under constant surveillance",
    genre: "Reality",
    active: true
  },
  {
    id: 4,
    title: "Amazing Race",
    description: "Teams race around the world completing challenges",
    genre: "Reality Competition",
    active: true
  }
];

export const showService = {
  getShows: async (): Promise<Show[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockShows;
  },

  getShowById: async (id: number): Promise<Show | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockShows.find(show => show.id === id);
  }
};

export type { Show };
