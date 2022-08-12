<!--
 * @Author: wqy
 * @Date: 2022-07-27 16:31:16
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 09:34:48
 * @FilePath: \personnelweb\src\views\salary-business\salary-request\components\AddComp.vue
 * @Description: 
-->

<template>
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
          <el-button type="primary" class="mg-l-12" @click="onQueryStaff"
            >获取员工</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <div v-else class="flex info-row">
      <div>单号：{{ info.billCode }}</div>
      <div>申请月份：{{ info.year }}-{{ info.month }}</div>
      <div>合计人数：{{ tableData.length }}</div>
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
      <div>收入合计：{{ info.addTotal }}</div>
      <div>支出合计：{{ info.subTotal }}</div>
      <div>合计金额：{{ info.moneyTotal }}</div>
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
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          fixed></yid-table-column>
        <yid-table-column
          label="门店编码"
          prop="shopCode"
          fixed></yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="shopName"
          fixed></yid-table-column>
        <yid-table-column label="职务" prop="psName" fixed></yid-table-column>
        <yid-table-column label="级别" prop="pslName" fixed></yid-table-column>
        <yid-table-column
          v-if="operateType === 'detail'"
          label="合计金额"
          prop="totalMoney"
          fixed></yid-table-column>

        <yid-table-column
          v-for="column in dynamicColumns"
          :key="column.eeCode"
          :label="column.label"
          :prop="column.label">
          <template slot-scope="scope">
            <el-input-number
              v-if="column.inputType == 2 && operateType !== 'detail'"
              v-model="scope.row[column.label]"
              :controls="false"
              :min="0"
              class="w100">
            </el-input-number>
            <el-link
              v-else-if="column.inputType != 2"
              type="primary"
              @click="onShowDetail(scope.row, column)"
              >{{ scope.row[column.label] }}</el-link
            >
            <span v-else>{{ scope.row[column.label] }}</span>
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
        :importAction="`${$yid.config.API.BASE}api-pers/salaryapplybill/validate`"
        :importData="{
          menuId,
          year: info.year,
          month: info.month
        }"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/salaryapplybill/export`"
        :downloadParams="{
          year: info.year,
          month: info.month,
          menuId,
          fileName: '薪酬申请单模板.xls'
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

    <el-dialog
      title="计算详细"
      :visible.sync="detailCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <detail-comp
        v-if="detailCompVisible"
        :value="{
          ...selectRow,
          ...info
        }"
        :column="selectColumn"
        :operateType="operateType"></detail-comp>
    </el-dialog>
  </div>
</template>

<script>
import ImportComp from '@src/components/business/ImportComp'
import DetailComp from './DetailComp.vue'
import service from '@src/service'
import moment from 'moment'
import { mapGetters } from 'vuex'

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
  components: {
    ImportComp,
    DetailComp
  },
  created() {
    const menu = this.salCompMenus.find(
      v => window.location.href.indexOf(v.url) !== -1
    )
    if (!menu) {
      this.$message.error('无对应菜单信息')
      return
    }
    this.menuId = menu.id
    if (this.operateType === 'add') {
      this.initDate()
    } else {
      this.queryDetail()
    }
  },
  data() {
    return {
      info: {
        year: '',
        month: ''
      },
      menuId: '',
      importCompVisible: false,
      detailCompVisible: false,
      selectRow: {},
      selectColumn: {},
      tableData: [],
      rules: {
        year: [{ required: true, message: '请输入' }],
        month: [{ required: true, message: '请输入' }]
      },
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' }
      ],
      dynamicColumns: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      salCompMenus: 'user/salaryBusinessMenu'
    }),
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
      const { data } = await service.salaryBusiness.salaryRequest.detail(
        this.value.id
      )

      const { data: tableData, columns } = this.buildDynamic(
        data.salaryApplyBillEmployeeVOList || [],
        'salaryApplyBillItemVOList'
      )
      this.dynamicColumns = columns
      this.tableData = tableData
    },
    onImport() {
      this.importCompVisible = true
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
              inputType: salItem.inputtype,
              scCode: salItem.scCode
            })
          }
          // d['inputType'] = salItem.inputtype
          //   d['scCode'] = scCode
          //   d['scName'] = label
        }
      }
      columns.sort((prev, next) => prev.inputType - next.inputType)
      return {
        columns,
        data
      }
    },
    handleSelectStaffs(staffs) {
      console.log(staffs)
      const addStaffs = staffs.map(v => {
        return {
          ...v,
          add: true
        }
      })
      this.adds = [...addStaffs]
      this.chooseStaffVisible = false
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
    async onSearch() {
      const { data } =
        await service.salaryBusiness.salaryRequest.getApplyEmployeeList({
          year: this.info.year,
          month: this.info.month,
          menuId: this.menuId
        })

      const { data: tableData, columns } = this.buildDynamic(
        data.salaryApplyBillEmployeeVOList || [],
        'salaryApplyBillItemVOList'
      )

      this.dynamicColumns = columns
      console.log(tableData, columns)

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
    async handleImportSave() {
      const flag = this.$refs.importCompRef.validateSave()
      if (!flag) {
        return
      }
      const importData = this.$refs.importCompRef.tableData || []

      const { data: tableData, columns } = this.buildDynamic(
        importData,
        'salaryApplyBillItemVOList'
      )

      this.tableData = tableData
      this.dynamicColumns = columns
      this.importCompVisible = false
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
    async onSave(approvalStatus) {
      if (approvalStatus === 1) {
        // 保存
        this.$confirm(`您确认保存页面信息吗？`, `确认保存`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        })
          .then(async () => {
            this.operateSave(approvalStatus)
          })
          .catch(() => {})
      } else {
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
            this.operateSave(approvalStatus)
          })
          .catch(() => {})
      }
    },
    async operateSave(approvalStatus) {
      this.buildSaveParams()
      let params = {
        year: this.info.year,
        month: this.info.month,
        menuId: this.menuId,
        shopCode: this.userInfo.shopcode,
        shopName: this.userInfo.shopname,
        salaryApplyBillEmployeeVOList: this.tableData,
        approvalStatus
      }
      if (this.operateType === 'add') {
        await service.salaryBusiness.salaryRequest.save(params)
      } else {
        params = {
          ...this.info,
          ...params
        }
        await service.salaryBusiness.salaryRequest.update(params)
      }
      this.$emit('success')
    },
    onShowDetail(row, column) {
      this.selectRow = row
      this.selectColumn = column
      this.detailCompVisible = true
    },
    buildSaveParams() {
      const that = this
      const regex = new RegExp(/^[a-zA-Z]*$/)
      for (let i = 0; i < that.tableData.length; i++) {
        const row = that.tableData[i]
        for (const key in row) {
          if (Object.hasOwnProperty.call(row, key)) {
            const element = row[key]
            if (!regex.test(key)) {
              // 以非英文字母开头 需要拼接到原数组对象中
              const item = row.salaryApplyBillItemVOList.find(
                v => v.scName === key
              )
              try {
                item['money'] = element
              } catch (error) {
                console.error(item, element, key, row)
              }
            }
          }
        }
      }
    },
    onDeleteRow(index, row) {
      const copyData = [...this.tableData]
      copyData.splice(index, 1)
      this.tableData = copyData
    },
    onAdd() {
      this.chooseStaffVisible = true
    },
    getData() {
      return this.tableData
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (this.operateType === 'add') {
          return
        }
        this.info = JSON.parse(JSON.stringify(val))
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
