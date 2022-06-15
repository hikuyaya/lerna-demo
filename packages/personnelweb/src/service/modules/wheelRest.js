import yid from '@src/library'

const prefix = 'api-chain/wheelrest';

export function deleteCwr(id) {
    let param={id:id,isDel:'1'}
    return yid.http.post(`api-cashier/wheelrest/`,param)
}

export function saveCwr(param) {
    return yid.http.post(`api-cashier/wheelrest/`,param)
}

export function getCwr(param) {
    return yid.http.get(`api-cashier/wheelrest/chain/list/shop?shopid=`+param)
}

export function getPostions(params) {
    return yid.http.get(`api-chain/position/getPostionsByBtype`,{params})
}

export function getStations(params) {
    return yid.http.get(`api-chain/station/list/all`, {params})
}

export function getStationByid(id) {
    return yid.http.get(`api-cashier/station/getById/${id}`)
}

export function station(params) {
    return yid.http.get(`api-cashier/station/getByCodeForChain`,{params})
}

export function getStationdesc(params) {
    return yid.http.get(`api-chain/stationdesc/desc`,{params})
}

export function saveStation(param) {
    return yid.http.post(`api-chain/station/saveStation`, param)
}

export function getPrintTempset(params) {
    return yid.http.get(`api-chain/printtempset/list/all`,{params})
}

export function getPrintItem(params) {
    return yid.http.get(`api-chain/printitem/list/all`,{params})
}
export function getBrands(params) {
    return yid.http.get(`api-chain/brand/list/all`,{params})
}

export function savePrintTempset(params) {
    return yid.http.post(`api-chain/printtempset`,params)
}
export function saveToCashier(params) {
    return yid.http.post(`api-chain/printtempset/saveToCashier`,params)
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
    getPrintItem,
    getStationByid,
    station,
    getBrands,
    savePrintTempset,
    saveToCashier
}