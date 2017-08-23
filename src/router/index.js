import Vue from "vue";
import VueRouter from "vue-router";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import OrdersPage from "@/pages/OrdersPage";
import {isLoggedIn} from '../utils/auth'

Vue.use(VueRouter);

const routes = [
  {
    path: '/sign-in',
    name: 'SignInPage',
    component: SignInPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/sign-up',
    name: 'SignUpPage',
    component: SignUpPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'OrdersPage',
    component: OrdersPage,
    meta: {
      requiresAuth: true
    }
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/sign-in')
  } else if (!to.meta.requiresAuth && isLoggedIn()) {
    next('/')
  }

  next();
});

export default router;
