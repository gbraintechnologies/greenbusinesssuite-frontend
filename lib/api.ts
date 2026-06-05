import axios from "axios";

const rootBaseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
export const apiBaseURL = rootBaseURL;
export const meshBaseURL = `${rootBaseURL}/mesh-suite/v1.0`;

export const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const meshApi = axios.create({
  baseURL: meshBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const multipartMeshApi = axios.create({
  baseURL: meshBaseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
