import apiClient from "./api-client";

export const deleteGame = async (token: string, gameId?: number) => {
  try {
    const response = await apiClient.delete(`/games/${gameId}`, {
      headers: { "x-auth-token": token },
    });
    return response.data;
  } catch (error) {
    throw new Error("Deletion failed");
  }
};
