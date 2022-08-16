<!--
 * @Author: wqy
 * @Date: 2022-07-26 17:05:41
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 10:59:45
 * @FilePath: \personnelweb\src\views\salary-business\attendance\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <div>
      <el-button type="primary" @click="$emit('back')" class="mg-b-24"
        >返回</el-button
      >
      <el-button
        type="primary"
        v-if="operateType !== 'detail' && tableData.length"
        @click="onSave"
        class="mg-b-24"
        >保存</el-button
      >
    </div>

    <el-form
      v-if="operateType === 'add'"
      ref="form"
      :model="info"
      :rules="rules"
      label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="年" prop="year">
            <el-input-number
              v-model="info.year"
              :controls="false"
              :min="1970"
              :max="new Date().getFullYear()"
              :disabled="locked"
              class="w100">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="月" prop="month">
            <el-input-number
              v-model="info.month"
              :controls="false"
              :min="1"
              :max="12"
              :disabled="locked"
              class="w100">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="mg-l-12" @click="onQueryStaff"
            >获取员工</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <div v-else class="flex info-row">
      <div>导入月份：{{ info.year }}-{{ info.month }}</div>
      <div>
        审核状态：<span class="red bold">{{
          info.approvalStatus == 1
            ? '待提交'
            : info.approvalStatus == 2
            ? '待审核'
            : info.approvalStatus == 3
            ? '已审核'
            : info.approvalStatus == 0
            ? '已驳回'
            : info.approvalStatus
        }}</span>
      </div>
      <div>单号：{{ info.billCode }}</div>
    </div>
    <template v-if="tableData.length">
      <div class="mg-t-24 mg-b-12 tar">
        <el-button
          type="primary"
          v-if="['edit'].includes(operateType)"
          @click="onQueryStaff"
          >获取员工</el-button
        >
        <el-button
          type="primary"
          v-if="['add', 'edit'].includes(operateType)"
          @click="onImport"
          >导入</el-button
        >
      </div>
      <yid-table :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"></yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
        <yid-table-column label="职务" prop="psName"></yid-table-column>
        <yid-table-column label="门店编码" prop="shopCode"></yid-table-column>
        <yid-table-column label="门店名称" prop="shopName"></yid-table-column>

        <yid-table-column label="当月天数">
          <template slot-scope="scope">
            <span v-if="operateType === 'add'">{{ targetMonthDays }}</span>
            <span v-else>{{ scope.row.expectDayCount }}</span>
          </template>
        </yid-table-column>
        <yid-table-column label="出勤天数">
          <template slot-scope="scope">
            <span v-if="operateType === 'detail'">
              {{ scope.row.actualDayCount }}
            </span>

            <el-input-number
              v-else
              v-model="scope.row.actualDayCount"
              :controls="false"
              :min="1"
              :max="targetMonthDays"
              :precision="0"
              class="w100">
            </el-input-number>
          </template>
        </yid-table-column>
        <yid-table-column
          v-for="column in dynamicColumns"
          :key="column.eeCode"
          :label="column.label"
          :prop="column.label"></yid-table-column>
        <yid-table-column label="操作" v-if="operateType !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定删除吗？"
              @confirm="onDeleteRow(scope.$index, scope.row)">
              <i
                slot="reference"
                class="el-icon-remove-outline c-pointer font-size-22px"></i>
            </el-popconfirm>
          </template>
        </yid-table-column>
      </yid-table>
    </template>

    <el-dialog
      title="导入数据到页面"
      :visible.sync="importCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <import-comp
        v-if="importCompVisible"
        ref="importCompRef"
        :importAction="`${$yid.config.API.BASE}api-pers/workattendancedaybill/validation`"
        :importData="{
          year: info.year,
          month: info.month
        }"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/template/downExcel`"
        :downloadParams="{
          templateName: '出勤天数导入模板.xls'
        }"
        :columns="importCompColumns"
        :failColumns="importCompFailColumns">
        <el-button type="primary" @click="handleImportSave"
          >导入到页面</el-button
        >
      </import-comp>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
  async created() {
    if (this.operateType === 'add') {
      this.initDate()
    } else {
      this.queryDetail()
    }
    await this.calTargetMonthDays()
  },
  data() {
    return {
      info: {},
      defaultParams: {
        searchType: 1
      },
      targetMonthDays: 0, // 当月
      locked: false, // 门店编码、年、月是否需要被锁定
      importCompVisible: false,
      tableData: [],
      rules: {
        shopCode: [{ required: true, message: '请输入门店编码' }],
        year: [{ required: true, message: '请输入' }],
        month: [{ required: true, message: '请输入' }],
        actualDayCount: [{ required: true, message: '请输入' }]
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
        month
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
          const value =
            this.operateType === 'add' ? salItem.money : salItem.actualMoney
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
            this.onSearch()
          }
        })
      } else {
        this.onSearch()
      }
    },
    onDeleteRow(index, row) {
      const copyData = [...this.tableData]
      copyData.splice(index, 1)
      this.tableData = copyData
    },
    calTargetMonthDays() {
      this.targetMonthDays = moment(
        `${this.info.year}-${this.info.month}`,
        'YYYY-MM'
      ).daysInMonth()
    },
    async onSearch() {
      const { year, month } = this.info
      const { menuId } = this
      let params = {
        year,
        month,
        page: 1,
        limit: 1000,
        menuId
      }
      const { data } = await service.salaryBusiness.attendance.getEmployeeList(
        params
      )
      if (!this.locked) {
        this.locked = true
      }
      const { data: tableData, columns } = this.buildDynamic(
        data || [],
        'employeeSalItemVOList'
      )

      this.dynamicColumns = columns

      if (this.operateType === 'edit') {
        // 以查出来的数据为主，做∪
        let copyData = JSON.parse(JSON.stringify(this.tableData))

        for (let i = 0; i < data.length; i++) {
          const d = data[i]
          console.log(i, d)
          const contain = this.calContaine(d, this.tableData)
          if (!contain) {
            copyData.push(d)
          }
        }
        this.tableData = copyData
      } else {
        this.tableData = tableData
      }
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
    },
    async onSave() {
      const flag = this.validate()
      if (!flag) {
        return
      }
      this.$confirm(`您确认保存页面信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          let params = {
            shopCode: this.tableData[0].shopCode,
            shopName: this.tableData[0].shopName,
            year: this.info.year,
            month: this.info.month,
            workAttendanceDayBillDetailVOList: this.tableData,
            menuId: this.menuId
          }
          console.log(params)
          // return
          if (this.operateType === 'add') {
            await service.salaryBusiness.attendance.save(params)
          } else {
            await service.salaryBusiness.attendance.update({
              ...params,
              id: this.info.id
            })
          }
          this.$message.success('操作成功')
          this.$emit('success')
        })
        .catch(() => {})
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (this.operateType === 'add') {
          return
        }
        const copyVal = JSON.parse(JSON.stringify(val))
        this.info = copyVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-row {
  display: flex;
  margin: 12px 24px;
  & > div {
    margin-right: 48px;
  }
}
</style>
