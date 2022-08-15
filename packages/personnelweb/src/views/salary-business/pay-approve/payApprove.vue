<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:45:10
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-15 18:01:13
 * @FilePath: \personnelweb\src\views\salary-business\pay-approve\payApprove.vue
 * @Description: 
-->
<template>
  <div class="container">
    <el-collapse-transition>
      <div v-if="!addCompVisible" class="content">
        <search-top
          ref="searchTop"
          :options="conditions"
          :defaultParams="defaultParams">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
              <el-button
                type="primary"
                @click="onBatchOperate('lock', '一键锁定')"
                >一键锁定</el-button
              >
              <el-button
                type="primary"
                @click="onBatchOperate('unLock', '一键解锁')"
                >一键解锁</el-button
              >
              <el-button type="primary" @click="onOperate('approve')"
                >审核</el-button
              >
              <el-button type="primary" @click="onOperate('reject')"
                >驳回</el-button
              >
              <el-button type="primary" @click="onCancelApprove"
                >取消审核</el-button
              >
            </div>
          </template>
        </search-top>
        <yid-table
          pagination
          :data="tableData"
          ref="table"
          class="mg-t-12"
          @selection-change="handleSelectionChange">
          <yid-table-column type="selection" width="48px"></yid-table-column>
          <yid-table-column label="单号" prop="billCode" width="140px" fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.billCode
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="门店编码"
            prop="shopCode"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="门店名称"
            prop="shopName"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="年"
            prop="year"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="月"
            prop="month"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="状态"
            prop="approvalStatus"
            width="80px"
            fixed>
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
                  : scope.row.approvalStatu
              }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="合计工资"
            prop="totalMoney"
            width="100px"></yid-table-column>
          <yid-table-column
            label="打款工资"
            prop="payMoney"
            width="100px"></yid-table-column>
          <yid-table-column
            label="剩余工资"
            prop="surplusMoney"
            width="100px"></yid-table-column>

          <yid-table-column label="是否锁定" prop="isLock">
            <template slot-scope="scope">
              {{
                scope.row.isLock == 1
                  ? '是'
                  : scope.row.isLock == 0
                  ? '否'
                  : scope.row.isLock
              }}
            </template>
          </yid-table-column>
          <yid-table-column label="是否打款" prop="isPay">
            <template slot-scope="scope">
              {{
                scope.row.isPay == 1
                  ? '是'
                  : scope.row.isPay == 0
                  ? '否'
                  : scope.row.isPay
              }}
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
            label="修改人"
            prop="updatedBy"
            width="100px"></yid-table-column>
          <yid-table-column
            label="修改时间"
            prop="updatedTime"
            width="150px"></yid-table-column>
          <yid-table-column
            label="审批人"
            prop="approvalEename"
            width="100px"></yid-table-column>
          <yid-table-column
            label="审批时间"
            prop="approvalTime"
            width="150px"></yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType"
        @back="handleBack"
        @success="handleAddSuccess" />
    </el-collapse-transition>

    <el-dialog
      title="确认驳回"
      :visible.sync="rejectCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="400px">
      <reject-comp v-if="rejectCompVisible" ref="rejectCompRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onRejectSubmit">确 定</el-button>
        <el-button @click="rejectCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="取消审核"
      :visible.sync="cancelApproveCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px">
      <cancel-approve-comp
        v-if="cancelApproveCompVisible"
        ref="cancelApproveCompRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onCancelApproveSubmit"
          >确 定</el-button
        >
        <el-button @click="cancelApproveCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="operateCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px">
      <operate-comp
        v-if="operateCompVisible"
        ref="operateCompRef"
        :shopType="defaultParams.shopType"
        :type="batchOperateType" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operateSubmit">{{ title }}</el-button>
        <el-button @click="operateCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import RejectComp from '@src/components/business/RejectComp'
import OperateComp from './components/BatchOperateComp'
import CancelApproveComp from './components/CancelApproveComp'
import service from '@src/service'
import { mapGetters } from 'vuex'
import yid from '@src/library'

const cacheKey = 'pay-approve-shopType'

