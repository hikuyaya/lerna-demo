import yid from '@src/library'

const prefix = 'api-finance/ioaccount/';
export function list(params) {
    return yid.http.get(`${prefix}list`, {params})
}

export function save(params) {
    return yid.http.post(`${prefix}`, params)
}
export function batchImport(params){
    return yid.http.post(`${prefix}/batchImport`,params)
}

export function getIoAccount(params) {
    return yid.http.post(`${prefix}/getIoAccount`, params)
}

export default {
    /** 列表 */
    list,
    save,
    batchImport,
    getIoAccount,
}
