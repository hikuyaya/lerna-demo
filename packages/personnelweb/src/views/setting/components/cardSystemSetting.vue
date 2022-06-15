<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <el-form
      :model="settingForm"
      :rules="settingFormRules"
      label-width="200px"
      ref="settingForm"
      style="margin-top: 8px">
      <el-form-item label="编码：" prop="code">
        {{ settingForm.code }}
        <explain style="color: silver"
          >编号限定从001开始的整数,自动叠加</explain
        >
      </el-form-item>
      <el-form-item label="门店品牌：" prop="brandId">
        <el-select
          clearable
          v-model="settingForm.brandId"
          :disabled="!isAddNew"
          @change="handleChangeBrand">
          <el-option
            v-for="item in brandList"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" 会员卡体系名称：" prop="name">
        <el-input
          ref="name"
          v-model="settingForm.name"
          placeholder="卡名称"
          style="width: 150px" />
      </el-form-item>
      <el-form-item label="适用门店:" prop="shopList">
        <el-button type="primary" @click="selectShop()">选择门店</el-button>
        {{
          settingForm.shopList && settingForm.shopList.length > 0
            ? '共选中' + settingForm.shopList.length + '家门店'
            : ''
        }}
      </el-form-item>
      <row>储值卡异店划卡设置：</row>
      <el-form-item
        label="是否允许跨店消费/充值"
        style="margin-top: 8px"
        prop="isSdiffshop">
        <el-radio-group
          v-model="settingForm.isSdiffshop"
          @change="handleChangeSdiffshop">
          <el-radio label="1">允许</el-radio>
          <el-radio label="0">不允许</el-radio>
        </el-radio-group>
        <yid-ask
          >适用门店内的跨店消费，不允许则只能在开卡充值门店消费，非适用门店内跨店可设置跨品牌消费</yid-ask
        >
      </el-form-item>
      <el-form-item
        label="卡金类型"
        prop="sShopCardMoneyTypeArr"
        v-if="settingForm.isSdiffshop == '1'">
        <el-checkbox-group v-model="settingForm.sShopCardMoneyTypeArr">
          <el-checkbox
            v-for="item in cardMoneyTypeArr"
            :label="item.value"
            :key="item.value"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!--<el-form-item label="是否允许跨店充值" style="margin-top: 8px" prop="isSdiffcharge">-->
      <!--<el-radio-group v-model="settingForm.isSdiffcharge" @change="handleChangeSdiffcharge" >-->
      <!--<el-radio label="1">允许</el-radio>-->
      <!--<el-radio label="0">不允许</el-radio>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item
        label="是否允许跨品牌消费"
        style="margin-top: 8px"
        prop="isSdiffbrand">
        <el-radio-group
          v-model="settingForm.isSdiffbrand"
          @change="handleChangeSdiffbrand">
          <el-radio label="1">允许</el-radio>
          <el-radio label="0">不允许</el-radio>
        </el-radio-group>
        <yid-ask
          >跨品牌消费按照消费门店最低会员卡折扣的会员卡规则，最低折扣会员卡判定规则：项目折扣+产品折扣之和数字最大的会员卡</yid-ask
        >
      </el-form-item>
      <el-form-item
        label="卡金类型"
        prop="sBrandCardMoneyTypeArr"
        v-if="settingForm.isSdiffbrand == '1'">
        <el-checkbox-group v-model="settingForm.sBrandCardMoneyTypeArr">
          <el-checkbox
            v-for="item in cardMoneyTypeArr"
            :label="item.value"
            :key="item.value"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="门店品牌"
        v-if="settingForm.isSdiffbrand == '1'"
        prop="czkBrandTypeArr">
        <el-checkbox
          :indeterminate="sBrandIndeterminates"
          v-model="isCheckSBrandTypeAll"
          @change="handlesBrandTypeCheckAllChange"
          >全选
        </el-checkbox>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group
          v-model="settingForm.czkBrandTypeArr"
          @change="handleCheckedSBrandTypeChange">
          <el-checkbox v-for="item in brandList" :label="item" :key="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <row>资格卡异店划卡设置：</row>
      <el-form-item
        label="是否允许跨店消费"
        style="margin-top: 8px"
        prop="isMdiffshop">
        <el-radio-group v-model="settingForm.isMdiffshop">
          <el-radio label="1">允许</el-radio>
          <el-radio label="0">不允许</el-radio>
        </el-radio-group>
        <yid-ask
          >适用门店内的跨店消费，不允许则只能在开卡门店消费，非适用门店内跨店可设置跨品牌消费</yid-ask
        >
      </el-form-item>
      <el-form-item
        label="是否允许跨店续卡"
        style="margin-top: 8px"
        prop="isMdiffcharge">
        <el-radio-group v-model="settingForm.isMdiffcharge">
          <el-radio label="1">允许</el-radio>
          <el-radio label="0">不允许</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否允许跨品牌消费"
        style="margin-top: 8px"
        prop="isMdiffbrand">
        <el-radio-group
          v-model="settingForm.isMdiffbrand"
          @change="handleChangeMdiffbrand">
          <el-radio label="1">允许</el-radio>
          <el-radio label="0">不允许</el-radio>
        </el-radio-group>
        <yid-ask
          >跨品牌消费按照消费门店最低会员卡折扣的会员卡规则，最低折扣会员卡判定规则：项目折扣+产品折扣之和数字最大的会员卡</yid-ask
        >
      </el-form-item>
      <el-form-item
        label="门店品牌"
        v-if="settingForm.isMdiffbrand == '1'"
        prop="zgkBrandTypeArr">
        <el-checkbox
          :indeterminate="mBrandIndeterminates"
          v-model="isCheckMBrandTypeAll"
          @change="handlemBrandTypeCheckAllChange"
          >全选
        </el-checkbox>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group
          v-model="settingForm.zgkBrandTypeArr"
          @change="handleCheckedMBrandTypeChange">
          <el-checkbox v-for="item in brandList" :label="item" :key="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="备注：">
        <el-input
          v-model="settingForm.memo"
          placeholder="请填写备注"
          type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>

    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
      @close="cancelSaveShop"
      width="1100px">
      <el-row type="flex" justify="space-between">
        <el-form inline :model="shopSearchForm" ref="shopSearchForm">
          <el-form-item label="门店：">
            <el-input
              clearable
              v-model="shopSearchForm.pcodename"
              placeholder="门店名称/编码"
              style="width: 160px"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              clearable
              v-model="shopSearchForm.status"
              placeholder="请选择状态"
              style="width: 120px">
              <el-option label="正常" value="1"></el-option>
              <el-option label="关店" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select
              clearable
              filterable
              v-model="shopSearchForm.type"
              placeholder="请选择业务类型"
              style="width: 160px">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in btypeList">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select
              @clear="clearSelectRegion"
              clearable
              ref="selectRegionRef"
              v-model="shopSearchForm.regionObj.name"
              placeholder="请选择门店区域"
              style="width: 180px">
              <el-option
                hidden
                :value="shopSearchForm.regionObj.id"
                style="height: auto"></el-option>
              <el-tree
                :expand-on-click-node="false"
                :check-on-click-node="true"
                show-checkbox
                check-strictly
                node-key="id"
                :data="regionData"
                :props="defaultProps"
                @check-change="handleNodeClick"
                ref="templateRegionTree">
              </el-tree>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="queryShop()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="14">
          <yid-table
            pagination
            ref="tableShop"
            style="margin-top: 10px"
            @selection-change="handleSelectionShopChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column
              label="门店编码"
              min-width="60"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column
              label="门店品牌"
              min-width="60"
              prop="brandName"></yid-table-column>
            <yid-table-column
              label="门店区域"
              min-width="120"
              prop="regionName"></yid-table-column>
            <yid-table-column label="业务类型" min-width="80" prop="type">
              <template slot-scope="scope">
                {{ getTypeName(scope.row.type) }}
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop()" type="primary" size="mini"
              ><i class="el-icon-right"></i
            ></el-button>
          </div>
        </el-col>
        <el-col :span="8" style="margin-left: 5px">
          <el-link type="primary" @click="deleteBatch()">批量删除</el-link>
          <yid-table
            ref="selectTableShop"
            style="margin-top: 10px"
            :data="shopDialog.selectShopList"
            @selection-change="handleSelectionData">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column
              label="门店编码"
              min-width="80"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="deleteShop(scope.row)"
                  >删除</el-link
                >
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveShop()">选好了</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="cancelSaveShop">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'

