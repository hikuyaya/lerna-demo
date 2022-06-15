import yid from '@src/library'

const prefix = 'api-chain/cardishop';

export function save(params) {
    return yid.http.post(`${prefix}`,params)
}

export function batchSave(params) {
    return yid.http.post(`${prefix}/batchSave`,params)
}

export function searchListAll(params) {
    return yid.http.get(`${prefix}/search/all`,{params})
}

export default {
    save,
    batchSave,
    searchListAll
}