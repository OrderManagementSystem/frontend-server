<template>
  <div>
    <v-container fluid style="min-height: 0;" grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm8 offset-sm2 md6 offset-md3 lg4 offset-lg4 v-for="(order, i) in orders" :key="i">
          <v-card v-bind:class="{'blue lighten-4': order.status === 'IN_PROGRESS',
            'yellow lighten-2': order.status === 'READY',
            'green lighten-2': order.status === 'COMPLETED'}">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs6>
                  <span v-bind:class="{'grey--text text--lighten-4': order.status === 'COMPLETED'}">
                    {{ authUser.type === "Customer" ? order.performerName : order.customerName}}
                  </span>
                </v-flex>
                <v-flex xs6 text-xs-right v-bind:class="{'grey--text text--lighten-4': order.status === 'COMPLETED'}">
                  {{ order.createdDate | moment('calendar') }}
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex title v-bind:class="{'white--text': order.status === 'COMPLETED'}">{{ order.description }}

                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex v-bind:class="{'grey--text text--lighten-4': order.status === 'COMPLETED'}">
                  {{ order.price | currency('') }} ₽
                </v-flex>
                <v-card-actions>
                  <v-btn primary flat v-if="authUser.type === 'Performer' && order.status === 'IN_PROGRESS'"
                         @click.native.stop="showPassOrderDialog(order.id)">
                    <span>Отправить</span>
                  </v-btn>
                  <v-btn primary flat v-if="authUser.type === 'Customer' && order.status === 'READY'"
                         @click.native.stop="showAcceptOrderDialog(order.id)">
                    <span>Принять</span>
                  </v-btn>
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
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
          <v-card-text>
            <div><b>{{ selectedOrder.description }}</b></div>
            <div v-if="authUser.type === 'Performer'">Заказчик: <b>{{ selectedOrder.customerName }}</b></div>
            <div v-else>Исполнитель: <b>{{ selectedOrder.performerName }}</b></div>
            <div>Стоимость: <b>{{ selectedOrder.price | currency('') }} ₽</b></div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Нет</v-btn>
            <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false; dialogAction()">Да</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-snackbar :timeout="5000" :bottom="true" :right="true" v-model="snackbar">
      <span>{{ snackbarText }}</span>
      <v-btn flat class="pink--text" @click.native="snackbar = false">Закрыть</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading';
  import {getUserOrdersPage, passOrder, acceptOrder} from '../utils/orders-api'
  import {getAuthUser} from '../utils/auth'

  const moment = require('moment');
  require('moment/locale/ru');

  Vue.use(require('vue-moment'), {
    moment
  });

  export default {
    name: 'my-orders-tab',
    components: {
      InfiniteLoading
    },
    data() {
      return {
        authUser: getAuthUser(),
        orders: [],
        page: 0,

        snackbar: false,
        snackbarText: '',

        selectedOrder: '',
        dialog: false,
        dialogAction: null,
        dialogTitle: '',
        dialogDescription: ''
      }
    },
    methods: {
      onInfinite() {
        getUserOrdersPage(this.authUser.id, this.page).then(orders => {
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
      showPassOrderDialog(orderId) {
        this.orders.forEach(order => {
          if (order.id === orderId) {
            this.selectedOrder = order;
          }
        });
        this.dialogTitle = 'Хотите отправить заказ на проверку?';
        this.dialogAction = this.passOrder;
        this.dialog = true;
      },
      showAcceptOrderDialog(orderId) {
        this.orders.forEach(order => {
          if (order.id === orderId) {
            this.selectedOrder = order;
          }
        });
        this.dialogTitle = 'Хотите принять и оплатить заказ?';
        this.dialogAction = this.acceptOrder;
        this.dialog = true;
      },
      passOrder() {
        passOrder(this.selectedOrder.id).then(response => {
          this.selectedOrder.status = 'READY';
        }).catch(error => {
          this.snackbar = true;
          this.snackbarText = 'Не удалось отправить заказ';
        })
      },
      acceptOrder() {
        acceptOrder(this.selectedOrder.id).then(response => {
          this.selectedOrder.status = 'COMPLETED';
          this.authUser.money = this.authUser.money - this.selectedOrder.price;
        }).catch(error => {
          this.snackbar = true;
          this.snackbarText = 'Не удалось принять заказ';
        })
      }
    }
  }
</script>
