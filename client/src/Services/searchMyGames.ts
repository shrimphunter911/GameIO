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
  token: string
) => {
  try {
    const response = await apiClient.get(
      `/games/mygames?search=${search}&publisher=${publisher}&releaseDate=${releaseDate}&sortByRating=${sortByRating}&genreId=${genreId}`,
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
