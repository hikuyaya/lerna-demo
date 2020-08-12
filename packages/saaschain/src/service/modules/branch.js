import yid from '@src/library'

const prefix = 'api-base/branch';
const prefixChain = 'api-chain/branch';
export function list(params) {
    return yid.http.get(`${prefixChain}/list/all`, {params})
}

export function listForChain(params) {
    return yid.http.get(`${prefix}/list/allForChain`, {params})
}

export default {
    /** 部门列表 */
    list,
    listForChain,
}