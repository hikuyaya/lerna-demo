<!--
 * @Author: wqy
 * @Date: 2022-07-19 11:29:11
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-20 16:23:33
 * @FilePath: \personnelweb\src\views\base\shop\shop.vue
 * @Description: 门店信息管理
-->
<template>
  <div>
    <el-collapse-transition>
      <div v-show="listShow">
        <el-form inline ref="searchForm" :model="searchForm" class="mg-t-12">
          <el-form-item label="门店：" prop="pcodename">
            <el-input
              clearable
              v-model.trim="searchForm.pcodename"
              placeholder="门店编码/门店名称"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select
              clearable
              v-model.trim="searchForm.type"
              placeholder="请选择"
              style="width: 160px">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in btypeList">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌管理：">
            <el-select
              clearable
              v-model.trim="searchForm.brandId"
              placeholder="请选择"
              style="width: 160px">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in brandData">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织机构：">
            <el-select
              @clear="clearSelectRegion"
              clearable
              ref="selectRegionRef"
              v-model="selectRegionForm.regionObj.name"
              placeholder="请选择组织机构"
              style="width: 180px">
              <el-option
                hidden
                :value="selectRegionForm.regionObj.id"
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
          <el-form-item>
            <el-button @click="search()" type="primary">查询</el-button>
            <el-button @click="addShop" type="primary">新增</el-button>
          </el-form-item>
        </el-form>

        <yid-table pagination ref="table" :data="tableData">
          <yid-table-column label="门店编码" min-width="140" prop="shopcode">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="showDetailPage(scope.row)"
                >{{ scope.row.shopcode }}</el-link
              >
            </template>
          </yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="140"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="门店品牌"
            min-width="140"
            prop="brandName"></yid-table-column>
          <yid-table-column label="业务类型" min-width="140" prop="type">
            <template slot-scope="scope">
              {{ getTypeName(scope.row.type) }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="所属机构"
            min-width="140"
            prop="regionName"></yid-table-column>
          <yid-table-column
            label="门店电话"
            min-width="140"
            prop="moblie"></yid-table-column>
          <yid-table-column
            label="门店地址"
            min-width="140"
            prop="address"></yid-table-column>
          <yid-table-column label="是否显示门店" min-width="140" prop="isShow">
            <template slot-scope="scope">
              {{ scope.row.isShow == '1' ? '显示' : '隐藏' }}
            </template>
          </yid-table-column>
          <yid-table-column label="门店状态" min-width="140" prop="status">
            <template slot-scope="scope">
              {{ scope.row.status == '1' ? '开店' : '关店' }}
            </template>
          </yid-table-column>
          <yid-table-column label="咨询公司" min-width="140" prop="isCompany">
            <template slot-scope="scope">
              {{ scope.row.isCompany == '1' ? '是' : '否' }}
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="60" prop="oper">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="onEdit(scope.row)"
                >修改</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="infoShow">
        <ShopInfo ref="detailPage" @onClose="closeDetailPage"></ShopInfo>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="addShow">
        <el-form
          ref="shopForm"
          :model="shopForm"
          label-width="150px"
          label-position="right">
          <el-button @click="closeDetailPage" type="primary">返回</el-button>
          <br />
          <!--<el-tag>基础信息</el-tag><br>-->
          <el-form-item
            label="门店编码："
            prop="shopcode"
            :rules="[{ required: true, message: '门店编码不能为空' }]">
            <el-input
              v-model="shopForm.shopcode"
              style="width: 350px"
              @change="checkShopcode"
              :disabled="['detail', 'edit'].includes(operateType)"></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="shopname"
            :rules="[{ required: true, message: '门店名称不能为空' }]">
            <el-input
              v-model="shopForm.shopname"
              style="width: 350px"
              placeholder="请输入"
              :disabled="['detail'].includes(operateType)" />
          </el-form-item>
          <el-form-item
            label="门店品牌："
            prop="brandId"
            :rules="[{ required: true, message: '门店品牌不能为空' }]">
            <el-select
              clearable
              v-model.trim="shopForm.brandId"
              placeholder="请选择"
              style="width: 200px"
              :disabled="['detail'].includes(operateType)">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in brandData">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="业务类型："
            prop="type"
            :rules="[{ required: true, message: '业务类型不能为空' }]">
            <el-select
              clearable
              v-model.trim="shopForm.type"
              placeholder="请选择"
              style="width: 160px"
              :disabled="['detail', 'edit'].includes(operateType)">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in btypeList">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="组织机构："
            prop="regionObj"
            :rules="[{ required: true, message: '请选择组织机构' }]">
            <el-select
              ref="selectRegionRef1"
              v-model="shopForm.regionObj"
              placeholder="请选择"
              multiple
              collapse-tags
              @change="selectRegion1"
              style="width: 180px"
              :disabled="['detail'].includes(operateType)">
              <el-option :value="shopForm.regionObjValue" style="height: auto">
                <el-tree
                  size="small"
                  :accordion="true"
                  show-checkbox
                  :default-expand-all="true"
                  :data="regionData"
                  :props="defaultProps"
                  node-key="id"
                  :check-strictly="true"
                  @check-change="templateCheckChange1"
                  ref="templateTree1">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否咨询公司："
            prop="isCompany"
            :rules="[{ required: true, message: '请选择', trigger: 'blur' }]">
            <el-radio-group
              v-model="shopForm.isCompany"
              :disabled="['detail'].includes(operateType)">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="门店地址："
            prop="pca"
            :rules="[{ required: true, message: '门店地址不能为空' }]">
            <el-cascader
              v-model="shopForm.pca"
              :options="proCityArea"
              :props="{ value: 'code', label: 'name' }"
              style="width: 300px"
              :disabled="['detail'].includes(operateType)"></el-cascader
            >&nbsp;&nbsp;&nbsp;&nbsp;
            <el-input
              v-model="shopForm.address"
              style="width: 300px"
              placeholder="请输入详情地址"
              :disabled="['detail'].includes(operateType)" />
          </el-form-item>
          <el-form-item label="门店电话：" prop="moblie">
            <el-input
              v-model="shopForm.moblie"
              style="width: 350px"
              placeholder="请输入"
              :disabled="['detail'].includes(operateType)" />
          </el-form-item>
          <el-form-item label="联系人：" prop="contacts">
            <el-input
              v-model="shopForm.contacts"
              style="width: 350px"
              placeholder="请输入"
              :disabled="['detail'].includes(operateType)" />
          </el-form-item>

          <el-form-item
            label="门店状态"
            prop="status"
            :rules="[{ required: true, message: '门店状态不能为空' }]">
            <el-switch
              v-model="shopForm.status"
              active-value="1"
              inactive-value="2"
              active-text="开"
              inactive-text="关"
              :disabled="['detail'].includes(operateType)">
            </el-switch>
          </el-form-item>
          <el-form-item
            label="是否显示门店"
            prop="isShow"
            :rules="[{ required: true, message: '是否显示门店不能为空' }]">
            <el-switch
              v-model="shopForm.isShow"
              active-value="1"
              inactive-value="0"
              active-text="显示"
              inactive-text="隐藏"
              :disabled="['detail'].includes(operateType)">
            </el-switch>
            <yid-ask>控制门店信息是否在小程序中显示</yid-ask>
          </el-form-item>
        </el-form>
        <el-row
          style="text-align: center; margin-top: 20px"
          v-if="operateType !== 'detail'">
          <el-button type="primary" @click="saveShop">保存</el-button
          >&nbsp;&nbsp;
          <!-- <el-button @click="nextConfig">下一步</el-button>&nbsp;&nbsp;-->
          <el-button @click="closeDetailPage">取消</el-button>&nbsp;&nbsp;
        </el-row>
      </div>
    </el-collapse-transition>

    <el-dialog
      :title="shopmap.title"
      :visible.sync="shopmap.visible"
      @close="shopmap.visible = false"
      width="600px">
      <el-form ref="addressForm" label-width="20px">
        <el-form-item>
          <el-button type="primary" @click="setLocation">确定</el-button>
          <el-button @click="shopmap.visible = false">取消</el-button>
        </el-form-item>
      </el-form>
      <iframe
        id="mapPage"
        width="100%"
        height="450px"
        frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OLEBZ-25DCQ-GHY5C-GJ6B4-BPHC2-4GF2N&referer=myapp">
      </iframe>
    </el-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import ShopInfo from './shopinfo'
import { isEmpty } from '@src/library/helper/validate'

var tempAddress = {}
export default {
  name: 'manage',
  data() {
    return {
      upload: yid.config.API.UPLOAD,
      listShow: true,
      infoShow: false,
      addShow: false,
      addConfigShow: false,
      myheaders: {},
      regionData: [],
      btypeList: [],
      proCityArea: [],
      servicePricetemps: [],
      productPricetemps: [],
      cardTemps: [],
      royaltyManages: [],
      payTemplateList: [], //付款模板list
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: this.disabledFn
      },
      shopmap: {
        title: '修改经纬度',
        visible: false
      },
      searchForm: {
        pcodename: '',
        type: '',
        brandId: '',
        regionIds: ''
      },
      selectRegionForm: {
        regionObj: ''
      },
      pageInfo: { page: 1, limit: 10 },
      tableData: [],
      brandData: [],
      checkedRegionId: '',
      checkedRegionId1: '',
      shopForm: {
        id: '',
        shopcode: '',
        shopname: '',
        brandId: '',
        brandCode: '',
        brandName: '',
        brandLogo: '',
        regionObj: '',
        regionObjValue: [],
        regionId: '',
        regionCode: '',
        regionName: '',
        type: '',
        logo: '',
        moblie: '',
        contacts: '',
        openTime: '',
        pca: [],
        address: '',
        lat: '',
        lng: '',
        paytId: '',
        paytName: '',
        isShow: '1',
        status: '1',
        isyy: '1',
        ispublic: '1',
        shopImages: [],
        isCompany: ''
      },
      shopConfigForm: {
        sptid: '',
        pptid: '',
        rptid: '',
        cptid: ''
      },
      shopImages: [],
      operateType: ''
    }
  },
  mounted() {
    window.addEventListener(
      'message',
      function (event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data
        if (loc && loc.module == 'locationPicker') {
          //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          console.log('location', loc)
          tempAddress = loc
        }
      },
      false
    )
    this.getRegionTreeAll()
    this.getBrandList()
    this.getBtypeAll()
    this.getProCityArea()
    this.getPayTemplateList()
    this.getServicePricetemps()
    this.getProductPricetemps()
    this.getCardTemps()
    this.getRoyaltyManages()
    this.getData()
  },
  components: {
    ShopInfo
  },
  methods: {
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
    handleNodeClick(data, checked, node) {
      if (checked == true) {
        let id = data.id
        let valueObj = {}
        valueObj.id = id
        valueObj.name = data.name
        this.selectRegionForm.regionObj = valueObj
        this.selectRegionForm.regionObj.childrenIds = []
        this.getSelectAllRegion(
          data,
          this.selectRegionForm.regionObj.childrenIds
        )
        this.$refs.templateRegionTree.setCheckedKeys([data.id])
      } else {
        if (this.selectRegionForm.regionObj.id == data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id])
        }
      }
      this.$refs.selectRegionRef.blur()
    },
    clearSelectRegion() {
      this.selectRegionForm.regionObj = {}
      this.$refs.templateRegionTree.setCheckedKeys([])
    },
    getRegionTreeAll() {
      service.chain.region.treeAllNoNum({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.regionData = res.data
        }
      })
    },
    getBtypeAll() {
      service.chain.btype.btypeAllList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.btypeList = res.data
        }
      })
    },
    getProCityArea() {
      service.chain.shop.getProCityArea(this.id).then(res => {
        this.proCityArea = res.data
      })
    },
    getPayTemplateList() {
      service.chain.payThead.listAll({}).then(res => {
        if (res.resp_code == 200) {
          this.payTemplateList = res.data
        }
      })
    },
    getProductPricetemps() {
      service.chain.productPrice
        .findProductPricetemps({ status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.productPricetemps = res.data
          }
        })
    },
    getCardTemps() {
      service.chain.cardTemp.findCardtemps({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.cardTemps = res.data
        }
      })
    },
    getRoyaltyManages() {
      service.chain.royaltyManage
        .findShopManages({ status: '1', type: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.royaltyManages = res.data
          }
        })
    },
    getServicePricetemps() {
      service.chain.servShop.findServicePrices({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.servicePricetemps = res.data
        }
      })
    },
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.pageInfo = { page: 1, limit: 10 }

          if (
            this.selectRegionForm.regionObj &&
            this.selectRegionForm.regionObj.id
          ) {
            //大区及以内区域都保存进去
            this.selectRegionForm.regionObj.childrenIds.push(
              this.selectRegionForm.regionObj.id
            )
            this.searchForm.regionIds =
              this.selectRegionForm.regionObj.childrenIds.toString()
          } else {
            this.searchForm.regionIds = ''
          }
          this.getData()
        }
      })
    },
    getData() {
      let params = { ...this.pageInfo, ...this.searchForm }
      const fetch = service.chain.shop.shopListWithPage
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    getBrandList() {
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.brandData = res.data
        }
      })
    },
    selectRegion(e) {
      var arrNew = []
      var dataLength = this.selectRegionForm.regionObjValue.length
      var eleng = e.length
      for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < eleng; j++) {
          if (e[j] === this.selectRegionForm.regionObjValue[i].name) {
            arrNew.push(this.selectRegionForm.regionObjValue[i])
          }
        }
      }
      this.$refs.templateRegionTree.setCheckedNodes(arrNew) //设置勾选的值
    },
    selectRegion1(e) {
      var arrNew = []
      var dataLength = this.shopForm.regionObjValue.length
      var eleng = e.length
      for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < eleng; j++) {
          if (e[j] === this.shopForm.regionObjValue[i].name) {
            arrNew.push(this.shopForm.regionObjValue[i])
          }
        }
      }
      this.$refs.templateTree1.setCheckedNodes(arrNew) //设置勾选的值
    },
    clearSelectRegion1() {
      this.shopForm.regionObjValue = []
      this.shopForm.regionObj = ''
      this.shopForm.regionId = ''
      this.$refs.templateTree1.setCheckedNodes([]) //设置勾选的值
    },
    disabledFn(data, node) {
      if (data.status === '2') {
        return true
      } else {
        return false
      }
    },
    templateCheckChange(data, checked, child) {
      if (!checked) {
        this.clearSelectRegion()
        return
      }

      if (checked === true) {
        this.checkedRegionId = data.id
        this.$refs.templateRegionTree.setCheckedKeys([data.id])
      } else {
        if (this.checkedRegionId === data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id])
        }
      }

      let res = this.$refs.templateRegionTree.getCheckedNodes(false, false) //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      let arrLabel = []
      let arr = []
      res.forEach(item => {
        arrLabel.push(item.name)
        arr.push(item)
      })
      this.selectRegionForm.regionObjValue = arr
      this.selectRegionForm.regionObj = arrLabel

      let _this = this
      setTimeout(function () {
        _this.$refs.selectRegionRef.blur()
      }, 50)
    },
    templateCheckChange1(data, checked, child) {
      if (!checked) {
        this.clearSelectRegion1()
        return
      }

      if (checked === true) {
        this.checkedRegionId1 = data.id
        this.$refs.templateTree1.setCheckedKeys([data.id])
      } else {
        if (this.checkedRegionId1 === data.id) {
          this.$refs.templateTree1.setCheckedKeys([data.id])
        }
      }

      let res = this.$refs.templateTree1.getCheckedNodes(false, false) //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      let arrLabel = []
      let arr = []
      res.forEach(item => {
        arrLabel.push(item.name)
        arr.push(item)
      })
      this.shopForm.regionObjValue = arr
      this.shopForm.regionObj = arrLabel

      let _this = this
      setTimeout(function () {
        _this.$refs.selectRegionRef1.blur()
      }, 50)
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
    showDetailPage(row) {
      console.log('this.brandData', this.brandData, row)
      let copyShopForm = JSON.parse(JSON.stringify(this.shopForm))
      const pca = [row.province + '', row.city + '', row.area + '']

      copyShopForm = {
        ...copyShopForm,
        ...row,
        pca,
        brandId: row.brandId + '',
        regionObj: [row.regionName],
        regionObjValue: [
          {
            id: row.regionId,
            code: row.regionCode,
            showname: row.regionName
          }
        ]
      }

      this.shopForm = copyShopForm

      this.listShow = false
      this.addShow = true
      this.addConfigShow = false
      this.infoShow = false
      this.operateType = 'detail'
    },
    closeDetailPage() {
      this.listShow = true
      this.addShow = false
      this.addConfigShow = false
      this.infoShow = false
      this.getData(this.searchFormReq)
    },
    addShop() {
      this.$refs['shopForm'].resetFields()
      this.operateType = 'add'
      this.shopForm.id = ''
      this.shopForm.address = ''
      this.shopForm.lat = ''
      this.shopForm.lng = ''
      this.shopForm.shopImages = []
      this.checkedRegionId1 = ''
      this.$refs.templateTree1.setCheckedKeys([])

      this.shopConfigForm.rptid = ''
      this.shopConfigForm.cptid = ''
      this.shopConfigForm.pptid = ''
      this.shopConfigForm.sptid = ''

      this.listShow = false
      this.addShow = true
      this.addConfigShow = false
      this.infoShow = false
    },
    handleShopLogo(res) {
      this.shopForm.logo = res.data.url
    },
    beforerUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        $yid.util.error('上传头像图片只能是 JPG/PNG 格式!')
        return
      }
      if (!isLt2M) {
        $yid.util.error('上传头像图片大小不能超过 10MB!')
        return
      }
      return isJPG && isLt2M
    },
    setLocation() {
      console.log(tempAddress)
      if (isEmpty(tempAddress.latlng)) {
        $yid.util.info('请选择地址')
        return
      }
      this.shopForm.lat = tempAddress.latlng.lat
      this.shopForm.lng = tempAddress.latlng.lng
      this.shopmap.visible = false
    },
    uploadSuccess(res, file) {
      this.shopForm.shopImages.push({
        url: res.data.url,
        showOrder: this.shopImages.length
      })
    },
    handleRemove(file) {
      if (file) {
        this.shopForm.shopImages.map((m, index) => {
          if (file.url == m.url) {
            this.shopForm.shopImages.splice(index, 1)
          }
        })
      }
      console.log(file)
    },
    checkShopcode() {
      let id = this.shopForm.id
      let shopcode = this.shopForm.shopcode
      const param = { id: id, shopcode: shopcode }
      service.chain.shop.checkShopcode(param).then(res => {
        if (res.resp_code == '200') {
          if (res.data != '0') {
            $yid.util.info(res.resp_msg)
            this.shopForm.shopcode = ''
          }
        }
      })
    },
    saveShop() {
      this.$refs['shopForm'].validate(async valid => {
        console.log(784)
        if (valid) {
          const params = { ...this.shopForm }
          // if (!this.shopForm.shopImages?.length) {
          //   $yid.util.error('请上传门店宣传图!')
          //   return
          // }
          if (this.shopForm.shopImages?.length > 6) {
            $yid.util.error('最多上传6张图片!')
            return
          }
          // if (
          //   (!this.shopForm.lat && this.shopForm.lat.length == 0) ||
          //   (!this.shopForm.lng && this.shopForm.lng.length == 0)
          // ) {
          //   $yid.util.error('请选择经纬度!')
          //   return
          // }
          if (this.shopForm.pca && this.shopForm.pca.length == 3) {
            params.province = this.shopForm.pca[0]
            params.city = this.shopForm.pca[1]
            params.area = this.shopForm.pca[2]
          }
          //品牌
          let isMatchingBrand = false
          for (let i = 0; i < this.brandData.length; i++) {
            if (this.brandData[i].id == this.shopForm.brandId) {
              params.brandCode = this.brandData[i].code
              params.brandName = this.brandData[i].name
              params.brandLogo = this.brandData[i].logo

              isMatchingBrand = true
              break
            }
          }
          if (!isMatchingBrand) {
            params.brandName = ''
            params.brandLogo = ''
          }

          //区域
          if (
            this.shopForm.regionObjValue != null &&
            this.shopForm.regionObjValue.length > 0
          ) {
            params.regionId = this.shopForm.regionObjValue[0].id
            params.regionCode = this.shopForm.regionObjValue[0].code
            params.regionName = this.shopForm.regionObjValue[0].showname
          } else {
            params.regionId = ''
            params.regionCode = ''
            params.regionName = ''
          }

          if (params.paytId) {
            for (let i = 0; i < this.payTemplateList.length; i++) {
              if (params.paytId == this.payTemplateList[i].id) {
                params.paytName = this.payTemplateList[i].name
              }
            }
          }

          params.imageFlag = '1'
          params.shopImages = []

          this.shopForm.shopImages?.map((m, index) => {
            params.shopImages.push({
              photoPath: m.url,
              showOrder: index + 1
            })
          })

          //体系传入值进去
          params.sptid = this.shopConfigForm.sptid
          params.pptid = this.shopConfigForm.pptid
          params.cptid = this.shopConfigForm.cptid
          params.rptid = this.shopConfigForm.rptid

          console.log(params)

          if (this.operateType === 'add') {
            await service.chain.shop.addShop(params)
          } else {
            await service.chain.shop.saveShop(params)
          }
          this.$message.success('操作成功')
          this.closeDetailPage()
        } else {
          if (this.addConfigShow) {
            $yid.util.alert('请检查上一步的必填项目是否填写')
          }
        }
      })
    },
    nextConfig() {
      this.listShow = false
      this.addShow = false
      this.addConfigShow = true
      this.infoShow = false
    },
    qianConfig() {
      this.listShow = false
      this.addShow = true
      this.addConfigShow = false
      this.infoShow = false
    },
    onEdit(row) {
      let copyShopForm = JSON.parse(JSON.stringify(this.shopForm))
      const pca = [row.province + '', row.city + '', row.area + '']

      copyShopForm = {
        ...copyShopForm,
        ...row,
        pca,
        brandId: row.brandId + '',
        regionObj: [row.regionName],
        regionObjValue: [
          {
            id: row.regionId,
            code: row.regionCode,
            showname: row.regionName
          }
        ]
      }

      this.shopForm = copyShopForm

      this.listShow = false
      this.addShow = true
      this.addConfigShow = false
      this.infoShow = false
      this.operateType = 'edit'
    }
  }
}
</script>

<style scoped></style>
