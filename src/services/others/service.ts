import { API } from "../../config";

export const getAllUpdates = async () => {
  const response = await API.get("/update");
  return response?.data?.data;
};
export const getAllFAQs = async () => {
  const response = await API.get("/faq");
  return response?.data?.data;
};
