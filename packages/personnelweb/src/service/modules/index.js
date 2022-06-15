import yid from '@src/library'

const prefix = 'api-push'
export function getAdminMsg(params) {
  return yid.http.get(`${prefix}/adminmsg`, { params })
}

export default {
  getAdminMsg
}
