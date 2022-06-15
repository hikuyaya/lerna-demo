<template>
  <div class="mtkeysConfig">
    <el-collapse-transition>
      <div v-show="showList">
        <el-button type="primary" @click="dialogFormMt = true"
          >新增账号</el-button
        >
        <el-row style="color: #e6a23c; margin: 15px 0"
          >操作提示：开通美团账号映射权限请联系平台客服办理</el-row
        >
        <yid-table
          pagination
          ref="mtkeystable"
          :data="mtkeysData"
          style="margin-top: 15px">
          <yid-table-column
            label="美团帐号"
            min-width="100"
            prop="account"></yid-table-column>
          <yid-table-column label="账号管理员" min-width="150">
            <template slot-scope="scope">
              {{ scope.row.accountName }}&nbsp;&nbsp;{{ scope.row.tel }}
            </template>
          </yid-table-column>
          <yid-table-column label="授权状态" min-width="120">
            <template slot-scope="scope">
              <span v-if="!$yid.util.isEmpty(scope.row.accessToken)">
                <span v-if="scope.row.needAuth == '0'">已授权</span>
                <span v-if="scope.row.needAuth == '1'"
                  ><font color="red">即将过期</font></span
                >
              </span>
              <span v-if="$yid.util.isEmpty(scope.row.accessToken)"
                >未授权</span
              >
            </template>
          </yid-table-column>
          <yid-table-column
            label="授权到期时间"
            min-width="120"
            prop="expiresDate">
            <template slot-scope="scope">
              <span v-if="!$yid.util.isEmpty(scope.row.accessToken)">
                <span v-if="scope.row.needAuth == '0'">{{
                  $yid.util.formatDate(scope.row.expiresDate)
                }}</span>
                <span v-if="scope.row.needAuth == '1'"
                  ><font color="red">{{
                    $yid.util.formatDate(scope.row.expiresDate)
                  }}</font></span
                >
              </span>
              <span v-if="$yid.util.isEmpty(scope.row.accessToken)">--</span>
            </template>
          </yid-table-column>
          <yid-table-column label="门店数量" min-width="120">
            <template slot-scope="scope">
              <el-link type="primary" @click="showShopConfig(scope.row)"
                >共{{ scope.row.mtShopsList.length }}家门店
              </el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="剩余刷新次数"
            min-width="120"
            prop="remainRefreshCount"></yid-table-column>
          <yid-table-column
            label="备注"
            min-width="200"
            prop="name"></yid-table-column>
          <yid-table-column label="操作" min-width="150" prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="getUrl(scope.row)"
                >去授权</el-link
              >
              <!--<a type="_blank"  :href="getUrl(scope.row)">去授权</a>-->
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="editMtsqDialog(scope.row)"
                >编辑</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button
        >&nbsp;&nbsp;&nbsp;门店列表页
        <div style="margin-top: -10px">
          <el-divider />
        </div>
        <el-button @click="showAddShopDialog" type="primary"
          >添加门店</el-button
        >
        <yid-table ref="shoptable" :data="shopData" style="margin-top: 15px">
          <yid-table-column
            label="门店编码"
            min-width="100"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="150"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="美团门店ID"
            min-width="150"
            prop="openShopUuid">
            <template slot-scope="scope">
              <el-input
                placeholder="请输入对应美团门店ID"
                v-model="scope.row.openShopUuid"
                @change="saveMtShop(scope.row)"></el-input>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="120" prop="content">
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="deleteMtShop(scope.$index, scope.row)"
                >删除</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-dialog title="新增美团账号" :visible.sync="dialogFormMt">
      <el-form :model="mtform">
        <el-form-item label="账号" :label-width="39">
          <el-input v-model="mtform.account" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="appKey" :label-width="39">
          <el-input v-model="mtform.appkey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="appSecret" :label-width="39">
          <el-input v-model="mtform.appSecret" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormMt = false">取 消</el-button>
        <el-button type="primary" @click="saveMt">保存</el-button>
      </div>
    </el-dialog>

    <yid-dialog
      :title="mtsqDialog.title"
      :visible.sync="mtsqDialog.visible"
      width="800px">
      <iframe
        id="mapPage"
        width="100%"
        height="600px"
        frameborder="0"
        :src="authUrl">
      </iframe>
      <el-row style="text-align: center; margin-top: 20px">
        <el-button @click="cancleDialog">取消</el-button>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="editDialog.title"
      :visible.sync="editDialog.visible"
      width="500px">
      <el-form ref="editForm" :model="editForm" label-width="140px">
        <el-form-item label="账号管理员：" prop="accountName">
          <el-input
            v-model="editForm.accountName"
            label="姓名"
            style="width: 120px" />&nbsp;&nbsp;<el-input
            v-model="editForm.tel"
            label="联系电话"
            style="width: 150px" />
        </el-form-item>
        <el-form-item label="帐号备注：" prop="name">
          <el-input
            type="textarea"
            v-model="editForm.name"
            :rows="3"
            style="width: 280px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editMtkeys" type="primary">保存</el-button>
          <el-button @click="cancleDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="addShopDialog.title"
      :visible.sync="addShopDialog.visible"
      width="800px">
      <el-form ref="searchShopForm" :model="searchShopForm" label-width="20px">
        <el-form-item label="">
          <el-select
            value-key="id"
            v-model="searchShopForm.regionIds"
            multiple
            placeholder="请选择"
            style="width: 400px">
            <el-option
              v-for="item in dictRegions"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option> </el-select
          >&nbsp;&nbsp;
          <el-button @click="searchShop" type="primary">查询</el-button>
          <el-button @click="restSearchShop">重置</el-button>
        </el-form-item>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选
        </el-checkbox>
        <el-checkbox-group
          v-model="checkShop"
          @change="handleCheckedCitiesChange">
          <el-checkbox
            v-for="item in checkShopList"
            :key="item.id"
            :label="item.id"
            style="width: 150px">
            <span>{{ item.shopname }} {{ item.shopcode }}</span>
          </el-checkbox>
        </el-checkbox-group>
        <el-row style="text-align: center; margin-top: 20px">
          <el-button @click="cancleDialog">取消</el-button>
          <el-button @click="addShops" type="primary">保存</el-button>
        </el-row>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'

