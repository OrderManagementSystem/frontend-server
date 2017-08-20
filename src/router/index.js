import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import OrdersTabs from '@/components/OrdersTabs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },    {
      path: '/orders',
      name: 'OrdersTabs',
      component: OrdersTabs
    },
  ],
  mode: 'history'
})
