<template>
  <div>
    <div v-show="loading" style="text-align: center">
      <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
    </div>

    <div v-show="orders.length > 0">
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
                    <v-icon class="grey--text text--lighten-1"
                            v-tooltip:left="{ html: bages.get(order.status).tooltip }">
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
                <b>{{ selectedOrder.description }}</b><br/>
                Заказчик: <b>{{ selectedOrder.customerName }}</b><br/>
                Стоимость: <b>{{ selectedOrder.price | currency('') }} ₽</b>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="green--text darken-1" flat="flat" @click.native="showDialog = false">Отказаться</v-btn>
                <v-btn class="green--text darken-1" flat="flat" @click.native="showDialog = false; takeOrder()">Взять
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-layout>
    </div>

    <v-snackbar
      :timeout="5000"
      :bottom="true"
      :right="true"
      v-model="snackbar"
    >
      {{ snackbarText }}
      <v-btn flat class="pink--text" @click.native="snackbar = false">Закрыть</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {getAllOrders, takeOrder} from '../../utils/orders-api'

  const moment = require('moment');
  require('moment/locale/ru');

  Vue.use(require('vue-moment'), {
    moment
  });

  export default {
    name: 'orders',
    data() {
      return {
        orders: [],

        loading: true,
        snackbar: false,
        snackbarText: '',

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
          this.loading = false;
        }).catch(error => {
          console.log(error);
          this.loading = false;
          this.snackbar = true;
          this.snackbarText = 'Ошибка при загрузке списка заказов';
        });
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
      this.getAllOrders();
    }
  }
</script>
