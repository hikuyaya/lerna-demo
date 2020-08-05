import yid from '@src/library'

const prefix = 'api-base/productcategory/';
export function list(params) {
    return yid.http.get(`${prefix}list/all`, {params})
}

//产品分类
export default {
    list,
}