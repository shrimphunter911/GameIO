import apiClient from "./api-client";

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/auth", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
