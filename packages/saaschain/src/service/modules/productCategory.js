import yid from '@src/library'
const prefix = 'api-base/productcategory';

export function alllist(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function allfz(params) {
    return yid.http.get(`${prefix}/list/allfz`, {params})
}

export default {
    /** 产品品牌列表 */
    alllist,
    /**分级列表**/
    allfz
}