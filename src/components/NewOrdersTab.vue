<template>
  <div>
    <v-container fluid style="min-height: 0;" grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm8 offset-sm2 md6 offset-md3 lg4 offset-lg4 v-for="(order, i) in orders" :key="i">
          <v-card class="">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs6>
                  <span class="grey--text text--darken-1">{{ order.customerName }}</span>
                </v-flex>
                <v-flex xs6 text-xs-right grey--text>{{ order.createdDate | moment('calendar') }}</v-flex>
              </v-layout>
              <v-layout>
                <v-flex title grey--text text--darken-3>{{ order.description }}</v-flex>
              </v-layout>
              <v-layout>
                <v-flex grey--text text--darken-2>{{ order.price | currency('') }} ₽</v-flex>
                <v-card-actions>
                  <v-btn primary flat @click.native.stop="showTakeOrderDialog(order.id)">Взять</v-btn>
                </v-card-actions>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
      <v-progress-circular slot="spinner" indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
      <span slot="no-results">Нет заказов</span>
      <span slot="no-more">Всего {{ orders.length }} заказов</span>
    </infinite-loading>

    <v-layout row justify-center>
      <v-dialog v-model="takeOrderDialog">
        <v-card>
          <v-card-title class="headline">Взять заказ?</v-card-title>
          <v-card-text>
            <div><b>{{ selectedOrder.description }}</b></div>
            <div>Заказчик: <b>{{ selectedOrder.customerName }}</b></div>
            <div>Стоимость: <b>{{ selectedOrder.price | currency('') }} ₽</b></div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="takeOrderDialog = false">Нет</v-btn>
            <v-btn class="green--text darken-1" flat="flat" @click.native="takeOrderDialog = false; takeOrder()">
              Взять
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

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
  import InfiniteLoading from 'vue-infinite-loading';
  import {getOrdersPage, takeOrder} from '../utils/orders-api'
  import VCardMedia from "vuetify/src/components/cards/VCardMedia";

  const moment = require('moment');
  require('moment/locale/ru');

  Vue.use(require('vue-moment'), {
    moment
  });

  export default {
    name: 'new-orders-tab',
    components: {
      InfiniteLoading
    },
    data() {
      return {
        orders: [],
        page: 0,

        snackbar: false,
        snackbarText: '',

        takeOrderDialog: false,
        selectedOrder: '',
      }
    },
    methods: {
      onInfinite() {
        getOrdersPage(this.page).then(orders => {
          if (orders.length === 0) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          } else {
            this.orders = this.orders.concat(orders);
            this.page++;
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          }
        }).catch(error => {
          this.snackbar = true;
          this.snackbarText = 'Ошибка при загрузке списка заказов';
        })
      },
      takeOrder() {
        takeOrder(this.selectedOrder.id).then(response => {
          this.orders.splice(this.orders.indexOf(this.selectedOrder), 1);
        }).catch(error => {
          this.snackbar = true;
          this.snackbarText = 'Возможно, заказ уже кто-то взял';
          this.orders.splice(this.orders.indexOf(this.selectedOrder), 1);
        })
      },
      showTakeOrderDialog(orderId) {
        this.orders.forEach(order => {
          if (order.id === orderId) {
            this.selectedOrder = order;
          }
        });
        this.takeOrderDialog = true;
      },
    }
  }
</script>
