import yid from '@src/library'

const prefix = 'api-finance/uplshopaccount/';
export function list(params) {
    return yid.http.get(`${prefix}/list`, {params})
}

export function save(params) {
    return yid.http.post(`${prefix}`, params)
}

export function getUnionQr(params) {
    return yid.http.post(`${prefix}/getUnionQr`, params)
}
export function getShopcodeAccountShow(params) {
    return yid.http.post(`${prefix}/getShopcodeAccountShow`, params)
}
export function saveSystem(params) {
    const url = `${prefix}/saveSystem`
    return yid.http.post(url, params )
}
export default {
    /** 列表 */
    list,
    save,
    getUnionQr,
    getShopcodeAccountShow,
    saveSystem,
}
