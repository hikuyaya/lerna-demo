<!--
 * @Author: wqy
 * @Date: 2022-07-22 14:38:14
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-22 14:38:26
 * @FilePath: \personnelweb\src\views\salary-setting\special\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务" prop="eename">
            <el-select v-model="info.type1" class="w100">
              <el-option label="美发门店" value="1"></el-option>
              <el-option label="美容门店" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工资账套" prop="type2">
            <el-select v-model="info.type2" class="w100">
              <el-option label="美发工资账套" value="1"></el-option>
              <el-option label="美容工资账套" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学习金额度" prop="type3">
            <el-input-number
              v-model="info.type3"
              :controls="false"
              :min="1"
              :max="30000"
              class="w100"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每月扣除额度" prop="type4">
            <el-input-number
              v-model="info.type4"
              :controls="false"
              :min="1"
              :max="30000"
              class="w100"></el-input-number>
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
    positionList: {
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
        addRemark: [{ required: true, message: '请输入报备原因' }],
        idno: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            min: 15,
            max: 18,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
          },
          {
            required: true,
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
          }
        ],
        eename: [{ required: true, message: '请输入姓名' }]
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
        return {
          eeName: this.info.eename,
          idCard: this.info.idno,
          addRemark: this.info.addRemark
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
