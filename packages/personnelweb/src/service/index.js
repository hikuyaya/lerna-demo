/*
 * @Author: wqy
 * @Date: 2022-07-05 16:15:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-26 09:03:27
 * @FilePath: \personnelweb\src\service\index.js
 * @Description:
 */
// 系统、权限等
import IM from './IM'
import auth from './modules/auth'
import user from './modules/user'
import icdriver from './modules/icdriver'
import index from './modules/index'
import dept from './modules/dept'

// 报表
import report from './modules/report'

// 字典
import dic from './modules/dic'

// 业务相关
import base from './modules/base'
import chain from './modules/chain'
import staff from './modules/staff'
import salarySetting from './modules/salarySetting'

export default {
  IM,
  auth,
  user,
  base,
  index,
  icdriver,
  chain,
  dept,
  dic,
  staff,
  salarySetting,
  report
}
