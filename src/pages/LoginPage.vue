<template>
  <div class="outer">
    <div class="middle">
      <div class="inner">
        <form v-on:submit.prevent="submit()">
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs12 sm12 md4 offset-md4>
                <!--<h2 class="display-1">Вход в систему</h2>-->
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
      </div>
    </div>

    <v-snackbar
      :timeout="5000"
      :bottom="true"
      :right="true"
      v-model="snackbar"
    >
      Ошибка авторизации
    <v-btn flat class="pink--text" @click.native="snackbar = false">Закрыть</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from "axios";
  import Router from 'vue-router'
  import {login} from '../utils/auth'

  Vue.use(Router);

  export default {
    name: 'login-page',
    data() {
      return {
        username: '',
        password: '',
        passwordVisible: false,
        loading: false,
        snackbar: false
      }
    },
    methods: {
      submit() {
        this.loading = true;
        login(this.username, this.password
        ).then(response => {
          this.loading = false;
          this.$router.replace('/')
        }).catch(error => {
          this.loading = false;
          this.snackbar = true;
          this.password = '';
        })
      }
    }
  }
</script>

<style>
  .outer {
    display: table;
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .middle {
    display: table-cell;
    vertical-align: middle;
  }

  .inner {
    margin-left: auto;
    margin-right: auto;
    /*width: !*whatever width you want*!;*/
  }
</style>
