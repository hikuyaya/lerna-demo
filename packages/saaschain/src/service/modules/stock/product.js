import yid from '@src/library'

const prefix = 'api-stock/product/';

export function list(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function listByPage(params) {
    return yid.http.get(`${prefix}list`, {params})
}

export function save(params) {
    return yid.http.post(`${prefix}`,params)
}

export function batchSave(params) {
    return yid.http.post(`${prefix}batchSave`,params)
}

export function updateStatus(params) {
    return yid.http.post(`${prefix}updateStatus`,params)
}

export function allList(params) {
    return yid.http.get(`${prefix}list/all`, {params})
}

export function updateBypid(params) {
    return yid.http.post(`${prefix}updateBypid`,params)
}



//产品总库存类相关信息
export default {
    /** 列表 */
    list,
    /**保存或更新**/
    save,
    /** 列表1 */
    listByPage,
    /**修改状态**/
    updateStatus,
    /**获取全部产品**/
    allList,
    /**批量修改安全库存**/
    batchSave,
    /**根据ID修改产品资料**/
    updateBypid,
}
