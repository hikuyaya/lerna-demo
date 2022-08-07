<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:02:15
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 11:38:37
 * @FilePath: \personnelweb\src\views\salary-setting\composition\composition.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="编码" prop="scCode" width="100px">
        </yid-table-column>
        <yid-table-column
          label="名称"
          prop="scName"
          width="150px"></yid-table-column>
        <yid-table-column label="输入类型" prop="inputType">
          <template slot-scope="scope">
            {{
              scope.row.inputType == 1
                ? '固定项'
                : scope.row.inputType == 2
                ? '输入项'
                : scope.row.inputType == 3
                ? '提成项'
                : scope.row.inputType
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="计算类型" prop="signType">
          <template slot-scope="scope">
            {{
              scope.row.signType == 1
                ? '增项'
                : scope.row.signType == -1
                ? '减项'
                : scope.row.signType == 0
                ? '非计算项'
                : scope.row.signType
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="薪酬分组" prop="csgCode">
          <template slot-scope="scope">
            {{ transCsgCode(scope.row.csgCode) }}
          </template>
        </yid-table-column>
        <yid-table-column label="备注" prop="remark"></yid-table-column>
        <!-- <yid-table-column label="状态" prop="status" width="70px">
          <template slot-scope="scope">
            {{
              scope.row.status == 1
                ? '正常'
                : scope.row.status == 2
                ? '停用'
                : '其他'
            }}
          </template>
        </yid-table-column> -->
        <yid-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
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
      width="800px">
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType"
        :salcompData="salcompData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="addCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '编码', // 标签
          prop: 'scCode', // 绑定的字段
          // label宽度
          type: 'input',
          labelWidth: '0.8rem',
          width: '15%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '名称',
          prop: 'scName',
          type: 'input', // 搜索类型
          width: '15%',
          labelWidth: '0.8rem'
        },
        // {
        //   label: '状态',
        //   prop: 'status',
        //   type: 'select',
        //   labelWidth: '0.8rem',
        //   options: [
        //     { label: '所有', value: '' },
        //     { label: '正常', value: '1' },
        //     { label: '停用', value: '2' }
        //   ],
        //   width: '12%'
        // },
        {
          label: '输入类型',
          prop: 'inputType',
          type: 'select',
          labelWidth: '1rem',
          options: [
            { label: '所有', value: '' },
            { label: '固定项', value: '1' },
            { label: '输入项', value: '2' },
            { label: '提成项', value: '3' }
          ],
          width: '14%'
        },
        {
          label: '计算类型',
          prop: 'signType',
          type: 'select',
          labelWidth: '1rem',
          options: [
            { label: '所有', value: '' },
            { label: '增项', value: '1' },
            { label: '减项', value: '-1' },
            { label: '非计算项', value: '0' }
          ],
          width: '14%'
        },
        {
          label: '薪酬分组',
          prop: 'csgCode',
          type: 'select',
          labelWidth: '1rem',
          options: [],
          width: '14%'
        }
      ],
      tableData: [],
      salcompData: []
    }
  },
  async mounted() {
    await this.salcompGroup()
    await this.queryList()
  },
  methods: {
    async salcompGroup() {
      const { data } = await service.salarySetting.composition.salcompGroup()
      const salCompData = data.map(v => {
        return {
          label: v.csgName,
          value: v.csgCode
        }
      })
      this.salcompData = salCompData
      const csgCondition = this.conditions.find(v => v.prop === 'csgCode')
      const csgIndex = this.conditions.findIndex(v => v.prop === 'csgCode')
      this.$set(this.conditions, csgIndex, {
        ...csgCondition,
        options: salCompData
      })
      await this.$nextTick()
      console.log(this.conditions)
    },
    transCsgCode(csgCode) {
      return this.salcompData.find(v => csgCode == v.value)?.label || ''
    },
    queryList() {
      this.onSearch()
    },
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salarySetting.composition.list
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
    onShowDetail(row) {
      this.selectRow = row
      this.operateType = 'detail'
      this.addCompVisible = true
    },
    async onSubmit() {
      const result = await this.$refs.addCompRef.getData()
      if (!result) {
        return
      }

      this.$confirm(`您确认要保存此信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          await service.salarySetting.composition.save(result)
          this.$message.success('操作成功')
          this.addCompVisible = false
          // 刷新列表
          await this.queryList()
        })
        .catch(() => {})
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
