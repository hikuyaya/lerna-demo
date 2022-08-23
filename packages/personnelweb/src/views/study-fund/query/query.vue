<!--
 * @Author: wqy
 * @Date: 2022-08-01 15:26:25
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-23 17:33:53
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
        <yid-table :data="tableData1" ref="table1" class="mg-t-12">
          <yid-table-column
            v-for="column in columns1"
            :key="'table1' + column.prop"
            :label="column.label"
            :width="column.width"
            :prop="column.prop">
            <template slot-scope="scope">
              <span v-if="column.render">
                {{ column.render(scope.row) }}
              </span>
              <span v-else>
                {{ scope.row[column.prop] }}
              </span>
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
      <el-tab-pane label="员工状态" name="second">
        <yid-table pagination :data="tableData2" ref="table2" class="mg-t-12">
          <yid-table-column
            v-for="column in columns2"
            :key="'table2' + column.prop"
            :label="column.label"
            :width="column.width"
            :prop="column.prop">
            <template slot-scope="scope">
              <span v-if="column.render">
                {{ column.render(scope.row) }}
              </span>
              <span v-else>
                {{ scope.row[column.prop] }}
              </span>
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
      <el-tab-pane label="学习金日志" name="third">
        <yid-table pagination :data="tableData3" ref="table3" class="mg-t-12">
          <yid-table-column
            v-for="column in columns3"
            :key="'table3' + column.prop"
            :label="column.label"
            :width="column.width"
            :prop="column.prop">
            <template slot-scope="scope">
              <span v-if="column.render">
                {{ column.render(scope.row) }}
              </span>
              <span v-else>
                {{ scope.row[column.prop] }}
              </span>
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  mounted() {},
  data() {
    return {
      info: {
        eeCode: ''
      },
      rules: {
        eeCode: [{ required: true, message: '请输入员工编码' }]
      },
      activeName: 'first',
      columns1: [
        { label: 'ID', prop: 'id' },
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        { label: '学习金额度', prop: 'tutje' },
        { label: '已缴纳额度', prop: 'tutjeCom' },
        { label: '已退还额度', prop: 'tutjeTh' },
        {
          label: '缴纳状态',
          prop: 'status',
          render: row => {
            if (row.status == 1) {
              return '正常'
            } else if (row.status == 2) {
              return '停缴'
            } else {
              return row.status
            }
          }
        },
        {
          label: '数据状态',
          prop: 'isDel',
          render: row => {
            if (row.isDel == 1) {
              return '无效'
            } else if (row.isDel == 0) {
              return '有效'
            } else {
              return row.isDel
            }
          }
        },
        { label: '创建人', prop: 'createdBy', width: '100px' },
        { label: '创建时间', prop: 'createdTime', width: '150px' },
        { label: '修改人', prop: 'updatedBy', width: '100px' },
        { label: '修改时间', prop: 'updatedTime', width: '150px' }
      ],
      columns2: [
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        {
          label: '原状态',
          prop: 'beStatus',
          render: row => {
            if (row.beStatus == 1) {
              return '在职'
            } else if (row.beStatus == 2) {
              return '离职'
            } else if (row.beStatus == 3) {
              return '长假'
            } else {
              return row.beStatus
            }
          }
        },
        {
          label: '新状态',
          prop: 'afStatus',
          render: row => {
            if (row.afStatus == 1) {
              return '在职'
            } else if (row.afStatus == 2) {
              return '离职'
            } else if (row.afStatus == 3) {
              return '长假'
            } else {
              return row.afStatus
            }
          }
        },
        {
          label: '离职原因',
          prop: 'maintenanceLeave',
          render: row => {
            if (row.maintenanceLeave == '01') {
              return '正常离职'
            } else if (row.maintenanceLeave == '02') {
              return '无业绩离职'
            } else if (row.maintenanceLeave == '03') {
              return '分店报离'
            } else {
              return row.maintenanceLeave
            }
          }
        },
        { label: '变动日期', prop: 'changeDate', width: '150px' },
        { label: '创建人', prop: 'createdBy', width: '100px' },
        { label: '创建时间', prop: 'createdTime', width: '150px' }
      ],
      columns3: [
        { label: '学习金方案ID', prop: 'salId' },
        { label: '员工编码', prop: 'eeCode' },
        { label: '员工姓名', prop: 'eeName' },
        { label: '改变前金额', prop: 'betutje' },
        { label: '改变前已交', prop: 'betutjeCom' },
        { label: '缴纳金额', prop: 'xxj' },
        { label: '改变后金额', prop: 'aftutje' },
        { label: '改变后已交', prop: 'aftutjeCom' },
        { label: '变动日期', prop: 'updatedTime', width: '150px' },
        { label: '备注', prop: 'remark' }
      ],
      tableData1: [],
      tableData2: [],
      tableData3: []
    }
  },
  methods: {
    onSearch() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.queryList1()
          this.queryList2()
          this.queryList3()
        }
      })
    },
    async queryList1() {
      const { data } = await service.salaryPlan.adjust.queryEmployeesal({
        eeCode: this.info.eeCode
      })
      this.tableData1 = data
    },
    async queryList2() {
      const params = {
        approvalStatus: 2,
        eeCode: this.info.eeCode,
        isDel: 0
      }
      params.limit = this.$refs.table2.Pagination.internalPageSize
      const fetch = service.staff.status.list
      this.$refs.table2.reloadData({
        fetch,
        params
      })
    },
    async queryList3() {
      const params = {
        eeCode: this.info.eeCode
      }
      params.limit = this.$refs.table3.Pagination.internalPageSize
      const fetch = service.studyFund.query.eexxjlogList
      this.$refs.table3.reloadData({
        fetch,
        params
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
