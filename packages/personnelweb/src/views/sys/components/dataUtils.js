export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return
  }

  for (let key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] === '')
    ) {
      delete obj[key]
    }
  }
  return obj
}

export function clone(obj) {
  var o
  if (typeof obj == 'object') {
    if (obj === null) {
      o = null
    } else {
      if (obj instanceof Array) {
        o = []
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]))
        }
      } else {
        o = {}
        for (var j in obj) {
          o[j] = clone(obj[j])
        }
      }
    }
  } else {
    o = obj
  }
  return o
}

/**
 * 将科学计数法的数字转为字符串
 * 说明：运算精度丢失方法中处理数字的时候，如果出现科学计数法，就会导致结果出错
 * 4.496794759834739e-9  ==> 0.000000004496794759834739
 * 4.496794759834739e+9  ==> 4496794759.834739
 * @param  num
 */
const toNonExponential = num => {
  if (num == null) {
    return num
  }
  if (typeof num == 'number') {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
  } else {
    return num
  }
}

export const math = {
  /**
   * 取余 - js运算精度丢失问题
   * @param arg1  数1
   * @param arg2  数2
   * 12.24 % 12  ==> 0.2400000000000002
   * {{ 12.24 | mod( -12 ) }}  ==>  0.24
   */

  mod: (arg1, arg2) => {
    arg1 = Number(arg1)
    arg2 = Number(arg2)
    if (!arg2) {
      return null
    }
    if (!arg1 && arg1 !== 0) {
      return null
    } else if (arg1 === 0) {
      return 0
    }
    let intNum = arg1 / arg2
    intNum = intNum < 0 ? Math.ceil(arg1 / arg2) : Math.floor(arg1 / arg2) // -1.02 取整为 -1; 1.02取整为1
    let intVal = this.multiply(intNum, arg2)
    return this.sub(arg1, intVal)
  },

  /**
   * 减法 - js运算精度丢失问题
   * @param arg1  数1
   * @param arg2  数2
   * 0.0023 - 0.00000011  ==>  0.0022998899999999997
   * {{ 0.0023 | minus( 0.00000011 ) }}  ==>  0.00229989
   */
  sub: (arg1, arg2) => {
    arg1 = Number(arg1) || 0
    arg2 = Number(arg2) || 0
    arg1 = toNonExponential(arg1)
    arg2 = toNonExponential(arg2)
    var r1, r2, m, n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    // 动态控制精度长度
    n = r1 >= r2 ? r1 : r2
    return ((this.multiply(arg1, m) - this.multiply(arg2, m)) / m).toFixed(n)
  },
  /**
   * 除法 - js运算精度丢失问题
   * @param arg1  数1
   * @param arg2  数2
   * 0.0023 / 0.00001 ==> 229.99999999999997
   * {{ 0.0023 | divide(0.00001) }} ==> 230
   */
  divide: (arg1, arg2) => {
    arg1 = Number(arg1)
    arg2 = Number(arg2)
    if (!arg2) {
      return null
    }
    if (!arg1 && arg1 !== 0) {
      return null
    } else if (arg1 === 0) {
      return 0
    }
    arg1 = toNonExponential(arg1)
    arg2 = toNonExponential(arg2)
    var n1, n2
    var r1, r2 // 小数位数
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    n1 = Number(arg1.toString().replace('.', ''))
    n2 = Number(arg2.toString().replace('.', ''))
    return this.multiply(n1 / n2, Math.pow(10, r2 - r1))
    // return (n1 / n2) * Math.pow(10, r2 - r1);   // 直接乘法还是会出现精度问题
  },

  /**
   * 乘法 - js运算精度丢失问题
   * @param arg1  数1
   * @param arg2  数2
   * 0.0023 * 100 ==> 0.22999999999999998
   * {{ 0.0023 | multiply(100) }} ==> 0.23
   */
  multiply: (arg1, arg2) => {
    arg1 = Number(arg1)
    arg2 = Number(arg2)
    if ((!arg1 && arg1 !== 0) || (!arg2 && arg2 !== 0)) {
      return null
    }
    arg1 = toNonExponential(arg1)
    arg2 = toNonExponential(arg2)
    var n1, n2
    var r1, r2 // 小数位数
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    n1 = Number(arg1.toString().replace('.', ''))
    n2 = Number(arg2.toString().replace('.', ''))
    return (n1 * n2) / Math.pow(10, r1 + r2)
  }
}
