<!--
 * @Author: wqy
 * @Date: 2022-08-01 15:26:25
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-04 11:12:32
 * @FilePath: \personnelweb\src\views\study-fund\query\query.vue
 * @Description: 学习金业务查询
-->
<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="员工编码" prop="eeCode">
            <el-input
              v-model="info.eeCode"
              placeholder="请输入员工编码"
              clearable
              class="w100">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="mg-l-12">
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="学习金方案" name="first">
        <yid-table pagination :data="tableData1" ref="table1" class="mg-t-12">
          <yid-table-column label="ID" prop="billCode" width="140px">
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.billCode
              }}</el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
      <el-tab-pane label="员工状态" name="second"> </el-tab-pane>
      <el-tab-pane label="学习金日志" name="third"> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  mounted() {
    this.queryList1()
    // this.queryList2()
    // this.queryList3()
  },
  data() {
    return {
      info: {},
      rules: {
        eeCode: [{ required: true, message: '请输入员工编码' }]
      },
      activeName: 'first',
      columns1: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        { label: '学习金额度', prop: 'eeCode' }
      ],
      columns2: [],
      columns3: [],
      tableData1: [],
      tableData2: [],
      tableData3: []
    }
  },
  methods: {
    onSearch() {},
    queryList1() {},
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
