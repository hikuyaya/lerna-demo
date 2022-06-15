import yid from '@src/library'

const prefix = 'api-user';
export function save(params) {
    return yid.http.post(`${prefix}/users/saveOrUpdate`, params)
}

export function updateUser(params) {
    return yid.http.post(`${prefix}/users/updateUser`, params)
}

export function findByEeid(params){
    return yid.http.get(`${prefix}/users-anon/eeid`,{params})
}

export default {
    /** 角色列表 */
    save,
    /**更新员工状态是是否删除**/
    updateUser,
    /**查询eeid对应用户**/
    findByEeid,
}