<template>
  <div class="sys-index">
    <div style="margin-left: 90px">
      <div class="time">{{ time }} {{ getWeek() }}</div>
      <div class="name">{{ userInfo.eename }}，欢迎你！</div>
      <div class="tag" style="margin-top: 30px">登录点：总部</div>
      <div class="tag">上次登录时间：{{ userInfo.lastlogin }}</div>
      <div class="tag">用户名：{{ hideName(userName) }}</div>
    </div>
  </div>
</template>

<script>
import yid from '@src/library'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import service from '../../service'

Vue.use(VueClipboard)

import ECharts from 'vue-echarts'

import 'echarts/lib/chart/bar'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import moment from 'moment'
import { mapGetters } from 'vuex'

Vue.component('v-chart', ECharts)
export default {
  data() {
    return {
      time: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      userName: 'user/userName',
      nickName: 'user/nickName'
    })
  },
  created() {
    moment.locale()
    this.time = moment().format('YYYY年MM月DD日')
  },

  mounted() {
    this.get()
  },

  methods: {
    hideName(name) {
      if (name) {
        let count = name.length - 1
        let first = name.substring(0, 1)
        let stars = ''
        for (let i = 0; i < count; i++) {
          stars = stars + '*'
        }
        return first + stars
      }
    },
    getWeek() {
      let a = new Array('日', '一', '二', '三', '四', '五', '六')
      let week = new Date().getDay()
      let str = '星期' + a[week]
      return str
    },
    get() {
      let parm = { page: 1, limit: 10 }
      yid.service.index.getAdminMsg(parm).then(res => {
        this.sysMessages = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-index {
  display: flex;
  align-items: center;
  height: 100%;
  background: #fff url('../../assets/images/admin.png') right center no-repeat !important;
  background-size: 430px 506px !important;
  .time {
    font-size: 16px;
    color: #666666;
  }
  .name {
    font-size: 24px;
    color: #333333;
  }
  .tag {
    color: #333333;
  }
}
</style>
