<template>
  <div class="salaryRewardDetail">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="">
            <el-button @click="addCooperate" type="primary">新增</el-button>
          </el-form-item>
          <br />
          <el-form-item label="项目编码：" prop="code">
            <el-input
              clearable
              v-model="searchForm.code"
              placeholder="项目编码"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：" prop="code">
            <el-input
              clearable
              v-model="searchForm.name"
              placeholder="项目名称"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 10px">
          <yid-table-column
            prop="code"
            label="项目编号"
            width="120"></yid-table-column>
          <yid-table-column
            prop="name"
            label="项目名称"
            width="250"></yid-table-column>
          <yid-table-column
            prop="shoprate"
            label="门店业绩扣减比率"
            width="150"></yid-table-column>
          <yid-table-column
            prop="ygrate"
            label="员工业绩扣减比率"
            width="150"></yid-table-column>
          <yid-table-column prop="memo" label="备注" width="300">
          </yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="editAction(scope.row)"
                >编辑</el-link
              >
              <!--<el-link type="primary" @click="deleteAction(scope.row)" style="margin-left: 15px">删除</el-link>-->
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button @click="saveAction" type="primary">保存</el-button>
        <el-form
          ref="cooperateForm"
          :model="cooperateForm"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <el-form-item label="项目编码：" prop="code" label-width="150px">
            <el-input
              v-model="cooperateForm.code"
              placeholder="自动生成"
              disabled="true"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="项目名称："
            prop="name"
            label-width="150px"
            :rules="[{ required: true, message: '项目名称不能为空' }]">
            <el-input
              v-model="cooperateForm.name"
              placeholder="项目名称"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="门店业绩扣减比率："
            prop="shoprate"
            label-width="150px"
            :rules="[{ required: true, message: '门店业绩扣减比率不能为空' }]">
            <el-input
              v-model="cooperateForm.shoprate"
              @blur="checkShopRate()"
              placeholder="门店业绩扣减比率"
              style="width: 200px"></el-input
            >（输入范围：0-100）
          </el-form-item>
          <el-form-item
            label="员工业绩扣减比率："
            prop="ygrate"
            label-width="150px"
            :rules="[{ required: true, message: '员工业绩扣减比率不能为空' }]">
            <el-input
              v-model="cooperateForm.ygrate"
              @blur="checkYgRate()"
              placeholder="员工业绩扣减比率"
              style="width: 200px"></el-input
            >（输入范围：0-100）
          </el-form-item>
          <el-form-item label="备注：" prop="name" label-width="150px">
            <el-input
              v-model="cooperateForm.memo"
              type="textarea"
              :rows="2"
              style="width: 300px; resize: none"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import ElButton from '../../library/components/button/button'

export default {
  components: { ElButton },
  name: 'diccooperate',
  data() {
    return {
      pageInfo: { page: 1, limit: 10, isDel: '0' },

      searchForm: {
        code: '',
        name: ''
      },
      cooperateForm: {
        id: '',
        code: '',
        name: '',
        shoprate: '',
        ygrate: '',
        memo: ''
      },
      showList: true,
      rules: {}
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    getData(reqParams) {
      const fetch = service.finance.diccooperate.list
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchForm)
    },
    getDataNoChangePage(reqParams) {
      const fetch = service.finance.diccooperate.list
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadDataNoChangePage({
        fetch,
        params
      })
    },
    searchNoChangePage() {
      this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getDataNoChangePage(this.searchForm)
    },
    back() {
      this.$refs['cooperateForm'].resetFields()
      this.cooperateForm.id = ''
      this.cooperateForm.memo = ''
      this.showList = true
    },
    addCooperate() {
      this.$refs['cooperateForm'].resetFields()
      this.cooperateForm.id = ''
      this.cooperateForm.memo = ''
      this.showList = false
    },
    saveAction() {
      this.$refs['cooperateForm'].validate(valid => {
        if (valid) {
          if (!yid.util.isEmpty(this.cooperateForm.shoprate)) {
            if (!this.isNumber(this.cooperateForm.shoprate)) {
              yid.util.error(
                '门店业绩扣减比率必须输入整数或小数点后2位之内小数'
              )
              return
            }
            if (
              Number(this.cooperateForm.shoprate) < 0 ||
              Number(this.cooperateForm.shoprate) > 100
            ) {
              yid.util.error('门店业绩扣减比率必须输入0-100的数字')
              return
            }
          }

          if (!yid.util.isEmpty(this.cooperateForm.ygrate)) {
            if (!this.isNumber(this.cooperateForm.ygrate)) {
              yid.util.error(
                '员工业绩业绩扣减比率必须输入整数或小数点后2位之内小数'
              )
              return
            }
            if (
              Number(this.cooperateForm.ygrate) < 0 ||
              Number(this.cooperateForm.ygrate) > 100
            ) {
              yid.util.error('员工业绩扣减比率必须输入0-100的数字')
              return
            }
          }

          service.finance.diccooperate.save(this.cooperateForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('保存成功')
              this.showList = true
              if (yid.util.isEmpty(this.cooperateForm.id)) {
                this.search()
              } else {
                this.searchNoChangePage()
              }
            } else {
              yid.util.error('保存失败')
            }
          })
        }
      })
    },
    editAction(row) {
      this.cooperateForm.id = row.id
      this.cooperateForm.code = row.code
      this.cooperateForm.name = row.name
      this.cooperateForm.shoprate = row.shoprate
      this.cooperateForm.ygrate = row.ygrate
      this.cooperateForm.memo = row.memo
      this.showList = false
    },
    deleteAction(row) {
      yid.util.confirm(
        '您确定要删除[' + row.name + ']的合作方项目?',
        '',
        '',
        () => {
          row.isDel = '1'
          service.finance.diccooperate.save(row).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('更新成功')
              this.search()
            } else {
              yid.util.error('更新失败')
            }
          })
        }
      )
    },
    isNumber(val) {
      if (yid.validate.pNumerical2(val)) {
        return true
      } else {
        return false
      }
    },
    checkShopRate() {
      let rate = this.cooperateForm.shoprate
      if (!yid.util.isEmpty(rate)) {
        if (!this.isNumber(rate)) {
          yid.util.error('请输入小数点后两位以内的正数!')
          this.cooperateForm.shoprate = ''
          return
        }

        if (
          Number(this.cooperateForm.shoprate) >= 100 ||
          Number(this.cooperateForm.shoprate) <= 0
        ) {
          yid.util.error('门店业绩扣减比率必须为大于0小于100的正数!')
          this.cooperateForm.shoprate = ''
          return
        }
      }
    },
    checkYgRate() {
      let rate = this.cooperateForm.ygrate
      if (!yid.util.isEmpty(rate)) {
        if (!this.isNumber(rate)) {
          yid.util.error('请输入小数点后两位以内的正数!')
          this.cooperateForm.ygrate = ''
          return
        }

        if (
          Number(this.cooperateForm.ygrate) >= 100 ||
          Number(this.cooperateForm.ygrate) <= 0
        ) {
          yid.util.error('员工业绩扣减比率必须为大于0小于100的正数!')
          this.cooperateForm.ygrate = ''
          return
        }
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
