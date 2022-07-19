<template>
  <div class="dept">
    <el-page-header @back="goBack" content="门店详情"></el-page-header>
    <hr />
    <el-row>
      <el-col :span="3">
        <el-button
          type="primary"
          @click="editShopInfo()"
          v-if="!this.showButton"
          >修改门店资料</el-button
        >
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          @click="openShopImage()"
          v-if="!this.showButton"
          >修改门店宣传图</el-button
        >
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="openQcode()" v-if="!this.showButton"
          >门店收银开单码</el-button
        >
      </el-col>
      <!--<el-col :span="3"><el-button type="primary" @click="openQcode()" v-if="!this.showButton">门店推广二维码</el-button></el-col>-->
    </el-row>
    <el-divider></el-divider>
    <el-tag>基础信息</el-tag>
    <el-form
      :inline="true"
      label-width="100px"
      label-position="left"
      style="margin-top: 8px">
      <el-row :gutter="20">
        <el-col :span="8" v-if="shop.logo">
          <div class="block" style="width: 360px">
            <img
              :src="shop.logo"
              class="avatar el-upload"
              style="width: 200px; height: 200px" />
          </div>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-form-item label="门店编号：" class="formItemClass">{{
              shop.shopcode
            }}</el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="业务类型：" class="formItemClass">
              {{ getShopType(shop.type) }}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="门店品牌：" class="formItemClass">
              {{ shop.brandName }}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="门店电话：" class="formItemClass">
              {{ shop.moblie }}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="门店状态：" class="formItemClass">
              {{ shop.status == '1' ? '开店' : '关店' }}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="是否显示：" class="formItemClass">
              {{ shop.isShow == '1' ? '展示' : '隐藏' }}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="付款模板：" class="formItemClass">
              {{ shop.paytName }}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="咨询公司：" class="formItemClass">
              {{ shop.isCompany == '1' ? '是' : '否' }}
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-form-item label="门店名称：" class="formItemClass">{{
              shop.shopname
            }}</el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="预约名称：" class="formItemClass">{{
              shop.yyshopname
            }}</el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="组织机构：" class="formItemClass">{{
              shop.regionName
            }}</el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="营业时间：" class="formItemClass">{{
              shop.openTime
            }}</el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="省市区：" class="formItemClass">
              {{ shop.provincename + shop.cityname + shop.areaname }}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="门店地址：" class="formItemClass">{{
              shop.address
            }}</el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="经纬度：" class="formItemClass">{{
              shop.lat + ' , ' + shop.lng
            }}</el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>

    <el-tag>门店宣传图</el-tag>
    <div v-if="!shopImages || shopImages.length == 0" style="margin-top: 8px">
      还没有设置宣传图哦
    </div>
    <div
      v-if="shopImages && shopImages.length > 0"
      class="block"
      style="width: 360px; margin-top: 16px">
      <el-carousel trigger="click" height="260px">
        <el-carousel-item v-for="item in shop.shopImages" :key="item">
          <h3 class="small">
            <el-image style="width: 450px; height: 450px" :src="item.photoPath">
            </el-image>
          </h3>
        </el-carousel-item>
      </el-carousel>
    </div>

    <yid-dialog
      :title="editshop.title"
      :visible.sync="editshop.visible"
      @close="editshop.visible = false"
      width="800px">
      <el-form
        :model="shopForm"
        :rules="shopRules"
        label-width="130px"
        label-position="right"
        ref="editForm">
        <el-form-item label="门店名称：" prop="shopname">
          <el-input disabled="disabled" v-model="shopForm.shopname" />
        </el-form-item>
        <el-form-item label="预约名称：" prop="yyshopname">
          <el-input v-model="shopForm.yyshopname" />
        </el-form-item>
        <el-form-item label="联系人：" prop="contacts">
          <el-input disabled="disabled" v-model="shopForm.contacts" />
        </el-form-item>
        <el-form-item label="联系电话：" prop="moblie">
          <el-input disabled="disabled" v-model="shopForm.moblie" />
        </el-form-item>
        <el-form-item label="省市区：" prop="pca">
          <el-cascader
            disabled="disabled"
            @change="handleAddressChange"
            v-model="shopForm.pca"
            :options="proCityArea"
            :props="{ value: 'code', label: 'name' }"
            style="width: 320px"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input disabled="disabled" v-model="shopForm.address" />
        </el-form-item>
        <el-form-item label="营业时间：" prop="openTime">
          <el-input v-model="shopForm.openTime" />
        </el-form-item>
        <br />
        <el-form-item label="经纬度：" class="formItemClass">
          <el-col>
            <el-row
              >{{ shop.lat + ' , ' + shop.lng }}
              <el-button
                type="primary"
                @click="shopmap.visible = true"
                style="margin-left: 8px"
                >设置经纬</el-button
              >
            </el-row>
          </el-col>
        </el-form-item>
        <el-form-item label="品牌类型：">
          <el-select
            disabled="disabled"
            clearable
            v-model.trim="shopForm.brandId"
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
        <el-form-item label="付款模板：">
          <el-select
            clearable
            v-model.trim="shopForm.paytId"
            placeholder="请选择"
            style="width: 160px">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-for="item in payTemplateList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否咨询公司：">
          <el-radio-group disabled="disabled" v-model="shopForm.isCompany">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="业务类型：">
          <el-select
            disabled="disabled"
            clearable
            v-model.trim="shopForm.type"
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
        <el-form-item label="组织机构：">
          <el-select
            disabled="disabled"
            ref="selectRegionRef"
            v-model="selectRegionObj.regionObj"
            placeholder="请选择组织机构"
            multiple
            collapse-tags
            @change="selectRegion"
            style="width: 180px">
            <el-option
              :value="selectRegionObj.regionObjValue"
              style="height: auto">
              <el-tree
                size="small"
                accordion="true"
                show-checkbox
                :default-expand-all="true"
                :data="regionData"
                :props="defaultProps"
                node-key="id"
                :check-strictly="true"
                @check-change="templateCheckChange"
                ref="templateRegionTree">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信签名：">
          <el-select
            clearable
            v-model.trim="shopForm.msgType"
            @change="changeMsg(shopForm.msgType)"
            placeholder="请选择"
            style="width: 160px">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-for="item in msgData">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店状态" prop="status">
          <el-switch
            disabled="disabled"
            v-model="shopForm.status"
            active-value="1"
            inactive-value="2"
            active-text="开"
            inactive-text="关">
          </el-switch>
        </el-form-item>

        <el-form-item label="是否显示">
          <el-switch
            disabled="disabled"
            v-model="shopForm.isShow"
            active-value="1"
            inactive-value="0"
            active-text="显示"
            inactive-text="隐藏">
          </el-switch>
          <yid-ask>控制门店信息是否在小程序中显示</yid-ask>
        </el-form-item>
        <el-form-item label="门店logo：" prop="logo">
          <el-upload
            class="avatar-uploader"
            :action="upload"
            :headers="myheaders"
            :show-file-list="false"
            :on-success="handleShopLogo"
            :before-upload="beforerUpload">
            <img
              v-if="shopForm.logo"
              :src="shopForm.logo"
              class="avatar el-upload"
              style="width: 200px; height: 200px" />
            <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
            <div class="el-upload__tip" slot="tip">
              仅支持jpg，png格式的图片上传 图片尺寸：200px*200px
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateShop()">保存</el-button>
          <el-button
            @click="editshop.visible = false"
            style="padding-left: 15px"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="shopImage.title"
      :visible.sync="shopImage.visible"
      @close="shopImage.visible = false"
      width="640px">
      <div style="margin-bottom: 10px">
        <el-button
          @click="saveShopImages()"
          type="primary"
          style="margin-top: 10px; margin-right: 5px"
          >确定</el-button
        >
        <lebal
          >建议上传图片分辨率为233px
          *455px；支持图片格式：jpg、png最多仅支持上传6张</lebal
        >
      </div>
      <el-upload
        :action="upload"
        :headers="myheaders"
        :on-success="uploadSuccess"
        :before-upload="beforerUpload"
        :on-remove="handleRemove"
        :file-list="shopImage.shopImages"
        list-type="picture-card">
        <i slot="default" class="el-icon-plus"></i>
      </el-upload>
    </yid-dialog>

    <el-dialog
      :title="shopmap.title"
      :visible.sync="shopmap.visible"
      @close="shopmap.visible = false"
      width="600px">
      <iframe
        id="mapPage"
        width="100%"
        height="500px"
        frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OLEBZ-25DCQ-GHY5C-GJ6B4-BPHC2-4GF2N&referer=myapp">
      </iframe>
      <el-form ref="addressForm" label-width="200px">
        <el-form-item>
          <el-button type="primary" @click="setLocation()">确定</el-button>
          <el-button @click="shopmap.visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="shopQCode.title"
      :visible.sync="shopQCode.visible"
      @close="shopQCode.visible = false"
      width="500px"
      height="500px">
      <el-image style="width: 400px; height: 400px" :src="shopQCode.qrPath">
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'

