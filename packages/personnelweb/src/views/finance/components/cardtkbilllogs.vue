<template>
  <div class="billlogs" v-if="logDialog.visible">
    <el-dialog
      v-if="logDialog.visible"
      :title="logDialog.title"
      :visible.sync="logDialog.visible"
      width="500px"
      center
      :close-on-click-modal="false">
      <yid-table :data="billlogs" height="400">
        <yid-table-column
          label="修改时间"
          min-width="140"
          prop="updatedTime"></yid-table-column>
        <yid-table-column
          label="修改人"
          min-width="90"
          prop="updatedBy"></yid-table-column>
        <yid-table-column
          label="操作内容"
          min-width="120"
          prop="content"></yid-table-column>
        <yid-table-column label="状态变更" min-width="100" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">未审核</span>
            <span v-if="scope.row.status == 2">已提交</span>
            <span v-if="scope.row.status == 3">客服已审核</span>
            <span v-if="scope.row.status == 4">财务已复核</span>
            <span v-if="scope.row.status == 5">已驳回</span>
            <span v-if="scope.row.status == 9">已作废</span>
          </template>
        </yid-table-column>
      </yid-table>
    </el-dialog>
  </div>
</template>
<script>
import yid from '@src/library'
export default {
  name: 'billlogs',
  data() {
    return {
      logDialog: {
        title: '变更记录',
        visible: false
      },
      billlogs: []
    }
  }
}
</script>
<style lang="scss" scoped></style>
