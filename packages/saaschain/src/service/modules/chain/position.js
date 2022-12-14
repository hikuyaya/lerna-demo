import yid from '@src/library'

const prefix = 'api-chain/position';
export function list(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export default {
    /** 职务列表 */
    list,
}