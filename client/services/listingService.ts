import api from "./api";

export const getMyListings = async () => {
  const response = await api.get("/listings/my");
  return response.data.listings;
};

export const getListing = async (id: string) => {
  const response = await api.get(`/listings/${id}`);
  return response.data.listing;
};

export const createListing = async (data: any) => {
  const response = await api.post("/listings", data);
  return response.data.listing;
};

export const updateListing = async (id: string, data: any) => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data.listing;
};

export const deleteListing = async (id: string) => {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
};

export const markListingFilled = async (id: string) => {
  const response = await api.patch(`/listings/${id}/fill`);
  return response.data.listing;
};

export const searchListings = async (params: any = {}) => {
  const response = await api.get("/listings", { params });
  return response.data;
};
