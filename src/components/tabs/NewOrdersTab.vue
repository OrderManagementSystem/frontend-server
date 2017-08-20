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
                <v-list-tile-sub-title>{{ order.customerName }}</v-list-tile-sub-title>
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
            <b>{{ selectedOrder.customerName }}</b> за <b>{{ selectedOrder.price | currency('') }} ₽</b>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="showDialog = false">Отказаться</v-btn>
            <v-btn class="green--text darken-1" flat="flat" @click.native="showDialog = false; takeOrder()">Взять</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-layout>


</template>

<script>
  import Vue from 'vue'
  import { getAllOrders, takeOrder } from '../../utils/orders-api'

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
        selectedOrder: '',
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
      getAllOrders() {
        getAllOrders().then(orders => {
          this.orders = orders;
        })
      },
      takeOrder(order) {
        takeOrder(order.id);
      },
      takeOrderDialog(orderId) {
        this.orders.forEach(order => {
          if (order.id === orderId) {
            this.selectedOrder = order;
          }
        });
        this.showDialog = true;
      },
    },
    mounted() {
      this.getAllOrders()
    }
  }
</script>
