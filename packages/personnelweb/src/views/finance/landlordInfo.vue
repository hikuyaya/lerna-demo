<template>
  <div class="landlordInfo">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="">
            <el-button @click="addLandlordInfo" type="primary">新增</el-button>
            <el-button @click="showImportDialog">导入</el-button>&nbsp;
          </el-form-item>
          <br />
          <el-form-item label="房东编码：" prop="code">
            <el-input
              clearable
              v-model="searchForm.code"
              placeholder="编码"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="房东姓名：" prop="code">
            <el-input
              clearable
              v-model="searchForm.name"
              placeholder="名称"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="房东电话：" prop="tel">
            <el-input
              clearable
              v-model="searchForm.tel"
              placeholder="电话"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="是否过期：" prop="status">
            <el-select
              style="width: 100px"
              v-model="searchForm.status"
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
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 10px">
          <yid-table-column
            prop="code"
            label="房东编号"
            width="150"></yid-table-column>
          <yid-table-column
            prop="name"
            label="房东名称"
            width="150"></yid-table-column>
          <yid-table-column
            prop="bank"
            label="开户银行"
            width="200"></yid-table-column>
          <yid-table-column
            prop="bankno"
            label="银行帐号"
            width="200"></yid-table-column>
          <yid-table-column
            prop="payee"
            label="开户人姓名"
            width="150"></yid-table-column>
          <yid-table-column prop="status" label="是否过期" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">否</span>
              <span v-if="scope.row.status == 2">是</span>
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
          ref="landlordInfoFom"
          :model="landlordInfoFom"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <el-form-item
            label="房东编码："
            prop="code"
            label-width="150px"
            :rules="[{ required: true, message: '编码不能为空' }]">
            <el-input
              v-model="landlordInfoFom.code"
              clearable
              placeholder="编码"
              :disabled="!editCode"
              @blur="checkCode"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="房东姓名："
            prop="name"
            label-width="150px"
            :rules="[{ required: true, message: '房东姓名不能为空' }]">
            <el-input
              v-model="landlordInfoFom.name"
              placeholder="名称"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="房东电话：" prop="tel" label-width="150px">
            <el-input
              v-model="landlordInfoFom.tel"
              placeholder="电话"
              @blur="checkTel"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="开户银行："
            prop="bank"
            label-width="150px"
            :rules="[{ required: true, message: '开户银行不能为空' }]">
            <el-select
              style="width: 200px"
              v-model="landlordInfoFom.bank"
              placeholder="请选择">
              <el-option
                v-for="item in bankList"
                :key="item.id"
                :label="item.bank"
                :value="item.bank">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="银行帐号："
            prop="bankno"
            label-width="150px"
            :rules="[{ required: true, message: '银行帐号不能为空' }]">
            <el-input
              v-model="landlordInfoFom.bankno"
              placeholder="银行帐号"
              @blur="checkBankno"
              oninput="value=value.replace(/[^0-9-]/g,'')"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="收款人姓名："
            prop="payee"
            label-width="150px"
            :rules="[{ required: true, message: '收款人姓名不能为空' }]">
            <el-input
              v-model="landlordInfoFom.payee"
              placeholder="收款人姓名"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="是否过期："
            prop="status"
            label-width="150px"
            :rules="[{ required: true, message: '是否过期不能为空' }]">
            <el-select
              style="width: 100px"
              v-model="landlordInfoFom.status"
              placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="name" label-width="150px">
            <el-input
              v-model="landlordInfoFom.memo"
              type="textarea"
              :rows="2"
              style="width: 300px; resize: none"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="importCancel"
      width="700px">
      <el-form :model="importDialog.model" label-width="120px" ref="copyForm">
        <p>批量导入门面房东资料方法</p>
        <p>1、点击链接：下载门面房东资料模板；</p>
        <p>2、下载完成并保存文件，然后打开文件并输入门面房东资料信息；</p>
        <p>3、在下面导入修改完毕的模板文件。</p>
        <el-form-item label="下载导入模板：" align="left">
          <el-link @click="downExcelTemplate" type="primary"
            >门面房东资料模板</el-link
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
          <el-button @click="saveImportLandlords" type="primary"
            >确定</el-button
          >
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import ElButton from '../../library/components/button/button'
import download from '@src/library/http/download'

