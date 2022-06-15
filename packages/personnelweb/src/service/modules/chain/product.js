import yid from '@src/library'
const prefix = 'api-chain/product';

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export default {
    /** 获取所有的产品*/
    listAll,
}