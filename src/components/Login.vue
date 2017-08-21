<template>
  <form v-on:submit.prevent="login()">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm12 md4 offset-md4>
          <h2 class="display-1">Вход в систему</h2>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                label="Имя пользователя"
                autofocus="autofocus"
                v-model="username"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                name="password"
                label="Пароль"
                v-model="password"
                :append-icon="passwordVisible ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (passwordVisible = !passwordVisible)"
                :type="passwordVisible ? 'text' : 'password'"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 cl text-xs-right>
              <v-btn primary :loading="loading" type="submit">Войти</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </form>
</template>

<script>
  import Vue from 'vue'
  import axios from "axios";
  import Router from 'vue-router'
  import {getHeader} from '../utils/auth'
  import {BASE_URL} from "../utils/orders-api";
  import {client_id, client_secret} from "../env";

  Vue.use(Router);

  const TOKEN_URL = `${BASE_URL}/oauth/token`;
  const LOGGED_USER_URL = `${BASE_URL}/authenticated`;

  const authUser = {
    access_token: null,
    refresh_token: null,
    user: null
  };

  export default {
    name: 'login',
    data() {
      return {
        username: '',
        password: '',
        passwordVisible: false,
        loading: false
      }
    },
    methods: {
      login() {
        this.loading = true;
        // получение access_token и refresh_token
        axios({
          method: 'POST',
          url: TOKEN_URL,

          headers: {
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
          },

          params: {
            username: this.username,
            password: this.password,
            grant_type: 'password',
            client_id: client_id,
            client_secret: client_secret,
          },
        }).then(response => {
          authUser.access_token =  response.data.access_token;
          authUser.refresh_token =  response.data.refresh_token;
          window.localStorage.setItem('authUser', JSON.stringify(authUser));

          // получение объекта авторизованного пользователя
          axios({
            method: 'GET',
            url: LOGGED_USER_URL,
            headers: getHeader()
          }).then(response => {
            authUser.user = response.data;
            window.localStorage.setItem('authUser', JSON.stringify(authUser));

            this.loading = false;
          }).catch(error => console.log(error))
        }).catch(error => console.log(error));
      }
    }
  }
</script>
