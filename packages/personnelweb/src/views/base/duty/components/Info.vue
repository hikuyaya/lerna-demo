<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:40:23
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-04 10:37:54
 * @FilePath: \personnelweb\src\views\base\duty\components\Info.vue
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
        <yid-table-column label="职务编码" prop="pscode"></yid-table-column>
        <yid-table-column label="职务名称" prop="name">
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)">{{
              scope.row.psname
            }}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="组织名称" prop="bname"></yid-table-column>
        <yid-table-column label="同步业务组" prop="bbnames"></yid-table-column>
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
        <yid-table-column label="级别操作" prop="name">
          <template slot-scope="scope">
            <el-link
              type="primary"
              class="mg-r-16"
              @click="onShowLevelDetail(scope.row)"
              >查看</el-link
            >
            <el-link type="primary" @click="onShowLevelAdd(scope.row)"
              >维护</el-link
            >
          </template>
        </yid-table-column>
        <yid-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-link type="primary" class="mg-r-16" @click="onEdit(scope.row)"
              >编辑</el-link
            >
            <el-link
              v-if="scope.row.status === '2'"
              type="primary"
              @click="onUpdateStatus(scope.row, 1)"
              >启用</el-link
            >
            <el-link
              v-else-if="scope.row.status === '1'"
              type="primary"
              @click="onUpdateStatus(scope.row, 2)"
              >禁用</el-link
            >
          </template>
        </yid-table-column>
      </yid-table>
    </div>
    <!-- 职务 -->
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
      width="600px">
      <info-add-comp
        v-if="addCompVisible"
        ref="infoAddCompRef"
        :value="selectRow"
        :operateType="operateType" />
      <span v-if="operateType === 'detail'" slot="footer" class="dialog-footer">
        <el-button @click="onCancel">关 闭</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 职务级别 -->
    <el-dialog
      :title="levelOperateType === 'detail' ? '级别详细信息' : '级别维护'"
      :visible.sync="addLevelVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <level-add-comp
        v-if="addLevelVisible"
        ref="levelAddCompRef"
        :value="selectLevelRow"
        :operateType="levelOperateType" />
      <span
        v-if="levelOperateType === 'detail'"
        slot="footer"
        class="dialog-footer">
        <el-button @click="addLevelVisible = false">关 闭</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onLevelSubmit">确 定</el-button>
        <el-button @click="addLevelVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import InfoAddComp from './InfoAddComp'
import LevelAddComp from './LevelAddComp'
// import AddComp from './components/test.vue'
import service from '@src/service'
export default {
  components: { SearchTop, InfoAddComp, LevelAddComp },
  data() {
    return {
      addCompVisible: false,
      addLevelVisible: false,
      operateType: 'add',
      levelOperateType: 'add',
      selectRow: {},
      selectLevelRow: {},
      conditions: [
        {
          label: '职务编码', // 标签
          prop: 'pscode', // 绑定的字段
          // label宽度
          type: 'input',
          width: '16%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '职务名称',
          prop: 'psname',
          type: 'input', // 搜索类型
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
      total: 0
    }
  },
  mounted() {
    this.queryPositionList()
  },
  methods: {
    queryPositionList() {
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
      const fetch = service.base.duty.list
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
      const result = await this.$refs.infoAddCompRef.getData()
      if (!result) {
        return
      }
      this.$confirm(
        `您确认${operateType === 'add' ? '新增' : '修改'}此条职务信息吗？`,
        `确认${operateType === 'add' ? '新增' : '修改'}`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          await service.base.duty.saveOrUpdate(result)
          this.$message.success('操作成功')
          this.addCompVisible = false
          // 刷新列表
          this.queryPositionList()
        })
        .catch(() => {})
    },
    onCancel(row) {
      this.addCompVisible = false
    },
    onShowLevelDetail(row) {
      this.selectLevelRow = row
      this.levelOperateType = 'detail'
      this.addLevelVisible = true
    },
    onShowLevelAdd(row) {
      this.selectLevelRow = row
      this.levelOperateType = 'add'
      this.addLevelVisible = true
    },
    async onLevelSubmit() {
      const {
        success,
        data: { positionLevel1List, positionLevelList }
      } = this.$refs.levelAddCompRef.getData()
      if (!success) {
        return
      }
      this.$confirm('是否保存数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          this.addLevelVisible = false
          const params = {
            psid: this.selectLevelRow.id,
            positionLevel1List,
            positionLevelList
          }
          await service.base.duty.positionLevelOperate(params)
          this.$message.success('操作成功')
        })
        .catch(() => {})
    },
    async onUpdateStatus(row, status) {
      this.$yid.util.confirm(
        `你确定要${status === 1 ? '启用' : '禁用'} ${row.psname} 职务吗？`,
        '',
        '',
        async () => {
          const { resp_code } = await service.base.duty.updateStatus({
            bbids: row.bbids,
            id: row.id,
            psname: row.psname,
            status
          })
          this.$yid.util.success('操作成功')
          // 更新列表
          this.queryPositionList()
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  height: 100%;
  .content {
    flex: 1;
  }
}
</style>