export default {
  name: 'mtkeysConfig',
  data() {
    return {
      activeName: 'mtkeys',
      mtkeysData: [],
      isIndeterminate: false,
      checkAll: false,
      pageInfo: { page: 1, limit: 10 },
      mtsqDialog: {
        title: '应用授权',
        visible: false
      },
      editDialog: {
        title: '编辑',
        visible: false
      },
      authUrl: '',
      editForm: {
        id: '',
        accountName: '',
        tel: '',
        name: ''
      },
      showList: true,
      shopData: [],
      addShopDialog: {
        mkid: '',
        title: '请选择要添加的门店',
        visible: false
      },
      dictRegions: [],
      searchShopForm: {
        regionIds: []
      },
      checkedGameId: [],
      checkShopList: [],
      checkShop: [],
      dialogFormMt: false,
      mtform: {}
    }
  },
  mounted() {
    this.getMtKeysList()
  },
  methods: {
    async saveMt() {
      this.dialogFormMt = false
      await service.mtkeysConfig.saveMt(this.mtform)
      this.getMtKeysList()
    },
    getUrl(item) {
      window.open(
        'https://e.dianping.com/dz-open/merchant/auth?app_key=' +
          item.appkey +
          '&redirect_url=' +
          encodeURIComponent(yid.config.API.BASE + 'api-third/auth/callback') +
          '&state=' +
          item.id
      )
    },
    handleClick(tab, event) {
      console.log(tab, event)
      if (tab.name == 'mtkeys') {
        // 触发‘部门设置’事件
        this.getMtKeysList()
      }
    },
    getMtKeysList() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.mtkeystable.Pagination.internalPageSize
      const fetch = service.mtkeysConfig.listByPage
      const params = this.pageInfo
      this.$refs.mtkeystable.reloadData({
        fetch,
        params
      })
    },
    openMtsqDialog(row) {
      this.authUrl = row.authUrl
      this.mtsqDialog.visible = true
      this.editDialog.visible = false
      this.addShopDialog.visible = false
    },
    cancleDialog() {
      this.mtsqDialog.visible = false
      this.editDialog.visible = false
      this.addShopDialog.visible = false
    },
    editMtsqDialog(row) {
      this.editForm.id = row.id
      this.editForm.accountName = row.accountName
      this.editForm.tel = row.tel
      this.editForm.name = row.name
      this.mtsqDialog.visible = false
      this.editDialog.visible = true
      this.addShopDialog.visible = false
    },
    editMtkeys() {
      const param = {}
      param.id = this.editForm.id
      param.accountName = this.editForm.accountName
      param.tel = this.editForm.tel
      param.name = this.editForm.name
      if (yid.util.isEmpty(param.id)) {
        yid.util.error('id为空')
        return false
      }
      service.mtkeysConfig.saveMtKeys(param).then(res => {
        if (res.resp_code == 200) {
          yid.util.success('修改成功!')
          this.cancleDialog()
          this.getMtKeysList()
        }
      })
    },
    showShopConfig(row) {
      this.shopData = []
      this.addShopDialog.mkid = row.id
      //查询该帐号下的所有门店列表
      service.mtkeysConfig.mtshopList({ mkid: row.id }).then(res => {
        if (res.resp_code == 200) {
          this.shopData = res.data
        }
      })
      this.cancleDialog()
      this.showList = false
    },
    back() {
      this.cancleDialog()
      this.showList = true
      this.getMtKeysList()
    },
    saveMtShop(row) {
      if (!yid.util.isEmpty(row.openShopUuid)) {
        console.log(row)
        service.mtkeysConfig.saveMtshop(row).then(res => {
          console.log(res.resp_code)
          if (res.resp_code == 200) {
            const param = {}
            param.id = row.mkid
            service.mtkeysConfig.mtshopList({ mkid: row.mkid }).then(res => {
              if (res.resp_code == 200) {
                res.data.forEach(r => {
                  this.shopData.forEach(f => {
                    if (r.shopid == f.shopid) {
                      f = r
                    }
                  })
                })
              }
            })
            yid.util.success('操作成功!')
          }
        })
      }
    },
    deleteMtShop(index, row) {
      console.log(row)
      if (yid.util.isEmpty(row.id)) {
        this.shopData.splice(index, 1) //移除删除的门店
      } else {
        yid.util.confirm(
          '你确定要删除' + row.shopname + '的授权吗？',
          '',
          '',
          () => {
            service.mtkeysConfig.deleteMtshop(row.id).then(res => {
              if (res.resp_code == 200) {
                yid.util.success('删除成功!')
                const param = {}
                param.id = row.mkid
                this.showShopConfig(param)
              }
            })
          }
        )
      }
    },
    showAddShopDialog() {
      this.searchShopForm.regionIds = []
      this.checkShopList = []
      this.checkShop = []
      this.checkAll = false
      //查询区域一级列表
      service.chain.region.listAll({ parentId: -1 }).then(res => {
        if (res.resp_code == 200) {
          this.dictRegions = res.data
        }
      })
      this.mtsqDialog.visible = false
      this.editDialog.visible = false
      this.addShopDialog.visible = true
    },
    handleCheckAllChange(val) {
      console.log(val)
      this.checkShop = val ? this.checkedGameId : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.checkShopList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkShopList.length
    },
    searchShop() {
      const param = {}
      if (this.searchShopForm.regionIds.length > 0) {
        let regionIds = ''
        this.searchShopForm.regionIds.forEach(r => {
          regionIds = regionIds + r + ','
        })
        regionIds = regionIds.substr(0, regionIds.length - 1)
        param.regionIds = regionIds
        service.chain.shop.regionShopListAll(param).then(res => {
          if (res.resp_code == 200) {
            this.checkShopList = res.data
            for (let i = 0; i < this.checkShopList.length; i++) {
              this.checkedGameId.push(this.checkShopList[i].id)
            }
            this.checkShop = []
            this.checkAll = false
          }
        })
      } else {
        yid.util.alert('请选择区域进行查询')
        return
      }
    },
    restSearchShop() {
      this.searchShopForm.regionIds = []
      this.checkShopList = []
    },
    addShops() {
      const param = {}
      if (this.checkShop.length > 0) {
        //查询选中门店的列表
        let shopIds = ''
        this.checkShop.forEach(r => {
          shopIds = shopIds + r + ','
        })
        shopIds = shopIds.substr(0, shopIds.length - 1)
        param.shopIds = shopIds
        service.chain.shop.getShopListByIds(param).then(res => {
          if (res.resp_code == 200) {
            for (var i = 0; i < res.data.length; i++) {
              const sdata = {}
              sdata.id = ''
              sdata.mkid = this.addShopDialog.mkid
              sdata.openShopUuid = ''
              sdata.mtShopname = ''
              sdata.shopid = res.data[i].id
              sdata.shopcode = res.data[i].shopcode
              sdata.shopname = res.data[i].shopname
              const param1 = {}
              param1.mkid = this.addShopDialog.mkid
              param1.shopid = res.data[i].id
              service.mtkeysConfig.mtshopList(param1).then(r => {
                console.log(r.data)
                if (r.data.length > 0) {
                  sdata.id = r.data[0].id
                  sdata.mtShopname = r.data[0].mtShopname
                  sdata.openShopUuid = r.data[0].openShopUuid
                }
              })
              console.log(sdata)
              let flag = true
              this.shopData.forEach(s => {
                if (Number(s.shopid) == Number(sdata.shopid)) {
                  flag = false
                }
              })
              if (flag) {
                this.shopData.push(sdata)
              }
            }
          }
        })
        this.cancleDialog()
      } else {
        yid.util.alert('请选择门店进行添加!')
        return
      }
    }
  }
}
</script>

<style scoped></style>
