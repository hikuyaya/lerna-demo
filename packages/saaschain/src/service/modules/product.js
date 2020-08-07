import yid from '@src/library'
const prefix = 'api-chain/product';

export function productList(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function productListByPage(params) {
    return yid.http.get(`${prefix}/list`, {params})
}

export function saveProduct(params) {
    return yid.http.post(`${prefix}`, params)
}

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function getCode(params) {
    return yid.http.get(`${prefix}/getCode`, {params})
}

export function checkPcode(params) {
    return yid.http.post(`${prefix}/checkPcode`,params)
}

export function excelTemplate(params) {
    return yid.http.post(`${prefix}/excelTemplate`,params)
}

export function batchImport(params){
    return yid.http.post(`${prefix}/batchImport`,params)
}

export default {
    /** 产品列表 */
    productList,
    /** 更新or新增产品列 */
    saveProduct,
    /** 产品列表1 */
    productListByPage,
    /** 获取所有的产品*/
    listAll,
    /**获取商品编码**/
    getCode,
    /**检查编码是否重复**/
    checkPcode,
    /**下载模版**/
    excelTemplate,
    /**批量导入数据**/
    batchImport,
}