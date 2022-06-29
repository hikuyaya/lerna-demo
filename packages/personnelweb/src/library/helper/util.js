/*
 * @Author: leejee
 * @Description: 工具类
 * @Date: 2018-07-06
 */

import { Message } from 'element-ui'

/**
 * $yid
 *
 * 获取 url 参数
 *
 * @export
 * @param {any} name 需要解析参数的 key
 * @param {any} url 需要解析参数的 url
 * @returns 需要解析参数的参数值
 */
export function queryUrlParam(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  let results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * $yid
 *
 * array to tree
 *
 * @export
 * @param {any} nodes
 * @param {string} [idKey='id']
 * @param {string} [pIdKey='pId']
 * @param {string} [childrenKey='children']
 * @returns
 */
export function toTree(
  nodes,
  idKey = 'id',
  pIdKey = 'pId',
  childrenKey = 'children'
) {
  let map = {}
  let node
  let roots = []

  nodes.forEach((item, index) => {
    map[item[idKey]] = index
  })
  for (let i = 0; i < nodes.length; i += 1) {
    node = nodes[i]
    if (
      node[pIdKey] !== '-1' &&
      node[pIdKey] !== '' &&
      nodes[map[node[pIdKey]]]
    ) {
      if (!nodes[map[node[pIdKey]]][childrenKey]) {
        nodes[map[node[pIdKey]]][childrenKey] = []
        nodes[map[node[pIdKey]]][childrenKey].push(node)
      } else {
        nodes[map[node[pIdKey]]][childrenKey].push(node)
      }
    } else {
      roots.push(node)
    }
  }

  return roots
}

/**
 * $yid
 *
 * 深拷贝
 *
 * @export
 * @param {*} item
 * @returns
 */
export function deepClone(item) {
  if (!item) {
    return item
  } // null, undefined values check

  let types = [Number, String, Boolean]
  let result

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item)
    }
  })

  if (typeof result == 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = []
      item.forEach(function (child, index) {
        result[index] = deepClone(child)
      })
    } else if (typeof item == 'object') {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == 'function') {
        result = item.cloneNode(true)
      } else if (!item.prototype) {
        // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item)
        } else {
          // it is an object literal
          result = {}
          for (let i in item) {
            result[i] = deepClone(item[i])
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor()
        } else {
          result = item
        }
      }
    } else {
      result = item
    }
  }

  return result
}

/**
 * 弹出提示消息
 *
 * @export
 * @param {string} [message=''] 提示内容，默认''
 * @param {string} [title='温馨提示'] 提示标题，默认'温馨提示'
 * @param {string} [type='success'] 提示类型，默认'success'
 * @returns
 */
export function alert(
  message = '温馨提示',
  title = '温馨提示',
  type = 'success'
) {
  return Message({ message, title, type })
}
export function info(msg = '温馨提示', title = '温馨提示', type = 'info') {
  return Message({ message: msg, title, type })
}
export function warning(
  msg = '温馨提示',
  title = '温馨提示',
  type = 'warning'
) {
  return Message({ message: msg, title, type })
}
export function error(msg = '温馨提示', title = '温馨提示', type = 'error') {
  return Message({ message: msg, title, type })
}
export function success(
  msg = '温馨提示',
  title = '温馨提示',
  type = 'success'
) {
  return Message({ message: msg, title, type })
}

/**
 * confirm 弹出提示
 *
 * @export
 * @param {string} [msg='温馨提示']
 * @param {string} [title='温馨提示']
 * @param {string} [options={ type: 'info', confirmButtonText: '确定', cancelButtonText: '取消' }]
 * @param {*} [confirmCallBack=() => {}]
 * @param {*} [cancelCallBack=() => {}]
 */
export function confirm(
  msg = '温馨提示',
  title = '温馨提示',
  options = {
    type: 'info',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  },
  confirmCallBack,
  cancelCallBack
) {
  $yid.$confirm(msg, title, {
    confirmButtonText: options.confirmButtonText,
    cancelButtonText: options.cancelButtonText,
    type: options.type,
    callback: action => {
      if (action === 'confirm') {
        confirmCallBack && confirmCallBack()
      } else {
        cancelCallBack && cancelCallBack()
      }
    }
  })
}

/**
 * 格式化时间间隔
 *
 * @param {*} date
 * @param {int} time 毫秒数
 * @returns
 */
export function formatDuration(bgTime, endTime) {
  if (bgTime > endTime) {
    console.warn(
      '【 yid 】【 util 】【 formatDuration 】格式化时间间隔出错，开始时间不能大于结束时间。',
      new Date()
    )

    return ''
  }

  const duration = this.getDuration(bgTime, endTime)

  duration.HH = duration.HH + duration.dd * 24

  if (duration.HH < 10) {
    duration.HH = '0' + duration.HH
  }
  if (duration.mm < 10) {
    duration.mm = '0' + duration.mm
  }
  if (duration.ss < 10) {
    duration.ss = '0' + duration.ss
  }
  return duration.HH + ':' + duration.mm + ':' + duration.ss
}

