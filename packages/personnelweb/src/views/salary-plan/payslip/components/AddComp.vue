<!--
 * @Author: wqy
 * @Date: 2022-07-25 11:08:40
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-25 14:57:27
 * @FilePath: \personnelweb\src\views\salary-plan\payslip\components\AddComp.vue
 * @Description: 
-->

<template>
  <div class="container">
    <div>
      <el-button type="primary" @click="$emit('back')" class="mg-b-24"
        >返回</el-button
      >
      <el-button
        type="primary"
        v-if="tableData.length"
        @click="onSave"
        class="mg-b-24"
        >保存</el-button
      >
    </div>

    <el-form ref="form" :model="info" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="门店编码" prop="shopCode">
            <el-input
              v-model="info.shopCode"
              :disabled="locked"
              class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="年" prop="year">
            <el-input-number
              v-model="info.year"
              :controls="false"
              :min="1970"
              :max="new Date().getFullYear()"
              :disabled="locked"
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
              :disabled="locked"
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
    <template v-if="shop.shopname">
      <div class="flex info-row">
        <div>门店：{{ shop.shopname }}</div>
        <div>编码：{{ shop.shopcode }}</div>
        <div>工资月份：{{ info.year }}-{{ info.month }}</div>
        <div>
          合计人员：<span class="red">{{ tableData.length }}</span>
        </div>
      </div>
      <div class="mg-t-24 mg-b-12">
        <el-button type="primary" @click="onAdd">添加员工</el-button>
      </div>
      <yid-table
        :data="tableData"
        ref="table"
        class="mg-t-12"
        :height="tableData.length ? 'calc(100% - 198px)' : ''">
        <yid-table-column label="门店编码" prop="shopCode"></yid-table-column>
        <yid-table-column label="门店名称" prop="shopName"></yid-table-column>
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"></yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
        <yid-table-column label="职务" prop="psName"></yid-table-column>
        <yid-table-column label="员工状态" prop="employeeStatus" width="120px">
          <template slot-scope="scope">
            {{
              scope.row.employeeStatus == 1
                ? '正常'
                : scope.row.employeeStatus == 2
                ? '正常离职'
                : scope.row.employeeStatus
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="岗位类型" prop="type" width="120px">
          <template slot-scope="scope">
            <!-- <el-select v-model="scope.row.type" v-if="scope.row.add">
              <el-option label="主职" :value="1"></el-option>
              <el-option label="兼职" :value="2"></el-option>
            </el-select> -->
            {{
              scope.row.type == 1
                ? '主职'
                : scope.row.type == 2
                ? '兼职'
                : scope.row.type
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="备注" prop="remark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" v-if="scope.row.add">
            </el-input>
            <span v-else>
              {{ scope.row.remark }}
            </span>
          </template>
        </yid-table-column>
        <yid-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定删除吗？"
              @confirm="onDeleteRow(scope.$index, scope.row)">
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
        :defaultParams="defaultParams"
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
      locked: false, // 门店编码、年、月是否需要被锁定
      shop: {},
      datas: [], // 查出的本店人员数据
      copyDatas: [], // 缓存本地人员数据 用来比较：从弹窗加进来的人员是本店员工时
      adds: [], // 添加进来的其他店人员数据
      defaultParams: {
        searchType: 1
      },
      rules: {
        shopCode: [{ required: true, message: '请输入门店编码' }],
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
          label: '门店编码',
          prop: 'bbCode',
          type: 'input',
          width: '20%'
        },
        {
          label: '门店名称',
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
      /**
       * 去重
       * 1.属于本店员工this.copyDatas并且不在this.datas中，加入到this.datas中
       * 2.不属于本店员工this.copyData并且不在this.adds中，加入到this.adds中
       */
      let datas = []
      let adds = []
      for (let i = 0; i < staffs.length; i++) {
        const d = staffs[i]
        const containCopyDatas = this.calContaine(d, this.copyDatas)
        const containDatas = this.calContaine(d, this.datas)
        const containAdds = this.calContaine(d, this.adds)
        console.log('containCopyDatas', containCopyDatas)
        console.log('containDatas', containDatas)
        console.log('containAdds', containAdds)
        if (containCopyDatas && !containDatas) {
          datas.push(d)
        } else if (!containCopyDatas && !containAdds) {
          adds.push(d)
        }
      }

      datas = datas.map(v => {
        return {
          eeCode: v.eeCode,
          eeName: v.eeName,
          shopName: this.shop.shopname,
          shopCode: this.shop.shopcode,
          psCode: v.positionCode,
          psName: v.positionName,
          psLevelName: v.positionLevelName,
          psLevelCode: v.positionLevelCode,
          employeeStatus: v.type,
          type: 1, // 1主职 2兼职
          remark: '',
          psLevel1Name: v.level1Name,
          psLevel1Code: v.level1Code,
          add: true
        }
      })
      adds = adds.map(v => {
        return {
          eeCode: v.eeCode,
          eeName: v.eeName,
          shopName: this.shop.shopname,
          shopCode: this.shop.shopcode,
          psCode: v.positionCode,
          psName: v.positionName,
          psLevelName: v.positionLevelName,
          psLevelCode: v.positionLevelCode,
          employeeStatus: v.employeeStatus,
          type: v.bbCode === this.info.shopCode ? v.type : 2, // 属于本店员工取他本身的type，否则是2
          remark: '',
          psLevel1Name: v.level1Name,
          psLevel1Code: v.level1Code,
          add: true
        }
      })
      const tempGlobalAdds = JSON.parse(JSON.stringify(this.adds))
      const tempGlobalDatas = JSON.parse(JSON.stringify(this.datas))
      this.adds = [...tempGlobalAdds, ...adds]
      this.datas = [...tempGlobalDatas, ...datas]

      this.chooseStaffVisible = false
    },
    calContaine(d, tableData) {
      let flag = false
      for (let i = 0; i < tableData.length; i++) {
        const t = tableData[i]
        if (t.eeCode === d.eeCode) {
          flag = true
          break
        }
      }
      return flag
    },
    onQueryStaff() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.shop.shopname) {
            this.queryShop()
          }
          this.onSearch()
        }
      })
    },
    onDeleteRow(index, row) {
      const tableDataLength = this.tableData.length
      if (row.add) {
        const copyData = [...this.adds]
        copyData.splice(index - tableDataLength, 1)
        this.adds = copyData
      } else {
        const copyData = [...this.datas]
        copyData.splice(index, 1)
        this.datas = copyData
      }
    },
    async queryShop() {
      const { data } = await service.chain.shop.shopListWithPage({
        pcodename: this.info.shopCode,
        page: 1,
        limit: 10
      })
      if (data.length) {
        this.shop = data?.[0]
      }
    },
    async onSearch() {
      let params = {
        ...this.info,
        page: 1,
        limit: 1000
      }
      const { data } = await service.salaryPlan.payslip.list(params)
      if (!this.locked) {
        this.locked = true
        this.copyDatas = JSON.parse(JSON.stringify(data))
      }
      this.datas = [...data]
    },
    onAdd() {
      this.chooseStaffVisible = true
    },
    getData() {
      return this.tableData
    },
    async onSave() {
      this.$confirm(`您确认保存页面信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          let params = {
            ...this.info,
            monthRptHreesalVOList: this.tableData
          }
          console.log(params)
          // return
          await service.salaryPlan.payslip.save(params)
          this.$message.success('操作成功')
          this.$emit('success')
        })
        .catch(() => {})
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.info-row {
  display: flex;
  margin: 12px 24px;
  & > div {
    margin-right: 48px;
  }
}
</style>
