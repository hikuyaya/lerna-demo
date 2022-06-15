const state = {
  userToken: '',
  userInfo: {},
  msg: ''
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
  }
}
export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations
}
