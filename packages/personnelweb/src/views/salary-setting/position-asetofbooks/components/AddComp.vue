<!--
 * @Author: wqy
 * @Date: 2022-07-22 09:38:12
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 17:55:19
 * @FilePath: \personnelweb\src\views\salary-setting\position-asetofbooks\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务" prop="psCode">
            <el-select
              v-model="info.psCode"
              class="w100"
              filterable
              clearable
              @change="handlePsChange">
              <el-option
                v-for="position in positionAll"
                :key="position.pscode"
                :label="position.psname"
                :value="position.pscode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工资账套" prop="ssCode">
            <el-select
              v-model="info.ssCode"
              filterable
              clearable
              class="w100"
              @change="handleSsChange">
              <el-option
                v-for="salary in salaryCompAll"
                :key="salary.ssCode"
                :label="salary.ssName"
                :value="salary.ssCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学习金额度" prop="tutje">
            <el-input-number
              v-model="info.tutje"
              :controls="false"
              :min="1"
              class="w100"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每月扣除额度" prop="tutjeMon">
            <el-input-number
              v-model="info.tutjeMon"
              :controls="false"
              :min="1"
              class="w100"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="operateType === 'edit'">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="info.status">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
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
    },
    positionAll: {
      type: Array,
      default: function () {
        return []
      }
    },
    salaryCompAll: {
      type: Array,
      default: function () {
        return []
      }
    },
    treeData: Array
  },
  data() {
    return {
      info: {},
      chooseMultipleVisible: false,
      rules: {
        psCode: [{ required: true, message: '请选择职务' }],
        ssCode: [{ required: true, message: '请选择工资套账' }],
        tutje: [{ required: true, message: '请输入学习金额度' }],
        tutjeMon: [{ required: true, message: '请输入每月扣除额度' }]
      },
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
      ],
      chooseMultipleColumns: [
        {
          type: 'selection',
          width: '48'
        },
        {
          prop: '',
          label: '编码'
        },
        {
          prop: '',
          label: '名称'
        },
        {
          prop: '',
          label: '输入类型'
        },
        {
          prop: '',
          label: '计算类型'
        },
        {
          prop: '',
          label: '薪酬分组'
        }
      ]
    }
  },
  methods: {
    handleSsChange(item) {
      console.log(item)
      this.$set(this.info, 'ssName', item.ssName)
    },
    handlePsChange(item) {
      this.$set(this.info, 'psName', item.psName)
    },
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
        const { psname: psName } = this.positionAll.find(
          v => v.pscode === this.info.psCode
        )
        const { ssName, ssId } = this.salaryCompAll.find(
          v => v.ssCode === this.info.ssCode
        )
        const status = this.info.status ? this.info.status : 1
        return {
          ...this.info,
          psName,
          ssName,
          ssId,
          status
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
    }
  }
}
</script>
