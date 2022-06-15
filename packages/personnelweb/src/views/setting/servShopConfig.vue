<template>
  <div class="dept">
    <el-collapse-transition>
      <div v-show="listShow">
        <el-form inline>
          <el-form-item label="业务类型：">
            <el-select
              clearable
              v-model="form.branch"
              placeholder="请选择业务类型"
              label-width="150px">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格体系：">
            <el-input
              clearable
              v-model="form.name"
              placeholder="价格体系名称/编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="门店：">
            <el-input
              clearable
              v-model="form.shop"
              placeholder="门店名称/编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              clearable
              v-model="form.status"
              placeholder="请选择状态"
              style="width: 120px">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="queryShopPrice()">查询</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="showImportDialog" type="primary"
              >导入体系</el-button
            >
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="addShopPrice()"
              >新增价格体系</el-button
            >
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%">
          <yid-table-column
            label="编号"
            prop="code"
            width="100"></yid-table-column>
          <yid-table-column
            label="名称"
            prop="name"
            width="180"></yid-table-column>
          <yid-table-column label="所属业务组" prop="branch" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.branch == 0">{{ '' }}</div>
              <div v-if="scope.row.branch == 1">{{ '美发' }}</div>
              <div v-if="scope.row.branch == 2">{{ '美容' }}</div>
            </template>
          </yid-table-column>
          <yid-table-column label="适用门店" prop="shopNum" width="200">
            <template slot-scope="scope">
              <label>共{{ scope.row.shopNum }}家门店</label><br />
              <el-link @click="lookupShop(scope.row)" type="primary"
                >查看修改</el-link
              >
            </template>
          </yid-table-column>
          <yid-table-column
            label="备注"
            prop="memo"
            width="180"></yid-table-column>
          <yid-table-column
            label="修改人"
            prop="updatedBy"
            width="100"></yid-table-column>
          <yid-table-column
            label="修改时间"
            prop="updatedTime"
            width="110"></yid-table-column>
          <yid-table-column label="状态" prop="sertype" width="100">
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
          <yid-table-column label="操作" prop="status" width="220">
            <template slot-scope="scope">
              <el-button type="text" @click="editShopPrice(scope.row)"
                ><i class="edit"></i>编辑</el-button
              >
              <el-button type="text" @click="setServPrice(scope.row)"
                ><i class="view"></i>设置价格</el-button
              >
              <el-button type="text" @click="setPerfratio(scope.row)"
                ><i class="view"></i>设置业绩</el-button
              >
              <el-button type="text" @click="copyPrice(scope.row)"
                ><i class="view"></i>复制</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="isShowPrice">
        <servPriceConfig ref="servPrice" @onClose="closeDetail" />
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="isShowPerfratio">
        <servPerfratioConfig ref="servPerfratio" @onClose="closeDetail" />
      </div>
    </el-collapse-transition>

    <yid-dialog
      :title="addDialog.title"
      :visible.sync="addDialog.visible"
      @close="addDialog.visible = false"
      width="680px">
      <el-form ref="addDialog" :model="addDialog" label-width="150px">
        <el-form-item
          label="编号："
          prop="code"
          :rules="[{ required: true, message: '请填写项目编号' }]">
          <el-input
            :value="addDialog.code"
            disabled
            placeholder="编号从F001开始递增，不可重复" />
        </el-form-item>
        <el-form-item
          clearable
          label="价格体系名称："
          prop="name"
          :rules="[{ required: true, message: '请填写价格体系名称' }]">
          <el-input v-model="addDialog.name" placeholder="不超过16个汉字" />
        </el-form-item>
        <el-form-item
          label="业务类型："
          :rules="[{ required: true, message: '请选择业务类型' }]">
          <el-select
            clearable
            v-model="addDialog.branch"
            placeholder="请选择业务类型"
            label-width="150px"
            :disabled="disabledbranch">
            <el-option label="美发" value="1"></el-option>
            <el-option label="美容" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用门店：" prop="shop">
          <el-button type="primary" @click="selectShop()">选择门店</el-button>
          {{
            addDialog.shoplist
              ? '共选中' + addDialog.shoplist.length + '家门店'
              : ''
          }}
        </el-form-item>
        <el-form-item label="备注：" prop="memo">
          <el-input
            id="headtext"
            type="textarea"
            v-model="addDialog.memo"
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="请输入备注"
            style="width: 400px; font-size: 12px">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="submitDisabled"
            @click="saveShopPrice()"
            >保存</el-button
          >
          <el-button @click="addDialog.visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
      @close="shopDialog.visible = false"
      width="1200px">
      <el-row type="flex" justify="space-between">
        <el-form inline>
          <el-form-item label="门店：">
            <el-input
              clearable
              v-model="shopDialog.shop"
              placeholder="门店名称/编码"
              style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select clearable v-model="shopDialog.type">
              <el-option
                :label="type.name"
                :value="type.value"
                v-for="type in types"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select
              clearable
              v-model="shopDialog.brand"
              style="width: 120px">
              <el-option
                v-for="item in brands"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select
              ref="selectRegionRef"
              @clear="clearSelectRegion"
              clearable
              v-model="shopDialog.region.name"
              style="width: 140px">
              <el-option
                hidden
                :value="shopDialog.region.id"
                style="height: auto"></el-option>
              <el-tree
                :expand-on-click-node="false"
                :check-on-click-node="true"
                show-checkbox
                check-strictly
                node-key="id"
                :data="regions"
                :props="defaultProps"
                @check-change="handleNodeClick"
                ref="templateRegionTree">
              </el-tree>
            </el-select>
          </el-form-item>
          <el-form-item label="价格体系：">
            <el-select
              clearable
              v-model="shopDialog.isptid"
              style="width: 100px">
              <el-option label="未设置" value="2"></el-option>
              <el-option label="已设置" value="1"></el-option>
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
            ref="table1"
            style="margin-top: 10px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column
              label="门店编码"
              min-width="80"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column
              label="门店品牌"
              min-width="70"
              prop="brandName"></yid-table-column>
            <yid-table-column
              label="门店区域"
              min-width="110"
              prop="regionName"></yid-table-column>
            <yid-table-column label="业务类型" min-width="70" prop="type">
              <template slot-scope="scope">
                {{ scope.row.type | formatValue(types) }}
              </template>
            </yid-table-column>
            <yid-table-column
              label="价格体系"
              min-width="100"
              prop="pricename"></yid-table-column>
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
            ref="table2"
            style="margin-top: 10px"
            :data="shopDialog.shoplist"
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
            <yid-table-column
              label="价格体系"
              min-width="120"
              prop="pricename"></yid-table-column>
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
        <el-col :span="2" :offset="10" v-if="type == '1'">
          <el-button type="primary" @click="setShop()">选好了</el-button>
        </el-col>
        <el-col :span="2" :offset="10" v-if="type == '2'">
          <el-button type="primary" @click="saveShop()">保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="cancel()">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="importCancel"
      width="700px">
      <el-form
        :model="importDialog.model"
        label-width="120px"
        ref="copyForm"
        :label-position="labelPosition">
        <p>导入服务项目价格体系方法</p>
        <p>1、从大系统项目体系表导出excle；</p>
        <p>2、将明细表导入；</p>
        <el-form-item label="体系类型：">
          <el-select
            clearable
            v-model="importDialog.type"
            style="width: 100px"
            @change="handleImportType">
            <el-option label="美发" value="1"></el-option>
            <el-option label="美容" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择导入文件:">
          <el-upload
            ref="uploadExcel"
            class="avatar-uploader"
            :headers="myheaders"
            :action="excelConvertUrl"
            :show-file-list="true"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="handleAvatarExcelSuccess"
            :before-upload="beforeAvatarExcelUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持上传 .xls
              .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveImportSer" type="primary">保存</el-button>
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import servPriceConfig from './servPriceConfig.vue'
import servPerfratioConfig from './servPerfratioConfig.vue'

