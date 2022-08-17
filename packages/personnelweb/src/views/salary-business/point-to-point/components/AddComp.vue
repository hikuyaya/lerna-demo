<!--
 * @Author: wqy
 * @Date: 2022-08-16 11:09:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 17:05:44
 * @FilePath: \personnelweb\src\views\salary-business\point-to-point\components\AddComp.vue
 * @Description: 
-->

<template>
  <div class="h100">
    <el-button type="primary" @click="$emit('back')" class="mg-b-24"
      >返回</el-button
    >
    <el-button
      type="primary"
      v-if="operateType !== 'detail'"
      @click="onQueryData"
      class="mg-b-24"
      >添加打款单</el-button
    >
    <el-button
      type="primary"
      v-if="operateType !== 'detail' && tableData.length"
      @click="onSave"
      class="mg-b-24"
      >保存</el-button
    >

    <template v-if="tableData.length">
      <yid-table :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="序号" type="index"></yid-table-column>
        <yid-table-column
          label="打款单编码"
          prop="paySalaryBillCode"></yid-table-column>
        <yid-table-column label="门店名称" prop="shopName"></yid-table-column>
        <yid-table-column label="门店编码" prop="shopCode"></yid-table-column>

        <yid-table-column label="年" prop="year"></yid-table-column>
        <yid-table-column label="月" prop="month"></yid-table-column>
        <yid-table-column label="打款工资" prop="payMoney"></yid-table-column>

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
      title="选择打款单"
      :visible.sync="chooseMultipleVisible"
      :close-on-click-modal="false"
      append-to-body
      width="900px">
      <choose-multiple-item
        :conditions="chooseMultipleConditions"
        :pagination="false"
        :actionUrl="chooseMultipleActionUrl"
        :columns="chooseMultipleColumns"
        :queryImmedicatly="false"
        :defaultParams="defaultParams"
        @query="handleMultipleSearch"
        @select="handleChooseMultiple"></choose-multiple-item>
    </el-dialog>
  </div>
</template>

<script>
import ChooseMultipleItem from '@src/components/business/ChooseMultipleItem.vue'
import service from '@src/service'
import moment from 'moment'
import { mapGetters } from 'vuex'
import yid from '@src/library'

const cacheKey = 'point-to-point-shopType'

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
    ChooseMultipleItem
  },
  created() {
    const localStorageShopType = yid.cache.get(cacheKey)
    if (localStorageShopType) {
      this.defaultParams.shopType = localStorageShopType
    }
  },
  data() {
    return {
      info: {
        year: '',
        month: ''
      },
      defaultParams: {
        shopType: '1'
      },
      menuId: '',
      importCompVisible: false,
      detailCompVisible: false,
      chooseMultipleVisible: false,
      chooseMultipleActionUrl:
        service.salaryBusiness.pointToPoint.getSalaryPayBills,
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
      chooseMultipleConditions: [
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '0.6rem',
          placeholder: '年',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '14%',
          required: true
        },
        {
          label: '月',
          prop: 'month',
          type: 'input-number',
          labelWidth: '0.8rem',
          placeholder: '月',
          width: '14%',
          controls: false,
          min: 1,
          max: 12,
          required: true
        },
        {
          label: '门店类型', // 标签
          prop: 'shopType', // 绑定的字段
          // label宽度
          type: 'select',
          width: '26%', // 整个组件占的宽度
          labelWidth: '1.4rem',
          options: [
            { label: '美发门店', value: '1' },
            { label: '美容门店', value: '2' }
          ],
          required: true
        },
        {
          label: '门店编码', // 标签
          prop: 'shopCode', // 绑定的字段
          // label宽度
          type: 'input',
          width: '26%', // 整个组件占的宽度
          labelWidth: '1.2rem'
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        }
      ],
      chooseMultipleColumns: [
        {
          prop: 'billCode',
          label: '打款单编码'
        },
        {
          prop: 'shopName',
          label: '门店名称'
        },
        {
          prop: 'shopCode',
          label: '门店编码'
        },
        {
          prop: 'year',
          label: '年'
        },
        {
          prop: 'month',
          label: '月'
        },
        {
          prop: 'payMoney',
          label: '打款工资'
        }
      ],
      dynamicColumns: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      salCompMenus: 'user/salaryBusinessMenu'
    })
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
    handleChooseMultiple(items) {
      console.log(items)
      // this.tableData = staffs
      // 以页面上的数据为主，做∪
      let copyData = JSON.parse(JSON.stringify(this.tableData))

      for (let i = 0; i < items.length; i++) {
        const d = items[i]
        console.log(i, d)
        const contain = this.calContaine(d, this.tableData)
        if (!contain) {
          copyData.push(d)
        }
      }
      this.tableData = copyData
      this.chooseMultipleVisible = false
    },
    calContaine(d, tableData) {
      let flag = false
      for (let i = 0; i < tableData.length; i++) {
        const t = tableData[i]
        if (t.billCode === d.billCode) {
          flag = true
          break
        }
      }
      return flag
    },
    onQueryData() {
      this.chooseMultipleVisible = true
    },
    handleMultipleSearch(params) {
      console.log('handleMultipleSearch', params)
      if (params.shopType) {
        // 缓存
        yid.cache.set(cacheKey, params.shopType)
        this.defaultParams.shopType = params.shopType
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
    async onSave() {
      // 保存
      this.$confirm(`您确认保存页面信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          let params = {
            details: this.tableData.map(v => {
              return {
                paySalaryBillCode: v.billCode,
                shopCode: v.shopCode,
                shopName: v.shopName,
                shopType: v.shopType,
                year: v.year,
                month: v.month,
                payMoney: v.payMoney
              }
            })
          }
          if (this.operateType === 'edit') {
            params.id = this.info.id
          }
          await service.salaryBusiness.pointToPoint.save(params)
          this.$emit('success')
        })
        .catch(() => {})
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
        } else {
          this.tableData = val.details
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
