<template>
  <v-toolbar dark class="primary" dense>
    <v-toolbar-title class="white--text">
      <v-icon dark medium>account_balance_wallet</v-icon>
      {{ authUser.money | currency('') }} ₽
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-layout row justify-center style="position: relative;">
      <v-dialog v-model="dialog" lazy absolute>
        <v-btn icon slot="activator">
          <v-icon medium>power_settings_new</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <div class="headline">Выход</div>
          </v-card-title>
          <v-card-text>
            Уверены, что хотите выйти?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Остаться</v-btn>
            <v-btn class="green--text darken-1" flat="flat" @click.native="logout()">Выйти</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-toolbar>
</template>

<script>
  import Vue from 'vue'
  import Vue2Filters from 'vue2-filters'
  import {logout} from '../utils/auth'

  Vue.use(Vue2Filters);

  export default {
    name: 'app-bar',
    data() {
      return {
        dialog: false,
        authUser: JSON.parse(window.localStorage.getItem('authUser')).user
      }
    },
    methods: {
      logout() {
        logout();
        this.$router.push('/login')
      }
    }
  }
</script>
