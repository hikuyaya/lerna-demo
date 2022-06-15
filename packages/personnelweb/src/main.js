/*
 * @Author: leejee
 * @Description: 程序入口文件
 * @Date: 2017-12-05
 */

import Vue from 'vue'
import store from '@src/store'
import router from '@src/router'

// root component
import App from '@src/App.vue'

// library
import library from '@src/library'
Vue.use(library.install)
//Print打印
import Print from 'vue-print-nb'
Vue.use(Print)
// UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' //element-ui的css
Vue.use(ElementUI, { size: 'mini' })
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
// css
import '@src/assets/css/index.scss'
import '@src/utils/components.js' // 自定义组件

import VueQrcode from '@chenfengyuan/vue-qrcode'

Vue.component(VueQrcode.name, VueQrcode)

import Vue2Editor from 'vue2-editor'
Vue.use(Vue2Editor)

// initial
const vueAppInstance = new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

// 兼容 IE 9、10 低版本的 __proto__
Object.setPrototypeOf
  ? Object.setPrototypeOf($yid, vueAppInstance)
  : ($yid.__proto__ = vueAppInstance)

//引入 avue
import Avue from '../src/library/avue/src/index'
import '../src/library/avue/styles/index.scss'
Vue.use(Avue, {
  size: '',
  menuType: 'text',
  qiniu: {},
  ali: {},
  theme: '',
  canvas: {}
})

import Sortable from 'sortablejs'
import xlsx from 'xlsx-style'
import axios from '../src/library/http'
window.Sortable = Sortable
window.XLSX = xlsx
window.axios = axios
