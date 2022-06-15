<template>
  <div class="salaryRewardDetail">
    <el-collapse-transition>
      <div v-show="showList">
        <el-row>
          <el-button @click="jobAlert(false, '')" type="primary"
            >添加</el-button
          >
          <el-button
            @click="showImportDialog"
            style="background-color: red; color: white"
            >导入</el-button
          >&nbsp;&nbsp;&nbsp;
        </el-row>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="项目编码：" prop="itemCode">
            <el-input
              v-model="searchForm.ioitemCode"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：" prop="itemCode">
            <el-input
              v-model="searchForm.ioitemName"
              style="width: 150px"></el-input>
          </el-form-item>

          <el-form-item label="审批部门：" prop="orgcode" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.orgcode"
              style="width: 180px">
              <el-option label="财务部" value="0"></el-option>
              <el-option label="信息部" value="1"></el-option>
              <el-option label="美发部/美容部" value="2/3"></el-option>
              <el-option label="工程部" value="4"></el-option>
              <el-option label="物流部" value="5"></el-option>
              <el-option label="市场部" value="6"></el-option>
              <el-option label="拓展部" value="7"></el-option>
              <el-option label="安全督查部" value="8"></el-option>
              <el-option label="行政部" value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="明细：" prop="describeinfo">
            <el-input
              v-model="searchForm.describeinfo"
              style="width: 150px"></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="rest" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
        <yid-table
          pagination
          ref="table"
          :data="jobData"
          style="margin-top: 15px"
          :row-class-name="$yid.util.getTableClass">
          <yid-table-column
            label="项目编码"
            min-width="100"
            prop="ioitemCode"></yid-table-column>
          <yid-table-column
            label="项目名称"
            min-width="150"
            prop="ioitemName"></yid-table-column>
          <yid-table-column prop="orgcode" label="审批部门" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.orgcode == 0">财务部</span>
              <span v-if="scope.row.orgcode == 1">信息部</span>
              <span v-if="scope.row.orgcode == '2/3'">美发部/美容部</span>
              <span v-if="scope.row.orgcode == 4">工程部</span>
              <span v-if="scope.row.orgcode == 5">物流部</span>
              <span v-if="scope.row.orgcode == 6">市场部</span>
              <span v-if="scope.row.orgcode == 7">拓展部</span>
              <span v-if="scope.row.orgcode == 8">安全督查部</span>
              <span v-if="scope.row.orgcode == 9">行政部</span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="明细"
            min-width="150"
            prop="describeinfo"></yid-table-column>
          <yid-table-column
            label="操作"
            fixed="right"
            min-width="150"
            prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="jobAlert(true, scope.row)"
                >编辑</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button @click="saveJob" type="primary">保存</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>

        <el-form
          ref="funddescribeForm"
          :model="funddescribeForm"
          label-width="140px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                label="收支项目名称："
                prop="ioitemCode"
                :rules="[{ required: true, message: '收支项目名称为空' }]">
                <el-select
                  value-key="pid"
                  placeholder="请选择"
                  v-model="funddescribeForm.ioitemCode">
                  <el-option
                    :key="item.id"
                    :value="item.code"
                    :label="item.name"
                    v-for="item in ioitemDataAll" />
                </el-select>
              </el-form-item>
              <el-form-item label="审批部门：" prop="orgcode">
                <el-select
                  value-key="id"
                  placeholder="请选择"
                  v-model.trim="funddescribeForm.orgcode">
                  <el-option label="财务部" value="0"></el-option>
                  <el-option label="信息部" value="1"></el-option>
                  <el-option label="美发部/美容部" value="2/3"></el-option>
                  <el-option label="工程部" value="4"></el-option>
                  <el-option label="物流部" value="5"></el-option>
                  <el-option label="市场部" value="6"></el-option>
                  <el-option label="拓展部" value="7"></el-option>
                  <el-option label="安全督查部" value="8"></el-option>
                  <el-option label="行政部" value="9"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="明细："
                prop="describeinfo"
                :rules="[{ required: true, message: '明细为空' }]">
                <el-input
                  v-model="funddescribeForm.describeinfo"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="1000"
                  show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="importCancel"
      width="700px">
      <el-form :model="importDialog.model" label-width="120px" ref="copyForm">
        <p>批量导入支出项目关键字管理方法</p>
        <p>1、点击链接：下载支出项目关键字管理模板；</p>
        <p>2、下载完成并保存文件，然后打开文件并输入信息；</p>
        <p>3、在下面导入修改完毕的模板文件。</p>
        <el-form-item label="下载导入模板：" align="left">
          <el-link @click="downExcelTemplate" type="primary"
            >支出项目关键字管理模板</el-link
          >
        </el-form-item>
        <el-form-item label="选择导入文件:">
          <el-upload
            ref="uploadExcel"
            class="avatar-uploader"
            :headers="myheaders"
            :action="excelConvertUrl"
            :show-file-list="true"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="handleAvatarExcelSuccess"
            :before-upload="beforeAvatarExcelUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持上传 .xls
              .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveImportIolimit" type="primary">确定</el-button>
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import download from '@src/library/http/download'
export default {
  name: 'dept',
  data() {
    return {
      excelConvertUrl: '',
      myheaders: {},
      showList: true,
      type: '1',
      searchForm: {
        ioitemCode: '',
        ioitemName: '',
        orgcode: '',
        describeinfo: ''
      },
      status: '2',
      funddescribeForm: {
        id: '',
        ioitemId: '',
        ioitemCode: '',
        ioitemName: '',
        orgcode: '',
        describeinfo: ''
      },

      pageInfo: { page: 1, limit: 10 },
      maxCode: 0,
      ioitemData: [],
      ioitemDataAll: [],
      jobData: [],
      jobDataAll: [],

      importDialog: {
        title: '支出项目关键字管理导入',
        visible: false,
        iolimits: []
      }
    }
  },
  created() {},

  mounted() {
    this.excelConvertUrl =
      $yid.config.API.BASE + 'api-finance/dicfunddescribe/convertSystem'
  },
  methods: {
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchForm)
    },
    rest() {
      this.$refs['searchForm'].resetFields()

      this.searchForm.ioitemCode = ''
      this.searchForm.orgcode = ''
      this.searchForm.describeinfo = ''
      this.search()
    },

    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.funddescribe.jobList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },

    getioitemListAll() {
      service.finance.funddescribe
        .ioitemAll({ status: '1', type: '2' })
        .then(res => {
          if (res.resp_code == 200) {
            this.ioitemDataAll = res.data
          }
        })
    },
    getjobList(type) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.funddescribe.jobList
      const params = this.pageInfo
      params.type = type

      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    getjobListAll() {
      service.finance.funddescribe.jobAll({}).then(res => {
        if (res.resp_code == 200) {
          this.jobDataAll = res.data
        }
      })
    },

    jobAlert(tag, row) {
      this.showList = false
      this.getioitemListAll()

      if (tag == false) {
        this.funddescribeForm.id = ''
        this.funddescribeForm.ioitemId = ''
        this.funddescribeForm.ioitemCode = ''
        this.funddescribeForm.ioitemName = ''
        this.funddescribeForm.orgcode = ''
        this.funddescribeForm.describeinfo = ''
      } else {
        this.funddescribeForm.id = row.id
        this.funddescribeForm.ioitemId = row.ioitemId
        this.funddescribeForm.ioitemCode = row.ioitemCode
        this.funddescribeForm.ioitemName = row.ioitemName
        this.funddescribeForm.orgcode = row.orgcode
        this.funddescribeForm.describeinfo = row.describeinfo
      }
    },
    saveJob() {
      this.$refs['funddescribeForm'].validate(valid => {
        if (valid) {
          //获取部门id
          let pobj = {}
          pobj = this.ioitemDataAll.find(item => {
            return item.code === this.funddescribeForm.ioitemCode
          })
          this.funddescribeForm.ioitemId = pobj.id
          this.funddescribeForm.ioitemName = pobj.name
          service.finance.funddescribe
            .saveJob(this.funddescribeForm)
            .then(res => {
              if (res.resp_code == 200) {
                yid.util.success(res.resp_msg)
                this.back()
                this.getjobList()
              } else {
                yid.util.error(res.resp_msg)
              }
            })
        }
      })
    },
    back() {
      this.$refs['funddescribeForm'].resetFields()
      this.showList = true
    },
    downExcelTemplate() {
      download(
        yid.config.API.BASE + 'api-finance/dicfunddescribe/downSysTemplate',
        {}
      )
    },
    saveImportIolimit() {
      if (this.importDialog.iolimits.length == 0) {
        yid.util.error('无导入数据')
      } else {
        service.finance.funddescribe
          .saveSystem(this.importDialog.iolimits)
          .then(res => {
            if (res.resp_code == '200') {
              this.importDialog.visible = false
              yid.util.success('导入成功')
              this.search()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    showImportDialog() {
      this.importDialog.visible = true
      this.importDialog.iolimits = []
      this.myheaders['authorization'] =
        'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
      this.$refs.uploadExcel.clearFiles()
    },
    importCancel() {
      this.importDialog.visible = false
    },
    handleExceed(files, fileList) {
      yid.util.error('只能导入一个文件，请先删除之前选择的文件')
      return
    },
    handleAvatarExcelSuccess(res) {
      this.importDialog.iolimits = res.data
    },
    beforeAvatarExcelUpload(file) {
      const isJPG =
        file.type.indexOf('sheet') != -1 || file.type.indexOf('excel') != -1
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        yid.util.error('上传excel只能是 xls/xlsx 格式!')
        return false
      }
      if (!isLt2M) {
        yid.util.error('上传excel大小不能超过 10MB!')
        return false
      }

      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped></style>
