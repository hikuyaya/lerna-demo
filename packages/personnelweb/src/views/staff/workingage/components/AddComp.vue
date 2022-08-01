<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-01 14:14:23
 * @FilePath: \personnelweb\src\views\staff\workingage\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" label-width="90px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="选择员工">
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="chooseStaffVisible = true"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <yid-table :data="tableData" ref="table" class="mg-t-12">
      <yid-table-column
        label="员工编码"
        prop="eeCode"
        width="100px"></yid-table-column>
      <yid-table-column label="姓名" prop="eeName" width="100px">
      </yid-table-column>
      <yid-table-column label="原延续工龄" prop="curservyear" width="100px">
      </yid-table-column>
      <yid-table-column label="原延续工龄备注" prop="csmemo" width="176px">
      </yid-table-column>
      <yid-table-column label="新延续工龄" width="176px">
        <template slot-scope="scope">
          <el-input-number :min="0" :max="100" v-model="scope.row.afServyear" />
        </template>
      </yid-table-column>
      <yid-table-column
        label="新延续工龄备注"
        prop="afCurservyear"
        width="176px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.afCurservyear" />
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
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <choose-multiple-staff
        v-if="chooseStaffVisible"
        @select="handleSelectStaff"></choose-multiple-staff>
    </el-dialog>
  </div>
</template>

<script>
import ChooseMultipleStaff from './ChooseMultipleStaff'

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
    ChooseMultipleStaff
  },
  data() {
    return {
      info: {},
      selectStaff: {},
      tableData: [],
      treeSelectNode: null,
      chooseStaffVisible: false
    }
  },
  methods: {
    handleSelectStaff(staffs) {
      console.log(staffs)
      this.tableData = [...staffs]
      this.chooseStaffVisible = false
    },
    onDeleteRow(index) {
      const copyTableData = [...this.tableData]
      copyTableData.splice(index, 1)
      this.tableData = copyTableData
    },
    getData() {
      return this.tableData?.map(d => {
        return {
          eeCode: d.eeCode,
          bbCode: d.bbCode,
          eeName: d.eeName,
          beServyear: d.curservyear,
          beCurservyear: d.csmemo,
          afServyear: d.afServyear,
          afCurservyear: d.afCurservyear
        }
      })
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

<style lang="scss" scoped>
.font-size-22px {
  font-size: 22px;
}
</style>
