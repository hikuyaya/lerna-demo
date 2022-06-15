import yid from '@src/library'

const prefix = 'api-chain/paytemplate';

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function batchSave(params) {
    return yid.http.post(`${prefix}/batchSave`,params)
}

export function save(params) {
    return yid.http.post(`${prefix}/savePayTemplate`,params)
}

export default {
    listAll,
    batchSave,
    save
}