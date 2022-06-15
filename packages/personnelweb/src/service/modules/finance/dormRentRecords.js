import yid from '@src/library'

const prefix = 'api-finance/dormrentrecords';

export function billListForChain(params) {
    return yid.http.get(`${prefix}/billListForChain`, {params})
}

export function listAllForChain(params) {
    return yid.http.get(`${prefix}/list/allForchain`, {params})
}

export function rejectBill(params) {
    const url = `${prefix}/rejectBill`
    return yid.http.post(url,params)
}

export function auditBill(params) {
    const url = `${prefix}/auditBillForChain`
    return yid.http.post(url, params )
}

export function cancelAuditBill(params) {
    const url = `${prefix}/cancelAuditBillForChain`
    return yid.http.post(url, params )
}

export function changeSumType(params) {
    const url = `${prefix}/changeSumType`
    return yid.http.post(url,params)
}

export default {
    /** 列表 */
    billListForChain,
    rejectBill,
    auditBill,
    listAllForChain,
    cancelAuditBill,
    changeSumType,
}