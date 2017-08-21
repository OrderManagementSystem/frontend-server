<template>
  <div>
    <app-bar></app-bar>
    <v-tabs dark fixed centered>
      <v-tabs-bar slot="activators" class="primary">
        <v-tabs-slider class="white"></v-tabs-slider>
        <v-tabs-item href="#tab-0">
          Новые заказы
        </v-tabs-item>
        <v-tabs-item href="#tab-1">
          Мои заказы
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content
        v-for="(tab, i) in tabs"
        :key="i"
        :id="'tab-' + i"
      >
        <component v-bind:is="tab"></component>
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
        tabs: [
          NewOrdersTab,
          MyOrdersTab
        ]
      }
    }
  }
</script>
