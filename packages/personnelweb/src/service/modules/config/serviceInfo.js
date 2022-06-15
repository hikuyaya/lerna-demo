import yid from '@src/library'

const prefix = 'api-chain';

const basefix = 'api-base';

export function findCardinfos() {
    return yid.http.get(`${prefix}/serviceinfo/cardinfos`)
}

export function findbranch(params) {
    return yid.http.get(`${prefix}/serviceinfo/findbranch`,{params})
}

export function findServiceType(params) {
    return yid.http.get(`${prefix}/serviceinfo/findServiceType`,{params})
}

export function findProductType(params) {
    return yid.http.get(`${prefix}/productcategory/list/all`,{params})
}

export function findServiceList(params) {
    return yid.http.get(`${prefix}/serviceinfo/list`,{params})
}

export function findServiceListPage(params) {
    return yid.http.get(`${prefix}/serviceinfo/listPage`,{params})
}

export function newcode() {
    return yid.http.get(`${prefix}/serviceinfo/newcode`)
}

export function findEmployees(params) {
    return yid.http.get(`${prefix}/serviceinfo/employees`,{params})
}

export function findPositions(params) {
    return yid.http.get(`${prefix}/serviceinfo/positions`,{params})
}

export function saveService(params) {
    return yid.http.post(`${prefix}/serviceinfo/save`,params)
}

export function saveServcards(params) {
    return yid.http.post(`${prefix}/serviceinfo/saveServcards`,params)
}

export function savespecials(params) {
    return yid.http.post(`${prefix}/serviceinfo/savespecials`,params)
}

export function deleteService(params) {
    return yid.http.get(`${prefix}/serviceinfo/delete`,{params})
}

export function checkPackage(id) {
    return yid.http.get(`${prefix}/serviceinfo/checkPackage/${id}`)
}

export function batchImport(params) {
    return yid.http.post(`${prefix}/serviceinfo/batchImport`,params)
}

export function batchServiceCards(params) {
    return yid.http.post(`${prefix}/serviceinfo/batchServiceCards`,params)
}

export function updateInfos(params) {
    return yid.http.post(`${prefix}/serviceinfo/updateInfos`,params)
}

export function delServspercs(id) {
    return yid.http.delete(`${prefix}/servicespecial/${id}`)
}


export function findShopCards() {
    return yid.http.get(`${prefix}/serviceinfo/findShopCards/`)
}

export function findServPriceCards(params) {
    return yid.http.get(`${prefix}/serviceinfo/findServPriceCards/`,{params})
}

export function findEeSpecial(params) {
    return yid.http.post(`${basefix}/serviceinfo/selectEeSpecial/`,params)
}

export function findEeSpecialList(params) {
    return yid.http.post(`${basefix}/serviceinfo/findEeSpecialList/`,params)
}


export function findShopServprice(params) {
    return yid.http.get(`${basefix}/serviceinfo/findShopServprice/`,{params})
}

export function findShopServpriceList(params) {
    return yid.http.get(`${basefix}/serviceinfo/findShopServpriceList/`,{params})
}

export function selectSpecialLog(params) {
    return yid.http.post(`${basefix}/serviceinfo/selectSpecialLog`,params)
}

export function setEeSpecial(params) {
    return yid.http.post(`${basefix}/serviceinfo/setEeSpecial`,params)
}

export function specialBatchImport(params) {
    return yid.http.post(`${basefix}/serviceinfo/specialBatchImport`,params)
}

export default {
    /** 所有会员卡 */
    findCardinfos,
    /** 查询所有部门 */
    findbranch,
    /** 根据部门ID查询服务类别 */
    findServiceType,
    findProductType,
    /** 查询所有服务项止*/
    findServiceList,
    findServiceListPage,
    /** 新编码*/
    newcode,
    /** 正常员工*/
    findEmployees,
    /** 正常职务*/
    findPositions,
    /** 保存*/
    saveService,
    /** 保存会员卡折扣*/
    saveServcards,
    /** 保存特殊员工价*/
    savespecials,
    /** 删除*/
    deleteService,
    /** 导入*/
    batchImport,
    /** 批量修改会员卡折扣*/
    batchServiceCards,
    /**修改多个info**/
    updateInfos,
    /** 检察套餐里有没有项目 **/
    checkPackage,
    /** 删除个人特价 **/
    delServspercs,
    /** 门店会员卡**/
    findShopCards,
    /** 项目价格会员卡**/
    findServPriceCards,
    /** 员工特殊价***/
    findEeSpecial,
    findEeSpecialList,
    /***门店项目价 **/
    findShopServprice,
    findShopServpriceList,
    selectSpecialLog,
    setEeSpecial,
    specialBatchImport
}
