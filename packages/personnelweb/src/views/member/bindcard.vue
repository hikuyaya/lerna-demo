<template>
  <div class="branch">
    <el-form ref="bindcardForm" inline :model="searchForm">
      <el-form-item label="卡号：">
        <el-input
          clearable
          v-model="searchForm.cardno"
          placeholder="卡号"
          style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="绑定手机号：">
        <el-input
          clearable
          v-model="searchForm.mobile"
          placeholder="绑定手机号"
          style="width: 180px"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="search" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table
      pagination
      ref="bindcardtable"
      :data="bindcardData"
      style="margin-top: 15px"
      :row-class-name="$yid.util.getTableClass">
      <yid-table-column
        label="绑卡会员ID"
        min-width="100"
        prop="memid"></yid-table-column>
      <yid-table-column
        label="绑定手机号"
        min-width="180"
        prop="mobile"></yid-table-column>
      <yid-table-column
        label="卡号"
        min-width="150"
        prop="cardno"></yid-table-column>
      <yid-table-column
        label="卡名称"
        min-width="150"
        prop="cardname"></yid-table-column>
      <yid-table-column label="操作" min-width="250" prop="content">
        <template slot-scope="scope">
          <el-link type="primary" @click="unbound(scope.row)">解绑</el-link>
        </template>
      </yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
export default {
  name: 'bindcard',
  data() {
    return {
      bindcardData: [],
      searchForm: {
        cardno: '',
        mobile: ''
      },
      pageInfo: { page: 1, limit: 10 }
    }
  },
  created() {},
  mounted() {
    /**获取组列表**/
    this.search()
  },
  methods: {
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.bindcardtable.Pagination.internalPageSize
      const params = this.pageInfo
      params.cardno = this.searchForm.cardno
      params.mobile = this.searchForm.mobile
      params.status = '1'
      params.isDel = '0'
      const fetch = service.branch.bindcardlist
      this.$refs.bindcardtable.reloadData({
        fetch,
        params
      })
    },
    unbound(row) {
      service.branch
        .unbindcard({ id: row.id, cardid: row.cardid })
        .then(res => {
          if (res.resp_code == 200) {
            this.jobDataAll = res.data
          }
          this.search()
        })
    }
  }
}
</script>

<style scoped></style>