let location

export default {
  name: 'shopinfo',
  data() {
    return {
      upload: yid.config.API.UPLOAD,
      id: '',
      myheaders: {},
      shop: {},
      shopForm: {
        shopname: '',
        yyshopname: '',
        contacts: '',
        moblie: '',
        address: '',
        openTime: '',
        brandId: '',
        paytId: '',
        type: '',
        id: '',
        pca: [],
        status: '',
        isShow: '',
        logo: '',
        code: '',
        msgType: '',
        isCompany: ''
      },
      editshop: {
        title: '修改门店信息',
        visible: false
      },
      shopImage: {
        title: '修改门店宣传图',
        visible: false,
        shopImages: []
      },
      shopmap: {
        title: '修改经纬度',
        visible: false
      },
      shopQCode: {
        type: 1,
        title: '门店收银开单码',
        visible: false,
        qrPath: null
      },
      proCityArea: [],
      shopRules: {
        shopname: [
          { required: true, message: '请填写门店名称' },
          { min: 0, max: 12, message: '支付名称在12个字符以内' }
        ],
        //contacts:[{required: true, message:'请填写联系人'}],
        //moblie:[{required: true, message:'请填写联系电话'}],
        pca: [{ required: true, message: '请选择省市区', trigger: 'change' }],
        address: [{ required: true, message: '请填写详细地址' }],
        //logo:[{required: true, message:'请选择门店logo'}],
        status: [{ required: true, message: '门店状态不能为空' }]
      },
      brandData: [],
      btypeList: [],
      regionData: [],
      payTemplateList: [], //付款模板list
      selectRegionObj: {
        regionObj: [],
        regionObjValue: []
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: this.disabledFn
      },
      shopImages: [],
      msgData: [],
      showButton: ''
    }
  },
  mounted() {
    this.myheaders = {
      authorization: 'Bearer ' + $yid.cache.get($yid.type.USER.TOKEN)
    }
    window.addEventListener(
      'message',
      function (event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data
        if (loc && loc.module == 'locationPicker') {
          //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          console.log('location', loc)
          location = loc
        } else {
          //$yid.util.error("定位失败，请重试");
        }
      },
      false
    )
  },
  methods: {
    async init(obj) {
      if (obj != null) {
        this.id = obj.id
        this.showButton = obj.showButton
        this.resetData()
      }
      await this.getBrandList()
      await this.getBtypeAll()
      await this.getRegionTreeAll()
      await this.getPayTemplateList()
      await this.getProCityArea()
    },
    resetData() {
      this.shop = {}
      this.shopForm = {
        shopname: '',
        yyshopname: '',
        contacts: '',
        moblie: '',
        address: '',
        openTime: '',
        brandId: '',
        paytId: '',
        type: '',
        id: '',
        pca: [],
        status: '',
        isShow: '',
        logo: '',
        msgType: '',
        isCompany: ''
      }
    },
    async openQcode() {
      if (!this.shopQCode.qrPath) {
        let reqParam = {
          shopid: this.shop.id,
          shopcode: this.shop.shopcode,
          shopname: this.shop.shopname,
          appid: this.shop.appid
        }
        let that = this
        await service.shop.getShopQueuingCode(reqParam).then(res => {
          if (res.resp_code == '200') {
            that.shopQCode.visible = true
            that.shop.qrPath = res.data.url
            that.shopQCode.qrPath = that.shop.qrPath
            that.toUpdateShop() //加永久码图片保存到数据库
          }
        })
      } else {
        this.shopQCode.visible = true
      }
    },
    openShopImage() {
      this.shopImage.visible = true
      this.shopImage.shopImages = []
      this.shop.shopImages.forEach(m => {
        this.shopImage.shopImages.push({ url: m.photoPath })
      })
    },
    async getProCityArea() {
      await service.chain.shop.getProCityArea(this.id).then(res => {
        this.proCityArea = res.data
        this.getShopInfo()
        this.getShopImages()
      })
    },
    async getShopInfo() {
      let that = this
      await service.chain.shop.getShopInfo(this.id).then(res => {
        that.shop = res.data
        that.shopQCode.qrPath = that.shop.qrPath
        that.initShopFormData()
      })
    },
    initShopFormData() {
      let that = this
      that.shopForm.pca = []
      if (that.shop.paytId) {
        that.shopForm.paytId = that.shop.paytId.toString() //select 匹配
      } else {
        that.shopForm.paytId = ''
      }
      that.brandData.map(p => {
        if (that.shop.brandCode == p.code) {
          that.shop.appid = p.appid
        }
      })

      that.proCityArea.map(p => {
        if (that.shop.province && that.shop.province == p.code) {
          that.shop.provincename = p.name
          that.shopForm.pca.push(p.code)
          p.children.map(c => {
            if (that.shop.city && that.shop.city == c.code) {
              that.shop.cityname = c.name
              that.shopForm.pca.push(c.code)
              c.children.map(a => {
                if (that.shop.area && that.shop.area == a.code) {
                  that.shop.areaname = a.name
                  that.shopForm.pca.push(a.code)
                }
              })
            }
          })
        }
      })
      that.shopForm.shopname = that.shop.shopname
      that.shopForm.yyshopname = that.shop.yyshopname
      that.shopForm.contacts = that.shop.contacts
      that.shopForm.moblie = that.shop.moblie
      that.shopForm.address = that.shop.address
      that.shopForm.openTime = that.shop.openTime
      that.shopForm.status = that.shop.status
      that.shopForm.isShow = that.shop.isShow
      that.shopForm.logo = that.shop.logo
      that.shopForm.brandId = that.shop.brandId + ''
      that.shopForm.type = that.shop.type
      that.shopForm.isCompany = that.shop.isCompany + ''
      if (that.shop.code) {
        that.shopForm.msgType = that.shop.code.replace(/\b(0+)/gi, '')
      }
    },
    getShopImages() {
      service.chain.shop.getShopImages(this.id).then(res => {
        this.shopImages = res.data.data
      })
    },
    async editShopInfo() {
      this.editshop.visible = true
      this.selectRegionObj.regionObjValue = []
      this.selectRegionObj.regionObj = []
      for (let i = 0; i < this.regionData.length; i++) {
        let itemRegion = this.regionData[i]
        this.traverseRegion(
          itemRegion,
          this.shop.regionId,
          this.selectRegionObj
        )
      }
      console.log(this.shopForm)
      this.initShopFormData()
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
    uploadSuccess(res, file) {
      this.shopImage.shopImages.push({
        url: res.data.url,
        showOrder: this.shopImages.length
      })
    },
    handleRemove(file) {
      if (file) {
        this.shopImage.shopImages.map((m, index) => {
          if (file.url == m.url) {
            this.shopImage.shopImages.splice(index, 1)
          }
        })
      }
      console.log(file)
    },
    saveShopImages() {
      if (!this.shopImage.shopImages && this.shopImage.shopImages.length == 0) {
        $yid.util.error('请上传门店宣传图!')
        return
      }
      if (this.shopImage.shopImages.length > 6) {
        $yid.util.error('最多上传6张图片!')
        return
      }
      const params = {
        id: this.shop.id,
        imageFlag: '1',
        shopImages: []
      }
      this.shopImage.shopImages.map((m, index) => {
        params.shopImages.push({
          shopid: this.shop.id,
          photoPath: m.url,
          showOrder: index + 1
        })
      })
      this.saveShop(params)
    },
    setLocation() {
      if (!location) {
        $yid.util.error('没有定位，请选择定位!')
        return
      }
      this.shopmap.visible = false
      this.shop.lat = location.latlng.lat
      this.shop.lng = location.latlng.lng
      // this.saveShop(params)
    },
    updateShop() {
      const that = this
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          that.toUpdateShop()
        }
      })
    },
    toUpdateShop() {
      const that = this
      if (!yid.util.isEmpty(that.shopForm.moblie)) {
        if (
          !$yid.validate.telephone(that.shopForm.moblie) &&
          !$yid.validate.mobile(that.shopForm.moblie)
        ) {
          $yid.util.error('联系电话格式不对!')
          return
        }
      }
      const params = { ...that.shop }
      if (that.shopForm.pca && that.shopForm.pca.length == 3) {
        params.province = that.shopForm.pca[0]
        params.city = that.shopForm.pca[1]
        params.area = that.shopForm.pca[2]
      }
      //品牌
      let isMatchingBrand = false
      for (let i = 0; i < this.brandData.length; i++) {
        if (this.brandData[i].id == this.shopForm.brandId) {
          params.brandName = this.brandData[i].name
          params.brandLogo = this.brandData[i].logo
          params.brandId = this.shopForm.brandId
          params.brandCode = this.brandData[i].code

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
        this.selectRegionObj.regionObjValue != null &&
        this.selectRegionObj.regionObjValue.length > 0
      ) {
        params.regionId = this.selectRegionObj.regionObjValue[0].id
        params.regionName = this.selectRegionObj.regionObjValue[0].showname
      } else {
        params.regionId = ''
        params.regionName = ''
      }
      if (that.shopForm.paytId) {
        for (let i = 0; i < this.payTemplateList.length; i++) {
          if (that.shopForm.paytId == this.payTemplateList[i].id) {
            params.paytName = this.payTemplateList[i].name
            params.paytId = that.shopForm.paytId
          }
        }
      }
      params.shopname = that.shopForm.shopname
      params.yyshopname = that.shopForm.yyshopname
      params.contacts = that.shopForm.contacts
      params.moblie = that.shopForm.moblie
      params.address = that.shopForm.address
      params.openTime = that.shopForm.openTime
      params.status = that.shopForm.status
      params.isShow = that.shopForm.isShow
      params.logo = that.shopForm.logo
      params.type = that.shopForm.type
      params.qrPath = that.shop.qrPath
      params.code = that.shopForm.code
      params.isCompany = that.shopForm.isCompany
      that.saveShop(params)
    },
    saveShop(params) {
      service.chain.shop.saveShop(params).then(res => {
        if (res.resp_code == '200') {
          $yid.util.success(res.resp_msg)
          this.closeDialog()
          this.getShopInfo()
        } else {
          $yid.util.error(res.resp_msg)
        }
      })
    },
    closeDialog() {
      this.shop.visible = false
      this.editshop.visible = false
      this.shopImages.visible = false
    },
    goBack() {
      this.$emit('onClose')
    },
    handleShopLogo(res) {
      this.shopForm.logo = res.data.url
    },
    getBrandList() {
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.brandData = res.data
          this.msgData = this.brandData
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
    getRegionTreeAll() {
      service.chain.region.treeAll({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.regionData = res.data
        }
      })
    },
    getPayTemplateList() {
      service.chain.payThead.listAll({}).then(res => {
        if (res.resp_code == 200) {
          this.payTemplateList = res.data
        }
      })
    },
    selectRegion(e) {
      let arrNew = []
      let dataLength = this.selectRegionObj.regionObjValue.length
      let eleng = e.length
      for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < eleng; j++) {
          if (e[j] === this.selectRegionObj.regionObjValue[i].name) {
            arrNew.push(this.selectRegionObj.regionObjValue[i])
          }
        }
      }
      this.$refs.templateRegionTree.setCheckedNodes(arrNew) //设置勾选的值
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
      this.selectRegionObj.regionObjValue = arr
      this.selectRegionObj.regionObj = arrLabel

      let _this = this
      setTimeout(function () {
        _this.$refs.selectRegionRef.blur()
      }, 50)
    },
    clearSelectRegion() {
      this.selectRegionObj.regionObjValue = []
      this.selectRegionObj.regionObj = []
      this.shop.regionId = ''
      this.$refs.templateRegionTree.setCheckedNodes([]) //设置勾选的值
    },
    disabledFn(data, node) {
      if (data.status === '2') {
        return true
      } else {
        return false
      }
    },
    traverseRegion(regionData, selectRegionId, selectRegionObj) {
      let that = this
      if (parseInt(regionData.id) == selectRegionId) {
        selectRegionObj.regionObjValue.push(regionData)
        selectRegionObj.regionObj.push(regionData.name)
        this.$nextTick(() => {
          that.$refs.templateRegionTree.setCheckedNodes(
            selectRegionObj.regionObjValue
          )
        })
        return
      }
      if (regionData.children && regionData.children.length > 0) {
        regionData.children.map(item => {
          that.traverseRegion(item, selectRegionId, selectRegionObj)
        })
      }
    },
    getShopType(type) {
      let res = ''
      this.btypeList.forEach(data => {
        if (Number(data.id) == Number(type)) {
          res = data.name
        }
      })
      return res
    },
    handleAddressChange(v) {
      this.shop.pca = v
    },
    changeMsg(val) {
      console.log(this.shopForm.msgType)
      if (val) {
        this.shopForm.code = '0' + val
        this.shopForm.msgType = val
      }
    }
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.formItemClass {
  width: 380px;
}

.formItemClass1 {
  width: 340px;
}
</style>
