<!--
 * @Author: wqy
 * @Date: 2022-07-05 14:42:46
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-19 09:38:22
 * @FilePath: \personnelweb\src\views\staff\profileShop\profileShop.vue
 * @Description: 门店员工资料维护
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
            <el-button type="primary" @click="onAdd">新增</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="单号" prop="billCode" width="80px" fixed>
        </yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="100px" fixed>
        </yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode" width="50px" fixed>
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
        <yid-table-column label="操作" min-width="100" fixed="right">
          <!-- <template slot-scope="scope"> -->
          <template
            v-if="
              scope.row.approvalStatus == 0 || scope.row.approvalStatus == 1
            "
            slot-scope="scope">
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
        <el-button @click="onCancel">关 闭</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('save')">保 存</el-button>
        <el-button type="primary" @click="onSubmit('approve')">提 交</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import ShopStaffProfile from '@src/components/business/staffProfile/ShopStaffProfile.vue'
// import AddComp from './components/test.vue'
import service from '@src/service'
export default {
  components: { SearchTop, ShopStaffProfile },
  data() {
    return {
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
      const fetch = service.staff.shop.list
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
    async onSubmit(type) {
      const result = await this.$refs.addCompRef.getData()
      console.log(result)
      if (!result) {
        return
      }
      const approvalStatus = type === 'save' ? 1 : 2
      const params = {
        ...result,
        approvalStatus
      }
      if (type === 'save') {
        await service.staff.shop.save(params)
      } else {
        await service.staff.shop.update(params)
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
