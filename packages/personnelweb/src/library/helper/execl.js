import XLSX from 'xlsx'

export function readWorkbook(workbook, tableData) {
  const sheetNames = workbook.SheetNames // 工作表名称集合
  const worksheet = workbook.Sheets[sheetNames[0]] // 这里我们只读取第一张sheet
  const csv = XLSX.utils.sheet_to_csv(worksheet)
  csv2table(csv, tableData)
}

export function csv2table(csv, tableData) {
  const rows = csv.split('\n')
  rows.pop() // 最后一行没用的
  rows.forEach(function (row, index) {
    const columns = row.split(',')
    // columns.unshift(idx+1); // 添加行索引
    //              if(idx == 0) { // 添加列索引
    //                for(var i=0; i<columns.length; i++) {
    //                  html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
    //                }
    //              }
    if (index > 0 && columns[0]) {
      const data = {
        servcode: columns[0],
        servname: columns[1],
        dept: columns[2],
        servtname: columns[3],
        sertype: columns[4],
        price: columns[5]
      }
      tableData.push(data)
    }
  })
  console.log(tableData)
}

export function csv2sheet(head, data) {
  const sheet = {} // 将要生成的sheet
  data.unshift(head)
  data.forEach(function (row, i) {
    if (i === 0)
      sheet['!ref'] =
        'A1:' +
        String.fromCharCode(65 + Object.keys(data[0]).length) +
        data.length
    let j = 0
    for (const w in head) {
      sheet[String.fromCharCode(65 + j) + (i + 1)] = {
        v: row[w] == null ? '' : row[w]
      }
      j++
    }
  })
  data.shift()
  return sheet
}

export function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1'
  const workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  }
  workbook.Sheets[sheetName] = sheet
  // 生成excel的配置项
  const wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  }
  const wbout = XLSX.write(workbook, wopts)
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })

  // 字符串转ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }

  return blob
}

export function openDownloadDialog(url, saveName) {
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url) // 创建blob地址
  }
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let event
  if (window.MouseEvent) {
    event = new MouseEvent('click')
  } else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
  }
  aLink.dispatchEvent(event)
}

/** 导出
 *  head 列头
 *  tableData 数据
 *  titile 表名
 * */
export function exportExecl(head, tableData, title) {
  // 添加列头  this.tableData
  const sheet = csv2sheet(head, tableData)
  const blob = sheet2blob(sheet, title)
  openDownloadDialog(blob, title + '.xlsx')
}

/** 导入 file 文件 */
export function imporExecl(file, tableData) {
  const reader = new FileReader()
  reader.readAsBinaryString(file)
  reader.onload = function (e) {
    const data = e.target.result
    const workbook = XLSX.read(data, { type: 'binary' })
    readWorkbook(workbook, tableData)
  }
}

export default {
  imporExecl,
  exportExecl
}
