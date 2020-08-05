import Vue from 'vue'
import Router from 'vue-router'

import yid from '@src/library'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  // 1. 是否需要验证权限
  if (!to.meta.hasOwnProperty('Auth') || to.meta.Auth === false) {
    return next()
  }

  // 2. 需要验证权限的情况下
  if (to.meta.Auth === true) {
    // 记录 referrer
    yid.referrer = to

    // 验证权限
    if (yid.cache.get(yid.type.USER.TOKEN, yid.type.SYSTEM.CACHE.LOCAL_STORAGE)) {
      return next()
    } else {
      return next(yid.config.SYSTEM.ROUTER_LOGIN)
    }
  }
})

export default router
