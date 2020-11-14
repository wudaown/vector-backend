import axios from "axios";
import { API } from "./constants";

const Axios = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// interceptor to add token to header
// TODO
// Add else branch to handle no token found
Axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// interceptor to handle different HTTP RESPONSE STATUS
Axios.interceptors.response.use(
  response => {
    if (response.status === 204) {
      return response;
    }
    if (!response.data) {
      // console.log(response.data);
      return Promise.reject(response);
    }

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  },
  error => {
    console.log(error);
    if (error.response.status === 401) {
    } else if (error.response.status === 400) {
      return Promise.reject(error.response.data);
    }

    if (error.response.status === 403) {
      return Promise.reject(error);
    }

    if (error.response.status === 405) {
      return Promise.reject(error);
    }

    return Promise.reject(error.response.data);
  }
);

export default Axios;
