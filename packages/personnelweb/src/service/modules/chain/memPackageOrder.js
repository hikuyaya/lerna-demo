import yid from '@src/library'

const prefix = 'api-chain/mempackageorder';

export function orderList(params) {
    const url = `${prefix}/queryBillByPage`
    return yid.http.get(url, { params })
}

export function saveBill(params) {
    return yid.http.post(`${prefix}/saveBill`, params)
}

export function saveOrUpdate(params) {
    return yid.http.post(`${prefix}`, params)
}

export function auditBill(params) {
    return yid.http.post(`${prefix}/auditBill`, params)
}

export default {
    orderList,
    saveBill,
    saveOrUpdate,
    auditBill,
}