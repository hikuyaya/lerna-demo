import yid from '@src/library'

const prefix = 'api-base/productbrand/';
export function list(params) {
    return yid.http.get(`${prefix}list/all`, {params})
}

//产品品牌
export default {
    list,
}