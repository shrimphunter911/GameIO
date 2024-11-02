import { Game } from "../Interfaces/game";
import apiClient from "./api-client";
import { CanceledError } from "axios";

const fetchGames = async (page: number) => {
  try {
    const response = await apiClient.get<Game[]>(`/games?limit=6&page=${page}`);
    return response.data;
  } catch (err) {
    if (err instanceof CanceledError) {
      throw new Error("Request canceled");
    }
    throw err;
  }
};

export default fetchGames;
