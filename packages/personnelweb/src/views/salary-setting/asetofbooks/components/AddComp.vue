<!--
 * @Author: wqy
 * @Date: 2022-07-21 17:30:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-26 15:37:50
 * @FilePath: \personnelweb\src\views\salary-setting\asetofbooks\components\AddComp.vue
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
          <el-form-item label="适用门店" prop="type1">
            <el-select v-model="info.type1">
              <el-option label="美发门店" value="1"></el-option>
              <el-option label="美容门店" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="info.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row justify="space-between">
      <el-col :span="12">薪酬组成明细项</el-col>
      <el-col :span="12" class="tar"
        ><el-button type="primary" @click="chooseMultipleVisible = true"
          >添加</el-button
        ></el-col
      >
    </el-row>

    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column label="排序" prop="sort">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort"></el-input>
        </template>
      </yid-table-column>
      <yid-table-column label="编码" prop="eeName"> </yid-table-column>
      <yid-table-column label="名称" prop="idCard"></yid-table-column>
      <yid-table-column label="输入类型" prop="idCard"></yid-table-column>
      <yid-table-column label="计算类型" prop="idCard"></yid-table-column>
      <yid-table-column label="薪酬分组" prop="idCard"></yid-table-column>
      <yid-table-column label="最大金额" prop="account">
        <template slot-scope="scope">
          <el-input-number
            controls-position="right"
            v-model="scope.row.account"
            :min="0"
            :controls="false" />
        </template>
      </yid-table-column>
      <yid-table-column label="备注" prop="remark">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"></el-input>
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
      title="选择组成明细"
      :visible.sync="chooseMultipleVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <choose-multiple-item
        :conditions="chooseMultipleConditions"
        :pagination="false"
        :actionUrl="chooseMenuActionUrl"
        :columns="chooseMultipleColumns"
        @select="handleMultipleSelect"></choose-multiple-item>
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
      chooseMultipleVisible: false,
      chooseMenuActionUrl: service.staff.shop.getListByLoginUser,
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
