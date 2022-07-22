<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-22 18:32:51
 * @FilePath: \personnelweb\src\views\salary-plan\adjust\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" label-width="90px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="选择员工" prop="staffInfo">
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
        <el-col :span="7">
          <el-form-item label="员工编码" prop="eeCode">
            <el-input disabled v-model="info.eeCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="账套学习金" class="mg-b-16" />
      <el-row>
        <el-col :span="8">
          <el-form-item label="工资账套" prop="zt">
            <el-select v-model="info.zt" class="w100">
              <el-option label="美发工资账套" value="1"></el-option>
              <el-option label="美容工资账套" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学习金金额" prop="xxjje">
            <el-input-number v-model="info.xxjje" :controls="false" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="已缴纳学习金" prop="yjnxxj">
            <el-input-number v-model="info.yjnxxj" :controls="false" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="固定项" class="mg-b-16" />
      <el-row>
        <el-col :span="8">
          <el-form-item label="固定项" prop="gdx">
            <el-select v-model="info.gdx">
              <el-option label="基本工资" value="1"></el-option>
              <el-option label="保底差额" value="2"></el-option>
              <el-option label="新入职底薪" value="3"></el-option>
              <el-option label="岗位底薪" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="固定项金额" prop="gdxje">
            <el-input-number v-model="info.gdxje" :controls="false" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="时效" prop="sx">
            <el-radio-group v-model="info.sx">
              <el-radio :label="1">临时</el-radio>
              <el-radio :label="0">长期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="info.sx == 1" label="执行开始" prop="zxks">
            <el-date-picker
              v-model="info.zxks"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="info.sx == 1" label="执行结束" prop="zxjs">
            <el-date-picker
              v-model="info.zxjs"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd">
            </el-date-picker>
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
      <choose-single-staff
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseSingleStaffActionUrl"
        :conditions="chooseStaffConditions"
        @select="handleSelectStaff"></choose-single-staff>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleStaff from '@src/components/business/ChooseSingleStaff.vue'
import TitleHeader from '@src/components/base/TitleHeader.vue'
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
    ChooseSingleStaff,
    TitleHeader
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
