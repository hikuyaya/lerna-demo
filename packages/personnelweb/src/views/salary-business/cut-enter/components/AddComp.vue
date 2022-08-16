<!--
 * @Author: wqy
 * @Date: 2022-08-02 15:12:03
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 15:52:48
 * @FilePath: \personnelweb\src\views\salary-business\cut-enter\components\AddComp.vue
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
        @click="onSave()"
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
          <el-form-item label="门店类型" prop="shopType">
            <el-select v-model="info.shopType" :disabled="locked">
              <el-option label="美发门店" :value="1"></el-option>
              <el-option label="美容门店" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
          <el-button type="primary" @click="onImport">导入</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-else class="flex info-row">
      <div>
        门店类型：{{
          info.shopType == 1
            ? '美发门店'
            : info.shopType == 2
            ? '美容门店'
            : info.shopType
        }}
      </div>
      <div>导入月份：{{ info.year }}-{{ info.month }}</div>
      <div>批次号：{{ info.batchNo }}</div>
      <div>创建人：{{ info.createdBy }}</div>
      <div>创建时间：{{ info.createdTime }}</div>
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
        <yid-table-column
          label="合计金额"
          prop="moneyTotal"
          v-if="operateType === 'detail'"></yid-table-column>
        <yid-table-column
          v-for="column in dynamicColumns"
          :key="column.eeCode"
          :label="column.label"
          :prop="column.label">
          <template slot-scope="scope">
            <span v-if="operateType === 'detail'">{{
              scope.row[column.label]
            }}</span>
            <el-input-number
              v-else
              v-model="scope.row[column.label]"
              :controls="false"
              :min="0"
              class="w100">
            </el-input-number>
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
        :importAction="`${$yid.config.API.BASE}api-pers/salaryinputbill/convertSystem`"
        :importData="defaultParams"
        :downloadUrl="`${$yid.config.API.BASE}api-pers/salaryinputbill/excel/exportMb`"
        :downloadParams="defaultParams"
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
      title="选择员工"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <choose-multiple-item
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseStaffActionUrl"
        :conditions="chooseStaffConditions"
        :defaultParams="defaultParams"
        :queryImmedicatly="false"
        :pagination="false"
        @select="handleSelectStaffs"></choose-multiple-item>
    </el-dialog>
  </div>
</template>

<script>
import ImportComp from '@src/components/business/ImportComp'
import ChooseMultipleItem from '@src/components/business/ChooseMultipleItem.vue'
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
    searchType: {
      type: Number
    },
    menuId: {
      type: String || Number
    }
  },
  components: {
    ImportComp,
    ChooseMultipleItem
  },
  created() {
    if (this.operateType === 'add') {
      this.initDate()
    } else {
      this.defaultParams = {
        year: this.value.year,
        month: this.value.month,
        menuId: this.menuId,
        type: this.searchType,
        shopType: this.info.shopType
      }
      this.queryDetail()
    }
  },
  data() {
    return {
      info: {},
      defaultParams: {},
      importCompVisible: false,
      detailCompVisible: false,
      locked: false, // 门店编码、年、月是否需要被锁定
      selectRow: {},
      tableData: [],
      rules: {
        year: [{ required: true, message: '请输入' }],
        month: [{ required: true, message: '请输入' }],
        shopType: [{ required: true, message: '请选择' }]
      },
      chooseStaffVisible: false,
      chooseStaffActionUrl:
        service.salaryBusiness.cutEnter.queryMonthRptHreesalList,
      chooseStaffColumns: [
        { label: '员工姓名', prop: 'eeName' },
        { label: '员工编码', prop: 'eeCode' },
        { label: '门店名称', prop: 'shopName' },
        { label: '门店编码', prop: 'shopCode' }
      ],
      chooseStaffConditions: [
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          labelWidth: '1.2rem',
          width: '35%',
          required: true
        }
      ],
      importCompColumns: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        { label: '门店编码', prop: 'shopCode' },
        { label: '门店名称', prop: 'shopName' }
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
      this.defaultParams = {
        year,
        month,
        type: this.searchType,
        menuId: this.menuId
      }
    },
    async queryDetail() {
      const { data } = await service.salaryBusiness.cutEnter.billListBybatchNo({
        isDel: 0,
        batchNo: this.info.batchNo
      })
      const { data: tableData, columns } = this.buildDynamic(
        data || [],
        'details'
      )

      this.tableData = tableData
      this.dynamicColumns = columns
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
            salItem.money || salItem.money === 0 ? salItem.money : undefined
          d[label] = value
          if (i === 0) {
            columns.push({
              label,
              value,
              inputType: salItem.inputtype,
              scCode: salItem.scCode
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.defaultParams.shopType = this.info.shopType
          this.chooseStaffVisible = true
        }
      })
    },
    handleSelectStaffs(staffs) {
      console.log(staffs)

      this.chooseStaffVisible = false
      // this.tableData = staffs
      // 以页面上的数据为主，做∪
      let copyData = JSON.parse(JSON.stringify(this.tableData)) || []

      for (let i = 0; i < staffs.length; i++) {
        const d = staffs[i]
        const contain = this.calContaine(d, this.tableData)
        if (!contain) {
          copyData.push(d)
        }
      }

      const { data: tableData, columns } = this.buildDynamic(
        copyData,
        'details'
      )
      console.log(tableData, columns)
      this.tableData = tableData
      this.dynamicColumns = columns
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

    onDeleteRow(index, row) {
      const copyData = [...this.tableData]
      copyData.splice(index, 1)
      this.tableData = copyData
    },

    onImport() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.importCompVisible = true
          this.$set(this.defaultParams, 'shopType', this.info.shopType)
        }
      })
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
      const importData = this.$refs.importCompRef.tableData || []
      const { data: tableData, columns } = this.buildDynamic(
        importData,
        'details'
      )
      console.log(tableData, columns)
      this.tableData = tableData
      this.dynamicColumns = columns
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
    async onSave() {
      // 1 保存 2 提交
      // const flag = this.validate()
      // if (!flag) {
      //   return
      // }
      this.$confirm(`您确认保存页面信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          const copyTableData = JSON.parse(JSON.stringify(this.tableData))
          // 将money塞回对应的details对象中
          for (let i = 0; i < copyTableData.length; i++) {
            const row = copyTableData[i]
            const details = row.details
            for (const key in row) {
              if (Object.hasOwnProperty.call(row, key)) {
                const value = row[key]
                let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
                if (reg.test(key)) {
                  // 是汉字开头的 去details里塞值
                  const item = details.find(v => v.scName === key)
                  item.money = value
                }
              }
            }
          }
          await service.salaryBusiness.cutEnter.save({
            salaryInputBillVOS: copyTableData
          })

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
      }
    },
    tableData: {
      handler: function (val) {
        if (val && val.length) {
          if (!this.locked) {
            this.locked = true
          }
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
