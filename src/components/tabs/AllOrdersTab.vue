<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-list two-line>
          <template v-for="(order, index) in orders">
            <v-list-tile ripple v-bind:key="index">
              <v-list-tile-content>
                <v-list-tile-title>{{ order.description }}</v-list-tile-title>
                <v-list-tile-sub-title class="grey--text text--darken-4">
                  {{ order.price | currency('') }} ₽
                </v-list-tile-sub-title>
                <v-list-tile-sub-title>{{ order.customer.username }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>
                  {{ order.createdDate | moment('calendar') }}
                </v-list-tile-action-text>
                <v-icon class="grey--text text--lighten-1" v-tooltip:left="{ html: bages.get(order.status).tooltip }">
                  {{ bages.get(order.status).icon }}
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < orders.length"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'

  const moment = require('moment');
  require('moment/locale/' + navigator.language);

  Vue.use(require('vue-moment'), {
    moment
  });

  export default {
    name: 'orders',
    data() {
      return {
        ordersEndpoint: 'http://192.168.1.3:8080/orders/',
        orders: [],
        bages: new Map([
          ['WAITING', {
            icon: 'new_releases',
            tooltip: 'Новый заказ'
          }],
          ['IN_PROGRESS', {
            icon: 'fast_forward',
            tooltip: 'Заказ выполняется'
          }],
          ['READY', {
            icon: 'done',
            tooltip: 'Заказ выполнен и ожидает оплаты'
          }],
          ['COMPLETED', {
            icon: 'done_all',
            tooltip: 'Заказ выполнен и оплачен'
          }]
        ])
      }
    },
    methods: {
      getOrder: function (id) {
        axios.get(this.ordersEndpoint + id).then((response) => {
          // do smth
        }).catch((error) => {
          console.log(error)
        })
      },
      getOrders: function () {
        axios.get(this.ordersEndpoint).then((response) => {
          this.orders = response.data.map(function (order) {
            order.createdDate = new Date(order.createdDate + 'Z').toString();
            return order
          });
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getOrders()
    }
  }
</script>
