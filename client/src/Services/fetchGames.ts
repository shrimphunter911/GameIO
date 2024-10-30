import { Game } from "../Interfaces/game";
import apiClient from "./api-client";
import { CanceledError } from "axios";

const fetchGames = async (signal: AbortSignal): Promise<Game[]> => {
  try {
    const response = await apiClient.get<Game[]>("/games", { signal });
    return response.data;
  } catch (err) {
    if (err instanceof CanceledError) {
      throw new Error("Request canceled");
    }
    throw err;
  }
};

export default fetchGames;
