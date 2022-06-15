import yid from '@src/library'
const prefix = 'api-push/smsmstatis/'

export function listChain(params) {
  return yid.http.get(`${prefix}chain/list`, { params })
}

export default {
  listChain
}
