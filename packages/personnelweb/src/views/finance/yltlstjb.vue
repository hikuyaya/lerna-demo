<template>
  <div>
    <el-form
      ref="elSearchForm"
      inline
      :model="searchForm"
      :rules="rules.searchForm">
      <el-form-item label="店号：" prop="shopcode">
        <el-input v-model="searchForm.shopcode" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="财务片区：" prop="facode">
        <fa-select :code.sync="searchForm.facode"></fa-select>
      </el-form-item>
      <el-form-item label="日期：" prop="rqRange" label-width="100px">
        <div class="block">
          <el-date-picker
            :clearable="true"
            v-model="searchForm.rqRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="search" type="primary">查询</el-button>
        <el-button @click="rest" type="primary">重置</el-button>
        <el-button @click="excel" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <yid-table
      ref="elTable"
      :data="tableData"
      style="margin-top: 15px"
      :height="wheight"
      :row-class-name="$yid.util.getTableClass">
      <yid-table-column
        label="店号"
        min-width="100"
        prop="shopcode"></yid-table-column>
      <yid-table-column
        label="店名"
        min-width="100"
        prop="shopname"></yid-table-column>
      <yid-table-column
        label="本期流水"
        min-width="100"
        prop="m1"></yid-table-column>
      <yid-table-column
        label="扣除手续费后"
        min-width="100"
        prop="m2"></yid-table-column>
      <yid-table-column
        label="本期已开单"
        min-width="100"
        prop="m3"></yid-table-column>
      <yid-table-column
        label="本期未开单"
        min-width="100"
        prop="m4"></yid-table-column>
      <yid-table-column label="本期流水差额" min-width="100" prop="c2">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="本期流水差额=本期流水-本期已开单-本期未开单"
            placement="top-start">
            <label :style="{ color: scope.row.c2 != 0 ? 'red' : 'blue' }">{{
              scope.row.c2
            }}</label>
          </el-tooltip>
        </template>
      </yid-table-column>
      <yid-table-column
        label="本期在他"
        min-width="100"
        prop="m9"></yid-table-column>
      <yid-table-column
        label="本期在本"
        min-width="100"
        prop="m5"></yid-table-column>
      <yid-table-column label="本期开单差额" min-width="100" prop="c3">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="本期开单差额=本期已开单-本期在本-本期在他"
            placement="top-start">
            <label :style="{ color: scope.row.c3 != 0 ? 'red' : 'blue' }">{{
              scope.row.c3
            }}</label>
          </el-tooltip>
        </template>
      </yid-table-column>
      <yid-table-column
        label="他期在本"
        min-width="100"
        prop="m6"></yid-table-column>
      <yid-table-column
        label="对账表金额"
        min-width="100"
        prop="m7"></yid-table-column>
      <yid-table-column label="对账差额" min-width="100" prop="c1">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="对账差额=本期在本+他期在本-对账表金额"
            placement="top-start">
            <label :style="{ color: scope.row.c1 != 0 ? 'red' : 'blue' }">{{
              scope.row.c1
            }}</label>
          </el-tooltip>
        </template>
      </yid-table-column>
      <yid-table-column
        label="对账表手续费后"
        min-width="100"
        prop="m8"></yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import download from '@src/library/http/download'
import faSelect from './components/faSelect'
export default {
  name: 'yltlstjb',
  components: { faSelect },
  data() {
    return {
      searchForm: {
        shopcode: '',
        facode: '',
        rqRange: [],
        rqMin: '',
        rqMax: ''
      },
      tableData: [],
      wheight: window.innerHeight - 320,
      rules: {
        searchForm: {
          rqRange: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ]
        }
      }
    }
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    search() {
      this.tableData = []
      let params = {}
      let rqRange = this.searchForm.rqRange
      if (rqRange && rqRange.length > 0) {
        params.rqMin = this.searchForm.rqRange[0]
        params.rqMax = this.searchForm.rqRange[1]
      } else {
        this.$message({ type: 'error', message: '请选择查询日期范围' })
        return
      }
      params.shopcode = this.searchForm.shopcode
      params.facode = this.searchForm.facode
      service.cashier.prepaidorder.yltlstjb(params).then(res => {
        if (res.resp_code == 200) this.tableData = res.data
      })
    },
    rest() {
      this.$refs['elSearchForm'].resetFields()
      this.tableData = []
    },
    excel() {
      let params = {}
      let rqRange = this.searchForm.rqRange
      if (rqRange && rqRange.length > 0) {
        params.rqMin = this.searchForm.rqRange[0]
        params.rqMax = this.searchForm.rqRange[1]
      } else {
        this.$message({ type: 'error', message: '请选择查询日期范围' })
        return
      }
      params.shopcode = this.searchForm.shopcode
      params.facode = this.searchForm.facode
      download(
        yid.config.API.BASE + 'api-cashier/prepaidorder/report/yltlstjb/excel',
        params
      )
    }
  }
}
</script>

<style scoped lang="scss"></style>
