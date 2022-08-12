<!--
 * @Author: wqy
 * @Date: 2022-08-12 11:32:41
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 11:42:34
 * @FilePath: \personnelweb\src\views\staff-report\shop-staff-info\shopStaffInfo.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
            <el-button type="primary" @click="onExport">导出</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="门店编码"
          prop="shopCode"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="shopName"
          width="120px"
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
          label="合计人数"
          prop="employeeCount"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="状态"
          prop="approvalStatus"
          width="100px"
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
          label="驳回原因"
          prop="backMessage"></yid-table-column>
        <yid-table-column
          label="创建人"
          prop="createdBy"
          width="100px"></yid-table-column>
        <yid-table-column
          label="创建时间"
          prop="createdTime"
          width="150px"></yid-table-column>
        <yid-table-column
          label="审批人"
          prop="approvalEename"
          width="100px"></yid-table-column>
        <yid-table-column
          label="审批时间"
          prop="approvalTime"
          width="150px"></yid-table-column>
        <yid-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <!-- 待审核（只显示驳回、复核按钮） -->
            <el-tooltip
              v-if="scope.row.approvalStatus == 2"
              effect="dark"
              content="驳回"
              placement="top">
              <i
                class="el-icon-s-release c-pointer mg-r-8 font-size-16rem"
                @click="onReject(scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.approvalStatus == 2"
              effect="dark"
              content="审核"
              placement="top">
              <i
                class="el-icon-s-check c-pointer font-size-16rem"
                @click="onApprove(scope.row)"></i>
            </el-tooltip>
            <!-- 已驳回（只显示编辑按钮） -->
            <el-tooltip
              v-if="scope.row.approvalStatus == 0"
              effect="dark"
              content="编辑"
              placement="top">
              <i
                class="el-icon-edit c-pointer mg-r-8 font-size-16rem"
                @click="onEdit(scope.row)"></i>
            </el-tooltip>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import download from '@src/library/http/download'
import service from '@src/service'
import { mapGetters } from 'vuex'
export default {
  components: { SearchTop },
  data() {
    return {
      addCompVisible: false,
      rejectCompVisible: false,
      type: '', // remove or approve
      menuId: '',
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '0.6rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '12%'
        },
        {
          label: '月',
          prop: 'month',
          type: 'input-number',
          labelWidth: '0.6rem',
          width: '12%',
          controls: false,
          min: 1,
          max: 12
        },
        {
          label: '状态',
          prop: 'approvalStatus',
          type: 'select', // 搜索类型
          width: '20%',
          options: [
            { label: '所有', value: '' },
            { label: '待审核', value: 2 },
            { label: '已审核', value: 3 },
            { label: '已驳回', value: 0 }
          ]
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters({
      salCompMenus: 'user/salaryBusinessMenu'
    })
  },
  created() {
    const menu = this.salCompMenus.find(
      v => window.location.href.indexOf(v.url) !== -1
    )
    if (!menu) {
      this.$message.error('无对应菜单信息')
      return
    }
    this.menuId = menu.id
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onExport() {
      return
      let params = this.$refs.searchTop.getSearchParams()
      if (!params.time?.length) {
        this.$message.error('请选择离职创建时间！')
        return
      }
      const [startRq, endRq] = params.time
      params.startRq = startRq
      params.endRq = endRq
      delete params.time
      download(
        `${this.$yid.config.API.BASE}api-pers/eexxjadjbill/expEesaltk`,
        params
      )
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staffReport.shopStaffInfo.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
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
