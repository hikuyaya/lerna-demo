import yid from '@src/library'

const prefix = 'api-chain/productbrand/';
export function list(params) {
    return yid.http.get(`${prefix}list/all`, {params})
}

//δΊ§εεη
export default {
    list,
}