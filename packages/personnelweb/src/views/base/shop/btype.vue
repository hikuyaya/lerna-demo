<template>
  <div>
    <el-collapse-transition>
      <div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-button
            @click="editAction(false, '')"
            type="primary"
            style="margin-bottom: 10px"
            >新增</el-button
          ><br />
          <el-form-item label="业务类型：" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="业务名称"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="getData" type="primary">查询</el-button>
          </el-form-item>
        </el-form>

        <yid-table ref="table" pagination style="width: 100%; margin-top: 20px">
          <yid-table-column prop="code" label="业务编号" min-width="120">
          </yid-table-column>
          <yid-table-column prop="name" label="业务类型" min-width="120">
          </yid-table-column>
          <yid-table-column prop="bbnames" label="对应部门" min-width="150">
          </yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="editAction(true, scope.row)"
                >编辑</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>

        <yid-dialog
          :title="btypeDialog.title"
          :visible.sync="btypeDialog.visible"
          width="550px">
          <el-form ref="btypeForm" :model="btypeForm" label-width="140px">
            <el-form-item
              label="类型名称："
              prop="name"
              :rules="[{ required: true, message: '类型名称为空' }]">
              <el-input
                v-model="btypeForm.name"
                style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="对应部门：">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="checkedBranchs"
                @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="item in branchList"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.bname }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="saveBtype" type="primary">保存</el-button>
              <el-button @click="cancelBtype">取消</el-button>
            </el-form-item>
          </el-form>
        </yid-dialog>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import download from '@src/library/http/download'
import { isEmpty } from '@src/library/helper/validate'

export default {
  name: 'btype',
  data() {
    return {
      searchForm: {
        name: ''
      },
      btypeList: [],
      pageInfo: { page: 1, limit: 10 },
      btypeDialog: {
        title: '',
        visible: false
      },
      btypeForm: {
        name: '',
        bbids: '',
        bbcodes: '',
        bbnames: ''
      },
      checkAll: false,
      checkedBranchs: [],
      branchList: [],
      isIndeterminate: true
    }
  },
  mounted() {
    this.getData()
    this.getBranchList()
  },
  methods: {
    getBranchList() {
      service.branch.list({ isDel: '0', status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.branchList = res.data
        }
      })
    },
    getData() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.btype.list
      const params = this.pageInfo
      params.name = this.searchForm.name
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedBranchs = []
        this.branchList.map(item => {
          this.checkedBranchs.push(item.id)
        })
      } else {
        this.checkedBranchs = []
      }
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.branchList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.branchList.length
    },
    editAction(tag, row) {
      this.btypeDialog.visible = true
      this.btypeDialog.title = tag ? '编辑业务类型' : '添加业务类型'
      if (tag) {
        this.btypeForm.id = row.id
        this.btypeForm.name = row.name
        this.checkedBranchs = row.bbids.split(',')
      } else {
        this.btypeForm.id = ''
        this.btypeForm.name = ''
        this.checkAll = false
        this.checkedBranchs = []
        this.isIndeterminate = false
      }
    },
    submitForm() {
      this.getData()
    },
    saveBtype() {
      this.$refs['btypeForm'].validate(valid => {
        if (valid) {
          this.btypeForm.bbids = ''
          this.btypeForm.bbcodes = ''
          this.btypeForm.bbnames = ''

          let branchs = this.checkedBranchs
          if (branchs.length == 0) {
            yid.util.alert('请选择至少一个部门')
            return false
          }
          branchs.map(item => {
            this.branchList.map(item2 => {
              if (item === item2.id) {
                this.btypeForm.bbids += item2.id + ','
                this.btypeForm.bbcodes += item2.bcode + ','
                this.btypeForm.bbnames += item2.bname + ','
              }
            })
          })
          this.btypeForm.bbids = this.btypeForm.bbids.substr(
            0,
            this.btypeForm.bbids.length - 1
          )
          this.btypeForm.bbcodes = this.btypeForm.bbcodes.substr(
            0,
            this.btypeForm.bbcodes.length - 1
          )
          this.btypeForm.bbnames = this.btypeForm.bbnames.substr(
            0,
            this.btypeForm.bbnames.length - 1
          )

          console.log(this.btypeForm)
          service.btype.saveBtype(this.btypeForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('保存成功')
              this.getData()
              this.btypeDialog.visible = false
            }
          })
        }
      })
    },
    cancelBtype() {
      this.btypeDialog.visible = false
    }
  }
}
</script>

<style scoped lang="scss"></style>
