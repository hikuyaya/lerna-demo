import yid from '@src/library'

const prefix = 'api-user/usertype';
export function save(params) {
    return yid.http.post(`${prefix}`, params)
}

export default {
    /** 保存人员角色 */
    save,
}