import yid from '@src/library'

const prefix = 'api-base';


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
}