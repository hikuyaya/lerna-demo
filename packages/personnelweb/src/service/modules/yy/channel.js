import yid from '@src/library'

const prefix = 'api-chain/channel'

export function getCode(params) {
  return yid.http.get(`${prefix}/getCode`, { params })
}

export function channelList(params) {
  const url = `${prefix}`
  return yid.http.get(url, { params })
}

export function saveChannel(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export default {
  /**获取编码**/
  getCode,
  /**渠道列表**/
  channelList,
  /**保存或更新**/
  saveChannel
}
