import yid from '@src/library'
import config from '@src/config'

const prefix = 'api-user';
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
    return yid.http.get(url, { params })
}
export function resetPassword(id) {
    const url = `${prefix}/users/${id}/password`
    return yid.http.put(url)
}
export function roles(params) {
    const url = `${prefix}/roletype/list`
    return yid.http.get(url, {params})
}
export function usermenus(id) {
    const url = `${prefix}/menus/usermenus/${id}`
    return yid.http.get(url)
}
export function usermenusList(userIds) {
    const url = `${prefix}/menus/usermenusList`
    return yid.http.post(url, {userIds})
}

export function saveMenus(ids, params) {
 //   const url = `${prefix}/users/${ids}/menus`
 //   return yid.http.post(url, params )
    const url = `${prefix}/users/${ids}/batchSaveMenus`
    return yid.http.post(url, params)
}

export function clientMenus(appId) {
    const url = `${prefix}/menus/clientmenus/${appId}`
    return yid.http.get(url)
}
export function client() {
    const url = `${prefix}/client`
    return yid.http.get(url)
}
export function deleteUsers(ids) {
    const url = `${prefix}/users`
    return yid.http.delete(url, ids)
}

export function getSysRole(params) {
    const url = `${prefix}/sysrole/list/all?appId=`+params
    return yid.http.get(url)
}

export function saveOrUpdateForChain(params) {
    const url = `${prefix}/users/saveOrUpdateForChain`
    return yid.http.post(url, params)
}

export function batchDeleteForChain(params) {
    return yid.http.post(`${prefix}/users/batchDeleteForChain`,params)
}

export function chainListAll(params) {
    const url = `${prefix}/users/listForChain`
    return yid.http.get(url, params)
}

export function batchCopyAuthForChain(params) {
    return yid.http.post(`${prefix}/users/batchCopyAuthForChain`,params)
}

export function userlistForChain(params) {
    const url = `${prefix}/userlistForChain`
    return yid.http.get(url, { params })
}

export default {
    /** ???????????? */
    menu,
    /** ???????????? */
    userInfo,
    /** ???????????? */
    userList,
    /** ?????????????????? */
    updateEnabled,
    /** ???????????? */
    resetPassword,
    /** ???????????? */
    roles,
    /** ????????????????????? */
    usermenus,
    usermenusList,
    /** ???????????? */
    saveMenus,
    /** ??????????????????*/
    clientMenus,
    /** ???????????????*/
    client,
    /** ?????????????????? */
    deleteUsers,

    getSysRole,
    saveOrUpdateForChain,
    batchDeleteForChain,
    chainListAll,
    batchCopyAuthForChain,
    userlistForChain
}
