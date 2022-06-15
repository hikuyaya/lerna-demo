/* eslint-disable */
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style'
function generateArray(table) {
  var out = []
  var rows = table.querySelectorAll('tr')
  var ranges = []
  for (var R = 0; R < rows.length; ++R) {
    var outRow = []
    var row = rows[R]
    var columns = row.querySelectorAll('td')
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C]
      var colspan = cell.getAttribute('colspan')
      var rowspan = cell.getAttribute('rowspan')
      var cellValue = cell.innerText
      if (cellValue !== '' && cellValue == +cellValue) cellValue = +cellValue

      //Skip ranges
      ranges.forEach(function (range) {
        if (
          R >= range.s.r &&
          R <= range.e.r &&
          outRow.length >= range.s.c &&
          outRow.length <= range.e.c
        ) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null)
        }
      })

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1
        colspan = colspan || 1
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        })
      }

      //Handle Value
      outRow.push(cellValue !== '' ? cellValue : null)

      //Handle Colspan
      if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null)
    }
    out.push(outRow)
  }
  return [out, ranges]
}

function datenum(v, date1904) {
  if (date1904) v += 1462
  var epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {}
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  }

  for (var R = 0; R != data.length; ++R) {
    //创建单元格
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C
      const cell = {
        v: data[R][C],
        s: {
          border: {
            top: { style: 'thin', color: { rgb: 'cccccc' } },
            left: { style: 'thin', color: { rgb: 'cccccc' } },
            bottom: { style: 'thin', color: { rgb: 'cccccc' } },
            right: { style: 'thin', color: { rgb: 'cccccc' } }
          },
          font: {
            name: '宋体',
            sz: 10,
            color: {
              auto: 1,
              rgb:
                R != 0 && R != 1
                  ? data[R][C] != null
                    ? data[R][C].indexOf('迟到') != -1 ||
                      data[R][C].indexOf('早退') != -1 ||
                      data[R][C].indexOf('旷工') != -1
                      ? 'FF0000'
                      : '000000'
                    : '000000'
                  : '000000'
            }
          },
          fill: {
            //背景色
            fgColor: {
              rgb:
                R != 0 && R != 1
                  ? data[R][C] != null
                    ? data[R][C].indexOf('迟到') != -1 ||
                      data[R][C].indexOf('早退') != -1
                      ? 'FDE9D9'
                      : data[R][C].indexOf('旷工') != -1
                      ? 'F2DCDB'
                      : 'ffffff'
                    : 'ffffff'
                  : 'ffffff'
            }
          },
          alignment: {
            /// 自动换行
            // wrapText: 1,
            wrapText: false,
            // 居中
            horizontal: 'center',
            vertical: 'center',
            indent: 0
          }
        }
      }
      if (cell.v == null) continue
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      })

      if (typeof cell.v === 'number') cell.t = 'n'
      else if (typeof cell.v === 'boolean') cell.t = 'b'
      else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = XLSX.SSF._table[14]
        cell.v = datenum(cell.v)
      } else cell.t = 's'
      ws[cell_ref] = cell
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
  return ws
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id)
  var oo = generateArray(theTable)
  var ranges = oo[1]

  /* original data */
  var data = oo[0]
  var ws_name = 'SheetJS'

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data)

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  // console.log(ranges)

  ws['!merges'] = ranges

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })

  saveAs(
    new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }),
    'test.xlsx'
  )
}
// 对此方法进行修改，如下：
export function export_json_to_excel({
  multiHeader2 = [], // 第一行表头
  multiHeader = [], // 第二行表头
  header, // 第三行表头
  data,
  filename, //文件名
  merges = [], // 合并
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  /* original data */
  filename = filename || '列表'
  data = [...data]
  data.unshift(header)

  for (let i = multiHeader2.length - 1; i > -1; i--) {
    data.unshift(multiHeader2[i])
  }

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  // let fontCellStyle = {
  //     font: {
  //       name: '宋体',
  //       sz: 18,
  //       color: { rgb: "red" },
  //       bold: true,
  //     },
  //     alignment: {//对齐方式
  //       horizontal: 'center',//水平居中
  //       vertical: 'center',//竖直居中
  //       wrapText: 1,
  //     },
  //   }
  var ws_name = 'SheetJS'
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data, header.length)

  // console.log(header.length,'header的长度')
  let columnLength = header.length
  let index
  for (let i = 0; i < columnLength; i++) {
    //合并列
    let index_temp = Math.ceil(i / 3) //判断是第几个日期
    if (i != 0) {
      //A列固定eename

      if (index_temp != index) {
        //避免每3列合并的重复进入
        if (i < 25) {
          //B到Y列， 每3列一合并
          merges.push(
            String.fromCharCode(65 + i) +
              '1:' +
              String.fromCharCode(65 + i + 2) +
              '1'
          )
        } else if (i == 25) {
          //z1要和后面的AA1,AB1合并
          merges.push('Z1:AB1')
        } else if (i > 27 && i < 52) {
          //AC1到AZ1

          merges.push(
            'A' +
              String.fromCharCode(65 + (i - 26)) +
              '1:A' +
              String.fromCharCode(65 + (i - 26) + 2) +
              '1'
          )
        } else if (i > 51 && i < 73) {
          //BA1到BX1
          merges.push(
            'B' +
              String.fromCharCode(65 + (i - 26 * 2)) +
              '1:B' +
              String.fromCharCode(65 + (i - 26 * 2) + 2) +
              '1'
          )
        } else if (i == 73) {
          //BY1  BZ1和CA1合并
          merges.push('BY1:CA1')
        } else if (i > 75) {
          //CB1列之后
          merges.push(
            'C' +
              String.fromCharCode(65 + (i - 26 * 3)) +
              '1:C' +
              String.fromCharCode(65 + (i - 26 * 3) + 2) +
              '1'
          )
        }
      }

      // String.fromCharCode(65 + i)
    }
    index = index_temp
  }
  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = []
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row =>
      row.map(val => {
        /*先判断是否为null/undefined*/
        if (val == null) {
          return {
            wch: 10
          }
        } else if (val.toString().charCodeAt(0) > 255) {
        /*再判断是否为中文*/
          return {
            // 'wch': val.toString().length * 2
          }
        } else {
          return {
            // 'wch': val.toString().length
          }
        }
      })
    )
    /*以第一行为初始值*/
    let result = colWidth[0]
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch']
        }
      }
    }
    ws['!cols'] = result
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  let wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'buffer',
    cellStyles: true
  }

  // var wbout = XLSXStyle.write(wb,wopts);
  var wbout = XLSXStyle.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })
  // wbOut = XLSXStyle.write(wb, { bookType: bookType, bookSST: false, type: 'binary' })
  // debugger
  saveAs(
    new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }),
    `${filename}.${bookType}`
  )
}
