//myJoinField    指定对象属性进行拼接
Array.prototype.joinField = function (field, separator, limitNum) {
  if (this.length == 0) {
    return ''
  }
  if (separator == undefined) {
    separator = ','
  }
  if (!(this instanceof Object)) {
    return ''
  }
  var str = '' + this[0][field]
  for (var i = 1; i < this.length; i++) {
    if (this[i][field]) {
      str = str + separator + this[i][field]
    }
  }
  if (limitNum && str.length > limitNum) str = str.substr(0, limitNum) + '...'
  return str
}
