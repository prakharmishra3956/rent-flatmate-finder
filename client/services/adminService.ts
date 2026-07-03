import api from "./api";

export const getAdminStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data.stats;
};

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data.users;
};

export const deleteAdminUser = async (id: string) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAdminListings = async () => {
  const response = await api.get("/admin/listings");
  return response.data.listings;
};

export const deleteAdminListing = async (id: string) => {
  const response = await api.delete(`/admin/listings/${id}`);
  return response.data;
};

export const toggleAdminListingFilled = async (id: string) => {
  const response = await api.patch(`/admin/listings/${id}/fill`);
  return response.data.listing;
};