export default {
  components: { ElButton },
  name: 'landlordInfo',
  data() {
    return {
      excelConvertUrl: '',
      myheaders: {},
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      searchForm: {
        code: '',
        name: ''
      },
      landlordInfoFom: {
        id: '',
        code: '',
        name: '',
        tel: '',
        bank: '',
        bankno: '',
        payee: '',
        memo: '',
        status: '1'
      },
      statusList: [
        {
          value: '1',
          label: '否'
        },
        {
          value: '2',
          label: '是'
        }
      ],
      bankList: [],
      showList: true,
      rules: {},
      editCode: true,
      importDialog: {
        title: '门面房东资料导入',
        visible: false,
        landlords: []
      }
    }
  },
  mounted() {
    this.excelConvertUrl =
      $yid.config.API.BASE + 'api-finance/landlordinfo/convertSystem'
    this.getBankList()
    this.search()
  },
  methods: {
    getBankList() {
      service.finance.dicBank.listAll({ status: '1', isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.bankList = res.data
        }
      })
    },
    getData(reqParams) {
      const fetch = service.finance.landlordInfo.list
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
      const fetch = service.finance.landlordInfo.list
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
      this.showList = true
    },
    addLandlordInfo() {
      this.$refs['landlordInfoFom'].resetFields()
      this.landlordInfoFom.id = ''
      this.landlordInfoFom.memo = ''
      this.landlordInfoFom.status = '1'
      this.showList = false
      this.editCode = true
    },
    checkCode() {
      let code = this.landlordInfoFom.code
      if (!yid.util.isEmpty(code)) {
        if (!yid.validate.isInputCode2(code)) {
          this.landlordInfoFom.code = ''
          yid.util.error('编码只能输入数字和字母和-!')
          return
        }
        //通过code查询是否存在项目，存在则清空code,提示已经存在
        service.finance.landlordInfo
          .listAll({ checkcode: code, isDel: '0' })
          .then(res => {
            if (res.resp_code == 200) {
              if (res.data.length > 0) {
                this.landlordInfoFom.code = ''
                yid.util.error('编码为:[' + code + ']的房东已存在请重新输入!')
              }
            } else {
              this.landlordInfoFom.code = ''
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    checkBankno() {
      let bankno = this.landlordInfoFom.bankno
      if (!yid.util.isEmpty(bankno)) {
        /*if(!yid.validate.interger(bankno)) {
                        yid.util.error("银行帐号只能输入整数！");
                        this.landlordInfoFom.bankno = '';
                        return
                    }*/
        /*if(bankno.length > 20){
                        yid.util.error("银行帐号超过长度！");
                        this.landlordInfoFom.bankno = '';
                        return
                    }*/
        //通过bankno查询是否存在项目，存在则清空code,提示已经存在
        service.finance.landlordInfo
          .checkBankno({ id: this.landlordInfoFom.id, bankno: bankno })
          .then(res => {
            if (res.resp_code == 200) {
              if (res.data.length > 0) {
                this.landlordInfoFom.bankno = ''
                yid.util.error(
                  '银行帐号为:[' + bankno + ']的房东已存在请重新输入!'
                )
              }
            } else {
              this.landlordInfoFom.bankno = ''
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    saveAction() {
      this.$refs['landlordInfoFom'].validate(valid => {
        if (valid) {
          service.finance.landlordInfo.save(this.landlordInfoFom).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('保存成功')
              this.showList = true
              if (yid.util.isEmpty(this.landlordInfoFom.id)) {
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
      this.landlordInfoFom.id = row.id
      this.landlordInfoFom.code = row.code
      this.landlordInfoFom.name = row.name
      this.landlordInfoFom.tel = row.tel
      this.landlordInfoFom.bank = row.bank
      this.landlordInfoFom.bankno = row.bankno
      this.landlordInfoFom.payee = row.payee
      this.landlordInfoFom.memo = row.memo
      this.landlordInfoFom.status = row.status
      this.showList = false
      this.editCode = false
    },
    deleteAction(row) {
      yid.util.confirm('您确定要删除[' + row.name + ']的房东?', '', '', () => {
        row.isDel = '1'
        service.finance.landlordInfo.save(row).then(res => {
          if (res.resp_code == 200) {
            yid.util.success('更新成功')
            this.search()
          } else {
            yid.util.error('更新失败')
          }
        })
      })
    },
    showImportDialog() {
      this.importDialog.visible = true
      this.importDialog.landlords = []
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
      this.importDialog.landlords = res.data
    },
    beforeAvatarExcelUpload(file) {
      const isJPG =
        file.type.indexOf('sheet') != -1 || file.type.indexOf('excel') != -1
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        yid.util.error('上传excel只能是 xls/xlsx 格式!')
      }
      if (!isLt2M) {
        yid.util.error('上传excel大小不能超过 10MB!')
      }

      return isJPG && isLt2M
    },
    downExcelTemplate() {
      download(
        yid.config.API.BASE + 'api-finance/landlordinfo/downSysTemplate',
        {}
      )
    },
    saveImportLandlords() {
      if (this.importDialog.landlords.length == 0) {
        yid.util.info('无导入数据')
      } else {
        service.finance.landlordInfo
          .saveSystem(this.importDialog.landlords)
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('导入成功!')
              this.search()
              this.importCancel()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    isPhone(val) {
      if (yid.validate.telephone(val)) {
        return true
      } else {
        return false
      }
    },
    checkTel() {
      let tel = this.landlordInfoFom.tel
      if (!yid.util.isEmpty(tel)) {
        if (!yid.validate.telephone(tel)) {
          yid.util.error('电话格式不正确，请输入正确的电话号码！')
          this.landlordInfoFom.tel = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
