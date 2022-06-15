<template>
  <div class="tcConfig">
    <el-collapse-transition>
      <div v-show="visibleList.manage">
        <el-button @click="showDialogType()" type="primary">新增</el-button>
        <el-form
          ref="searchForm"
          inline
          :model="searchForm"
          style="margin-top: 8px">
          <el-form-item label="提成方案：" prop="pcodename">
            <el-input
              v-model="searchForm.pcodename"
              clearable
              style="width: 150px"
              placeholder="方案编码/方案名称"></el-input>
          </el-form-item>

          <el-form-item label="员工：" prop="ecodename">
            <el-input
              v-model="searchForm.ecodename"
              clearable
              style="width: 200px"
              placeholder="员工编码/员工名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="search()" type="primary">查询</el-button>
          </el-form-item>
        </el-form>

        <yid-table
          pagination
          ref="tableRm"
          :data="rManageList"
          style="margin-top: 8px">
          <yid-table-column
            label="编码"
            width="100"
            prop="prmcode"></yid-table-column>
          <yid-table-column
            label="提成方案名称"
            prop="prmname"></yid-table-column>
          <yid-table-column label="适用员工" prop="employeeList">
            <template slot-scope="scope">
              <div>
                <el-row gutter="8"
                  >共{{
                    scope.row.employeeList ? scope.row.employeeList.length : 0
                  }}人</el-row
                >
                <el-row gutter="8"
                  ><el-link
                    type="primary"
                    @click="showSelectEmployeeDialog(scope.row)"
                    >查看修改</el-link
                  ></el-row
                >
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="备注" prop="memo"></yid-table-column>
          <yid-table-column label="状态" width="160">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                inactive-color="#DCDFE6"
                active-color="#409EFF"
                active-text="启用"
                inactive-text="停用"
                active-value="1"
                inactive-value="2"
                @change="handleSwitch($event, scope.row.id, scope.row.type)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" width="200" prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="showDialogType(scope.row)"
                >编辑</el-link
              >
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="toItem(scope.row)"
                >设置提成
              </el-link>
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="copyManage(scope.row)"
                >复制
              </el-link>
            </template>
          </yid-table-column>
        </yid-table>

        <!--新增个人提成方案弹出层-->
        <yid-dialog
          :title="dialogType.title"
          :visible.sync="dialogType.visible"
          @close="dialogCancel"
          width="400px">
          <el-form
            label-width="80px"
            ref="formRm"
            :model="dialogType.model"
            :rules="rules">
            <el-form-item label="方案名称" prop="prmname">
              <el-input
                clearable
                v-model="dialogType.model.prmname"
                placeholder="请输入方案名称"
                :rules="rules.prmname"></el-input>
            </el-form-item>
            <el-form-item
              label="复制方案"
              prop="copyId"
              v-if="!dialogType.model.id">
              <el-select
                v-model="dialogType.model.copyId"
                placeholder="选择方案">
                <el-option
                  v-for="item in dialogType.items"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="适用人员">
              <el-button type="primary" @click="openEePanel()"
                >选择员工</el-button
              >
              {{
                dialogType.model.psList.length &&
                dialogType.model.psList.length > 0
                  ? '共选中' + dialogType.model.psList.length + '人'
                  : ''
              }}
            </el-form-item>
            <el-form-item label="备注" prop="memo">
              <el-input
                type="textarea"
                v-model="dialogType.model.memo"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="saveOrUpdate">确定</el-button>
            </el-form-item>
          </el-form>
        </yid-dialog>

        <yid-dialog
          title="选择员工"
          :visible.sync="employeeDialog.visible"
          @close="closeEeDialog"
          width="1100px">
          <employee
            :confirmFunc="checkEmployee"
            :defaultRightData="employeeDialog.defaultData"></employee>
        </yid-dialog>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="visibleList.group">
        <tcGroups ref="tccc" :type="type"></tcGroups>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'

import tcGroups from './tcGroups'
import employee from './components/panelEmployee'

