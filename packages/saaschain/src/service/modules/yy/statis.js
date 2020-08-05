import yid from '@src/library'


export function statisShopList(params) {
    return yid.http.get("api-yy/statisshop/list/all", {params})
}

export function statisEeployeeList(params) {
    return yid.http.get("api-yy/statisemployee/list/all", {params})
}

export function channelList(params) {
    return yid.http.get("api-yy/channel/list/all", {params})
}

export function excel(params) {
    return yid.http.get("api-yy/statisshop/list/excel", {params})
}


export default {
    /**门店统计**/
    statisShopList,
    /**员工统计**/
    statisEeployeeList,
    channelList,
    excel
}
