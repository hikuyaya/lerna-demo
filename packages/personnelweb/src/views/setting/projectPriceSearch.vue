<template>
  <div>
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item
        label="门店："
        prop="shopid"
        :rules="[{ required: true, message: '必须选择一个门店' }]">
        <el-select
          @clear="clearFormShop"
          @blur="clearFormShop"
          clearable
          v-model.trim="searchForm.shopid"
          @change="changeShop"
          filterable
          :filter-method="filterShop"
          placeholder="请选择门店"
          style="width: 160px">
          <el-option
            :key="item.id"
            :label="item.shopname"
            :value="item.id"
            v-for="item in filterShopList">
            <span style="float: left">{{ item.shopcode }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.shopname
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-select
          clearable
          filterable
          v-model="searchForm.branch"
          @change="changeBranch"
          placeholder="请选择部门"
          style="width: 160px">
          <el-option
            v-for="item in branchList"
            :key="item.bcode"
            :label="item.bname"
            :value="item.bcode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          clearable
          filterable
          v-model="searchForm.servtid"
          placeholder="请选择分类"
          style="width: 160px">
          <el-option
            v-for="item in serviceFilterList"
            :key="item.scode"
            :label="item.sname"
            :value="item.scode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目">
        <el-input
          clearable
          filterable
          v-model="searchForm.servname"
          placeholder="项目编码/项目名称"
          style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          clearable
          filterable
          v-model="searchForm.status"
          placeholder="请选择"
          style="width: 100px">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="search" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table
      pagination
      ref="table"
      style="width: 100%; margin-top: 20px"
      :data="tableData">
      <yid-table-column
        label="编号"
        prop="servcode"
        width="60"></yid-table-column>
      <yid-table-column
        label="名称"
        prop="servname"
        width="120"></yid-table-column>
      <yid-table-column
        label="所属部门"
        prop="dept"
        width="80"></yid-table-column>
      <yid-table-column
        label="分类"
        prop="servtname"
        width="70"></yid-table-column>
      <yid-table-column label="类别" prop="sertype" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sertype == '1'">大项目</span>
          <span v-if="scope.row.sertype == '2'">小项目</span>
          <span v-if="scope.row.sertype == '3'">不计服务业绩</span>
        </template>
      </yid-table-column>
      <yid-table-column label="基础定价" prop="price" width="140">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="2"
              ><i class="el-icon-edit" @click="editPrice(scope.row)"></i
            ></el-col>
            <el-col :span="22">
              <div>{{ scope.row.price ? '￥' + scope.row.price : '' }}</div>
              <div>
                {{
                  scope.row.minPrice
                    ? '最低价:' + scope.row.minPrice + '元'
                    : ''
                }}
              </div>
            </el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column label="会员卡折扣价设定" prop="discount" width="180">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <div :key="item.id" v-for="item in scope.row.servcards">
                {{ item.cardname }}
                {{ item.dtype == '1' ? item.value + '折' : item.value + '元' }}
              </div>
            </el-col>
            <el-col :span="2"
              ><i class="el-icon-plus" @click="editDiscount(scope.row)"></i
            ></el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column label="员工级别价格设置" prop="special" width="180">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <div :key="item.id" v-for="item in scope.row.servspecs">
                {{ item.btype == '1' ? item.pslname : item.eename }}
                {{ item.specialPrice + '元' }}
              </div>
            </el-col>
            <el-col :span="2"
              ><i
                class="el-icon-document"
                @click="showSpecialDialog(scope.row)"></i>
            </el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column
        label="修改人"
        prop="updatedBy"
        width="100"></yid-table-column>
      <yid-table-column
        label="修改时间"
        prop="updatedTime"
        width="110"></yid-table-column>
      <yid-table-column label="状态" prop="isDel" width="120">
        <template slot-scope="scope">
          <el-switch
            style="margin: 0 10px 0 10px"
            @change="stop(scope.row)"
            v-model="scope.row.status == '1' ? true : false"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog
      :title="priceDialog.title"
      :visible.sync="priceDialog.visible"
      @close="levelCancel"
      width="450px">
      <el-form :model="priceDialog" label-width="150px" ref="copyForm">
        <el-form-item label="项目名称：">
          {{ priceDialog.title }}
        </el-form-item>
        <el-form-item label="基础定价：">
          <el-input
            clearable
            type="number"
            min="0"
            v-model="priceDialog.price" />
          <br />
        </el-form-item>
        <el-form-item label="最低价：">
          <el-input
            clearable
            type="number"
            min="0"
            :max="priceDialog.price"
            :disabled="!priceDialog.price"
            v-model="priceDialog.minPrice" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="salePriceDialog">保存</el-button>
          <el-button @click="levelCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="discountDialog.title"
      :visible.sync="discountDialog.visible"
      @close="levelCancel"
      width="550px">
      <el-form :model="discountDialog" label-width="150px" ref="copyForm">
        <el-form-item label="设置方式">
          <el-select style="width: 160px" v-model="discountDialog.type">
            <el-option label="不设置" value="0"></el-option>
            <el-option label="单独设置" value="1"></el-option>
            <el-option label="全部会员卡" value="2"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="discountDialog.type == 1">
          <el-form-item
            :label="card.cardname"
            :key="card.cardid"
            v-for="card in discountDialog.cards">
            <el-select
              clearable
              style="width: 160px"
              @change="checkDiscount(card)"
              v-model="card.dtype">
              <el-option label="折扣" value="1"></el-option>
              <el-option label="会员价" value="2"></el-option>
            </el-select>
            <el-input
              clearable
              type="number"
              min="1"
              @blur="checkDiscount(card)"
              v-model="card.value"
              style="width: 100px; margin-left: 15px" />
            <label-wrap
              v-show="card.dtype"
              v-text="card.dtype == 1 ? '折' : '元'"></label-wrap>
          </el-form-item>
        </template>
        <template v-if="discountDialog.type == 2">
          <el-form-item :label="discountDialog.card.cardname">
            <el-select
              clearable
              style="width: 160px"
              @change="checkDiscount(card)"
              v-model="discountDialog.card.dtype">
              <el-option label="折扣" value="1"></el-option>
              <el-option label="会员价" value="2"></el-option>
            </el-select>
            <el-input
              clearable
              type="number"
              min="1"
              @blur="checkDiscount(discountDialog.card)"
              v-model="discountDialog.card.value"
              style="width: 100px; margin-left: 15px" />
            <label-wrap
              v-show="discountDialog.card.dtype"
              v-text="
                discountDialog.card.dtype == 1 ? '折' : '元'
              "></label-wrap>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="saveDiscount()">保存</el-button>
          <el-button @click="levelCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="speicalDialog.title"
      :visible.sync="speicalDialog.visible"
      @close="levelCancel"
      width="auto">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <el-select v-model="speicalDialog.type" @change="changSpeicalType">
            <el-option label="按职位级别" value="1"> </el-option>
            <el-option label="按个人" value="2"> </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="speicalDialog.id" @change="changSpeicalData">
            <el-option
              v-show="item.eecode"
              :key="item.id"
              v-for="item in speicalDialog.speicalData"
              :label="item.eecode + '-' + item.name"
              :value="item.id">
            </el-option>
            <el-option
              v-show="!item.eecode"
              :key="item.id"
              v-for="item in speicalDialog.speicalData"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" @click="addSpeicalRow()">添加</el-button>
        </el-col>
      </el-row>
      <yid-table
        ref="tab"
        style="margin-top: 15px"
        :data="speicalDialog.speicalRows">
        <yid-table-column label="职位" min-width="150" prop="btype">
          <template slot-scope="scope">
            <div>
              [{{ scope.row.btype == '1' ? '职务级别' : '个人' }}]{{
                scope.row.btype == '1'
                  ? scope.row.pslname
                  : scope.row.eecode + '-' + scope.row.eename
              }}
            </div>
          </template>
        </yid-table-column>
        <yid-table-column label="特殊价格" min-width="120" prop="specialPrice">
          <template slot-scope="scope">
            <el-input
              clearable
              type="number"
              min="1"
              placeholder="必填"
              v-model="scope.row.specialPrice" />
          </template>
        </yid-table-column>
        <yid-table-column label="最低价格" min-width="130" prop="minPrice">
          <template slot-scope="scope">
            <el-input
              clearable
              type="number"
              min="1"
              :max="scope.row.specialPrice"
              @blur="checkSpecialPrice(scope.row)"
              placeholder="不必填"
              v-model="scope.row.minPrice" />
          </template>
        </yid-table-column>
        <yid-table-column label="会员卡折扣" min-width="380" align="left">
          <template slot-scope="scope">
            <el-select v-model="scope.row.discountType" style="width: 120px">
              <el-option label="不设置" value="0"></el-option>
              <el-option label="单独设置" value="1"></el-option>
              <el-option label="全部会员卡" value="2"></el-option>
            </el-select>
            <el-row
              type="flex"
              justify="space-between"
              class="margin5"
              :key="item.cardid"
              v-for="item in scope.row.discounts"
              v-show="scope.row.discountType == 1">
              <el-col :span="8">{{ item.cardName }}</el-col>
              <el-col :span="8">
                <el-select
                  clearable
                  v-model="item.dtype"
                  @change="checkDiscount(item)">
                  <el-option label="折扣" value="1"></el-option>
                  <el-option label="会员价" value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input
                  type="number"
                  min="1"
                  @blur="checkDiscount(item)"
                  v-model="item.value"
                  clearable />
              </el-col>
              <el-col :span="2">
                <label-wrap
                  v-show="item.dtype"
                  v-text="item.dtype == 1 ? '折' : '元'"></label-wrap>
              </el-col>
            </el-row>
            <el-row
              type="flex"
              justify="space-between"
              v-show="scope.row.discountType == 2">
              <el-col :span="9">
                <el-select
                  clearable
                  v-model="scope.row.dtype"
                  @change="checkDiscount(scope.row)">
                  <el-option label="折扣" value="1"></el-option>
                  <el-option label="会员价" value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-input
                  type="number"
                  min="1"
                  @blur="checkDiscount(scope.row)"
                  v-model="scope.row.value"
                  clearable />
              </el-col>
              <el-col :span="6">
                <label-wrap
                  v-show="scope.row.dtype"
                  v-text="scope.row.dtype == 1 ? '折' : '元'"></label-wrap>
              </el-col>
            </el-row>
          </template>
        </yid-table-column>
        <yid-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <el-link
              type="primary"
              style="margin: 0 10px 0 10px"
              @click="deleteSpeicalRow(scope.row)"
              >删除
            </el-link>
          </template>
        </yid-table-column>
      </yid-table>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveSpeical()">保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="levelCancel">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>
    <!--        <yid-dialog :title="specialDialog.title" :visible.sync="specialDialog.visible" @close="hideSpecialDialog" width="auto">-->
    <!--            <el-row type="flex" justify="space-between">-->
    <!--                项目名称：{{specialDialog.servname}}-->
    <!--            </el-row>-->
    <!--            <yid-table ref="specialTable" style="margin-top: 15px;" :data="specialDialog.specialRows">-->
    <!--                <yid-table-column label="职位" min-width="150" prop="btype">-->
    <!--                    <template slot-scope="scope">-->
    <!--                        <div>[{{scope.row.btype=="1"?"职务级别":"个人"}}]{{scope.row.btype=="1"?scope.row.pslname:scope.row.eename}}</div>-->
    <!--                    </template>-->
    <!--                </yid-table-column>-->
    <!--                <yid-table-column label="特殊价格"  prop="specialPrice" width="120"></yid-table-column>-->
    <!--                <yid-table-column label="最低价格"  prop="minPrice" width="120"></yid-table-column>-->
    <!--                <yid-table-column label="会员卡折扣"  width="350">-->
    <!--                    <template slot-scope="scope">-->
    <!--                        <el-row type="flex" justify="space-between" class="margin5"-->
    <!--                                :key="item.cardid" v-for="item in scope.row.discounts"-->
    <!--                                v-show="scope.row.discountType==1">-->
    <!--                            <el-col :span="8">{{item.cardName}}</el-col>-->
    <!--                            <el-col :span="8">-->
    <!--                                &lt;!&ndash;<el-select disabled="disabled" v-model="item.dtype">-->
    <!--                                    <el-option label="折扣" value="1"></el-option>-->
    <!--                                    <el-option label="会员价" value="2"></el-option>-->
    <!--                                </el-select>&ndash;&gt;-->
    <!--                                {{item.dtype == "1" ? "折扣": "会员价"}}-->
    <!--                            </el-col>-->
    <!--                            <el-col :span="6">-->
    <!--                                &lt;!&ndash;<el-input disabled="disabled" type="number" min="1" v-model="item.value"/>&ndash;&gt;-->
    <!--                                {{item.value}}-->
    <!--                            </el-col>-->
    <!--                            <el-col :span="2"><label-wrap v-show="item.dtype" v-text="item.dtype==1?'折':'元'"></label-wrap></el-col>-->
    <!--                        </el-row>-->
    <!--                        <el-row type="flex" justify="space-between" v-show="scope.row.discountType==2" >-->
    <!--                            <el-col :span="9">-->
    <!--                               &lt;!&ndash; <el-select disabled="disabled" v-model="scope.row.dtype">-->
    <!--                                    <el-option label="折扣" value="1"></el-option>-->
    <!--                                    <el-option label="会员价" value="2"></el-option>-->
    <!--                                </el-select>&ndash;&gt;-->
    <!--                                {{scope.row.dtype == "1" ? "折扣": "会员价"}}-->
    <!--                            </el-col>-->
    <!--                            <el-col :span="9">-->
    <!--                                &lt;!&ndash;<el-input disabled="disabled" type="number" min="1" v-model="scope.row.value"/>&ndash;&gt;-->
    <!--                                {{scope.row.value}}-->
    <!--                            </el-col>-->
    <!--                            <el-col :span="6"><label-wrap v-show="scope.row.dtype" v-text="scope.row.dtype==1?'折':'元'"></label-wrap></el-col>-->
    <!--                        </el-row>-->
    <!--                    </template>-->
    <!--                </yid-table-column>-->
    <!--            </yid-table>-->
    <!--        </yid-dialog>-->
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'

export default {
  name: 'projectPriceSearch',
  data() {
    return {
      searchForm: {
        shopid: '',
        servtid: '',
        branch: '',
        pcodename: '',
        status,
        servname: '',
        shopcode: '',
        shopname: ''
      },
      allShopList: [],
      filterShopList: [],
      branchList: [],
      serviceTypeList: [],
      serviceFilterList: [],
      tableData: [],
      pageInfo: { page: 1, limit: 10 },
      statusList: [
        {
          id: '1',
          name: '正常'
        },
        {
          id: '2',
          name: '停用'
        }
      ],
      speicalDialog: {
        servid: '',
        title: '',
        visible: false,
        type: '1',
        specialData: [],
        id: '',
        code: '',
        name: '',
        specialRows: [],
        cards: [],
        servname: '',
        shopid: '',
        shopcode: '',
        shopname: ''
      },
      priceDialog: {
        title: '',
        visible: false,
        servid: '',
        price: '',
        minPrice: '',
        allowDiscount: true,
        shopid: '',
        shopcode: '',
        shopname: ''
      },
      discountDialog: {
        servid: '',
        title: '',
        visible: false,
        type: '',
        cards: [],
        card: {
          cardid: '-1',
          dtype: '',
          value: '',
          cardname: '全部会员卡'
        },
        shopid: '',
        shopcode: '',
        shopname: ''
      },
      shopcode: '',
      shopname: ''
    }
  },
  mounted() {
    this.getShopList({ status: '1' })
    this.getServiceTypeList()
    this.getBranchList()
    this.init()
  },
  methods: {
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    getBranchList() {
      service.chain.branch.listAll({ status: '1', isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.branchList = res.data
        }
      })
    },
    getServiceTypeList() {
      service.serviceInfo.findServiceType().then(res => {
        this.serviceTypeList = res.data
      })
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

    changeBranch(id) {
      this.searchForm.scode = ''
      this.serviceFilterList = []
      this.serviceTypeList.forEach(item => {
        if (id == item.branch) {
          this.serviceFilterList.push(item)
        }
      })
    },
    getProjectPriceList(reqParams) {
      const fetch = service.base.servicebaseInfo.findChainList
      const params = { ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (!valid) {
          return
        }
        this.init()
        this.getProjectPriceList(this.searchForm)
      })
    },

    //员工级别价格设置
    showSpecialDialog(row) {
      this.speicalDialog.title = '员工级别价格设置'
      this.speicalDialog.visible = true
      this.speicalDialog.servid = row.id
      this.speicalDialog.speicalRows = []
      this.speicalDialog.servname = row.servname
      if (row.servspecs && row.servspecs.length > 0) {
        row.servspecs.filter(item => {
          this.speicalDialog.speicalRows.push({ ...item })
        })
      }
      this.changSpeicalType(this.speicalDialog.type)
    },
    changSpeicalType(id) {
      this.speicalDialog.id = ''
      if (id == '1') {
        this.speicalDialog.speicalData = this.positions
      } else {
        this.speicalDialog.speicalData = this.employees
      }
    },
    changSpeicalData(id) {
      this.speicalDialog.speicalData.forEach(item => {
        if (id == item.id) {
          this.speicalDialog.code = item.code
          this.speicalDialog.name = item.name
        }
      })
    },
    init() {
      // service.serviceInfo.findbranch({"status":"1"}).then(res => {
      //   this.branch=res.data
      // });
      // service.serviceInfo.findServiceType({"status":"1"}).then(res => {
      //   this.serviceAllType=res.data;
      // })
      this.discountDialog.cards = []
      this.speicalDialog.cards = []
      service.base.servicebaseInfo
        .findCardinfos({ shopid: this.searchForm.shopid })
        .then(res => {
          if (res.data) {
            res.data.forEach(item => {
              this.discountDialog.cards.push({
                cardid: item.id,
                cardname: item.cpname,
                value: '',
                dtype: '',
                cpcode: item.cpcode
              })
              this.speicalDialog.cards.push({
                cardid: item.id,
                cardName: item.cpname,
                value: '',
                dtype: '',
                cpcode: item.cpcode
              })
            })
          }
        })
      service.base.servicebaseInfo
        .findEmployees({
          status: '1',
          shopid: this.searchForm.shopid
        })
        .then(res => {
          this.employees = res.data
          if (this.employees) {
            this.employees.forEach(item => {
              item.code = item.eecode
              item.name = item.eename
            })
          }
        })
      service.base.servicebaseInfo
        .findPositions({
          status: '1',
          shopid: this.searchForm.shopid
        })
        .then(res => {
          this.positions = res.data
          if (this.positions) {
            this.positions.forEach(item => {
              item.code = item.pslcode
              item.name = item.pslname
            })
          }
        })
    },
    addSpeicalRow() {
      if (!this.speicalDialog.id) {
        yid.util.error('请选择职务或者员工')
        return
      }
      let flag = false
      this.speicalDialog.speicalRows.forEach(item => {
        if (
          item.btype == '1' &&
          this.speicalDialog.type == '1' &&
          item.pslid == this.speicalDialog.id
        ) {
          flag = true
        }
        if (
          item.btype == '2' &&
          this.speicalDialog.type == '2' &&
          item.eeid == this.speicalDialog.id
        ) {
          flag = true
        }
      })
      if (flag) {
        yid.util.error(this.speicalDialog.name + '已经在表格中')
        return
      }
      const discounts = []
      this.speicalDialog.cards.filter(item => {
        discounts.push({ ...item })
      })
      this.speicalDialog.speicalRows.push({
        servid: this.speicalDialog.servid,
        pslid: this.speicalDialog.type == '1' ? this.speicalDialog.id : '',
        pslcode: this.speicalDialog.type == '1' ? this.speicalDialog.code : '',
        pslname: this.speicalDialog.type == '1' ? this.speicalDialog.name : '',
        eeid: this.speicalDialog.type == '2' ? this.speicalDialog.id : '',
        eecode: this.speicalDialog.type == '2' ? this.speicalDialog.code : '',
        eename: this.speicalDialog.type == '2' ? this.speicalDialog.name : '',
        btype: this.speicalDialog.type,
        specialPrice: '',
        minPrice: '',
        discountType: '0',
        discounts: discounts,
        dtype: '',
        value: ''
      })
    },
    checkSpecialPrice(data) {
      if (
        data.specialPrice &&
        data.minPrice &&
        data.minPrice > data.specialPrice
      ) {
        yid.util.error('最低价不能超过基础定价')
        data.minPrice = ''
        return
      }
    },
    checkDiscount(card) {
      if (
        card.dtype == '1' &&
        card.value &&
        (card.value > 10 || card.value < 0)
      ) {
        yid.util.error('折扣应该是大于等于0，小于等于10')
        card.value = ''
        return false
      }
    },
    deleteSpeicalRow(row) {
      let num = -1
      this.speicalDialog.speicalRows.forEach((item, index) => {
        if (row.btype == item.btype && row.eeid == item.eeid) {
          num = index
        }
      })
      if (num >= 0) {
        this.speicalDialog.speicalRows.splice(num, 1)
      }
    },
    saveSpeical() {
      let message = ''
      this.speicalDialog.speicalRows.forEach(item => {
        if (!item.specialPrice) {
          message +=
            (item.dtype == '1' ? item.pslname : item.eename) + '特殊价必填'
        }
        if (item.specialPrice && item.discountType == '0') {
          message +=
            (item.dtype == '1' ? item.pslname : item.eename) +
            '会员卡折扣必须设置'
        }
      })
      if (message) {
        yid.util.error(message)
        return
      }
      let messcode = ''
      let messname = ''
      this.speicalDialog.speicalRows.forEach(item => {
        const name = item.btype == '1' ? item.pslname : item.eename
        if (item.discountType == '1' && item.discounts) {
          let i = 0
          item.discounts.forEach(dis => {
            if (dis.dtype && dis.value) i++
            if ((!dis.dtype && dis.value) || (dis.dtype && !dis.value))
              message += name + ':' + dis.cardName + ' '
            if (
              dis.dtype == '1' &&
              dis.value &&
              (dis.value > 10 || dis.value < 0)
            )
              messcode += name + ':' + dis.cardname + ' '
          })
          if (i == 0) {
            messname += name + ' '
          }
        }
        if (item.discountType == '2') {
          if (!item.dtype || !item.value) message += name + ':' + '全部会员卡 '
          if (
            item.dtype == '1' &&
            item.value &&
            (item.value > 10 || item.value < 0)
          )
            messcode += name + ':' + '全部会员卡 '
        }
      })
      if (message || messcode || messname) {
        if (messname) {
          yid.util.error('[单卡设置:' + messname + ']不能全为空')
        }
        if (messcode) {
          yid.util.error(
            '[' + messcode + ']折扣范围应该是大于等于0，小于等于10'
          )
        }
        if (message) {
          yid.util.error('[' + message + ']折扣价没填完')
        }
        return
      }
      const params = {
        id: this.speicalDialog.servid,
        servspecs: this.speicalDialog.speicalRows,
        shopid: this.searchForm.shopid,
        shopcode: this.shopcode,
        shopname: this.shopname
      }
      service.base.servicebaseInfo.savespecials(params).then(res => {
        if (res.resp_code == '200') {
          yid.util.success(res.resp_msg)
          this.loadData()
          this.levelCancel()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },

    hideSpecialDialog() {
      this.speicalDialog.visible = false
    },
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shopid == '') {
          this.searchForm.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    },
    editPrice(row) {
      this.priceDialog.title = row.servname
      this.priceDialog.visible = true
      this.priceDialog.servid = row.id
      this.priceDialog.price = row.price
      this.priceDialog.minPrice = row.minPrice
      this.priceDialog.revision = row.revision
      this.priceDialog.shopid = this.searchForm.shopid
    },

    salePriceDialog() {
      if (Number(this.priceDialog.minPrice) > Number(this.priceDialog.price)) {
        yid.util.error('最低价不能超过基础定价')
      } else {
        const params = {}
        params.id = this.priceDialog.servid
        params.shopid = this.searchForm.shopid
        params.shopcode = this.shopcode
        params.shopname = this.shopname
        if (this.priceDialog.price === 0) {
          params.price = 0
        } else {
          params.price = this.priceDialog.price
            ? Number(this.priceDialog.price)
            : null
        }
        if (this.priceDialog.minPrice === 0) {
          params.minPrice = 0
        } else {
          params.minPrice = this.priceDialog.minPrice
            ? Number(this.priceDialog.minPrice)
            : null
        }
        service.base.servicebaseInfo.saveServPrice(params).then(res => {
          if (res.resp_code == '200') {
            yid.util.success(res.resp_msg)
            this.loadData()
            this.levelCancel()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      }
    },

    editDiscount(row) {
      this.discountDialog.servid = row.id
      this.discountDialog.title = '设置会员卡折扣价'
      this.discountDialog.visible = true
      this.discountDialog.type = row.cardtype || '0'
      this.discountDialog.revision = row.revision
      this.discountDialog.shopid = this.searchForm.shopid
      if (this.discountDialog.type == '0') {
        this.discountDialog.cards.forEach(item => {
          item.dtype = ''
          item.value = ''
        })
        this.discountDialog.card = {}
      }
      if (this.discountDialog.type == '1') {
        this.discountDialog.cards.forEach(item => {
          item.dtype = ''
          item.value = ''
          row.servcards.forEach(card => {
            if (item.cardid == card.cardid) {
              item.cardname = card.cardname
              item.dtype = card.dtype
              item.value = card.value
              item.cpcode = card.cpcode
            }
          })
        })
        this.discountDialog.card = {}
      }
      if (this.discountDialog.type == '2') {
        this.discountDialog.cards.forEach(item => {
          item.dtype = ''
          item.value = ''
        })
        if (row.servcards && row.servcards.length > 0) {
          row.servcards.forEach(card => {
            this.discountDialog.card.cardid = card.cardid
            this.discountDialog.card.cardname = card.cardname
            this.discountDialog.card.dtype = card.dtype
            this.discountDialog.card.value = card.value
            this.discountDialog.card.cpcode = card.cpcode
          })
        } else {
          this.discountDialog.card.cardid = -1
          this.discountDialog.card.cardname = '全部会员卡'
          this.discountDialog.card.dtype = ''
          this.discountDialog.card.value = ''
          this.discountDialog.card.cpcode = '-1'
        }
      }
    },

    saveDiscount() {
      let message = ''
      let messcode = ''
      let i = 0
      if (
        this.discountDialog.type == '1' &&
        this.discountDialog.cards &&
        this.discountDialog.cards.length > 0
      ) {
        this.discountDialog.cards.forEach(card => {
          if ((!card.dtype && card.value) || (card.dtype && !card.value))
            message += card.cardname + ' '
          if (
            card.dtype == '1' &&
            card.value &&
            (card.value > 10 || card.value < 0)
          )
            messcode += card.cardname + ' '
          if (card.dtype && card.value) i++
        })
      }
      if (this.discountDialog.type == '2') {
        const card = this.discountDialog.card
        if (!card || !card.dtype || !card.value) {
          message += card.cardname
        }
        if (
          card.dtype == '1' &&
          card.value &&
          (card.value > 10 || card.value < 0)
        ) {
          messcode += card.cardname
        }
      }
      if (message || messcode) {
        if (message) {
          yid.util.error('折扣价没填完')
        }
        if (messcode) {
          yid.util.error('[' + messcode + ']折扣应该是大于等于0，小于等于10')
        }
        return
      }
      if (this.discountDialog.type == '1' && i == 0) {
        yid.util.error('不能全为空')
        return
      }
      const params = {}
      params.id = this.discountDialog.servid
      params.cardtype = this.discountDialog.type
      params.revision = this.discountDialog.revision
      params.servcards = []
      params.shopid = this.discountDialog.shopid
      if (this.discountDialog.type == '1') {
        this.discountDialog.cards.forEach(card => {
          if (card.dtype && card.value) {
            params.servcards.push({
              cardid: card.cardid,
              cardname: card.cardname,
              dtype: card.dtype,
              value: card.value,
              cpcode: card.cpcode
            })
          }
        })
      }
      if (this.discountDialog.type == '2') {
        params.servcards.push({
          cardid: -1,
          cardname: '全部会员卡',
          dtype: this.discountDialog.card.dtype,
          value: this.discountDialog.card.value,
          cpcode: '-1'
        })
      }
      service.base.servicebaseInfo.saveServcards(params).then(res => {
        if (res.resp_code == '200') {
          yid.util.success(res.resp_msg)
          this.loadData()
          this.levelCancel()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },

    levelCancel() {
      this.priceDialog.visible = false
      this.discountDialog.visible = false
      this.speicalDialog.visible = false
    },
    stop(row) {
      const params = {
        id: row.id,
        status: row.status == '1' ? '2' : '1'
      }
      service.base.servicebaseInfo.updateServStatus(params).then(res => {
        if (res.resp_code == '200') {
          yid.util.success(res.resp_msg)
          this.loadData()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    loadData() {
      const fetch = service.base.servicebaseInfo.findChainList
      const params = { ...this.searchForm }
      this.$refs.table.loadData({
        fetch,
        params
      })
    }
  }
}
</script>

<style scoped></style>
