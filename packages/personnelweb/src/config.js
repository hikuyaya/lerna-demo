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
  TITLE: '人事系统',

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
  CLIENTSECRET: process.env.VUE_APP_CLIENTSECRET
}

export const MENU = {
  /** 基础菜单列表配置项 */
  LIST: [
    {
      id: 1,
      pid: null,
      name: '系统设置',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 11,
      pid: 1,
      name: '系统首页',
      title: '系统首页',
      path: '/sys/index',
      component: 'sys/index.vue',
      icon: null,
      closable: false
    },
    {
      id: 12,
      pid: 1,
      name: '组织架构',
      title: '组织架构',
      path: '/base/group',
      component: 'base/group/group',
      icon: null
    },
    {
      id: 13,
      pid: 1,
      name: '岗位设置',
      title: '岗位设置',
      path: '/base/station',
      component: 'base/station/station',
      icon: null
    },
    {
      id: 14,
      pid: 1,
      name: '测试',
      title: '测试',
      path: '/base/test',
      component: 'base/test/test',
      icon: null
    },
    {
      id: 15,
      pid: 1,
      name: '职务设置',
      title: '职务设置',
      path: '/base/position',
      component: 'base/position/position',
      icon: null
    },
    {
      id: 16,
      pid: 1,
      name: '门店信息',
      title: '门店信息',
      path: '/base/shop',
      component: 'base/shop/shop',
      icon: null
    },
    {
      id: 2,
      pid: null,
      name: '员工管理',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 21,
      pid: 2,
      name: '入职申请',
      title: '入职申请',
      path: '/staff/entry',
      component: 'staff/entry/entry',
      icon: null
    },
    {
      id: 22,
      pid: 2,
      name: '员工资料维护',
      title: '员工资料维护',
      path: '/staff/profile',
      component: 'staff/profile/profile',
      icon: null
    },
    {
      id: 23,
      pid: 2,
      name: '员工级别维护',
      title: '员工级别维护',
      path: '/staff/level',
      component: 'staff/level/level',
      icon: null
    },
    {
      id: 24,
      pid: 2,
      name: '员工调岗',
      title: '员工调岗',
      path: '/staff/transfer-position',
      component: 'staff/transferPosition/transferPosition',
      icon: null
    },
    {
      id: 25,
      pid: 2,
      name: '员工状态维护',
      title: '员工状态维护',
      path: '/staff/status',
      component: 'staff/status/status',
      icon: null
    },
    {
      id: 26,
      pid: 2,
      name: '门店员工资料维护',
      title: '门店员工资料维护',
      path: '/staff/profile-shop',
      component: 'staff/profileShop/profileShop',
      icon: null
    },
    {
      id: 27,
      pid: 2,
      name: '门店员工资料审核',
      title: '门店员工资料审核',
      path: '/staff/profile-review-shop',
      component: 'staff/profileReviewShop/profileReviewShop',
      icon: null
    },
    {
      id: 28,
      pid: 2,
      name: '合同状态维护',
      title: '合同状态维护',
      path: '/staff/contract',
      component: 'staff/contract/contract',
      icon: null
    },
    {
      id: 29,
      pid: 2,
      name: '员工工龄维护',
      title: '员工工龄维护',
      path: '/staff/workingage',
      component: 'staff/workingage/workingage',
      icon: null
    },
    {
      id: 30,
      pid: 2,
      name: '员工履历',
      title: '员工履历',
      path: '/staff/career',
      component: 'staff/career/career',
      icon: null
    },
    {
      id: 31,
      pid: 2,
      name: '黑名单管理',
      title: '黑名单管理',
      path: '/staff/black',
      component: 'staff/black/black',
      icon: null,
      canShow: true
    },
    {
      id: 3,
      pid: null,
      name: '薪酬设置',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 31,
      pid: 3,
      name: '薪酬组成设置',
      title: '薪酬组成设置',
      path: '/salary-setting/composition',
      component: 'salary-setting/composition/composition',
      icon: null,
      canShow: true
    },
    {
      id: 32,
      pid: 3,
      name: '工资账套设置',
      title: '工资账套设置',
      path: '/salary-setting/asetofbooks',
      component: 'salary-setting/asetofbooks/asetofbooks',
      icon: null,
      canShow: true
    },
    {
      id: 33,
      pid: 3,
      name: '职务账套设置',
      title: '职务账套设置',
      path: '/salary-setting/position-asetofbooks',
      component: 'salary-setting/position-asetofbooks/positionAsetofbooks',
      icon: null,
      canShow: true
    },
    {
      id: 34,
      pid: 3,
      name: '特殊工资设置',
      title: '特殊工资设置',
      path: '/salary-setting/special',
      component: 'salary-setting/special/special',
      icon: null,
      canShow: true
    },
    {
      id: 35,
      pid: 3,
      name: '特殊工资时效',
      title: '特殊工资时效',
      path: '/salary-setting/special-time',
      component: 'salary-setting/special-time/specialTime',
      icon: null,
      canShow: true
    },
    {
      id: 4,
      pid: null,
      name: '薪酬方案',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 41,
      pid: 4,
      name: '薪酬调整单',
      title: '薪酬调整单',
      path: '/salary-plan/adjust',
      component: 'salary-plan/adjust/adjust',
      icon: null,
      canShow: true
    },
    {
      id: 42,
      pid: 4,
      name: '门店对公额度',
      title: '门店对公额度',
      path: '/salary-plan/shop-limit',
      component: 'salary-plan/shop-limit/shopLimit',
      icon: null,
      canShow: true
    },
    {
      id: 43,
      pid: 4,
      name: '咨询公司额度',
      title: '咨询公司额度',
      path: '/salary-plan/company-limit',
      component: 'salary-plan/company-limit/companyLimit',
      icon: null,
      canShow: true
    },
    {
      id: 44,
      pid: 4,
      name: '门店工资名单',
      title: '门店工资名单',
      path: '/salary-plan/payslip',
      component: 'salary-plan/payslip/payslip',
      icon: null,
      canShow: true
    },
    {
      id: 45,
      pid: 4,
      name: 'OA报备历史',
      title: 'OA报备历史',
      path: '/salary-plan/oa-history',
      component: 'salary-plan/oa-history/oaHistory',
      icon: null,
      canShow: true
    },
    {
      id: 5,
      pid: null,
      name: '薪酬业务',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 51,
      pid: 5,
      name: '出勤天数录入',
      title: '出勤天数录入',
      path: '/salary-business/attendance',
      component: 'salary-business/attendance/attendance',
      icon: null,
      canShow: true
    },
    {
      id: 52,
      pid: 5,
      name: '薪酬申报单',
      title: '薪酬申报单',
      path: '/salary-business/salary-request',
      component: 'salary-business/salary-request/salaryRequest',
      icon: null,
      canShow: true
    },
    {
      id: 53,
      pid: 5,
      name: '薪酬审核单',
      title: '薪酬审核单',
      path: '/salary-business/salary-approve',
      component: 'salary-business/salary-approve/salaryApprove',
      icon: null,
      canShow: true
    },
    {
      id: 54,
      pid: 5,
      name: '特殊工资申请',
      title: '特殊工资申请',
      path: '/salary-business/special-request',
      component: 'salary-business/special-request/specialRequest',
      icon: null,
      canShow: true
    },
    {
      id: 55,
      pid: 5,
      name: '特殊工资复核',
      title: '特殊工资复核',
      path: '/salary-business/special-approve',
      component: 'salary-business/special-approve/specialApprove',
      icon: null,
      canShow: true
    },
    {
      id: 56,
      pid: 5,
      name: '扣款录入单',
      title: '扣款录入单',
      path: '/salary-business/cut-enter',
      component: 'salary-business/cut-enter/cutEnter',
      icon: null,
      canShow: true
    },
    {
      id: 57,
      pid: 5,
      name: '奖金录入单',
      title: '奖金录入单',
      path: '/salary-business/bonus-enter',
      // component: 'salary-business/bonus-enter/bonusEnter',
      component: 'salary-business/cut-enter/cutEnter',
      icon: null,
      canShow: true
    },
    {
      id: 58,
      pid: 5,
      name: '薪酬打款申请',
      title: '薪酬打款申请',
      path: '/salary-business/pay-request',
      component: 'salary-business/pay-request/payRequest',
      icon: null,
      canShow: true
    },
    {
      id: 59,
      pid: 5,
      name: '薪酬打款复核',
      title: '薪酬打款复核',
      path: '/salary-business/pay-approve',
      component: 'salary-business/pay-approve/payApprove',
      icon: null,
      canShow: true
    },
    {
      id: 510,
      pid: 5,
      name: '点对点打款',
      title: '点对点打款',
      path: '/salary-business/point-to-point',
      component: 'salary-business/point-to-point/pointToPoint',
      icon: null,
      canShow: true
    },
    {
      id: 6,
      pid: null,
      name: '考勤学习金',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 60,
      pid: 6,
      name: '学习金业务查询',
      title: '学习金业务查询',
      path: '/study-fund/query',
      component: 'study-fund/query/query',
      icon: null,
      canShow: true
    },
    {
      id: 61,
      pid: 6,
      name: '学习金退费名单',
      title: '学习金退费名单',
      path: '/study-fund/refund',
      component: 'study-fund/refund/refund',
      icon: null,
      canShow: true
    },
    {
      id: 62,
      pid: 6,
      name: '离职学习金调整',
      title: '离职学习金调整',
      path: '/study-fund/leave',
      component: 'study-fund/leave/leave',
      icon: null,
      canShow: true
    },
    {
      id: 63,
      pid: 6,
      name: '学习金标签维护',
      title: '学习金标签维护',
      path: '/study-fund/tag',
      component: 'study-fund/tag/tag',
      icon: null,
      canShow: true
    },
    {
      id: 7,
      pid: null,
      name: '员工报表',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 71,
      pid: 7,
      name: '门店员工信息',
      title: '门店员工信息',
      path: '/staff-report/shop-staff-info',
      component: 'staff-report/shop-staff-info/shopStaffInfo',
      icon: null,
      canShow: true
    },
    {
      id: 72,
      pid: 7,
      name: '员工信息表',
      title: '员工信息表',
      path: '/staff-report/staff-info',
      component: 'staff-report/staff-info/staffInfo',
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
      id: 704,
      pid: 7,
      name: '线上客装销售记录',
      title: '线上客装销售记录',
      path: '/record/onlineSale',
      component: 'record/onlineSale',
      icon: null,
      canShow: true
    },
    {
      id: 74,
      pid: 7,
      name: '撤单记录',
      title: '撤单记录',
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
    {
      id: 76,
      pid: 7,
      name: '美团核销记录',
      title: '美团核销记录',
      path: '/record/mtOrderList',
      component: 'record/mtOrderList',
      icon: null,
      canShow: true
    },
    {
      id: 77,
      pid: 7,
      name: '骁骁网核销记录',
      title: '骁骁网核销记录',
      path: '/record/xxwOrderList',
      component: 'record/xxwOrderList',
      icon: null,
      canShow: true
    },
    {
      id: 79,
      pid: 7,
      name: '充值调整单',
      title: '充值调整单',
      path: '/record/csadjBill',
      component: 'record/csadjBill',
      icon: null,
      canShow: true
    },
    {
      id: 80,
      pid: 7,
      name: '撤销活动记录',
      title: '撤销活动记录',
      path: '/record/hcmktBill',
      component: 'record/hcmktBill',
      icon: null,
      canShow: true
    },
    {
      id: 8,
      pid: null,
      name: '薪酬报表',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 81,
      pid: 8,
      name: '审核前薪酬单',
      title: '审核前薪酬单',
      path: '/salary-report/pre-approve-salary',
      component: 'salary-report/pre-approve-salary/preApproveSalary',
      icon: null,
      canShow: true
    },
    {
      id: 82,
      pid: 8,
      name: '门店学习金',
      title: '门店学习金',
      path: '/salary-report/shop-study-fund',
      component: 'salary-report/shop-study-fund/shopStudyFund',
      icon: null,
      canShow: true
    },
    {
      id: 83,
      pid: 8,
      name: '门店工资明细',
      title: '门店工资明细',
      path: '/salary-report/shop-salary-detail',
      component: 'salary-report/shop-salary-detail/shopSalaryDetail',
      icon: null,
      canShow: true
    },
    {
      id: 84,
      pid: 8,
      name: '工资明细汇总',
      title: '工资明细汇总',
      path: '/salary-report/salary-detail-collection',
      component:
        'salary-report/salary-detail-collection/salaryDetailCollection',
      icon: null,
      canShow: true
    },
    {
      id: 85,
      pid: 8,
      name: '门店打款明细',
      title: '门店打款明细',
      path: '/salary-report/shop-payment-detail',
      component: 'salary-report/shop-payment-detail/shopPaymentDetail',
      icon: null,
      canShow: true
    },
    {
      id: 86,
      pid: 8,
      name: '门店会员卡查询',
      title: '门店会员卡查询',
      path: '/setting/cardSearch',
      component: 'setting/cardSearch',
      icon: null,
      canShow: true
    },
    {
      id: 87,
      pid: 8,
      name: '短信消息设置',
      title: '短信消息设置',
      path: '/setting/msgConfig',
      component: 'setting/msgConfig',
      icon: null,
      canShow: true
    },
    {
      id: 88,
      pid: 8,
      name: '提成方案设置',
      title: '提成方案设置',
      path: '/setting/tcProgram',
      component: 'setting/tcProgram',
      icon: null,
      canShow: true
    },
    {
      id: 89,
      pid: 8,
      name: '提成方案明细',
      title: '提成方案明细',
      path: '/setting/tcConfigCon',
      component: 'setting/tcConfigCon',
      icon: null,
      canShow: false
    },
    {
      id: 90,
      pid: 8,
      name: '开单与轮牌设置',
      title: '开单与轮牌设置',
      path: '/setting/billAndWheel',
      component: 'setting/billAndWheel',
      icon: null,
      canShow: true
    },
    {
      id: 91,
      pid: 8,
      name: '服务回访设置',
      title: '服务回访设置',
      path: '/setting/fwhfConfig',
      component: 'setting/fwhfConfig',
      icon: null,
      canShow: true
    },
    {
      id: 92,
      pid: 8,
      name: '消息模板管理',
      title: '消息模板管理',
      path: '/setting/messMbConfig',
      component: 'setting/messMbConfig',
      icon: null,
      canShow: false
    },
    {
      id: 93,
      pid: 8,
      name: '门店项目价格查看',
      title: '门店项目价格查看',
      path: '/setting/projectPriceSearch',
      component: 'setting/projectPriceSearch',
      icon: null,
      canShow: true
    },
    {
      id: 118,
      pid: 8,
      name: '套餐类别设置',
      title: '套餐类别设置',
      path: '/setting/packageTypeConfig',
      component: 'setting/packageTypeConfig',
      icon: null,
      canShow: true
    },
    {
      id: 9,
      pid: null,
      name: '考勤',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
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
    {
      id: 10,
      pid: null,
      name: '门店信息管理',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
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
      id: 104,
      pid: 10,
      name: '门店信息管理',
      title: '门店信息管理',
      path: '/shop/manage',
      component: 'shop/manage',
      icon: null,
      canShow: true
    },
    {
      id: 105,
      pid: 10,
      name: '业务类型设置',
      title: '业务类型设置',
      path: '/shop/btype',
      component: 'shop/btype',
      icon: null,
      canShow: true
    },
    {
      id: 106,
      pid: 10,
      name: '门店业务组设置',
      title: '门店业务组设置',
      path: '/shop/branch',
      component: 'shop/branch',
      icon: null,
      canShow: true
    },
    {
      id: 11,
      pid: null,
      name: '付款配置',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
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
    },
    {
      id: 113,
      pid: 11,
      name: '美团核销配置',
      title: '美团核销配置',
      path: '/setting/mtkeysConfig',
      component: 'setting/mtkeysConfig',
      icon: null,
      canShow: true
    },
    {
      id: 12,
      pid: null,
      name: '营销',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 114,
      pid: 12,
      name: '红包',
      title: '红包',
      path: '/marketing/redEnvelope',
      component: 'marketing/redEnvelope',
      icon: null,
      canShow: true
    },
    {
      id: 115,
      pid: 12,
      name: '优惠券',
      title: '优惠券',
      path: '/marketing/coupon',
      component: 'marketing/coupon',
      icon: null,
      canShow: true
    },
    {
      id: 116,
      pid: 12,
      name: '主题活动',
      title: '主题活动',
      path: '/marketing/mktactiv',
      component: 'marketing/mktactiv',
      icon: null,
      canShow: true
    },
    {
      id: 117,
      pid: 6,
      name: '绑卡信息',
      title: '绑卡信息',
      path: '/member/bindcard',
      component: 'member/bindcard',
      icon: null,
      canShow: true
    },
    {
      id: 118,
      pid: 6,
      name: '会员套餐项目维护单',
      title: '会员套餐项目维护单',
      path: '/member/memPackageOrder',
      component: 'member/memPackageOrder',
      icon: null,
      canShow: true
    },
    {
      id: 120,
      pid: null,
      name: '美发部报表',
      title: '美发部报表',
      path: null,
      icon: null,
      canShow: true
    },
    {
      id: 121,
      pid: 6,
      name: '员工剪发价明细',
      title: '员工剪发价明细',
      path: '/mfb/empxjc',
      component: 'mfb/empxjc',
      icon: null,
      canShow: true
    },
    {
      id: 122,
      pid: 6,
      name: '门店项目价明细',
      title: '门店项目价明细',
      path: '/mfb/shopservprice',
      component: 'mfb/shopservprice',
      icon: null,
      canShow: true
    },
    {
      id: 1201,
      pid: 120,
      name: '测试二级菜单',
      title: '测试二级菜单',
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 12011,
      pid: 1201,
      name: '测试三级菜单01',
      title: '测试三级菜单01',
      path: '/mfb/ces2/ces01',
      component: 'mfb/ces2/ces01',
      icon: null,
      canShow: true
    },
    {
      id: 12012,
      pid: 1201,
      name: '测试三级菜单02',
      title: '测试三级菜单02',
      path: '/mfb/ces2/ces02',
      component: 'mfb/ces2/ces02',
      icon: null,
      canShow: true
    },
    {
      id: 124,
      pid: 6,
      name: '报表配置',
      title: '报表配置',
      path: '/sys/config',
      component: 'sys/ReportHeadList',
      icon: null,
      canShow: true
    },
    {
      path: '/reporttest/:code',
      title: '在线测试',
      canShow: true,
      component: 'sys/ReportAutoList.vue'
    },
    {
      path: '/report/:code',
      canShow: true,
      component: 'sys/ReportAutoList.vue'
    },
    {
      id: 212,
      pid: 2,
      name: '接发级别维护',
      title: '接发级别维护',
      path: '/setting/jfclevel',
      component: 'setting/jfclevel',
      icon: null,
      canShow: true
    },
    {
      id: 215,
      pid: 2,
      name: '美发日报表',
      title: '美发日报表',
      path: '/day/mfdayreport',
      component: 'report/mfdayreport',
      icon: null,
      canShow: true
    },
    {
      id: 216,
      pid: 2,
      name: '美容日报表',
      title: '美容日报表',
      path: '/day/mrdayreport',
      component: 'report/mrdayreport',
      icon: null,
      canShow: true
    },
    {
      id: 217,
      pid: 2,
      name: '单据结算',
      title: '单据结算',
      path: '/sys/billaccount',
      component: 'sys/billaccount',
      icon: null,
      canShow: true
    },
    {
      id: 218,
      pid: 2,
      name: '空卡分拨单',
      title: '空卡分拨单',
      path: '/shop/dispatch',
      component: 'shop/dispatch',
      icon: null,
      canShow: true
    },
    {
      id: 219,
      pid: 2,
      name: '抖音门店配置',
      title: '抖音门店配置',
      path: '/setting/douyin',
      component: 'setting/douYinConfig',
      icon: null,
      canShow: true
    },
    {
      id: 24,
      pid: null,
      name: '业务操作',
      title: null,
      path: null,
      icon: 'iconfont-channelmanagement'
    },
    {
      id: 241,
      pid: 24,
      name: '批量办卡',
      title: '批量办卡',
      path: '/batchCard/batchCard',
      component: 'batchCard/batchCard',
      icon: null,
      canShow: true
    }
  ]
}

export const API = {
  /** 基础 API 配置项 */
  BASE: process.env.VUE_APP_BASE_API,
  SOCKET: process.env.VUE_APP_SOCKET_API,
  UPLOAD: process.env.VUE_APP_UPLOAD_API
}

export default {
  /** 系统配置项 */
  SYSTEM,

  /** 静态菜单配置项 */
  MENU,

  /** API 配置项 */
  API
}
