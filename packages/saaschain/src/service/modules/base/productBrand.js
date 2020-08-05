import yid from '@src/library'

const prefix = 'api-chain/productbrand/';
export function list(params) {
    return yid.http.get(`${prefix}list/all`, {params})
}

//产品品牌
export default {
    list,
}