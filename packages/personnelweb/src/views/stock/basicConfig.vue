<template>
  <div class="stock-basicConfig">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基础配置" name="first" style="padding: 20px 0 0 50px">
        <el-form
          ref="form"
          :model="configform"
          label-width="160px"
          color="#000"
          style="color: #000; font-weight: bold">
          <el-form-item label="外卖产品出库方式：">
            <el-radio-group v-model="configform.saleType">
              <el-radio label="1">及时出库（跟随收银单自动出库）</el-radio>
              <el-radio label="2">非及时出库（需手动做出库单出库）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否允许负库存销售：">
            <el-radio-group v-model="configform.allowSale">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-row style="text-align: center; margin-top: 20px">
          <el-button type="primary" @click="saveConfig">保存</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="出库类型配置"
        name="second"
        style="padding: 20px 0 0 20px">
        <el-row>
          <el-button type="primary" round @click="showAddOut(false, '')"
            >+新增出库类型</el-button
          >
        </el-row>
        <yid-table :data="tableDataCk" ref="outtable" style="margin-top: 15px">
          <yid-table-column
            label="类型名称"
            min-width="80"
            prop="sdiname"></yid-table-column>
          <yid-table-column label="状态" min-width="100" prop="isDel">
            <template slot-scope="scope">
              <el-switch
                :disabled="getIsEditCk(scope.row)"
                v-model="scope.row.isDel"
                active-value="0"
                inactive-value="1"
                active-color="#409EFF"
                inactive-color="#DCDFE6"
                @change="updateStatus(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" width="150" prop="username">
            <template slot-scope="scope">
              <el-button
                :disabled="getIsEditCk(scope.row)"
                type="text"
                size="small"
                @click="showAddOut(true, scope.row)"
                >编辑</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>
        <el-row style="text-align: center; margin-top: 20px">
          <el-button type="primary">保存</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="入库类型配置"
        name="third"
        style="padding: 20px 0 0 20px">
        <el-row>
          <el-button type="primary" round @click="showAddIn(false, '')"
            >+新增入库类型</el-button
          >
        </el-row>
        <yid-table :data="tableDataRk" ref="intable" style="margin-top: 15px">
          <yid-table-column
            label="类型名称"
            min-width="80"
            prop="sdiname"></yid-table-column>
          <yid-table-column label="状态" min-width="100" prop="isDel">
            <template slot-scope="scope">
              <el-switch
                :disabled="getIsEditRk(scope.row)"
                v-model="scope.row.isDel"
                active-value="0"
                inactive-value="1"
                active-color="#409EFF"
                inactive-color="#DCDFE6"
                @change="updateStatus(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" width="150" prop="username">
            <template slot-scope="scope">
              <el-button
                :disabled="getIsEditRk(scope.row)"
                type="text"
                size="small"
                @click="showAddIn(true, scope.row)"
                >编辑</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>
        <el-row style="text-align: center; margin-top: 20px">
          <el-button type="primary">保存</el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!--出库弹出层-->
    <yid-dialog
      :title="dialogOut.title"
      :visible.sync="dialogOut.visible"
      @close="cancel"
      width="400px">
      <el-form :model="outForm" ref="outForm" label-width="80px">
        <el-form-item
          label="类型名称"
          prop="sdiname"
          :rules="[{ required: true, message: '类型名称为空' }]">
          <el-input clearable v-model="outForm.sdiname"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="saveAddOut">保存</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
    <!--入库弹出层-->
    <yid-dialog
      :title="dialogIn.title"
      :visible.sync="dialogIn.visible"
      @close="cancel"
      width="400px">
      <el-form :model="inForm" ref="inForm" label-width="80px">
        <el-form-item
          label="类型名称"
          prop="sdiname"
          :rules="[{ required: true, message: '类型名称为空' }]">
          <el-input clearable v-model="inForm.sdiname"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="saveAddIn">保存</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>
