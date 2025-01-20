import { API } from "../../config";

export const SendMessage = async (data: any) => {
  const response = await API.post("/chat", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response?.data;
};

export const uploadFileApi = async (file: any) => {
  const response = await API.post("/documents", file, {
    headers: { "Content-Type": "multipart/formdata" },
  });

  return response.data;
};

export const getChats = async (page: number) => {
  const response = await API.get(`/chat?page=${page}`);
  return response?.data;
};
export const getAllChats = async () => {
  const response = await API.get(`/chat`);
  return response?.data;
};
export const deleteChat = async (id: string) => {
  const response = await API.delete(`/chat/${id}`);
  return response.data;
};
export const archiveChat = async (id: string) => {
  const response = await API.post(`/chats/${id}/archive`);
  return response.data;
};
export const UnArchiveChat = async (id: string) => {
  const response = await API.post(`/chats/${id}/unarchive`);
  return response.data;
};
export const markChatAsFavorite = async (id: string) => {
  const response = await API.post(`/chats/${id}/favorite`);
  return response.data;
};
export const RemoveFromFavorite = async (id: string) => {
  const response = await API.post(`/chats/${id}/unfavorite`);
  return response.data;
};

export const getArchivedChats = async () => {
  const response = await API.get("/chats/archived");
  return response?.data?.data;
};

export const getFavoritesChats = async () => {
  const response = await API.get("/chats/favorites");
  return response?.data?.data;
};
