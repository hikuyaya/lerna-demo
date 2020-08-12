/*
 * @Author: leejee
 * @Description: 程序配置文件
 * @Date: 2017-12-05
 */

export const SYSTEM = {
  /** Important */
  /** 系统唯一值, 建议使用 36 位 uuid */
  /** 该值是唯一且必须的 */
  /** 该值只需要配置一次 */
  UNIQUE_VALUE: '2370c881-0acc-4993-b996-1fbcfb4a9961',

  /** 系统标题配置项 */
  TITLE: '椰岛SASS平台后台管理系统',

  /** 系统主题配置 */
  THEME: 'default',

  /** 无权限页路由配置项 */
  ROUTER_NO_AUTH: '/noAuth',
  /** 登录页路由配置项 */
  ROUTER_LOGIN: '/login',
  /** 登陆后首页路由配置项 */
 // ROUTER_HOME: '/sys/index',
  DIRECT_HOME: '/sys/index',
  // CLIENTID
  CLIENTID: process.env.VUE_APP_CLIENTID,
  //CLIENTSECRET
  CLIENTSECRET: process.env.VUE_APP_CLIENTSECRET,
}

export const MENU = {
  /** 基础菜单列表配置项 */
  LIST: [
    { id: 1, pid: null, name: '系统设置', title: null, path: null, icon: 'iconfont-channelmanagement' },
    { id: 11, pid: 1, name: '系统首页', title: '系统首页', path: '/sys/index', component: 'sys/index.vue', icon: null },
    {
      id: 12,
      pid: 1,
      name: '账号管理',
      title: '账号管理',
      path: '/sys/manage',
      component: 'sys/manage.vue',
      icon: null
    },
    { id: 13,
      pid: 1,
      name: '消息中心',
      title: '消息中心',
      path: '/sys/newscenter',
      component: 'sys/newsCenter',
      icon: null
    },
    { id: 14,
      pid: 1,
      name: '系统操作日志',
      title: '系统操作日志',
      path: '/sys/log',
      component: 'sys/log',
      icon: null
    },
    { id: 15,
      pid: 1,
      name: '基础信息',
      title: '基础信息',
      path: '/sys/info',
      component: 'sys/info',
      icon: null
    },
    { id: 16,
      pid: 1,
      name: '设置权限',
      title: '设置权限',
      path: '/sys/authConfig',
      component: 'sys/authConfig',
      icon: null,
      canShow: true
    },
    { id: 2, pid: null, name: '人事管理', title: null, path: null, icon: 'iconfont-channelmanagement' },
    { id: 21,
      pid: 2,
      name: '员工资料',
      title: '员工资料',
      path: '/staff/profile',
      component: 'staff/profile',
      icon: null,
      canShow: true
    },
    { id: 3, pid: null, name: '库存系统', title: null, path: null, icon: 'iconfont-channelmanagement' },
    { id: 31,
      pid: 3,
      name: '品牌管理',
      title: '品牌管理',
      path: '/stock/productBrand',
      component: 'stock/productBrand',
      icon: null,
      canShow: true
    },
    { id: 32,
      pid: 3,
      name: '产品库存信息',
      title: '产品库存信息',
      path: '/stock/info',
      component: 'stock/info',
      icon: null,
      canShow: true
    },
    { id: 33,
      pid: 3,
      name: '产品安全库存管理',
      title: '产品安全库存管理',
      path: '/stock/secure',
      component: 'stock/secure',
      icon: null,
      canShow: true
    },
    { id: 34,
      pid: 3,
      name: '产品入库单',
      title: '产品入库单',
      path: '/stock/warehousing',
      component: 'stock/warehousing',
      icon: null,
      canShow: true
    },
    { id: 35,
      pid: 3,
      name: '产品出库单',
      title: '产品出库单',
      path: '/stock/outStock',
      component: 'stock/outStock',
      icon: null,
      canShow: true
    },
    { id: 36,
      pid: 3,
      name: '库存基本配置',
      title: '库存基本配置',
      path: '/stock/basicConfig',
      component: 'stock/basicConfig',
      icon: null,
      canShow: true
    },
      { id: 37,
          pid: 3,
          name: '入库单明细',
          title: '入库单明细',
          path: '/stock/warehousingCon',
          component: 'stock/warehousingCon',
          icon: null,
          canShow: false
      },
      { id: 38,
          pid: 3,
          name: '出库单明细',
          title: '出库单明细',
          path: '/stock/outStockCon',
          component: 'stock/outStockCon',
          icon: null,
          canShow: false
      },
      { id: 39,
        pid: 3,
        name: '产品基础资料表',
        title: '产品基础资料表',
        path: '/stock/product',
        component: 'stock/product',
        icon: null,
        canShow: true
      },
    { id: 4, pid: null, name: '预约管理', title: null, path: null, icon: 'iconfont-channelmanagement' },
    { id: 41,
      pid: 4,
      name: '预约看板',
      title: '预约看板',
      path: '/appoint/board',
      component: 'appoint/board',
      icon: null,
      canShow: true
    },
    { id: 42,
      pid: 4,
      name: '预约列表',
      title: '预约列表',
      path: '/appoint/list',
      component: 'appoint/list',
      icon: null,
      canShow: true
    },
    { id: 43,
      pid: 4,
      name: '预约统计',
      title: '预约统计',
      path: '/appoint/statistics',
      component: 'appoint/statistics',
      icon: null,
      canShow: true
    },
    { id: 44,
      pid: 4,
      name: '预约设置',
      title: '预约设置',
      path: '/appoint/config',
      component: 'appoint/config',
      icon: null,
      canShow: true
    },{
          id: 45,
          pid: 4,
          name: '员工预约管理',
          title: '员工预约管理',
          path: '/shop/empyy',
          component: 'shop/empyy',
          icon: null,
          canShow: true
      },
    { id: 5, pid: null, name: '财务管理', title: null, path: null, icon: 'iconfont-channelmanagement' },
    { id: 51,
      pid: 5,
      name: '工资奖罚项管理',
      title: '工资奖罚项管理',
      path: '/finance/salaryManage',
      component: 'finance/salaryManage',
      icon: null,
      canShow: true
    },
    { id: 52,
      pid: 5,
      name: '员工工资奖罚管理',
      title: '员工工资奖罚管理',
      path: '/finance/salaryRewardDetail',
      component: 'finance/salaryRewardDetail',
      icon: null,
      canShow: true
    },
    { id: 53,
      pid: 5,
      name: '员工工资明细',
      title: '员工工资明细',
      path: '/finance/salaryDetail',
      component: 'finance/salaryDetail',
      icon: null,
      canShow: true
    },
    { id: 54,
      pid: 5,
      name: '员工提成明细',
      title: '员工提成明细',
      path: '/finance/bonusDetail',
      component: 'finance/bonusDetail',
      icon: null,
      canShow: true
    },
    { id: 55,
      pid: 5,
      name: '员工奖罚明细表',
      title: '员工奖罚明细表',
      path: '/finance/awardDesc',
      component: 'finance/awardDesc',
      icon: null,
      canShow: true
    },
      { id: 55,
          pid: 5,
          name: '退款',
          title: '退款',
          path: '/finance/refund',
          component: 'finance/refund',
          icon: null,
          canShow: true
      },
    { id: 6, pid: null, name: '会员管理', title: null, path: null, icon: 'iconfont-channelmanagement' },
      { id: 60,
          pid: 6,
          name: '会员资料',
          title: '会员资料',
          path: '/member/memberinfo',
          component: 'member/memberinfo',
          icon: null,
          canShow: true
      },
    { id: 61,
      pid: 6,
      name: '会员关系管理',
      title: '会员关系管理',
      path: '/member/relations',
      component: 'member/relations',
      icon: null,
      canShow: true
    },
    { id: 62,
      pid: 6,
      name: '会员统计分析',
      title: '会员统计分析',
      path: '/member/statistics',
      component: 'member/statistics',
      icon: null,
      canShow: true
    },
    { id: 63,
      pid: 6,
      name: '顾客评价记录',
      title: '顾客评价记录',
      path: '/member/reviews',
      component: 'member/reviews',
      icon: null,
      canShow: true
    },
    { id: 64,
      pid: 6,
      name: '基础设置',
      title: '基础设置',
      path: '/member/config',
      component: 'member/config',
      icon: null,
      canShow: true
    },
    { id: 7, pid: null, name: '营业记录', title: null, path: null, icon: 'iconfont-channelmanagement' },
    {
      id: 71,
      pid: 7,
      name: '服务单记录',
      title: '服务单记录',
      path: '/record/serviceBill',
      component: 'record/serviceBill',
      icon: null,
      canShow: true
    },
    {
      id: 72,
      pid: 7,
      name: '开卡充值记录',
      title: '开卡充值记录',
      path: '/record/recharge',
      component: 'record/recharge',
      icon: null,
      canShow: true
    },
    {
      id: 73,
      pid: 7,
      name: '套餐销售记录',
      title: '套餐销售记录',
      path: '/record/saleRecord',
      component: 'record/saleRecord',
      icon: null,
      canShow: true
    },

    {
      id: 74,
      pid: 7,
      name: '撒单记录',
      title: '撒单记录',
      path: '/record/',
      component: 'record/withDrawRecord',
      icon: null,
      canShow: true
    },
    {
      id: 75,
      pid: 7,
      name: '收款流水',
      title: '收款流水',
      path: '/record/statistic',
      component: 'record/statistic',
      icon: null,
      canShow: true
    },
    { id: 8, pid: null, name: '基础设置', title: null, path: null, icon: 'iconfont-channelmanagement' },
    {
      id: 81,
      pid: 8,
      name: '部门和职位配置',
      title: '部门和职位配置',
      path: '/setting/dept',
      component: 'setting/dept',
      icon: null,
      canShow: true
    },
    {
      id: 82,
      pid: 8,
      name: '基础分类设置',
      title: '基础分类设置',
      path: '/setting/catalog',
      component: 'setting/catalog',
      icon: null,
      canShow: true
    },
    {
      id: 83,
      pid: 8,
      name: '服务项目配置',
      title: '服务项目配置',
      path: '/setting/serveConfig',
      component: 'setting/serveConfig',
      icon: null,
      canShow: true
    },
    {
      id: 84,
      pid: 8,
      name: '套餐项目配置',
      title: '套餐项目配置',
      path: '/setting/packConfig',
      component: 'setting/packConfig',
      icon: null,
      canShow: true
    },
    {
      id: 85,
      pid: 8,
      name: '会员卡配置',
      title: '会员卡配置',
      path: '/setting/cardConfig',
      component: 'setting/cardConfig',
      icon: null,
      canShow: true
    },
    {
      id: 86,
      pid: 8,
      name: '短信消息设置',
      title: '短信消息设置',
      path: '/setting/msgConfig',
      component: 'setting/msgConfig',
      icon: null,
      canShow: true
    },
    {
      id: 87,
      pid: 8,
      name: '提成方案设置',
      title: '提成方案设置',
      path: '/setting/tcManagement',
      component: 'setting/tcManagement',
      icon: null,
      canShow: true
    },
    {
      id: 88,
      pid: 8,
      name: '提成方案明细',
      title: '提成方案明细',
      path: '/setting/tcConfigCon',
      component: 'setting/tcConfigCon',
      icon: null,
      canShow: false
    },
    {
        id: 89,
        pid: 8,
        name: '开单与轮牌设置',
        title: '开单与轮牌设置',
        path: '/setting/billAndWheel',
        component: 'setting/billAndWheel',
        icon: null,
        canShow: true
    },
    {
      id: 90,
      pid: 8,
      name: '服务回访设置',
      title: '服务回访设置',
      path: '/setting/fwhfConfig',
      component: 'setting/fwhfConfig',
      icon: null,
      canShow: true
    },
    {
      id: 91,
      pid: 8,
      name: '服务回访设置',
      title: '服务回访设置',
      path: '/setting/messMbConfig',
      component: 'setting/messMbConfig',
      icon: null,
      canShow: false
    },
    { id: 9, pid: null, name: '考勤', title: null, path: null, icon: 'iconfont-channelmanagement' },
    {
      id: 92,
      pid: 9,
      name: '考勤设置',
      title: '考勤设置',
      path: '/pers/checkConfig',
      component: 'pers/checkConfig',
      icon: null,
      canShow: true
    },
    {
      id: 93,
      pid: 9,
      name: '班次维护',
      title: '班次维护',
      path: '/pers/checkClass',
      component: 'pers/checkClass',
      icon: null,
      canShow: true
    },
    {
      id: 94,
      pid: 9,
      name: '考勤统计',
      title: '考勤统计',
      path: '/pers/chstatistics',
      component: 'pers/chstatistics',
      icon: null,
      canShow: true
    },
    {
      id: 95,
      pid: 9,
      name: '考勤记录',
      title: '考勤记录',
      path: '/pers/checkRecords',
      component: 'pers/checkRecords',
      icon: null,
      canShow: true
    },
    {
      id: 96,
      pid: 9,
      name: '员工排班',
      title: '员工排班',
      path: '/pers/employeeSchedule',
      component: 'pers/employeeSchedule',
      icon: null,
      canShow: true
    },
      { id: 10, pid: null, name: '门店信息管理', title: null, path: null, icon: 'iconfont-channelmanagement' },
      {
          id: 101,
          pid: 10,
          name: '门店信息',
          title: '门店信息',
          path: '/shop/shopinfo',
          component: 'shop/shopinfo',
          icon: null,
          canShow: true
      },
    {
      id: 102,
      pid: 10,
      name: '门店品牌管理',
      title: '门店品牌管理',
      path: '/shop/shopbrand',
      component: 'shop/shopbrand',
      icon: null,
      canShow: true
    },
    {
      id: 103,
      pid: 10,
      name: '门店区域设置',
      title: '门店区域设置',
      path: '/shop/dictregion',
      component: 'shop/dictregion',
      icon: null,
      canShow: true
    },
      { id: 11, pid: null, name: '付款配置', title: null, path: null, icon: 'iconfont-channelmanagement' },
      {
          id: 111,
          pid: 11,
          name: '付款方式配置',
          title: '付款方式配置',
          path: '/setting/payConfig',
          component: 'setting/payConfig',
          icon: null,
          canShow: true
      },
      {
          id: 112,
          pid: 11,
          name: '付款模板配置',
          title: '付款模板配置',
          path: '/setting/paymentConfig',
          component: 'setting/paymentConfig',
          icon: null,
          canShow: true
      }
  ]
}


export const API = {
  /** 基础 API 配置项 */
 BASE: process.env.VUE_APP_BASE_API
}

export default {
  /** 系统配置项 */
  SYSTEM,

  /** 静态菜单配置项 */
  MENU,

  /** API 配置项 */
  API
}
