import { Game } from "../Interfaces/game";
import apiClient from "./api-client";

interface Props {
  search: string;
  genreId: string;
  publisher: string;
  releaseDate: string;
  sortByRating: string;
}

export const searchMyGames = async (
  { search, publisher, releaseDate, sortByRating, genreId }: Props,
  page: number,
  token: string
) => {
  try {
    const response = await apiClient.get<Game[]>(
      `/games/mygames?search=${search}&publisher=${publisher}&releaseDate=${releaseDate}&sortByRating=${sortByRating}&genreId=${genreId}&limit=50&page=${page}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Login failed. Please try again.");
  }
};
