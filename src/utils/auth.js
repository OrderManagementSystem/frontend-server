import HTTP from './http-common'
import router from "../router";

import {client_id, client_secret} from "../env";

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_USER_KEY = 'auth_user';

export function signIn(username, password) {
  return HTTP({
    method: 'POST',
    url: '/oauth/token',

    params: {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: client_id,
      client_secret: client_secret,
    }
  }).then(({data}) => {
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
    HTTP.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

    return HTTP.get('/authenticated').then(({data}) => {
      setAuthUser(data);
      router.replace('/')
    }).catch(error => {
      signOut()
    })
  })
}

export function signUp(username, password, userType) {
  return HTTP.post('/users', {
    username,
    password,
    userType
  }).then(response => {
    return signIn(username, password)
  })
}

export function signOut() {
  clearAccessToken();
  clearRefreshToken();
  clearAuthUser();
  router.replace('/sign-in')
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function clearAuthUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}

export function setAccessToken(access_token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
}

function setRefreshToken(refresh_token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

function setAuthUser(auth_user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(auth_user));
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAuthUser() {
  return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
}

export function isLoggedIn() {
  return !!getAccessToken();
}
