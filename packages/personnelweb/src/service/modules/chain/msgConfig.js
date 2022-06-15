import yid from '@src/library'

const prefix = 'api-chain/smsconfig';

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}


export default {
    listAll,
}