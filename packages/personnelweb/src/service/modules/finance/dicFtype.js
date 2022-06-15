import yid from '@src/library'

const prefix = 'api-finance'

export function ftypeAll(params) {
  const url = `${prefix}/dicshopftype/list/all`
  return yid.http.get(url, { params })
}

export default {
  ftypeAll
}
