import { Genre } from "../Interfaces/genre";
import apiClient from "./api-client";
import { CanceledError } from "axios";

const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await apiClient.get<Genre[]>("/games/genres");
    return response.data;
  } catch (err) {
    if (err instanceof CanceledError) {
      throw new Error("Request canceled");
    }
    throw err;
  }
};

export default fetchGenres;
