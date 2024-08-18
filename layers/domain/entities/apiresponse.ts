export type CategoryApiResponse = {
  id: number;
  name: string;
  date_of_last_change: string;
  pictures: {
    id: number;
    name: string;
    url: string;
    category: number;
  }[];
};

export type CategoryInfoApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    name: string;
    date_of_last_change: string;
  }[];
};
