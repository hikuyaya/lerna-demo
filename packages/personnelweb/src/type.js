/*
 * @Author: leejee
 * @Description: 程序常量文件
 * @Date: 2017-12-05
 */

export const SYSTEM = {
  /** 系统消息类型 */
  MESSAGE: {
    INFO: 'info',
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning'
  },

  /** 系统缓存类型常量 */
  CACHE: {
    /** 存储类型 - localStorage */
    LOCAL_STORAGE: 'localStorage',
    /** 存储类型 - sessionStorage */
    SESSION_STORAGE: 'sessionStorage'
  }
}

export const USER = {
  /** user info */
  INFO: 'yid.user.info',

  /** user token */
  TOKEN: 'yid.user.token',

  /** 最近操作功能列表 */
  TAB_LIST: 'yid.user.tabList',

  APPID: 'yid.user.appid'
}

export const OPERATE_TYPE = {
  ADD: 'add',
  EDIT: 'edit',
  DETAIL: 'detail'
}

// StaffProfile组件入参语义化
export const STAFF_PROFILE_TYPE = {
  ENTRY: 'entry', // 入职申请
  PROFILE: 'profile' // 员工资料维护
}

export default {
  /** 系统消息类型常量 */
  SYSTEM,

  /** 用户信息类型常量 */
  USER
}
