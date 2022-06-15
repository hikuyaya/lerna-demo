<template>
  <div class="tcConfig">
    <el-collapse-transition>
      <div v-show="visibleList.manage">
        <el-button @click="showDialogType()" type="primary">新增</el-button>
        <el-row style="color: #409eff; margin: 15px 0"
          >备注：只允许启用一种提成方案！</el-row
        >
        <yid-table pagination ref="tableRm" :data="rManageList">
          <yid-table-column
            label="编码"
            width="100"
            prop="prmcode"></yid-table-column>
          <yid-table-column
            label="提成方案名称"
            prop="prmname"></yid-table-column>
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
                @change="handleSwitch($event, scope.row.id)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" width="150" prop="content">
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
            </template>
          </yid-table-column>
        </yid-table>
        <!--新增提成方案弹出层-->
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
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="visibleList.item">
        <tcConfigCon ref="tccc"></tcConfigCon>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'

import tcConfigCon from './tcConfigCon'

export default {
  components: {
    tcConfigCon
  },
  name: 'tcConfig',
  data() {
    return {
      visibleList: { manage: true, item: false },
      dialogType: {
        visible: false,
        title: '提成方案名称',
        model: { prmname: null, memo: null, status: '1' }
      },
      paginationParam: {
        page: 1,
        limit: 10
      },
      rManageList: [],
      rules: {
        prmname: { required: true, message: '请输入方案名称', trigger: 'blur' }
      }
    }
  },
  methods: {
    toItem(v) {
      this.visibleList.item = true
      this.visibleList.manage = false
      this.$refs.tccc.rManage = $yid.util.deepClone(v)
      this.$refs.tccc.getItems(v)
    },
    get() {
      const fetch = service.tc.tcConfig.page
      const params = this.paginationParam
      this.$refs.tableRm
        .reloadData({
          fetch,
          params
        })
        .catch(err => {
          console.log('分页数据加载失败')
          console.log(err)
          this.rManageList = [
            {
              id: 1,
              prmcode: '001',
              prmname: '最新提成方案',
              memo: '测试备注',
              status: '1'
            }
          ]
        })
    },
    saveOrUpdate() {
      this.$refs['formRm'].validate(valid => {
        if (valid) {
          let param = $yid.util.deepClone(this.dialogType.model)
          service.tc.tcConfig.saveOrUpdate(param).then(res => {
            $yid.util.alert(res.resp_msg)
            this.get()
            this.dialogCancel()
          })
        } else {
          return false
        }
      })
    },
    showDialogType(model) {
      if (model) {
        this.dialogType.model = $yid.util.deepClone(model)
      } else {
        this.dialogType.model = { prmname: null, memo: null, status: '2' }
      }
      this.dialogType.visible = true
    },
    dialogCancel() {
      this.dialogType.visible = false
    },
    handleSwitch(nstatus, id) {
      let param = { id: id, status: nstatus }
      service.tc.tcConfig.status(param).then(res => {
        $yid.util.alert(res.resp_msg)
        this.get()
      })
    }
  },
  mounted() {
    this.get()
  }
}
</script>

<style scoped></style>
