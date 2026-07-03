import api from "./api";

export const registerUser = async (data: any) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: any) => {
  const response = await api.post("/auth/login", data);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};
