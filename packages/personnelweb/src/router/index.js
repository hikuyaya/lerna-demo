import Vue from 'vue'
import Router from 'vue-router'

import yid from '@src/library'
import routes from './routes'
import config from '@src/config'
import store from '@src/store'

Vue.use(Router)

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  // 1. 是否需要验证权限
  let menus = store.getters['user/menus']
  //修复route 标题
  if (menus) {
    let menu = menus.filter(item => item.url == to.path)[0]
    if (menu && menu.name) {
      to.meta.title = menu.name
    }
  }

  if (to.fullPath && to.fullPath.indexOf('/report') != -1) {
    // console.log(queryVariable)
    Object.assign(to.params, to.meta.params)
    //    to.params = {...to.params,... queryVariable}
    // to["fullPath"]=to.fullPath.substr(0, to.fullPath.indexOf("?"))
  }
  // console.error(menuList.filter(item => item.path == to.path)[0])
  if (!to.meta.hasOwnProperty('Auth') || to.meta.Auth === false) {
    return next()
  }

  to.meta.title = window.document.title
  // window.document.title = to.meta.title;
  // 2. 需要验证权限的情况下
  if (to.meta.Auth === true) {
    // 记录 referrer
    yid.referrer = to

    // 验证权限
    if (
      yid.cache.get(yid.type.USER.TOKEN, yid.type.SYSTEM.CACHE.LOCAL_STORAGE)
    ) {
      return next()
    } else {
      return next(yid.config.SYSTEM.ROUTER_LOGIN)
    }
  }
})
router.$addRoutes = params => {
  // router.matcher = new Router({mode: 'history'}).matcher;
  // router.addRoutes(params)
  router.options.routes.push(params)
  router.addRoute('/', params)
}

export default router
