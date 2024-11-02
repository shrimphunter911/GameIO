import apiClient from "./api-client";

export const getMyGames = async (token: string) => {
  try {
    const response = await apiClient.get(`/games/mygames`, {
      headers: {
        "x-auth-token": token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
