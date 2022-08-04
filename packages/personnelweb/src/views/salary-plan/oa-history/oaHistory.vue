<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:28:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-03 11:02:32
 * @FilePath: \personnelweb\src\views\salary-plan\oa-history\oaHistory.vue
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
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="创建日期"
          prop="createdTime"
          width="150px"></yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName"></yid-table-column>
        <yid-table-column label="员工编码" prop="eeCode"></yid-table-column>
        <yid-table-column
          label="岗位"
          prop="postName"
          width="200px"></yid-table-column>
        <yid-table-column label="入职时间" prop="entryTime"></yid-table-column>
        <yid-table-column label="申请金额" prop="money"></yid-table-column>

        <yid-table-column label="门店名称" prop="shopName"></yid-table-column>
        <yid-table-column
          label="门店编码"
          prop="shopCode"
          width="100px"></yid-table-column>

        <yid-table-column
          label="发起人"
          prop="oaApprovalName"
          width="100px"></yid-table-column>
      </yid-table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import service from '@src/service'
export default {
  components: { SearchTop },
  data() {
    return {
      addCompVisible: false,
      importCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
      selectRow: {},
      conditions: [
        {
          label: '员工姓名',
          prop: 'eeName',
          type: 'input',
          width: '18%'
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input',
          width: '18%'
        },
        {
          label: '门店名称',
          prop: 'shopName',
          type: 'input',
          width: '18%'
        },
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          width: '18%'
        }
      ],
      tableData: []
    }
  },
  created() {},
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryPlan.oaHistory.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
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
