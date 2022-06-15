<template>
  <div class="dept">
    <el-tabs v-model="activeName">
      <el-tab-pane label="收银开单配置" name="bill">
        <el-form label-width="140px">
          <el-form-item label="手牌号：">
            <el-radio-group v-model="marketOrderConfig.isAutoNo">
              <el-radio label="0">手动手牌号</el-radio>
              <el-radio label="1">自动手牌号</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手牌号段：">
            <el-input
              v-model="marketOrderConfig.noMin"
              label="开始号"
              style="width: 150px"
              @change="saveBillNo"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            ~
            <el-input
              v-model="marketOrderConfig.noMax"
              label="结束号"
              style="width: 150px"
              @change="saveBillNo"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input
            >&nbsp;
            <span style="color: #646464"
              >手牌号段最多只支持100个；服务单结账完成、过期、作废后自动释放手牌号</span
            >
          </el-form-item>
          <el-form-item label="输入手机号查卡：">
            <el-radio-group v-model="marketOrderConfig.isAllowMobile">
              <el-radio label="0">不允许</el-radio>
              <el-radio label="1">允许</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="输入卡号查询：">
            <el-radio-group v-model="marketOrderConfig.isAllowCardno">
              <el-radio label="0">不允许</el-radio>
              <el-radio label="1">允许</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否需要电子签名：">
            <el-radio-group v-model="marketOrderConfig.isNeedSign">
              <el-radio label="0">关闭</el-radio>
              <el-radio label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否自动打印小票：">
            <el-radio-group v-model="marketOrderConfig.isAutoPrint">
              <el-radio label="0">关闭</el-radio>
              <el-radio label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否推送消息：">
            <el-radio-group v-model="marketOrderConfig.isPushWxmsg">
              <el-radio label="0">关闭</el-radio>
              <el-radio label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否需要评价：">
            <el-radio-group v-model="marketOrderConfig.isRate">
              <el-radio label="0">关闭</el-radio>
              <el-radio label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="员工轮牌配置" name="wheel">
        <el-button @click="addWheel()" type="primary">新增</el-button>
        <yid-table
          ref="wcTable"
          :data="wheelConfigData"
          style="margin-top: 15px">
          <yid-table-column
            label="方案编码"
            min-width="100"
            prop="cwtcode"></yid-table-column>
          <yid-table-column
            label="方案名称"
            min-width="150"
            prop="cwtname"></yid-table-column>
          <yid-table-column
            label="门店业务类型"
            min-width="150"
            prop="shoptype">
            <template slot-scope="scope">
              {{ scope.row.shoptype == '1' ? '美发' : '' }}
              {{ scope.row.shoptype == '2' ? '美容' : '' }}
              {{ scope.row.shoptype == '0' ? '综合' : '' }}
            </template>
          </yid-table-column>
          <yid-table-column label="适用门店" min-width="150" prop="shopnum">
            <template slot-scope="scope">
              <div>
                {{ '共有' + scope.row.tshops.length + '家门店' }}
                <el-link
                  type="primary"
                  style="margin: 0 10px"
                  @click="lookupShop(scope.row)"
                  >编辑
                </el-link>
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="250">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px"
                @click="editWcDialog(scope.row)"
                >编辑
              </el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
      <el-tab-pane label="轮牌临休配置" name="rest">
        <el-button @click="addWheelRest()" type="primary">新增</el-button>
        <el-form
          ref="resetform"
          :model="resetform"
          inline
          label-width="60px"
          color="#000"
          style="color: #000; font-weight: bold; margin-top: 20px">
          <el-form-item label="门店：">
            <el-select
              clearable
              v-model.trim="resetform.shopid"
              filterable
              :filter-method="filterShop2"
              placeholder="请选择"
              style="width: 160px">
              <el-option
                :key="item.id"
                :label="item.shopname"
                :value="item.id"
                v-for="item in filterShopList2">
                <span style="float: left">{{ item.shopcode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.shopname
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getWheelRest()">查询</el-button>
          </el-form-item>
          <br />
        </el-form>
        <yid-table
          ref="wcRestTable"
          :data="wheelRestData"
          style="margin-top: 15px; width: 420px">
          <yid-table-column label="名称" min-width="130">
            <template slot-scope="scope">
              <el-input
                v-show="scope.row.edit"
                size="small"
                v-model="scope.row.cwrname" />
              <span v-show="!scope.row.edit">{{ scope.row.cwrname }}</span>
            </template>
          </yid-table-column>
          <yid-table-column label="时长（分）" min-width="130">
            <template slot-scope="scope">
              <el-input
                v-show="scope.row.edit"
                size="small"
                v-model="scope.row.time" />
              <span v-show="!scope.row.edit">{{ scope.row.time }}</span>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="140">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="scope.row.edit = true"
                v-show="!scope.row.edit">
                编辑
              </el-link>
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="updateWheelRest(scope.row)"
                v-show="scope.row.edit">
                保存
              </el-link>
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="deleteWheelRest(scope.row.id)">
                删除
              </el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
      <el-tab-pane label="小票打印设置" name="printset">
        <div v-if="printMode == 1">
          <el-select
            v-model="selectCode"
            placeholder="请选择品牌："
            @change="selectChanged"
            class="bselect">
            <el-option
              :key="item.code"
              :label="item.name"
              :value="item.code"
              v-for="item in brandData"></el-option>
          </el-select>

          <el-button type="primary" class="publicbtn" @click="publicConfig"
            >发布到店</el-button
          >

          <ShopList
            :visible.sync="printshop"
            @change="pshoplist"
            :brandCode.sync="selectCode"
            @close="dialogClose"></ShopList>

          <yid-table
            ref="printsetTable"
            :data="printsetData"
            style="margin-top: 15px; width: 780px">
            <yid-table-column
              label="小票模板编号"
              prop="code"
              min-width="150"></yid-table-column>
            <yid-table-column
              label="模板名称"
              prop="name"
              min-width="150"></yid-table-column>
            <yid-table-column
              label="对应业务类型"
              prop="btname"
              min-width="150"></yid-table-column>
            <yid-table-column
              label="打印联数"
              prop="printnum"
              min-width="150"></yid-table-column>
            <yid-table-column label="操作" min-width="150">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="editPrintSet(scope.row)">
                  编辑
                </el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </div>

        <div v-else>
          <div class="print_parent">
            <div class="print_left">
              <div>
                <el-button @click="back" type="primary">返回</el-button>
                <el-button @click="saveprint()" type="primary">保存</el-button>
                <el-button @click="line" type="primary">插入间隔符</el-button>
                <!--<el-button @click="center" type="primary">选中文本居中</el-button>-->
              </div>
              <div class="print_count">
                <label>打印联数：</label>
                <el-select v-model="printnum">
                  <el-option :label="1" :value="1"></el-option>
                  <el-option :label="2" :value="2"></el-option>
                  <el-option :label="3" :value="3"></el-option>
                </el-select>
              </div>

              <div class="print_title"><label>通用字段：</label></div>
              <div class="fild_box">
                <div
                  class="fild"
                  v-for="item in printitemData.filter(obj => obj.type == '1')"
                  :key="item.id"
                  @click="addStr"
                  :data-str="item.name"
                  :data-filed="item.filed"
                  type="primary">
                  [{{ item.name }}]
                </div>
              </div>
              <div class="print_title"><label>消费单常用字段：</label></div>
              <div class="fild_box">
                <div
                  class="fild"
                  v-for="item in printitemData.filter(obj => obj.type == '2')"
                  :key="item.id"
                  @click="addStr"
                  :data-str="item.name"
                  :data-filed="item.filed"
                  type="primary">
                  [{{ item.name }}]
                </div>
              </div>
              <div class="print_title"><label>充值单常用字段：</label></div>
              <div class="fild_box">
                <div
                  class="fild"
                  v-for="item in printitemData.filter(obj => obj.type == '6')"
                  :key="item.id"
                  @click="addStr"
                  :data-str="item.name"
                  :data-filed="item.filed"
                  type="primary">
                  [{{ item.name }}]
                </div>
              </div>

              <div class="print_title"><label>付款方式字段：</label></div>
              <div class="fild_box">
                <div
                  class="fild"
                  v-for="item in printitemData.filter(obj => obj.type == '5')"
                  :key="item.id"
                  @click="addStr"
                  :data-str="item.name"
                  :data-filed="item.filed"
                  type="primary">
                  [{{ item.name }}]
                </div>
              </div>
              <div class="print_title"><label>买套餐消费字段：</label></div>
              <div class="fild_box">
                <div
                  class="fild"
                  v-for="item in printitemData.filter(obj => obj.type == '3')"
                  :key="item.id"
                  @click="addStr"
                  :data-str="item.name"
                  :data-filed="item.filed"
                  type="primary">
                  [{{ item.name }}]
                </div>
              </div>
              <!--<div class="print_title"><label>消费卡剩余项目字段：</label></div>-->
              <!--<div class="fild_box">-->

              <!--<div class="fild" v-for="item in printitemData.filter(obj=>obj.type=='4')"-->
              <!--:key="item.id" @click="addStr" :data-str="item.name" :data-filed="item.filed"-->
              <!--type="primary">[{{item.name}}]-->
              <!--</div>-->

              <!--</div>-->
            </div>

            <div class="print_right">
              <div class="print_border">
                <!---->
                <textarea ref="textarea" class="texta" @keyup="textInput">{{
                  printContent
                }}</textarea>
              </div>
              <div class="print_border wrapper">
                <textarea class="texta" readonly v-html="printtest"> </textarea>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="销售工位配置" name="station">
        <div>
          <span>选择业务类型：</span>
          <el-select
            v-model="btype"
            placeholder="请选择"
            @change="getStationConfig">
            <el-option
              v-for="item in btypeList"
              :key="'btype' + item.id"
              :value="item.id"
              :label="item.name"></el-option>
          </el-select>
        </div>
        <yid-table
          ref="stationTable"
          :data="stationData"
          style="margin-top: 15px; width: 480px">
          <yid-table-column
            label="对应业务类型"
            prop="name"
            min-width="150"></yid-table-column>
          <yid-table-column
            label="销售工位数"
            prop="num"
            min-width="150"></yid-table-column>
          <yid-table-column label="操作" min-width="140">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="editStation(scope.row)">
                编辑
              </el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
    </el-tabs>

    <yid-dialog
      :title="wcRestDialog.title"
      :visible.sync="wcRestDialog.visible"
      @close="wcRestCancel"
      width="550px">
      <el-form
        label-width="140px"
        ref="dialogWcRest"
        :rules="wcRestDialog.rules"
        :model="wcRestDialog.model">
        <el-form-item label="名称：" prop="cwrname">
          <el-input v-model="wcRestDialog.model.cwrname" />
        </el-form-item>
        <el-form-item label="时长(分)：" prop="time">
          <el-input v-model="wcRestDialog.model.time" type="number" min="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveWheelRest">保存</el-button>
          <el-button @click="wcRestCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="wcDialog.title"
      :visible.sync="wcDialog.visible"
      @close="wcCancel"
      width="1050px">
      <el-form inline="true" label-width="100px" ref="dialogWc">
        <el-form-item label="方案名称：" prop="cwtname">
          <el-input v-model="wcDialog.cwtname" />
        </el-form-item>
        <el-form-item label="业务类型：" prop="shoptype">
          <el-select
            v-model="wcDialog.shoptype"
            placeholder="请选择"
            @change="restWcDialogPs()"
            :disabled="wcDialog.id != ''">
            <el-option
              v-for="item in btypeList"
              :key="'shoptype' + item.id"
              :value="item.id"
              :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="轮牌设置：" prop="cwtname">
          <el-button @click="addWcDialog()" type="primary">新增</el-button>
        </el-form-item>
      </el-form>
      <yid-table
        ref="wcTable"
        :data="wcDialog.configs"
        style="margin-top: 15px">
        <yid-table-column label="名称" min-width="120" prop="cwcname">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cwcname" />
          </template>
        </yid-table-column>
        <yid-table-column label="位置" min-width="120" prop="postion">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.postion"
              placeholder="请选择"
              @change="getWcDialogPs(scope.row)">
              <el-option value="1" label="第一工位"></el-option>
              <el-option value="2" label="第二工位"></el-option>
              <el-option value="3" label="第三工位"></el-option>
            </el-select>
          </template>
        </yid-table-column>
        <yid-table-column label="对应级别类型" min-width="220" prop="cwcPsname">
          <template slot-scope="scope">
            <el-select
              placeholder="请选择所对应级别类型"
              multiple
              v-model="scope.row.ps">
              <el-option
                v-for="ps in scope.row.psList"
                :key="ps.pscode"
                :label="ps.psname"
                :value="ps.pscode + '-' + ps.psname">
              </el-option>
            </el-select>
          </template>
        </yid-table-column>
        <yid-table-column label="每日洗牌" min-width="100" prop="dayClean">
          <template slot-scope="scope">
            <el-switch
              style="margin: 0 10px 0 10px"
              v-model="scope.row.dayClean"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </yid-table-column>
        <yid-table-column label="收银联动" min-width="100" prop="withCashier">
          <template slot-scope="scope">
            <el-switch
              style="margin: 0 10px 0 10px"
              v-model="scope.row.withCashier"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </yid-table-column>
        <yid-table-column label="点客是否翻牌" min-width="100" prop="dksffp">
          <template slot-scope="scope">
            <el-switch
              style="margin: 0 10px 0 10px"
              v-model="scope.row.dksffp"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </yid-table-column>
        <yid-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <el-link type="primary" @click="deleteWheel(scope.row.orderid)"
              >删除</el-link
            >
          </template>
        </yid-table-column>
      </yid-table>
      <el-row style="margin-top: 18px">
        <el-col :span="2" :offset="8">
          <el-button type="primary" @click="saveWcDialog()">保存</el-button>
        </el-col>
        <el-col :span="2" :offset="4">
          <el-button @click="wcCancel()">关闭</el-button>
        </el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="stationDialog.title"
      :visible.sync="stationDialog.visible"
      @close="wcRestCancel"
      width="700px">
      <el-row>
        <el-col :span="3">销售工位</el-col>
        <el-col :span="6">工位名称</el-col>
        <el-col :span="8">对应职务</el-col>
        <el-col :span="4">可添加人数</el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="3">第一工位</el-col>
        <el-col :span="6">
          <el-input
            v-model="stationDialog.ps1.name"
            style="width: 140px"
            clearable />
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="stationDialog.ps1.ps"
            multiple
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in psList"
              :key="'btype1' + item.id"
              :value="item.id"
              :label="item.psname"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input
            type="number"
            min="0"
            max="5"
            v-model="stationDialog.ps1.pepnum"
            clearable />
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="3">第二工位</el-col>
        <el-col :span="6">
          <el-input
            v-model="stationDialog.ps2.name"
            style="width: 140px"
            clearable />
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="stationDialog.ps2.ps"
            multiple
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in psList"
              :key="'btype2' + item.id"
              :value="item.id"
              :label="item.psname"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input
            type="number"
            min="0"
            max="5"
            v-model="stationDialog.ps2.pepnum"
            clearable />
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="3">第三工位</el-col>
        <el-col :span="6">
          <el-input
            v-model="stationDialog.ps3.name"
            style="width: 140px"
            clearable />
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="stationDialog.ps3.ps"
            multiple
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in psList"
              :key="'btype3' + item.id"
              :value="item.id"
              :label="item.psname"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input
            type="number"
            min="0"
            max="5"
            v-model="stationDialog.ps3.pepnum"
            clearable />
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="2" :offset="8">
          <el-button type="primary" @click="saveStation()">保存</el-button>
        </el-col>
        <el-col :span="2" :offset="4">
          <el-button @click="stationDialog.visible = false">关闭</el-button>
        </el-col>
      </el-row>
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
                {{ scope.row.type == '1' ? '美发' : '' }}
                {{ scope.row.type == '2' ? '美容' : '' }}
              </template>
            </yid-table-column>
            <yid-table-column
              label="轮牌方案"
              min-width="100"
              prop="cwtname"></yid-table-column>
          </yid-table>
        </el-col>
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop()" type="primary" size="mini"
              ><i class="el-icon-right"></i>
            </el-button>
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
              label="轮牌方案"
              min-width="120"
              prop="cwtname"></yid-table-column>
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="deleteShop(scope.row)">
                  删除
                </el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveWheelShop()">保存</el-button>
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
import { isEmpty } from '../../library/helper/validate'
import printuitl from '../../library/print'
import ShopList from '../components/ShopList'
import yid from '@src/library'

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

/**
 * 是否重复
 * @param arr
 * @returns {boolean}
 */
function isRepeat(arr) {
  var hash = {}
  for (var i in arr) {
    if (hash[arr[i]]) {
      return true
    }
    hash[arr[i]] = true
  }
  return false
}

export default {
  name: 'billAndWheel',
  data() {
    return {
      brands: [],
      activeName: 'bill',
      marketOrderConfig: {},
      radioInitGroup: {
        isAutoNo: false,
        isAllowMobile: false,
        isNeedSign: false,
        isAutoPrint: false,
        isPushWxmsg: false,
        isRate: false,
        isAllowCardno: false
      },
      dtPostion: ['', '第一工位', '第二工位', '第三工位'],
      dtYN: ['否', '是'],
      dtPs: [],
      wheelConfigData: [],
      wheelRestData: [],
      wcDialog: {
        title: '新增轮牌',
        visible: false,
        id: '',
        cwtcode: '',
        cwtname: '',
        shoptype: '',
        configs: [],
        tshops: []
      },
      wcRestDialog: {
        title: '新增轮牌临休',
        visible: false,
        model: {
          cwrname: '',
          time: 0
        },
        rules: {
          cwrname: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          time: [
            { required: true, message: '请输入时间', trigger: 'blur', min: 0 }
          ]
        }
      },
      stationData: [],
      stationDialog: {
        title: '编辑工位配置',
        visible: false,
        id: '',
        name: '',
        num: '',
        bid: '',
        bcode: '',
        revision: '',
        ps1: {
          postion: 1,
          name: '',
          ps: [],
          pepnum: '',
          pslist: []
        },
        ps2: {
          postion: 2,
          name: '',
          ps: [],
          pepnum: '',
          pslist: []
        },
        ps3: {
          postion: 3,
          name: '',
          ps: [],
          pepnum: '',
          pslist: []
        }
      },
      stationList: [
        {
          postion: 1,
          name: '',
          ps: [],
          pepnum: '',
          pslist: []
        }
      ],
      psList: [],

      allShopList: [],
      filterShopList: [],
      wheelform: {
        shopid: ''
      },
      allShopList2: [],
      filterShopList2: [],
      resetform: {
        shopid: ''
      },
      btype: '',
      btypeObj: {},
      btypeList: [],
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
      regions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectShops: [],
      types: [
        { name: '美发', value: '1' },
        { name: '美容', value: '2' },
        { name: '综合', value: '0' }
      ],
      brandData: [],
      selectCode: '',
      printsetData: [],
      printitemData: [],
      printtest: '',
      printId: 1,
      printMode: 1,
      printContent: '',
      printFormat: '',
      printnum: 1,
      printdemo: false,
      printshop: false,
      selectShopData: []
    }
  },
  components: { ShopList },
  methods: {
    handleSelectionChange(rows) {
      this.selectShops = rows
    },
    saveBillNo() {
      let noMin = this.marketOrderConfig.noMin
      let noMax = this.marketOrderConfig.noMax
      if (isEmpty(noMin) || isEmpty(noMax)) {
        $yid.util.info('开始号和结束号不能为空')
        return
      }
      if (Number(noMin) > Number(noMax)) {
        $yid.util.info('开始号不能大于结束号')
        return
      }
      if (Number(noMax) - Number(noMin) >= 100) {
        $yid.util.info('手牌号段最多只支持100个！')
        return
      }
      let param = {
        noMin: noMin,
        noMax: noMax,
        revision: this.marketOrderConfig.revision,
        id: this.marketOrderConfig.id
      }
      service.marketOrderConfig.saveNo(param).then(res => {
        this.marketOrderConfig.revision = res.data.revision
      })
    },
    getMarketOrderConfig() {
      service.marketOrderConfig.orderConfig().then(res => {
        this.marketOrderConfig = res.data
      })
    },
    getWheelRest() {
      service.wheelRest
        .getCwr(this.resetform.shopid)
        .then(res => {
          res.data.map(e => {
            e.edit = false
          })
          this.wheelRestData = res.data
        })
        .catch(err => {
          this.wheelRestData = [
            {
              id: 1,
              cwrname: '午休',
              time: 45,
              edit: false
            },
            {
              id: 2,
              cwrname: '临休',
              time: 30,
              edit: false
            }
          ]
        })
    },
    wcCancel() {
      this.wcDialog.visible = false
      this.$refs['dialogWc'].resetFields()
    },
    addWheelRest() {
      this.wcRestDialog.visible = true
    },
    saveWheelRest() {
      this.$refs['dialogWcRest'].validate(valid => {
        if (valid) {
          service.wheelRest.saveCwr(this.wcRestDialog.model).then(res => {
            $yid.util.alert(res.resp_msg)
            this.getWheelRest()
            this.wcRestDialog.visible = false
          })
        } else {
          return false
        }
      })
    },
    updateWheelRest(v) {
      service.wheelRest.saveCwr(v).then(res => {
        $yid.util.alert(res.resp_msg)
        this.getWheelRest()
      })
    },
    deleteWheelRest(id) {
      $yid.util.confirm('你确定要删除该轮牌配置吗？', '', '', () => {
        service.wheelRest.deleteCwr(id).then(res => {
          $yid.util.alert(res.resp_msg)
          this.getWheelRest()
        })
      })
    },
    wcRestCancel() {
      this.wcRestDialog.visible = false
      this.$refs['dialogWcRest'].resetFields()
    },
    getJobList() {
      service.position.list({ status: '1' }).then(res => {
        this.dtPs = res.data
      })
    },
    getStationConfig() {
      if (this.btype == '') {
        yid.util.error('请选择业务类型')
        return
      }
      let params = {
        bid: this.btype
      }
      service.wheelRest.getStations(params).then(res => {
        this.stationData = res.data
      })
      this.psList = []
      service.wheelRest
        .getPostions({ status: '1', btypeid: this.btype })
        .then(res => {
          this.psList = res.data
        })
    },
    editStation(row) {
      service.wheelRest.getStationdesc({ statid: row.id }).then(res => {
        if (res.resp_code == '200') {
          this.stationDialog.visible = true
          this.stationDialog.id = row.id
          this.stationDialog.code = row.code
          this.stationDialog.name = row.name
          this.stationDialog.num = row.num
          this.stationDialog.bid = row.bid
          this.stationDialog.bcode = row.bcode
          this.stationDialog.revision = row.revision
          this.stationDialog.ps1 = {
            id: '',
            postion: 1,
            name: '',
            ps: [],
            pepnum: '',
            pslist: []
          }
          this.stationDialog.ps2 = {
            id: '',
            postion: 2,
            name: '',
            ps: [],
            pepnum: '',
            pslist: []
          }
          this.stationDialog.ps3 = {
            id: '',
            postion: 3,
            name: '',
            ps: [],
            pepnum: '',
            pslist: []
          }
          if (res.data && res.data.length > 0) {
            for (let j = 0; j < res.data.length; j++) {
              if (res.data[j].postion == 1) {
                this.stationDialog.ps1.id = res.data[j].id
                this.stationDialog.ps1.name = res.data[j].name
                this.stationDialog.ps1.pepnum = res.data[j].pepnum
                this.stationDialog.ps1.pslist = []
                if (null != res.data[j].pslist) {
                  res.data[j].pslist.forEach(item => {
                    this.stationDialog.ps1.ps.push(String(item.psid))
                  })
                }
              }
              if (res.data[j].postion == 2) {
                this.stationDialog.ps2.id = res.data[j].id
                this.stationDialog.ps2.name = res.data[j].name
                this.stationDialog.ps2.pepnum = res.data[j].pepnum
                this.stationDialog.ps2.pslist = []
                if (null != res.data[j].pslist) {
                  res.data[j].pslist.forEach(item => {
                    this.stationDialog.ps2.ps.push(String(item.psid))
                  })
                }
              }
              if (res.data[j].postion == 3) {
                this.stationDialog.ps3.id = res.data[j].id
                this.stationDialog.ps3.name = res.data[j].name
                this.stationDialog.ps3.pepnum = res.data[j].pepnum
                this.stationDialog.ps3.pslist = []
                if (null != res.data[j].pslist) {
                  res.data[j].pslist.forEach(item => {
                    this.stationDialog.ps3.ps.push(String(item.psid))
                  })
                }
              }
            }
          }
        } else {
          $yid.uitl.error(res.resp_msg)
        }
      })
    },
    saveStation() {
      let flag = false
      let psArry = []
      this.stationList = []
      if (this.stationDialog.ps1.name || this.stationDialog.ps1.pepnum) {
        this.stationList.push(this.stationDialog.ps1)
      }
      if (this.stationDialog.ps2.name || this.stationDialog.ps2.pepnum) {
        this.stationList.push(this.stationDialog.ps2)
      }
      if (this.stationDialog.ps3.name || this.stationDialog.ps3.pepnum) {
        this.stationList.push(this.stationDialog.ps3)
      }
      if (this.stationList.length == 0) {
        $yid.util.error('至少配制一个工位!')
        return
      }
      this.stationList.map(m => {
        if (!m.name) {
          flag = true
          $yid.util.error(m.name + ' 请输入工位名称!')
        }
        if (m.ps.length > 0) {
          m.ps.map(p => {
            psArry.push(p)
          })
          m.pslist = []
          m.ps.forEach(p => {
            this.psList.forEach(ps => {
              if (p == String(ps.id)) {
                m.pslist.push({
                  psid: ps.id,
                  pscode: ps.pscode,
                  psname: ps.psname
                })
              }
            })
          })
        }
        if (Number(m.pepnum) > 5 || Number(m.pepnum) < 1) {
          flag = true
          $yid.util.error(m.name + ' 可添加人数，最多5人，最少一人!')
        } else {
          m.pepnum = Number(m.pepnum)
        }
      })
      if (flag) {
        return
      }
      const param = {
        id: this.stationDialog.id,
        num: this.stationList.length,
        desc: this.stationList
      }
      if (isRepeat(psArry)) {
        $yid.util.confirm(
          '当前销售工位中有重复的对应职位，设置生效后将可能导致重复计业绩，是否继续？',
          '',
          '',
          () => {
            service.wheelRest.saveStation(param).then(res => {
              if (res.resp_code == '200') {
                this.getStationConfig()
                this.stationDialog.visible = false
                $yid.util.alert(res.resp_msg)
              } else {
                $yid.util.error(res.resp_msg)
              }
            })
          }
        )
      } else {
        service.wheelRest.saveStation(param).then(res => {
          if (res.resp_code == '200') {
            this.getStationConfig()
            this.stationDialog.visible = false
            $yid.util.alert(res.resp_msg)
          } else {
            $yid.util.error(res.resp_msg)
          }
        })
      }
    },
    async getPrintTempset(brand) {
      let that = this

      await service.wheelRest
        .getPrintTempset({ brandCode: brand })
        .then(res => {
          that.printsetData = res.data
          that.$forceUpdate()
        })
    },
    editPrintSet(row) {
      this.printMode = 2

      this.printId = row.id

      this.printContent = row.printContent
      this.printFormat = row.printFormat
      this.printnum = row.printnum

      this.sysncText(this.printContent)

      this.$forceUpdate()
    },
    addStation() {
      if (this.stationList.length >= 3) {
        return
      }
      this.stationList.push({
        postion: 1,
        name: '',
        ps: [],
        pepnum: 5,
        pslist: []
      })
    },
    delStation(index) {
      if (this.stationList.length == 1) {
        return
      }
      this.stationList.splice(index, 1)
    },
    getShopList() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
          this.filterShopList2 = res.data
          this.allShopList2 = Object.assign(this.filterShopList2) //保留原数据
        }
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    filterShop2(v) {
      this.filterShopList2 = this.allShopList2.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    getWheelConfig() {
      service.wheelConfig.getCwc().then(res => {
        this.wheelConfigData = res.data
      })
    },
    addWcDialog() {
      const item = {
        cwcname: '',
        orderid: Math.floor(Math.random() * 10000000 + 1),
        ps: [],
        psList: [],
        cwcPscode: '',
        cwcPsname: '',
        postion: '',
        dayClean: true,
        withCashier: true,
        dksffp: true
      }
      this.wcDialog.configs.push(item)
    },
    getWcDialogPs(row) {
      if (this.wcDialog.shoptype == '') {
        $yid.util.error('请选择业务类型')
        row.postion = ''
        return
      }
      if (row.postion == '') {
        return
      }
      row.ps = []
      service.wheelConfig
        .getWcPostions({
          postion: row.postion,
          shoptype: this.wcDialog.shoptype
        })
        .then(res => {
          row.psList = res.data
        })
    },
    restWcDialogPs() {
      this.wcDialog.configs.forEach(row => {
        this.getWcDialogPs(row)
      })
    },
    saveWcDialog() {
      if (this.wcDialog.cwtname == '') {
        $yid.util.error('请填入方案名称')
        return
      }
      if (this.wcDialog.cwtname.length > 16) {
        $yid.util.error('方案名称不能超过16个字符')
        return
      }
      if (this.wcDialog.shoptype == '') {
        $yid.util.error('请选择业务类型')
        return
      }
      if (!this.wcDialog.configs || this.wcDialog.configs.length == 0) {
        $yid.util.error('请新增轮牌设置')
        return
      }
      let message = ''
      this.wcDialog.configs.forEach(item => {
        if (item.cwcname == '') {
          message += '请填写名称, '
        }
        if (item.cwcname.length > 16) {
          message += '名称不能超过16个字符, '
        }
        if (item.postion == '') {
          message += '请选择位置, '
        }
        if (item.ps.length == 0) {
          message += '请选择职务, '
        } else {
          let cwcPscode = ''
          let cwcPsname = ''
          item.ps.forEach(p => {
            cwcPscode += p.split('-')[0] + ','
            cwcPsname += p.split('-')[1] + ','
          })
          item.cwcPscode = cwcPscode.substring(0, cwcPscode.length - 1)
          item.cwcPsname = cwcPsname.substring(0, cwcPsname.length - 1)
        }
        if (message == '') {
          item.dayClean = item.dayClean == true ? '1' : '0'
          item.withCashier = item.withCashier == true ? '1' : '0'
          item.dksffp = item.dksffp == true ? '1' : '0'
        }
      })
      if (message != '') {
        $yid.util.error(message)
        return
      }
      service.wheelConfig.saveCwc(this.wcDialog).then(res => {
        $yid.util.alert(res.resp_msg)
        this.getWheelConfig()
        this.wcDialog.visible = false
      })
    },
    async editWcDialog(row) {
      this.wcDialog.title = '编辑员工轮牌'
      this.wcDialog.visible = true
      this.wcDialog.id = row.id
      this.wcDialog.cwtcode = row.cwtcode
      this.wcDialog.cwtname = row.cwtname
      this.wcDialog.shoptype = row.shoptype
      this.wcDialog.configs = []
      row.configs.forEach(async item => {
        const config = {}
        config.id = item.id
        config.orderid = item.orderid
        config.cwcname = item.cwcname
        config.postion = item.postion
        config.dayClean = item.dayClean == '1' ? true : false
        config.withCashier = item.withCashier == '1' ? true : false
        config.dksffp = item.dksffp == '1' ? true : false
        await service.wheelConfig
          .getWcPostions({
            postion: config.postion,
            shoptype: row.shoptype
          })
          .then(res => {
            config.psList = res.data
          })
        const pscodes = item.cwcPscode.split(',')
        const psnames = item.cwcPsname.split(',')
        config.ps = []
        if (null != pscodes && pscodes.length > 0) {
          for (let i = 0; i < pscodes.length; i++) {
            config.ps.push(pscodes[i] + '-' + psnames[i])
          }
        }
        this.wcDialog.configs.push(config)
      })
      //                this.changeDtPs(this.wcDialog.configs.postion)
    },
    addWheel() {
      isClear(this.wcDialog)
      this.addWcDialog()
      this.wcDialog.visible = true
    },
    deleteWheel(id) {
      const that = this
      $yid.util.confirm('你确定要删除该轮牌配置吗？', '', '', () => {
        let i = 0
        that.wcDialog.configs.forEach((item, index) => {
          if (id == item.orderid) {
            i = index
          }
        })
        if (i >= 0) {
          that.wcDialog.configs.splice(i, 1)
        }
        //                    service.wheelConfig.deleteCwc(id).then(res => {
        //                        $yid.util.alert(res.resp_msg)
        //                        this.getWheelConfig()
        //                    });
      })
    },
    async lookupShop(row) {
      isClear(this.shopDialog)
      this.shopDialog.title = '选择门店'
      this.shopDialog.type = row.shoptype
      this.shopDialog.shoplist = row.tshops || []
      this.shopDialog.id = row.id
      this.shopDialog.shoplist.forEach(each => {
        each.cwtname = row.cwtname
      })
      this.$refs.templateRegionTree.setCheckedKeys([])
      await this.queryShop()
      this.shopDialog.visible = true
    },
    async queryShop() {
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
        page: 1,
        limit: 10,
        count: 0
      }
      await this.$refs['table1'].reloadData({
        fetch,
        params
      })
    },
    addShop() {
      this.selectShops.map(m => {
        let flag = true
        this.shopDialog.shoplist.forEach(p => {
          if (p.id == m.id || p.shopid == m.id) {
            flag = false
          }
        })
        if (flag) {
          if (m.cwtname) {
            this.flag = true
          }
          this.shopDialog.shoplist.push({
            shopid: m.id,
            shopcode: m.shopcode,
            shopname: m.shopname,
            cwtname: m.cwtname
          })
        }
      })
    },
    deleteShop(row) {
      $yid.util.confirm('确定要删除吗？？', '', '', () => {
        let i = -1
        this.shopDialog.shoplist.forEach((p, index) => {
          if (p.shopid == row.shopid) {
            i = index
          }
        })
        this.shopDialog.shoplist.splice(i, 1)
      })
    },
    saveWheelShop() {
      service.wheelConfig
        .saveCwc({
          id: this.shopDialog.id,
          tshops: this.shopDialog.shoplist,
          shopflag: '1'
        })
        .then(res => {
          $yid.util.alert(res.resp_msg)
          this.getWheelConfig()
          this.shopDialog.visible = false
        })
    },
    setShop() {
      this.addDialog.shoplist = this.shopDialog.shoplist
      this.shopDialog.visible = false
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

    center(e) {
      let t = this.$refs.textarea

      let text = ''
      //  var t = document.getElementById(id);
      if (window.getSelection) {
        if (t.selectionStart != undefined && t.selectionEnd != undefined) {
          text = t.value.substring(t.selectionStart, t.selectionEnd)
        } else {
          //return "";
        }
      } else {
        text = document.selection.createRange().text
      }

      let getLength = text.length

      if (getLength == 0) {
        $yid.util.alert('未选中文字')
      }

      let length = (36 - getLength) / 2

      let newstr = ''
      for (let i = 0; i < length; i++) {
        newstr += ' '
      }

      newstr += text

      for (let i = 0; i < length; i++) {
        newstr += ' '
      }

      printuitl.addTextareaCursor(t, printuitl.getTextareaCursor(t), newstr)

      // alert(text);
    },

    line() {
      printuitl.insertAtCursor(
        this.$refs.textarea,
        '\n---------------------------------------\n'
      )
    },

    testprint() {
      let data = printuitl.printData(
        printuitl.testObj,
        this.printContent,
        this.printFormat
      )

      this.printtest = data
      this.printdemo = true
    },
    addStr(e) {
      let t = this.$refs.textarea

      printuitl.insertAtCursor(t, '[' + e.currentTarget.dataset.str + ']')
    },
    back() {
      this.printMode = 1
    },
    async saveprint() {
      let print = this.$refs.textarea.value

      let format = printuitl.formatContent(print, this.printitemData)

      await service.wheelRest.savePrintTempset({
        id: this.printId,
        brandCode: this.selectcode,
        printContent: print,
        printFormat: format,
        printnum: this.printnum
      })

      await this.getPrintTempset(this.selectCode)
      this.printMode = 1
    },

    sysncText(value) {
      let print = value

      let format = printuitl.formatContent(print, this.printitemData)

      let data = printuitl.printData(printuitl.testObj, print, format)

      this.printtest = data
    },
    textInput(e) {
      let cu = printuitl.getTextareaCursor(e.target)
      e.target.value = printuitl.spaceToDBC(e.target.value)

      printuitl.setTextareaCursor(e.target, cu)

      this.sysncText(e.target.value)
    },
    async getBrands() {
      let that = this

      await service.wheelRest.getBrands().then(res => {
        that.brandData = res.data
      })

      await service.wheelRest.getPrintItem().then(res => {
        that.printitemData = res.data
      })
    },
    selectChanged(value) {
      this.getPrintTempset(value)
    },
    publicConfig() {
      if (this.selectCode) this.printshop = true
    },
    dialogClose() {
      this.printshop = false
    },
    pshoplist(list) {
      this.printshop = false

      let anies = list.flatMap(item => item.shopcode).toString()
      let shopids = list.flatMap(item => item.id).toString()

      let data = JSON.parse(JSON.stringify(this.printsetData))

      data.forEach(item => {
        item.shopids = shopids
      })

      this.$confirm('确认将模板配置到[ ' + anies + ' ]?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await service.wheelRest.saveToCashier(data).then(res => {
            yid.util.info('发布成功！')
          })
        })
        .catch(() => {})
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
  },
  mounted() {
    service.btype.listAll().then(res => {
      this.btypeList = res.data
      if (res.data.length > 0) {
        this.btypeObj = res.data[0]
        this.btype = this.btypeObj.id
        service.wheelRest
          .getPostions({ status: '1', btypeid: this.btype })
          .then(res => {
            this.psList = res.data
          })
      }
    })
    service.chain.servShop.findbrands({ status: '1' }).then(res => {
      this.brands = res.data
    })
    service.chain.region.treeAll({ status: '1' }).then(res => {
      this.regions = res.data
    })
  },
  created() {
    this.getJobList()
    this.getMarketOrderConfig()
    this.getShopList()
  },
  watch: {
    'marketOrderConfig.isAllowCardno'(v) {
      if (this.radioInitGroup.isAllowCardno) {
        let param = {
          isAllowCardno: v,
          revision: this.marketOrderConfig.revision,
          id: this.marketOrderConfig.id
        }
        service.marketOrderConfig.save(param).then(res => {
          this.marketOrderConfig.revision = res.data.revision
        })
      } else {
        this.radioInitGroup.isAllowCardno = true
      }
    },
    activeName(v) {
      if (v === 'bill') {
        this.getMarketOrderConfig()
      } else if (v === 'wheel') {
        this.getWheelConfig()
      } else if (v === 'rest') {
        this.getWheelRest()
      } else if (v === 'station') {
        this.getStationConfig()
      } else if (v === 'printset') {
        this.getBrands()
      }
    },
    'marketOrderConfig.isAutoNo'(v) {
      if (this.radioInitGroup.isAutoNo) {
        let param = {
          isAutoNo: v,
          revision: this.marketOrderConfig.revision,
          id: this.marketOrderConfig.id
        }
        service.marketOrderConfig.updateIsAutoNo(param).then(res => {
          this.marketOrderConfig.revision = res.data.revision
        })
      } else {
        this.radioInitGroup.isAutoNo = true
      }
    },
    'marketOrderConfig.isAllowMobile'(v) {
      if (this.radioInitGroup.isAllowMobile) {
        let param = {
          isAllowMobile: v,
          revision: this.marketOrderConfig.revision,
          id: this.marketOrderConfig.id
        }
        service.marketOrderConfig.updateIsAllowMobile(param).then(res => {
          this.marketOrderConfig.revision = res.data.revision
        })
      } else {
        this.radioInitGroup.isAllowMobile = true
      }
    },
    'marketOrderConfig.isNeedSign'(v) {
      if (this.radioInitGroup.isNeedSign) {
        let param = {
          isNeedSign: v,
          revision: this.marketOrderConfig.revision,
          id: this.marketOrderConfig.id
        }
        service.marketOrderConfig.save(param).then(res => {
          this.marketOrderConfig.revision = res.data.revision
        })
      } else {
        this.radioInitGroup.isNeedSign = true
      }
    },
    'marketOrderConfig.isAutoPrint'(v) {
      if (this.radioInitGroup.isAutoPrint) {
        let param = {
          isAutoPrint: v,
          revision: this.marketOrderConfig.revision,
          id: this.marketOrderConfig.id
        }
        service.marketOrderConfig.save(param).then(res => {
          this.marketOrderConfig.revision = res.data.revision
        })
      } else {
        this.radioInitGroup.isAutoPrint = true
      }
    },
    'marketOrderConfig.isPushWxmsg'(v) {
      if (this.radioInitGroup.isPushWxmsg) {
        let param = {
          isPushWxmsg: v,
          revision: this.marketOrderConfig.revision,
          id: this.marketOrderConfig.id
        }
        service.marketOrderConfig.save(param).then(res => {
          this.marketOrderConfig.revision = res.data.revision
        })
      } else {
        this.radioInitGroup.isPushWxmsg = true
      }
    },
    'marketOrderConfig.isRate'(v) {
      if (this.radioInitGroup.isRate) {
        let param = {
          isRate: v,
          revision: this.marketOrderConfig.revision,
          id: this.marketOrderConfig.id
        }
        service.marketOrderConfig.save(param).then(res => {
          this.marketOrderConfig.revision = res.data.revision
        })
      } else {
        this.radioInitGroup.isRate = true
      }
    },
    wheelConfigData(v) {
      //  后端数据表格展示转化
      v.map(e => {
        e._postion = this.dtPostion[e.postion]
        e._dayClean = this.dtYN[e.dayClean]
        e._withCashier = this.dtYN[e.withCashier]
      })
    }
  }
}
</script>

<style lang="scss">
.bselect {
  margin-bottom: 10px;
}

.print_parent {
  display: flex;

  flex-direction: row;

  justify-content: center;

  height: 100%;

  .print_count {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .print_title {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .print_left {
    width: 800px;
    height: 700px;
  }

  .print_right {
    display: flex;
    flex-direction: row;
    text-align: center;
    //justify-content: center;
  }

  .print_border {
    padding: 10px;
    width: 360px !important;
    background: url('~@src/assets/images/print.jpeg') no-repeat right top;

    .texta {
      text-align: justify;
      background: transparent;
      border: none;
      font-size: 15px;
      // font-family: monospace !important;
      width: 340px;
      height: 500px;
      resize: none;
      font-family: '宋体', Simsun, monospace !important;
      white-space: pre;
    }
  }

  .fild_box {
    display: flex;
    flex-direction: row;

    .fild {
      margin: 5px;
      color: blue;
    }
  }
}

.wrapper {
  margin-left: 10px;
}

.publicbtn {
  margin-left: 10px;
}
</style>
