import { API } from "../../config";
import {
  RegisTerTypes,
  LoginTypes,
  EditProfileType,
  UpdatePasswordTypes,
} from "./type";

export const RegisterApi = async (data: RegisTerTypes) => {
  const response = await API.post("/register", data);
  return response?.data;
};

export const LoginApi = async (data: LoginTypes) => {
  const response = await API.post("/login", data);
  return response?.data;
};

export const deleteAccountApi = async (
  password: { password: string },
  id: number | string
) => {
  const response = await API.post(`/delete-account/${id}`, password);
  return response?.data;
};

export const UpdatePasswordApi = async (
  data: UpdatePasswordTypes,
  id: number | string
) => {
  const response = await API.post(`/change-password/${id}`, data);
  return response?.data;
};

export const SessionApi = async () => {
  const response = await API.get("/sessions");
  return response?.data?.data;
};
export const RemoveAllSessionApi = async () => {
  const response = await API.post("/sessions/revoke-all");
  return response?.data;
};
export const deleteSessionApi = async (id: number | string) => {
  const response = await API.delete(`/sessions/${id}/revoke`);
  return response?.data;
};

export const editProfileApi = async (
  data: EditProfileType | FormData,
  id: number | string
) => {
  const response = await API.post(`/edit-profile/${id}`, data, {
    headers: { "Content-Type": "multipart/formdata" },
  });
  return response.data;
};
