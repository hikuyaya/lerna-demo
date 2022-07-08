<!--
 * @Author: wqy
 * @Date: 2022-06-15 17:17:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-07 15:40:36
 * @FilePath: \personnelweb\src\views\staff\entry\entry.vue
 * @Description: 门店入职审核
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="单号" prop="billcode" width="80px" fixed>
        </yid-table-column>
        <yid-table-column label="姓名" prop="userName" width="100px" fixed>
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.userName
            }}</el-link>
          </template>
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
        <yid-table-column label="职务" prop="psname" fixed></yid-table-column>
        <yid-table-column label="手机号" prop="mobile" fixed></yid-table-column>
        <yid-table-column
          label="证件号"
          prop="cardNumber"
          width="150px"
          fixed></yid-table-column>
        <yid-table-column label="机构编码" prop="regionCode"></yid-table-column>
        <yid-table-column label="机构名称" prop="regionName"></yid-table-column>
        <yid-table-column label="来源" prop="otype">
          <template slot-scope="scope">
            {{
              scope.row.otype === 1
                ? '门店'
                : scope.row.otype === 2
                ? '总部'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="状态" prop="approvalStatus">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.approvalStatus === 1 ? 'primary' : 'success'"
              >{{
                scope.row.approvalStatus === 1 ? '待审核' : '已审核'
              }}</el-tag
            >
          </template>
        </yid-table-column>
        <yid-table-column
          label="创建人"
          prop="createdBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="创建时间"
          prop="createdTime"
          width="150px"></yid-table-column>
        <yid-table-column
          label="审核人"
          prop="approvalEeName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审核时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
        <yid-table-column label="操作" min-width="100" fixed="right">
          <!-- <template slot-scope="scope"> -->
          <template v-if="scope.row.approvalStatus === 1" slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <i
                class="el-icon-edit c-pointer font-size-16rem mg-r-8"
                @click="onEdit(scope.row)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <i
                class="el-icon-delete c-pointer font-size-16rem mg-r-8"
                @click="onDelete(scope.row)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="审核" placement="top">
              <i
                class="el-icon-s-check c-pointer font-size-16rem"
                @click="onApprove(scope.row)"></i>
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
        :operateType="operateType"
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
// import AddComp from './components/test.vue'
import service from '@src/service'
export default {
  components: { SearchTop, StaffProfile },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '员工姓名', // 标签
          prop: 'userName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '15%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '来源',
          prop: 'otype',
          type: 'select', // 搜索类型
          width: '12%',
          options: [
            { label: '不限', value: null },
            { label: '总部', value: 2 },
            { label: '门店', value: 1 }
          ]
        },
        {
          label: '手机号',
          prop: 'mobile',
          width: '15%'
        },
        {
          label: '身份证',
          prop: 'cardNumber',
          width: '15%'
        },
        {
          label: '机构编码',
          prop: 'regionCode',
          width: '15%'
        },
        {
          label: '审核状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          width: '15%',
          options: [
            { label: '所有', value: '' },
            { label: '待审核', value: 1 },
            { label: '已审核', value: 3 }
          ]
        }
      ],
      tableData: [],
      treeData: [],
      educationData: [],
      bankData: []
    }
  },
  created() {
    this.queryGroup()
    this.queryEducationDic()
    this.queryBankDic()
  },
  mounted() {
    this.queryList()
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
    onOpenAdvance() {},
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    queryList() {
      this.onSearch()
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      // 身份证号转大写
      params.cardNumber = params.cardNumber?.toUpperCase()
      const fetch = service.staff.entry.list
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
      if (this.operateType === 'add') {
        await service.staff.entry.save(result)
      } else {
        await service.staff.entry.update(result)
      }
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
