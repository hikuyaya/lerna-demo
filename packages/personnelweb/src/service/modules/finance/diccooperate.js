import yid from '@src/library'

const prefix = 'api-finance/diccooperate';

export function list(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function save(params) {
    const url = `${prefix}`
    return yid.http.post(url, params )
}

export default {
    list,
    listAll,
    save,
}