export default {
  components: {
    tcGroups,
    employee
  },
  props: ['type'],
  name: 'tcEeManagement',
  data() {
    return {
      searchForm: {
        pcodename: '',
        ecodename: ''
      },
      isAdd: true, //判断是新增还是编辑 先保留
      isSeeEmployee: false,
      employeeDialog: { visible: false, defaultData: [] },
      visibleList: { manage: true, group: false },
      dialogType: {
        visible: false,
        title: '个人提成方案名称',
        items: [],
        model: {
          prmname: null,
          memo: null,
          status: '1',
          copyId: '',
          psList: [],
          employeeList: [],
          id: ''
        }
      },
      paginationParam: {
        page: 1,
        limit: 10,
        type: this.type
      },
      rManageList: [],
      rules: {
        prmname: { required: true, message: '请输入方案名称', trigger: 'blur' }
      },
      unableSelectEmployeeList: [] //已经关联了提成方案的门店list，不能在进行选择
    }
  },
  methods: {
    toItem(v) {
      this.visibleList.group = true
      this.visibleList.manage = false
      this.$refs.tccc.rManage = $yid.util.deepClone(v)
      this.$refs.tccc.initGroupList(v.id)
    },
    search() {
      this.paginationParam = { page: 1, limit: 10 }
      this.get(this.searchForm)
    },
    get(req) {
      const fetch = service.chain.royaltyManage.search
      const params = { ...this.paginationParam, ...req, type: this.type }
      this.$refs.tableRm.reloadData({
        fetch,
        params
      })
    },
    saveOrUpdate() {
      if (this.isSeeEmployee) {
        if (this.dialogType.model.psList.length <= 0) {
          $yid.util.error('适用员工必须选择一个')
          return
        }
        let param = $yid.util.deepClone(this.dialogType.model)
        param.type = this.type
        service.chain.royaltyManage.saveEmployee(param).then(res => {
          $yid.util.alert(res.resp_msg)
          this.get()
          this.dialogCancel()
        })
        return
      }

      this.$refs['formRm'].validate(valid => {
        if (valid) {
          let param = $yid.util.deepClone(this.dialogType.model)
          param.type = this.type
          service.chain.royaltyManage.saveEmployee(param).then(res => {
            $yid.util.alert(res.resp_msg)
            this.get()
            this.dialogCancel()
          })
        } else {
          return false
        }
      })
    },
    showSelectEmployeeDialog(row) {
      this.isAdd = false
      this.isSeeEmployee = true
      this.employeeDialog.defaultData = []
      row.employeeList.map(ps => {
        this.employeeDialog.defaultData.push({
          eeid: ps.id,
          eecode: ps.eecode,
          eename: ps.eename,
          id: ps.id
        })
      })
      this.employeeDialog.visible = true

      this.dialogType.model.prmname = row.prmname
      this.dialogType.model.memo = row.memo
      this.dialogType.model.status = row.status
      this.dialogType.model.employeeList = row.employeeList
      this.dialogType.model.id = row.id
      service.chain.royaltyGroup.getList(this.dialogType.model.id).then(res => {
        this.dialogType.model.psList = res.data[0].psList
      })
    },
    showDialogType(model) {
      this.isAdd = model == null
      this.isSeeEmployee = false

      this.employeeDialog.defaultData = []
      if (model) {
        this.dialogType.model = $yid.util.deepClone(model)
        service.chain.royaltyGroup
          .getList(this.dialogType.model.id)
          .then(res => {
            this.dialogType.model.psList = res.data[0].psList
            this.dialogType.model.psList.map(ps => {
              this.employeeDialog.defaultData.push({
                eeid: ps.psid,
                eecode: ps.treekey,
                eename: ps.psname
              })
            })
            this.dialogType.visible = true
          })
      } else {
        this.dialogType.items = []
        this.dialogType.model = {
          prmname: null,
          memo: null,
          status: '1',
          psList: []
        }
        service.chain.royaltyManage
          .getShopManages()
          .then(res => {
            return res.data
          })
          .then(item => {
            item.map(v => {
              if (v && v.id) {
                service.chain.royaltyGroup.getList(v.id).then(res => {
                  res.data.map(group => {
                    this.dialogType.items.push(group)
                  })
                })
              }
            })
            this.dialogType.visible = true
          })
      }
    },
    dialogCancel() {
      this.dialogType.visible = false
    },
    handleSwitch(nstatus, id, type) {
      let param = { id: id, status: nstatus, type: type }
      service.chain.royaltyManage
        .status(param)
        .then(res => {
          $yid.util.alert(res.resp_msg)
          this.get()
        })
        .catch(res => {
          this.get()
        })
    },
    checkEmployee(list) {
      this.dialogType.model.psList = []
      list.map(p =>
        this.dialogType.model.psList.push({
          psid: p.id,
          type: '4',
          treekey: p.eecode,
          psname: p.eename
        })
      )
      if (this.isSeeEmployee) {
        this.saveOrUpdate()
      }
    },
    copyManage(row) {
      service.chain.royaltyManage.copy(row).then(res => {
        $yid.util.alert(res.resp_msg)
        this.get()
      })
    },
    closeEeDialog() {
      this.employeeDialog.visible = false
      this.employeeDialog.defaultData = []
    },
    openEePanel() {
      this.employeeDialog.defaultData = []
      this.dialogType.model.psList.map(ps => {
        this.employeeDialog.defaultData.push({
          eeid: ps.psid,
          eecode: ps.treekey,
          eename: ps.psname
        })
      })
      this.employeeDialog.visible = true
    }
  },
  mounted() {
    this.get()
  }
}
</script>

<style scoped></style>
