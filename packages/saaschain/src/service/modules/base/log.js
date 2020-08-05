import yid from '@src/library'

const prefix = 'api-base/logger';
export function list(params) {
    return yid.http.get(`${prefix}`, {params})
}
//log
export default {
   list
}
