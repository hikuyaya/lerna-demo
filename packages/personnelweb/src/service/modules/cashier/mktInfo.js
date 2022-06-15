import yid from '@src/library'

const prefix = 'api-chain/mktactivinfo';

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export default {
    /**支付方式列表**/
    listAll,
}