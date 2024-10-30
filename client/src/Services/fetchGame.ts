import { Game } from "../Interfaces/game";
import apiClient from "./api-client";
import { CanceledError } from "axios";

const fetchGame = async (
  signal: AbortSignal,
  params: Readonly<
    Partial<{
      gameId: string;
    }>
  >
): Promise<Game> => {
  try {
    const response = await apiClient.get<Game>(`/games/${params.gameId}`, {
      signal,
    });
    return response.data;
  } catch (err) {
    if (err instanceof CanceledError) {
      throw new Error("Request canceled");
    }
    throw err;
  }
};

export default fetchGame;