<script>
import service from '@src/service'
import yid from '@src/library'
export default {
  name: 'basicConfig',
  data: function () {
    return {
      activeName: 'first',
      value: '0',
      maxCode: 0,
      dialogOut: {
        title: '',
        visible: false
      },
      outForm: {
        sdiname: '',
        type: '2',
        isDel: 0
      },
      dialogIn: {
        title: '',
        visible: false
      },
      inForm: {
        sdiname: '',
        type: '1',
        isDel: 0
      },
      configform: {
        id: '',
        saleType: '',
        allowSale: ''
      },
      tableDataRk: [],
      tableDataCk: []
    }
  },

  mounted() {},
  created() {
    this.getConfigform()
  },

  methods: {
    getConfigform() {
      service.stockConfig
        .orderConfig()
        .then(res => {
          if (res.data == null) {
            this.configform = { id: '', saleType: '', allowSale: '' }
          } else {
            this.configform = res.data
          }
        })
        .catch(err => {
          console.log('初始化库存配置数据失败')
          console.log(err)
        })
    },
    getdictinoutList() {
      const fetch = service.stockInout.dictinoutList
      const params = { page: 1, limit: 10, type: 2 }
      this.$refs.outtable.reloadData({
        fetch,
        params
      })
    },
    getdictininList() {
      const fetch = service.stockInout.dictinoutList
      const params = { page: 1, limit: 10, type: 1 }
      this.$refs.intable.reloadData({
        fetch,
        params
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
      if (tab.name == 'first') {
        // 触发‘库存配置’事件
        this.getConfigform()
      } else if (tab.name == 'second') {
        // 触发‘出库类型配置’事件
        this.getdictinoutList()
      } else if (tab.name == 'third') {
        // 触发‘入库类型配置’事件
        this.getdictininList()
      }
    },
    saveConfig() {
      if (yid.validate.isEmpty(this.configform.saleType)) {
        yid.util.error('外卖产品出库方式为空')
        return
      }
      if (yid.validate.isEmpty(this.configform.allowSale)) {
        yid.util.error('是否允许负库存销售为空')
        return
      }
      service.stockConfig.saveConfig(this.configform).then(res => {
        if (res.resp_code == 200) {
          yid.util.success(res.resp_msg)
          this.getConfigform()
        } else {
          return false
        }
      })
    },
    showAddOut(tag = false, row) {
      this.dialogOut.visible = true
      this.dialogOut.title = tag ? '编辑出库类型' : '添加出库类型'
      if (tag == false) {
        this.$refs['outForm'].resetFields()
        this.outForm.id = ''
        this.outForm.sdiname = ''
        this.outForm.sdicode = ''
        this.outForm.isDel = '0'
        this.outForm.type = '2'
        //this.outForm.revision = '1'
      } else {
        this.outForm.id = row.id
        this.outForm.sdiname = row.sdiname
        this.outForm.sdicode = row.sdicode
        this.outForm.isDel = row.isDel
        this.outForm.type = row.type
        //this.outForm.revision = row.revision
      }
    },
    saveAddOut() {
      this.$refs['outForm'].validate(valid => {
        if (valid) {
          service.stockInout.saveDictinout(this.outForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success(res.resp_msg)
            } else {
              yid.util.error(res.resp_msg)
            }
            this.getdictinoutList()
          })
          this.cancleOut()
        }
      })
    },
    cancleOut() {
      this.dialogOut.visible = false
    },
    showAddIn(tag = false, row) {
      this.dialogIn.visible = true
      this.dialogIn.title = tag ? '编辑入库类型' : '添加入库类型'
      if (tag == false) {
        this.$refs['inForm'].resetFields()
        this.inForm.id = ''
        this.inForm.sdiname = ''
        this.inForm.sdicode = ''
        this.inForm.isDel = '0'
        this.inForm.type = '1'
        //this.inForm.revision = '1'
      } else {
        this.inForm.id = row.id
        this.inForm.sdiname = row.sdiname
        this.inForm.sdicode = row.sdicode
        this.inForm.isDel = row.isDel
        this.inForm.type = row.type
        //this.inForm.revision = row.revision
      }
    },
    saveAddIn() {
      this.$refs['inForm'].validate(valid => {
        if (valid) {
          service.stockInout.saveDictinout(this.inForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success(res.resp_msg)
            } else {
              yid.util.error(res.resp_msg)
            }
            this.getdictininList()
          })
          this.cancleIn()
        }
      })
    },
    cancleIn() {
      this.dialogIn.visible = false
    },
    updateStatus(row) {
      service.stockInout.saveDictinout(row).then(res => {
        if (row.type == '1') {
          this.getdictininList()
        } else {
          this.getdictinoutList()
        }
      })
    },
    getIsEditRk(row) {
      if (Number(row.sdicode) < 0) {
        return true
      } else {
        return false
      }
    },
    getIsEditCk(row) {
      if (Number(row.sdicode) < 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
.config .el-row {
  margin: 10px 0;
  padding-left: 50px;
  display: block;
}
</style>
