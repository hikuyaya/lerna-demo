<template>
  <div class="dicBank">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="">
            <el-button @click="addReserve" type="primary">新增</el-button>
          </el-form-item>
          <br />
          <el-form-item label="开户行编码：" prop="code">
            <el-input
              clearable
              v-model="searchForm.code"
              placeholder="编码"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="开户行名称：" prop="bank">
            <el-input
              clearable
              v-model="searchForm.bank"
              placeholder="名称"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 10px">
          <yid-table-column
            prop="code"
            label="开户行编号"
            width="300"></yid-table-column>
          <yid-table-column
            prop="bank"
            label="开户行名称"
            width="400"></yid-table-column>
          <yid-table-column prop="status" label="状态" width="200">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="2"
                inactive-color="#DCDFE6"
                @change="updateStatus(scope.row)">
              </el-switch>
            </template>
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
          ref="bankForm"
          :model="bankForm"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <el-form-item label="开户行编码：" prop="code" label-width="150px">
            <el-input
              v-model="bankForm.code"
              clearable
              placeholder="编码自动生成"
              disabled="disabled"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="开户行名称："
            prop="bank"
            label-width="150px"
            :rules="[{ required: true, message: '名称不能为空' }]">
            <el-input
              v-model="bankForm.bank"
              placeholder="名称"
              @blur="checkBank"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="状态："
            prop="status"
            label-width="150px"
            :rules="[{ required: true, message: '状态不能为空' }]">
            <el-select
              style="width: 200px"
              v-model="bankForm.status"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
  name: 'dicBank',
  data() {
    return {
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      searchForm: {
        code: '',
        bank: ''
      },
      bankForm: {
        id: '',
        code: '',
        bank: '',
        status: '1'
      },
      statusList: [
        {
          value: '1',
          label: '正常'
        },
        {
          value: '2',
          label: '停用'
        }
      ],
      showList: true,
      rules: {}
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    getData(reqParams) {
      const fetch = service.finance.dicBank.list
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
      const fetch = service.finance.dicBank.list
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
      this.$refs['bankForm'].resetFields()
      this.bankForm.id = ''
      this.showList = true
    },
    addReserve() {
      this.$refs['bankForm'].resetFields()
      this.bankForm.id = ''
      this.bankForm.status = '1'
      this.showList = false
    },
    checkBank() {
      let bank = this.bankForm.bank
      if (!yid.util.isEmpty(bank)) {
        //通过code查询是否存在项目，存在则清空code,提示已经存在
        service.finance.dicBank
          .listAll({ bank: bank, isDel: '0' })
          .then(res => {
            if (res.resp_code == 200) {
              if (res.data.length > 0) {
                const bankObj = res.data[0]
                if (bankObj.code != this.bankForm.code) {
                  this.bankForm.bank = ''
                  yid.util.error(
                    '名称为:[' + bankObj.bank + ']的开户行已存在请重新输入!'
                  )
                }
              }
            } else {
              this.bankForm.bank = ''
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    saveAction() {
      this.$refs['bankForm'].validate(valid => {
        if (valid) {
          service.finance.dicBank.save(this.bankForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('保存成功')
              this.showList = true
              if (yid.util.isEmpty(this.bankForm.id)) {
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
      this.bankForm.id = row.id
      this.bankForm.code = row.code
      this.bankForm.bank = row.bank
      this.bankForm.status = row.status
      this.showList = false
    },
    deleteAction(row) {
      yid.util.confirm(
        '您确定要删除[' + row.bank + ']的开户行吗?',
        '',
        '',
        () => {
          row.isDel = '1'
          service.finance.dicBank.save(row).then(res => {
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
    updateStatus(row) {
      service.finance.dicBank.save(row).then(res => {
        if (res.resp_code == 200) {
          this.searchNoChangePage()
        } else {
          yid.util.error('更新失败')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
