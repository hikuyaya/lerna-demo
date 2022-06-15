import yid from '@src/library'


const prefix = 'api-push/smsaccount/';

export function assignListForChain(params) {
    return yid.http.get(`${prefix}chain/assignList`, {params})
}

export default {
    assignListForChain
}