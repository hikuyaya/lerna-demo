<template>
  <div>
    <el-collapse-transition>
      <div v-show="listShow">
        <el-button @click="showAddDialog(null)" type="primary">新增</el-button>
        <el-form
          ref="searchForm"
          inline
          :model="searchForm"
          style="margin-top: 16px">
          <el-form-item label="模板：">
            <el-input
              clearable
              v-model="searchForm.pcodename"
              placeholder="方案编码/方案名称"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table pagination ref="table">
          <yid-table-column
            label="编码"
            min-width="100"
            prop="code"></yid-table-column>
          <yid-table-column
            label="模板名称"
            min-width="100"
            prop="name"></yid-table-column>
          <yid-table-column
            label="备注"
            min-width="100"
            prop="memo"></yid-table-column>
          <yid-table-column label="操作" min-width="100" prop="memname">
            <template slot-scope="scope" fixed="right">
              <el-link type="primary" @click="showAddDialog(scope.row)"
                >编辑</el-link
              >
              <el-link
                type="primary"
                @click="showSetting(scope.row)"
                style="margin-left: 6px"
                >设置模板</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!listShow">
        <PaySetting ref="paySettingPage" @onClose="closePaySettingPage" />
      </div>
    </el-collapse-transition>
    <el-dialog
      :title="addTemplateDialog.title"
      :visible.sync="addTemplateDialog.visible"
      width="450px">
      <el-form
        ref="templateForm"
        inline
        :model="templateForm"
        label-width="140px">
        <el-form-item label="模板编号:" prop="code">
          {{ templateForm.code
          }}<explain style="color: silver">编号从001开始自动叠加</explain>
        </el-form-item>
        <el-form-item
          label="模板名称："
          prop="name"
          :rules="[{ required: true, message: '模板名称不能为空' }]">
          <el-input
            clearable
            v-model="templateForm.name"
            placeholder="模板名称"
            style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="memo">
          <el-input
            v-model="templateForm.memo"
            type="textarea"
            :rows="3"
            placeholder="请填写" />
        </el-form-item>
        <el-form-item label="  ">
          <el-button @click="saveTemplate" type="primary">保存</el-button>
          <el-button @click="closeAddDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import PaySetting from './components/paySetting'
export default {
  name: 'paymentConfig',
  components: {
    PaySetting
  },
  data() {
    return {
      searchForm: {
        pcodename: ''
      },
      templateForm: {
        code: '',
        memo: '',
        name: '',
        id: null
      },
      listShow: true,
      addTemplateDialog: {
        title: '新增付款模板',
        visible: false
      },
      pageInfo: { page: 1, limit: 10 }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    closePaySettingPage() {
      this.listShow = true
    },
    showSetting(row) {
      this.listShow = false
      this.$refs.paySettingPage.initData(row)
    },
    getData(reqParams) {
      const fetch = service.chain.payThead.list
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    showAddDialog(data) {
      if (this.$refs['templateForm'] !== undefined) {
        this.$refs['templateForm'].resetFields()
      }

      if (data == null) {
        this.addTemplateDialog.title = '新增付款模板'
        this.templateForm.isAdd = true
        this.templateForm.code = ''
        this.templateForm.memo = ''
        this.templateForm.name = ''
        this.templateForm.id = ''
      } else {
        this.templateForm.code = data.code
        this.templateForm.memo = data.memo
        this.templateForm.name = data.name
        this.templateForm.id = data.id
        this.templateForm.isAdd = false

        this.addTemplateDialog.title = '编辑付款模板'
      }
      this.addTemplateDialog.visible = true
    },
    closeAddDialog() {
      this.addTemplateDialog.visible = false
    },
    saveTemplate() {
      this.$refs['templateForm'].validate(valid => {
        if (valid) {
          let reqParam = {}
          reqParam.code = this.templateForm.code
          reqParam.name = this.templateForm.name
          reqParam.memo = this.templateForm.memo
          if (!this.templateForm.isAdd) {
            reqParam.id = this.templateForm.id
          }

          service.chain.payThead.saveOrUpdate(reqParam).then(res => {
            if (res.resp_code == 200) {
              this.pageInfo = { page: 1, limit: 10 }
              this.getData(this.searchForm)
              this.addTemplateDialog.visible = false
            } else {
              $yid.util.error('新增失败，重新操作!')
              return
            }
          })
        }
      })
    },
    search() {
      this.pageInfo = { page: 1, limit: 10 }
      this.getData(this.searchForm)
    }
  }
}
</script>

<style scoped></style>
