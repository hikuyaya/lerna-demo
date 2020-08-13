import yid from '@src/library'

const prefix = 'api-chain/shop';

export function shopList(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function batchRegion(params) {
    return yid.http.post(`${prefix}/batchRegion`,params)
}

export function regionShopList(params) {
    return yid.http.get(`${prefix}/regionShopList`, {params})
}


export default {
    /** 门店列表 */
    shopList,
    /**批量设置门店区域**/
    batchRegion,
    /**查询节点及子节点的门店列表*/
    regionShopList
}