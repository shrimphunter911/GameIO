import { Review } from "../Interfaces/review";
import apiClient from "./api-client";

export const updateReview = async (
  token: string,
  params: Readonly<
    Partial<{
      gameId: string;
    }>
  >,
  review: Review
) => {
  try {
    const response = await apiClient.put<Review>(
      `/games/${params.gameId}/rating`,
      { rated: review.rated, review: review.review },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Updating review failed");
  }
};
