<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:14:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 17:03:10
 * @FilePath: \personnelweb\src\views\salary-setting\special-time\specialTime.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onBatch">批量维护</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column label="门店编码" prop="shopCode" width="100px">
        </yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="shopName"
          width="150px"></yid-table-column>
        <yid-table-column label="门店类型" prop="type">
          <template slot-scope="scope">
            {{
              scope.row.type == '1'
                ? '美发门店'
                : scope.row.type == '2'
                ? '美容门店'
                : scope.row.type == '3'
                ? '所有门店'
                : scope.row.type
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="限定申请日"
          prop="salaryDay"></yid-table-column>
        <yid-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="onEdit(scope.row)">修改</el-link>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      :title="operateType === 'batch' ? '批量维护限定申请日' : '修改'"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px">
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType" />
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
          label: '门店编码', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    onBatch() {
      this.operateType = 'batch'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.salarySetting.specialTime.list
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

      this.$confirm(`您确认要保存此修改信息吗？`, `确认保存`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          if (this.operateType === 'edit') {
            await service.salarySetting.specialTime.update(result)
          } else if (this.operateType === 'batch') {
            await service.salarySetting.specialTime.batchUpdateShop(result)
          }
          this.$message.success('操作成功')
          this.addCompVisible = false
          // 刷新列表
          this.queryList()
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
