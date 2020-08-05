import yid from '@src/library'

const prefix = 'api-chain/product';
export function list(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function save(params) {
    return yid.http.post(`${prefix}`, params)
}

export function batchSave(params) {
    return yid.http.post(`${prefix}/batchSave`,params)
}

export function productInList(params) {
    return yid.http.get(`${prefix}/inlist`, {params})
}

export function batchImport(params) {
    return yid.http.post(`${prefix}/batchImport`,params)
}

//产品
export default {
    list,
    save,
    /**入库单商品列表查询**/
    productInList,
    batchSave,
    /**批量导入产品资料**/
    batchImport,
}