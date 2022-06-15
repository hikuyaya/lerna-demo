<template>
  <div>
    <el-collapse-transition>
      <div v-show="transactionShow">
        <el-row :gutter="20">
          <el-col :span="2"
            ><el-button @click="openImport" type="primary"
              >导入流水</el-button
            ></el-col
          >
          <el-col :span="2"
            ><el-button @click="autoLock" type="primary"
              >自动对账</el-button
            ></el-col
          >
          <el-col :span="2"
            ><el-button @click="doLock" type="primary"
              >手动对账</el-button
            ></el-col
          >
          <el-col :span="2"
            ><el-button @click="doFree" type="primary"
              >解除对账</el-button
            ></el-col
          >
          <el-col :span="2"
            ><el-button @click="toFundhc" type="primary"
              >回存单标记</el-button
            ></el-col
          >
          <!--                    <el-col :span="2"><el-button @click="saveMemo" type="primary">流水备注</el-button></el-col>-->
          <!--            <el-col :span="2"><el-button @click="openImport">拆分流水</el-button></el-col>-->
          <!--                    <el-col :span="2"><el-button @click="deleteFd" type="primary">删除流水</el-button></el-col>-->
        </el-row>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-row :gutter="5" width="100%">
          <el-form
            ref="elSearchForm"
            :model="searchForm"
            inline
            :rules="rules.searchForm">
            <el-form-item label="财务片区：" prop="facode">
              <fa-select :code.sync="searchForm.facode"></fa-select>
            </el-form-item>
            <el-form-item label="对账日期：" prop="srq">
              <date-range
                :srq.sync="searchForm.srq"
                :erq.sync="searchForm.erq"></date-range>
            </el-form-item>
            <el-form-item label="流水日期：" prop="sserirq">
              <date-range
                :srq.sync="searchForm.sserirq"
                :erq.sync="searchForm.eserirq"></date-range>
            </el-form-item>
            <el-form-item label="对账状态：">
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
            <el-form-item label="类型：">
              <el-select
                style="width: 100px"
                v-model="searchForm.ctype"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="item in ctypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              ><el-button @click="getFd" type="primary"
                >查询</el-button
              ></el-form-item
            >
            <el-form-item
              ><el-button @click="resetElSearchForm" type="primary"
                >重置</el-button
              ></el-form-item
            >
          </el-form>
        </el-row>
        <el-row :gutter="5" width="100%">
          <!--  资金表  -->
          <el-col :span="11">
            <yid-table
              ref="fdTable"
              :data="fdTableData"
              border
              width="100%"
              :height="wheight"
              @selection-change="handleFdTableSelectionChange">
              <yid-table-column type="selection" width="50"></yid-table-column>
              <yid-table-column
                prop="rq"
                label="日期"
                width="100"></yid-table-column>
              <yid-table-column
                prop="shopcode"
                label="门店编码"
                width="90"></yid-table-column>
              <yid-table-column
                prop="shopname"
                label="门店名称"
                width="90"></yid-table-column>
              <yid-table-column
                prop="sysje"
                label="系统金额"
                width="80"></yid-table-column>
              <yid-table-column
                prop="typesshow"
                label="类型"
                width="60"></yid-table-column>
              <yid-table-column prop="status" label="状态" width="70">
                <template slot-scope="scope">{{
                  scope.row.status == '1' ? '已对账' : '未对账'
                }}</template>
              </yid-table-column>
              <yid-table-column
                prop="fdlist"
                label="对账明细"
                width="220"
                :show-overflow-tooltip="false"
                :render-header="renderHeader">
                <template slot-scope="scope">
                  <el-row v-for="fd in scope.row.fdlist">
                    {{
                      fd.rowindex +
                      '|' +
                      fd.je +
                      '|' +
                      fd.serije +
                      '|' +
                      (fd.inputtype == '1' ? '导入' : '拆分') +
                      '|' +
                      fd.crowindex +
                      '|' +
                      fd.serirq
                    }}
                  </el-row>
                </template>
              </yid-table-column>
            </yid-table>
          </el-col>
          <!--  流水表  -->
          <el-col :span="13">
            <yid-table
              ref="unbalanceTable"
              :data="unbalanceTableData"
              border
              width="100%"
              :height="wheight"
              @selection-change="handleUnbalanceTableSelectionChange">
              <yid-table-column type="selection" width="50"></yid-table-column>
              <yid-table-column
                prop="serirq"
                label="日期"
                width="100"></yid-table-column>
              <!--        <yid-table-column prop="rowindex" label="流水行号" width="80"></yid-table-column>
                                    <yid-table-column prop="crowindex" label="折分行号" width="80"></yid-table-column>-->
              <yid-table-column
                prop="je"
                label="对账金额"
                width="80"></yid-table-column>
              <yid-table-column prop="paycode" label="类型" width="80">
                <template slot-scope="scope">{{
                  showPaycode(scope.row.paycode)
                }}</template>
              </yid-table-column>
              <yid-table-column
                prop="serije"
                label="流水金额"
                width="80"></yid-table-column>
              <yid-table-column prop="inputtype" label="导入类型" width="80">
                <template slot-scope="scope">{{
                  scope.row.inputtype == 1 ? '导入' : '拆分'
                }}</template>
              </yid-table-column>
              <yid-table-column prop="memo" label="流水备注" width="170">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="2"
                      ><i
                        class="el-icon-edit"
                        @click="saveMemoOne(scope.row)"></i
                    ></el-col>
                    <el-col :span="8">{{ scope.row.memo }}</el-col>
                  </el-row>
                </template>
              </yid-table-column>
              <yid-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-link
                    type="primary"
                    v-if="scope.row.inputtype == 1"
                    @click="toSplit(scope.row)"
                    >拆分</el-link
                  >
                  <el-link
                    type="primary"
                    @click="deleteFdOne(scope.row)"
                    style="margin-left: 5px"
                    >删除</el-link
                  >
                </template>
              </yid-table-column>
            </yid-table>
          </el-col>
        </el-row>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <!--  备用金回存单操作 -->
      <div v-show="!transactionShow">
        <el-row :gutter="20">
          <el-col :span="2"
            ><el-page-header @back="backFd"></el-page-header
          ></el-col>
          <el-col :span="4">
            设置处理状态标记:
            <el-select
              style="width: 100px"
              v-model="isFaSelect"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in isfaList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2"
            ><el-button @click="updateFundhc">保存</el-button></el-col
          >
        </el-row>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-row :gutter="5">
          <yid-table
            ref="hcTable"
            :data="hcTableData"
            border
            width="100%"
            @selection-change="handlehcTableSelectionChange">
            <yid-table-column type="selection" width="40"></yid-table-column>
            <yid-table-column
              prop="rq"
              label="日期"
              width="100"></yid-table-column>
            <yid-table-column
              prop="billcode"
              label="单据编码"
              width="160"></yid-table-column>
            <yid-table-column
              prop="shopcode"
              label="门店编码"
              width="80"></yid-table-column>
            <yid-table-column
              prop="shopname"
              label="门店名称"
              width="120"></yid-table-column>
            <yid-table-column
              prop="auditBy"
              label="审批人"
              width="80"></yid-table-column>
            <yid-table-column
              prop="auditTime"
              label="审批时间"
              width="220"></yid-table-column>
            <yid-table-column
              prop="money"
              label="金额"
              width="80"></yid-table-column>
            <yid-table-column prop="isFa" label="状态" width="80">
              <template slot-scope="scope">
                {{ scope.row.isFa == 0 ? '对账' : '非对账' }}
              </template>
            </yid-table-column>
            <yid-table-column prop="famemo" label="流水备注" width="410">
              <template slot-scope="scope"
                ><el-input v-model="scope.row.famemo"></el-input
              ></template>
            </yid-table-column>
          </yid-table>
        </el-row>
      </div>
    </el-collapse-transition>

    <!-- 导入弹窗 -->
    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="toImportCancel"
      width="700px">
      <import-excel-form
        ref="elImport"
        :excelName="importDialog.excelName"
        :importFunc="importFunc"
        :importCancel="importCancel"
        :importPath="importDialog.importPath">
        <el-form
          ref="elImportForm"
          :model="importForm"
          :rules="rules.importForm">
          <!--                    <el-form-item label="流水日期：" prop="sserirq">-->
          <!--                        <date-range :srq.sync="importForm.sserirq" :erq.sync="importForm.eserirq"></date-range>-->
          <!--                    </el-form-item>-->
          <!--                    <el-form-item label="财务片区：" prop="facode">-->
          <!--                        <fa-select :code.sync="importForm.facode"></fa-select>-->
          <!--                    </el-form-item>-->
          <el-form-item label="导入方式：" prop="importType">
            <el-select
              style="width: 100px"
              v-model="importForm.importType"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in itList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </import-excel-form>
    </yid-dialog>

    <!-- 拆分弹窗 -->
    <yid-dialog
      :title="splitDialog.title"
      :visible.sync="splitDialog.visible"
      width="400px">
      <el-form ref="elSplitForm" :model="splitDialog.data">
        <el-form-item label="流水日期：" prop="serirq">
          {{ splitDialog.data.serirq }}
        </el-form-item>
        <el-form-item label="可拆金额：" prop="je">
          {{ splitDialog.data.je }}
        </el-form-item>
        <el-form-item label="财务片区：" prop="facode">
          <fa-select
            :code="splitDialog.data.facode"
            :disabled="true"></fa-select>
        </el-form-item>
        <el-form-item label="类型：" prop="paycode">
          <el-select
            style="width: 100px"
            v-model="splitDialog.data.paycode"
            disabled
            placeholder="请选择">
            <el-option
              v-for="item in paycodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拆分金额：" prop="splitje">
          <el-input
            v-model="splitDialog.data.splitje"
            type="number"
            style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSplit">拆分流水</el-button>
          <el-button @click="cencelSplit">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <!-- 流水备注 -->
    <yid-dialog
      :title="fdmemoDialog.title"
      :visible.sync="fdmemoDialog.visible"
      @close="closeFdmemoDialog"
      width="300px">
      <el-form ref="dmemoForm" :model="fdmemoDialog.data">
        <el-form-item label="流水备注：" prop="memo">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入流水备注"
            v-model="fdmemoDialog.data.memo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSaveMemoOne">保存备注</el-button>
          <el-button @click="closeFdmemoDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'

