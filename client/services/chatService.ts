import api from "./api";

export const getChatHistory = async (listingId: string, tenantId: string) => {
  const response = await api.get(`/chats/${listingId}/${tenantId}`);
  return response.data.messages;
};
