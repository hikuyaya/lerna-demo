<!--
 * @Author: wqy
 * @Date: 2022-08-19 09:06:51
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-19 10:24:40
 * @FilePath: \personnelweb\src\views\salary-report\shop-salary-detail\shopSalaryDetail.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions" :defaultParams="params">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <!-- <el-button type="primary" v-print="printObj" v-if="tableData.length"
              >打印</el-button
            > -->
            <el-button type="primary" @click="handlePrint(1)"
              >打印收入表</el-button
            >
            <el-button type="primary" @click="handlePrint(-1)"
              >打印支出表</el-button
            >
          </div>
        </template>
      </search-top>
      <yid-table
        :data="tableData"
        ref="table"
        class="mg-t-12"
        height="calc(100% - 38px)">
        <yid-table-column label="员工姓名" prop="eeName" width="80px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="shopName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="职务"
          prop="psName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="级别"
          prop="pslName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="年"
          prop="year"
          width="80px"></yid-table-column>
        <yid-table-column
          label="月"
          prop="month"
          width="80px"></yid-table-column>
        <yid-table-column label="审批状态" prop="approvalStatus" width="80px">
          <template slot-scope="scope">
            {{
              scope.row.approvalStatus == 1
                ? '待提交'
                : scope.row.approvalStatus == 2
                ? '待审核'
                : scope.row.approvalStatus == 3
                ? '已审核'
                : scope.row.approvalStatus == 0
                ? '已驳回'
                : scope.row.approvalStatu
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="计算状态" prop="isCalc" width="80px">
          <template slot-scope="scope">
            {{
              scope.row.isCalc == 1
                ? '已计算'
                : scope.row.isCalc == 0
                ? '未计算'
                : scope.row.approvalStatu
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="实发工资"
          prop="actualMoney"
          width="120px"></yid-table-column>
        <yid-table-column
          label="合计收入"
          prop="addMoney"
          width="120px"></yid-table-column>
        <yid-table-column
          label="合计支出"
          prop="subMoney"
          width="120px"></yid-table-column>
        <yid-table-column
          v-for="column in dynamicColumns"
          :key="column.eeCode"
          :label="column.label"
          :prop="column.code">
          <template slot-scope="scope">
            {{ scope.row[column.label] }}
          </template>
        </yid-table-column>
      </yid-table>
      <div ref="printId" id="printId" class="print-area hide">
        <div class="print-title mg-b-16">
          <span>工资明细表</span>
          <span
            >{{ userInfo.shopname }}--{{ params.year }}年{{
              params.month
            }}月：{{
              signType == 1 ? '收入' : signType == -1 ? '支出' : '未知'
            }}表</span
          >
        </div>
        <table class="print-table" cellspacing="0" cellpadding="0" border="1">
          <thead>
            <tr>
              <td :width="headConfig['员工姓名'] || '60px'">员工姓名</td>
              <td :width="headConfig['实际收入'] || '70px'">实际收入</td>
              <td :width="headConfig['合计收入'] || '70px'">合计收入</td>
              <td :width="headConfig['合计支出'] || '70px'">合计支出</td>
              <td
                v-for="column in printDynamicColumns"
                :key="'head' + column.label"
                :width="headConfig[column.label] || '60px'">
                {{ column.label }}
              </td>
            </tr>
          </thead>
          <tbody v-if="tableData.length">
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.eeName }}</td>
              <td>{{ item.actualMoney }}</td>
              <td>{{ item.addMoney }}</td>
              <td>{{ item.subMoney }}</td>
              <td
                v-for="column in printDynamicColumns"
                :key="'body' + column.label">
                {{ item[column.label] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import service from '@src/service'
import printJs from 'print-js'
import html2canvas from 'html2canvas'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: { SearchTop },
  data() {
    return {
      addCompVisible: false,
      removeCompVisible: false,
      operateType: 'add',
      selectRow: {},
      params: {},
      conditions: [
        {
          label: '年月',
          prop: 'date',
          type: 'date',
          dateType: 'month',
          width: '18%',
          format: 'yyyy年M月',
          'value-format': 'yyyy-M',
          required: true
        },
        {
          label: '员工状态',
          prop: 'eeStatus',
          type: 'select',
          width: '14%',
          options: [
            { label: '在岗', value: '1' },
            { label: '离岗', value: '2' }
          ]
        },
        {
          label: '计算状态',
          prop: 'isCalc',
          type: 'select',
          width: '14%',
          options: [
            { label: '已计算', value: '1' },
            { label: '未计算', value: '0' }
          ]
        }
      ],
      tableData: [],
      dynamicColumns: [],
      addDynamicColumns: [],
      subDynamicColumns: [],
      signType: null, // 1 增项 -1 减项
      printObj: {
        id: 'printId',
        popTitle: ' ',
        extraHead:
          '<meta http-equiv="Content-Language" content="zh-cn"/>,<style>  #printId { width: 100%; !important; } <style>'
      },
      printVisible: false,
      headConfig: {},
      sum: {}, // 合计的数据
      scCodeMoneyTotal: {} // 动态列合计的数据
    }
  },
  created() {
    const json = require(`../../../../public/static/json/print.json`)
    this.headConfig = json
    this.initDate()
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    }),
    printDynamicColumns() {
      if (this.signType == 1) {
        return this.addDynamicColumns
      } else if (this.signType == -1) {
        return this.subDynamicColumns
      } else {
        return []
      }
    }
  },
  methods: {
    initDate() {
      this.params = {
        date: moment(new Date()).subtract(1, 'months').format('yyyy-M')
      }
    },
    queryList() {
      this.onSearch()
    },
    async onSearch() {
      if (!this.$refs.searchTop.requiredValidate()) {
        this.$message.error('查询必填项或必选项不能为空')
        return
      }
      let params = this.$refs.searchTop.getSearchParams()
      const [year, month] = params.date.split('-')
      this.params = {
        date: params.date
      }
      delete params.page
      delete params.limit
      delete params.date
      params = {
        ...params,
        year,
        month
      }
      const { data } = await service.salaryReport.shopSalaryDetail.list(params)

      const { data: tableData, columns } = this.buildDynamic(
        data || [],
        'salaryItemVOList'
      )
      this.tableData = tableData
      this.dynamicColumns = columns
      this.addDynamicColumns = columns.filter(v => v.signType === 1) // 增项动态列
      this.subDynamicColumns = columns.filter(v => v.signType === -1) // 减项动态列
      console.log(this.addDynamicColumns.length, this.subDynamicColumns.length)
    },
    // 构造动态数据、列
    buildDynamic(data, key) {
      let columns = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        for (let j = 0; j < d[key].length; j++) {
          const salItem = d[key][j]
          const label = salItem.scName
          const value = salItem.money
          const code = salItem.scCode
          d[label] = value
          if (i === 0) {
            columns.push({
              label,
              value,
              code,
              inputType: salItem.inputtype,
              signType: salItem.signtype
            })
          }
        }
      }
      columns.sort((prev, next) => prev.inputType - next.inputType)
      return {
        columns,
        data
      }
    },
    async handlePrint(type) {
      this.signType = type
      const data = this.$refs.table.getCurData()
      if (!data.length) {
        this.$message.error('暂无数据可以打印')
        return
      }
      this.printVisible = true
      await this.$nextTick()
      this.onPrint()
      this.printVisible = false
    },
    // printJs转图片打印
    onPrint() {
      const printContent = this.$refs.printId
      printContent.classList.remove('hide')
      // 获取dom 宽度 高度
      const width = printContent.clientWidth
      const height = printContent.clientHeight
      // 创建一个canvas节点
      const canvas = document.createElement('canvas')

      const scale = 1 // 定义任意放大倍数，支持小数；越大，图片清晰度越高，生成图片越慢。
      canvas.width = width * scale // 定义canvas 宽度 * 缩放
      canvas.height = height * scale // 定义canvas高度 *缩放
      canvas.style.width = width * scale + 'px'
      canvas.style.height = height * scale + 'px'
      canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale

      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
      const scrollLeft =
        document.documentElement.scrollLeft || document.body.scrollLeft // 获取水平滚动轴的长度

      html2canvas(printContent, {
        canvas,
        backgroundColor: null,
        useCORS: true,
        windowHeight: document.body.scrollHeight,
        scrollX: -scrollLeft, // 解决水平偏移问题，防止打印的内容不全
        scrollY: -scrollTop
      })
        .then(canvas => {
          const url = canvas.toDataURL('image/png')
          printJs({
            printable: url,
            type: 'image',
            documentTitle: '', // 标题
            style: '@page{size:auto;margin: 0cm 1cm 0cm 1cm;}' // 去除页眉页脚
          })
          printContent.classList.add('hide')
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  .content {
    // flex: 1;
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.print-title {
  display: flex;
  align-items: flex-end;
  & > span {
    &:nth-child(1) {
      font-size: 32px;
      font-weight: bold;
      padding-right: 12px;
    }
    &:nth-child(2) {
      font-size: 16px;
    }
  }
}
table.print-table {
  font-family: Arial, sans-serif;
  font-size: 14px;
  background-color: #f0f2f5;
  border-collapse: collapse;
  color: #454545;
  // table-layout: auto;
  table-layout: fixed;
  width: 100%;
  text-align: left;
  // border-bottom-width: 1px;
  // border-bottom-style: solid;
  // border-bottom-color: #dadcde;
  border: 1px solid #dadcde;
  thead {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dadcde;
    line-height: 40px;
    font-weight: bold;
    color: #454c70;
  }
  tr {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dadcde;
    line-height: 23px;
  }
  td {
    font-size: 14px;
    font-family: Verdana;
    word-break: break-all; // 元素换行
  }
  // 斑马纹效果stripe
  tr:nth-child(even) {
    background: #f5f7f9;
  }
  tr:nth-child(odd) {
    background: #fff;
  }
}
.table-empty {
  min-height: 60px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  .table-empty-text {
    line-height: 60px;
    width: 50%;
    color: #909399;
  }
}
</style>
