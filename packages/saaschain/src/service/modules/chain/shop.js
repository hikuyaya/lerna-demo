import yid from '@src/library'

const prefix = 'api-chain/shop';

export function shopList(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}


export default {
    /** 门店列表 */
    shopList,
}