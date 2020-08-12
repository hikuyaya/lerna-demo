import yid from '@src/library'

const prefix = 'api-base/positionlevel';
const prefixChain = 'api-chain/positionlevel';

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