<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:03:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-25 17:21:20
 * @FilePath: \personnelweb\src\views\salary-setting\composition\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="编码" prop="eename">
            <el-input v-model="info.eename"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称" prop="idno">
            <el-input v-model="info.idno"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="输入类型" prop="type1">
            <el-select v-model="info.type1">
              <el-option label="固定项" value="1"></el-option>
              <el-option label="输入项" value="2"></el-option>
              <el-option label="提成项" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="计算类型" prop="type2">
            <el-select v-model="info.type2">
              <el-option label="增项" value="1"></el-option>
              <el-option label="减项" value="-1"></el-option>
              <el-option label="非计算项" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="薪酬分组" prop="type3">
            <el-select v-model="info.type3">
              <el-option label="增项" value="1"></el-option>
              <el-option label="减项" value="2"></el-option>
              <el-option label="非计算项" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="info.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="mg-t-12">
      <el-button type="primary" @click="onShowMenu">添加显示菜单</el-button>
    </div>
    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column label="显示菜单" prop="eeName"></yid-table-column>
      <yid-table-column label="适用门店类型" prop="idCard">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status2">
            <el-option label="美发门店" value="1"></el-option>
            <el-option label="美容门店" value="2"></el-option>
            <el-option label="不限门店" value=""></el-option>
          </el-select>
        </template>
      </yid-table-column>
      <yid-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            @confirm="onDeleteRow(scope.$index)">
            <i
              slot="reference"
              class="el-icon-remove-outline c-pointer font-size-22px"></i>
          </el-popconfirm>
        </template>
      </yid-table-column>
    </yid-table>
    <el-dialog
      title="选择显示菜单"
      :visible.sync="chooseMenuVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px">
      <choose-multiple-item
        :conditions="chooseMenuConditions"
        :pagination="false"
        actionUrl=""
        :columns="chooseMenuColumns"></choose-multiple-item>
    </el-dialog>
  </div>
</template>

<script>
import ChooseMultipleItem from '@src/components/business/ChooseMultipleItem.vue'
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
    ChooseMultipleItem
  },
  data() {
    return {
      info: {},
      chooseMenuVisible: false,
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
      chooseMenuConditions: [
        {
          label: '菜单名', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          labelWidth: '0.8rem',
          width: '50%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        }
      ],
      chooseMenuColumns: [
        {
          type: 'selection',
          width: '48'
        },
        {
          prop: '',
          label: '菜单名'
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
    onShowMenu() {
      this.chooseMenuVisible = true
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
