import api from "./api";

export const getOwnerStats = async () => {
  const response = await api.get("/dashboard/owner");
  return response.data.stats;
};
