import axios from "axios";
import {signOut} from "./auth";

const HTTP = axios.create();

HTTP.defaults.baseURL = 'http://localhost:8080';
const access_token = localStorage.getItem('access_token');
if (!!access_token) {
  HTTP.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
}

HTTP.interceptors.response.use(undefined, error => {
  if (error.message === 'Network Error' || error.response.status === 401) {
    signOut()
  } else {
    return Promise.reject(error);
  }
});

export default HTTP;
