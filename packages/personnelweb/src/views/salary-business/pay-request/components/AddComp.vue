<!--
 * @Author: wqy
 * @Date: 2022-08-11 16:31:10
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-31 11:03:46
 * @FilePath: \lerna-demod:\project\personnelweb\src\views\salary-business\pay-request\components\AddComp.vue
 * @Description: 
-->

<template>
  <div class="h100">
    <div>
      <el-button type="primary" @click="$emit('back')" class="mg-b-24"
        >返回</el-button
      >
      <el-button
        type="primary"
        v-if="operateType !== 'detail' && tableData.length"
        @click="onSave(1)"
        class="mg-b-24"
        >保存</el-button
      >
      <el-button
        type="primary"
        v-if="operateType !== 'detail' && tableData.length"
        @click="onSave(2)"
        class="mg-b-24"
        >提交</el-button
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
        <el-col :span="6">
          <el-form-item label="打款类型" prop="billType">
            <el-select v-model="info.billType" :disabled="locked" class="w100">
              <el-option value="1" label="预留款申请"></el-option>
              <el-option value="2" label="营业款申请"></el-option>
              <el-option value="3" label="营业款和预留款共同申请"></el-option>
            </el-select>
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
      <div>申请月份：{{ info.year }}-{{ info.month }}</div>
      <div>
        打款类型：{{
          info.billType == 1
            ? '预留款申请'
            : info.billType == 2
            ? '营业款申请'
            : info.billType == 3
            ? '营业款和预留款共同申请'
            : info.billType
        }}
      </div>
      <div>
        状态：<span class="red bold">{{
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
      <div>驳回原因：{{ info.backReason }}</div>
      <div>单号：{{ info.billCode }}</div>
    </div>
    <template v-if="tableData.length">
      <yid-table
        :data="tableData"
        ref="table"
        class="mg-t-12"
        :height="tableData.length ? 'calc(100% - 110px)' : ''">
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"></yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
        <yid-table-column label="职务" prop="psName"></yid-table-column>
        <yid-table-column label="门店编码" prop="shopCode"></yid-table-column>
        <yid-table-column label="门店名称" prop="shopName"></yid-table-column>
        <yid-table-column
          label="实发工资"
          prop="actualMoney"></yid-table-column>
        <yid-table-column
          label="未发工资"
          prop="surplusMoney"></yid-table-column>
        <yid-table-column label="打款工资" prop="payMoney">
          <template slot-scope="scope">
            <!-- 打款工资：当未发工资为0的时候，则不能输入打款工资 -->
            <template
              v-if="!scope.row.surplusMoney || operateType === 'detail'">
              {{ scope.row.payMoney }}
            </template>
            <template v-else>
              <el-input-number
                v-model="scope.row.payMoney"
                :min="0"
                :max="scope.row.surplusMoney"
                :controls="false"></el-input-number>
            </template>
          </template>
        </yid-table-column>
        <yid-table-column
          v-if="operateType === 'detail'"
          label="打款后剩余工资"
          prop="paySurplusMoney"></yid-table-column>
      </yid-table>
    </template>
  </div>
</template>

<script>
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
    }
  },
  components: {},
  created() {
    if (this.operateType === 'add') {
      this.initDate()
    } else {
      this.queryDetail()
    }
  },
  data() {
    return {
      info: {},
      importCompVisible: false,
      tableData: [],
      locked: false, // 门店编码、年、月是否需要被锁定
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
      this.tableData = this.info.details
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
      if (!this.locked) {
        this.locked = true
      }
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
    },
    async onSave(type) {
      const { year, month, billType, id } = this.info
      let params = {
        year,
        month,
        billType,
        details: this.tableData
      }
      if (type === 1) {
        this.$confirm(`您确认保存页面信息吗？`, `确认保存`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        })
          .then(async () => {
            if (this.operateType === 'edit') {
              params.id = id
            }
            await service.salaryBusiness.payRequest.save(params)
            this.$message.success('操作成功')
            this.$emit('success')
          })
          .catch(() => {})
      } else {
        // 提交
        this.$confirm(
          `您确认要提交页面信息吗？提交后在审核人审核之前不可修改`,
          `确认提交`,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          }
        )
          .then(async () => {
            if (this.operateType === 'edit') {
              params.id = id
            }
            const { data } = await service.salaryBusiness.payRequest.save(
              params
            )
            const { billCode } = data
            await service.salaryBusiness.payRequest.submit({
              billCode
            })
            this.$message.success('操作成功')
            this.$emit('success')
          })
          .catch(() => {})
      }
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
