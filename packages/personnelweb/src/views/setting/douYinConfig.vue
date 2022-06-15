<template>
  <div class="mtkeysConfig">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form :model="searchForm" ref="searchForm" inline>
          <el-form-item label="抖音店号：">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="searchForm.poiName"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="抖音poi_id：">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="searchForm.poiId"
              style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="系统店号：">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="searchForm.shopcode"
              style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="系统店名：">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="searchForm.shopname"
              style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="getMtKeysList" type="primary">查询</el-button>
            <el-button @click="resetSearchForm" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addShop">新增账号</el-button>
        <el-row style="color: #e6a23c; margin: 15px 0"
          >操作提示：开通抖音账号映射权限请联系平台客服办理</el-row
        >
        <yid-table
          pagination
          ref="mtkeystable"
          :data="mtkeysData"
          style="margin-top: 15px">
          <yid-table-column
            label="店号"
            min-width="100"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="店名"
            min-width="100"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="抖音id"
            min-width="100"
            prop="poiId"></yid-table-column>
          <yid-table-column
            label="抖音店名"
            min-width="100"
            prop="poiName"></yid-table-column>
          <yid-table-column label="操作" min-width="150" prop="id">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="deleteDyShop(scope.row)"
                >删除</el-link
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
        <el-row type="flex" justify="start">
          <el-col :span="4">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入抖音店名筛选" />
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button @click="searchName" type="primary">搜索</el-button>&nbsp;
            <el-button @click="reset" type="primary">重置</el-button>&nbsp;
          </el-col>
        </el-row>
        <yid-table
          ref="douyinShoptable"
          :data="douYinShopDatatmp"
          style="margin-top: 15px">
          <yid-table-column
            label="抖音poi_id"
            min-width="100"
            prop="poi_id"></yid-table-column>
          <yid-table-column label="抖音店名" min-width="100" prop="poi_name">
          </yid-table-column>
          <yid-table-column
            label="抖音地址"
            min-width="100"
            prop="address"></yid-table-column>
          <yid-table-column label="操作" min-width="150" prop="longitude">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="bindShop(scope.row)"
                >绑定门店</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-dialog title="绑定门店" :visible.sync="dialogFormMt" width="500">
      <el-form :model="dyform">
        <el-form-item label="门店编码" :label-width="39">
          <el-input v-model="dyform.shopcode" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormMt = false">取 消</el-button>
        <el-button type="primary" @click="saveDy">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'

export default {
  name: 'mtkeysConfig',
  data() {
    return {
      mtkeysData: [],
      pageInfo: { page: 1, limit: 10 },
      pageInfo2: { page: 1, limit: 10 },
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
      mtform: {},
      dialogDyShop: false,
      dyform: {},
      dykeysData: [],
      douYinShopData: [],
      douYinShopDatatmp: [],
      search: '',
      searchForm: {
        poiName: '',
        poiId: '',
        shopcode: '',
        shopname: ''
      }
    }
  },
  mounted() {
    this.getMtKeysList()
  },
  methods: {
    searchName() {
      this.douYinShopDatatmp = this.douYinShopData.filter(
        data =>
          !this.search ||
          data.poi_name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    reset() {
      this.douYinShopDatatmp = this.douYinShopData
      this.search = ''
    },
    deleteDyShop(row) {
      if (yid.util.isEmpty(row.id)) {
        this.douYinShopData.splice(index, 1) //移除删除的门店
      } else {
        yid.util.confirm('你确定要删除' + row.shopname + '吗？', '', '', () => {
          service.mtkeysConfig.deleteDyshop(row.id).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('删除成功!')
              // const param = {}
              // param.id = row.mkid;
              // this.showShopConfig(param);
              this.getMtKeysList()
            }
          })
        })
      }
    },
    addShop() {
      this.showList = false

      this.getDouYinList()
    },

    bindShop(data) {
      this.dyform.poiId = data.poi_id
      this.dyform.poiName = data.poi_name
      this.dyform.address = data.address
      this.dialogFormMt = true
    },
    resetSearchForm() {
      (this.searchForm = {
        poiName: '',
        poiId: '',
        shopcode: '',
        shopname: ''
      }),
        this.getMtKeysList()
    },

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
      this.pageInfo.limit = this.$refs.mtkeystable.Pagination.internalPageSize
      const fetch = service.mac.findList
      const params = { ...this.pageInfo, ...requestObj }
      this.$refs.macTable.reloadData({
        fetch,
        params
      })
    },

    getMtKeysList() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.mtkeystable.Pagination.internalPageSize
      const fetch = service.mtkeysConfig.douyinShopList
      const params = { ...this.pageInfo, ...this.searchForm }
      // const params = this.pageInfo
      this.$refs.mtkeystable.reloadData({
        fetch,
        params
      })
    },
    async saveDy() {
      this.dialogFormMt = false
      await service.mtkeysConfig.saveDy(this.dyform).then(res => {
        if (res.resp_code == 200) {
          yid.util.success('保存成功!')
        }
      })

      this.dyform = {}
    },
    async getDouYinList() {
      // this.pageInfo2.page = 1
      // this.pageInfo2.limit = this.$refs.douyinShoptable.Pagination.internalPageSize;
      const params = { page: 1, limit: 1000 }
      await service.mtkeysConfig.douyinList(params).then(res => {
        if (res.resp_code == 200) {
          this.douYinShopData = res.data
          this.douYinShopDatatmp = this.douYinShopData
        }
      })
    },

    back() {
      this.showList = true
      this.getMtKeysList()
    }
  }
}
</script>

<style scoped></style>
