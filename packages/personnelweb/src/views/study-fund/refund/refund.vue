<!--
 * @Author: wqy
 * @Date: 2022-08-01 15:27:41
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 08:56:47
 * @FilePath: \personnelweb\src\views\study-fund\refund\refund.vue
 * @Description: 学习金退费名单
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
            <el-button type="primary" @click="onReset">重置</el-button>
            <!-- <el-button type="primary" @click="onAdd">新增</el-button> -->
            <!-- <el-button type="primary" @click="onImport">导入</el-button> -->
            <el-button type="primary" @click="onExport">导出</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="门店编码" prop="bbCode" width="100px" fixed>
        </yid-table-column>
        <yid-table-column label="门店名称" prop="bbName" width="120px" fixed>
        </yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column label="性别" prop="sex" width="100px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.sex == '1'
                ? '男'
                : scope.row.sex == '2'
                ? '女'
                : scope.row.sex
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="职务"
          prop="positionName"
          width="120px"
          fixed></yid-table-column>

        <yid-table-column label="退费历史" prop="tfnum" width="100px">
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowHistory(scope.row)">{{
              scope.row.tfnum || '查看'
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column
          label="证件号"
          prop="cardNumber"
          width="200px"></yid-table-column>
        <yid-table-column
          label="银行卡号"
          prop="bankAccount"
          width="200px"></yid-table-column>
        <yid-table-column
          label="银行"
          prop="bankName"
          width="120px"></yid-table-column>

        <yid-table-column
          label="学习金金额"
          prop="tutje"
          width="100px"></yid-table-column>
        <yid-table-column label="已缴纳学习金" prop="tutjeCom" width="120px">
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowTutjeCom(scope.row)">{{
              scope.row.tutjeCom
            }}</el-link>
          </template>
        </yid-table-column>

        <yid-table-column
          label="入职日期"
          prop="entrydate"
          width="150px"></yid-table-column>
        <yid-table-column
          label="离职日期"
          prop="changeDate"
          width="150px"></yid-table-column>
        <yid-table-column
          label="联系电话"
          prop="mobile"
          width="120px"></yid-table-column>
        <yid-table-column
          label="汇款账户名"
          prop="accountname"
          width="120px"></yid-table-column>
      </yid-table>
    </div>

    <el-dialog
      title="学习金退费记录"
      :visible.sync="historyCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <history v-if="historyCompVisible" :value="selectRow" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyCompVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="学习金日志"
      :visible.sync="logCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <log v-if="logCompVisible" :value="selectRow" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="logCompVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import History from './components/History'
import Log from './components/Log'
import service from '@src/service'
import download from '@src/library/http/download'
export default {
  components: { SearchTop, History, Log },
  data() {
    return {
      historyCompVisible: false,
      logCompVisible: false,
      operateType: 'add',
      type: '', // approve 或者 remove
      selectRow: {},
      conditions: [
        {
          label: '离职创建日期',
          prop: 'time',
          type: 'daterange',
          width: '34%',
          labelWidth: '1.4rem',
          required: true
        },
        {
          label: '门店类型',
          prop: 'type',
          type: 'select',
          options: [
            { label: '美发门店', value: 'MF' },
            { label: '美容门店', value: 'MR' }
          ],
          width: '15%'
        },
        {
          label: '门店编码',
          prop: 'bbCode',
          type: 'input',
          width: '18%'
        },
        {
          label: '离职原因',
          prop: 'rgCode',
          type: 'select',
          options: [
            { label: '正常离职', value: '01' },
            { label: '无业绩离职', value: '02' },
            { label: '分店报离', value: '03' }
          ],
          width: '15%'
        }
      ],
      defaultParams: {
        // approvalStatus: 2
      },
      tableData: [],
      salcompData: []
    }
  },
  created() {},
  mounted() {
    // this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onExport() {
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
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      if (!params.time?.length) {
        this.$message.error('请选择离职创建时间！')
        return
      }
      const [startRq, endRq] = params.time
      params.startRq = startRq
      params.endRq = endRq
      delete params.time
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.studyFund.refund.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    onShowHistory(row) {
      this.selectRow = row
      this.historyCompVisible = true
    },
    onShowTutjeCom(row) {
      this.selectRow = row
      this.logCompVisible = true
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
