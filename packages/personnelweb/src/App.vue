<!--
 * @Author: wqy
 * @Date: 2022-08-10 18:16:48
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 09:31:52
 * @FilePath: \personnelweb\src\App.vue
 * @Description: 
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import yid from '@src/library'

export default {
  beforeDestroy() {
    yid.service.IM.stopIM()
  },
  created() {
    document.title = yid.config.SYSTEM.TITLE
    // const dev = process.env.NODE_ENV === 'development'
    // if (dev) {
    //   return
    // }
    // setTimeout(() => {
    //   yid.service.IM.initIM()
    // }, 1000)
    if (yid.cache.get(yid.type.USER.TOKEN)) {
      // 跳转登录后首页
      this.$router.push(yid.config.SYSTEM.DIRECT_HOME)
    } else {
      this.$router.push(yid.config.SYSTEM.ROUTER_LOGIN)
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      // if(newVal.path && newVal.path == '/') {
      //   this.$router.push(yid.config.SYSTEM.DIRECT_HOME)
      // }
    }
  },
  methods: {}
}
</script>

<style></style>
