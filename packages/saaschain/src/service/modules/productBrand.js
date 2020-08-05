import yid from '@src/library'
const prefix = 'api-base/productbrand';

export function productbrandList(params) {
    const url = `${prefix}`
    return yid.http.get(url, { params })
}

export function getBrandMaxId(){
    const url = `${prefix}/getMaxId`
    return yid.http.get(url)
}

export function alllist(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function saveBrand(params) {
    const url = `${prefix}`
    return yid.http.post(url, params )
}

export default {
    /** 产品品牌列表分页 */
    productbrandList,
    /** 产品品牌列表 */
    alllist,
    /**获取编码**/
    getBrandMaxId,
    /**保存或更新**/
    saveBrand,
}