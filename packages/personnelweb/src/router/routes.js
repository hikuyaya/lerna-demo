import config from '@src/config'

const dynamicRoutes = () => {
    const routes = []
    const menuList = config.MENU.LIST
    //console.log('menu', menuList)

    menuList.forEach(menu => {
        if (menu.path && menu.component) {

            routes.push({
                path: menu.path,
                name: menu.name,
                meta: {title: menu.title, closable: menu.closable, auth: menu.auth || true},
                component: resolve => require([`@src/views/${menu.component}`], resolve)
            })
        }
    })

    // debugger
    // let menus = store.getters['user/menus'];
    //
    // if(menus){
    //     let filter = menus.filter(item => item.url.indexOf("/report/")!=-1);
    //     filter.forEach(item => {
    //         routes.push(  {
    //                 path: item.url,
    //                 name:item.name,
    //                 meta: { title:item.name, closable: true, auth:  true },
    //                 component: () => import('@src/views/sys/ReportAutoList.vue')
    //             }
    //         )
    //
    //     })
    // }
    routes.push({
            path: '/reporttest/:code',
            name: '/reporttest',
            meta: {title: "在线测试", closable: true, auth: true},
            component: () => import('@src/views/sys/ReportAutoList.vue')
        }
    )


    return routes
}

const routes = [
    {
        path: '/',
        name: '/',
        meta: {Auth: true},
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
