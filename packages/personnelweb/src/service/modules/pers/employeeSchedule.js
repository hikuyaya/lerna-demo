import yid from '@src/library'

const prefix = 'api-pers/employeeschedule';

export function employeeScheduleList(params) {
    return yid.http.post(`${prefix}/employeeScheduleList`,params)
}

export function batchPb(params) {
    return yid.http.post(`${prefix}/batchPb`,params)
}

export function batchPbCopy(params) {
    return yid.http.post(`${prefix}/batchPbCopy`,params)
}

export function saveOrUpdate(params) {
    return yid.http.post(`${prefix}`,params)
}

export function changePb(params) {
    return yid.http.post(`${prefix}/changePb`,params)
}

export default {
    /**员工排班列表**/
    employeeScheduleList,
    /**批量排班**/
    batchPb,
    /**批量复制排班**/
    batchPbCopy,
    saveOrUpdate,
    /**更新排班信息**/
    changePb,
}