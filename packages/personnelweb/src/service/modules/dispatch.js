import yid from '@src/library'

const prefix = 'api-member/carddispatchhead';

export function page(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function list(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function saveBill(params) {
    return yid.http.post(`${prefix}/saveBill`, params)
}

export function getDetail(id) {
    const url = `${prefix}/getDetail/${id}`
    return yid.http.get(url)
}

export function auditBill(params) {
    const url = `${prefix}/auditBill`
    return yid.http.post(url, params)
}

export function deleteBill(id) {
    const url = `${prefix}/deleteBill/${id}`
    return yid.http.get(url)
}

export default {
    /** 卡分拨 */
    page,
    list,
    saveBill,
    getDetail,
    auditBill,
    deleteBill
}