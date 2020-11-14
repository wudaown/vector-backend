import os from "os";

export const hostname = os.hostname();

export const API = process.env.NODE_ENV === "development" ? `http://${hostname}:8000/api/` : `https://${hostname}/api/`;
export const mediaPrefix =
  process.env.NODE_ENV === "development"
    ? `http://${hostname}:8000/media/client/`
    : `https://${hostname}/media/client/`;