/**
 * 获取时间间隔
 *
 * @export
 * @param {*} bgTime
 * @param {*} endTime
 * @returns
 */
export function getDuration(bgTime, endTime) {
  const totalSecs = (endTime - bgTime) / 1000

  const dd = Math.floor(totalSecs / 3600 / 24)
  const HH = Math.floor((totalSecs - dd * 24 * 3600) / 3600)
  const mm = Math.floor((totalSecs - dd * 24 * 3600 - HH * 3600) / 60)
  const ss = Math.floor(totalSecs - dd * 24 * 3600 - HH * 3600 - mm * 60)

  return {
    dd,
    HH,
    mm,
    ss
  }
}

export function jsToFormData(config) {
  //对象转formdata格式
  let formArr = []
  let formString = ''
  for (let key in config) {
    formArr.push(key + '=' + config[key])
  }
  formString = formArr.join('&')
  return formString
}

export function formatDate(now) {
  if (!now) {
    return now
  }
  var year = new Date(now).getFullYear() //取得4位数的年份
  var month = new Date(now).getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
  var date = new Date(now).getDate() //返回日期月份中的天数（1到31）
  // var hour=now.getHours();     //返回日期中的小时数（0到23）
  // var minute=now.getMinutes(); //返回日期中的分钟数（0到59）
  // var second=now.getSeconds(); //返回日期中的秒数（0到59）
  month = month >= 10 ? month : '0' + month
  date = date >= 10 ? date : '0' + date
  return year + '-' + month + '-' + date
}

export function formatTime(now) {
  if (!now) {
    return now
  }
  var year = new Date(now).getFullYear() //取得4位数的年份
  var month = new Date(now).getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
  var date = new Date(now).getDate() //返回日期月份中的天数（1到31）
  var hour = new Date(now).getHours() //返回日期中的小时数（0到23）
  var minute = new Date(now).getMinutes() //返回日期中的分钟数（0到59）
  month = month >= 10 ? month : '0' + month
  date = date >= 10 ? date : '0' + date
  hour = hour >= 10 ? hour : '0' + hour
  minute = minute >= 10 ? minute : '0' + minute
  // var second=now.getSeconds(); //返回日期中的秒数（0到59）
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute
}

export function getStockClass(item) {
  let rowClass = ''
  if (parseInt(item.row.status) == 1) {
    rowClass = 'normal'
  } else {
    //forbidden
    rowClass = 'lack'
  }
  return rowClass
}

export function getPersCheckClass(item) {
  let rowClass = ''
  if (item.row.ccode == '0001') {
    rowClass = 'forbidden'
  } else if (item.row.ccode == '0002') {
    rowClass = 'forbidden'
  } else {
    //forbidden
    rowClass = 'normal'
  }
  return rowClass
}

export function getTableClass(item) {
  let rowClass = ''
  if (parseInt(item.row.status) == 1) {
    rowClass = 'normal'
  } else {
    rowClass = 'forbidden'
  }
  return rowClass
}

export function isEmpty(v) {
  switch (typeof v) {
    case 'undefined':
      return true
    case 'string':
      if (v.trim().length == 0) return true
      break
    case 'boolean':
      if (!v) return true
      break
    case 'number':
      if (0 === v) return false
      break
    case 'object':
      if (null === v) return true
      if (undefined !== v.length && v.length == 0) return true
      for (var k in v) {
        return false
      }
      return true
      break
  }
  return false
}

/**
 * 计算实际年龄，精确到天
 * @param {*} birthday array [year, month, day]
 * @return array
 */
export function getAge(birthday) {
  // 新建日期对象
  let date = new Date()
  // 今天日期，数组，同 birthday
  let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  // 分别计算年月日差值
  let age = today.map((value, index) => {
    return value - birthday[index]
  })
  // 当天数为负数时，月减 1，天数加上月总天数
  if (age[2] < 0) {
    // 简单获取上个月总天数的方法，不会错
    let lastMonth = new Date(today[0], today[1], 0)
    age[1]--
    age[2] += lastMonth.getDate()
  }
  // 当月数为负数时，年减 1，月数加上 12
  if (age[1] < 0) {
    age[0]--
    age[1] += 12
  }
  return age
}

/**
 * 常用工具类
 */
export default {
  queryUrlParam,
  toTree,
  deepClone,
  alert,
  info,
  warning,
  error,
  success,
  confirm,
  formatDate,
  formatTime,
  formatDuration,
  getDuration,
  jsToFormData,
  getStockClass,
  getPersCheckClass,
  getTableClass,
  isEmpty
}
