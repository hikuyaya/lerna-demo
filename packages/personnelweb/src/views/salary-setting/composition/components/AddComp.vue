<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:03:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-21 14:03:36
 * @FilePath: \personnelweb\src\views\salary-setting\composition\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="离职员工">
            <el-input disabled v-model="selectStaff.eename"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="mg-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseStaffVisible = true"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="eename">
            <el-input v-model="info.eename"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idno">
            <el-input v-model="info.idno"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="报备原因" prop="addRemark">
            <el-input v-model="info.addRemark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <choose-single-staff
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseSingleStaffActionUrl"
        :conditions="chooseStaffConditions"
        @select="handleSelectStaff"></choose-single-staff>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleStaff from '@src/components/business/ChooseSingleStaff'
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
  components: {
    ChooseSingleStaff
  },
  data() {
    return {
      info: {},
      selectStaff: {},
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
      treeSelectNode: null,
      chooseStaffVisible: false,
      chooseSingleStaffActionUrl: service.chain.employee.list,
      chooseStaffColumns: [
        { prop: 'eename', label: '员工姓名' },
        { prop: 'eecode', label: '员工编码' },
        { prop: 'psname', label: '职务' },
        { prop: 'idno', label: '身份证号' },
        {
          prop: 'status',
          label: '状态',
          render: row => {
            if (row.status == 1) {
              return '在职'
            } else if (row.status == 2) {
              return '离职'
            } else {
              return '其他'
            }
          }
        },
        { prop: 'quitReason', label: '离职原因' }
      ],
      chooseStaffConditions: [
        {
          label: '员工姓名', // 标签
          prop: 'eename', // 绑定的字段
          // label宽度
          type: 'input',
          width: '30%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eecode',
          type: 'input', // 搜索类型
          width: '30%'
        },
        {
          label: '身份证号',
          prop: 'idno',
          type: 'input',
          width: '30%'
        }
      ]
    }
  },
  methods: {
    handleSelectStaff(selectRow) {
      console.log(selectRow)
      this.selectStaff = Object.assign({}, selectRow)
      this.info = Object.assign({}, selectRow)
      this.chooseStaffVisible = false
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
    },
    'info.bbCode': {
      handler: function (val) {
        console.log(val, this.treeSelectNode)
        const postName = `${this.treeSelectNode.oname}${
          this.info.positionName || ''
        }`
        this.$set(this.info, 'postName', postName)
      }
    },
    'info.positionCode': {
      handler: function (val) {
        const positionItem = this.positionList.find(p => p.pscode === val)
        const postName = `${this.treeSelectNode.oname || ''}${
          positionItem.psname
        }`
        this.$set(this.info, 'postName', postName)
      }
    }
  }
}
</script>
