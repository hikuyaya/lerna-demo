/**
 * 项目价格体系
 */

import yid from '@src/library'

const prefix = 'api-chain';

export function findServicePrices(params) {
    return yid.http.get(`${prefix}/servicepricetemp/list/all`,{params})
}

export function findbrands(params) {
    return yid.http.get(`${prefix}/brand/list/all`,{params})
}

export function findbranchs(params) {
    return yid.http.get(`${prefix}/branch/list/all`,{params})
}

export function findregions(params) {
    return yid.http.get(`${prefix}/dictregion/list/all`,{params})
}

export function queryShop(params) {
    return yid.http.get(`${prefix}/shop`,{params})
}

export function newCode() {
    return yid.http.post(`${prefix}/servicepricetemp/newCode`,)
}

export function stopPrice() {
    return yid.http.post(`${prefix}/servicepricetemp/stopPrice`,)
}

export function saveShopPrice(params) {
    return yid.http.post(`${prefix}/servicepricetemp/saveShopPrice`,params)
}

export function saveShop(params) {
    return yid.http.post(`${prefix}/servicepricetemp/saveShop`,params)
}

export default {
    /** 所有价格体系 */
    findServicePrices,
    findbrands,
    findbranchs,
    findregions,
    queryShop,
    newCode,
    stopPrice,
    saveShopPrice,
    saveShop
}
