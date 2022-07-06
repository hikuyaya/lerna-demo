<!--
 * @Author: wqy
 * @Date: 2022-06-15 17:09:48
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-06 15:42:32
 * @FilePath: \personnelweb\src\views\base\station\station.vue
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
        <yid-table-column label="岗位编码" prop="postCode"> </yid-table-column>
        <yid-table-column label="岗位名称" prop="postName">
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.postName
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="组织编码" prop="bbCode"></yid-table-column>
        <yid-table-column label="组织名称" prop="bbName"></yid-table-column>
        <yid-table-column
          label="职务编码"
          prop="positionCode"></yid-table-column>
        <yid-table-column
          label="职务名称"
          prop="positionName"></yid-table-column>
        <yid-table-column label="状态" prop="status">
          <template slot-scope="scope">
            {{
              scope.row.status == 1
                ? '正常'
                : scope.row.status == 2
                ? '停用'
                : '未知'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-link type="primary" @click="onEdit(scope.row)">修改</el-link>
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
      width="800px">
      <add-comp
        v-if="addCompVisible"
        ref="addCompRef"
        :value="selectRow"
        :operateType="operateType"
        :positionList="positionList"
        :treeData="treeData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
// import AddComp from './components/test.vue'
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
          label: '岗位编码', // 标签
          prop: 'postCode', // 绑定的字段
          // label宽度
          type: 'input',
          width: '16%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '岗位名称',
          prop: 'postName',
          type: 'input', // 搜索类型
          width: '16%'
        },
        {
          label: '职务名称',
          prop: 'psName',
          options: [
            { label: '所有', value: '' },
            { label: '正常', value: 1 },
            { label: '停用', value: 0 }
          ],
          width: '16%'
        },
        {
          label: '组织名称',
          prop: 'reginName',
          width: '16%'
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '所有', value: '' },
            { label: '正常', value: '1' },
            { label: '停用', value: '2' }
          ],
          width: '16%'
        }
      ],
      tableData: [],
      positionList: [],
      treeData: []
    }
  },
  created() {
    this.queryGroup()
    this.queryPositionList()
  },
  mounted() {
    this.queryStationList()
  },
  methods: {
    async queryGroup() {
      const { data, resp_code } =
        await service.chain.shop.getRegionAndShopTree()
      if (resp_code !== 200) {
        return
      }
      this.treeData = data
    },
    async queryPositionList() {
      const { data } = await service.base.duty.list({
        page: 1,
        limit: 1000
      })
      this.positionList = data
    },
    queryStationList() {
      this.onSearch()
    },
    onOpenAdvance() {},
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.base.station.list
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

      this.$confirm(
        `您确认${this.operateType === 'add' ? '新增' : '修改'}此条职务信息吗？`,
        `确认${this.operateType === 'add' ? '新增' : '修改'}`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          if (this.operateType === 'add') {
            await service.base.station.save(result)
          } else {
            await service.base.station.update(result)
          }
          this.$message.success('操作成功')
          this.addCompVisible = false
          // 刷新列表
          this.queryStationList()
        })
        .catch(() => {})
    },
    onCancel() {
      this.addCompVisible = false
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
/deep/ .el-dialog__wrapper {
  // 让treeselect组件下拉项充分展示出来
  .el-dialog__body {
    overflow: visible;
  }
}
</style>
