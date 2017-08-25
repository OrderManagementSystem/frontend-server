<template>
  <div>
    <v-container
      fluid
      style="min-height: 0;"
      grid-list-lg
    >
      <v-layout row wrap>

        <v-flex xs12 sm8 offset-sm2 md6 offset-md3 lg4 offset-lg4 v-for="order in orders">
          <v-card class="">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs6>
                  <span class="grey--text text--darken-1">{{ order.customerName }}</span>
                </v-flex>
                <v-flex xs6 text-xs-right>
                  <span class="grey--text">{{ order.createdDate | moment('calendar') }}</span>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <div class="title grey--text text--darken-3">{{ order.description }}</div>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <div class="grey--text text--darken-2">{{ order.price | currency('') }} ₽</div>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn primary flat>Взять</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!--<div v-show="orders.length > 0">-->
    <!--<v-layout row>-->
    <!--<v-flex xs12 sm6 offset-sm3>-->
    <!--<v-card>-->
    <!--<v-list two-line>-->
    <!--<template v-for="(order, index) in orders">-->
    <!--<v-list-tile ripple v-bind:key="index" @click.native.stop="takeOrderDialog(order.id)">-->
    <!--<v-list-tile-content>-->
    <!--<v-list-tile-title>{{ order.description }}</v-list-tile-title>-->
    <!--<v-list-tile-sub-title class="grey&#45;&#45;text text&#45;&#45;darken-4">-->
    <!--{{ order.price | currency('') }} ₽-->
    <!--</v-list-tile-sub-title>-->
    <!--<v-list-tile-sub-title>{{ order.customerName }}</v-list-tile-sub-title>-->
    <!--</v-list-tile-content>-->
    <!--<v-list-tile-action>-->
    <!--<v-list-tile-action-text>-->
    <!--{{ order.createdDate | moment('calendar') }}-->
    <!--</v-list-tile-action-text>-->
    <!--<v-icon class="grey&#45;&#45;text text&#45;&#45;lighten-1"-->
    <!--v-tooltip:left="{ html: bages[order.status].tooltip }">-->
    <!--{{ bages[order.status].icon }}-->
    <!--</v-icon>-->
    <!--</v-list-tile-action>-->
    <!--</v-list-tile>-->
    <!--<v-divider v-if="index + 1 < orders.length"></v-divider>-->
    <!--</template>-->
    <!--</v-list>-->
    <!--</v-card>-->
    <!--</v-flex>-->

    <!--<v-layout row justify-center>-->
    <!--<v-dialog v-model="showDialog">-->
    <!--<v-card>-->
    <!--<v-card-title class="headline">Взять заказ?</v-card-title>-->
    <!--<v-card-text>-->
    <!--<b>{{ selectedOrder.description }}</b><br/>-->
    <!--Заказчик: <b>{{ selectedOrder.customerName }}</b><br/>-->
    <!--Стоимость: <b>{{ selectedOrder.price | currency('') }} ₽</b>-->
    <!--</v-card-text>-->
    <!--<v-card-actions>-->
    <!--<v-spacer></v-spacer>-->
    <!--<v-btn class="green&#45;&#45;text darken-1" flat="flat" @click.native="showDialog = false">Отказаться</v-btn>-->
    <!--<v-btn class="green&#45;&#45;text darken-1" flat="flat" @click.native="showDialog = false; takeOrder()">Взять-->
    <!--</v-btn>-->
    <!--</v-card-actions>-->
    <!--</v-card>-->
    <!--</v-dialog>-->
    <!--</v-layout>-->
    <!--</v-layout>-->
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
      <v-progress-circular slot="spinner" indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
      <span slot="no-results">Нет заказов</span>
      <span slot="no-more">Всего {{ orders.length }} заказов</span>
    </infinite-loading>
    <!--</div>-->

    <!--<v-snackbar-->
    <!--:timeout="5000"-->
    <!--:bottom="true"-->
    <!--:right="true"-->
    <!--v-model="snackbar"-->
    <!--&gt;-->
    <!--{{ snackbarText }}-->
    <!--<v-btn flat class="pink&#45;&#45;text" @click.native="snackbar = false">Закрыть</v-btn>-->
    <!--</v-snackbar>-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading';
  import {getOrdersPage, takeOrder, bages} from '../utils/orders-api'
  import VCardMedia from "vuetify/src/components/cards/VCardMedia";

  const moment = require('moment');
  require('moment/locale/ru');

  Vue.use(require('vue-moment'), {
    moment
  });

  export default {
    name: 'new-orders-tab',
    components: {
      VCardMedia, InfiniteLoading
    },
    data() {
      return {
        orders: [],
        page: 0,

        snackbar: false,
        snackbarText: '',

        showDialog: false,
        selectedOrder: '',
        bages
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
      takeOrderDialog(orderId) {
        this.orders.forEach(order => {
          if (order.id === orderId) {
            this.selectedOrder = order;
          }
        });
        this.showDialog = true;
      },
    }
  }
</script>
