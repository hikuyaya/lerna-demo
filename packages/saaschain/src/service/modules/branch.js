import yid from '@src/library'

const prefix = 'api-chain/branch';
export function list(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}
export default {
    /** 部门列表 */
    list,
}