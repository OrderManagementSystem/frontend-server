<template>
  <div>
    <app-bar></app-bar>
    <v-tabs dark fixed centered>
      <v-tabs-bar slot="activators" class="primary">
        <v-tabs-slider class="white"></v-tabs-slider>
        <v-tabs-item
          v-for="(tab, i) in tabs"
          :key="i"
          :href="'#tab-' + i">
          {{ tab.title }}
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content
        v-for="(tab, i) in tabs"
        :key="i"
        :id="'tab-' + i"
      >
        <component v-bind:is="tab.content"></component>
      </v-tabs-content>
    </v-tabs>
  </div>
</template>

<script>
  import AppBar from '@/components/AppBar'
  import NewOrdersTab from '@/components/NewOrdersTab'
  import MyOrdersTab from '@/components/MyOrdersTab'

  export default {
    name: 'orders-page',
    components: {
      AppBar
    },
    data() {
      return {
        authUser: JSON.parse(window.localStorage.getItem('authUser')).user,
        tabs: null
      }
    },
    mounted() {
      if (this.authUser.type === 'Performer') {
        this.tabs = [
          {
            title: 'Новые заказы',
            content: NewOrdersTab
          },
          {
            title: 'Мои заказы',
            content: MyOrdersTab
          }
        ]
      } else {
        this.tabs = [
          {
            title: 'Мои заказы',
            content: MyOrdersTab
          }
        ]
      }
    }
  }
</script>
