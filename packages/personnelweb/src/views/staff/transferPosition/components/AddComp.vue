<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-25 13:54:08
 * @FilePath: \personnelweb\src\views\staff\transferPosition\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" label-width="90px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="调离员工">
            <el-input
              :value="selectSourceStaff"
              disabled
              style="width: calc(100% - 100px)"
              class="mg-r-12" />
            <el-button
              v-if="operateType !== 'edit'"
              type="primary"
              icon="el-icon-search"
              circle
              @click="chooseStaffVisible = true"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <yid-table :data="sourceTableData">
      <yid-table-column label="标志" prop="sourceFlag" width="120px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.sourceFlag">
            <el-option label="在岗" :value="1"> </el-option>
            <el-option label="离岗" :value="2"> </el-option>
          </el-select>
        </template>
      </yid-table-column>
      <yid-table-column label="岗位" prop="postName"></yid-table-column>
      <yid-table-column label="机构编码" prop="bbCode" width="100px">
      </yid-table-column>
      <yid-table-column label="机构名称" prop="bbName"> </yid-table-column>
      <yid-table-column label="职务名称" prop="positionName" width="176px">
      </yid-table-column>
      <yid-table-column label="类型" prop="sourceType" width="100px">
        <template slot-scope="scope">
          {{
            scope.row.sourceType == 1
              ? '正式'
              : scope.row.sourceType == 2
              ? '兼职'
              : '未知'
          }}
        </template>
      </yid-table-column>
      <yid-table-column
        label="岗位变动日期"
        prop="sourceModifyDate"
        width="176">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.sourceModifyDate"
            type="date"
            format="yyyy年MM月dd日"
            placement="bottom"
            value-format="yyyy-MM-dd"
            style="width: 154px">
          </el-date-picker>
        </template>
      </yid-table-column>
    </yid-table>
    <el-form ref="form" label-width="90px" class="mg-t-24">
      <el-row>
        <el-col :span="10">
          <el-form-item label="调至新岗位">
            <el-input
              :value="selectTargetStaff"
              disabled
              style="width: calc(100% - 100px)"
              class="mg-r-12" />
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="choosePositionVisible = true"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <yid-table :data="targetTableData">
      <yid-table-column label="标志" prop="targetFlag" width="120px">
        <template slot-scope="scope"> 增岗 </template>
      </yid-table-column>
      <yid-table-column label="岗位" prop="postName"> </yid-table-column>
      <yid-table-column label="机构编码" prop="bbCode" width="100px">
      </yid-table-column>
      <yid-table-column label="机构名称" prop="bbName"> </yid-table-column>
      <yid-table-column label="职务名称" prop="positionName" width="176px">
      </yid-table-column>
      <yid-table-column label="类型" prop="targetType" width="100px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.targetType">
            <el-option label="正式" :value="1"> </el-option>
            <el-option label="兼职" :value="2"> </el-option>
          </el-select>
        </template>
      </yid-table-column>
      <yid-table-column
        label="岗位变动日期"
        prop="targetModifyDate"
        width="176">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.targetModifyDate"
            type="date"
            format="yyyy年MM月dd日"
            placement="bottom"
            value-format="yyyy-MM-dd"
            style="width: 154px">
          </el-date-picker>
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
    <el-dialog
      title="选择岗位"
      :visible.sync="choosePositionVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <choose-single-position
        v-if="choosePositionVisible"
        @select="handleSelectPosition"></choose-single-position>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleStaff from './ChooseSingleStaff.vue'
import ChooseSinglePosition from './ChooseSinglePosition.vue'
import service from '@src/service'
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    operateType: String
  },
  components: {
    ChooseSingleStaff,
    ChooseSinglePosition
  },
  data() {
    return {
      info: {},
      sourceTableData: [],
      targetTableData: [],
      chooseStaffVisible: false,
      choosePositionVisible: false
    }
  },
  methods: {
    handleSelectStaff(staff) {
      console.log(staff)
      const tempStaff = Object.assign({}, staff)
      tempStaff.sourceModifyDate = new Date().formatDate('yyyy-MM-dd')
      tempStaff.sourceType = staff.type
      tempStaff.sourceUserPostId = staff.id
      this.sourceTableData = [tempStaff]
      this.chooseStaffVisible = false
    },
    handleSelectPosition(position) {
      console.log(position)
      const tempPosition = Object.assign({}, position)
      tempPosition.targetModifyDate = new Date().formatDate('yyyy-MM-dd')
      this.targetTableData = [tempPosition]
      this.choosePositionVisible = false
    },
    getData() {
      if (!this.sourceTableData.length) {
        this.$message.error('请选择调离员工！')
        return
      }
      if (!this.targetTableData.length) {
        this.$message.error('请选择新岗位！')
        return
      }
      const source = this.sourceTableData[0]
      const target = this.targetTableData[0]
      console.log(source, target)

      let params = {
        eeCode: source.eeCode,
        sourceFlag: source.sourceFlag,
        sourceType: source.sourceType,
        sourceUserPostId: source.sourceUserPostId,
        targetPostCode: target.postCode || target.targetPostCode,
        targetFlag: 3,
        targetType: target.targetType,
        targetModifyDate: target.targetModifyDate,
        sourceModifyDate: source.sourceModifyDate
      }

      return this.operateType === 'add' ? params : { ...params, id: source.id }
    }
  },
  computed: {
    selectSourceStaff: function () {
      if (this.sourceTableData?.length) {
        return (
          this.sourceTableData[0].eeName + '-' + this.sourceTableData[0].eeCode
        )
      }
      return ''
    },
    selectTargetStaff: function () {
      if (this.targetTableData?.length) {
        return this.targetTableData[0].postName
      }
      return ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (this.operateType === 'add') {
          return
        }
        this.info = JSON.parse(JSON.stringify(val))
        const source = {
          id: val.id,
          sourceUserPostId: val.sourceUserPostId,
          sourceFlag: val.sourceFlag,
          postName: val.sourcePostName,
          bbCode: val.sourceRegionCode,
          bbName: val.sourceRegionName,
          eeName: val.eeName,
          eeCode: val.eeCode,
          sourceType: val.sourceType,
          sourceModifyDate: val.sourceModifyDate,
          positionName: val.sourcePositionName
        }
        // const source = JSON.parse(JSON.stringify(val))
        this.sourceTableData = [source]
        const target = {
          targetFlag: val.targetFlag,
          postName: val.targetPostName,
          bbCode: val.targetRegionCode,
          bbName: val.targetRegionName,
          positionName: val.targetPositionName,
          targetType: val.targetType,
          targetModifyDate: val.targetModifyDate,
          targetPostCode: val.targetPostCode
        }
        // const target = JSON.parse(JSON.stringify(val))
        this.targetTableData = [target]
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
