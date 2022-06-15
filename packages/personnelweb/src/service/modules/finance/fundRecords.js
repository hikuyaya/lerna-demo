import yid from '@src/library'

const prefix = 'api-finance/fundrecords/';
export function list(params) {
    return yid.http.get(`${prefix}list/all`, {params})
}

export function save(params) {
    return yid.http.post(`${prefix}`, params)
}

export default {
    /** 列表 */
    list,
    save,
}
