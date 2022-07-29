<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:03:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 14:17:15
 * @FilePath: \personnelweb\src\views\salary-setting\composition\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="名称" prop="scName">
            <el-input v-model="info.scName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="输入类型" prop="inputType">
            <el-select v-model="info.inputType">
              <el-option label="固定项" :value="1"></el-option>
              <el-option label="输入项" :value="2"></el-option>
              <el-option label="提成项" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计算类型" prop="signType">
            <el-select v-model="info.signType">
              <el-option label="增项" :value="1"></el-option>
              <el-option label="减项" :value="-1"></el-option>
              <el-option label="非计算项" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="薪酬分组" prop="csgCode">
            <el-select v-model="info.csgCode">
              <el-option
                v-for="item in salcompData"
                :key="item.label"
                :label="item.label"
                :value="item.value"></el-option>
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
      <yid-table-column label="显示菜单" prop="name"></yid-table-column>
      <yid-table-column label="适用门店类型" prop="shopType">
        <template slot-scope="scope">
          <el-select v-model="scope.row.shopType">
            <el-option label="美发门店" :value="1"></el-option>
            <el-option label="美容门店" :value="2"></el-option>
            <el-option label="不限门店" :value="3"></el-option>
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
        :actionUrl="actionUrl"
        :defaultParams="defaultParams"
        :columns="chooseMenuColumns"
        @select="handleSelect"></choose-multiple-item>
      <!-- <choose-menu
        v-if="chooseMenuVisible"
        @select="handleSelect"
        :initData="tableData.map(v => v.name)"></choose-menu> -->
    </el-dialog>
  </div>
</template>

<script>
import ChooseMultipleItem from '@src/components/business/ChooseMultipleItem.vue'
import ChooseMenu from './ChooseMenu.vue'
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
    salcompData: Array
  },
  components: {
    ChooseMultipleItem,
    ChooseMenu
  },
  data() {
    return {
      info: {},
      chooseMenuVisible: false,
      rules: {
        addRemark: [{ required: true, message: '请输入报备原因' }],
        scName: [{ required: true, message: '请输入名称' }],
        inputType: [{ required: true, message: '请选择输入类型' }],
        signType: [{ required: true, message: '请选择计算类型' }]
      },
      defaultParams: {
        pname: '薪酬业务'
      },
      tableData: [],
      actionUrl: service.salarySetting.composition.menuList,
      chooseMenuConditions: [
        {
          label: '菜单名', // 标签
          prop: 'name', // 绑定的字段
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
          prop: 'name',
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
    handleSelect(menus) {
      this.chooseMenuVisible = false
      this.tableData = menus
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        const menus = (this.tableData || []).map(v => {
          return {
            menuId: this.operateType === 'edit' ? v.menuId : v.id,
            menuName: v.name,
            type: v.shopType
          }
        })
        return {
          ...this.info,
          status: 1,
          menus
        }
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        let copyVal = JSON.parse(JSON.stringify(val))
        if (this.operateType === 'edit') {
          this.tableData = copyVal.menus?.map(v => {
            return {
              ...v,
              name: v.menuName,
              shopType: v.type
            }
          })
        }
        this.info = copyVal
      }
    }
  }
}
</script>
