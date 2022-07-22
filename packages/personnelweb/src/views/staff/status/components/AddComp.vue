<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-22 09:25:54
 * @FilePath: \personnelweb\src\views\staff\status\components\AddComp.vue
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
      <yid-table-column label="原状态" prop="beStatus" width="80px">
        <template slot-scope="scope">
          {{
            scope.row.beStatus == 1
              ? '在职'
              : scope.row.beStatus == 2
              ? '离职'
              : scope.row.beStatus == 3
              ? '长假'
              : '其他'
          }}
        </template>
      </yid-table-column>
      <yid-table-column label="新状态" prop="afStatus" width="176px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.afStatus">
            <el-option
              label="在职"
              :value="1"
              :disabled="scope.row.beStatus == 1"></el-option>
            <el-option
              label="离职"
              :value="2"
              :disabled="scope.row.beStatus == 2"></el-option>
            <el-option
              label="长假"
              :value="3"
              :disabled="scope.row.beStatus == 3"></el-option>
          </el-select>
        </template>
      </yid-table-column>
      <yid-table-column label="离职原因" prop="maintenanceLeave" width="176px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.maintenanceLeave" clearable>
            <el-option
              v-for="status in statusReasonList"
              :key="status.name"
              :label="status.name"
              :value="status.code"></el-option>
          </el-select>
        </template>
      </yid-table-column>
      <yid-table-column label="变动日期" prop="contdateend" width="176px">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.contdateend"
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
    </yid-table>
    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <choose-single-staff
        v-if="chooseStaffVisible"
        @select="handleSelectStaff"></choose-single-staff>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleStaff from './ChooseSingleStaff.vue'
import service from '@src/service'
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    statusReasonList: Array
  },
  components: {
    ChooseSingleStaff
  },
  data() {
    return {
      info: {},
      selectLevel: {},
      selectLevel1: {},
      tableData: [],
      chooseStaffVisible: false
    }
  },
  methods: {
    handleSelectStaff(staff) {
      console.log(staff)
      const copyStaff = { ...staff, beStatus: staff.status }
      let newAfStatus = 0
      // 新状态根据原状态计算得到默认值：原状态为离职时，新状态默认选中在职，原状态为在职时，默认选中离职
      if (copyStaff.status == 1) {
        newAfStatus = 2
      } else if (copyStaff.status == 2) {
        newAfStatus = 1
      }
      copyStaff.afStatus = newAfStatus
      this.tableData = [copyStaff]
      this.chooseStaffVisible = false
    },
    getData() {
      return this.tableData
      // return this.tableData?.map(d => {
      //   return {
      //     eeCode: d.eeCode,
      //     afPslcode: d.afPslcode,
      //     afPslLevel: d.afPslLevel,
      //     positionCode: d.positionCode,
      //     postType: d.type,
      //     isApproval: 0,
      //     remark: d.remark,
      //     afPsllevel1: d.afPsllevel1,
      //     afPslcode1: d.afPslcode1
      //   }
      // })
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
