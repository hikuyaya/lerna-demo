import yid from '@src/library'

const prefix = 'api-chain/positionrole';
export function positionRoleList(params) {
    return yid.http.get(`${prefix}/positionRoleList`, {params})
}

export function savePositionRole(params) {
    return yid.http.post(`${prefix}/savePositionRole`, params)
}

export function editPositionRole(params) {
    return yid.http.post(`${prefix}/editPositionRole`, params)
}

export function deletePositionRole(id) {
    return yid.http.delete(`${prefix}/deletePositionRole/${id}`)
}

export default {
    /** 获取职位角色列表 */
    positionRoleList,

    /** 保存职位角色列表 */
    savePositionRole,

    /** 编辑职位角色列表 */
    editPositionRole,

    /**删除职位**/
    deletePositionRole
}
