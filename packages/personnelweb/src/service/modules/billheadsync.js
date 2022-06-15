import yid from '@src/library'

const prefix = 'api-report';

export function logList(params) {
    return yid.http.get(`${prefix}/billheadlog`, {params})
}

export function syncList(params) {
    return yid.http.get(`${prefix}/billheadsync`, {params})
}

export function saveBatch(params) {
    return yid.http.post(`${prefix}/billheadsync/saveBatch`, params)
}

export default {
    logList,
    syncList,
    saveBatch
}