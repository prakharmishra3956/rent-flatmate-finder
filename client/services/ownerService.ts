import api from "./api";

export const getReceivedInterests = async () => {
  const response = await api.get("/interests/owner");
  return response.data.interests;
};

export const updateInterestStatus = async (interestId: string, status: "Accepted" | "Rejected") => {
  const response = await api.patch(`/interests/${interestId}/status`, { status });
  return response.data.interest;
};
