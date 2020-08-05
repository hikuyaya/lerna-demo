import yid from '@src/library'

const prefix = 'api-pers/royaltymanage';

//  获取提成方案管理分页
export function page(params) {
    return yid.http.get(`${prefix}`, {params: params})
}

//  更新数据
export function saveOrUpdate(params) {
    return yid.http.post(`${prefix}`, params)
}

//  修改提成启用状态
export function status(params) {
    return yid.http.post(`${prefix}/status`, params)
}

export default {
    /** 获取提成方案管理分页 */
    page,
    /** 更新提成方案 */
    saveOrUpdate,
    /** 修改提成方案状态，最多只能启用一个 */
    status
}