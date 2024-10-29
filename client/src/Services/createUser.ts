import apiClient from "./api-client";

export const creatUser = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/users", formData);
    return response.data;
  } catch (error) {
    throw new Error("Signup failed. Please try again.");
  }
};
