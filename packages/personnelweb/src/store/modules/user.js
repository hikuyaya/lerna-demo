/*
 * @Author: wqy
 * @Date: 2022-06-15 14:05:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 09:30:40
 * @FilePath: \personnelweb\src\store\modules\user.js
 * @Description:
 */
const state = {
  userToken: '',
  userInfo: {},
  msg: '',
  salaryBusinessMenu: []
}

const mutations = {
  setUserToken(state, params) {
    state.userToken = params
  },

  removeUserToken(state) {
    state.userToken = ''
  },

  setUserInfo(state, params) {
    state.userInfo = params
  },

  removeUserInfo(state) {
    state.userInfo = {}
  },

  showMsg(state) {
    state.msg = '你有一条新的系统消息'
  },

  setSalaryBusinessMenu(state, payload) {
    console.log('38', payload)
    state.salaryBusinessMenu = payload
  }
}

const actions = {
  increment(context) {
    context.commit('increment')
  },
  systemMsg(context) {
    context.commit('showMsg')
  }
}

const getters = {
  userInfo: state => {
    return state.userInfo
  },
  userName: state => {
    return state.userInfo.username
  },
  nickName: state => {
    return state.userInfo.nickname
  },
  headImgUrl: state => {
    return state.userInfo.headImgUrl
  },
  msg: state => {
    return state.msg
  },
  permissions: state => {
    return state.userInfo.permissions
  },
  menus: state => {
    return state.userInfo.menus
  },
  salaryBusinessMenu: state => {
    console.log(75, state)
    return state.salaryBusinessMenu
  }
}
export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations
}
