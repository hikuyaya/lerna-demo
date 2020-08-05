import config from '@src/config'
import service from '@src/service'
const dynamicRoutes = () => {
  const routes = []
  const menuList = config.MENU.LIST
  //console.log('menu', menuList)

  menuList.forEach(menu => {
    if (menu.path && menu.component) {
      routes.push({
        path: menu.path,
        name: menu.name,
        meta: { title: menu.title, closable: menu.closable, auth: menu.auth || true },
        component: resolve => require([`@src/views/${menu.component}`], resolve)
      })
    }
  })

  return routes
}

const routes = [
  {
    path: '/',
    name: '/',
    meta: { Auth: true },
    component: () => import(`@src/theme/${$yid.config.SYSTEM.THEME}/index.vue`),
    redirect: '/sys/index',
    children: [...dynamicRoutes()]
  },

  {
    path: '/login',
    name: '/login',
    component: () => import('@src/views/components/Login.vue')
  },

  {
    path: '/noAuth',
    name: '/noAuth',
    component: () => import('@src/views/components/NoAuth.vue')
  },
  {
    path: '/notFound',
    name: '/notFound',
    component: () => import('@src/views/components/NotFound.vue')
  },
  {
    path: '*',
    redirect: '/notFound'
  }
]

export default routes
