<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-11 13:43:59
 * @FilePath: \personnelweb\src\views\staff\level\components\AddComp.vue
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
      <yid-table-column label="岗位" prop="contractStatus" width="80px">
      </yid-table-column>
      <yid-table-column label="原职务级别1" prop="status2" width="100px">
      </yid-table-column>
      <yid-table-column label="新职务级别1" prop="contdatesigned" width="176px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" />
        </template>
      </yid-table-column>
      <yid-table-column label="原职务级别2" prop="contdatestart" width="176px">
      </yid-table-column>
      <yid-table-column label="新职务级别2" prop="contdateend" width="176px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" />
        </template>
      </yid-table-column>
      <yid-table-column label="合同有效期" prop="htdate" width="176px">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.htdate"
            type="date"
            format="yyyy年MM月dd日"
            placement="bottom"
            value-format="yyyy-MM-dd"
            style="width: 154px">
          </el-date-picker>
        </template>
      </yid-table-column>
      <yid-table-column label="备注" prop="remark">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" />
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
      chooseStaffVisible: false,
      contractStatusOptions: [
        { label: '有效', value: '1' },
        { label: '无效', value: '2' },
        { label: '到期', value: '3' },
        { label: '其他', value: '4' }
      ]
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
        // return {
        //   eeCode: d.eeCode,
        //   regionCode: d.bbCode,
        //   eeName: d.eeName,
        //   beStatus: d.contractStatus + '',
        //   status2: d.status2,
        //   contdatesigned: d.contdatesigned,
        //   contdatestart: d.contdatestart,
        //   contdateend: d.contdateend,
        //   htdate: d.htdate,
        //   remark: d.remark
        // }
        return {
          ...d,
          regionCode: d.bbCode
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

<style lang="scss" scoped>
.font-size-22px {
  font-size: 22px;
}
</style>
