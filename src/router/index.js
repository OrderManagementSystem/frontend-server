import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Orders from '@/components/Orders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    },
  ],
  mode: 'history'
})
