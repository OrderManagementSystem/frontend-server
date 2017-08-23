import Vue from "vue";
import axios from "axios";
import Router from "vue-router";

import {BASE_URL} from "./orders-api";
import {client_id, client_secret} from "../env";

Vue.use(Router);

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRATION_DATE_KEY = 'expiration_date';
const AUTH_USER_KEY = 'auth_user';

const TOKEN_URL = `${BASE_URL}/oauth/token`;
const LOGGED_USER_URL = `${BASE_URL}/authenticated`;
const SIGN_UP_URL = `${BASE_URL}/users`;

export function signIn(username, password) {
  // получение access_token и refresh_token
  return axios({
    method: 'post',
    url: TOKEN_URL,

    headers: {
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
    },

    params: {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: client_id,
      client_secret: client_secret,
    },
  }).then(response => {
    setAccessToken(response.data.access_token);
    setRefreshToken(response.data.refresh_token);
    // setTokenExpirationDate(response.data.expires_in);

    // получение объекта авторизованного пользователя
    return axios({
      method: 'get',
      url: LOGGED_USER_URL,
      headers: getAuthorizationHeader()
    }).then(response => {
      setAuthUser(response.data);
    })
  })
}

export function signUp(username, password, userType) {
  // return axios({
  //   method: 'post',
  //   url: SIGN_UP_URL,
  //   data: {
  //     username: username,
  //     password: password,
  //     userType: userType
  //   },
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
}

// export function getHeader() {
// const tokenData = JSON.parse(window.localStorage.getItem('authUser'));
//
// return {
//   'Accept': 'application/json',
//   'Authorization': 'Bearer ' + tokenData.access_token
// }
// }

export function signOut() {
  clearAccessToken();
  clearRefreshToken();
  // clearTokenExpirationDate();
  clearAuthUser();
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getAuthorizationHeader() {
  return {
    'Authorization': `Bearer ${getAccessToken()}`
  }
}

export function refreshAccessToken() {
  return axios({
    method: 'POST',
    url: TOKEN_URL,
    headers: {
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
    },

    params: {
      refresh_token: getRefreshToken(),
      grant_type: REFRESH_TOKEN_KEY,
      client_id: client_id,
      client_secret: client_secret,
    },
  }).then(response => {
    setAccessToken(response.data.access_token);
    // setTokenExpirationDate(response.data.expires_in)
  })
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// function clearTokenExpirationDate() {
//   localStorage.removeItem(EXPIRATION_DATE_KEY);
// }

function clearAuthUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}

function setAccessToken(access_token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
}

function setRefreshToken(refresh_token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

function setAuthUser(auth_user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(auth_user));
}

// function setTokenExpirationDate(expires_in_seconds) {
//   const date = new Date();
//   date.setSeconds(date.getSeconds() + expires_in_seconds);
//   localStorage.setItem(EXPIRATION_DATE_KEY, date.getTime());
// }

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// function getTokenExpirationDate() {
//   return localStorage.getItem(EXPIRATION_DATE_KEY)
// }

export function getAuthUser() {
  return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
}

// function isTokenExpired() {
//   return getTokenExpirationDate() < new Date();
// }

export function isLoggedIn() {
  return !!getAccessToken();
}
