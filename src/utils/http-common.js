import axios from "axios";
import {signOut} from "./auth";
import {BASE_URL} from '../env'

const HTTP = axios.create();

HTTP.defaults.baseURL = BASE_URL;
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
