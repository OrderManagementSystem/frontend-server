<template>
  <nav>
    <router-link to="/">На главную</router-link>
    <router-link to="/login">Вход</router-link>
    <router-link to="/orders">Заказы</router-link>
  </nav>
</template>

<script>
  export default {
    name: 'NavBar'
  }
</script>