export default {
  name: 'cardSystemSetting',
  data() {
    return {
      originCardTemp: '',
      pageInfo: { page: 0, limit: 10 },
      isAddNew: true,
      sBrandIndeterminates: false,
      isCheckSBrandTypeAll: false,
      mBrandIndeterminates: false,
      isCheckMBrandTypeAll: false,
      shopSearchForm: {
        pcodename: '',
        type: '',
        regionObj: '',
        status: null
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      settingForm: {
        code: '',
        name: '',
        memo: '',
        shopList: '',
        //储值卡
        isSdiffshop: '',
        sShopCardMoneyTypeArr: [],
        isSdiffbrand: '',
        isSdiffcharge: '',
        sBrandCardMoneyTypeArr: [],
        czkBrandTypeArr: [],
        sdsAllowCardm: '0',
        sdsAllowGiftm: '0',
        sdbAllowCardm: '0',
        sdbAllowGiftm: '0',
        //资格卡
        isMdiffshop: '',
        isMdiffcharge: '',
        isMdiffbrand: '',
        zgkBrandTypeArr: [],
        brandId: '',
        brandName: ''
      },
      settingFormRules: {
        name: [
          { required: true, message: '请填写会员卡体系名称' },
          { min: 0, max: 10, message: '卡名称在10个字符以内' }
        ],
        brandId: [{ required: true, message: '请选择门店品牌' }],
        shopList: [
          { type: 'array', required: true, message: '请至少选择一个适用门店' }
        ],
        zgkBrandTypeArr: [
          { type: 'array', required: true, message: '请至少选择一个可跨品牌' }
        ],
        czkBrandTypeArr: [
          { type: 'array', required: true, message: '请至少选择一个可跨品牌' }
        ],
        sBrandCardMoneyTypeArr: [
          { type: 'array', required: true, message: '请至少选择一个卡金类型' }
        ],
        sShopCardMoneyTypeArr: [
          { type: 'array', required: true, message: '请至少选择一个卡金类型' }
        ]
      },
      shopList: [],
      brandList: [],
      btypeList: [],
      regionData: [],
      shopDialog: {
        visible: false,
        title: '选择门店',
        selectShopList: [], //已经选择的适用门店
        orgSelectShopList: [] //保存选择的适用门店  用于取消时还原
      },
      cardMoneyTypeArr: [
        { value: '0', name: '卡金' },
        { value: '1', name: '赠送金' }
      ],
      selectShopList: [], //选中的适用门店 还未添加到已选择的列表中
      selectShopData: []
    }
  },
  methods: {
    handleChangeBrand() {
      if (this.$refs['tableShop'] != null) {
        this.$refs.tableShop.clearSelection() // 清空表单选项
        this.$refs.tableShop.clearData() //清空表单数据
      }
      this.selectShopList = []
      this.settingForm.shopList = []
      this.shopDialog.selectShopList = []
      this.shopDialog.orgSelectShopList = []
    },
    async initData(data) {
      this.restSetting()
      await this.init()

      this.isAddNew = data == null
      if (this.isAddNew) {
        this.initAddSetting()
      } else {
        this.originCardTemp = data
        this.initEditSetting(data)
      }
    },
    initAddSetting() {
      //储值卡 跨店消费，充值默认都选择允许，同时勾选卡金赠送金；跨品牌默认选择不允许
      this.settingForm.isSdiffshop = '1'
      this.settingForm.isSdiffcharge = '1'
      this.settingForm.isSdiffbrand = '0'
      this.settingForm.sShopCardMoneyTypeArr.push('0')
      //资格卡 跨店消费，续卡默认都选择允许, 跨品牌默认选择不允许
      this.settingForm.isMdiffcharge = '1'
      this.settingForm.isMdiffshop = '1'
      this.settingForm.isMdiffbrand = '0'
    },
    initEditSetting(data) {
      this.settingForm.code = data.code
      this.settingForm.name = data.name
      this.settingForm.brandId = data.brandId
      this.settingForm.brandName = data.brandName
      this.settingForm.shopList = JSON.parse(JSON.stringify(data.shopList))
      this.shopDialog.selectShopList = JSON.parse(JSON.stringify(data.shopList))
      this.shopDialog.orgSelectShopList = JSON.parse(
        JSON.stringify(data.shopList)
      )

      this.settingForm.isSdiffshop = data.isSdiffshop
      if (data.sdsAllowCardm == '1') {
        this.settingForm.sShopCardMoneyTypeArr.push('0')
      }
      if (data.sdsAllowGiftm == '1') {
        this.settingForm.sShopCardMoneyTypeArr.push('1')
      }
      this.settingForm.isSdiffcharge = data.isSdiffcharge
      this.settingForm.isSdiffbrand = data.isSdiffbrand
      if (this.settingForm.isSdiffbrand == '1') {
        let brandCodeArr = data.sdbBrandsCode.split(',')
        for (let i = 0; i < brandCodeArr.length; i++) {
          this.brandList.forEach(each => {
            if (each.code == brandCodeArr[i]) {
              this.settingForm.czkBrandTypeArr.push(each)
            }
          })
        }
        let checkedCount = this.settingForm.czkBrandTypeArr.length
        this.isCheckSBrandTypeAll = checkedCount === this.brandList.length
        this.sBrandIndeterminates =
          checkedCount > 0 && checkedCount < this.brandList.length

        if (data.sdbAllowCardm == '1') {
          this.settingForm.sBrandCardMoneyTypeArr.push('0')
        }

        if (data.sdbAllowGiftm == '1') {
          this.settingForm.sBrandCardMoneyTypeArr.push('1')
        }
      }
      this.settingForm.isMdiffshop = data.isMdiffshop
      this.settingForm.isMdiffcharge = data.isMdiffcharge
      this.settingForm.isMdiffbrand = data.isMdiffbrand
      if (data.isMdiffbrand == '1') {
        let brandCodeArr = data.mdbBrandsCode.split(',')
        for (let i = 0; i < brandCodeArr.length; i++) {
          this.brandList.forEach(each => {
            if (each.code == brandCodeArr[i]) {
              this.settingForm.zgkBrandTypeArr.push(each)
            }
          })
        }
        let checkedCount = this.settingForm.zgkBrandTypeArr.length
        this.isCheckMBrandTypeAll = checkedCount === this.brandList.length
        this.mBrandIndeterminates =
          checkedCount > 0 && checkedCount < this.brandList.length
      }
      this.settingForm.memo = data.memo
    },
    restSetting() {
      this.selectShopList = []
      this.shopDialog.selectShopList = []
      this.shopDialog.orgSelectShopList = []
      this.sBrandIndeterminates = false
      this.isCheckSBrandTypeAll = false
      this.mBrandIndeterminates = false
      this.isCheckMBrandTypeAll = false
      this.settingForm = {
        code: '',
        name: '',
        memo: '',
        shopList: '',
        //储值卡
        isSdiffshop: '',
        sShopCardMoneyTypeArr: [],
        isSdiffbrand: '',
        isSdiffcharge: '',
        sBrandCardMoneyTypeArr: [],
        czkBrandTypeArr: [],
        sdsAllowCardm: '0',
        sdsAllowGiftm: '0',
        sdbAllowCardm: '0',
        sdbAllowGiftm: '0',
        //资格卡
        isMdiffshop: '',
        isMdiffcharge: '',
        isMdiffbrand: '',
        zgkBrandTypeArr: [],
        brandId: '',
        brandName: ''
      }
      if (this.$refs['settingForm'] != null) {
        this.$refs['settingForm'].resetFields()
      }
      if (this.$refs['tableShop'] != null) {
        this.$refs.tableShop.clearSelection() // 清空表单选项
        this.$refs.tableShop.clearData() //清空表单数据
      }
    },
    handleChangeSdiffshop(v) {
      if (v == '0') {
        this.settingForm.sShopCardMoneyTypeArr = []
      }
      this.settingForm.isSdiffcharge = v //跨店消费与跨店充值保持一致
    },
    handleChangeSdiffcharge(v) {
      this.settingForm.isSdiffshop = v
      if (v == '0') {
        this.settingForm.sShopCardMoneyTypeArr = []
      }
    },
    handleChangeSdiffbrand(v) {
      if (v == '0') {
        this.settingForm.sBrandCardMoneyTypeArr = []
        this.settingForm.czkBrandTypeArr = []
        this.sBrandIndeterminates = false
        this.isCheckSBrandTypeAll = false
      }
    },
    handleChangeMdiffbrand(v) {
      if (v == '0') {
        this.settingForm.zgkBrandTypeArr = []
        this.mBrandIndeterminates = false
        this.isCheckMBrandTypeAll = false
      }
    },
    addShop() {
      this.selectShopList.map(m => {
        let flag = true
        this.shopDialog.selectShopList.forEach(p => {
          if (p.id == m.id || p.shopid == m.id) {
            flag = false
            this.$message.warning('门店：' + p.shopname + '已勾选')
          }
        })
        if (flag) {
          this.shopDialog.selectShopList.push(m)
        }
      })
    },
    getSelectAllRegion(region, regionChildrenIds) {
      if (region.children == null) {
        return
      }
      for (let i = 0; i < region.children.length; i++) {
        let child = region.children[i]
        regionChildrenIds.push(child.id)
        this.getSelectAllRegion(child, regionChildrenIds)
      }
    },
    handleSelectionShopChange(rows) {
      this.selectShopList = rows
    },
    async getBtypeAll() {
      await service.chain.btype.btypeAllList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.btypeList = res.data
        }
      })
    },
    async getRegionData() {
      await service.chain.region.treeAll({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.regionData = res.data
        }
      })
    },
    saveShop() {
      this.settingForm.shopList = this.shopDialog.selectShopList
      this.shopDialog.visible = false
    },
    deleteShop(row) {
      let cardName = this.settingForm.name
      let shopname = row.shopname
      let tips =
        '删除门店,【' +
        cardName +
        '】下的会员卡将不在【' +
        shopname +
        '】中显示，若会员卡在本店还存有卡金将不能使用，确定要删除吗？'
      yid.util.confirm(tips, '', '', () => {
        let i = -1
        let deleteRow = {}
        this.shopDialog.selectShopList.forEach((p, index) => {
          if (p.id == row.id) {
            i = index
            deleteRow = p
          }
        })
        this.shopDialog.selectShopList.splice(i, 1)

        //todo
        // if(deleteRow != null){
        //     let t = this.$refs.tableShop;
        //     this.$refs.tableShop.Pagination.toggleRowSelection(deleteRow);
        // }
      })
    },
    async selectShop() {
      if (!this.settingForm.brandId) {
        yid.util.error('请先选择门店品牌！')
        return
      }
      this.shopDialog.visible = true
    },
    queryShop() {
      this.pageInfo = { page: 1, limit: 10 }
      let req = {}
      req.pcodename = this.shopSearchForm.pcodename
      req.brandId = this.settingForm.brandId
      req.type = this.shopSearchForm.type
      req.status = this.shopSearchForm.status
      if (this.shopSearchForm.regionObj && this.shopSearchForm.regionObj.id) {
        //大区及以内区域都保存进去
        this.shopSearchForm.regionObj.childrenIds.push(
          this.shopSearchForm.regionObj.id
        )
        req.regionIds = this.shopSearchForm.regionObj.childrenIds.toString()
      } else {
        req.regionIds = ''
      }
      this.getShopList(req)
    },
    save() {
      this.$refs['settingForm'].validate(valid => {
        if (!valid) {
          return
        }
        let isAllowPay = false
        let isAllGive = false
        for (
          let i = 0;
          i < this.settingForm.sShopCardMoneyTypeArr.length;
          i++
        ) {
          if (this.settingForm.sShopCardMoneyTypeArr[i] == '0') {
            //允许卡金
            isAllowPay = true
          } else if (this.settingForm.sShopCardMoneyTypeArr[i] == '1') {
            //允许卡金
            isAllGive = true
          }
        }
        this.settingForm.sdsAllowCardm = isAllowPay ? '1' : '0' //卡金
        this.settingForm.sdsAllowGiftm = isAllGive ? '1' : '0' //赠送
        // 重置  算品牌的
        isAllowPay = false
        isAllGive = false
        for (
          let i = 0;
          i < this.settingForm.sBrandCardMoneyTypeArr.length;
          i++
        ) {
          if (this.settingForm.sBrandCardMoneyTypeArr[i] == '0') {
            //允许卡金
            isAllowPay = true
          } else if (this.settingForm.sBrandCardMoneyTypeArr[i] == '1') {
            //允许卡金
            isAllGive = true
          }
        }
        this.settingForm.sdbAllowCardm = isAllowPay ? '1' : '0' //卡金
        this.settingForm.sdbAllowGiftm = isAllGive ? '1' : '0' //赠送
        for (let i = 0; i < this.brandList.length; i++) {
          if (this.brandList[i].id == this.settingForm.brandId) {
            this.settingForm.brandName = this.brandList[i].name
          }
        }

        if (!this.isAddNew) {
          this.settingForm.id = this.originCardTemp.id
          this.settingForm.revision = this.originCardTemp.revision
        }

        service.chain.cardTemp.saveOrUpdate(this.settingForm).then(res => {
          if (res.resp_code == 200) {
            this.goBack()
          } else {
            yid.util.error('保存失败')
          }
        })
      })
    },
    handlesBrandTypeCheckAllChange(val) {
      this.settingForm.czkBrandTypeArr = val ? this.brandList : []
      this.sBrandIndeterminates = false
    },
    handleCheckedSBrandTypeChange(value) {
      let checkedCount = value.length
      this.isCheckSBrandTypeAll = checkedCount === this.brandList.length
      this.sBrandIndeterminates =
        checkedCount > 0 && checkedCount < this.brandList.length
    },
    handlemBrandTypeCheckAllChange(val) {
      this.settingForm.zgkBrandTypeArr = val ? this.brandList : []
      this.mBrandIndeterminates = false
    },
    handleCheckedMBrandTypeChange(value) {
      let checkedCount = value.length
      this.isCheckMBrandTypeAll = checkedCount === this.brandList.length
      this.mBrandIndeterminates =
        checkedCount > 0 && checkedCount < this.brandList.length
    },
    getShopList(p) {
      const fetch = service.chain.shop.shopListWithPage
      let params = { ...this.pageInfo, ...p }
      this.$refs['tableShop'].reloadData({
        fetch,
        params
      })
    },
    async getBrandList() {
      await service.chain.brand.brandList({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.brandList = res.data
          // res.data.forEach(each =>{
          //     this.brandList.push({id:each.id, code:each.code, name:each.name})
          // })
        }
      })
    },
    getTypeName(type) {
      let result = '未知'
      for (let i = 0; i < this.btypeList.length; i++) {
        if (this.btypeList[i].id == type) {
          return this.btypeList[i].name
        }
      }
      return result
    },
    clearSelectRegion() {
      this.shopSearchForm.regionObj = {}
      this.$refs.templateRegionTree.setCheckedKeys([])
    },
    handleNodeClick(data, checked, node) {
      if (checked == true) {
        let id = data.id
        let valueObj = {}
        valueObj.id = id
        valueObj.name = data.name
        this.shopSearchForm.regionObj = valueObj
        this.shopSearchForm.regionObj.childrenIds = []
        this.getSelectAllRegion(data, this.shopSearchForm.regionObj.childrenIds)
        this.$refs.templateRegionTree.setCheckedKeys([data.id])
      } else {
        if (this.shopSearchForm.regionObj.id == data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id])
        }
      }
      this.$refs.selectRegionRef.blur()
    },
    goBack() {
      this.$emit('onClose')
    },
    cancelSaveShop() {
      this.shopDialog.selectShopList = this.shopDialog.orgSelectShopList
      this.shopDialog.visible = false
    },
    async init() {
      await this.getBrandList()
      await this.getBtypeAll()
      await this.getRegionData()
    },
    handleSelectionData(rows) {
      this.selectShopData = rows
    },
    //批量删除
    deleteBatch() {
      if (this.selectShopData.length == 0) {
        yid.util.warning('请勾选删除的门店')
        return
      }
      this.selectShopData.forEach(item => {
        this.shopDialog.selectShopList.forEach((p, index) => {
          if (item.shopid == p.shopid) {
            this.shopDialog.selectShopList.splice(index, 1)
          }
        })
      })
    }
  }
}
</script>

<style scoped></style>
