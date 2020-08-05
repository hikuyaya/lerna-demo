import yid from '@src/library'

const prefix = 'api-chain/wheelconfig';

export function deleteCwc(id) {
    return yid.http.delete(`${prefix}/`+id)
}

export function saveCwc(param) {
    return yid.http.post(`${prefix}/`,param)
}

export function getCwc() {
    return yid.http.get(`${prefix}/list/shop`)
}

export default {
    /** 删除轮牌设置 */
    deleteCwc,
    /** 更新轮牌设置 */
    saveCwc,
    /** 获取门店轮牌设置列表 */
    getCwc
}