import apiClient from "./api-client";

export const deleteGame = async (token: string, gameId?: number) => {
  try {
    const response = await apiClient.delete(`/games/${gameId}`, {
      headers: { "x-auth-token": token },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
