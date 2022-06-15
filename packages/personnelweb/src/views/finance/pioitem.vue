<template>
  <div>
    <el-collapse-transition>
      <div v-show="transactionShow">
        <el-row>
          <el-button @click="backP(true)" type="primary">添加</el-button>
        </el-row>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="elsearchPForm" inline :model="searchPForm">
          <el-form-item label="项目描述：" prop="name">
            <el-input
              v-model="searchPForm.name"
              style="width: 150px"></el-input>
          </el-form-item>

          <el-form-item label="类型：" prop="type">
            <el-select
              v-model="searchPForm.type"
              clearable
              placeholder="请选择">
              <el-option label="收入" value="1"></el-option>
              <el-option label="支出" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="searchPForm.status"
              clearable
              placeholder="请选择">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="searchP" type="primary">查询</el-button>
            <el-button @click="restP" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
        <yid-table
          pagination
          ref="elTable"
          :data="jobData"
          style="margin-top: 15px"
          :row-class-name="$yid.util.getTableClass">
          <yid-table-column
            label="收支项目编码"
            min-width="100"
            prop="code"></yid-table-column>
          <yid-table-column
            label="收支项目描述"
            min-width="150"
            prop="name"></yid-table-column>
          <yid-table-column label="收支项目类型" min-width="150" prop="type">
            <template slot-scope="scope">
              {{ scope.row.type == 1 ? '收入' : '支出' }}
            </template>
          </yid-table-column>
          <yid-table-column label="状态" min-width="50" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">正常</span>
              <span v-if="scope.row.status == 0" style="color: red">停用</span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="备注"
            min-width="250"
            prop="memo"></yid-table-column>
          <yid-table-column label="操作" min-width="150" prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="toEditP(scope.row)">编辑</el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!transactionShow">
        <el-button @click="backP(false)" type="primary">返回</el-button>
        <el-button @click="save" type="primary">保存</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>

        <el-form ref="elPioitemForm" :model="pioitem" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                label="收支项目编码："
                prop="code"
                :rules="[{ required: true, message: '收支项目编号为空' }]">
                {{ pioitem.code }}
              </el-form-item>
              <el-form-item
                label="收支项目类型："
                prop="type"
                :rules="[{ required: true, message: '请选择收支项目类型' }]">
                <el-select
                  value-key="id"
                  placeholder="请选择"
                  v-model.trim="pioitem.type">
                  <el-option label="收入" value="1"></el-option>
                  <el-option label="支出" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="收支项目名称："
                prop="name"
                :rules="[{ required: true, message: '收支项目名称为空' }]">
                <el-input v-model="pioitem.name"></el-input>
              </el-form-item>

              <el-form-item
                label="状态："
                prop="status"
                :rules="[{ required: true, message: '请选择状态' }]">
                <el-select
                  value-key="id"
                  placeholder="请选择"
                  v-model.trim="pioitem.status">
                  <el-option label="正常" value="1"></el-option>
                  <el-option label="停用" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注：" prop="memo">
                <el-input v-model="pioitem.memo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: 'pioitem',
  data() {
    return {
      transactionShow: true,
      searchPForm: { name: '', type: '', status: '' },
      pageInfo: { page: 1, limit: 10 },
      pioitem: { id: '', code: '', name: '', type: '', status: '', memo: '' }
    }
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    searchP() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs['elTable'].Pagination.internalPageSize
      const fetch = $yid.service.finance.pioitem.page
      const params = { ...this.pageInfo, ...this.searchPForm }
      this.$refs['elTable'].reloadData({
        fetch,
        params
      })
    },
    restP() {
      this.$refs['elsearchPForm'].resetFields()
    },
    toEditP(row) {
      this.pioitem = row
      this.transactionShow = !this.transactionShow
    },
    backP(tag) {
      this.pioitem = {
        id: '',
        code: '',
        name: '',
        type: '',
        status: '',
        memo: ''
      }
      if (tag) {
        $yid.service.finance.pioitem.nextCode().then(res => {
          if (res.resp_code == 200) this.pioitem.code = res.data
          this.transactionShow = !this.transactionShow
        })
      } else {
        this.transactionShow = !this.transactionShow
      }
    },
    save() {
      this.$refs['elPioitemForm'].validate(valid => {
        if (valid) {
          $yid.service.finance.pioitem.save(this.pioitem).then(res => {
            if (res.resp_code == 200) {
              $yid.util.success(res.resp_msg)
              this.backP()
              this.searchP()
            } else {
              $yid.util.error(res.resp_msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
