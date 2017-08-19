<template>
  <div>
    <h2>Вход</h2>
    <form v-on:submit:prevent="login()">
      <label for="username">Имя пользователя</label>
      <input v-model="username" id="username" type="text"/>
      <label for="password">Пароль</label>
      <input v-model="password" id="password" type="password"/>
      <input type="submit" value="Вход"/>
    </form>
    <router-link :to="{ path: '/' }">На главную</router-link>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        username: '',
        password: ''
      }
    }
  }
</script>
