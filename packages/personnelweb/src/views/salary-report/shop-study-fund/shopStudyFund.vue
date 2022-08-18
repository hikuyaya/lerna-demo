<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <!-- <el-button type="primary" @click="onReset">重置</el-button> -->
            <el-button type="primary" @click="onExport">导出</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="120px"></yid-table-column>
        <yid-table-column label="性别" prop="sex" width="80px">
          <template slot-scope="scope">
            {{
              scope.row.sex == 1
                ? '男'
                : scope.row.sex == 2
                ? '女'
                : scope.row.sex
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="所属门店"
          prop="shopName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="门店编码"
          prop="shopCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="职务"
          prop="psName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="学习金额度"
          prop="tutje"
          width="100px"></yid-table-column>
        <yid-table-column
          label="已缴纳额度"
          prop="tutjeCom"
          width="100px"></yid-table-column>
        <yid-table-column
          label="已退还额度"
          prop="tutjeTh"
          width="100px"></yid-table-column>
        <yid-table-column label="学习金缴纳历史" prop="eexxjLogVOList">
          <template slot-scope="scope">
            {{
              scope.row.eexxjLogVOList
                .map(v => `${v.xxj} ${v.remark}`)
                .join('，')
            }}
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
      type: '', // remove or approve
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '员工姓名',
          prop: 'eeName',
          type: 'input',
          width: '20%'
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input',
          width: '20%'
        }
      ],
      tableData: [],
      positionList: [],
      positionLevelList: [],
      positionLevel1List: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      salCompMenus: 'user/salaryBusinessMenu'
    })
  },
  created() {},
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onExport() {
      const data = this.$refs.table.getCurData()
      if (!data.length) {
        this.$message.error('暂无数据可以导出')
        return
      }
      let params = this.$refs.searchTop.getSearchParams()
      download(
        `${this.$yid.config.API.BASE}api-pers/employeesal/expShopXxjList`,
        params
      )
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salaryReport.shopStudyFund.list
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
