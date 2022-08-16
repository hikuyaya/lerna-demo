<!--
 * @Author: wqy
 * @Date: 2022-08-02 15:12:03
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 10:53:12
 * @FilePath: \personnelweb\src\views\salary-business\special-request\components\AddComp.vue
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
              class="w100">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            class="mg-l-12"
            @click="queryCanSave('staff')"
            >获取员工</el-button
          >
          <el-button
            type="primary"
            class="mg-l-12"
            @click="queryCanSave('import')">
            导入
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-else class="flex info-row">
      <div>单号：{{ info.billCode }}</div>
      <div>申请月份：{{ info.year }}-{{ info.month }}</div>
      <div>合计人数：{{ info.employeeTotal }}</div>
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
      <div>合计金额：{{ info.moneyTotal }}</div>
      <div>驳回原因：{{ info.backReason }}</div>
    </div>
    <template v-if="tableData.length">
      <yid-table :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"></yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
        <yid-table-column label="门店编码" prop="shopCode"></yid-table-column>
        <yid-table-column label="门店名称" prop="shopName"></yid-table-column>
        <yid-table-column label="职务" prop="psName"></yid-table-column>
        <yid-table-column label="级别" prop="psLevelName"></yid-table-column>
        <yid-table-column label="级别1" prop="psLevel1Name"></yid-table-column>
        <yid-table-column
          label="提成合计"
          prop="actualCommission"></yid-table-column>
        <yid-table-column label="保底提成" prop="expectCommission">
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.expectCommission
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="理论保底差额" prop="theoryCommission">
          <template slot-scope="scope">
            <span class="red">{{ scope.row.theoryCommission }}</span>
          </template>
        </yid-table-column>
        <yid-table-column label="特殊工资项" prop="speCode">
          <template slot-scope="scope">
            <el-select
              v-if="operateType !== 'detail'"
              v-model="scope.row.speCode"
              filterable>
              <el-option
                v-for="(item, index) in salcompSpecList"
                :key="index"
                :disabled="item.status === '2'"
                :label="item.speName"
                :value="item.speCode">
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.speName }}</span>
          </template>
        </yid-table-column>
        <yid-table-column label="金额" prop="money">
          <template slot-scope="scope">
            <el-input-number
              v-if="operateType !== 'detail'"
              v-model="scope.row.money"
              :controls="false"
              :min="0"
              class="w90">
            </el-input-number>
            <span v-else>{{ scope.row.money }}</span>
          </template>
        </yid-table-column>
        <yid-table-column label="申请原因及计算描述" prop="remark">
          <template slot-scope="scope">
            <el-input
              v-if="operateType !== 'detail'"
              v-model="scope.row.remark"></el-input>
            <span v-else>{{ scope.row.remark }}</span>
          </template>
        </yid-table-column>

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
        :importAction="`${$yid.config.API.BASE}api-pers/specsalarybill/convertSystem`"
        :importData="{
          year: info.year,
          month: info.month
        }"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/specsalarybill/downSysTemplate`"
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

    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <choose-multiple-item
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseStaffActionUrl"
        :conditions="chooseStaffConditions"
        :pagination="false"
        :defaultParams="defaultParams"
        @select="handleSelectStaffs"></choose-multiple-item>
    </el-dialog>

    <el-dialog
      title="计算详细"
      :visible.sync="detailCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <detail
        v-if="detailCompVisible"
        :value="{
          ...selectRow,
          ...info
        }"></detail>
    </el-dialog>
  </div>
</template>

