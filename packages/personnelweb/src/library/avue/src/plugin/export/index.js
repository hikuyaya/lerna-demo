/* eslint-disable */

import {downFile, isJson, vaildData} from '../../utils/util';
import packages from "../../core/packages";
import dayjs from 'dayjs'

export default {
    buildHeader(revealList) {
        let excelHeader = [];
        // 构建生成excel表头需要的数据结构
        this.getHeader(revealList, excelHeader, 0, 0);
        // 多行表头长短不一，短的向长的看齐，不够的补上行合并占位符
        let max = Math.max(...(excelHeader.map(a => a.length)))
        excelHeader.filter(e => e.length < max).forEach(
            e => this.pushRowSpanPlaceHolder(e, max - e.length))
        return excelHeader;
    },
    buildQuery(title, revealList) {
        let excelHeader = [];

        // 构建生成excel表头需要的数据结构
        excelHeader.push([title], [], [])           //表名
        excelHeader.push(["导出时间" + ": " + dayjs().format('YYYY-MM-DD HH:mm:ss')], [])      //导出时间
        excelHeader.push([])                      //插一行空的，用来放查询条件
        // console.log(revealList)
        if (revealList)
            for (let key in revealList) {
                //查询条件
                if (revealList[key] && revealList[key].length > 0) {
                    if (Object.prototype.toString.call(revealList[key]) == '[object Array]') {
                        if (revealList[key].length > 2 || revealList[key].length == 2) {             //日期查询条件，在查范围月的时候会有三个值,把第三个true去掉
                            let key_temp = revealList[key][0] + ' 至 ' + revealList[key][1]
                            excelHeader[excelHeader.length - 1].push(key + ':', key_temp, '', '')
                        } else {

                            excelHeader[excelHeader.length - 1].push(key + ':', revealList[key], '', '')
                        }
                    } else {
                        excelHeader[excelHeader.length - 1].push(key + ':', revealList[key], '', '')
                    }


                }
            }

        // excelHeader.push([])
        return excelHeader;
    },
    /**
     * 生成头部
     * @param headers 展示的头部
     * @param excelHeader excel头部
     * @param deep 深度
     * @param perOffset 前置偏移量
     * @returns {number}  后置偏移量
     */
    getHeader(headers, excelHeader, deep, perOffset) {
        let offset = 0
        let cur = excelHeader[deep]
        if (!cur) {
            cur = excelHeader[deep] = []
        }
        // 填充行合并占位符
        this.pushRowSpanPlaceHolder(cur, perOffset - cur.length)
        for (let i = 0; i < headers.length; i++) {
            let head = headers[i]
            cur.push(head.label)
            if (head.hasOwnProperty('children') && Array.isArray(head.children)
                && head.children.length > 0) {
                let childOffset = this.getHeader(head.children, excelHeader, deep + 1,
                    cur.length - 1)
                // 填充列合并占位符
                this.pushColSpanPlaceHolder(cur, childOffset - 1)
                offset += childOffset
            } else {
                offset++
            }
        }
        return offset;

    },
    /**
     * 填充行合并占位符
     * */
    pushRowSpanPlaceHolder(arr, count) {
        for (let i = 0; i < count; i++) {
            arr.push('!$ROW_SPAN_PLACEHOLDER')
        }
    },
    // 填充列合并占位符
    pushColSpanPlaceHolder(arr, count) {
        for (let i = 0; i < count; i++) {
            arr.push('!$COL_SPAN_PLACEHOLDER')
        }
    },
    doMerges(arr, params) {
        // 要么横向合并 要么纵向合并
        let deep = arr.length;
        let merges = [];
        let column = params.columns.length
        for (let y = 0; y < deep; y++) {
            // 先处理横向合并
            let row = arr[y];
            let colSpan = 0
            for (let x = 0; x < row.length; x++) {
                if (row[x] === '!$COL_SPAN_PLACEHOLDER') {
                    row[x] = undefined;
                    if (x + 1 === row.length) {
                        merges.push({s: {r: y, c: x - colSpan - 1}, e: {r: y, c: x}})
                    }
                    colSpan++
                } else if (colSpan > 0 && x > colSpan) {
                    merges.push({s: {r: y, c: x - colSpan - 1}, e: {r: y, c: x - 1}})
                    colSpan = 0
                } else {
                    colSpan = 0
                }
            }

        }
        // 再处理纵向合并
        let colLength = arr[0].length
        for (let x = 0; x < colLength; x++) {
            let rowSpan = 0
            for (let y = 0; y < deep; y++) {
                if (arr[y][x] === '!$ROW_SPAN_PLACEHOLDER') {
                    arr[y][x] = undefined;
                    if (y + 1 === deep) {
                        merges.push({s: {r: y - rowSpan, c: x}, e: {r: y, c: x}})
                    }
                    rowSpan++;
                } else if (rowSpan > 0 && y > rowSpan) {
                    merges.push({s: {r: y - rowSpan - 1, c: x}, e: {r: y - 1, c: x}})
                    rowSpan = 0;
                } else {
                    rowSpan = 0;
                }
            }
        }
        return merges;
    },

    /**
     * 从github复制过来的
     */
    aoa_to_sheet(data, headerRows, params) {
        const ws = {};
        const range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};         //给单元格范围赋值，e.c起始列，e.r起始行  s.c结束列，s.r结束行
        let moneyArr = []
        let calcArr = []
        let align
        for (let i = 0; i < params.columns.length; i++) {

            if (params.columns[i].type == 'money') {
                moneyArr.push(i)                     //money类型的数组，记列的索引
                calcArr.push(i)
            } else if (params.columns[i].type == 'number') {
                calcArr.push(i)
            }
        }
        let numberType, numFmt
        for (let R = 0; R !== data.length; ++R) {
            for (let C = 0; C !== data[R].length; ++C) {
                numberType = false
                align = 'center'
                if (moneyArr.includes(C) && R > 6) {              //导出字段类型为money的保留两位小数
                    data[R][C] = parseFloat(data[R][C]).toFixed(2)
                    align = 'right'
                    numberType = true
                    numFmt = "0.00"
                }
                if (calcArr.includes(C) && R > 6) {
                    numberType = true
                }

                if (range.s.r > R) {
                    range.s.r = R;
                }
                if (range.s.c > C) {
                    range.s.c = C;
                }
                if (range.e.r < R) {
                    range.e.r = R;
                }
                if (range.e.c < C) {
                    range.e.c = C;
                }
                /// 这里生成cell的时候，使用上面定义的默认样式
                if (R == 5 && C != 0) {

                } else {
                    if (R == 5 && C == 0) {               //查询条件那一行
                        let search = data[R].join(' ')
                        const cell = {
                            v: vaildData(search, ''),
                            s: {
                                font: {name: "宋体", sz: 11, color: {auto: 1, rgb: '000000'}, bold: true},
                                alignment: {
                                    /// 自动换行
                                    wrapText: false,
                                    // 居中
                                    horizontal: "center",
                                    vertical: "center",
                                    indent: 0
                                }
                            }
                        };
                        cell.s.border = {
                            top: {style: 'thin', color: {rgb: "#000"}},
                            left: {style: 'thin', color: {rgb: "#000"}},
                            bottom: {style: 'thin', color: {rgb: "#000"}},
                            right: {style: 'thin', color: {rgb: "#000"}},

                        };
                        cell.s.fill = {
                            patternType: 'none',
                            // fgColor: {theme: 3, "tint": 0.3999755851924192, rgb: 'F5F7FA'},
                            // fgColor:{"tint": 0.3999755851924192,rgba:(0,0,0,0)}
                            // bgColor: {theme: 2, "tint": 0.3999755851924192, rgba:(0,0,0,0)}
                        }

                        const cell_ref = XLSX.utils.encode_cell({c: C, r: R})
                        if (typeof cell.v === 'number') {
                            cell.t = 'n';
                        } else if (typeof cell.v === 'boolean') {
                            cell.t = 'b';
                        } else {
                            cell.t = 's';
                        }
                        ws[cell_ref] = cell;
                    } else {
                        const cell = {
                            v: numberType ? Number(vaildData(data[R][C], '')) : vaildData(data[R][C], ''),
                            s: {
                                numFmt: numberType ? numFmt : "",
                                font: {name: "宋体", sz: 11, color: {auto: 1, rgb: '000000'}, bold: true},
                                alignment: {
                                    /// 自动换行
                                    // wrapText: 1,
                                    // 居中
                                    horizontal: align,
                                    vertical: numberType ? "right" : "center",
                                    indent: 0
                                }
                            }
                        };
                        // 头部列表加边框
                        cell.s.border = {
                            top: {style: 'thin', color: {rgb: "#000"}},
                            left: {style: 'thin', color: {rgb: "#000"}},
                            bottom: {style: 'thin', color: {rgb: "#000"}},
                            right: {style: 'thin', color: {rgb: "#000"}},
                        };
                        cell.s.fill = {
                            alignment: {
                                wrapText: false
                            },
                            patternType: 'none',
                            bgColor: {rgb: '00FFFFFF'},
                            // fgColor:{"tint": 0.3999755851924192,rgba:(0,0,0,0)}
                            // bgColor: {theme: 7, "tint": 0.3999755851924192, rgb: 'F5F7FA'}
                        }
                        const cell_ref = XLSX.utils.encode_cell({c: C, r: R})
                        if (typeof cell.v === 'number') {
                            cell.t = 'n';
                        } else if (typeof cell.v === 'boolean') {
                            cell.t = 'b';
                        } else {
                            cell.t = 's';
                        }
                        ws[cell_ref] = cell;
                    }

                }
            }
        }
        if (range.s.c < 10000000) {
            ws['!ref'] = XLSX.utils.encode_range(range);
        }
        return ws;
    },
    s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    },

    // 导出 excel
    excel(params) {
        if (!window.XLSX) {
            packages.logs("xlsx");
            return;
        }
        return new Promise((resolve, reject) => {

            // 合并参数
            const _params = {
                prop: []
            };

            // 从参数中派生数据
            let search = this.buildQuery(params.title, params.searchFormat);
            _params.header = [...search, ...this.buildHeader(params.columns)];
            // _params.title = params.title || dayjs().format('YYYY-MM-DD HH:mm:ss');
            _params.title = params.title + dayjs().format('YYYY-MM-DD HH:mm:ss');
            const callback = (list) => {
                list.forEach(ele => {
                    if (ele.children && ele.children instanceof Array) {
                        callback(ele.children)
                    } else {
                        _params.prop.push(ele.prop)
                    }
                })
            }
            callback(params.columns)
            _params.data = params.data.map(row =>
                _params.prop.map(prop => {
                    let data = row[prop];
                    if (isJson(data)) data = JSON.stringify(data);
                    return data;
                })
            );
            let headerRows = _params.header.length;
            _params.header.push(..._params.data, []);
            // 计算合并
            let merges = this.doMerges(_params.header, params)
            // 生成sheet
            let ws = this.aoa_to_sheet(_params.header, headerRows, params);
            // 单元格合并
            //  console.log(params.columns.length-1)
            ws['!merges'] = [{s: {r: 0, c: 0}, e: {r: 2, c: params.columns.length - 1}},       //表名三排
                {s: {r: 3, c: 0}, e: {r: 4, c: params.columns.length - 1}},       //导出时间两排
                {s: {r: 5, c: 0}, e: {r: 5, c: params.columns.length - 1}},       //查询条件
            ]
            ws['!merges'] = [...ws['!merges'], ...merges]

            for (let i = 1; i < params.columns.length + 1; i++) {              //遍历列
                for (let m = 1; m < 7; m++) {
                    let temp                                //遍历上面固定6行的表头，加边框
                    if (parseInt(i) < 26 || parseInt(i) == 26) {
                        temp = String.fromCharCode(64 + parseInt(i)) + m   //只获取到z列， 选择字段超出时可能表头后面的没边框
                    } else if (parseInt(i) > 26 && parseInt(i) < 53) {       //AA列到AZ列
                        temp = 'A' + String.fromCharCode(64 + parseInt(i - 26)) + m
                    } else if (parseInt(i) > 52 && parseInt(i) < 85) {       //BA列到BZ列
                        temp = 'B' + String.fromCharCode(64 + parseInt(i - 52)) + m
                    } else if (parseInt(i) > 84 && parseInt(i) < 120) {
                        temp = 'C' + String.fromCharCode(64 + parseInt(i - 84)) + m
                    }

                    if (i != 1) {
                        ws[temp] = {
                            s: {
                                fill: {
                                    alignment: {
                                        wrapText: true
                                    },
                                    patternType: 'none',
                                    // fgColor:{"tint": 0.3999755851924192,rgba:(0,0,0,0)}
                                    // bgColor: {theme: 7, "tint": 0.3999755851924192, rgb: 'F5F7FA'}
                                },
                                border: {
                                    bottom: {
                                        style: 'thin',
                                        color: {
                                            rgb: '#000'
                                        }
                                    },
                                    right: {
                                        style: 'thin',
                                        color: {
                                            rgb: '#000'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            // ws['!merges'] = merges;

            // 头部冻结
            ws["!freeze"] = {
                xSplit: "1",
                ySplit: "" + headerRows,
                topLeftCell: "B" + (headerRows + 1),
                activePane: "bottomRight",
                state: "frozen",
            };
            // 列宽
            ws['!cols'] = [{wpx: 165}];
            let workbook = {
                SheetNames: [_params.title],
                Sheets: {}
            };

            workbook.Sheets[_params.title] = ws;
            // excel样式
            let wopts = {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary',
                cellStyles: true,
            };
            let wbout = XLSX.write(workbook, wopts);
            let blob = new Blob([this.s2ab(wbout)], {type: "application/octet-stream"});
            downFile(blob, _params.title + '.xlsx')
            resolve();
        });
    },// 导入 xlsx
    xlsx(file) {

        if (!window.saveAs || !window.XLSX) {
            packages.logs("file-saver");
            packages.logs("xlsx");
            return;
        }
        const xlsx = window.XLSX;
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            const fixdata = data => {
                let o = ''
                let l = 0
                const w = 10240
                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
                return o
            }
            const getHeaderRow = sheet => {
                const headers = []
                const range = xlsx.utils.decode_range(sheet['!ref'])
                let C
                const R = range.s.r
                for (C = range.s.c; C <= range.e.c; ++C) {
                    var cell = sheet[xlsx.utils.encode_cell({c: C, r: R})]
                    var hdr = 'UNKNOWN ' + C
                    if (cell && cell.t) hdr = xlsx.utils.format_cell(cell)
                    headers.push(hdr)
                }
                return headers
            }
            reader.onload = e => {
                const data = e.target.result
                const fixedData = fixdata(data)
                const workbook = xlsx.read(btoa(fixedData), {type: 'base64'})
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]
                const header = getHeaderRow(worksheet)
                const results = xlsx.utils.sheet_to_json(worksheet)
                resolve({header, results})
            }
            reader.readAsArrayBuffer(file)
        })
    }
}
