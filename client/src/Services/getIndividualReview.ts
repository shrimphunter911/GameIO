import { Review } from "../Interfaces/review";
import apiClient from "./api-client";

export const getIndividualReview = async (
  token: string,
  params: Readonly<
    Partial<{
      gameId: string;
    }>
  >
) => {
  try {
    const response = await apiClient.get<Review>(
      `/games/${params.gameId}/rating`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
