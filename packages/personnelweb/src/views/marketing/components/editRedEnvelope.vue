<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <el-form
      :model="settingForm"
      :rules="settingFormRules"
      label-width="150px"
      ref="settingForm"
      style="margin-top: 8px">
      <el-form-item label="门店品牌：" prop="brandId">
        <el-select
          clearable
          v-model="settingForm.brandId"
          :disabled="!isCanEdit"
          @change="changeBrand">
          <el-option
            v-for="item in brandList"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码：" prop="rcode">
        {{ settingForm.rcode }}
        <explain style="color: silver"
          >编号限定从0001开始的整数,自动叠加</explain
        >
      </el-form-item>
      <el-form-item label="红包名称：" prop="rname">
        <el-input
          :disabled="!isCanEdit"
          v-model="settingForm.rname"
          placeholder="10字以内"
          style="width: 150px" />
      </el-form-item>
      <el-form-item label="红包价值：" prop="money">
        <el-input
          :disabled="!isCanEdit"
          type="number"
          v-model="settingForm.money"
          style="width: 150px" />
      </el-form-item>
      <el-form-item label="有效期：" prop="timeType">
        <el-radio-group
          :disabled="!isCanEdit"
          v-model="settingForm.timeType"
          @change="changeTimeType">
          <el-radio :label="'1'">固定时间</el-radio>
          <el-date-picker
            v-model="settingForm.expiryDateRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            :disabled="settingForm.timeType != '1' || !isCanEdit"
            style="width: 300px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <br />
          <el-radio :label="'2'" style="margin-top: 8px">相对时间</el-radio>
          <div>
            <el-tag type="info">领取</el-tag>
            <el-input
              type="number"
              :disabled="settingForm.timeType != '2' || !isCanEdit"
              style="width: 150px; margin-left: 5px"
              v-model="settingForm.afterDay" />
            <el-tag style="margin-left: 3px" type="info">天后起用</el-tag>
            <explain style="color: silver">（0表示当天起用）</explain>
            <el-tag type="info">，有效期</el-tag>
            <el-input
              type="number"
              :disabled="settingForm.timeType != '2' || !isCanEdit"
              style="width: 150px; margin-left: 5px"
              v-model="settingForm.expiryDay"
              placeholder=">0的数" />
            <el-tag type="info">天</el-tag>
          </div>
          <br />
          <el-radio :label="'0'" style="margin-top: 11px">不限期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="红包类型：" prop="isOnline">
        <el-radio-group
          :disabled="!isCanEdit || originData != null"
          v-model="settingForm.isOnline">
          <el-row>
            <el-radio :label="'1'">线上</el-radio>
          </el-row>
          <el-radio :label="'0'" style="margin-top: 8px">线下</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="使用门店"
        prop="useshopType"
        v-if="settingForm.isOnline == 1">
        <el-radio-group v-model="settingForm.useshopType">
          <el-radio label="1">所有活动门店</el-radio>
          <el-radio label="2">可用门店</el-radio>
        </el-radio-group>
        <!-- <span style="margin-left: 30px;color:grey;font-size: 12px;" v-if="mktactivForm.matype=='2'">注：赠送红包的使用门店设置，赠送项目/产品默认仅赠送门店使用</span> -->
      </el-form-item>
      <el-form-item
        label="活动门店"
        prop="shop"
        v-if="settingForm.useshopType == 2 && settingForm.isOnline == 1">
        <el-button type="primary" @click="selectShop()">选择门店</el-button>
        {{
          settingForm.shoplist
            ? '共选中' + settingForm.shoplist.length + '家门店'
            : ''
        }}
      </el-form-item>

      <el-form-item label="使用场景及规则：">
        <el-tag>线下门店使用</el-tag>
        <el-row>
          <el-checkbox
            label="可分多次使用"
            v-model="settingForm.isSelectManyTimes"
            :disabled="!isCanEdit"></el-checkbox>
        </el-row>
        <el-row>
          <el-checkbox
            label="消费金额满"
            v-model="settingForm.isSelectConConMoney"
            :disabled="!isCanEdit"></el-checkbox>
          <el-input
            type="number"
            v-model="settingForm.minMoney"
            style="width: 150px; margin-left: 8px"
            :disabled="!isCanEdit" />
          <el-tag type="info" style="margin-left: 8px">元可使用</el-tag>
        </el-row>
        <el-row>
          <el-checkbox
            label="消费项目可用"
            v-model="settingForm.isSelectProject"
            :disabled="!isCanEdit"
            @change="clearProjectData(proAddDialog)"></el-checkbox>
          <explain style="color: silver" v-if="settingForm.isSelectProject"
            >说明：如果不选择则默认全部项目</explain
          >
        </el-row>
        <el-row v-if="settingForm.isSelectProject">
          <el-select
            placeholder="请选择"
            style="width: 100px"
            v-model.trim="settingForm.type"
            @change="selectType($event, settingForm.type)">
            <el-option
              :key="item.value"
              :label="item.name"
              :value="item.value"
              v-for="item in classifi"></el-option> </el-select
          >&nbsp;<el-button
            type="primary"
            @click="showProjectDialog(settingForm.type)"
            :disabled="!isCanEdit"
            >添加
          </el-button>
        </el-row>
        <div
          style="
            height: 220px;
            width: 100%;
            margin-top: 6px;
            background-color: azure;
          "
          v-if="
            settingForm.isSelectProject &&
            proAddDialog.selectProjectList.length > 0
          ">
          <el-scrollbar style="height: 100%; width: 100%">
            <ul
              style="
                width: 100%;
                list-style: none;
                text-align: left;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
              ">
              <li
                v-for="(item, index) in proAddDialog.selectProjectList"
                style="width: 25%">
                <el-row
                  ><i
                    class="el-icon-circle-close"
                    style="margin-right: 6px"
                    @click="deleteProject(index)"></i>
                  {{ item.sdname }}
                </el-row>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <el-row>
          <el-checkbox
            label="购买产品可用"
            v-model="settingForm.isSelectGood"
            :disabled="!isCanEdit"
            @change="clearGoodData(goodAddDialog)"></el-checkbox>
          <explain style="color: silver" v-if="settingForm.isSelectGood"
            >说明：如果不选择则默认全部产品</explain
          >
        </el-row>
        <el-row v-if="settingForm.isSelectGood">
          <el-button
            type="primary"
            @click="showGoodDialog()"
            :disabled="!isCanEdit"
            >选择产品</el-button
          >
        </el-row>
        <div
          style="
            height: 200px;
            width: 100%;
            margin-top: 6px;
            background-color: azure;
          "
          v-if="
            settingForm.isSelectGood && goodAddDialog.selectProducts.length > 0
          ">
          <el-scrollbar style="height: 100%; width: 100%">
            <ul
              style="
                width: 100%;
                list-style: none;
                text-align: left;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
              ">
              <li
                v-for="(item, index) in goodAddDialog.selectProducts"
                style="width: 25%">
                <el-row
                  ><i
                    class="el-icon-circle-close"
                    style="margin-right: 6px"
                    @click="deleteGood(index)"></i>
                  {{ item.sdname }}
                </el-row>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!--<el-row ><el-checkbox label="购买套餐可用" v-model="settingForm.isSelectCombo" :disabled="!isCanEdit"></el-checkbox><explain style="color:silver" v-if="settingForm.isSelectCombo">说明：如果不选择则默认全部套餐</explain></el-row>-->
        <!--<el-row v-if="settingForm.isSelectCombo">-->
        <!--<el-button type="primary" @click="showComboDialog()" :disabled="!isCanEdit">选择套餐</el-button>-->
        <!--</el-row>-->
        <!--<div style="height:150px;width: 300px;margin-top: 6px;background-color: azure" v-if="settingForm.isSelectCombo && comboAddDialog.selectComboList.length > 0">-->
        <!--<el-scrollbar style="height:100%;width: 100%">-->
        <!--<ul style="list-style: none;text-align:left">-->
        <!--<li v-for="(item, index) in comboAddDialog.selectComboList">-->
        <!--<el-row> <i class="el-icon-circle-close"  style="margin-right: 6px" @click="deleteCombo(index)" ></i> {{item.spname}}</el-row>-->
        <!--</li>-->
        <!--</ul>-->
        <!--</el-scrollbar>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item label="其他描述：" prop="memo">
        <!-- <el-input  :disabled="!isCanEdit" v-model="settingForm.memo" placeholder="10字以内" style="width: 150px"/> -->
        <template>
          <vue-editor
            v-model="settingForm.memo"
            useCustomImageHandler
            @image-added="handleImageAdded" />
        </template>
        <el-link type="primary" @click="clearMemo()">清空描述</el-link>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('1')" :disabled="!isCanEdit"
          >保存并发布</el-button
        >
        <el-button
          type="primary"
          @click="save('0')"
          style="margin-left: 18px"
          :disabled="!isCanEdit"
          >仅保存</el-button
        >
        <el-button @click="goBack('0')" style="margin-left: 18px"
          >取消</el-button
        >
      </el-form-item>
    </el-form>

    <yid-dialog
      :title="proAddDialog.title"
      :visible.sync="proAddDialog.visible"
      width="700px">
      <el-form label-width="90px" ref="copyForm2">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="proAddDialog.branch"
            @change="changeBranch(proAddDialog.branch, '1')"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in proAddDialog.branchList"
              :key="item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="proAddDialog.serviceType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in proAddDialog.serviceTypes"
              :key="item.id"
              :label="item.sname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%" class="serve-table">
              <tr>
                <th width="20%">所属部门</th>
                <th width="25%">分类</th>
                <th width="55%">
                  <el-checkbox
                    v-model="proAddDialog.checkbox"
                    @change="checkAllProject"></el-checkbox>
                  (编号）项目名称
                </th>
              </tr>
              <tr
                :key="item.servid"
                v-for="item in proAddDialog.serviceList"
                v-if="screenService(item)">
                <td>{{ item.bname }}</td>
                <td>{{ item.typename }}</td>
                <td>
                  <el-checkbox
                    v-model="item.isSelect"
                    :label="item.servid"></el-checkbox>
                  ({{ item.sdcode }}){{ item.sdname }}
                </td>
              </tr>
            </table>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addProject(1)">确认添加</el-button>
          <el-button type="primary" @click="closeProjectDialog()"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="goodAddDialog.title"
      :visible.sync="goodAddDialog.visible"
      width="700px">
      <el-form label-width="90px">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="goodAddDialog.branch"
            @change="changeBranch(goodAddDialog.branch, '2')"
            placeholder="所属部门"
            style="width: 140px">
            <el-option
              v-for="item in goodAddDialog.branchList"
              :key="item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="goodAddDialog.productType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in goodAddDialog.productTypes"
              :key="item.id"
              :label="item.cname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%" class="serve-table">
              <tr>
                <th width="20%">所属部门</th>
                <th width="25%">分类</th>
                <th width="55%">
                  <el-checkbox
                    @change="checkAllGood"
                    v-model="goodAddDialog.checkbox"></el-checkbox>
                  (编号）产品名称 规格
                </th>
              </tr>
              <tr
                :key="item.pid"
                v-for="item in goodAddDialog.products"
                v-if="screenProduct(item)">
                <td>{{ item.bname }}</td>
                <td>{{ item.typename }}</td>
                <td>
                  <el-checkbox
                    v-model="item.isSelect"
                    :value="item.pid"></el-checkbox>
                  ({{ item.sdcode }}) {{ item.sdname }} {{ item.norms }}
                </td>
              </tr>
            </table>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addGood()">确认添加</el-button>
          <el-button type="primary" @click="closeGoodDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="proAddDialog2.title"
      :visible.sync="proAddDialog2.visible"
      width="700px">
      <el-form label-width="90px" ref="copyForm2">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="proAddDialog2.branch"
            @change="changeBranch(proAddDialog2.branch, '3')"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in proAddDialog2.branchList"
              :key="item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%" class="serve-table">
              <tr>
                <th width="20%">所属部门</th>
                <th width="25%">
                  <el-checkbox
                    v-model="proAddDialog2.checkbox"
                    @change="checkAllProject2"></el-checkbox>
                  分类
                </th>
              </tr>
              <tr :key="item.id" v-for="item in proAddDialog2.serviceTypes">
                <td>{{ item.branchName }}</td>
                <td>
                  <el-checkbox
                    @change="selectOk($event, item)"
                    v-model="item.isSelect"
                    :value="item.id"></el-checkbox>
                  ({{ item.scode }}){{ item.sname }}
                </td>
              </tr>
            </table>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addProject(2)">确认添加</el-button>
          <el-button type="primary" @click="closeProjectDialog()"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="comboAddDialog.title"
      :visible.sync="comboAddDialog.visible"
      width="700px">
      <el-form label-width="120px">
        <el-form-item label="套餐：">
          <el-input
            placeholder="套餐名称/编码"
            style="width: 200px"
            v-model="comboAddDialog.pcodename"></el-input>
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="25%">所属品牌</th>
              <th width="55%">
                <el-checkbox
                  @change="checkAllCombo"
                  v-model="comboAddDialog.checkbox"></el-checkbox>
                (编号）套餐名称
              </th>
            </tr>
            <tr
              :key="item.id"
              v-for="item in comboAddDialog.comboList"
              v-if="screenCombo(item)">
              <td>{{ item.brandname }}</td>
              <td>
                <el-checkbox
                  v-model="item.isSelect"
                  :value="item.id"></el-checkbox>
                {{ item.spname }}
              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addCombo()">确认添加</el-button>
          <el-button type="primary" @click="closeComboDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <!-- 选择门店弹窗 -->
    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
      @close="shopDialog.visible = false"
      width="1100px">
      <el-row type="flex" justify="space-between">
        <el-form inline>
          <el-form-item label="门店：">
            <el-input
              clearable
              v-model="shopDialog.shop"
              placeholder="门店名称/编码"
              style="width: 160px"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select clearable v-model="shopDialog.type">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
              <el-option label="综合" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select
              ref="selectRegionRef"
              @clear="clearSelectRegion"
              clearable
              v-model="shopDialog.region.name"
              style="width: 200px">
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
            :data="shopData"
            @selection-change="handleSelectionChangeShop">
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
                {{ scope.row.type | formatValue(types) }}
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop" type="primary" size="mini"
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
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="deleteShop(scope.row, shopDialog.name)">
                  删除
                </el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col :span="2" :offset="10" v-if="type == '1'">
          <el-button type="primary" @click="setShops()">选好了</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible = false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'editRedEnvelope',
  components: { VueEditor },
  data() {
    return {
      isCanEdit: false,
      isNewAdd: true,
      originData: null,
      settingForm: {
        rcode: '',
        brandId: '',
        brandCode: '',
        brandName: '',
        rname: '',
        money: '',
        timeType: '',
        expiryDateRange: [],
        afterDay: '',
        expiryDay: '',
        conConmoney: '',
        minMoney: null,
        isSelectProject: false,
        isSelectGood: false,
        isSelectCombo: false,
        isSelectManyTimes: false,
        isSelectConConMoney: false,
        isOnline: '0',
        useshopType: '2',
        shoplist: [],
        memo: '',
        type: '1'
      },
      settingFormRules: {
        brandId: [{ required: true, message: '请选择门店品牌' }],
        rname: [
          { required: true, message: '请填写红包名称' },
          { min: 0, max: 10, message: '红包名称在10个字符以内' }
        ],
        money: [{ required: true, message: '请输入红包价值' }],
        timeType: [{ required: true, message: '请选择红包有效期类型' }]
      },
      proAddDialog: {
        title: '选择项目',
        visible: false,
        branch: '',
        serviceTypes: [],
        serviceType: '',
        checkbox: false,
        branchList: [],
        serviceList: [],
        selectProjectList: []
      },
      proAddDialog2: {
        title: '选择分类',
        visible: false,
        branch: '',
        serviceTypes: [],
        serviceType: '',
        checkbox: false,
        branchList: [],
        serviceList: [],
        selectProjectList: []
      },
      goodAddDialog: {
        title: '选择产品',
        visible: false,
        branchList: [],
        branch: '',
        productTypes: [],
        productType: '',
        products: [],
        checkbox: false,
        index: -1,
        selectProducts: []
      },
      comboAddDialog: {
        title: '选择套餐',
        visible: false,
        checkbox: false,
        pcodename: '',
        comboList: [],
        selectComboList: []
      },
      branchList: [],
      brandList: [],
      serviceAllType: [],
      serviceList: [],
      //718新增
      shopDialog: {
        title: '',
        visible: false,
        id: '',
        name: '',
        shop: '',
        type: '',
        brandId: '',
        region: '',
        shoplist: [],
        page: 1,
        limit: 10
      },
      shopData: [],
      selectShops: [],
      regions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      classifi: [
        { name: '按项目', value: '1' },
        { name: '按分类', value: '2' }
      ],
      selectShopData: []
    }
  },
  computed: {
    screenService() {
      return function (item) {
        let flag = true
        if (this.proAddDialog.branch) {
          if (this.proAddDialog.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.proAddDialog.serviceType) {
          if (this.proAddDialog.serviceType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (!flag) {
          item.isSelect = false
        }
        return flag
      }
    },
    screenProduct() {
      return function (item) {
        let flag = true
        if (this.goodAddDialog.branch) {
          if (this.goodAddDialog.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.goodAddDialog.productType) {
          if (this.goodAddDialog.productType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (!flag) {
          item.isSelect = false
        }
        return flag
      }
    },
    screenCombo() {
      return function (item) {
        let flag = true
        if (!this.comboAddDialog.pcodename) {
          return flag
        }
        if (
          this.comboAddDialog.pcodename == item.spcode ||
          item.spname.indexOf(this.comboAddDialog.pcodename) != -1
        ) {
          flag = true
        } else {
          flag = false
        }
        if (!flag) {
          item.isSelect = false
        }
        return flag
      }
    }
  },
  methods: {
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()
      formData.append('file', file) //第一个file 后台接收的参数名
      service.chain.coupon
        .upImage(formData)
        .then(result => {
          console.log('result', result)
          let url = result.data.url // 返回给你的图片路径
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        })
        .catch(err => {
          console.log(err)
        })
    },
    clearMemo() {
      this.settingForm.memo = ''
    },
    async initData(data) {
      this.restSetting()
      await this.init()
      if (data == null) {
        this.isNewAdd = true
        this.isCanEdit = true
      } else {
        let that = this
        this.isNewAdd = false
        this.isCanEdit =
          data.status == '0' || data.status == '1' || data.status == '2' //只有未发布的可以编辑
        this.originData = Object.assign(data)
        await this.getComboList({ brand: data.brandId })

        //填充数据
        this.settingForm.brandId = data.brandId + ''
        this.settingForm.brandName = data.brandName
        this.settingForm.brandCode = data.brandCode
        this.settingForm.rname = data.rname
        this.settingForm.rcode = data.rcode
        this.settingForm.money = data.money
        this.settingForm.timeType = data.timeType
        this.settingForm.isOnline = data.isOnline
        this.settingForm.useshopType = data.useshopType
        this.settingForm.shoplist = data.shoplist
        this.settingForm.memo = data.memo
        if (this.settingForm.timeType == '1') {
          this.settingForm.expiryDateRange.push(data.sdate)
          this.settingForm.expiryDateRange.push(data.edate)
        } else if (this.settingForm.timeType == '2') {
          this.settingForm.afterDay = data.afterDay
          this.settingForm.expiryDay = data.expiryDay
        }
        this.settingForm.isSelectManyTimes = data.ismanytimes == '1'
        this.settingForm.isSelectConConMoney = data.conConmoney == '1'
        if (this.settingForm.isSelectConConMoney) {
          this.settingForm.minMoney = data.minMoney
        }

        this.settingForm.isSelectProject = data.conIsserv != '1'
        if (data.conIsserv == '3') {
          data.serList.forEach(item => {
            that.proAddDialog.selectProjectList.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              servid: item.servid,
              serType: item.serType
            })
          })
        }
        if (that.proAddDialog.selectProjectList.length > 0) {
          that.proAddDialog.selectProjectList.forEach(e => {
            this.settingForm.type = e.serType.toString()
          })
        }
        this.settingForm.isSelectGood = data.conIsproduct != '1'
        if (data.conIsproduct == '3') {
          data.proList.forEach(item => {
            this.goodAddDialog.selectProducts.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              pid: item.pid
            })
          })
        }
        this.settingForm.isSelectCombo = data.conIspackage != '1'
        if (data.conIspackage == '3') {
          data.packageList.forEach(item => {
            that.comboAddDialog.selectComboList.push({
              id: item.id,
              spcode: item.spcode,
              spname: item.spname
            })
          })
        }
      }
    },

    //选择门店
    selectShop() {
      // if(!this.mktactivForm.brandId){
      //     yid.util.error("请选择品牌，再选择门店");
      //     return
      // }
      // if(!this.mktactivForm.name){
      //     yid.util.error("请输入活动名称，再选择门店");
      //     return
      // }

      this.type = '1'
      // isClear(this.shopDialog)
      this.shopData = []
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      this.shopDialog.id = this.settingForm.id
      this.shopDialog.name = this.settingForm.name
      this.shopDialog.shoplist = this.settingForm.shoplist
      this.shopDialog.brand = this.settingForm.brandId
    },
    //查询门店
    queryShop() {
      if (this.shopDialog.region && this.shopDialog.region.id) {
        //大区及以内区域都保存进去
        this.shopDialog.region.childrenIds.push(this.shopDialog.region.id)
        this.shopDialog.regionIds =
          this.shopDialog.region.childrenIds.toString()
      } else {
        this.shopDialog.regionIds = ''
      }
      const fetch = service.chain.servShop.queryShop

      const params = {
        page: this.shopDialog.page,
        limit: this.shopDialog.limit,
        shop: this.shopDialog.shop,
        type: this.shopDialog.type,
        regionIds: this.shopDialog.regionIds,
        //region:this.shopDialog.region,
        brandId: this.shopDialog.brand,
        status: '1'
      }
      this.$refs['tableShop'].reloadData({
        fetch,
        params
      })
    },
    // 添加门店
    addShop() {
      if (this.selectShops.length == 0) {
        yid.util.error('请先选择门店')
        return
      }

      this.selectShops.map(m => {
        let flag = true
        if (this.shopDialog.shoplist && this.shopDialog.shoplist.length >= 1) {
          this.shopDialog.shoplist.forEach(p => {
            if (p.id == m.id || p.shopid == m.id) {
              flag = false
            }
          })
          if (flag) {
            this.shopDialog.shoplist.push({
              shopid: m.id,
              shopcode: m.shopcode,
              shopname: m.shopname
            })
          }
        } else {
          this.shopDialog.shoplist.push({
            shopid: m.id,
            shopcode: m.shopcode,
            shopname: m.shopname
          })
        }
      })
    },
    handleSelectionChangeShop(rows) {
      this.selectShops = rows
    },
    //删除门店
    deleteShop(row, name) {
      yid.util.confirm(
        '删除【' + row.shopname + '】后，在本店将不能使用，确定要删除吗？',
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
    //选好了
    setShops() {
      this.settingForm.shoplist = this.shopDialog.shoplist
      this.shopDialog.visible = false
    },
    restSetting() {
      this.proAddDialog = {
        title: '选择项目',
        visible: false,
        branch: '',
        serviceTypes: [],
        serviceType: '',
        checkbox: false,
        branchList: [],
        serviceList: [],
        selectProjectList: []
      }
      this.goodAddDialog = {
        title: '选择产品',
        visible: false,
        branchList: [],
        branch: '',
        productTypes: [],
        productType: '',
        products: [],
        checkbox: false,
        index: -1,
        selectProducts: []
      }
      this.comboAddDialog = {
        title: '选择套餐',
        visible: false,
        checkbox: false,
        pcodename: '',
        comboList: [],
        selectComboList: []
      }

      this.settingForm = {
        rcode: '',
        brandId: '',
        brandCode: '',
        brandName: '',
        rname: '',
        money: '',
        timeType: '',
        expiryDateRange: [],
        afterDay: '',
        expiryDay: '',
        conConmoney: '',
        minMoney: null,
        isSelectProject: false,
        isSelectGood: false,
        isSelectCombo: false,
        isSelectManyTimes: false,
        isSelectConConMoney: false,
        isOnline: '0',
        useshopType: '2',
        shoplist: [],
        memo: ''
      }
      if (this.$refs['settingForm'] != null) {
        this.$refs['settingForm'].resetFields()
      }
    },
    async init() {
      await this.getBrandList()
      await this.getBranchList()
      await this.getServiceTypeList()
      await this.getServiceList()
      await this.getGoodList()
      await this.getGoodTypeList()
      /* service.chain.servShop.findregions({status:'1',parentId:'-1'}).then(res => {
          this.regions = res.data
      });*/

      service.chain.region.treeAll({ status: '1' }).then(res => {
        this.regions = res.data
      })
    },
    changeTimeType() {
      this.settingForm.expiryDateRange = []
      this.settingForm.afterDay = ''
      this.settingForm.expiryDay = ''
    },
    async changeBrand(id) {
      if (id) {
        await this.getComboList({ brand: id })
      }
      this.brandList.forEach(item => {
        if (id == item.id) {
          this.settingForm.brandCode = item.code
          this.settingForm.brandName = item.name
        }
      })
    },
    showProjectDialog(tag) {
      if (tag == '1') {
        this.proAddDialog.branch = ''
        this.proAddDialog.serviceType = ''
        this.proAddDialog.serviceTypes = []
        this.proAddDialog.checkbox = false
        this.proAddDialog.visible = true
        this.proAddDialog.serviceList.forEach(item => {
          item.isSelect = false
          this.proAddDialog.selectProjectList.forEach(serv => {
            if (serv.servid == item.servid) {
              item.isSelect = true
            }
          })
        })
      } else {
        if (this.proAddDialog.selectProjectList.length > 0) {
          this.proAddDialog.selectProjectList.forEach(item => {
            if (item.serType == 2) {
              this.proAddDialog2.selectProjectList =
                this.proAddDialog.selectProjectList
            }
          })
        }
        this.proAddDialog2.branch = ''
        this.proAddDialog2.serviceType = ''
        this.proAddDialog2.checkbox = false
        this.proAddDialog2.visible = true
        this.proAddDialog2.serviceTypes.forEach(item => {
          item.isSelect = false
          this.proAddDialog2.selectProjectList.forEach(serv => {
            if (serv.servid == item.id) {
              item.isSelect = true
            }
          })
        })
      }
    },
    selectType(e, val) {
      this.$forceUpdate()
    },
    selectOk(e, val) {
      if (val.isSelect) {
        val.isSelect = true
      } else {
        val.isSelect = false
      }
      this.$forceUpdate()
    },
    closeProjectDialog() {
      this.proAddDialog.visible = false
      this.proAddDialog2.visible = false
    },
    addProject(tag) {
      if (tag == 1) {
        const that = this
        let list = []
        if (that.proAddDialog.selectProjectList.length > 0) {
          that.proAddDialog.selectProjectList.forEach(item => {
            if (item.serType == 2) {
              that.proAddDialog.selectProjectList = list
            }
          })
        }
        this.proAddDialog.serviceList.forEach(item => {
          if (
            item.isSelect &&
            (that.proAddDialog.selectProjectList.length == 0 ||
              that.proAddDialog.selectProjectList.findIndex(
                list => item.servid == list.servid
              ) == -1)
          ) {
            that.proAddDialog.selectProjectList.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              servid: item.servid,
              serType: tag
            })
          }
        })
        this.closeProjectDialog()
      } else {
        if (this.proAddDialog.selectProjectList.length > 0) {
          this.proAddDialog.selectProjectList.forEach(item => {
            if (item.serType == 1) {
              this.proAddDialog.selectProjectList = []
            }
          })
        }
        this.proAddDialog2.serviceTypes.forEach(item => {
          if (
            item.isSelect &&
            (this.proAddDialog2.selectProjectList.length == 0 ||
              this.proAddDialog2.selectProjectList.findIndex(
                list => item.id == list.servid
              ) == -1)
          ) {
            this.proAddDialog2.selectProjectList.push({
              sdcode: item.scode,
              sdname: item.sname,
              servid: item.id,
              serType: tag
            })
          }
        })
        this.proAddDialog.selectProjectList =
          this.proAddDialog2.selectProjectList
        this.proAddDialog2.visible = false
      }
    },
    checkAllProject2(val) {
      this.proAddDialog2.serviceTypes.forEach(item => {
        if (!this.proAddDialog2.branch) {
          item.isSelect = val
        } else if (this.proAddDialog2.branch == item.branch.toString()) {
          item.isSelect = val
        }
      })
    },
    deleteProject(index) {
      if (!this.isCanEdit) {
        return
      }
      this.proAddDialog.selectProjectList.splice(index, 1)
    },
    checkAllProject(val) {
      this.proAddDialog.serviceList.forEach(item => {
        if (!this.proAddDialog.branch) {
          item.isSelect = val
        } else if (this.proAddDialog.branch == item.branch) {
          item.isSelect = val
        }
      })
    },
    changeBranch(id, type) {
      if (type == '1') {
        this.proAddDialog.serviceType = ''
        this.proAddDialog.serviceTypes = []
        this.serviceAllType.forEach(item => {
          if (id == item.branch) {
            this.proAddDialog.serviceTypes.push(item)
          }
        })
      }
      if (type == '2') {
        this.goodAddDialog.productType = ''
        this.goodAddDialog.productTypes = []
        this.productAllType.forEach(item => {
          if (id == String(item.bbid)) {
            this.goodAddDialog.productTypes.push(item)
          }
        })
      }
      if (type == '3') {
        this.proAddDialog2.serviceType = ''
        this.proAddDialog2.serviceTypes = []
        this.serviceAllType.forEach(item => {
          if (id == item.branch.toString()) {
            this.proAddDialog2.serviceTypes.push(item)
          }
        })
      }
    },
    showGoodDialog() {
      this.goodAddDialog.branch = ''
      this.goodAddDialog.productType = ''
      this.goodAddDialog.productTypes = []
      this.goodAddDialog.checkbox = false
      this.goodAddDialog.products.forEach(item => {
        item.isSelect = false
        this.goodAddDialog.selectProducts.forEach(serv => {
          if (serv.pid == item.pid) {
            item.isSelect = true
          }
        })
      })
      this.goodAddDialog.visible = true
    },
    closeGoodDialog() {
      this.goodAddDialog.visible = false
    },
    addGood() {
      const that = this
      //that.goodAddDialog.selectProducts = []
      this.goodAddDialog.products.forEach(item => {
        if (
          item.isSelect &&
          (that.goodAddDialog.selectProducts.length == 0 ||
            that.goodAddDialog.selectProducts.findIndex(
              list => item.pid == list.pid
            ) == -1)
        ) {
          that.goodAddDialog.selectProducts.push({
            sdcode: item.sdcode,
            sdname: item.sdname,
            pid: item.pid
          })
        }
      })
      this.closeGoodDialog()
    },
    deleteGood(index) {
      if (!this.isCanEdit) {
        return
      }
      this.goodAddDialog.selectProducts.splice(index, 1)
    },
    checkAllGood(val) {
      this.goodAddDialog.products.forEach(item => {
        if (!this.goodAddDialog.branch) {
          item.isSelect = val
        } else if (this.goodAddDialog.branch == item.branch) {
          item.isSelect = val
        }
      })
    },
    showComboDialog() {
      if (!this.settingForm.brandId) {
        $yid.util.warning('请选择品牌')
        return
      }
      this.comboAddDialog.pcodename = ''
      this.comboAddDialog.checkbox = false
      this.comboAddDialog.comboList.forEach(item => {
        item.isSelect = false
        this.comboAddDialog.selectComboList.forEach(sitem => {
          if (sitem.id == item.id) {
            item.isSelect = true
          }
        })
      })
      this.comboAddDialog.visible = true
    },
    closeComboDialog() {
      this.comboAddDialog.visible = false
    },
    checkAllCombo(val) {
      this.comboAddDialog.comboList.forEach(item => {
        if (!this.comboAddDialog.pcodename) {
          item.isSelect = val
        } else if (
          this.comboAddDialog.pcodename == item.spcode ||
          item.spname.indexOf(this.comboAddDialog.pcodename) != -1
        ) {
          item.isSelect = val
        }
      })
    },
    addCombo() {
      const that = this
      //that.comboAddDialog.selectComboList = []
      this.comboAddDialog.comboList.forEach(item => {
        if (
          item.isSelect &&
          (that.comboAddDialog.selectComboList.length == 0 ||
            that.comboAddDialog.selectComboList.findIndex(
              list => item.id == list.id
            ) == -1)
        ) {
          that.comboAddDialog.selectComboList.push({
            id: item.id,
            spcode: item.spcode,
            spname: item.spname
          })
        }
      })
      this.closeComboDialog()
    },
    deleteCombo(index) {
      if (!this.isCanEdit) {
        return
      }
      this.comboAddDialog.selectComboList.splice(index, 1)
    },
    save(status) {
      if (status == '1') {
        yid.util.confirm('保存发布后，红包将不能再次编辑！', '', '', () => {
          this.toSave(status)
        })
      } else {
        this.toSave(status)
      }
    },
    toSave(status) {
      this.$refs['settingForm'].validate(valid => {
        if (!valid) {
          return
        }
        if (
          !this.settingForm.isSelectProject &&
          !this.settingForm.isSelectGood &&
          !this.settingForm.isSelectCombo
        ) {
          $yid.util.warning('至少勾选项目、卖品、套餐中的一种！')
          return
        }
        let reqParam = {}
        if (!this.isNewAdd) {
          reqParam.id = this.originData.id
        }
        reqParam.status = status
        reqParam.rcode = this.settingForm.rcode
        reqParam.brandId = this.settingForm.brandId
        reqParam.brandCode = this.settingForm.brandCode
        reqParam.brandName = this.settingForm.brandName
        reqParam.rname = this.settingForm.rname
        reqParam.money = this.settingForm.money
        reqParam.isOnline = this.settingForm.isOnline
        reqParam.useshopType = this.settingForm.useshopType
        reqParam.shoplist = this.settingForm.shoplist
        reqParam.memo = this.settingForm.memo
        if (parseInt(this.settingForm.money) <= 0) {
          $yid.util.warning('红包价值要大于0')
          return
        }
        reqParam.timeType = this.settingForm.timeType
        if (reqParam.timeType == '1') {
          if (
            !this.settingForm.expiryDateRange ||
            this.settingForm.expiryDateRange.length < 2
          ) {
            $yid.util.warning('请选择固定时间范围')
            return
          }
          reqParam.sdate = this.settingForm.expiryDateRange[0]
          reqParam.edate = this.settingForm.expiryDateRange[1]
        } else if (reqParam.timeType == '2') {
          reqParam.afterDay = this.settingForm.afterDay
            ? this.settingForm.afterDay
            : 0
          if (parseInt(reqParam.afterDay) < 0) {
            $yid.util.warning('领取天数不能为负数')
            return
          }

          if (
            !this.settingForm.expiryDay ||
            parseInt(this.settingForm.expiryDay) <= 0
          ) {
            $yid.util.warning('领取有效期要大于0')
            return
          }
          reqParam.expiryDay = this.settingForm.expiryDay
        }
        reqParam.ismanytimes = this.settingForm.isSelectManyTimes ? '1' : '2'
        reqParam.conConmoney = this.settingForm.isSelectConConMoney ? '1' : '2'
        if (this.settingForm.isSelectConConMoney) {
          if (
            !this.settingForm.minMoney ||
            parseInt(this.settingForm.minMoney) <= 0
          ) {
            $yid.util.warning('请输入满减金额')
            return
          }
          reqParam.minMoney = this.settingForm.minMoney
        }

        reqParam.conIsserv = this.settingForm.isSelectProject ? '2' : '1'
        if (this.settingForm.isSelectProject) {
          if (this.proAddDialog.selectProjectList.length > 0) {
            reqParam.conIsserv = '3'
            reqParam.serList = this.proAddDialog.selectProjectList
          }
        }

        reqParam.conIsproduct = this.settingForm.isSelectGood ? '2' : '1'
        if (this.settingForm.isSelectGood) {
          if (this.goodAddDialog.selectProducts.length > 0) {
            reqParam.conIsproduct = '3'
            reqParam.proList = this.goodAddDialog.selectProducts
          }
        }

        reqParam.conIspackage = this.settingForm.isSelectCombo ? '2' : '1'
        if (this.settingForm.isSelectCombo) {
          if (this.comboAddDialog.selectComboList.length > 0) {
            reqParam.conIspackage = '3'
            reqParam.packageList = this.comboAddDialog.selectComboList
          }
        }
        service.chain.redEnvelopeInfo.add(reqParam).then(res => {
          if (res.resp_code == 200) {
            this.goBack()
          } else {
            yid.util.error('保存失败')
          }
        })
      })
    },
    goBack(data) {
      this.$emit('onClose', data)
    },
    async getBranchList() {
      await service.serviceInfo.findbranch({ status: '1' }).then(res => {
        this.branchList = res.data
        this.proAddDialog.branchList = res.data
        this.proAddDialog2.branchList = res.data
        this.goodAddDialog.branchList = res.data
      })
    },
    async getBrandList() {
      await service.chain.brand.brandList({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.brandList = res.data
        }
      })
    },
    async getServiceTypeList() {
      await service.serviceInfo.findServiceType({ status: '1' }).then(res => {
        this.serviceAllType = res.data
        this.serviceAllType.forEach(item => {
          if (item.branch == 1) {
            item.branchName = '美发组'
            this.proAddDialog2.serviceTypes.push(item)
          }
          if (item.branch == 2) {
            item.branchName = '美容组'
            this.proAddDialog2.serviceTypes.push(item)
          }
          if (item.branch == 3) {
            item.branchName = '综合组'
            this.proAddDialog2.serviceTypes.push(item)
          }
        })
      })
    },
    async getGoodTypeList() {
      await service.serviceInfo.findProductType({ status: '1' }).then(res => {
        this.productAllType = res.data
      })
    },
    async getServiceList() {
      await service.chain.servicepackage.servinfo({ status: '1' }).then(res => {
        if (res && res.data.length > 0) {
          res.data.forEach(item => {
            this.proAddDialog.serviceList.push({ ...item, isSelect: false })
          })
        } else {
          this.serviceList = []
          this.proAddDialog.serviceList = []
        }
      })
    },
    async getGoodList() {
      await service.chain.servicepackage
        .productlist({ status: '1' })
        .then(res => {
          if (res && res.data.length > 0) {
            res.data.forEach(item => {
              this.goodAddDialog.products.push({
                ...item,
                isSelect: false
              })
            })
          } else {
            this.goodAddDialog.products = []
          }
        })
    },
    async getComboList(params) {
      await service.chain.servicepackage
        .findAll({ isDel: '0', ...params })
        .then(res => {
          if (res && res.data.length > 0) {
            res.data.forEach(item => {
              this.comboAddDialog.comboList.push({
                ...item,
                isSelect: false
              })
            })
          } else {
            this.comboAddDialog.comboList = []
          }
        })
    },
    clearProjectData(data) {
      this.settingForm.type = '1'
      data.selectProjectList = []
    },
    clearGoodData(data) {
      data.selectProducts = []
    },
    clearSelectRegion() {
      this.shopDialog.region = {}
      this.$refs.templateRegionTree.setCheckedKeys([])
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
    }
  }
}
</script>

<style scoped lang="scss">
.selected {
  height: calc(80vh - 200px);
  overflow-y: auto;

  table {
    border-collapse: collapse;
    border-color: #dcdfe6;

    td {
      padding: 0 5px;
    }
  }
}
</style>
