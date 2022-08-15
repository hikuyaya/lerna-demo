<!--
 * @Author: wqy
 * @Date: 2022-08-12 10:03:11
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-15 15:56:13
 * @FilePath: \personnelweb\src\views\salary-business\pay-approve\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <div>
      <el-button type="primary" @click="$emit('back')" class="mg-b-24"
        >返回</el-button
      >
    </div>
    <div class="flex info-row">
      <div class="w20"><span>单号：</span> {{ info.billCode }}</div>
      <div class="w20"><span>门店：</span> {{ info.shopName }}</div>
      <div class="w20"><span>编码：</span> {{ info.shopCode }}</div>
      <div class="w20">
        <span>申请月份：</span
        ><span class="red bold">{{ info.year }}-{{ info.month }}</span>
      </div>
      <div class="w20">
        <span>审核状态：</span>
        <span
          class="bold"
          :class="info.approvalStatus == 3 ? 'green' : 'red'"
          >{{
            info.approvalStatus == 1
              ? '待提交'
              : info.approvalStatus == 2
              ? '待审核'
              : info.approvalStatus == 3
              ? '已审核'
              : info.approvalStatus == 0
              ? '已驳回'
              : info.approvalStatus
          }}</span
        >
      </div>
    </div>
    <div class="flex info-row">
      <div class="w20"><span>创建时间：</span> {{ info.createdTime }}</div>
      <div class="w20"><span>创建人：</span> {{ info.createdBy }}</div>
      <div class="w20"><span>审核人：</span> {{ info.approvalEename }}</div>
      <div class="w20">
        <span>审核时间：</span>
        {{ info.approvalTime }}
      </div>
    </div>
    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column
        label="序号"
        type="index"
        width="60px"></yid-table-column>
      <yid-table-column
        label="员工姓名"
        prop="eeName"
        width="100px"></yid-table-column>
      <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
      <yid-table-column label="职务" prop="psName"></yid-table-column>
      <yid-table-column label="应发工资" prop="actualMoney"></yid-table-column>
      <yid-table-column label="未发工资" prop="surplusMoney"></yid-table-column>
      <yid-table-column label="打款工资" prop="payMoney"></yid-table-column>
      <yid-table-column label="打款后工资" prop="paySurplusMoney">
      </yid-table-column>
      <yid-table-column label="对公打款" prop="publicMoney"> </yid-table-column>
      <yid-table-column label="对私打款" prop="privateMoney">
      </yid-table-column>
      <yid-table-column label="剩余对公额度" prop="publicSurplusMoney">
      </yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import ImportComp from '@src/components/business/ImportComp'
import moment from 'moment'
import service from '@src/service'

export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    operateType: {
      type: String
    },
    menuId: String || Number
  },
  components: {
    ImportComp
  },
  created() {},
  data() {
    return {
      info: {},
      defaultParams: {
        searchType: 1
      },
      targetMonthDays: 0, // 当月
      importCompVisible: false,
      tableData: [],
      rules: {
        year: [{ required: true, message: '请输入' }],
        month: [{ required: true, message: '请输入' }],
        billType: [{ required: true, message: '请选择' }]
      },
      chooseStaffVisible: false,
      chooseStaffColumns: [
        { label: '员工姓名', prop: 'eeName' },
        { label: '员工编码', prop: 'eeCode' },
        { label: '岗位名称', prop: 'postName' },
        { label: '门店编码', prop: 'bbCode' },
        { label: '门店名称', prop: 'bbName' },
        { label: '职务', prop: 'positionName' },
        { label: '级别', prop: 'positionLevelName' },
        { label: '级别1', prop: 'level1Name' }
      ],
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        { label: '出勤天数', prop: 'actualDayCount' }
      ],
      dynamicColumns: []
    }
  },
  computed: {
    importCompFailColumns: function () {
      return this.importCompColumns.concat([
        { label: '失败原因', prop: 'errorMessageList' }
      ])
    }
  },
  methods: {
    // 新增时初始化年月
    initDate() {
      let date = moment(new Date()).subtract(1, 'months').format('YYYY-M')
      const [year, month] = date.split('-')
      this.info = {
        year,
        month,
        billType: '1'
      }
    },
    async queryDetail() {
      const { data } = await service.salaryBusiness.attendance.detail(
        this.value.id
      )

      const { data: tableData, columns } = this.buildDynamic(
        data.workAttendanceDayBillDetailVOList || [],
        'employeeSalItemVOList'
      )
      this.dynamicColumns = columns
      this.tableData = tableData
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
              value
            })
          }
        }
      }
      return {
        columns,
        data
      }
    },
    onQueryStaff() {
      if (this.operateType === 'add') {
        this.$refs.form.validate(valid => {
          if (valid) {
            // this.calTargetMonthDays()
            this.onSearch()
          }
        })
      } else {
        this.onSearch()
      }
    },
    async onSearch() {
      const { year, month, billType } = this.info
      let params = {
        year,
        month,
        billType
      }
      const { data } =
        await service.salaryBusiness.payRequest.getSalaryPayEmployee(params)

      this.tableData = data
    },
    calContaine(d, tableData) {
      let flag = false
      for (let i = 0; i < tableData.length; i++) {
        const t = tableData[i]
        if (t.eeCode === d.eeCode) {
          flag = true
          break
        }
      }
      return flag
    },
    onImport() {
      this.importCompVisible = true
    },
    async handleImportSave() {
      const flag = this.$refs.importCompRef.validateSave()
      if (!flag) {
        return
      }
      const importData = this.$refs.importCompRef.tableData
      const copyTableData = JSON.parse(JSON.stringify(this.tableData))
      for (let i = 0; i < copyTableData.length; i++) {
        const element = copyTableData[i]
        const item = importData.find(v => v.eeCode === element.eeCode) || {}
        element.actualDayCount = item.actualDayCount
        this.$set(this.tableData, i, element)
      }
      this.importCompVisible = false
    },
    getData() {
      return this.tableData
    },
    validate() {
      const item = this.tableData.find(v => !v.actualDayCount)
      if (item) {
        this.$message.error(`员工：${item.eeName} 出勤天数为空，请补齐！`)
        return false
      }
      return true
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        const copyVal = JSON.parse(JSON.stringify(val))
        this.info = copyVal
        this.tableData = copyVal.details
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-row {
  display: flex;
  margin: 12px 24px;
  span {
    &:nth-child(1) {
      text-align: right;
      width: 80px;
      display: inline-block;
    }
    &:nth-child(2) {
      text-align: left;
    }
  }
}
</style>
