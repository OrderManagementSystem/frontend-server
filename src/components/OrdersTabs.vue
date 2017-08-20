<template>
  <v-tabs dark fixed centered>
    <v-tabs-bar slot="activators" class="primary">
      <v-tabs-slider class="white"></v-tabs-slider>
      <v-tabs-item href="#tab-0">
        Все заказы
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
</template>

<script>
  import AllOrdersTab from '@/components/tabs/AllOrdersTab'
  import MyOrdersTab from '@/components/tabs/MyOrdersTab'

  export default {
    name: 'OrdersTabs',
    data() {
      return {
        tabs: [
          AllOrdersTab,
          MyOrdersTab
        ]
      }
    }
  }
</script>
