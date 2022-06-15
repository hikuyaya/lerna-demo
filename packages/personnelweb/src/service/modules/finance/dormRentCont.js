import yid from '@src/library'

const prefix = 'api-finance/dormrentcont';

export function billListForChain(params) {
    return yid.http.get(`${prefix}/billListForChain`, {params})
}

export function rejectBill(params) {
    const url = `${prefix}/rejectBill`
    return yid.http.post(url,params)
}

export function auditBillForChain(params) {
    const url = `${prefix}/auditBillForChain`
    return yid.http.post(url, params )
}

export function saveHt(params) {
    const url = `${prefix}`
    return yid.http.post(url,params)
}

export default {
    /** 列表 */
    billListForChain,
    rejectBill,
    auditBillForChain,
    saveHt,
}