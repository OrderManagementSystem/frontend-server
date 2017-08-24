import axios from "axios";
import {client_id, client_secret} from "../env";
import {getRefreshToken, setAccessToken, signOut} from "./auth";

const HTTP = axios.create();

HTTP.defaults.baseURL = 'http://localhost:8080';
// HTTP.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

HTTP.interceptors.response.use(undefined, error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    return HTTP({
      method: 'POST',
      url: '/oauth/token',

      params: {
        refresh_token: getRefreshToken(),
        grant_type: 'refresh_token',
        client_id: client_id,
        client_secret: client_secret,
      },
    }).then(({data}) => {
      setAccessToken(data.access_token);
      HTTP.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
      return HTTP(originalRequest);
    }).catch(error => {
      signOut()
    })
  }

  return Promise.reject(error);
});

export default HTTP;
