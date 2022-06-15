import yid from '@src/library'

const prefix = 'api-user/roles';

export function list(params) {
    return yid.http.get(`${prefix}/roleList`, {params})
}

export function rolelist(params) {
    return yid.http.get(`${prefix}/getSysRoleList`, {params})
}

export function getSysRoleList() {
    const url = `${prefix}/getSysRoleList`
    return yid.http.get(url)
}

export function saveOrUpdate(params) {
    const url = `${prefix}/saveOrUpdate`
    return yid.http.post(url, params)
}

export function getUsersByRoleId(id) {
    const url = `${prefix}/getUsersByRoleId/${id}`
    return yid.http.get(url)
}

export function deleteRole(id) {
    const url = `${prefix}/${id}`
    return yid.http.delete(url)
}

export function findMenuListByRoleId(roleId) {
    const url = `${prefix}/findRoleMenuList/${roleId}`
    return yid.http.get(url)
}

export function saveRoleMenu(roleId, params) {
    return yid.http.post(`${prefix}/saveRoleMenuList/${roleId}`, params)
}

export function saveCopyRoleMenu(params) {
    return yid.http.post(`${prefix}/saveCopyRoleMenu`, params)
}

export function roleListById(params) {
    return yid.http.post(`${prefix}/roleListById`, params)
}

export default {
    list,
    rolelist,
    saveOrUpdate,
    deleteRole,
    findMenuListByRoleId,
    saveRoleMenu,
    getUsersByRoleId,
    getSysRoleList,
    saveCopyRoleMenu,
    roleListById
}
