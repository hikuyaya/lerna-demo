<!--
 * @Author: wqy
 * @Date: 2022-08-01 15:28:49
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 11:38:11
 * @FilePath: \personnelweb\src\views\study-fund\tag\tag.vue
 * @Description: 学习金标签维护
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
        <yid-table-column label="标签编码" prop="code" width="120px">
        </yid-table-column>
        <yid-table-column
          label="标签名称"
          prop="name"
          width="200px"></yid-table-column>
        <yid-table-column label="计算学习金" prop="isxxj">
          <template slot-scope="scope">
            {{
              scope.row.isxxj == 1
                ? '是'
                : scope.row.isxxj == 0
                ? '否'
                : scope.row.isxxj
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="备注" prop="remark"></yid-table-column>
        <yid-table-column
          label="创建人"
          prop="createdBy"
          width="120px"></yid-table-column>
        <yid-table-column
          label="创建时间"
          prop="createdTime"
          width="150px"></yid-table-column>
        <yid-table-column
          label="修改人"
          prop="updatedBy"
          width="120px"></yid-table-column>
        <yid-table-column
          label="修改时间"
          prop="updatedTime"
          width="150px"></yid-table-column>

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
          label: '标签名称',
          prop: 'name',
          type: 'input', // 搜索类型
          width: '18%'
        },
        {
          label: '计算学习金',
          prop: 'isxxj',
          type: 'select',
          labelWidth: '1.4rem',
          options: [
            { label: '是', value: '1' },
            { label: '否', value: '2' }
          ],
          width: '18%'
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
      const fetch = service.studyFund.tag.list
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
          await service.studyFund.tag.save(result)
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