<script>
import ImportComp from '@src/components/business/ImportComp'
import ChooseMultipleItem from '@src/components/business/ChooseMultipleItem.vue'
import Detail from './Detail.vue'
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
    salcompSpecList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    ImportComp,
    ChooseMultipleItem,
    Detail
  },
  created() {
    if (this.operateType === 'add') {
      this.initDate()
    } else if (this.operateType === 'edit') {
      this.defaultParams = {
        year: this.value.year,
        month: this.value.month
      }
    }
  },
  data() {
    return {
      info: {},
      defaultParams: {},
      importCompVisible: false,
      detailCompVisible: false,
      selectRow: {},
      tableData: [],
      rules: {
        shopCode: [{ required: true, message: '请输入门店编码' }],
        year: [{ required: true, message: '请输入' }],
        month: [{ required: true, message: '请输入' }],
        actualDayCount: [{ required: true, message: '请输入' }]
      },
      chooseStaffVisible: false,
      chooseStaffActionUrl: service.salaryBusiness.specialRequest.getHrspecemps,
      chooseStaffColumns: [
        { label: '员工姓名', prop: 'eeName' },
        { label: '员工编码', prop: 'eeCode' },
        { label: '门店', prop: 'shopName' },
        { label: '职务', prop: 'psName' },
        { label: '级别', prop: 'psLevelName' }
      ],
      chooseStaffConditions: [
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input',
          width: '30%'
        },
        {
          label: '员工姓名',
          prop: 'eeName',
          type: 'input',
          width: '30%'
        }
      ],
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        { label: '特殊工资项', prop: 'speName' },
        { label: '金额', prop: 'money' }
      ],
      dynamicColumns: []
    }
  },
  computed: {
    importCompFailColumns: function () {
      return this.importCompColumns.concat([
        { label: '失败原因', prop: 'failwhy' }
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
      this.defaultParams = {
        year,
        month
      }
    },
    handleSelectStaffs(staffs) {
      console.log(staffs)
      this.chooseStaffVisible = false
      // this.tableData = staffs
      // 以页面上的数据为主，做∪
      let copyData = JSON.parse(JSON.stringify(this.tableData))

      for (let i = 0; i < staffs.length; i++) {
        const d = staffs[i]
        console.log(i, d)
        const contain = this.calContaine(d, this.tableData)
        if (!contain) {
          copyData.push(d)
        }
      }
      this.tableData = copyData
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
    async queryCanSave(type) {
      const { resp_code } =
        await service.salaryBusiness.specialRequest.enterHrspecemps({
          year: this.info.year,
          month: this.info.month
        })
      if (resp_code === 200) {
        if (type === 'staff') {
          this.chooseStaffVisible = true
        } else if (type === 'import') {
          this.importCompVisible = true
        }
      }
    },
    onDeleteRow(index, row) {
      const copyData = [...this.tableData]
      copyData.splice(index, 1)
      this.tableData = copyData
    },
    onShowDetail(row) {
      this.selectRow = row
      this.detailCompVisible = true
    },
    async handleImportSave() {
      const flag = this.$refs.importCompRef.validateSave()
      if (!flag) {
        return
      }
      const importData = this.$refs.importCompRef.tableData
      this.tableData = importData
      this.importCompVisible = false
    },
    getData() {
      return this.tableData
    },
    validate() {
      const item = this.tableData.find(
        v => !v.speCode || (!v.money && v.money !== 0)
      )
      if (item) {
        this.$message.error(`员工：${item.eeName} 录入信息存在空项，请补齐！`)
        return false
      }
      return true
    },
    async onSave(type) {
      // 1 保存 2 提交
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
          const copyTableData = JSON.parse(JSON.stringify(this.tableData))
          let tableData = copyTableData.map(v => {
            const item = this.salcompSpecList.find(s => v.speCode === s.speCode)
            v.speName = item.speName
            return {
              ...v
            }
          })
          let params = {
            shopCode: this.tableData[0].shopCode,
            shopName: this.tableData[0].shopName,
            shopType: this.tableData[0].shopType,
            year: this.info.year,
            month: this.info.month,
            details: tableData
          }
          if (this.operateType === 'edit') {
            params = {
              ...params,
              id: this.info.id
            }
          }
          console.log(params)
          // return
          if (type === 1) {
            await service.salaryBusiness.specialRequest.save(params)
          } else if (type === 2) {
            // 获取billCode
            const { data } = await service.salaryBusiness.specialRequest.save(
              params
            )
            await service.salaryBusiness.specialRequest.submit({
              billCode: data.billCode
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
        const copyVal = JSON.parse(JSON.stringify(val))
        this.info = copyVal
        if (this.operateType !== 'add') {
          this.tableData = copyVal.details
        }
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
