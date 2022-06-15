import yid from '@src/library'

const prefix = 'api-pers/checkchstatistics'

export function chstatisticsList(params) {
  return yid.http.get(`${prefix}/chstatisticsList`, { params })
}

export default {
  chstatisticsList
}
