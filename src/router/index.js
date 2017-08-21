import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "@/components/LoginPage";
import OrdersPage from "@/components/OrdersPage";

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/',
    name: 'OrdersPage',
    component: OrdersPage
  },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  const authUser = JSON.parse(window.localStorage.getItem('authUser'));
  const authorized = authUser && authUser.access_token;

  if ((to.path === '/') && !authorized) {
    next('/login')
  } else if ((to.path === '/login') && authorized) {
    next('/')
  }

  next();
});

export default router;
