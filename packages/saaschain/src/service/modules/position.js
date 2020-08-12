import yid from '@src/library'

const prefix = 'api-base/position';
const prefixChain = 'api-chain/position';

export function list(params) {
    return yid.http.get(`${prefixChain}/list/all`, {params})
}

export function listForChain(params) {
    return yid.http.get(`${prefix}/list/allForChain`, {params})
}

export default {
    /** 职务列表 */
    list,
    listForChain
}