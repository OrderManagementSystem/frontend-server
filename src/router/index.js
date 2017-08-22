import Vue from "vue";
import VueRouter from "vue-router";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import OrdersPage from "@/pages/OrdersPage";

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
  const authUser = JSON.parse(window.localStorage.getItem('authUser'));
  const authorized = authUser && authUser.access_token;

  if (to.meta.requiresAuth && !authorized) {
    next('/sign-in')
  } else if (!to.meta.requiresAuth && authorized) {
    next('/')
  }

  next();
});

export default router;
