<!--
 * @Author: wqy
 * @Date: 2022-07-27 16:31:16
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-27 16:31:26
 * @FilePath: \personnelweb\src\views\salary-business\salary-request\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-button type="primary" @click="$emit('back')" class="mg-b-24"
      >返回</el-button
    >
    <el-form ref="form" :model="info" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="门店编码" prop="bbCode">
            <el-input v-model="info.bbCode" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
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
        <el-col :span="4">
          <el-form-item label="月" prop="month">
            <el-input-number
              v-model="info.month"
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
    </el-form>
    <template v-if="tableData.length">
      <div class="flex info-row">
        <div>门店：西宁1店</div>
        <div>编码：西宁1店</div>
        <div>工资月份：西宁1店</div>
        <div>合计人员：<span class="red">10</span></div>
      </div>
      <div class="mg-t-24 mg-b-12">
        <el-button type="primary" @click="onAdd">添加员工</el-button>
      </div>
      <yid-table :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="门店编码" prop="bbCode"></yid-table-column>
        <yid-table-column label="门店名称" prop="bbName"></yid-table-column>
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"></yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
        <yid-table-column label="职务" prop="positionName"></yid-table-column>
        <yid-table-column label="员工状态" prop="status"></yid-table-column>
        <yid-table-column label="岗位类型" prop="type">
          <template slot-scope="scope">
            <template v-if="!!scope.row.add">{{ scope.row.type }}</template>
            <el-select v-else v-model="scope.row.type">
              <el-option label="主岗位" :value="1"></el-option>
              <el-option label="兼职岗" :value="2"></el-option>
            </el-select>
          </template>
        </yid-table-column>
        <yid-table-column label="备注" prop="remark"></yid-table-column>
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
    </template>

    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <choose-multiple-item
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseStaffActionUrl"
        :conditions="chooseStaffConditions"
        @select="handleSelectStaffs"></choose-multiple-item>
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
    }
  },
  components: {
    ChooseMultipleItem
  },
  computed: {
    staffInfo: function () {
      if (this.info.eeCode) {
        const name = this.info.eeName + '-' + this.info.eeCode
        this.$set(this.info, 'staffInfo', name)
        return name
      }
      return ''
    },
    tableData: function () {
      return [...this.datas, ...this.adds]
    }
  },
  data() {
    return {
      info: {
        year: new Date().getFullYear(),
        month: new Date().getMonth()
      },
      datas: [{}], // 查出的本店人员数据
      adds: [], // 添加进来的其他店人员数据
      rules: {
        bbCode: [{ required: true, message: '请输入门店编码' }],
        year: [{ required: true, message: '请输入' }],
        month: [{ required: true, message: '请输入' }]
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
      chooseStaffActionUrl: service.staff.level.getByEeCode,
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
    handleSelectStaffs(staffs) {
      console.log(staffs)
      const addStaffs = staffs.map(v => {
        return {
          ...v,
          add: true
        }
      })
      this.adds = [...addStaffs]
      this.chooseStaffVisible = false
    },
    onQueryStaff() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.onSearch()
        }
      })
    },
    async onSearch() {},
    onAdd() {
      this.chooseStaffVisible = true
    },
    getData() {
      return this.tableData
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
.info-row {
  display: flex;
  margin: 12px 24px;
  & > div {
    margin-right: 48px;
  }
}
</style>
