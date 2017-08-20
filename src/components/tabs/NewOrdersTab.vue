<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-list two-line>
          <template v-for="(order, index) in orders">
            <v-list-tile ripple v-bind:key="index" @click.native.stop="takeOrderDialog(order.id)">
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

    <v-layout row justify-center>
      <v-dialog v-model="showDialog">
        <v-card>
          <v-card-title class="headline">Взять заказ?</v-card-title>
          <v-card-text>
            Хотите взять заказ <i>{{ selectedOrder.description }}</i> от
            <b>{{ selectedOrder.customer.username }}</b> за <b>{{ selectedOrder.price | currency('') }} ₽</b>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="showDialog = false">Отказаться</v-btn>
            <v-btn class="green--text darken-1" flat="flat" @click.native="takeOrder()">Взять</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
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
        showDialog: false,
        selectedOrder: {
          customer: {
            username: ''
          }
        },
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
      },
      takeOrderDialog(orderId) {
        this.orders.forEach(order => {
          if (order.id === orderId) {
            this.selectedOrder = order;
          }
        });
        this.showDialog = true;
      },
      takeOrder(order) {
        this.showDialog = false;
        axios.patch(this.ordersEndpoint + order.id + '/take');
        // todo: удалить этот заказ из списка
      }
    },
    mounted() {
      this.getOrders()
    }
  }
</script>
