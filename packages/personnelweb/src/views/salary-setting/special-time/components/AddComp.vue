<!--
 * @Author: wqy
 * @Date: 2022-07-22 15:47:26
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 13:43:23
 * @FilePath: \personnelweb\src\views\salary-setting\special-time\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row v-if="operateType === 'batch'">
        <el-col :span="24">
          <el-form-item label="门店类型" prop="type">
            <el-select v-model="info.type" class="w100">
              <el-option label="美发工资账套" value="1"></el-option>
              <el-option label="美容工资账套" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="12">
          <el-form-item label="门店编码" prop="shopCode">
            {{ info.shopCode }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店名称" prop="shopName">
            {{ info.shopName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="限定申请日" prop="salaryDay">
            <el-input-number
              controls-position="right"
              v-model="info.salaryDay"
              :min="1"
              :max="31"
              :controls="false" />
            &nbsp;&nbsp;<span class="orange">*如不做限制设置为空即可*</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
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
  data() {
    return {
      info: {},
      chooseMultipleVisible: false,
      rules: {},
      tableData: [],
      chooseMultipleConditions: [
        {
          label: '名称', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          labelWidth: '0.8rem',
          width: '30%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '计算类型', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'select',
          width: '30%', // 整个组件占的宽度
          options: [
            { label: '所有', value: '' },
            { label: '增项', value: '1' },
            { label: '减项', value: '2' },
            { label: '非计算项', value: '3' }
          ]
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        }
      ]
    }
  },
  methods: {
    onDeleteRow(index) {
      const copyTableData = [...this.tableData]
      copyTableData.splice(index, 1)
      this.tableData = copyTableData
    },
    handleMultipleSelect(items) {
      this.tableData = items
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        if (this.operateType === 'edit') {
          return {
            id: this.info.id,
            shopCode: this.info.shopCode,
            salaryDay: this.info.salaryDay
          }
        } else if (this.operateType === 'batch') {
          return {
            type: this.info.type,
            salaryDay: this.info.salaryDay
          }
        }
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    operateType: {
      immediate: true,
      handler: function (val) {
        if (val === 'batch') {
          this.$set(this.rules, 'type', {
            required: true,
            message: '请选择门店类型'
          })
        }
      }
    }
  }
}
</script>
