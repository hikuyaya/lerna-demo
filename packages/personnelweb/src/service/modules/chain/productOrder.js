import yid from '@src/library'

const prefix = 'api-chain/productorder';

export function orderList(params) {
    const url = `${prefix}/list`
    return yid.http.get(url, { params })
}

export function treeAll(params) {
    return yid.http.get(`${prefix}/tree/all`, {params})
}

export function saveBill(params) {
    return yid.http.post(`${prefix}/saveBill`, params)
}

export function saveOrUpdate(params) {
    return yid.http.post(`${prefix}`, params)
}

export function submitBill(params) {
    return yid.http.post(`${prefix}/submitBill`, params)
}

export function orderAdminList(params) {
    const url = `${prefix}/adminList`
    return yid.http.get(url, { params })
}

export function rejectBill(params) {
    return yid.http.post(`${prefix}/rejectBill`, params)
}

export function auditBill(params) {
    return yid.http.post(`${prefix}/auditBill`, params)
}

export default {
    /**订货单列表分页**/
    orderList,
    /**查询品类树**/
    treeAll,
    /**保存单据**/
    saveBill,
    saveOrUpdate,
    /**提交单据**/
    submitBill,
    orderAdminList,
    /**驳回单据**/
    rejectBill,
    /**管理处审核单据**/
    auditBill,
}