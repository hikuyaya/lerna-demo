<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:02:15
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-21 17:34:47
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
        <yid-table-column label="编码" prop="eeName" width="100px">
        </yid-table-column>
        <yid-table-column
          label="名称"
          prop="idCard"
          width="150px"></yid-table-column>
        <yid-table-column label="输入类型" prop="eeCode"></yid-table-column>
        <yid-table-column label="计算类型" prop="eeCode"></yid-table-column>
        <yid-table-column label="薪酬分组" prop="eeCode"></yid-table-column>
        <yid-table-column label="备注" prop="eeCode"></yid-table-column>
        <yid-table-column label="状态" prop="status" width="70px">
          <template slot-scope="scope">
            {{
              scope.row.status == 1
                ? '正常'
                : scope.row.status == 2
                ? '停用'
                : '其他'
            }}
          </template>
        </yid-table-column>
        <yid-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
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
          label: '编码', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          labelWidth: '0.8rem',
          width: '15%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '名称',
          prop: 'eeCode',
          type: 'input', // 搜索类型
          width: '15%',
          labelWidth: '0.8rem'
        },
        {
          label: '状态',
          prop: 'type3',
          type: 'select',
          labelWidth: '0.8rem',
          options: [
            { label: '所有', value: '' },
            { label: '正常', value: '1' },
            { label: '停用', value: '2' }
          ],
          width: '10%'
        },
        {
          label: '输入类型',
          prop: 'type',
          type: 'select',
          labelWidth: '1rem',
          options: [
            { label: '所有', value: '' },
            { label: '固定项', value: '1' },
            { label: '输入项', value: '2' },
            { label: '提成项', value: '3' }
          ],
          width: '12%'
        },
        {
          label: '计算类型',
          prop: 'type1',
          type: 'select',
          labelWidth: '1rem',
          options: [
            { label: '所有', value: '' },
            { label: '增项', value: '1' },
            { label: '减项', value: '2' },
            { label: '非计算项', value: '3' }
          ],
          width: '12%'
        },
        {
          label: '薪酬分组',
          prop: 'type2',
          type: 'select',
          labelWidth: '1rem',
          options: [
            { label: '所有', value: '' },
            { label: '基本工资', value: '1' },
            { label: '奖金', value: '2' },
            { label: '提成', value: '3' },
            { label: '工服补款', value: '4' },
            { label: '个人扣税', value: '5' },
            { label: '工资罚款', value: '6' },
            { label: '工资扣款', value: '7' }
          ],
          width: '12%'
        }
      ],
      tableData: []
    }
  },
  mounted() {
    // this.queryList()
  },
  methods: {
    queryList() {
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
      // 身份证号转大写
      params.idCard = params.idCard?.toUpperCase()
      params.isDel = 0
      params.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.staff.black.list
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
      await service.staff.black.save(result)
      this.$message.success('操作成功')
      this.addCompVisible = false
      // 刷新列表
      this.queryList()
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
