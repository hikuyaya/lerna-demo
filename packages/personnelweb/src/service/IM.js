import yid from '@src/library'
import Store from '@src/store'
import { login } from './modules/auth'
//import Push from '@src/library/client.js'
let prefix = 'api-push'
export function initIM() {
  // 1 系统消息
  // 2 消息公告
  // 3 内部消息
  // 4 预约消息
  Push.connect(
    'wss://sass.yidmall.com/ws',
    'shop_cashier',
    'MF0001',
    function (frame) {
      let res = JSON.parse(frame)
      let msg = JSON.parse(res.msg)
      switch (msg.type) {
        case 1:
          Store.dispatch('user/systemMsg')
          console.log('系统消息')
          break
        case 2:
          console.log('消息公告')
          break
        case 3:
          console.log('内部消息')
          break
        case 4:
          console.log('预约消息')
          break
        case '01':
          Store.dispatch('msg/msgPay', msg.data)
          break
      }
    },
    function (frame) {
      console.error('disconnect', frame)
    }
  )
}

export function stopIM() {
  Push.disconnect()
}

export function sentMsg(params) {
  let msg = JSON.stringify({
    content: 'hello',
    type: 1
  })
  msg = encodeURIComponent(msg)
  return yid.http.post(
    `${prefix}/msgctrl/sentMsg?scode=shop_ctrl&msg=${msg}&state=1111`
  )
}

export function sentNotify(params) {
  return yid.http.post(`${prefix}/msgctrl/sentNotify`, { params })
}

export default {
  initIM,
  stopIM,
  sentMsg,
  sentNotify
}
