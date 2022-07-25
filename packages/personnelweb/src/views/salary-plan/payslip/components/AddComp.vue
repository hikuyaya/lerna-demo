<!--
 * @Author: wqy
 * @Date: 2022-07-25 11:08:40
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-25 18:13:06
 * @FilePath: \personnelweb\src\views\salary-plan\payslip\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-button type="primary" @click="$emit('back')" class="mg-b-24"
      >返回</el-button
    >
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="门店编码" prop="bbCode">
            <el-input v-model="info.bbCode" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="年" prop="year">
            <el-input-number
              v-model="info.year"
              :controls="false"
              :min="1970"
              :max="new Date().getFullYear()"
              class="w100">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="月" prop="month">
            <el-input-number
              v-model="info.year"
              :controls="false"
              :min="1"
              :max="12"
              class="w100">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="mg-l-12" @click="onQueryStaff"
            >获取员工</el-button
          >
        </el-col>
      </el-row>
      <div class="flex info-row">
        <div>门店：西宁1店</div>
        <div>编码：西宁1店</div>
        <div>工资月份：西宁1店</div>
        <div>合计人员：<span class="red">10</span></div>
      </div>
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
import FormItem from '@src/components/base/FormItem.vue'
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
    FormItem,
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
      rules: {
        bbCode: [{ required: true, message: '请输入门店编码' }]
      },
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
    onQueryStaff() {},
    getData() {
      return this.tableData
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
.info-row {
  display: flex;
  margin: 12px 24px;
  & > div {
    margin-right: 48px;
  }
}
</style>
