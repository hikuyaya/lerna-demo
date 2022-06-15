import yid from '@src/library'

const prefix = 'api-user';

export function findList(params) {
    return yid.http.get(`${prefix}/mac`, {params})
}

export function saveMac(params) {
    const url = `${prefix}/mac/saveMac`
    return yid.http.post(url, params)
}

export function updateStatus(params) {
    const url = `${prefix}/mac/updateStatus`
    return yid.http.post(url, params)
}

export function batchUpdateStatus(params) {
    const url = `${prefix}/mac/batchUpdateStatus`
    return yid.http.post(url, params)
}

export default {
    findList,
    saveMac,
    updateStatus,
    batchUpdateStatus
}
