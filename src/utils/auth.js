import Vue from 'vue'
import axios from "axios";
import Router from 'vue-router'

import {BASE_URL} from "./orders-api";
import {client_id, client_secret} from "../env";

Vue.use(Router);

const TOKEN_URL = `${BASE_URL}/oauth/token`;
const LOGGED_USER_URL = `${BASE_URL}/authenticated`;

const authUser = {
  access_token: null,
  refresh_token: null,
  user: null
};

export function login(username, password) {
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
    authUser.access_token =  response.data.access_token;
    authUser.refresh_token =  response.data.refresh_token;
    window.localStorage.setItem('authUser', JSON.stringify(authUser));

    // получение объекта авторизованного пользователя
    return axios({
      method: 'get',
      url: LOGGED_USER_URL,
      headers: getHeader()
    }).then(response => {
      authUser.user = response.data;
      window.localStorage.setItem('authUser', JSON.stringify(authUser));
    })
  })
}

export function getHeader() {
  const tokenData = JSON.parse(window.localStorage.getItem('authUser'));

  return {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + tokenData.access_token
  }
}

export function logout() {
  window.localStorage.removeItem('authUser');
}
