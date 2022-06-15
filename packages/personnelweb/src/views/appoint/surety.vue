<template>
  <div class="appoint-list">
    <el-form inline>
      <el-form-item label="状态：">
        <el-select
          clearable
          v-model.trim="searchForm.status"
          placeholder="请选择"
          style="width: 160px">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in statusList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约单号：">
        <el-input
          clearable
          v-model.trim="searchForm.billcode"
          placeholder="请输入预约单号"
          style="width: 180px"></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input
          clearable
          v-model.trim="searchForm.custmobile"
          placeholder="会员手机号"
          style="width: 180px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()" type="primary">查询</el-button>
      </el-form-item>
    </el-form>

    <yid-table pagination ref="table" :data="tableData">
      <yid-table-column
        label="流水号"
        min-width="140"
        prop="extorderid"></yid-table-column>
      <yid-table-column
        label="会员"
        min-width="140"
        prop="custname"></yid-table-column>
      <yid-table-column
        label="手机号"
        min-width="140"
        prop="custmobile"></yid-table-column>
      <yid-table-column
        label="预约单号"
        min-width="140"
        prop="billcode"></yid-table-column>
      <yid-table-column
        label="预约门店"
        min-width="140"
        prop="shopname"></yid-table-column>
      <yid-table-column
        label="创建时间"
        min-width="140"
        prop="createdTime"></yid-table-column>
      <yid-table-column
        label="金额"
        min-width="140"
        prop="payje"></yid-table-column>
      <yid-table-column label="状态" min-width="140" prop="billstatus">
        <template slot-scope="scope">
          {{
            scope.row.billstatus == '2' ||
            scope.row.billstatus == '3' ||
            scope.row.billstatus == '-3'
              ? '已付款'
              : '已退还'
          }}
        </template>
      </yid-table-column>
      <yid-table-column
        label="退还时间"
        min-width="140"
        prop="tkDate"></yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import service from '@src/service'
export default {
  name: 'surety',
  data() {
    return {
      statusList: [
        { value: '-1', label: '全部' },
        { value: '0', label: '已付款' },
        { value: '1', label: '已退还' }
      ],
      pageInfo: { page: 1, limit: 10 },
      searchForm: {
        status: '-1',
        billcode: '',
        custmobile: ''
      },
      tableData: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    search() {
      this.pageInfo = { page: 1, limit: 10 }
      this.getData()
    },
    getData() {
      let params = { ...this.pageInfo, ...this.searchForm }
      const fetch = service.yy.yylist.suretyList
      this.$refs.table.reloadData({
        fetch,
        params
      })
    }
  }
}
</script>

<style scoped></style>
