import axios, { AxiosError } from "axios";
import { QueryClient } from "react-query";

import { Store } from "../states/store";
import { reset } from "../states/slices/authReducer";

export const API = axios.create({
  // baseURL: process.env.REACT_APP_DEV,
  // baseURL: "https://newbackendapi.azurewebsites.net/api/",
  baseURL: "https://ai-api.anambrabpp.com/api/",
});

API.defaults.headers.common.Accept = "application/json";
API.defaults.headers.common["Content-Type"] = "application/json";

//  request interceptor
API.interceptors.request.use(
  async (config: any) => {
    const { token } = Store.getState().auths;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      Store.dispatch(reset()); // Clear token using Redux action
      // restore initial auth state
      window.location.href = "/sign-in";
    }
    throw error;
  }
);

// Create a QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }: any) => {
        const response = await API.get(queryKey[0]);
        return response.data;
      },
    },
  },
});
