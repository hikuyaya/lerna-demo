/*
 * @Author: wqy
 * @Date: 2022-08-06 11:08:46
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-06 12:46:36
 * @FilePath: \personnelweb\src\mixins\salaryBusiness.js
 * @Description:
 */
import moment from 'moment'
export default {
  data() {
    return {
      targetMonthDays: 0 // 当月
    }
  },
  methods: {
    // 构造动态数据、列
    buildDynamic(data, key) {
      let columns = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        for (let j = 0; j < d[key].length; j++) {
          const salItem = d[key][j]
          const label = salItem.scName
          const value = salItem.money
          d[label] = value
          if (i === 0) {
            columns.push({
              label,
              value,
              inputType: salItem.inputtype,
              scCode: salItem.scCode
            })
          }
          d['inputType'] = salItem.inputtype
          //   d['scCode'] = scCode
          //   d['scName'] = label
        }
      }
      return {
        columns,
        data
      }
    },
    calTargetMonthDays() {
      this.targetMonthDays = moment(
        `${this.info.year}-${this.info.month}`,
        'YYYY-MM'
      ).daysInMonth()
    }
  }
}
