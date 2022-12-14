import yid from '@src/library'

const prefix = 'api-chain';

export function branchAndPosition() {
    const url = `${prefix}/position/list/position`
    return yid.http.get(url)
}

export function deptList(params) {
    const url = `${prefix}/branch`
    return yid.http.get(url, { params })
}

export function deptAll(params) {
    const url = `${prefix}/branch/list/all`
    return yid.http.get(url, { params })
}

export function jobList(params) {
    const url = `${prefix}/position/list`
    return yid.http.get(url, { params })
}

export function jobAll(params) {
    const url = `${prefix}/position/list/all`
    return yid.http.get(url, { params })
}

export function levelAll(params) {
    const url = `${prefix}/positionlevel/list/all`
    return yid.http.get(url, { params })
}

export function levelList(params) {
    const url = `${prefix}/positionlevel/list`
    return yid.http.get(url, { params })
}

export function getDeptByid(id) {
    const url = `${prefix}/branch/${id}`
    return yid.http.get(url)
}

export function getJobByid(id) {
    const url = `${prefix}/position/id/${id}`
    return yid.http.get(url)
}

export function getLevelByid(id) {
    const url = `${prefix}/positionlevel/${id}`
    return yid.http.get(url)
}

export function getDeptMaxId(){
    const url = `${prefix}/branch/getMaxId`
    return yid.http.get(url)
}

export function getJobMaxId(){
    const url = `${prefix}/position/getMaxId`
    return yid.http.get(url)
}

export function getLevelMaxId(){
    const url = `${prefix}/positionlevel/getMaxId`
    return yid.http.get(url)
}

export function saveDept(params) {
    const url = `${prefix}/branch`
    return yid.http.post(url, params )
}

export function saveJob(params) {
    const url = `${prefix}/position`
    return yid.http.post(url, params )
}

export function saveLevel(params) {
    const url = `${prefix}/positionlevel`
    return yid.http.post(url, params )
}

export function deleteDept(id) {
    const url = `${prefix}/branch/${id}`
    return yid.http.delete(url)
}

export function deleteJob(id) {
    const url = `${prefix}/position/${id}`
    return yid.http.delete(url)
}

export function deleteLevel(id) {
    const url = `${prefix}/positionlevel/${id}`
    return yid.http.delete(url)
}

export function serviceTypeList(params) {
    const url = `${prefix}/servicetype/list`
    return yid.http.get(url, { params })
}

export function serviceTypeAll(params) {
    const url = `${prefix}/servicetype/list/all`
    return yid.http.get(url, { params })
}

export function getServiceTypeMaxId(){
    const url = `${prefix}/servicetype/getMaxId`
    return yid.http.get(url)
}

export function saveServiceType(params) {
    const url = `${prefix}/servicetype`
    return yid.http.post(url, params )
}

export function deleteServiceType(id) {
    const url = `${prefix}/servicetype/${id}`
    return yid.http.delete(url)
}

export function productcategoryList(params) {
    const url = `${prefix}/productcategory/list`
    return yid.http.get(url, { params })
}

export function productcategoryListz(params) {
    const url = `${prefix}/productcategory/listz`
    return yid.http.get(url, { params })
}

export function getProductcategoryMaxId(){
    const url = `${prefix}/productcategory/getMaxId`
    return yid.http.get(url)
}

export function saveProductcategory(params) {
    const url = `${prefix}/productcategory`
    return yid.http.post(url, params )
}

export function deleteProductcategory(id) {
    const url = `${prefix}/productcategory/${id}`
    return yid.http.delete(url)
}

export function updateStatusDept(params) {
    const url = `${prefix}/branch/updateStatus`
    return yid.http.post(url, params )
}

export function updateStatusJob(params) {
    const url = `${prefix}/position/updateStatus`
    return yid.http.post(url, params )
}

export function updateStatusLevel(params) {
    const url = `${prefix}/positionlevel/updateStatus`
    return yid.http.post(url, params )
}

export function updateStatusServiceType(params) {
    const url = `${prefix}/servicetype/updateStatus`
    return yid.http.post(url, params )
}

export function updateStatusCategory(params) {
    const url = `${prefix}/productcategory/updateStatus`
    return yid.http.post(url, params )
}

export function updateStatusCategoryz(params) {
    const url = `${prefix}/productcategory/updateStatusz`
    return yid.http.post(url, params )
}

export function getAllf(params) {
    const url = `${prefix}/productcategory/list/allf`
    return yid.http.get(url, { params })
}

export function packageTypeList(params) {
    const url = `${prefix}/packagetype/list`
    return yid.http.get(url, { params })
}

export function packageTypeAll(params) {
    const url = `${prefix}/packagetype/list/all`
    return yid.http.get(url, { params })
}

export function getPackageTypeMaxId(){
    const url = `${prefix}/packagetype/getMaxId`
    return yid.http.get(url)
}

export function savePackageType(params) {
    const url = `${prefix}/packagetype`
    return yid.http.post(url, params )
}

export function deletePackageType(id) {
    const url = `${prefix}/packagetype/${id}`
    return yid.http.delete(url)
}

export function updatePackageType(params) {
    const url = `${prefix}/packagetype/deleteType`
    return yid.http.post(url, params )
}

export default {
    /**?????????????????????**/
    branchAndPosition,
    /** ???????????? */
    deptList,
    /**???????????????**/
    deptAll,
    /** ???????????? */
    jobList,
    /**???????????????**/
    jobAll,
    levelAll,
    /** ?????????????????? */
    levelList,
    /**??????ID????????????**/
    getDeptByid,
    /**??????ID????????????**/
    getJobByid,
    /**??????ID??????????????????**/
    getLevelByid,
    /**??????????????????code+1**/
    getJobMaxId,
    /**????????????????????????code+1**/
    getDeptMaxId,
    /**??????????????????code+1**/
    getLevelMaxId,
    /**?????????????????????**/
    saveDept,
    /**?????????????????????**/
    saveJob,
    /**?????????????????????**/
    saveLevel,
    /**????????????**/
    deleteDept,
    /**????????????**/
    deleteJob,
    /**??????????????????**/
    deleteLevel,
    /**????????????????????????**/
    serviceTypeList,
    /**?????????*/
    serviceTypeAll,
    /**??????????????????????????????code+1**/
    getServiceTypeMaxId,
    /**?????????????????????????????????**/
    saveServiceType,
    /**????????????????????????**/
    deleteServiceType,
    /**??????????????????**/
    productcategoryList,
    /**????????????????????????**/
    productcategoryListz,
    /**????????????????????????code+1**/
    getProductcategoryMaxId,
    /**???????????????????????????**/
    saveProductcategory,
    /**??????????????????**/
    deleteProductcategory,
    updateStatusDept,
    updateStatusJob,
    updateStatusLevel,
    updateStatusServiceType,
    updateStatusCategory,
    updateStatusCategoryz,
    getAllf,
    packageTypeList,
    packageTypeAll,
    getPackageTypeMaxId,
    savePackageType,
    deletePackageType,
    updatePackageType,
}