export default {
  components: {
    SearchTop,
    AddComp,
    RejectComp,
    OperateComp,
    CancelApproveComp
  },
  data() {
    return {
      addCompVisible: false,
      rejectCompVisible: false,
      operateCompVisible: false,
      cancelApproveCompVisible: false,
      title: '',
      type: '', // remove or approve
      batchOperateType: '', // 批量操作时类型
      menuId: '',
      operateType: 'add',
      selectRow: {},
      defaultParams: {},
      conditions: [
        {
          label: '门店类型',
          prop: 'shopType',
          type: 'select', // 搜索类型
          width: '14%',
          options: [
            { label: '美发门店', value: 1 },
            { label: '美容门店', value: 2 }
          ],
          prefix: false
        },
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input', // 搜索类型
          width: '14%',
          placeholder: '请输入',
          prefix: false
        },
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '0.5rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '8.5%',
          placeholder: '年',
          prefix: false
        },
        {
          label: '月',
          prop: 'month',
          type: 'input-number',
          labelWidth: '0.5rem',
          width: '7.5%',
          controls: false,
          min: 1,
          max: 12,
          placeholder: '月',
          prefix: false
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          labelWidth: '0.6rem',
          width: '11%',
          options: [
            { label: '待提交', value: 1 },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 },
            { label: '已驳回', value: 0 }
          ],
          prefix: false
        }
      ],
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters({
      salCompMenus: 'user/salaryBusinessMenu'
    })
  },
  created() {
    const localStorageShopType = yid.cache.get(cacheKey)
    if (localStorageShopType) {
      this.defaultParams.shopType = localStorageShopType
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    async onReset() {
      this.$refs.searchTop.reset()
      yid.cache.remove(cacheKey)
      this.onSearch()
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      // const localStorageShopType = yid.cache.get(cacheKey)
      // if (localStorageShopType) {
      //   params.shopType = localStorageShopType
      // }
      const fetch = service.salaryBusiness.payApprove.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
      if (params.shopType) {
        // 缓存
        yid.cache.set(cacheKey, params.shopType)
        this.defaultParams.shopType = params.shopType
      }
    },
    onEdit(row) {
      this.selectRow = row
      this.operateType = 'edit'
      this.addCompVisible = true
    },
    onReject() {
      this.type = 'approve'
      this.rejectCompVisible = true
    },
    onApprove() {
      this.$confirm(`确认要对选择单据进行审核吗？`, `确认审核`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          const params = new FormData()
          const ids = this.multipleSelection.map(v => v.id)
          params.append('ids', ids)
          await service.salaryBusiness.payApprove.censorBills(params)
          this.$message.success('操作成功')
          await this.queryList()
        })
        .catch(() => {})
    },
    onLock() {},
    onUnLock() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onBatchOperate(type, title) {
      // lockApprove、unLockApprove、lockCalculate、unLockCalculate、reject
      this.title = title
      this.batchOperateType = type
      this.operateCompVisible = true
    },
    onOperate(type) {
      if (!this.multipleSelection.length) {
        this.$message.error('请在列表中选择需要操作的记录')
        return
      }
      if (type === 'approve') {
        this.onApprove()
      } else if (type === 'reject') {
        this.onReject()
      }
    },
    onShowDetail(row) {
      this.selectRow = row
      this.operateType = 'detail'
      this.addCompVisible = true
    },
    async operateSubmit() {
      const result = await this.$refs.operateCompRef.getData()
      if (!result) {
        return
      }

      let count = 0
      const params = new FormData()
      const { year, month, shopType } = result
      params.append('year', year)
      params.append('month', month)
      params.append('shopType', shopType)
      if (this.batchOperateType === 'lock') {
        const { data } = await service.salaryBusiness.payApprove.lockBills(
          params
        )
        count = data
      } else if (this.batchOperateType === 'unLock') {
        const { data } =
          await service.salaryBusiness.payApprove.cancelLockBills(params)
        count = data
      }
      this.operateCompVisible = false
      this.$alert(
        `您已成功对<span class="red"> ${count} </span>家门店进行${this.title.substr(
          2
        )}`,
        this.title.substr(2),
        {
          dangerouslyUseHTMLString: true
        }
      )
    },
    onCancelApprove() {
      //
    },
    onCancelApproveSubmit() {
      //
    },
    async onRejectSubmit() {
      const result = await this.$refs.rejectCompRef.getData()
      if (!result) {
        return
      }
      const params = new FormData()
      const ids = this.multipleSelection.map(v => v.id)
      params.append('ids', ids)
      params.append('backReason', result.message)
      await service.salaryBusiness.payApprove.rejectBills(params)
      this.$message.success('操作成功')
      this.rejectCompVisible = false
      // 刷新列表
      await this.queryList()
    },
    async handleAddSuccess() {
      this.addCompVisible = false
      await this.$nextTick()
      await this.queryList()
    },
    async handleBack() {
      this.addCompVisible = false
      await this.$nextTick()
      await this.queryList()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .content {
    // flex: 1;
  }
}
</style>
