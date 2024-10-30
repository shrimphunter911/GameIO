import apiClient from "./api-client";

interface Props {
  search: string;
  genreId: string;
  publisher: string;
  releaseDate: string;
  sortByRating: string;
}

export const searchGames = async ({
  search,
  publisher,
  releaseDate,
  sortByRating,
  genreId,
}: Props) => {
  try {
    const response = await apiClient.get(
      `/games?search=${search}&publisher=${publisher}&releaseDate=${releaseDate}&sortByRating=${sortByRating}&genreId=${genreId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Login failed. Please try again.");
  }
};