import importExcelForm from './components/importExcelForm'
import faSelect from './components/faSelect'
import dateRange from './components/dateRange'
import * as math from 'mathjs'

export default {
  components: { importExcelForm, faSelect, dateRange },
  name: 'financialdaily',
  data() {
    return {
      transactionShow: true,
      isFaSelect: '',
      wheight: window.innerHeight - 320,
      rules: {
        searchForm: {
          facode: [
            { required: true, message: '请选择财务片区', trigger: 'change' }
          ],
          srq: [{ required: true, message: '请选择日期', trigger: 'change' }],
          sserirq: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ]
        },
        importForm: {
          // facode:[
          //     {required: true, message: '请选择财务片区', trigger: 'change'}
          // ],
          importType: [
            { required: true, message: '请选择导入方式', trigger: 'change' }
          ]
          // sserirq:[
          //     {required: true, message: '请选择日期', trigger: 'change'}
          // ],
        }
      },
      importDialog: {
        title: '日结对账导入',
        visible: false,
        datas: [],
        excelName: '财务对账模板.xls',
        importPath: 'api-finance/financialdaily/convertFd'
      },
      splitDialog: {
        title: '拆分流水',
        visible: false,
        data: {}
      },
      fdmemoDialog: {
        title: '流水备注',
        visible: false,
        data: {}
      },
      importForm: {
        //导入流水表单model
        facode: '',
        sserirq: '',
        eserirq: '',
        importType: '',
        serirqRange: '',
        list: []
      },
      searchForm: {
        //查询搜索表单model
        facode: '',
        srq: '',
        erq: '',
        sserirq: '',
        eserirq: '',
        ctype: '',
        paycode: '',
        status: '',
        type: ''
      },
      isfaList: [
        { value: '0', label: '对账' },
        { value: '2', label: '非对账' }
      ],
      statusList: [
        { value: '0', label: '未对账' },
        { value: '1', label: '已对账' }
      ],
      ctypeList: [
        { value: '1', label: '现金' },
        { value: '2', label: 'POS' },
        { value: '3', label: '微信' },
        { value: '5', label: '医美' },
        { value: '6', label: '口碑' },
        { value: '4', label: '回存' }
      ],
      paycodeList: [
        { value: '01', label: '现金' },
        { value: '07', label: 'POS' },
        { value: '23', label: '微信' },
        { value: '26', label: '医美' },
        { value: '33', label: '口碑' }
      ],
      itList: [
        { value: '1', label: '覆盖' },
        { value: '2', label: '补充' }
      ],
      fdTableData: [], //资金表数据
      fdTableMultipleSelection: [], //资金表中选择的数据
      unbalanceTableData: [], //流水表数据
      unbalanceTableMultipleSelection: [], //流水表中选择的数据
      hcTableData: [], //回存单数据
      hcTableMultipleSelection: [], //回存单中选择的数据
      tempOne: {} //待操作数据缓存量
    }
  },
  mounted() {
    this.test()
  },
  watch: {
    // 'importForm.serirqRange'(v) {
    //     this.importForm.sserirq = v?v[0]:"";
    //     this.importForm.eserirq = v?v[1]:"";
    // },
    'searchForm.ctype'(v) {
      switch (v) {
        case '1':
          this.searchForm.paycode = '01'
          this.searchForm.type = '1'
          break
        case '2':
          this.searchForm.paycode = '07'
          this.searchForm.type = '1'
          break
        case '3':
          this.searchForm.paycode = '23'
          this.searchForm.type = '1'
          break
        case '4':
          this.searchForm.paycode = '01'
          this.searchForm.type = '2'
          break
        case '5':
          this.searchForm.paycode = '26'
          this.searchForm.type = '1'
          break
        case '6':
          this.searchForm.paycode = '33'
          this.searchForm.type = '1'
          break
        default:
          this.searchForm.paycode = ''
          this.searchForm.type = ''
      }
    }
  },
  computed: {},
  methods: {
    /*            openDetails(row){
            console.log('row',row)
                        },*/
    test() {
      this.searchForm = {
        //查询搜索表单model
        facode: '',
        srq: '',
        erq: '',
        sserirq: '',
        eserirq: '',
        ctype: '',
        paycode: '',
        status: '',
        type: ''
      }
    },
    renderHeader(h, { column }) {
      return h('div', [
        h('span', column.label),
        h(
          'el-tooltip',
          {
            undefined,
            props: {
              undefined,
              effect: 'dark',
              content: '流水行号|对账金额|流水金额|类型|拆分行号|流水日期',
              placement: 'top'
            }
          },
          [
            h('i', {
              undefined,
              class: 'el-icon-question',
              style: 'color:#409eff;margin-left:5px;cursor:pointer;'
            })
          ],
          { content: '流水行号|对账金额|流水金额|类型|拆分行号|流水日期' }
        )
      ])
    },
    resetElSearchForm() {
      this.searchForm = {
        //查询搜索表单model
        facode: '',
        srq: '',
        erq: '',
        sserirq: '',
        eserirq: '',
        ctype: '',
        paycode: '',
        status: '',
        type: ''
      }
    },
    showPaycode(v) {
      let type = ''
      switch (v) {
        case '01':
          type = '现金'
          break
        case '07':
          type = 'POS'
          break
        case '23':
          type = '微信'
          break
        case '26':
          type = '医美'
          break
        case '33':
          type = '口碑'
          break
        default:
          type = ''
      }
      return type
    },
    openImport() {
      if (this.searchForm.facode) {
        this.importForm.facode = this.searchForm.facode
      } else {
        this.$message({ type: 'error', message: '请选择财务片区' })
        return false
      }
      if (this.searchForm.sserirq) {
        this.importForm.sserirq = this.searchForm.sserirq
      } else {
        this.$message({ type: 'error', message: '请选择流水开始时间' })
        return false
      }
      if (this.searchForm.eserirq) {
        this.importForm.eserirq = this.searchForm.eserirq
      } else {
        this.$message({ type: 'error', message: '请选择流水结束时间' })
        return false
      }
      this.importDialog.visible = true
    },
    toImportCancel() {
      this.$refs['elImport'].cancelImp()
    },
    importCancel() {
      (this.importForm = {
        //导入流水表单model
        facode: '',
        sserirq: '',
        eserirq: '',
        importType: '',
        serirqRange: '',
        list: []
      }),
        (this.importDialog.visible = false)
    },
    closeFdmemoDialog() {
      this.fdmemoDialog.visible = false
      this.fdmemoDialog.data = {}
    },
    importFunc(list) {
      //导入流水
      if (!list) {
        this.$message({
          type: 'error',
          message: '导入解析数据为空，请检查导入文件内容是否合规。'
        })
        return false
      } else {
        this.importForm.list = list
      }
      this.$refs['elImportForm'].validate(valid => {
        if (valid) {
          service.finance.financeDaily.importFd(this.importForm).then(res => {
            let result = res.data
            if (result.resp_code == 200) {
              this.$message({ type: 'success', message: result.resp_msg })
              this.importCancel()
            } else {
              this.$message({ type: 'error', message: result.resp_msg })
              return false
            }
          })
        }
      })
    },
    handleFdTableSelectionChange(v) {
      this.fdTableMultipleSelection = v
    },
    handleUnbalanceTableSelectionChange(v) {
      this.unbalanceTableMultipleSelection = v
    },
    handlehcTableSelectionChange(v) {
      this.hcTableMultipleSelection = v
    },
    getFd() {
      //获取资金数据和流水数据,刷新表格
      this.$refs['elSearchForm'].validate(valid => {
        if (valid) {
          service.finance.financeDaily
            .getFd(this.searchForm)
            .then(res => {
              if (res.resp_code == 200) this.fdTableData = res.data
            })
            .then(() => {
              service.finance.financeDaily
                .getUnbalance(this.searchForm)
                .then(res => {
                  if (res.resp_code == 200) this.unbalanceTableData = res.data
                })
            })
        }
      })
    },
    autoLock() {
      //自动对账
      this.$refs['elSearchForm'].validate(valid => {
        if (valid) {
          service.finance.financeDaily
            .autoLock(this.searchForm)
            .then(res => {
              res.resp_code == 200
                ? this.$message({ type: 'success', message: res.resp_msg })
                : this.$message({ type: 'error', message: res.resp_msg })
            })
            .then(() => {
              this.getFd()
            })
        }
      })
    },
    doLock() {
      //手动对账
      if (this.fdTableMultipleSelection.length != 1) {
        this.$message({
          type: 'info',
          message: '手动对账时，门店数据只能选择一个'
        })
        return false
      }
      if (this.unbalanceTableMultipleSelection.length < 1) {
        this.$message({ type: 'info', message: '请勾选流水数据' })
        return false
      }
      const fd = Object.assign(this.fdTableMultipleSelection[0])
      const seriCB = Object.assign(this.unbalanceTableMultipleSelection)
      if (fd.status == '1') {
        this.$message({ type: 'info', message: '该数据已完成对账' })
        return false
      }
      let tempje = 0
      let list = []
      for (let i = 0; i < seriCB.length; i++) {
        let temp = seriCB[i]
        if (temp.paycode == fd.paycode) {
          tempje = tempje + Number(temp.je)
          temp.sysje = Number(fd.sysje)
          temp.type = fd.type
          temp.rq = fd.rq
          temp.shopid = fd.shopid
          temp.shopcode = fd.shopcode
          temp.billcode = fd.billcode
          temp.billtype = fd.billtype
          list.push(temp)
        } else {
          this.$message({ type: 'info', message: '所勾选的数据金额类型不统一' })
          return false
        }
      }
      debugger
      //现金金额必须完全匹配，非现金金额可以有1元浮动
      if (
        (fd.paycode == '01' && fd.sysje == tempje) ||
        (fd.paycode != '01' &&
          ((math.round(math.chain(fd.sysje).subtract(tempje).done(), 2) < 1 &&
            math.round(math.chain(fd.sysje).subtract(tempje).done(), 2) > -1) ||
            (math.round(math.chain(tempje).subtract(fd.sysje).done(), 2) < 1 &&
              math.round(math.chain(tempje).subtract(fd.sysje).done(), 2) >
                -1)))
      ) {
        service.finance.financeDaily
          .doLock(list)
          .then(res => {
            res.resp_code == 200
              ? this.$message({ type: 'success', message: res.resp_msg })
              : this.$message({ type: 'error', message: res.resp_msg })
          })
          .then(() => {
            this.getFd()
          })
      } else {
        this.$message({ type: 'info', message: '金额无法匹配' })
        return false
      }
    },
    doFree() {
      //解除对账
      if (this.fdTableMultipleSelection.length < 1) {
        this.$message({ type: 'info', message: '请勾选要解除对账的资金数据' })
        return false
      }
      let list = this.fdTableMultipleSelection.filter(fd => fd.status == '1')
      if (list.length < 1) {
        this.$message({ type: 'info', message: '请勾选已对账的资金数据' })
        return false
      }
      service.finance.financeDaily
        .doFree(list)
        .then(res => {
          if (res.resp_code == 200) this.fdTableData = res.data
          return res
        })
        .then(preRes => {
          if (preRes.resp_code == 200) this.getFd()
        })
    },
    toSplit(row) {
      //拆分流水数据
      if (row.inputtype == '2') {
        this.$message({ type: 'info', message: '只有导入的流水数据才能拆分' })
        return false
      }
      this.splitDialog.data = Object.assign(row)
      this.splitDialog.visible = true
    },
    cencelSplit() {
      this.splitDialog.data = {}
      this.splitDialog.visible = false
    },
    doSplit() {
      //拆分流水数据
      if (
        this.splitDialog.data.splitje <= 0 ||
        this.splitDialog.data.splitje >= this.splitDialog.data.je
      ) {
        this.$message({
          type: 'info',
          message: '拆分金额必须小于可拆金额，且不能为负数'
        })
        return
      }
      service.finance.financeDaily
        .doSplit(this.splitDialog.data)
        .then(res => {
          if (res.resp_code == 200) {
            this.$message({ type: 'success', message: res.resp_msg })
            this.cencelSplit()
          } else {
            this.$message({ type: 'error', message: res.resp_msg })
          }
          return res
        })
        .then(res => {
          if (res.resp_code == 200) {
            service.finance.financeDaily
              .getUnbalance(this.searchForm)
              .then(res => {
                if (res.resp_code == 200) this.unbalanceTableData = res.data
              })
          }
        })
    },
    deleteFdOne(row) {
      //删除流水数据
      let fdlist = []
      fdlist.push(Object.assign(row))
      service.finance.financeDaily
        .deleteFd(fdlist)
        .then(res => {
          if (res.resp_code == 200) {
            this.$message({ type: 'success', message: res.resp_msg })
          } else {
            this.$message({ type: 'error', message: res.resp_msg })
          }
          return res
        })
        .then(res => {
          if (res.resp_code == 200) {
            service.finance.financeDaily
              .getUnbalance(this.searchForm)
              .then(res => {
                if (res.resp_code == 200) this.unbalanceTableData = res.data
              })
          }
        })
    },
    deleteFd() {
      //删除流水数据
      if (this.unbalanceTableMultipleSelection.length < 1) {
        this.$message({ type: 'info', message: '请勾选要删除的流水数据' })
        return false
      }
      service.finance.financeDaily
        .deleteFd(this.unbalanceTableMultipleSelection)
        .then(res => {
          if (res.resp_code == 200) {
            this.$message({ type: 'success', message: res.resp_msg })
          } else {
            this.$message({ type: 'error', message: res.resp_msg })
          }
          return res
        })
        .then(res => {
          if (res.resp_code == 200) {
            service.finance.financeDaily
              .getUnbalance(this.searchForm)
              .then(res => {
                if (res.resp_code == 200) this.unbalanceTableData = res.data
              })
          }
        })
    },
    saveMemoOne(row) {
      this.fdmemoDialog.data = row
      this.fdmemoDialog.visible = true
    },
    doSaveMemoOne() {
      let fdlist = []
      fdlist.push(Object.assign(this.fdmemoDialog.data))
      service.finance.financeDaily
        .saveMemo(fdlist)
        .then(res => {
          if (res.resp_code == 200) {
            this.$message({ type: 'success', message: res.resp_msg })
          } else {
            this.$message({ type: 'error', message: res.resp_msg })
          }
          return res
        })
        .then(res => {
          if (res.resp_code == 200) {
            service.finance.financeDaily
              .getUnbalance(this.searchForm)
              .then(res => {
                if (res.resp_code == 200) {
                  this.unbalanceTableData = res.data
                  this.closeFdmemoDialog()
                }
              })
          }
        })
    },
    saveMemo() {
      //批量修改流水备注
      if (this.unbalanceTableMultipleSelection.length < 1) {
        this.$message({ type: 'info', message: '请勾选要修改备注的流水数据' })
        return false
      }
      service.finance.financeDaily
        .saveMemo(this.unbalanceTableMultipleSelection)
        .then(res => {
          if (res.resp_code == 200) {
            this.$message({ type: 'success', message: res.resp_msg })
          } else {
            this.$message({ type: 'error', message: res.resp_msg })
          }
          return res
        })
        .then(res => {
          if (res.resp_code == 200) {
            service.finance.financeDaily
              .getUnbalance(this.searchForm)
              .then(res => {
                if (res.resp_code == 200) this.unbalanceTableData = res.data
              })
          }
        })
    },
    toFundhc() {
      this.$refs['elSearchForm'].validate(valid => {
        if (valid) {
          service.finance.financeDaily
            .getFundhcList(this.searchForm)
            .then(res => {
              if (res.resp_code == 200) {
                this.hcTableData = res.data
                this.transactionShow = !this.transactionShow
              }
            })
        }
      })
    },
    backFd() {
      this.getFd()
      this.transactionShow = !this.transactionShow
    },
    updateFundhc() {
      if (this.hcTableMultipleSelection.length < 1) {
        this.$message({
          type: 'info',
          message: '请勾选需要修改保存的备用回存单'
        })
        return
      }
      let list = Object.assign(this.hcTableMultipleSelection)
      if ('' != this.isFaSelect) list.forEach(hc => (hc.isFa = this.isFaSelect))
      service.finance.financeDaily
        .updateFundhc(list)
        .then(res => {
          if (res.resp_code == 200) {
            this.hcTableData = res.data
          } else {
            this.$message({ type: 'error', message: res.resp_msg })
          }
          return res
        })
        .then(res => {
          if (res.resp_code == 200)
            service.finance.financeDaily
              .getFundhcList(this.searchForm)
              .then(result => {
                if (result.resp_code == 200) this.hcTableData = result.data
              })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 30px;
  /*overflow: auto;*/
  white-space: nowrap;
}
.el-tooltip__popper {
  max-width: 400px !important;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
}
</style>
