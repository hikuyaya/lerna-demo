<!--
 * @Author: wqy
 * @Date: 2022-06-15 17:09:48
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 14:33:44
 * @FilePath: \personnelweb\src\views\base\group\group.vue
 * @Description: 
-->
<template>
  <div>
    <div class="container">
      <div class="left-side">
        <left-tree :treeData="treeData" />
      </div>
      <div class="right-content">
        <search-top ref="searchTop" :options="conditions">
          <template #inlineBtn>
            <div class="flex flex-alignitems__center mg-l-12">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onAdd">新增</el-button>
            </div>
          </template>
        </search-top>
        <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
          <yid-table-column label="机构编码" prop="code"> </yid-table-column>
          <yid-table-column label="机构名称" prop="name">
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.name
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="上级机构"
            prop="parentName"></yid-table-column>
          <yid-table-column
            label="机构电话"
            prop="telephone"></yid-table-column>
          <yid-table-column label="负责人" prop="director"></yid-table-column>
          <yid-table-column label="状态" prop="status">
            <template slot-scope="scope">
              {{
                scope.row.status === '1'
                  ? '正常'
                  : scope.row.status === '2'
                  ? '停用'
                  : '未知'
              }}
            </template>
          </yid-table-column>
          <yid-table-column label="是否子公司" prop="isCompany">
            <template slot-scope="scope">
              {{
                scope.row.isCompany === 1
                  ? '是'
                  : scope.row.isCompany === 0
                  ? '否'
                  : '未知'
              }}
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
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
        ref="addCompRef"
        v-if="addCompVisible"
        :operateType="operateType"
        :value="selectRow"
        :treeData="treeData" />
      <span v-if="operateType === 'detail'" slot="footer" class="dialog-footer">
        <el-button @click="onCancel">关 闭</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import AddComp from './components/AddComp.vue'
import LeftTree from './components/LeftTree.vue'
import service from '@src/service'
export default {
  components: { SearchTop, AddComp, LeftTree },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '机构编码', // 标签
          prop: 'code', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '机构名称',
          prop: 'name',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select',
          options: [
            { label: '所有', value: '' },
            { label: '正常', value: '1' },
            { label: '停用', value: '2' }
          ],
          width: '20%'
        },
        {
          label: '是否子公司',
          labelWidth: '1.2rem',
          prop: 'isCompany',
          type: 'select',
          options: [
            { label: '不限', value: '' },
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ],
          width: '20%'
        }
      ],
      tableData: [],
      treeData: []
    }
  },
  created() {
    this.queryGroupTree()
  },
  mounted() {
    this.queryGroupList()
  },
  methods: {
    async queryGroupTree() {
      const { data, resp_code } = await service.chain.region.treeAll({})
      if (resp_code !== 200) {
        return
      }
      this.treeData = data
    },
    queryGroupList() {
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
      const fetch = service.base.group.list
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
      const info = await this.$refs.addCompRef.getData()
      if (!info) {
        return
      }
      const { resp_code } = await service.chain.region.saveRegion(info)
      if (resp_code !== 200) {
        return
      }
      this.$message.success('操作成功！')
      this.addCompVisible = false
      // 刷新左侧机构树
      this.queryGroupTree()
      // 刷新机构列表
      this.queryGroupList()
    },
    onCancel(row) {
      this.addCompVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  height: 100%;
  .left-side {
    width: 2.8rem;
    padding-right: 0.12rem;
    border-right: 1px solid #dcdfe6;
    overflow: scroll;
  }
  .right-content {
    width: calc(100% - 2.8rem);
    padding-left: 0.12rem;
  }
}
</style>
