<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:43:56
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-27 14:51:47
 * @FilePath: \personnelweb\src\views\staff\profileReviewShop\profileReviewShop.vue
 * @Description: 门店员工资料审核
-->
<template>
  <div class="container">
    <div class="content">
      <search-top
        ref="searchTop"
        :options="conditions"
        :defaultParams="defaultParams">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onApprove">审核</el-button>
            <el-button type="primary" @click="onReject">驳回</el-button>
          </div>
        </template>
      </search-top>
      <yid-table
        pagination
        :data="tableData"
        ref="table"
        class="mg-t-12"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="48"
          :selectable="checkboxSelect"></el-table-column>
        <yid-table-column label="单号" prop="billCode" width="80px" fixed>
        </yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.eeName
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode" width="80px" fixed>
        </yid-table-column>
        <yid-table-column label="手机号" prop="mobile" fixed></yid-table-column>
        <yid-table-column label="职务" prop="psName" fixed></yid-table-column>
        <yid-table-column label="状态" prop="approvalStatus">
          <template slot-scope="scope">
            {{
              scope.row.approvalStatus == 1
                ? '待提交'
                : scope.row.approvalStatus == 2
                ? '待审核'
                : scope.row.approvalStatus == 3
                ? '已审核'
                : scope.row.approvalStatus == 0
                ? '已驳回'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="驳回原因" prop="backRemark">
        </yid-table-column>
        <yid-table-column label="门店编码" prop="shopCode"> </yid-table-column>
        <yid-table-column label="门店名称" prop="shopName"> </yid-table-column>
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
          prop="approvalEename"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审核时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
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
      :visible.sync="rejectCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="400px">
      <reject-comp v-if="rejectCompVisible" ref="rejectCompRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
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
      <shop-staff-profile
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :treeData="treeData"
        :educationData="educationData"
        :bankData="bankData"
        :operateType="operateType"
        @cancel="addCompVisible = false" />
      <span v-if="operateType === 'detail'" slot="footer" class="dialog-footer">
        <el-button @click="addCompVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import RejectComp from '@src/components/business/RejectComp'
import ShopStaffProfile from '@src/components/business/staffProfile/ShopStaffProfile.vue'
import service from '@src/service'
export default {
  components: { SearchTop, RejectComp, ShopStaffProfile },
  data() {
    return {
      rejectCompVisible: false,
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '员工编码',
          prop: 'eeCode',
          width: '20%'
        },
        {
          label: '门店编码',
          prop: 'shopCode',
          width: '20%'
        },
        {
          label: '门店名称',
          prop: 'shopName',
          width: '20%'
        },
        {
          label: '审核状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          width: '20%',
          options: [
            { label: '所有', value: '' },
            { label: '待提交', value: 1 },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 },
            { label: '已驳回', value: 0 }
          ]
        }
      ],
      defaultParams: {
        approvalStatus: 2
      },
      tableData: [],
      treeData: [],
      educationData: [],
      bankData: [],
      multipleSelection: []
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
    queryList() {
      this.onSearch()
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      // 身份证号转大写
      params.cardNumber = params.cardNumber?.toUpperCase()
      const fetch = service.staff.shop.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    async onApprove() {
      if (!this.multipleSelection.length) {
        this.$message.error('请从列表中勾选需要操作的记录')
        return
      }
      this.$confirm(
        `确认要对选择单据进行审核吗？审核后会立即生效`,
        `审核确认`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          const idList = this.multipleSelection.map(v => v.id)
          await service.staff.shop.approve({
            idList,
            status: 1
          })
          this.$message.success('操作成功')
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
    },
    onReject() {
      if (!this.multipleSelection.length) {
        this.$message.error('请从列表中勾选需要操作的记录')
        return
      }
      this.rejectCompVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    checkboxSelect(row, rowIndex) {
      if (row.approvalStatus == 2) {
        return true // 可选
      } else {
        return false // 不可选
      }
    },
    onEdit(row) {
      this.selectRow = row
      this.operateType = 'edit'
      this.rejectCompVisible = true
    },
    async onDelete(row) {
      this.$confirm(`确认要删除此条申请信息吗？`, `删除确认`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.staff.shop.remove(row.id)
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
      const result = await this.$refs.rejectCompRef.getData()
      console.log(result)
      if (!result) {
        return
      }
      const idList = this.multipleSelection.map(v => v.id)
      await service.staff.shop.approve({
        idList,
        status: 0,
        message: result.message
      })
      this.$message.success('操作成功')
      this.rejectCompVisible = false
      // 刷新列表
      await this.queryList()
    },
    onCancel(row) {
      this.rejectCompVisible = false
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
