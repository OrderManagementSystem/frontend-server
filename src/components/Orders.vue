<template>
  <div>
    <h2>Все заказы</h2>
    <table>
      <thead>
      <tr>
        <th>Описание</th>
        <th>Стоимость</th>
        <th>Статус</th>
        <th>Добавил</th>
        <th>Дата добавления</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders">
        <td>{{ order.description }}</td>
        <td>{{ order.price }}</td>
        <td>{{ order.status }}</td>
        <td>{{ order.customer.username }}</td>
        <td>{{ order.createdDate }}</td>
      </tr>
      </tbody>
    </table>
    <router-link to="/login">Войти</router-link>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'orders',
    data() {
      return {
        ordersEndpoint: 'http://localhost:8080/orders/',
        orders: []
      }
    },
    methods: {
      getOrder: function(id) {
        axios.get(this.ordersEndpoint + id).then((response) => {
          // do smth
        }).catch((error) => {
          console.log(error)
        })
      },
      getOrders: function() {
        axios.get(this.ordersEndpoint).then((response) => {
          this.orders = response.data
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
