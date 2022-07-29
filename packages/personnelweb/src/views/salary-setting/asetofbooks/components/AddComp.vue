<!--
 * @Author: wqy
 * @Date: 2022-07-21 17:30:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 16:36:07
 * @FilePath: \personnelweb\src\views\salary-setting\asetofbooks\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="名称" prop="ssName">
            <el-input v-model="info.ssName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="适用门店" prop="shoptype">
            <el-select v-model="info.shoptype" class="w100">
              <el-option label="美发门店" :value="1"></el-option>
              <el-option label="美容门店" :value="2"></el-option>
              <el-option label="无" :value="3"></el-option>
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
    <el-row justify="space-between" class="mg-t-12">
      <el-col :span="12">薪酬组成明细项</el-col>
      <el-col :span="12" class="tar"
        ><el-button type="primary" @click="chooseMultipleVisible = true"
          >添加</el-button
        ></el-col
      >
    </el-row>

    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column label="排序" prop="rowindex" width="110px">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.rowindex"
            :min="0"
            :controls="false"
            style="width: 80px" />
        </template>
      </yid-table-column>
      <yid-table-column label="编码" prop="scCode" width="90px">
      </yid-table-column>
      <yid-table-column
        label="名称"
        prop="scName"
        width="90px"></yid-table-column>
      <yid-table-column label="输入类型" prop="inputType" width="90px">
        <template slot-scope="scope">
          {{
            scope.row.inputType == '1'
              ? '固定项'
              : scope.row.inputType == '2'
              ? '输入项'
              : scope.row.inputType == '3'
              ? '提成项'
              : scope.row.inputType
          }}
        </template>
      </yid-table-column>
      <yid-table-column label="计算类型" prop="signType" width="90px">
        <template slot-scope="scope">
          {{
            scope.row.signType == '1'
              ? '增项'
              : scope.row.signType == '-1'
              ? '减项'
              : scope.row.signType == '0'
              ? '非计算项'
              : scope.row.signType
          }}
        </template>
      </yid-table-column>
      <yid-table-column
        label="薪酬分组"
        prop="csgName"
        width="90px"></yid-table-column>
      <yid-table-column label="最大金额" prop="money" width="160px">
        <template slot-scope="scope">
          <el-input-number
            controls-position="right"
            v-model="scope.row.money"
            :min="0"
            :controls="false"
            style="width: 130px" />
        </template>
      </yid-table-column>
      <yid-table-column label="备注" prop="remark">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"></el-input>
        </template>
      </yid-table-column>
      <yid-table-column label="操作" width="60px">
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
      chooseMenuActionUrl: service.salarySetting.composition.all,
      rules: {
        shoptype: [{ required: true, message: '请选择使用门店' }],
        ssName: [{ required: true, message: '请输入名称' }]
      },
      tableData: [],
      chooseMultipleConditions: [
        {
          label: '名称', // 标签
          prop: 'scName', // 绑定的字段
          // label宽度
          type: 'input',
          labelWidth: '0.8rem',
          width: '30%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        // {
        //   label: '输入类型', // 标签
        //   prop: 'inputType', // 绑定的字段
        //   // label宽度
        //   type: 'select',
        //   width: '30%', // 整个组件占的宽度
        //   options: [
        //     { label: '所有', value: '' },
        //     { label: '固定项', value: '1' },
        //     { label: '输入项', value: '2' },
        //     { label: '提成项', value: '3' }
        //   ]
        // }
        {
          label: '计算类型', // 标签
          prop: 'signType', // 绑定的字段
          // label宽度
          type: 'select',
          width: '30%', // 整个组件占的宽度
          options: [
            { label: '所有', value: '' },
            { label: '增项', value: '1' },
            { label: '减项', value: '2' },
            { label: '非计算项', value: '3' }
          ]
        }
      ],
      chooseMultipleColumns: [
        {
          prop: 'scCode',
          label: '编码'
        },
        {
          prop: 'scName',
          label: '名称'
        },
        {
          prop: 'inputType',
          label: '输入类型',
          render: row => {
            if (row.inputType == '1') {
              return '固定项'
            } else if (row.inputType == '2') {
              return '输入项'
            } else if (row.inputType == '3') {
              return row.inputType
            }
          }
        },
        {
          prop: 'signType',
          label: '计算类型',
          render: row => {
            if (row.signType == '1') {
              return '增项'
            } else if (row.signType == '-1') {
              return '减项'
            } else if (row.signType == '0') {
              return '非计算项'
            } else {
              return row.signType
            }
          }
        },
        {
          prop: 'csgName',
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
      console.log(items)
      let copyItems = [...items]
      // if (this.operateType === 'add') {
      copyItems = copyItems.map((v, index) => {
        return {
          ...v,
          rowindex: index + 1
        }
      })
      // }
      this.tableData = copyItems
      this.chooseMultipleVisible = false
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        const items = this.tableData?.map(v => {
          return {
            scId: v.id,
            scCode: v.scCode,
            money: v.money,
            rowindex: v.rowindex,
            remark: v.remark
          }
        })
        return {
          ...this.info,
          items
        }
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (this.operateType === 'edit') {
          this.tableData = val?.items || []
        }
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>
