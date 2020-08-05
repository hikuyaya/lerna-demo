import yid from '@src/library'

const prefix = 'api-cashier/wheelrest';

export function deleteCwr(id) {
    let param={id:id,isDel:'1'}
    return yid.http.post(`${prefix}/`,param)
}

export function saveCwr(param) {
    return yid.http.post(`${prefix}/`,param)
}

export function getCwr() {
    return yid.http.get(`${prefix}/list/shop`)
}

export function getPostions(params) {
    return yid.http.get(`api-base/position/list/all`,{params})
}

export function getStations() {
    return yid.http.get(`api-cashier/station/list/all`)
}

export function getStationdesc(params) {
    return yid.http.get(`api-cashier/stationdesc/desc`,{params})
}

export function saveStation(param) {
    return yid.http.post(`api-cashier/station/saveStation`, param)
}

export function getPrintTempset(params) {
    return yid.http.get(`api-cashier/printtempset/list/all`,{params})
}

export function getPrintItem(params) {
    return yid.http.get(`api-cashier/printitem/list/all`,{params})
}

export default {
    /** 删除轮牌临休设置 */
    deleteCwr,
    /** 更新轮牌临休设置 */
    saveCwr,
    /** 获取门店轮牌临休设置列表 */
    getCwr,
    getPostions,
    /** */
    getStations,
    getStationdesc,
    saveStation,
    getPrintTempset,
    getPrintItem
}