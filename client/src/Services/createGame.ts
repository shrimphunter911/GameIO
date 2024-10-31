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
    const response = await apiClient.post("/games", game, {
      headers: { "x-auth-token": token },
    });
    return response.data;
  } catch (error) {
    throw new Error("Game creation failed");
  }
};
