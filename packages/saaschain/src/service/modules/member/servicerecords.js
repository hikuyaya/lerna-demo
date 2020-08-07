import yid from '@src/library'

const prefix = 'api-member/servicerecords';

export function listLog(params) {
    return yid.http.get(`${prefix}/list/log`, {params})
}

export function memServicelogList(params) {
    return yid.http.get(`${prefix}/memServicelogList`, {params})
}

export function memServicelogExport(params) {
    return yid.http.get(`${prefix}/memServicelogExport`, {params})
}

export function listLogForChain(params) {
    return yid.http.get(`${prefix}/chain/list/log`, {params})
}

export default {
    //服务日志列表
    listLog,
    //顾客评价记录
    memServicelogList,
    //顾客评价记录导出
    memServicelogExport,
}