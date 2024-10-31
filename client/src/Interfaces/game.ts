export interface Game {
  id?: number;
  title: string;
  description: string;
  releaseDate: string;
  publisher: string;
  imageUrl: string;
  avg_rating?: number;
  genreIds: number[];
}
