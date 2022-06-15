import yid from '@src/library'

const prefix = 'api-chain/btype';

export function list(params) {
    return yid.http.get(`${prefix}`, { params })
}

export function saveBtype(params) {
    return yid.http.post(`${prefix}`, params)
}

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, { params })
}

export default {
    /** 列表 saveDtype*/
    list,
    saveBtype,
    listAll,
}