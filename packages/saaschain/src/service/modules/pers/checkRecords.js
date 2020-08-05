import yid from '@src/library'

const prefix = 'api-pers/checkrecords';

export function getRecordsList(params) {
    return yid.http.get(`${prefix}/getRecordsList`, {params})
}

export function editBc(params) {
    const url = `${prefix}/editBc`
    return yid.http.post(url, params )
}

export function editKq(params) {
    const url = `${prefix}/editKq`
    return yid.http.post(url, params )
}

export function editStatus(params) {
    const url = `${prefix}/editStatus`
    return yid.http.post(url, params )
}

export default {
    /**考勤记录**/
    getRecordsList,
    /**修改班次**/
    editBc,
    /**修改考勤**/
    editKq,
    /**修改打卡状态**/
    editStatus,
}