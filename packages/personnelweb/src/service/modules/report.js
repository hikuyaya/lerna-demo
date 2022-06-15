import yid from '@src/library'

const SERVICE = {
    "config-center": "api-config",
    "base-center": "api-base",
    "stock-center": "api-stock",
    "finance-center": "api-finance",
    "report-center": "api-report",
    "chain-center": "api-chain",
    "personnel-center": "api-pers",
    "yy-center": "api-yy",
    "xxw-center": "api-xxw",
    "member-center": "api-member",
    "cashier-center": "api-cashier",
}
const prefix = 'api-config';

const URL = {
    list: '/report/head/list',
    delete: '/report/head/delete?id=',
    deleteBatch: '/report/head/deleteBatch',
    // getParamsInfo: '/report/api/getQueryInfo/',
    getColumnsAndData: '/report/api/getColumnsAndData/',
    getQueryInfo: '/report/api/getQueryInfo/',
    getParamsInfo: '/report/param/listByHeadId',
    getColumns: '/report/api/getColumns/',
    getUdiyList: '/report/udiy/list/',
    addUdiyList: '/report/udiy/add'
}

export function findList(params) {
    return yid.http.get(`${prefix}${URL.list}`, {params})
}

export function deleteUrl(params) {
    return yid.http.delete(`${prefix}${URL.delete}${params}`, {})
}

export function deleteBatch(params) {
    return yid.http.delete(`${prefix}${URL.deleteBatch}`, {params})
}

export function getParamsInfo(params) {
    return yid.http.get(`${prefix}${URL.getParamsInfo}?headId=${params}`)
}

export function getColumnsAndData(code, params) {
    return yid.http.get(`${prefix}${URL.getColumnsAndData}${code}`, {params})
}

export function getColumns(code, test) {
    if (test) {
        return yid.http.get(`${prefix}${URL.getColumns}${code}?test=true`, {})
    } else {
        return yid.http.get(`${prefix}${URL.getColumns}${code}`, {})
    }

}

export function getUdiyList(code) {
    return yid.http.get(`${prefix}${URL.getUdiyList}${code}`, {})
}

export function addUdiyList(params) {
    return yid.http.post(`${prefix}${URL.addUdiyList}`, params)
}

export function getDataFromService(service, code, params) {
    return yid.http.get(`${SERVICE[service]}/sqlreport/report/${code}`, {params})
}

export function parseSql(service, params) {
    let data = new FormData();
    for (const dataKey in params) {
        data.append(dataKey,params[dataKey]);
    }

    return yid.http.post(`${SERVICE[service]}/sqlreport/parse`, data)
}
export function parseSqlResult(service, params) {
    let data = new FormData();
    for (const dataKey in params) {
        data.append(dataKey,params[dataKey]);
    }

    return yid.http.post(`${SERVICE[service]}/sqlreport/result`, data)
}

export function saveOrUpdate(params) {
    return yid.http.post(`${prefix}/report/head/saveOrUpdate`, params)
}

export function getFields(params) {
    return yid.http.get(`${prefix}/report/item/listByHeadId?headId=${params}`, {})
}
export function queryById(params) {
    return yid.http.get(`${prefix}/report/head/queryById`, {params:params})
}

export default {
    findList,
    deleteUrl,
    // getParamsInfo,
    getColumnsAndData,
    getColumns,
    getUdiyList,
    addUdiyList,
    getDataFromService,
    parseSql,
    saveOrUpdate,
    getFields,
    parseSqlResult,
    queryById
}
