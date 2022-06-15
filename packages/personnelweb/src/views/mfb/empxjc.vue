<template>
  <div class="dept">
    <el-form inline>
      <el-form-item label="">
        <el-button type="primary" @click="exportEeSpecial()">导出</el-button>
        <el-button type="primary" @click="setEeSpecial()">设置</el-button>
        <el-button type="primary" @click="importSpecial"
          >导入员工价格</el-button
        >
      </el-form-item>
      <br />
      <el-form-item label="门店：">
        <el-select
          @clear="clearFormShop"
          @blur="clearFormShop"
          clearable
          v-model.trim="form.shopcode"
          filterable
          @change="changeShop"
          :filter-method="filterShop"
          placeholder="请选择门店"
          style="width: 160px">
          <el-option
            :key="item.id"
            :label="item.shopname"
            :value="item.shopcode"
            v-for="item in filterShopList">
            <span style="float: left">{{ item.shopcode }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.shopname
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工：">
        <el-input
          clearable
          v-model="form.ee"
          placeholder="请输入工员或名称"
          style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="职务：" prop="pscode">
        <el-select
          clearable
          filterable
          placeholder="请选择"
          multiple
          v-model.trim="form.pscode">
          <el-option
            :key="item.pscode"
            :label="item.psname"
            :value="item.pscode"
            v-for="item in searchFormPositionList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select
          clearable
          v-model="form.status"
          placeholder="请选择状态"
          style="width: 120px">
          <el-option label="在职" value="1"></el-option>
          <el-option label="离职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入职日期：">
        <el-date-picker
          style="width: 300px"
          :clearable="true"
          v-model="form.createTimeRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryServData()">查询</el-button>
        <el-button type="primary" @click="cleanServData()">重置</el-button>
      </el-form-item>
    </el-form>

    <yid-table
      ref="tableService"
      pagination
      style="width: 100%"
      height="calc(100vh - 370px)"
      @selection-change="selectionData"
      :span-method="spanMethod">
      <el-table-column type="selection" width="55"> </el-table-column>
      <yid-table-column
        label="员工工号"
        prop="eecode"
        width="100"></yid-table-column>
      <yid-table-column
        label="员工姓名"
        prop="eename"
        width="100"></yid-table-column>
      <yid-table-column
        label="职务"
        prop="psname"
        width="100"></yid-table-column>
      <yid-table-column
        label="职务级别"
        prop="pslname"
        width="140"></yid-table-column>
      <yid-table-column label="状态" prop="status" width="80">
        <template slot-scope="scope">
          <label>{{ scope.row.status == '1' ? '在职' : '离职' }}</label>
        </template>
      </yid-table-column>
      <yid-table-column
        label="剪发原价"
        prop="jfyjMoney"
        width="100"></yid-table-column>
      <yid-table-column
        label="剪发会员价"
        prop="jfhyjMoney"
        width="100"></yid-table-column>
      <yid-table-column
        label="店号"
        prop="shopcode"
        width="100"></yid-table-column>
      <yid-table-column
        label="所属门店"
        prop="shopname"
        width="140"></yid-table-column>
      <yid-table-column label="门店执行原价" prop="speprice" width="110">
      </yid-table-column>
      <yid-table-column label="门店执行会员价" prop="value" width="120">
        <template slot-scope="scope">
          <label v-if="scope.row.discountType == '2' && scope.row.dtype == '1'"
            >{{ scope.row.value }}折</label
          >
          <label
            v-if="scope.row.discountType == '2' && scope.row.dtype == '2'"
            >{{ scope.row.value }}</label
          >
          <label v-if="scope.row.discountType == '1' && scope.row.dtype == '1'"
            >{{ scope.row.value }}折</label
          >
          <label
            v-if="scope.row.discountType == '1' && scope.row.dtype == '2'"
            >{{ scope.row.value }}</label
          >
        </template>
      </yid-table-column>
      <yid-table-column label="价格类型" prop="istsj" width="100">
        <template slot-scope="scope">
          <label v-if="scope.row.istsj == '0'">{{ '个人价' }}</label>
          <label style="color: #ff0000" v-if="scope.row.istsj == '1'">{{
            '门店价'
          }}</label>
          <label style="color: #ff0000" v-if="scope.row.istsj == '2'">{{
            '特殊价'
          }}</label>
        </template>
      </yid-table-column>
      <yid-table-column
        label="入职日期"
        prop="inTime"
        width="160"></yid-table-column>
      <yid-table-column
        label="操作"
        min-width="120"
        prop="content"
        fixed="right">
        <template slot-scope="scope">
          <el-link type="primary" @click="setPrice(scope.row)">设置</el-link>
          <el-link
            type="primary"
            @click="selectLog(scope.row)"
            style="margin: 0 10px 0 10px"
            >查看</el-link
          >
        </template>
      </yid-table-column>
      <!--            <yid-table-column label="是否特殊价" prop="istsj" width="160">-->
      <!--                <template slot-scope="scope">-->
      <!--                    <label>{{scope.row.istsj == '1' ? '是' : '否'}}</label>-->
      <!--                </template>-->
      <!--            </yid-table-column>-->
    </yid-table>

    <yid-dialog
      :title="price.title"
      :visible.sync="price.visible"
      width="400px">
      <el-form :model="price" label-width="140px">
        <el-form-item label="姓名：">
          {{ price.eename }}
        </el-form-item>
        <el-form-item label="剪发原价：" style="width: 280px">
          <el-input type="number" v-model="price.jfyjMoney" />
        </el-form-item>
        <el-form-item label="剪发会员价：" style="width: 280px">
          <el-input type="number" v-model="price.jfhyjMoney" />
        </el-form-item>
        <el-checkbox v-model="price.isSynch"
          >同步此价格到所有做业绩的门店</el-checkbox
        >
        <el-popover
          style="padding-left: 10px"
          placement="right"
          title="提示"
          width="380"
          trigger="hover">
          <el-button slot="reference"
            ><i class="el-icon-question"></i
          ></el-button>
          <ul class="tips-content">
            <li>如果不勾选，仅同步与个人价相同的门店</li>
          </ul>
        </el-popover>
        <el-form-item>
          <el-button @click="sure()" type="primary">确定</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="updateLog.title"
      :visible.sync="updateLog.visible"
      width="650px">
      <yid-table :data="updateLog.data">
        <yid-table-column
          prop="createdTime"
          label="修改日期"
          min-width="100"></yid-table-column>
        <yid-table-column
          prop="jfyjMoney"
          label="剪发原价"
          min-width="100"></yid-table-column>
        <yid-table-column
          prop="jfhyjMoney"
          label="剪发会员价"
          min-width="100"></yid-table-column>
        <yid-table-column
          prop="createdBy"
          label="操作人"
          min-width="100"></yid-table-column>
      </yid-table>
    </yid-dialog>

    <yid-dialog
      :title="eeData.title"
      :visible.sync="eeData.visible"
      width="650px">
      <div style="margin-bottom: 10px">
        <el-checkbox v-model="eeData.isSynch"
          >同步此价格到所有做业绩的门店</el-checkbox
        >
        <el-popover
          style="padding-left: 10px"
          placement="right"
          title="提示"
          width="380"
          trigger="hover">
          <el-button slot="reference"
            ><i class="el-icon-question"></i
          ></el-button>
          <ul class="tips-content">
            <li>如果不勾选，仅同步与个人价相同的门店</li>
          </ul>
        </el-popover>
      </div>
      <yid-table :data="eeObj" width="650px">
        <yid-table-column prop="eename" label="姓名" min-width="100">
        </yid-table-column>
        <yid-table-column label="剪发原价" min-width="100" prop="jfyjMoney">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.jfyjMoney" />
          </template>
        </yid-table-column>
        <yid-table-column label="剪发会员价" min-width="100" prop="jfhyjMoney">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.jfhyjMoney" />
          </template>
        </yid-table-column>
      </yid-table>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="sureSelect()">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="levelCancel">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="importSpecialData.title"
      :visible.sync="importSpecialData.visible"
      @close="importCancel"
      width="700px">
      <el-form
        :model="importSpecialData.model"
        label-width="120px"
        ref="copyForm"
        :label-position="labelPosition">
        <p>批量导入员工价格方法</p>
        <p>1、点击链接:下载员工价格表模板</p>
        <p>2、下载完成并保存文件，然后打开文件并输入员工价格信息</p>
        <p>3、在下面导入修改完毕的模板文件</p>
        <el-form-item label="下载导入模板：" align="left">
          <el-link @click="downExcelTemplate" type="primary"
            >员工价格表模板</el-link
          >
        </el-form-item>

        <el-form-item label="选择导入文件:">
          <el-upload
            ref="uploadExcel"
            class="avatar-uploader"
            :headers="myheaders"
            action="https://sass.yidmall.com/api-base/employee/importExcel"
            :show-file-list="true"
            :on-success="handleAvatarExcelSuccess"
            :before-upload="beforeAvatarExcelUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持上传 .xls
              .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。
            </div> </el-upload
          ><el-checkbox v-model="importSpecialData.isSynch"
            >同步此价格到所有做业绩的门店</el-checkbox
          >
          <el-popover
            style="padding-left: 10px"
            placement="right"
            title="提示"
            width="380"
            trigger="hover">
            <el-button slot="reference"
              ><i class="el-icon-question"></i
            ></el-button>
            <ul class="tips-content">
              <li>如果不勾选，仅同步与个人价相同的门店</li>
            </ul>
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveImport" type="primary">保存</el-button>
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import { exportExecl, imporExecl } from '../../library/helper/execl'
import { stationdesc } from '@src/service/modules/position'
import download from '@src/library/http/download'
import * as res from 'vue-print-nb'

export default {
  data() {
    return {
      form: {
        shopcode: '',
        ee: '',
        pscode: [],
        status: '',
        createTimeRange: ''
      },
      pageInfo: { page: 1, limit: 10 },
      allShopList: [],
      filterShopList: [],
      searchFormPositionList: [],
      price: {
        title: '',
        visible: false,
        eename: '',
        eecode: '',
        jfyjMoney: null,
        jfhyjMoney: null,
        isSynch: false
      },
      eePrice: [],
      updateLog: { title: '', visible: false, data: [] },
      eeData: { title: '', visible: false, isSynch: false },
      eeObj: [],
      eeList: [],
      importSpecialData: {
        title: '',
        visible: false,
        employees: [],
        isSynch: false
      },
      upload: yid.config.API.UPLOAD,
      myheaders: {},
      isSynch: 0
    }
  },
  mounted() {
    this.queryServData()
    this.getShopList({ status: '1' })
    this.getSearchFormPositionList()
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let pscode = ''
      if (this.form.pscode.length > 0) {
        pscode = this.form.pscode.join(',')
      }
      reqObj.pscode = pscode
      return reqObj
    }
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 4 ||
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex === 7 ||
        columnIndex === 13 ||
        columnIndex === 14
      ) {
        if (
          rowIndex === 0 ||
          this.$refs.tableService.internalData[rowIndex - 1].eecode !=
            row.eecode
        ) {
          let rowspan = 0
          this.$refs.tableService.internalData.forEach(eey => {
            if (eey.eecode == row.eecode) {
              rowspan++
            }
          })
          return [rowspan, 1]
        } else if (
          row.eecode ==
          this.$refs.tableService.internalData[rowIndex - 1].eecode
        ) {
          return [0, 0]
        } else {
          return [1, 1]
        }
      }
    },
    getSearchFormPositionList() {
      service.position.stationdesc({ statid: 5 }).then(res => {
        if (res.resp_code == 200) {
          this.searchFormPositionList = res.data[0].pslist
        }
      })
    },
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shopid == '') {
          this.searchForm.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    //选择门店
    changeShop() {
      this.filterShopList.forEach(item => {
        if (item.id == this.searchForm.shopid) {
          this.shopcode = item.shopcode
          this.shopname = item.shopname
        }
      })
    },
    queryServData() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.tableService.Pagination.internalPageSize
      if (this.form.createTimeRange) {
        this.form.startTime = this.form.createTimeRange[0] + ' 00:00:00'
        this.form.endTime = this.form.createTimeRange[1] + ' 23:59:59'
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
      this.getData(this.form)
    },
    cleanServData() {
      this.form.startTime = ''
      this.form.endTime = ''
      this.form.ee = ''
      this.form.shopcode = ''
      this.form.status = ''
      this.form.pscode = []
    },
    async getData(reqParams) {
      const fetch = service.serviceInfo.findEeSpecial
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.tableService.reloadData({
        fetch,
        params
      })
    },

    exportEeSpecial() {
      const head = {
        eecode: '员工工号',
        eename: '员工姓名',
        psname: '职务',
        pslname: '职务级别',
        status: '状态',
        jfyjMoney: '剪发原价',
        jfhyjMoney: '洗剪吹会员价',
        shopcode: '店号',
        shopname: '所属店名',
        speprice: '门店执行原价',
        value: '门店执行会员价',
        istsj: '价格类型',
        inTime: '入职日期'
      }
      if (this.form.shopcode == '' && this.form.ee == '') {
        if (
          this.form.pscode.length == 0 &&
          this.form.status == '' &&
          this.form.shopcode == '' &&
          this.form.createTimeRange == ''
        ) {
          yid.util.warning('由于数据量太大，请带一个筛选条件')
          return
        }
      }
      service.serviceInfo.findEeSpecialList({ ...this.form }).then(res => {
        if (res.resp_code == '200') {
          res.data.forEach(item => {
            if (item.status == '1') {
              item.status = '在职'
            } else {
              item.status = '离职'
            }
            if (item.discountType == '2' && item.dtype == '1') {
              item.value = item.value + '折'
            }
            if (item.discountType == '1' && item.dtype == '1') {
              item.value = item.value + '折'
            }
          })
          exportExecl(head, res.data, '洗剪吹价导出')
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },

    setEeSpecial() {
      this.eeData.title = '员工价格设置'
      this.eeData.visible = true
      this.eeData.isSynch = false
    },
    //导入员工特殊价价
    importSpecial() {
      this.importSpecialData.isSynch = false
      this.importSpecialData.title = '批量导入员工价格'
      this.importSpecialData.visible = true
      this.myheaders = {
        authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
      }
      this.$refs.uploadExcel.clearFiles()
    },
    importCancel() {
      this.importSpecialData.visible = false
    },
    handleAvatarExcelSuccess(res) {
      this.importSpecialData.employees = res.data
      console.log(this.mutiImportDialog.employees)
    },
    beforeAvatarExcelUpload(file) {
      const isJPG = file.type.indexOf('sheet') || file.type.indexOf('excel')
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        yid.util.error('上传excel只能是 xls/xlsx 格式!')
        return
      }
      if (!isLt2M) {
        yid.util.error('上传excel大小不能超过 10MB!')
        return
      }
      return isJPG && isLt2M
    },
    saveImport() {
      if (this.importSpecialData.employees.length == 0) {
        yid.util.info('无导入数据')
      } else {
        if (this.importSpecialData.isSynch) {
          this.isSynch = 1
        } else {
          this.isSynch = 0
        }
        const param = {
          maps: this.importSpecialData.employees,
          isSynch: this.isSynch
        }
        service.serviceInfo.specialBatchImport(param).then(res => {
          if (res.resp_code == 200) {
            yid.util.success('导入成功')
            this.importCancel()
            this.queryServData()
          }
        })
      }
    },
    downExcelTemplate() {
      download(
        yid.config.API.BASE + 'api-base/serviceinfo/specialExcelTemplate',
        {}
      )
    },
    selectionData(val) {
      var newArr = []

      var arrId = []

      for (let item of val) {
        if (arrId.indexOf(item['eecode']) == -1) {
          arrId.push(item['eecode'])

          newArr.push(item)
        }
      }
      this.eeObj = newArr
    },
    sureSelect() {
      if (this.eeObj.length <= 0) {
        return yid.util.error('请选择一个员工修改')
      } else {
        for (let index in this.eeObj) {
          let item = this.eeObj[index]
          if (this.eeData.isSynch) {
            item.isSelect = 1
          } else {
            item.isSelect = 0
          }
          if (item.eename) {
            if (
              !item.jfhyjMoney ||
              !item.jfyjMoney ||
              item.jfhyjMoney == '' ||
              item.jfyjMoney == ''
            ) {
              yid.util.error(item.eename + '的剪发原价或会员价不能为空！')
              return
            } else {
              item.entryTime = null
            }
          }
        }
        service.serviceInfo.setEeSpecial(this.eeObj).then(res => {
          if (res.resp_code == 200) {
            yid.util.success('设置成功')
            this.eeData.visible = false
            this.queryServData()
          }
        })
      }
    },
    levelCancel() {
      this.eeData.visible = false
    },
    //设置剪发价格
    setPrice(row) {
      this.price.title = '员工价格设置'
      this.price.visible = true
      this.price.eename = row.eename
      this.price.eecode = row.eecode
      this.price.jfyjMoney = ''
      this.price.jfhyjMoney = ''
      this.price.isSynch = false
      this.eePrice.push(this.price)
    },
    sure() {
      if (!this.price.jfyjMoney || !this.price.jfhyjMoney) {
        yid.util.error('剪发原价或剪发会员价不能为空！')
        return
      }
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      if (
        !numRe.test(this.price.jfyjMoney) ||
        !numRe.test(this.price.jfhyjMoney)
      ) {
        yid.util.error('请输入正整数!')
        return
      }
      if (this.price.isSynch) {
        this.price.isSelect = 1
      } else {
        this.price.isSelect = 0
      }
      service.serviceInfo.setEeSpecial(this.eePrice).then(res => {
        if (res.resp_code == 200) {
          this.eePrice = []
          yid.util.success('设置成功')
          this.price.visible = false
          this.queryServData()
        }
      })
    },
    cancel() {
      this.eePrice = []
      this.price.visible = false
    },
    selectLog(row) {
      this.updateLog.title = row.eename + '的修改记录'
      this.updateLog.visible = true
      service.serviceInfo.selectSpecialLog(row).then(res => {
        if (res.resp_code == 200) {
          this.updateLog.data = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.margin5 {
  margin: 3px 2px;
}

.mutirow {
  flex-wrap: wrap;

  .el-tag {
    width: 100%;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