/**
 * 清空
 * @param obj
 */
function isClear(obj) {
  for (var i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = []
    } else {
      obj[i] = ''
    }
  }
}

export default {
  data() {
    return {
      importDialog: {
        title: '项目体系导入',
        visible: false,
        services: [],
        type: null //
      },
      myheaders: {},
      flag: false,
      listShow: true,
      isShowPrice: false,
      isShowPerfratio: false,
      type: '',
      spname: '',
      form: {
        name: '',
        shop: '',
        status: '1'
      },
      priceData: [],
      addDialog: {
        id: '',
        title: '',
        visible: false,
        code: '',
        name: '',
        memo: '',
        shoplist: [],
        branch: ''
      },
      shopDialog: {
        id: '',
        title: '',
        visible: false,
        shop: '',
        type: '',
        branch: '',
        region: '',
        shoplist: [],
        isptid: '',
        page: 1,
        limit: 10,
        count: 0,
        status: '1'
      },
      selectShops: [],
      branchs: [],
      brands: [],
      regions: [],
      types: [
        { name: '美发', value: '1' },
        { name: '美容', value: '2' },
        { name: '综合', value: '0' }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      pageInfo: { page: 1, limit: 10 },
      excelConvertUrl: '',
      isCopy: false,
      submitDisabled: false,
      disabledbranch: false,
      selectShopData: []
    }
  },
  mounted() {
    this.init()
    this.queryShopPrice()
  },
  components: {
    servPriceConfig,
    servPerfratioConfig
  },
  filters: {
    formatValue(str, stsList) {
      let label = ''
      stsList.map(m => {
        if (m.value == str) {
          label = m.name
        }
      })
      if (label) {
        return label
      } else {
        return str
      }
    }
  },
  methods: {
    init() {
      service.chain.servShop.findbrands({ status: '1' }).then(res => {
        this.brands = res.data
      })
      service.chain.servShop.findbranchs({ status: '1' }).then(res => {
        this.branchs = res.data
      })
      service.chain.region.treeAll({ status: '1' }).then(res => {
        this.regions = res.data
      })
    },
    handleNodeClick(data, checked, node) {
      if (checked == true) {
        let id = data.id
        let valueObj = {}
        valueObj.id = id
        valueObj.name = data.name
        this.shopDialog.region = valueObj
        this.shopDialog.region.childrenIds = []
        this.getSelectAllRegion(data, this.shopDialog.region.childrenIds)
        this.$refs.templateRegionTree.setCheckedKeys([id])
      } else {
        if (this.shopDialog.region.id == data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id])
        }
      }
      this.$refs.selectRegionRef.blur()
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
    clearSelectRegion() {
      this.shopDialog.region = {}
      this.$refs.templateRegionTree.setCheckedKeys([])
    },
    handleSelectionChange(rows) {
      this.selectShops = rows
    },
    queryShopPrice() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.form)
    },
    async getData(reqParams) {
      const fetch = service.chain.servShop.findServicePricesPage
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    addShopPrice() {
      this.submitDisabled = false
      this.disabledbranch = false
      this.isCopy = false
      isClear(this.addDialog)
      service.chain.servShop.newCode().then(res => {
        if (res.resp_code == '200') {
          this.addDialog.visible = true
          this.addDialog.title = '新增价格体系'
          this.addDialog.code = 'F' + res.data
          this.addDialog.status = '1'
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    editShopPrice(row) {
      this.submitDisabled = false
      this.addDialog.visible = true
      this.addDialog.title = '编辑价格体系'
      this.addDialog.code = row.code
      this.addDialog.name = row.name
      this.addDialog.memo = row.memo
      this.addDialog.shoplist = row.shoplist || []
      this.addDialog.id = row.id
      this.spname = row.name
      if (row.branch) {
        this.addDialog.branch = row.branch + ''
      } else {
        this.addDialog.branch = ''
      }
      this.isCopy = false
      if (this.addDialog.branch == '') {
        this.disabledbranch = false
      } else {
        this.disabledbranch = true
      }
    },
    selectShop() {
      this.type = '1'
      this.flag = false
      isClear(this.shopDialog)
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      this.shopDialog.shoplist = this.addDialog.shoplist
      this.shopDialog.shoplist.forEach(each => {
        each.pricename = this.spname
      })
      this.shopDialog.id = this.addDialog.id
      this.$refs.templateRegionTree.setCheckedKeys([])
      this.queryShop()
    },
    lookupShop(row) {
      this.type = '2'
      this.flag = false
      isClear(this.shopDialog)
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      this.shopDialog.shoplist = row.shoplist || []
      this.shopDialog.id = row.id
      this.spname = row.name
      this.shopDialog.shoplist.forEach(each => {
        each.pricename = this.spname
      })
      this.$refs.templateRegionTree.setCheckedKeys([])
      this.queryShop()
    },
    queryShop() {
      if (this.shopDialog.region && this.shopDialog.region.id) {
        //大区及以内区域都保存进去
        this.shopDialog.region.childrenIds.push(this.shopDialog.region.id)
        this.shopDialog.regionIds =
          this.shopDialog.region.childrenIds.toString()
      } else {
        this.shopDialog.regionIds = ''
      }
      const fetch = service.chain.shop.shopListWithPage
      const params = {
        shop: this.shopDialog.shop,
        type: this.shopDialog.type,
        brandId: this.shopDialog.brand,
        regionIds: this.shopDialog.regionIds,
        isptid: this.shopDialog.isptid,
        page: 1,
        limit: 10,
        count: 0
      }
      this.$refs['table1'].reloadData({
        fetch,
        params
      })
    },
    addShop() {
      this.selectShops.map(m => {
        console.log(m)
        let flag = true
        this.shopDialog.shoplist.forEach(p => {
          if (p.shopid == m.id) {
            flag = false
          }
        })
        if (flag) {
          if (m.pricename) {
            this.flag = true
          }
          this.shopDialog.shoplist.push({
            shopid: m.id,
            shopcode: m.shopcode,
            shopname: m.shopname,
            pricename: m.pricename
          })
        }
      })
    },
    deleteShop(row) {
      yid.util.confirm(
        '删除门店，【' +
          this.spname +
          '】下的项目将不在【' +
          row.shopname +
          '】中显示，确定要删除吗？？',
        '',
        '',
        () => {
          let i = -1
          this.shopDialog.shoplist.forEach((p, index) => {
            if (p.shopid == row.shopid) {
              i = index
            }
          })
          this.shopDialog.shoplist.splice(i, 1)
        }
      )
    },
    saveShopPrice() {
      this.submitDisabled = true
      if (!this.addDialog.name) {
        this.submitDisabled = false
      }
      if (!this.isCopy) {
        this.$refs['addDialog'].validate(valid => {
          if (valid) {
            if (!this.addDialog.branch) {
              yid.util.warning('请选择业务组')
              this.submitDisabled = false
              return
            }
            service.chain.servShop.saveShopPrice(this.addDialog).then(res => {
              if (res.resp_code == '200') {
                this.addDialog.visible = false
                this.queryShopPrice()
                yid.util.success(res.resp_msg)
              } else {
                yid.util.error(res.resp_msg)
              }
            })
          }
        })
        if (!this.addDialog.name) {
          this.submitDisabled = false
        }
      }
      if (this.isCopy) {
        this.$refs['addDialog'].validate(valid => {
          if (valid) {
            if (!this.addDialog.branch) {
              yid.util.warning('请选择业务组')
              this.submitDisabled = false
              return
            }
            service.chain.servShop.copyShopPrice(this.addDialog).then(res => {
              if (res.resp_code == '200') {
                this.addDialog.visible = false
                this.queryShopPrice()
                yid.util.success(res.resp_msg)
              } else {
                yid.util.error(res.resp_msg)
              }
            })
          }
        })
      }
    },
    setShop() {
      if (this.flag) {
        yid.util.confirm(
          '选择的门店包括已设置项目价格体系的门店，保存后门店将会从原价格体系移至本体系中！',
          '',
          '',
          () => {
            this.addDialog.shoplist = this.shopDialog.shoplist
            this.shopDialog.visible = false
          }
        )
      } else {
        this.addDialog.shoplist = this.shopDialog.shoplist
        this.shopDialog.visible = false
      }
    },
    saveShop() {
      if (this.flag) {
        yid.util.confirm(
          '选择的门店包括已设置项目价格体系的门店，保存后门店将会从原价格体系移至本体系中！',
          '',
          '',
          () => {
            this.saveShops()
          }
        )
      } else {
        this.saveShops()
      }
    },
    saveShops() {
      service.chain.servShop.saveShop(this.shopDialog).then(res => {
        if (res.resp_code == '200') {
          this.shopDialog.visible = false
          this.queryShopPrice()
          yid.util.success(res.resp_msg)
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    stop(row) {
      if (row.shopNum > 0 && row.status == '1') {
        yid.util.error('【' + row.name + '】还存在适用门店，不可禁用')
        return
      }
      const param = {
        id: row.id,
        status: row.status == '1' ? '2' : '1'
      }
      service.chain.servShop.stopPrice(param).then(res => {
        if (res.resp_code == '200') {
          this.queryShopPrice()
          yid.util.success(res.resp_msg)
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    setServPrice(row) {
      this.listShow = false
      this.isShowPerfratio = false
      this.isShowPrice = true
      this.$refs.servPrice.clear({
        sptid: row.id,
        spcode: row.code,
        spname: row.name,
        shoplist: row.shoplist
      })
    },
    //设置业绩比率
    setPerfratio(row) {
      this.listShow = false
      this.isShowPrice = false
      this.isShowPerfratio = true
      this.$refs.servPerfratio.clear({
        sptid: row.id,
        spcode: row.code,
        spname: row.name,
        shoplist: row.shoplist,
        status: row.status
      })
    },
    closeDetail() {
      this.listShow = true
      this.isShowPrice = false
      this.isShowPerfratio = false
    },
    showImportDialog() {
      this.importDialog.visible = true
      this.importDialog.services = []
      this.importDialog.type = null
      this.myheaders['saas-version'] = 'zpw'
      this.myheaders['authorization'] =
        'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
      this.$refs.uploadExcel.clearFiles()
    },
    beforeAvatarExcelUpload(file) {
      const isJPG = file.type.indexOf('sheet') || file.type.indexOf('excel')
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        yid.util.error('上传excel只能是 xls/xlsx 格式!')
        return
      }
      if (!isLt2M) {
        yid.util.error('上传excel大小不能超过 10MB!')
        return
      }
      if (!this.importDialog.type) {
        yid.util.error('请先选择导入体系项目的类型!')
        return
      }
      return isJPG && isLt2M
    },
    handleExceed() {
      yid.util.error('只能导入一个文件，请先删除之前选择的文件')
      return
    },
    handleAvatarExcelSuccess(res) {
      this.importDialog.services = res.data
    },
    importCancel() {
      this.importDialog.visible = false
    },
    saveImportSer() {
      if (this.importDialog.services.length == 0) {
        yid.util.info('无导入数据')
      } else {
        if (this.importDialog.type == '1') {
          service.chain.servShop
            .saveSystemMf(this.importDialog.services)
            .then(res => {
              if (res.resp_code == '200') {
                this.queryShopPrice()
                this.importDialog.visible = false
              } else {
                yid.util.error(res.resp_msg)
              }
            })
        } else {
          service.chain.servShop
            .saveSystemMr(this.importDialog.services)
            .then(res => {
              if (res.resp_code == '200') {
                this.queryShopPrice()
                this.importDialog.visible = false
              } else {
                yid.util.error(res.resp_msg)
              }
            })
        }
      }
    },
    handleImportType(v) {
      this.excelConvertUrl =
        v == '1'
          ? $yid.config.API.BASE + 'api-chain/serviceinfo/convertSystemMf'
          : $yid.config.API.BASE + 'api-chain/serviceinfo/convertSystemMr'
    },
    //复制
    copyPrice(row) {
      (this.submitDisabled = false), isClear(this.addDialog)
      service.chain.servShop.newCode().then(res => {
        if (res.resp_code == '200') {
          this.addDialog.code = 'F' + res.data
          this.addDialog.status = '1'
          this.addDialog.visible = true
          this.addDialog.title = '复制并新增'
          this.addDialog.name = row.name
          this.addDialog.memo = row.memo
          this.spname = row.name
          this.addDialog.id = row.id
          if (row.branch) {
            this.addDialog.branch = row.branch + ''
          } else {
            this.addDialog.branch = ''
          }
          if (this.addDialog.branch == '') {
            this.disabledbranch = false
          } else {
            this.disabledbranch = true
          }
          this.isCopy = true
        } else {
          yid.util.error(res.resp_msg)
        }
      })
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
        this.shopDialog.shoplist.forEach((p, index) => {
          if (item.shopid == p.shopid) {
            this.shopDialog.shoplist.splice(index, 1)
          }
        })
      })
    },
    cancel() {
      this.shopDialog.visible = false
      this.queryShopPrice()
    }
  }
}
</script>

<style scoped></style>
