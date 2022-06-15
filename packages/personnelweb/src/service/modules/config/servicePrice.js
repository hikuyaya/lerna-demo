import yid from '@src/library'

const prefix = 'api-chain';

export function findServiceList(params) {
    return yid.http.get(`${prefix}/serviceinfo/findServiceList`,{params})
}

export function findServPriceList(params) {
    return yid.http.get(`${prefix}/serviceprice/findServPriceList`,{params})
}
export function findServPriceListPage(params) {
    return yid.http.get(`${prefix}/serviceprice/findServPriceListPage`,{params})
}

export function addServs(params) {
    return yid.http.post(`${prefix}/serviceprice/addServs`,params)
}

export function batchChangPrices(params) {
    return yid.http.post(`${prefix}/serviceprice/batchChangPrices`,params)
}

export function batchServiceCards(params) {
    return yid.http.post(`${prefix}/serviceprice/batchServiceCards`,params)
}

export function saveBasePrice(params) {
    return yid.http.post(`${prefix}/serviceprice/saveBasePrice`,params)
}

export function saveServcards(params) {
    return yid.http.post(`${prefix}/serviceprice/saveServcards`,params)
}

export function delServCard(id) {
    return yid.http.delete(`${prefix}/servicecard/${id}`)
}

export function savespecials(params) {
    return yid.http.post(`${prefix}/serviceprice/savespecials`,params)
}

export function delServSpeical(id) {
    return yid.http.delete(`${prefix}/servicespecial/${id}`)
}

export function savePerfratio(params) {
    return yid.http.post(`${prefix}/serviceprice/savePerfratio`,params)
}

export function queryPerfratio(spcode) {
    return yid.http.get(`${prefix}/serviceprice/queryPerfratio/${spcode}`)
}
export function deletePerfratio(id) {
    return yid.http.get(`${prefix}/serviceprice/deletePerfratio/${id}`)
}
export function getServiceGroup(params) {
    return yid.http.post(`${prefix}/serviceGroup/getServiceGroup`,params)
}
export function saveServiceGroup(params) {
    return yid.http.post(`${prefix}/serviceGroup/saveServiceGroup`,params)
}
export default {
    /** 查询所有服务项止*/
    findServiceList,
    /** 查询所有价格服务项止*/
    findServPriceList,
    findServPriceListPage,
    /** 增加基础项目*/
    addServs,
    /** 批量修改价格*/
    batchChangPrices,
    /** 批量修改会员卡折扣*/
    batchServiceCards,
    /** 保存基础定介*/
    saveBasePrice,
    /** 保存会员卡折扣*/
    saveServcards,
    /** 删除会员卡折扣*/
    delServCard,
    /** 保存特殊员工价*/
    savespecials,
    /** 删除*/
    delServSpeical,
    /** 添加业绩占比*/
    savePerfratio,
    /** 查询业绩占比*/
    queryPerfratio,
    /** 删除业绩占比*/
    deletePerfratio,
    //获取分组
    getServiceGroup,
    //保存分组
    saveServiceGroup
}
