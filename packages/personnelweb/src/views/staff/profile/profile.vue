<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:38:46
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-13 10:21:11
 * @FilePath: \personnelweb\src\views\staff\profile\profile.vue
 * @Description: 员工资料维护
-->
<template>
  <div class="container">
    <div class="content">
      <search-top
        ref="searchTop"
        :options="conditions"
        :advanceOptions="advanceConditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="员工姓名" prop="eeName" width="80px" fixed>
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.eeName
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode" width="100px" fixed>
        </yid-table-column>
        <yid-table-column label="性别" prop="name" width="50px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="年龄"
          prop="age"
          width="50px"
          fixed></yid-table-column>
        <yid-table-column
          label="职务"
          prop="positionName"
          fixed></yid-table-column>
        <yid-table-column
          label="手机号"
          prop="mobile"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="证件号"
          prop="cardNumber"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column label="机构编码" prop="bbCode"></yid-table-column>
        <yid-table-column label="机构名称" prop="bbName"></yid-table-column>
        <yid-table-column
          label="入职时间"
          prop="entrydate"
          width="150px"></yid-table-column>
        <yid-table-column
          label="转正时间"
          prop=""
          width="150px"></yid-table-column>
        <yid-table-column label="状态" prop="status">
          <template slot-scope="scope">
            {{
              scope.row.status === 1
                ? '在职'
                : scope.row.status === 2
                ? '离职'
                : scope.row.status === 2
                ? '长假'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="是否股东" prop="shareholder">
          <template slot-scope="scope">
            {{ scope.row.shareholder === 1 ? '是' : '否' }}
          </template>
        </yid-table-column>
        <yid-table-column label="合同状态" prop="contractStatus">
          <template slot-scope="scope">
            {{
              scope.row.contractStatus == 1
                ? '有效'
                : scope.row.contractStatus == 2
                ? '无效'
                : scope.row.contractStatus == 3
                ? '到期'
                : scope.row.contractStatus == 4
                ? '其他'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="连续工龄"
          prop="servyear"
          width="80px"></yid-table-column>
        <yid-table-column
          label="延续工龄"
          prop="curservyear"
          width="80px"></yid-table-column>
        <yid-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <i
                class="el-icon-edit c-pointer font-size-16rem mg-r-8"
                @click="onEdit(scope.row)"></i>
            </el-tooltip>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      :title="
        operateType === 'add'
          ? '新增'
          : operateType === 'edit'
          ? '修改'
          : '详情'
      "
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1050px">
      <staff-profile
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :treeData="treeData"
        :educationData="educationData"
        :bankData="bankData"
        :inductionwayData="inductionwayData"
        :operateType="operateType"
        :from="STAFF_PROFILE_TYPE.PROFILE"
        @cancel="addCompVisible = false" />
      <span v-if="operateType === 'detail'" slot="footer" class="dialog-footer">
        <el-button @click="onCancel">关 闭</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import StaffProfile from '@src/components/business/staffProfile/StaffProfile.vue'
import { STAFF_PROFILE_TYPE } from '@src/type'
import service from '@src/service'
export default {
  components: { SearchTop, StaffProfile },
  data() {
    return {
      STAFF_PROFILE_TYPE,
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
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
          width: '20%'
        }
      ],
      advanceConditions: [
        {
          label: '机构编码',
          prop: 'bbCode',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '机构名称',
          prop: 'bbName',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '手机号',
          prop: 'mobile',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '身份证号',
          prop: 'cardNumber',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select', // 搜索类型
          options: [
            { label: '在职', value: 1 },
            { label: '离职', value: 2 },
            { label: '长假', value: 3 }
          ],
          width: '20%'
        },
        {
          label: '连续工龄>',
          prop: 'servyear',
          type: 'number',
          width: '20%'
        },
        {
          label: '延续工龄>',
          prop: 'curservyear',
          type: 'number',
          width: '20%'
        },
        {
          label: '是否股东',
          prop: 'shareholder',
          type: 'select',
          width: '20%',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        },
        {
          label: '合同状态',
          prop: 'contractStatus',
          type: 'select',
          width: '20%',
          options: [
            { label: '有效', value: 1 },
            { label: '无效', value: 2 },
            { label: '到期', value: 3 },
            { label: '其他', value: 4 }
          ]
        }
      ],
      tableData: [],
      treeData: [],
      educationData: [],
      bankData: [],
      inductionwayData: []
    }
  },
  created() {
    this.queryGroup()
    this.queryEducationDic()
    this.queryBankDic()
    this.queryInductionwayList()
  },
  mounted() {
    // this.queryList()
  },
  methods: {
    async queryGroup() {
      const { data } = await service.chain.region.treeAll({})
      this.treeData = data
    },
    async queryEducationDic() {
      const { data } = await service.dic.getEducationList()
      this.educationData = data
    },
    async queryBankDic() {
      const { data } = await service.dic.getBankList()
      this.bankData = data
    },
    async queryInductionwayList() {
      const { data } = await service.dic.getInductionwayList()
      this.inductionwayData = data
    },
    onOpenAdvance() {},
    queryList() {
      this.onSearch()
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      // 身份证号转大写
      params.cardNumber = params.cardNumber?.toUpperCase()
      const fetch = service.staff.profile.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    onEdit(row) {
      this.selectRow = row
      this.operateType = 'edit'
      this.addCompVisible = true
    },
    async onDelete(row) {
      this.$confirm(`确认要删除 ${row.userName} 入职申请信息吗？`, `删除确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.staff.entry.remove(row.id)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    // 审核
    async onApprove(row) {
      this.$confirm(`您确认审核 ${row.userName} 入职申请信息吗？`, `审核确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.staff.entry.approve(row.id)
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    onShowDetail(row) {
      this.selectRow = row
      this.operateType = 'detail'
      this.addCompVisible = true
    },
    async onSubmit() {
      const result = await this.$refs.addCompRef.getData()
      console.log(result)
      if (!result) {
        return
      }
      // 只有修改
      await service.staff.profile.update(result)
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      await this.queryList()
    },
    onCancel(row) {
      this.addCompVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  .content {
    // flex: 1;
  }
}
</style>
