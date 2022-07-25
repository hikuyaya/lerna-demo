<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-25 11:02:38
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
      <yid-table-column label="岗位" prop="postName" width="80px">
      </yid-table-column>
      <yid-table-column
        label="原职务级别"
        prop="positionLevelName"
        width="100px">
      </yid-table-column>
      <yid-table-column label="新职务级别" prop="afPslName" width="176px">
        <template slot-scope="scope">
          <el-input
            :value="scope.row.afPslName"
            @click.native="handleShowLevel(scope.row, scope.$index)" />
        </template>
      </yid-table-column>
      <yid-table-column label="原职务级别1" prop="level1Name" width="176px">
      </yid-table-column>
      <yid-table-column
        label="新职务级别1"
        prop="afPsllevel1Name"
        width="176px">
        <template slot-scope="scope">
          <el-input
            :value="scope.row.afPsllevel1Name"
            @click.native="handleShowLevel1(scope.row, scope.$index)" />
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
    <el-dialog
      title="选择新职务级别"
      :visible.sync="chooseLevelVisible"
      :close-on-click-modal="false"
      append-to-body
      width="600px">
      <yid-table
        :data="levels"
        class="mg-t-12"
        @row-click="handleCurrentChange">
        <yid-table-column label="职务编码" prop="pscode"></yid-table-column>
        <yid-table-column label="职务名称" prop="psname"> </yid-table-column>
        <yid-table-column label="级别" prop="clevel" v-if="type === 'level'">
        </yid-table-column>
        <yid-table-column
          label="级别名称"
          prop="pslname"
          v-if="type === 'level'">
        </yid-table-column>
        <yid-table-column label="级别1" prop="clevel" v-if="type === 'level1'">
        </yid-table-column>
        <yid-table-column
          label="级别名称1"
          prop="pslname"
          v-if="type === 'level1'">
        </yid-table-column>
      </yid-table>
    </el-dialog>
  </div>
</template>

<script>
import ChooseMultipleStaff from './ChooseMultipleStaff'
import service from '@src/service'
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    ChooseMultipleStaff
  },
  data() {
    return {
      info: {},
      selectLevel: {},
      selectLevel1: {},
      tableData: [],
      levels: [],
      levelIndex: -1,
      treeSelectNode: null,
      chooseStaffVisible: false,
      chooseLevelVisible: false,
      type: 'level' // level or level1
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
          afPslcode: d.afPslcode,
          afPslLevel: d.afPslLevel,
          positionCode: d.positionCode,
          postType: d.type,
          isApproval: 0,
          remark: d.remark,
          afPsllevel1: d.afPsllevel1,
          afPslcode1: d.afPslcode1
        }
      })
    },
    async handleShowLevel(row, index) {
      console.log('handleShowLevel')
      this.chooseLevelVisible = true
      this.selectLevel = row
      this.type = 'level'
      this.levelIndex = index
      const { data } = await service.base.duty.positionLevelList({
        pscode: row.positionCode,
        page: 1,
        limit: 100
      })
      this.levels = data?.sort((a, b) => a.clevel - b.clevel)
    },
    async handleShowLevel1(row, index) {
      console.log('handleShowLevel1')
      this.chooseLevelVisible = true
      this.selectLevel1 = row
      this.type = 'level1'
      this.levelIndex = index
      const { data } = await service.base.duty.positionLevel1List({
        pscode: row.positionCode,
        page: 1,
        limit: 100
      })
      this.levels = data?.sort((a, b) => a.clevel - b.clevel)
    },
    handleCurrentChange(row, column, event) {
      const copyTableData = [...this.tableData]
      if (this.type === 'level') {
        copyTableData[this.levelIndex] = {
          ...copyTableData[this.levelIndex],
          afPslName: row.pslname,
          afPslcode: row.pslcode,
          afPslLevel: row.clevel
        }
      } else {
        copyTableData[this.levelIndex] = {
          ...copyTableData[this.levelIndex],
          afPsllevel1Name: row.pslname,
          afPslcode1: row.pslcode,
          afPsllevel1: row.clevel
        }
      }
      this.tableData = copyTableData
      this.chooseLevelVisible = false
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
