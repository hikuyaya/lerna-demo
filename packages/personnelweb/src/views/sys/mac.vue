<template>
  <div>
    <el-form :model="searchForm" ref="searchForm" inline>
      <el-form-item label="授权码：">
        <el-input
          clearable
          placeholder="请输入"
          v-model.trim="searchForm.macaddress"
          style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="最近登录时间">
        <el-date-picker
          style="width: 320px"
          v-model="searchForm.logindate"
          value-format="yyyy-MM-dd"
          type="daterange"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期">
        </el-date-picker> </el-form-item
      ><br />
      <el-form-item label="授权状态：">
        <el-select
          clearable
          placeholder="请选择"
          v-model.trim="searchForm.status"
          style="width: 150px">
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          clearable
          placeholder="请输入"
          v-model.trim="searchForm.memo"
          style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="querylist" type="primary">查询</el-button>
        <el-button @click="resetSearchForm" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="showAdd">新增</el-button>
      <el-button @click="batchUpdateStatus('2')">批量停用</el-button>
      <el-button @click="batchUpdateStatus('1')">批量启用</el-button>
    </div>

    <yid-table
      pagination
      ref="macTable"
      style="margin-top: 15px"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <yid-table-column label="授权码" min-width="150" prop="macaddress">
        <template slot-scope="scope">
          <el-link type="primary" @click="showEdit(scope.row)">{{
            scope.row.macaddress
          }}</el-link>
        </template>
      </yid-table-column>
      <yid-table-column
        label="最近登录账户"
        min-width="60"
        prop="lastloginid"></yid-table-column>
      <yid-table-column
        label="最近登录使用人"
        min-width="60"
        prop="lastloginname"></yid-table-column>
      <yid-table-column
        label="最近登录时间"
        width="150"
        prop="lastlogintime"></yid-table-column>
      <yid-table-column
        label="门店编码"
        width="90"
        prop="shopcode"></yid-table-column>
      <yid-table-column
        label="门店名称"
        width="100"
        prop="shopname"></yid-table-column>
      <yid-table-column label="授权状态" width="90" prop="status">
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
      <yid-table-column
        label="备注"
        min-width="80"
        prop="memo"></yid-table-column>
    </yid-table>

    <yid-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      @close="closeDialog"
      width="550px">
      <el-form ref="macForm" :model="macForm" label-width="100px">
        <el-form-item
          label="授权码"
          prop="macaddress"
          :rules="[{ required: true, message: '授权码不能为空' }]">
          <el-input
            v-model="macForm.macaddress"
            placeholder="请输入"
            style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="授权状态" prop="status">
          <el-select v-model="macForm.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input
            v-model="macForm.memo"
            type="textarea"
            :rows="3"
            placeholder="备注"
            style="width: 60%" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="closeDialog" type="info">取消</el-button>
          <el-button @click="saveMac" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>
<script>
import yid from '@src/library'
import service from '@src/service'
import { isEmpty } from '../../library/helper/validate'

export default {
  name: 'mac',
  components: {},
  data() {
    return {
      searchForm: {
        macaddress: '',
        logindate: [],
        memo: '',
        status: ''
      },
      pageInfo: {
        page: 0,
        limit: 10
      },
      dialog: {
        title: '',
        visible: false
      },
      macForm: {
        id: '',
        macaddress: '',
        memo: '',
        lastloginid: '',
        lastloginname: '',
        lastlogintime: '',
        status: '',
        shopid: '',
        shopcode: '',
        shopname: ''
      },
      selectedRows: []
    }
  },
  mounted() {
    this.querylist()
  },
  methods: {
    querylist() {
      let requestObj = {}
      if (this.searchForm.logindate.length > 0) {
        requestObj.sdate = this.searchForm.logindate[0]
        requestObj.edate = this.searchForm.logindate[1]
      } else {
        requestObj.sdate = ''
        requestObj.edate = ''
      }
      requestObj.macaddress = this.searchForm.macaddress
      requestObj.status = this.searchForm.status
      requestObj.memo = this.searchForm.memo

      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.macTable.Pagination.internalPageSize
      const fetch = service.mac.findList
      const params = { ...this.pageInfo, ...requestObj }
      this.$refs.macTable.reloadData({
        fetch,
        params
      })
    },
    showAdd() {
      this.dialog.visible = true
      this.dialog.title = '新增MAC地址'
      this.$nextTick(() => {
        if (this.$refs['macForm']) {
          this.$refs['macForm'].resetFields()
        }
      })
      this.macForm.id = ''
      this.macForm.macaddress = ''
      this.macForm.memo = ''
      this.macForm.status = '1'
    },
    showEdit(row) {
      this.dialog.visible = true
      this.dialog.title = '编辑MAC地址'

      this.macForm.id = row.id
      this.macForm.macaddress = row.macaddress
      this.macForm.memo = row.memo
      this.macForm.status = row.status
    },
    saveMac() {
      this.$refs['macForm'].validate(valid => {
        if (valid) {
          console.log(this.macForm)
          service.mac.saveMac(this.macForm).then(res => {
            if (res.resp_code == '200') {
              this.querylist()
              yid.util.success('保存成功')
              this.$refs['macForm'].resetFields()
              this.dialog.visible = false
            }
          })
        }
      })
    },
    resetSearchForm() {
      this.searchForm = {
        macaddress: '',
        logindate: [],
        memo: '',
        status: ''
      }
      this.querylist()
    },
    closeDialog() {
      this.dialog.visible = false
    },
    updateStatus(row) {
      let params = {
        id: row.id,
        status: row.status,
        username: row.lastloginid
      }
      service.mac.updateStatus(params).then(res => {
        yid.util.alert(res.resp_msg)
      })
    },
    handleSelectionChange(row) {
      this.selectedRows = row
    },
    batchUpdateStatus(status) {
      if (this.selectedRows.length > 0) {
        let ids = []
        this.selectedRows.map((item, index) => {
          ids.push(parseInt(item.id))
        })
        if (ids.length > 0) {
          let params = {
            ids: ids,
            status: status
          }
          service.mac.batchUpdateStatus(params).then(res => {
            if (res.resp_code == '200') {
              yid.util.success('更新成功！')
              this.querylist()
            }
          })
        }
      } else {
        yid.util.error('请至少勾选一项')
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
