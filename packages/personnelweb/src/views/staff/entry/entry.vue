<!--
 * @Author: wqy
 * @Date: 2022-06-15 17:17:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-05 17:20:47
 * @FilePath: \personnelweb\src\views\staff\entry\entry.vue
 * @Description: 门店入职审核
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
        <yid-table-column label="单号" prop="date" fixed>
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDetail(scope.row)"
              >编辑</el-link
            >
          </template>
        </yid-table-column>
        <yid-table-column label="姓名" prop="name" fixed></yid-table-column>
        <yid-table-column label="性别" prop="name" fixed></yid-table-column>
        <yid-table-column label="年龄" prop="name" fixed></yid-table-column>
        <yid-table-column label="职务" prop="name" fixed></yid-table-column>
        <yid-table-column label="手机号" prop="name" fixed></yid-table-column>
        <yid-table-column label="身份证号" prop="name" fixed></yid-table-column>
        <yid-table-column label="机构编码" prop="name"></yid-table-column>
        <yid-table-column label="机构名称" prop="name"></yid-table-column>
        <yid-table-column label="来源" prop="name"></yid-table-column>
        <yid-table-column label="状态" prop="name"></yid-table-column>
        <yid-table-column label="创建人" prop="name"></yid-table-column>
        <yid-table-column label="创建时间" prop="name"></yid-table-column>
        <yid-table-column label="审核人" prop="name"></yid-table-column>
        <yid-table-column label="审核时间" prop="name"></yid-table-column>
        <yid-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <i
                class="el-icon-edit c-pointer font-size-16rem mg-r-8"
                @click="onEdit(scope.row)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <i
                class="el-icon-delete c-pointer font-size-16rem mg-r-8"
                @click="onDelete(scope.row)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="审核" placement="top">
              <i
                class="el-icon-s-check c-pointer font-size-16rem"
                @click="onEdit(scope.row)"></i>
            </el-tooltip>
          </template>
        </yid-table-column>
      </yid-table>
    </div>
    <el-dialog
      :title="operateType === 'add' ? '新增' : '修改'"
      :visible.sync="addCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1040px">
      <staff-profile
        v-if="addCompVisible"
        :value="selectRow"
        :treeData="treeData"
        :educationData="educationData"
        :operateType="operateType"
        @cancel="addCompVisible = false" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import StaffProfile from '@src/components/business/staffProfile/StaffProfile.vue'
// import AddComp from './components/test.vue'
import service from '@src/service'
export default {
  components: { SearchTop, StaffProfile },
  data() {
    return {
      addCompVisible: false,
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '员工姓名', // 标签
          prop: 'text1', // 绑定的字段
          // label宽度
          type: 'input',
          width: '15%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '来源',
          prop: 'text2',
          type: 'select', // 搜索类型
          width: '12%',
          options: [
            { label: '不限', value: '' },
            { label: '总部', value: 1 },
            { label: '门店', value: 2 }
          ]
        },
        {
          label: '手机号',
          prop: 'text3',
          width: '15%'
        },
        {
          label: '身份证',
          prop: 'text4',
          width: '15%'
        },
        {
          label: '机构编码',
          prop: 'text5',
          width: '15%'
        },
        {
          label: '审核状态',
          prop: 'text6',
          type: 'select', // 搜索类型
          width: '15%',
          options: [
            { label: '所有', value: '' },
            { label: '待复核', value: 1 },
            { label: '已复核', value: 2 }
          ]
        }
      ],
      tableData: [],
      treeData: [],
      educationData: []
    }
  },
  created() {
    this.queryGroup()
    this.queryEducation()
  },
  methods: {
    async queryGroup() {
      const { data } = await service.chain.region.treeAll({})
      this.treeData = data
    },
    async queryEducation() {
      const { data } = await service.dic.getEducationList()
      this.educationData = data
    },
    onOpenAdvance() {},
    onAdd() {
      this.operateType = 'add'
      this.selectRow = {}
      this.addCompVisible = true
    },
    onSearch() {
      const params = this.$refs.searchTop.getSearchParams()
      console.log('params', params)
      console.log(123)
    },
    onEdit(row) {
      this.selectRow = row
      this.operateType = 'edit'
      this.addCompVisible = true
    },
    onDelete(row) {},
    onShowDetail(row) {
      this.selectRow = row
      this.operateType = 'detail'
      this.addCompVisible = true
    },
    onSubmit(row) {},
    onCancel(row) {
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
</style>
