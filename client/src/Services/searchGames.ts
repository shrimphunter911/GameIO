import apiClient from "./api-client";

interface Props {
  search: string;
  genreId: string;
  publisher: string;
  releaseDate: string;
  sortByRating: string;
}

export const searchGames = async ({ search }: Props) => {
  try {
    const response = await apiClient.get(`/games?search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error("Login failed. Please try again.");
  }
};
