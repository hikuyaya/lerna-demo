import yid from '@src/library'

const prefix = 'api-chain/employee';
const prefixManageData = 'api-chain/datamanager';

export function list(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function getManageData(params) {
    return yid.http.get(`${prefixManageData}/getManageData`, {params})
}

export function manageData(params) {
    return yid.http.post(`${prefixManageData}/saveManageData`,params)
}

export default {
    list,
    getManageData,
    manageData
}