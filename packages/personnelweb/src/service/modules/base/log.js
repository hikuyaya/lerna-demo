import yid from '@src/library'

const prefix = 'api-chain/logger';
export function list(params) {
    return yid.http.get(`${prefix}`, {params})
}
//log
export default {
   list
}
