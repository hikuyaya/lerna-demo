import yid from '@src/library'

const prefix = 'api-finance/xxtkrecords';

export function billListsp(params) {
    return yid.http.get(`${prefix}/billListsp`, {params})
}

export function billListfh(params) {
    return yid.http.get(`${prefix}/billListfh`, {params})
}

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function saveBill(params) {
    const url = `${prefix}/saveBill`
    return yid.http.post(url, params)
}

export function auditBillsp(params) {
    const url = `${prefix}/auditBillsp`
    return yid.http.post(url, params)
}

export function auditBillfh(params) {
    const url = `${prefix}/auditBillfh`
    return yid.http.post(url, params)
}

export function rejectBillsp(params) {
    const url = `${prefix}/rejectBillsp`
    return yid.http.post(url, params)
}

export function rejectBillfh(params) {
    const url = `${prefix}/rejectBillfh`
    return yid.http.post(url, params)
}

export function cancelFhBill(params) {
    const url = `${prefix}/cancelFhBill`
    return yid.http.post(url, params)
}

export default {
    /** 列表 */
    billListsp,
    billListfh,
    saveBill,
    auditBillsp,
    auditBillfh,
    rejectBillsp,
    rejectBillfh,
    listAll,
    cancelFhBill,
}