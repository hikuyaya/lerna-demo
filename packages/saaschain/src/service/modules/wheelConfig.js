import yid from '@src/library'

const prefix = 'api-cashier/wheelconfig';

export function deleteCwc(id) {
    return yid.http.delete(`${prefix}/`+id)
}

export function saveCwc(param) {
    return yid.http.post(`${prefix}/`,param)
}

export function getCwc(param) {

    return yid.http.get(`${prefix}/chain/list/shop?shopid=`+param)
}


export default {
    /** 删除轮牌设置 */
    deleteCwc,
    /** 更新轮牌设置 */
    saveCwc,
    /** 获取门店轮牌设置列表 */
    getCwc,

}