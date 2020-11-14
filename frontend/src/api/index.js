import axios from "../utils/AxiosPlugin";
import { hostname } from "../utils/constants";

export const CreateClientAPI = async params => {
  return await axios.post("client/", params);
};

export const GetClientsAPI = async () => {
  return await axios.get("client/");
};

export const DeleteClientAPI = async id => {
  return await axios.delete(`client/${id}`);
};

export const LoginAPI = async params => {
  const endpoint =
    process.env.NODE_ENV === "development"
      ? `http://${hostname}:8000/api-token-auth/`
      : `https://${hostname}/api-token-auth/`;
  delete axios.defaults.headers["Authorization"];
  return await axios.post(endpoint, params);

  // return fetch(endpoint, {
  //   method: "POST", // or 'PUT'
  //   body: JSON.stringify(params), // data can be `string` or {object}!
  //   headers: new Headers({
  //     "Content-Type": "application/json",
  //   }),
  // })
  //   .then(res => res.json())
  //   .catch(error => console.error("Error:", error))
  //   .then(response => response.token);
};
