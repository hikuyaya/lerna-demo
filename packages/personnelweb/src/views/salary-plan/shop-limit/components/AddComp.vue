<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-25 10:47:27
 * @FilePath: \personnelweb\src\views\salary-plan\shop-limit\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" label-width="90px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="选择门店" prop="staffInfo">
            <el-input disabled v-model="staffInfo"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="operateType !== 'detail'" :span="1" class="pd-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseStaffVisible = true"></el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店编码" prop="eeCode">
            <el-input disabled v-model="info.eeCode" class="w90"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择年月" prop="date">
            <el-date-picker
              v-model="info.date"
              type="month"
              format="yyyy年MM月"
              placement="bottom"
              value-format="yyyy-MM"
              class="w90">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对公打款" prop="dgdk">
            <el-input-number
              v-model="info.dgdk"
              :controls="false"
              :min="0"
              class="w90" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="info.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <choose-single-item
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseSingleStaffActionUrl"
        :conditions="chooseStaffConditions"
        @select="handleSelectStaff"></choose-single-item>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleItem from '@src/components/business/ChooseSingleItem.vue'
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
    }
  },
  components: {
    ChooseSingleItem
  },
  computed: {
    staffInfo: function () {
      if (this.info.eeCode) {
        const name = this.info.eeName + '-' + this.info.eeCode
        this.$set(this.info, 'staffInfo', name)
        return name
      }
      return ''
    }
  },
  data() {
    return {
      info: {},
      tableData: [],
      chooseStaffVisible: false,
      chooseStaffColumns: [
        { label: '员工姓名', prop: 'eeName' },
        { label: '员工编码', prop: 'eeCode' },
        { label: '岗位名称', prop: 'postName' },
        { label: '门店编码', prop: 'bbCode' },
        { label: '门店名称', prop: 'bbName' },
        { label: '职务', prop: 'positionName' },
        { label: '级别', prop: 'positionLevelName' },
        { label: '级别1', prop: 'level1Name' }
      ],
      chooseSingleStaffActionUrl: service.staff.level.getByEeCode,
      chooseStaffConditions: [
        {
          label: '员工姓名', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '机构编码',
          prop: 'bbCode',
          type: 'input',
          width: '20%'
        },
        {
          label: '机构名称',
          prop: 'bbName',
          type: 'input',
          width: '20%'
        }
      ]
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
      // 自动填充变更日期字段
      copyStaff.changeDate = new Date().formatDate('yyyy-MM-dd')
      this.tableData = [copyStaff]
      this.chooseStaffVisible = false
    },
    handleAfStatusChange(val) {
      const copy = this.tableData[0]
      if ([1, 3].includes(val)) {
        // 在职、长假 清空离职原因
        copy.maintenanceLeave = ''
      }
      this.tableData = [copy]
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
    },
    'info.sx': {
      handler: function (val) {
        if (val == 1) {
          //
        }
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
