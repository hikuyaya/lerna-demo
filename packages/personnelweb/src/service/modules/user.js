import yid from '@src/library'
import config from '@src/config'

const prefix = 'api-user'
export function menu(params) {
  return yid.http.get(`${prefix}/menus/usercurrent`, params)
}

export function userInfo(params) {
  return yid.http.get(`${prefix}/users/current`, params)
}

export function userList(params) {
  const url = `${prefix}/userlist`
  return yid.http.get(url, { params })
}
export function updateEnabled(params) {
  const url = `${prefix}/users/updateEnabled`
  return yid.http.post(url, params)
}
export function updateIsmac(params) {
  const url = `${prefix}/users/updateIsmac`
  return yid.http.post(url, params)
}

export function resetPassword(params) {
  const url = `${prefix}/users/resetPassword`
  return yid.http.post(url, params)
}
export function roles(params) {
  const url = `${prefix}/roletype/list`
  return yid.http.get(url, { params })
}
export function usermenus(id) {
  const url = `${prefix}/menus/usermenus/${id}`
  return yid.http.get(url)
}
export function usermenusList(userIds) {
  const url = `${prefix}/menus/usermenusList`
  return yid.http.post(url, { userIds })
}

export function saveMenus(ids, params) {
  //   const url = `${prefix}/users/${ids}/menus`
  //   return yid.http.post(url, params )
  const url = `${prefix}/users/batchSaveMenus/${ids}`
  return yid.http.post(url, params)
}

export function clientMenus(appId) {
  const url = `${prefix}/menus/clientmenus/${appId}`
  return yid.http.get(url)
}
export function client(params) {
  const url = `${prefix}/client`
  return yid.http.get(url, { params })
}
export function deleteUsers(params) {
  const url = `${prefix}/users/batchDeleteUsers`
  return yid.http.post(url, params)
}

export function getSysRoleTree() {
  const url = `${prefix}/sysrole/getSysRoleTree`
  return yid.http.get(url)
}

export function saveOrUpdateForChain(params) {
  const url = `${prefix}/users/saveOrUpdateForChain`
  return yid.http.post(url, params)
}

export function batchDeleteForChain(params) {
  return yid.http.post(`${prefix}/users/batchDeleteForChain`, params)
}

export function chainListAll(params) {
  const url = `${prefix}/users/listForChain`
  return yid.http.get(url, params)
}

export function batchCopyAuthForChain(params) {
  return yid.http.post(`${prefix}/users/batchCopyAuthForChain`, params)
}

export function userlistForChain(params) {
  const url = `${prefix}/users/userlistForChain`
  return yid.http.get(url, { params })
}

export function batchSaveUserRole(params) {
  const url = `${prefix}/users/batchSaveUserRole`
  return yid.http.post(url, params)
}

export function saveUserMenus(uid, params) {
  return yid.http.post(`${prefix}/users/saveUserMenus/${uid}`, params)
}
export function getBindedEeid(params) {
  return yid.http.post(`${prefix}/users/getBindedEeid`, params)
}

export function updateUserShop(params) {
  return yid.http.post(`${prefix}/users/updateUserShop`, params)
}

export default {
  /** 用户菜单 */
  menu,
  /** 用户详情 */
  userInfo,
  /** 用户列表 */
  userList,
  /** 改变用户状态 */
  updateEnabled,
  /** 改变是否校验mac */
  updateIsmac,
  /** 重置密码 */
  resetPassword,
  /** 获取角色 */
  roles,
  /** 获取用户权限树 */
  usermenus,
  usermenusList,
  /** 保存菜单 */
  saveMenus,
  /** 获取模板菜单*/
  clientMenus,
  /** 所有端列表*/
  client,
  /** 批量删除用户 */
  deleteUsers,

  getSysRoleTree,
  saveOrUpdateForChain,
  batchDeleteForChain,
  chainListAll,
  batchCopyAuthForChain,
  userlistForChain,
  batchSaveUserRole,
  saveUserMenus,
  getBindedEeid,

  updateUserShop
}
