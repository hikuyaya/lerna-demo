<!--
 * @Author: wqy
 * @Date: 2022-08-12 15:02:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-17 13:40:27
 * @FilePath: \personnelweb\src\views\salary-report\pre-approve-salary\preApproveSalary.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" v-print="printObj" v-if="tableData.length"
              >打印</el-button
            >
            <el-button v-if="tableData.length" @click="onPrint"
              >printJs打印</el-button
            >
          </div>
        </template>
      </search-top>
      <yid-table
        :data="tableData"
        ref="table"
        class="mg-t-12"
        height="calc(100% - 38px)">
        <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
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
          width="150px"
          fixed></yid-table-column>
        <yid-table-column
          label="级别"
          prop="psName"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column
          v-for="column in dynamicColumns"
          :key="column.eeCode"
          :label="column.label"
          :prop="column.label">
          <template slot-scope="scope">
            {{ scope.row[column.label] }}
          </template>
        </yid-table-column>
      </yid-table>
      <table
        ref="printId"
        id="printId"
        class="print-table hide"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <thead>
          <tr>
            <td>员工姓名</td>
            <td v-for="column in dynamicColumns" :key="'head' + column.label">
              {{ column.label }}
            </td>
          </tr>
        </thead>
        <tbody v-if="tableData.length">
          <tr v-for="(item, tableIndex) in tableData" :key="item.id">
            <td>{{ item.eeName }}</td>
            <td
              v-for="(column, columnIndex) in dynamicColumns"
              :key="'body' + column.label">
              {{ item[column.label] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import service from '@src/service'
import printJs from 'print-js'
import html2canvas from 'html2canvas'

export default {
  components: { SearchTop },
  data() {
    return {
      addCompVisible: false,
      removeCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '1rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '15%',
          required: true
        },
        {
          label: '月',
          prop: 'month',
          type: 'input-number',
          labelWidth: '1rem',
          width: '15%',
          controls: false,
          min: 1,
          max: 12,
          required: true
        }
      ],
      tableData: [],
      dynamicColumns: [],
      printObj: {
        id: 'printId',
        popTitle: ' ',
        extraHead:
          '<meta http-equiv="Content-Language" content="zh-cn"/>,<style>  #printId { width: 100%; !important; } <style>'
      }
    }
  },
  mounted() {
    // this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    async onSearch() {
      if (!this.$refs.searchTop.requiredValidate()) {
        this.$message.error('查询必填项或必选项不能为空')
        return
      }
      const params = this.$refs.searchTop.getSearchParams()
      delete params.page
      delete params.limit
      const { data } = await service.salaryReport.preApproveSalary.list(params)
      const { data: tableData, columns } = this.buildDynamic(
        data || [],
        'salaryApplyBillItemVOList'
      )
      this.tableData = tableData
      // this.dynamicColumns = columns
      // columns.splice(0, columns.length - 10)
      this.dynamicColumns = columns
      console.log(tableData, columns)
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
          d[label] = value
          if (i === 0) {
            columns.push({
              label,
              value,
              inputType: salItem.inputtype
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
    // printJs转图片打印
    onPrint() {
      const printContent = this.$refs.printId
      // 获取dom 宽度 高度
      const width = printContent.clientWidth
      const height = printContent.clientHeight
      // 创建一个canvas节点
      const canvas = document.createElement('canvas')

      const scale = 4 // 定义任意放大倍数，支持小数；越大，图片清晰度越高，生成图片越慢。
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
table.print-table {
  font-family: Arial, sans-serif;
  font-size: 14px;
  background-color: #f0f2f5;
  border-collapse: collapse;
  color: #454545;
  table-layout: auto;
  width: 100%;
  text-align: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #dadcde;
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
    padding: 5px 10px;
    font-size: 14px;
    font-family: Verdana;
    width: 100px;
    word-break: break-all; // 元素换行
    width: 60px;
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
