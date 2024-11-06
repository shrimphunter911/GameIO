import { Game } from "../Interfaces/game";
import apiClient from "./api-client";

export const createGame = async (
  game: {
    title: string;
    description: string;
    publisher: string;
    imageUrl: string;
    releaseDate: string;
    genreIds: number[];
  },
  token: string
) => {
  try {
    const response = await apiClient.post<Game>("/games", game, {
      headers: { "x-auth-token": token },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
