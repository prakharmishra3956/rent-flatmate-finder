import api from "./api";

export interface TenantProfileData {
  preferredLocation: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  preferredRoomType: "Single" | "Double" | "Shared";
  preferredAmenities?: string[];
}

export const getTenantProfile = async () => {
  try {
    const response = await api.get("/tenant/profile");
    return response.data.profile;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createTenantProfile = async (data: TenantProfileData) => {
  const response = await api.post("/tenant/profile", data);
  return response.data.profile;
};

export const updateTenantProfile = async (data: TenantProfileData) => {
  const response = await api.put("/tenant/profile", data);
  return response.data.profile;
};

export const getCompatibilityScore = async (listingId: string) => {
  const response = await api.get(`/tenant/compatibility/${listingId}`);
  return response.data.compatibility;
};

export const expressInterest = async (listingId: string, message: string) => {
  const response = await api.post("/interests", { listingId, message });
  return response.data.interest;
};

export const getSentInterests = async () => {
  const response = await api.get("/interests/tenant");
  return response.data.interests;
};
