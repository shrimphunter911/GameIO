import apiClient from "./api-client";

export const createUser = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/users", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
