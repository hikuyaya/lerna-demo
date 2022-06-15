import yid from '@src/library'

const prefix = 'api-base/shop';

export function shopList(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function getProCityArea() {
    return yid.http.get(`${prefix}/getProCityArea`)
}

export function getShopInfo() {
    return yid.http.get(`${prefix}/getShopInfo`)
}

export function getShopImages() {
    return yid.http.get(`api-base/shopbanner/getShopImages`)
}

export function saveShop(params) {
    return yid.http.post(`${prefix}/saveShop`,params)
}

export function getShopQueuingCode(params) {
    return yid.http.post(`api-member/wx/user/shopQueuingCode`,params)
}

export default {
    /** 门店列表 */
    shopList,
    getProCityArea,
    getShopInfo,
    getShopImages,
    saveShop,
    getShopQueuingCode
}