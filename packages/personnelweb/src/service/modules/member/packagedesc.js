import yid from '@src/library'

const prefix = 'api-member/packagedesc'

export function memPackagedescList(params) {
  return yid.http.get(`${prefix}/memPackagedescList`, { params })
}

export default {
  memPackagedescList
}
