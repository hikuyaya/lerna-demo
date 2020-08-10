import yid from '@src/library'

const prefix = 'api-pers/awarddesc';

export function awarddescList(params) {
    return yid.http.get(`${prefix}/chain/awarddescList`, {params})
}

export function batchUpate(params) {
    const url = `${prefix}/batchUpate`
    return yid.http.post(url, params )
}

export function batchImport(params) {
    return yid.http.post(`${prefix}/batchImport`,params)
}

export function awarddescSum(params) {
    return yid.http.get(`${prefix}/chain/awarddescSum`, {params})
}
export default {
    awarddescList,
    batchUpate,
    batchImport,
    awarddescSum,
}