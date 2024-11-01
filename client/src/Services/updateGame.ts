import apiClient from "./api-client";

export const updateGame = async (
  game: {
    title: string;
    description: string;
    publisher: string;
    imageUrl: string;
    releaseDate: string;
    genreIds: number[];
  },
  token: string,
  gameId?: string
) => {
  try {
    const response = await apiClient.put(`/games/${gameId}`, game, {
      headers: { "x-auth-token": token },
    });
    return response.data;
  } catch (error) {
    throw new Error("Updating game failed");
  }
};
