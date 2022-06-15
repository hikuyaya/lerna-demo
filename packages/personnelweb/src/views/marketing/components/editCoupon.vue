<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <el-form :model="settingForm" :rules="settingFormRules" label-width="150px" ref="settingForm"
             style="margin-top: 8px">
      <el-form-item label="门店品牌：" prop="brandId">
        <el-select clearable v-model="settingForm.brandId" :disabled="!isCanEdit" @change="changeBrand">
          <el-option v-for="item in brandList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="券编码：" prop="cpcode">
        {{ settingForm.cpcode }}<label style="color:silver">编号限定从0001开始的整数,自动叠加</label>
      </el-form-item>
      <el-form-item label="优惠券名称：" prop="cpname">
        <el-input :disabled="!isCanEdit" v-model="settingForm.cpname" placeholder="10字以内" style="width: 150px"/>
      </el-form-item>
      <el-form-item label="优惠券形式：" prop="couponType">
        <el-row>
          <el-radio v-model="settingForm.couponType" :disabled="!isCanEdit" :label="1" @change="changeCouponType">定额
          </el-radio>
          <div v-if="settingForm.couponType == '1'" style="margin-top: 8px">
            <el-input type="number" :disabled="!isCanEdit" style="width: 150px ; margin-left: 5px"
                      v-model="settingForm.discount"/>
            <el-tag type="info">元</el-tag>
          </div>
        </el-row>
        <el-radio v-model="settingForm.couponType" :disabled="!isCanEdit" :label="2" style="margin-top: 8px"
                  @change="changeCouponType">折扣
        </el-radio>
      </el-form-item>
      <el-row style="padding-left: 130px">
        <div v-if="settingForm.couponType == '2'" style="margin-top: 8px ">
          <el-input type="number" :disabled="!isCanEdit" style="width: 150px ; margin-left: 5px"
                    v-model="settingForm.discount"/>
          <el-tag type="info">折</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-tag type="info">最高减额:</el-tag>
          <el-input placeholder=">0的数" v-model="settingForm.maxMoney" style="width: 150px"/>
          <el-tag type="info">元</el-tag>
          （不填表示无上限）
        </div>
        <div v-if="settingForm.couponType == '2'" style="margin-top: 8px;">
          <el-radio v-model="forService" :label="0" @change='changService'>针对单个项目</el-radio>
          <el-radio v-model="forService" :label="1" @change='changService'>针对多个项目</el-radio>
          <br><label style="color:silver">说明:设置为针对单个项目，表示优惠券的优惠仅针对单据中优惠额度最高的可用项目进行折扣，单据内一个项目对应一张券</label>
          <br><label style="color:silver">按折扣优惠力度从高到低依次自动对应抵扣;如果设置为针对多个项目，则表示该单据内所有优惠券指定项目之和享受折扣，</label>
          <br><label style="color:silver">最高减额按整单算。一个项目仅可使用一张折扣优惠券，不可叠加使用(不分单项多项)</label>
        </div>
        <div v-if="settingForm.couponType == '2'" style="margin-top: 8px">
          <el-form-item label="折扣标题：" class="zeroTitle">
            <el-input placeholder="不可超过5个字" v-model="settingForm.zeroTitle" style="width: 150px"
                      @input="onInputTitle()"/>
          </el-form-item>
        </div>
      </el-row>

      <el-form-item label="优惠券类型：" prop="isOnline">
        <el-radio-group :disabled="!isCanEdit || originData != null" v-model="settingForm.isOnline">
          <el-row>
            <el-radio :label="'1'">线上</el-radio>
          </el-row>
          <el-radio :label="'0'" style="margin-top: 8px">线下</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用门店" prop="useshopType" v-if="settingForm.isOnline==1">
        <el-radio-group v-model="settingForm.useshopType">
          <el-radio label="1">所有活动门店</el-radio>
          <el-radio label="2">可用门店</el-radio>
        </el-radio-group>
        <!-- <span style="margin-left: 30px;color:grey;font-size: 12px;" v-if="mktactivForm.matype=='2'">注：赠送红包的使用门店设置，赠送项目/产品默认仅赠送门店使用</span> -->
      </el-form-item>
      <el-form-item label="活动门店" prop="shop" v-if="settingForm.useshopType==2&&settingForm.isOnline==1">
        <el-button type="primary" @click="selectShop()">选择门店</el-button>
        {{ settingForm.shoplist ? '共选中' + settingForm.shoplist.length + '家门店' : '' }}
      </el-form-item>
      <el-form-item label="有效期：" prop="timeType">
        <el-radio-group :disabled="!isCanEdit" v-model="settingForm.timeType" @change="changeTimeType">
          <el-radio :label="'1'">固定时间</el-radio>
          <el-date-picker
              v-model="settingForm.expiryDateRange" value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              :disabled="settingForm.timeType!='1' || !isCanEdit"
              style="width: 300px"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
          <br/>
          <el-radio :label="'2'" style="margin-top: 8px">按天设置</el-radio>
          <div>
            <el-tag type="info">领取</el-tag>
            <el-input type="number" :disabled="settingForm.timeType!='2'" style="width: 150px ; margin-left: 5px"
                      v-model="settingForm.afterDay"/>
            <el-tag style="margin-left: 3px" type="info">天后起用</el-tag>
            <label style="color:silver">（0表示当天起用）</label>
            <el-tag type="info">，有效期</el-tag>
            <el-input type="number" :disabled="settingForm.timeType!='2'" style="width: 150px ; margin-left: 5px"
                      v-model="settingForm.expiryDay" placeholder=">0的数"/>
            <el-tag type="info">天</el-tag>
          </div>
          <br/>
          <el-radio :label="'3'" style="margin-top: 8px">按月设置</el-radio>
          <div>
            <el-tag type="info">领取</el-tag>
            <el-input type="number" :disabled="settingForm.timeType!='3'" style="width: 150px ; margin-left: 5px"
                      v-model="settingForm.someDay" @input="onInputTitle()"/>
            <el-tag style="margin-left: 3px" type="info">天后起用</el-tag>
            <label style="color:silver">（0表示当天起用）</label>
            <el-tag type="info">，有效期</el-tag>
            <el-input type="number" :disabled="settingForm.timeType!='3'" style="width: 150px ; margin-left: 5px"
                      v-model="settingForm.someMoth" @input="onInputTitle()" placeholder=">0，=<36的数，"/>
            <el-tag type="info">月</el-tag>
            <br><label style="color:silver">说明:按月设置表示从领券启用之时开始的自然月份开始计算有效期数量。例如领券启用时间为2月8日，设置有效月为1月则</label>
            <br><label style="color:silver">券有效期为2月28日。如果设置有效月为2月，则券有效期从领券启用日期的当月开始延续到2个月，则券有效期为3月31日</label>
            <br><label style="color:silver"></label>
          </div>
          <br/>
          <el-radio :label="'0'" style="margin-top: 11px">不限期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="业绩补贴：" prop="yjSubsidy">
        <el-input type="number" min="0" max="100" v-model="settingForm.yjSubsidy" placeholder="0" style="width: 100px"
                  @input="onInputTitle()"/>
        %<br/>
        <label style="color:silver">说明:业绩补贴是指优惠券折扣的部分金额贾计算业绩，可输入0-100的整数，默认设置为0时表示抵扣部分不计业绩</label><br/>
        <label style="color:silver">设量大于0的比率，则抵扣部分按设置的比率计入服务业绩</label>
      </el-form-item>
      <el-form-item label="使用场景及规则：">
        <el-tag>线下门店使用</el-tag>
        <el-row>
          <el-checkbox label="消费金额满" v-model="settingForm.isSelectConConMoney" :disabled="!isCanEdit"></el-checkbox>
          <el-input type="number" v-model="settingForm.minMoney" style="width: 150px;margin-left: 8px"
                    :disabled="!isCanEdit"/>
          <el-tag type="info" style="margin-left: 8px">元可使用</el-tag>
        </el-row>
        <el-row>
          <el-checkbox label="消费项目可用" v-model="settingForm.isSelectProject" :disabled="!isCanEdit"
                       @change="clearProjectData(proAddDialog)"></el-checkbox>
          <label style="color:silver" v-if="settingForm.isSelectProject">说明：如果不选择则默认全部项目</label></el-row>
        <el-row v-if="settingForm.isSelectProject">
          <el-select placeholder="请选择" style="width: 100px;" v-model.trim="settingForm.type"
                     @change="selectType($event,settingForm.type)">
            <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in classifi"></el-option>
          </el-select>&nbsp;&nbsp;<el-button type="primary" @click="showProjectDialog(settingForm.type)"
                                             :disabled="!isCanEdit">添加
        </el-button>
        </el-row>
        <div style="height:220px;width: 100%;margin-top: 6px;background-color: azure"
             v-if="settingForm.isSelectProject && proAddDialog.selectProjectList.length > 0">
          <el-scrollbar style="height:100%;width: 100%">
            <ul style="width:100%;list-style: none;text-align:left; display: flex;flex-direction: row;flex-wrap: wrap">
              <li v-for="(item, index) in proAddDialog.selectProjectList" style="width: 25%">
                <el-row><i class="el-icon-circle-close" style="margin-right: 6px"
                           @click="deleteProject(index)"></i>({{ item.sdcode }}) {{ item.sdname }}
                </el-row>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <el-row>
          <el-checkbox label="购买产品可用" v-model="settingForm.isSelectGood" :disabled="!isCanEdit"
                       @change="clearGoodData(goodAddDialog)"></el-checkbox>
          <label style="color:silver" v-if="settingForm.isSelectGood">说明：如果不选择则默认全部产品</label></el-row>
        <el-row v-if="settingForm.isSelectGood">
          <el-button type="primary" @click="showGoodDialog()" :disabled="!isCanEdit">选择产品</el-button>
        </el-row>
        <div style="height:220px;width: 100%;margin-top: 6px;background-color: azure"
             v-if="settingForm.isSelectGood && goodAddDialog.selectProducts.length > 0">
          <el-scrollbar style="height:100%;width: 100%">
            <ul style="width:100%;list-style: none;text-align:left ;display: flex;flex-direction: row;flex-wrap: wrap">
              <li v-for="(item, index) in goodAddDialog.selectProducts" style="width: 25%">
                <el-row><i class="el-icon-circle-close" style="margin-right: 6px"
                           @click="deleteGood(index)"></i>({{ item.sdcode }}) {{ item.sdname }}
                </el-row>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <el-row>
          <el-checkbox label="购买套餐可用" v-model="settingForm.isSelectCombo" :disabled="!isCanEdit"
                       @change="clearComboData(comboAddDialog)"></el-checkbox>
          <label style="color:silver" v-if="settingForm.isSelectCombo">说明：如果不选择则默认全部套餐</label></el-row>
        <el-row v-if="settingForm.isSelectCombo">
          <el-button type="primary" @click="showComboDialog()" :disabled="!isCanEdit">选择套餐</el-button>
        </el-row>
        <div style="height:220px;width: 100%;margin-top: 6px;background-color: azure"
             v-if="settingForm.isSelectCombo && comboAddDialog.selectComboList.length > 0">
          <el-scrollbar style="height:100%;width: 100%">
            <ul style="width:100%;list-style: none;text-align:left ;display: flex;flex-direction: row;flex-wrap: wrap">
              <li v-for="(item, index) in comboAddDialog.selectComboList" style="width: 25%">
                <el-row><i class="el-icon-circle-close" style="margin-right: 6px" @click="deleteCombo(index)"></i>
                  {{ item.spname }}
                </el-row>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <el-row>
          <el-checkbox label="支持叠加使用" v-model="settingForm.isAdd" :disabled="isEditAdd"
                       @change="showEditAddNum"></el-checkbox>
          &nbsp;&nbsp;&nbsp;&nbsp;最多可叠加
          <el-input type="number" placeholder="0-100的整数" :min="0" :max="100" oninput="value=value.replace(/[^\d]/g,'')"
                    v-model.trim="settingForm.maxAddnum" style="width: 120px;" :disabled="isEditMaxAddNum"></el-input>
          张
        </el-row>
        <el-row>
          <el-checkbox label="不支持以下支付方式" v-model="settingForm.isNopaytype" :disabled="!isCanEdit"
                       @change="clearPaytypeData(paytypeAddDialog)"></el-checkbox>
        </el-row>
        <el-row v-if="settingForm.isNopaytype">
          <el-button type="primary" @click="showPaytypeDialog()" :disabled="!isCanEdit">选择支付方式</el-button>
        </el-row>
        <div style="height:220px;width: 100%;margin-top: 6px;background-color: azure"
             v-if="settingForm.isNopaytype && paytypeAddDialog.selectPaytypeList.length > 0">
          <el-scrollbar style="height:100%;width: 100%">
            <ul style="width:100%;list-style: none;text-align:left; display: flex;flex-direction: row;flex-wrap: wrap">
              <li v-for="(item, index) in paytypeAddDialog.selectPaytypeList" style="width: 25%">
                <el-row><i class="el-icon-circle-close" style="margin-right: 6px"
                           @click="deletePaytype(index)"></i>({{ item.paycode }}) {{ item.payname }}
                </el-row>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </el-form-item>
      <el-form-item label="优惠券说明：" prop="cpcode">
        <el-input v-model.trim="settingForm.introduction" placeholder="请填写优惠券说明" maxlength="300"
                  style="width: 320px;"></el-input>
      </el-form-item>
      <el-form-item label="其他描述：" prop="memo">
        <!-- <el-input  :disabled="!isCanEdit" v-model="settingForm.memo" placeholder="10字以内" style="width: 150px"/> -->
        <template>
          <vue-editor v-model="settingForm.memo" useCustomImageHandler @image-added="handleImageAdded"/>
        </template>
        <el-link type="primary" @click="clearMemo()">清空描述</el-link>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('1')" :disabled="!isCanEdit">保存并发布</el-button>
        <el-button type="primary" @click="save('0')" style="margin-left: 18px" :disabled="!isCanEdit">仅保存</el-button>
        <el-button @click="goBack('0')" style="margin-left: 18px">取消</el-button>
      </el-form-item>
    </el-form>


    <yid-dialog :title="proAddDialog.title" :visible.sync="proAddDialog.visible" width="700px">
      <el-form label-width="90px" ref="copyForm2">
        <el-form-item label="筛选：">
          <el-select clearable v-model="proAddDialog.branch"
                     @change="changeBranch(proAddDialog.branch,'1')" placeholder="选择部门" style="width: 140px;">
            <el-option v-for="item in proAddDialog.branchList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.bname"></el-option>
          </el-select>
          <el-select clearable v-model="proAddDialog.serviceType" placeholder="请选择分类"
                     style="margin-left: 5px; width: 140px;">
            <el-option
                v-for="item in proAddDialog.serviceTypes"
                :key="item.id"
                :label="item.sname"
                :value="item.id">
            </el-option>
          </el-select>
          <el-input clearable v-model="proAddDialog.sername" placeholder="项目名称/编码"
                    style="margin-left: 5px;width: 160px;"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%;" class="serve-table">
              <tr>
                <th width="20%">所属部门</th>
                <th width="25%">分类</th>
                <th width="55%">
                  <el-checkbox v-model="proAddDialog.checkbox" @change="checkAllProject"></el-checkbox>
                  (编号）项目名称
                </th>
              </tr>
              <tr :key="item.servid"
                  v-for="item in proAddDialog.serviceList"
                  v-if="screenService(item)">
                <td>{{ item.bname }}</td>
                <td>{{ item.typename }}</td>
                <td>
                  <el-checkbox v-model="item.isSelect" :label="item.servid"></el-checkbox>
                  ({{ item.sdcode }}){{ item.sdname }}
                </td>
              </tr>
            </table>
          </div>

        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addProject(1)">确认添加</el-button>
          <el-button type="primary" @click="closeProjectDialog()">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog :title="proAddDialog2.title" :visible.sync="proAddDialog2.visible" width="700px">
      <el-form label-width="90px" ref="copyForm2">
        <el-form-item label="筛选：">
          <el-select clearable v-model="proAddDialog2.branch"
                     @change="changeBranch(proAddDialog2.branch,'3')" placeholder="选择部门" style="width: 140px;">
            <el-option v-for="item in proAddDialog2.branchList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.bname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%;" class="serve-table">
              <tr>
                <th width="20%">所属部门</th>
                <th width="25%">
                  <el-checkbox v-model="proAddDialog2.checkbox" @change="checkAllProject2"></el-checkbox>
                  分类
                </th>
              </tr>
              <tr :key="item.id"
                  v-for="item in proAddDialog2.serviceTypes">
                <td>{{ item.branchName }}</td>
                <td>
                  <el-checkbox @change="selectOk($event,item)" v-model="item.isSelect" :value="item.id"></el-checkbox>
                  ({{ item.scode }}){{ item.sname }}
                </td>
              </tr>
            </table>
          </div>

        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addProject(2)">确认添加</el-button>
          <el-button type="primary" @click="closeProjectDialog()">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog :title="goodAddDialog.title" :visible.sync="goodAddDialog.visible" width="700px">
      <el-form label-width="90px">
        <el-form-item label="筛选：">
          <el-select clearable v-model="goodAddDialog.branch"
                     @change="changeBranch(goodAddDialog.branch,'2')" placeholder="所属部门" style="width: 140px;">
            <el-option v-for="item in goodAddDialog.branchList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.bname"></el-option>
          </el-select>
          <el-select clearable v-model="goodAddDialog.productType" placeholder="请选择分类"
                     style="margin-left: 5px; width: 140px;">
            <el-option
                v-for="item in goodAddDialog.productTypes"
                :key="item.id"
                :label="item.cname"
                :value="item.id">
            </el-option>
          </el-select>
          <el-input clearable v-model="goodAddDialog.goodname" placeholder="产品名称/编码"
                    style="margin-left: 5px;width: 160px;"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%" class="serve-table">
              <tr>
                <th width="20%">所属部门</th>
                <th width="25%">分类</th>
                <th width="55%">
                  <el-checkbox @change="checkAllGood" v-model="goodAddDialog.checkbox"></el-checkbox>
                  (编号）产品名称 规格
                </th>
              </tr>
              <tr :key="item.pid" v-for="item in goodAddDialog.products"
                  v-if="screenProduct(item)">
                <td>{{ item.bname }}</td>
                <td>{{ item.typename }}</td>
                <td>
                  <el-checkbox v-model="item.isSelect" :value="item.pid"></el-checkbox>
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

    <yid-dialog :title="comboAddDialog.title" :visible.sync="comboAddDialog.visible" width="700px">
      <el-form label-width="90px">
        <el-form-item label="套餐：">
          <el-input placeholder="套餐名称/编码" style="width: 200px" v-model="comboAddDialog.pcodename"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%" class="serve-table">
              <tr>
                <th width="25%">所属品牌</th>
                <th width="55%">
                  <el-checkbox @change="checkAllCombo" v-model="comboAddDialog.checkbox"></el-checkbox>
                  (编号）套餐名称
                </th>
              </tr>
              <tr :key="item.id" v-for="item in comboAddDialog.comboList"
                  v-if="screenCombo(item)">
                <td>{{ item.brandname }}</td>
                <td>
                  <el-checkbox v-model="item.isSelect" :value="item.id"></el-checkbox>
                  {{ item.spname }}
                </td>
              </tr>
            </table>
          </div>

        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addCombo()">确认添加</el-button>
          <el-button type="primary" @click="closeComboDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>


    <!-- 选择门店弹窗 -->
    <yid-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="shopDialog.visible=false"
                width="1200px">
      <el-row type="flex" justify="space-between">
        <el-form inline>
          <el-form-item label="门店：">
            <el-input clearable v-model="shopDialog.shop" placeholder="门店名称/编码" style="width: 160px;"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select clearable v-model="shopDialog.type">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
              <el-option label="综合" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select ref="selectRegionRef" @clear="clearSelectRegion" clearable v-model="shopDialog.region.name"
                       style="width: 200px;">
              <el-option hidden :value="shopDialog.region.id" style="height: auto"></el-option>
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
          <yid-table pagination ref="tableShop" style="margin-top: 10px;" :data="shopData"
                     @selection-change="handleSelectionChangeShop">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
            <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="门店品牌" min-width="60" prop="brandName"></yid-table-column>
            <yid-table-column label="门店区域" min-width="120" prop="regionName"></yid-table-column>
            <yid-table-column label="业务类型" min-width="80" prop="type">
              <template slot-scope="scope">
                {{ scope.row.type | formatValue(types) }}
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop" type="primary" size="mini"><i class="el-icon-right"></i></el-button>
          </div>
        </el-col>
        <el-col :span="8" style="margin-left: 5px;">
          <el-link type="primary" @click="deleteBatch()">批量删除</el-link>
          <yid-table ref="table2" style="margin-top: 10px;" :data="shopDialog.shoplist"
                     @selection-change="handleSelectionData">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
            <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteShop(scope.row,shopDialog.name)">
                  删除
                </el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px;">
        <el-col :span="2" :offset="10" v-if="type=='1'">
          <el-button type="primary" @click="setShops()">选好了</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible=false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog :title="paytypeAddDialog.title" :visible.sync="paytypeAddDialog.visible" width="700px">

      <el-form label-width="90px" ref="copyForm2">
        <el-form-item label="筛选：">
          <el-select clearable v-model="paytypeAddDialog.payMold" placeholder="请选择分类"
                     style="margin-left: 5px; width: 140px;">
            <el-option
                v-for="item in paytypeAddDialog.payMolds"
                :key="item.id"
                :label="item.ptname"
                :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" @click="addpaytype()" style="margin-left: 10px;">确认添加</el-button>
          <el-button type="primary" @click="closePaytypeDialog">取消</el-button>
        </el-form-item>
        <el-form-item label="">
          <div class="selected">
            <table border="1" style="width: 100%;" class="serve-table">
              <tr>
                <th width="30%">
                  <el-checkbox v-model="paytypeAddDialog.checkbox" @change="checkAllPaytype"></el-checkbox>
                  编码
                </th>
                <th width="50%">付款方式名称</th>
                <th width="20%">类型</th>
              </tr>
              <tr :key="item.id"
                  v-for="item in paytypeAddDialog.paytypes"
                  v-if="screenPaytype(item)">
                <td>
                  <el-checkbox v-model="item.isSelect" :value="item.id"></el-checkbox>
                  {{ item.paycode }}
                </td>
                <td>{{ item.payname }}</td>
                <td>{{ item.ptname }}</td>
              </tr>
            </table>
          </div>

        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
//import { VueEditor } from "vue2-editor";

export default {
  name: "editCoupon",
  //components: {VueEditor },
  data() {
    return {
      type: '',
      isCanEdit: false,
      isEditMaxAddNum: true,
      isEditAdd: false,
      isNewAdd: true,
      originData: null,
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
      settingForm: {
        cpcode: "",
        brandId: "",
        brandCode: "",
        brandName: "",
        cpname: "",
        couponType: "",
        isOnline: "0",
        useshopType: "2",
        discount: "",
        timeType: "",
        expiryDateRange: [],
        afterDay: "",
        expiryDay: "",
        conConmoney: "",
        minMoney: null,
        isSelectProject: false,
        isSelectGood: false,
        isSelectCombo: false,
        isSelectConConMoney: false,
        shoplist: [],
        memo: '',
        introduction: '',
        maxMoney: '',
        isAdd: '',
        maxAddnum: '',
        isNopaytype: '',
        forService: '',
        zeroTitle: '标题',
        yjSubsidy: 0,
        someDay: '',
        someMoth: '',
        type: "1"
      },
      forService: '',
      settingFormRules: {
        brandId: [{required: true, message: '请选择门店品牌'}],
        cpname: [{required: true, message: '请填写优惠券名称'}, {min: 0, max: 10, message: '红包名称在10个字符以内'}],
        // money:[{required: true, message:'请输入红包价值'}],
        timeType: [{required: true, message: '请选择红包有效期类型'}],
        couponType: [{required: true, message: '请选择优惠券形式'}],
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
      paytypeAddDialog: {
        title: '选择支付方式',
        visible: false,
        payMold: '',
        payMolds: [],
        checkbox: false,
        paytypes: [],
        selectPaytypeList: []
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
        pcodename: "",
        comboList: [],
        selectComboList: []
      },
      branchList: [],
      brandList: [],
      serviceAllType: [],
      serviceList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      classifi: [{name: '按项目', value: '1'}, {name: '按分类', value: '2'}],
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
        if (this.proAddDialog.sername) {
          if (item.sdname.indexOf(this.proAddDialog.sername) !== -1 ||
              item.sdcode.indexOf(this.proAddDialog.sername) !== -1) {
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
    screenPaytype() {
      return function (item) {
        let flag = true
        if (this.paytypeAddDialog.payMold) {
          if (this.paytypeAddDialog.payMold == item.ptid) {
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
        if (this.goodAddDialog.goodname) {
          if (item.sdname.indexOf(this.goodAddDialog.goodname) !== -1 ||
              item.sdcode.indexOf(this.goodAddDialog.goodname) !== -1) {
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
          return flag;
        }
        if (this.comboAddDialog.pcodename == item.spcode || item.spname.indexOf(this.comboAddDialog.pcodename) != -1) {
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
    onInputTitle() {
      this.$forceUpdate();
    },
    changService(e) {
      this.settingForm.forService = e
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("file", file); //第一个file 后台接收的参数名
      service.chain.coupon.upImage(formData).then(result => {
        console.log('result', result);
        let url = result.data.url; // 返回给你的图片路径
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
      })
          .catch(err => {
            console.log(err);
          });
    },
    clearMemo() {
      this.settingForm.memo = "";
    },
    async initData(data) {
      this.restSetting();
      await this.init();
      if (data == null) {
        this.isNewAdd = true;
        this.isCanEdit = true;
        this.isEditMaxAddNum = true;
        this.isEditAdd = false;
        this.forService = '';
      } else {
        let that = this;
        this.isNewAdd = false;
        this.isCanEdit = data.status == "0" || data.status == "1" || data.status == "2"   //只有未发布的可以编辑
        this.isEditMaxAddNum = data.isAdd != "1"
        this.isEditAdd = data.couponType == "2"
        this.originData = Object.assign(data);
        await this.getComboList({brand: data.brandId})
        //填充数据

        this.settingForm.brandId = data.brandId + ""
        this.settingForm.brandName = data.brandName;
        this.settingForm.brandCode = data.brandCode
        this.settingForm.cpname = data.cpname
        this.settingForm.cpcode = data.cpcode
        this.settingForm.couponType = data.couponType * 1
        this.settingForm.discount = data.discount
        this.settingForm.timeType = data.timeType
        this.settingForm.isOnline = data.isOnline
        this.settingForm.useshopType = data.useshopType
        this.settingForm.shoplist = data.shoplist
        this.settingForm.memo = data.memo
        this.settingForm.introduction = data.introduction
        this.settingForm.maxMoney = data.maxMoney
        this.settingForm.forService = data.forService
        this.forService = parseInt(data.forService);
        //你这一步拿到的 data.zeroTitle是null  所以出现无法修改的问题  你找一下原因
        this.settingForm.zeroTitle = data.zeroTitle
        this.settingForm.yjSubsidy = data.yjSubsidy
        let isAdd = data.isAdd == '1' ? true : false;
        this.settingForm.isAdd = isAdd;
        let isNopaytype = data.isNopaytype == '1' ? true : false;
        this.settingForm.isNopaytype = isNopaytype;
        this.settingForm.maxAddnum = data.maxAddnum;
        if (this.settingForm.timeType == "1") {
          this.settingForm.expiryDateRange.push(data.sdate)
          this.settingForm.expiryDateRange.push(data.edate)
        } else if (this.settingForm.timeType == "2") {
          this.settingForm.afterDay = data.afterDay
          this.settingForm.expiryDay = data.expiryDay
        } else if (this.settingForm.timeType == "3") {
          this.settingForm.someDay = data.afterDay
          this.settingForm.someMoth = data.expiryDay
        }
        this.settingForm.isSelectConConMoney = data.conConmoney == "1"
        if (this.settingForm.isSelectConConMoney) {
          this.settingForm.minMoney = data.minMoney
        }

        this.settingForm.isSelectProject = data.conIsserv != "1"
        if (data.conIsserv == "3") {
          data.serList.forEach(item => {
            that.proAddDialog.selectProjectList.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              servid: item.servid,
              serType: item.serType,
            });
          })
        }
        if (that.proAddDialog.selectProjectList.length > 0) {
          that.proAddDialog.selectProjectList.forEach(e => {
            this.settingForm.type = e.serType.toString();
          });
        }
        this.settingForm.isSelectGood = data.conIsproduct != "1"
        if (data.conIsproduct == "3") {
          data.proList.forEach(item => {
            this.goodAddDialog.selectProducts.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              pid: item.pid,
            })
          })
        }
        this.settingForm.isSelectCombo = data.conIspackage != "1"
        if (data.conIspackage == "3") {
          data.packageList.forEach(item => {
            that.comboAddDialog.selectComboList.push({
              id: item.id,
              spcode: item.spcode,
              spname: item.spname
            });
          })
        }
        if (!yid.util.isEmpty(data.nopaytypes)) {
          data.nopaytypes.forEach(item => {
            that.paytypeAddDialog.selectPaytypeList.push({
              payid: item.payid,
              paycode: item.paycode,
              payname: item.payname,
            });
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
      this.shopDialog.name = this.settingForm.name;
      this.shopDialog.shoplist = this.settingForm.shoplist
      this.shopDialog.brand = this.settingForm.brandId;
    },
    //查询门店
    queryShop() {
      if (this.shopDialog.region && this.shopDialog.region.id) {
        //大区及以内区域都保存进去
        this.shopDialog.region.childrenIds.push(this.shopDialog.region.id)
        this.shopDialog.regionIds = this.shopDialog.region.childrenIds.toString();
      } else {
        this.shopDialog.regionIds = ""
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
        status: "1",
      }
      this.$refs['tableShop'].reloadData({
        fetch,
        params,
      });
    },
    // 添加门店
    addShop() {
      if (this.selectShops.length == 0) {
        yid.util.error("请先选择门店")
        return;
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
            this.shopDialog.shoplist.push({shopid: m.id, shopcode: m.shopcode, shopname: m.shopname})
          }
        } else {
          this.shopDialog.shoplist.push({shopid: m.id, shopcode: m.shopcode, shopname: m.shopname})
        }
      })
    },
    handleSelectionChangeShop(rows) {
      this.selectShops = rows;
    },
    //删除门店
    deleteShop(row, name) {
      yid.util.confirm('删除【' + row.shopname + '】后，在本店将不能使用，确定要删除吗？', '', '', () => {
        let i = -1;
        this.shopDialog.shoplist.forEach((p, index) => {
          if (p.shopid == row.shopid) {
            i = index
          }
        })
        this.shopDialog.shoplist.splice(i, 1)
      })
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
        pcodename: "",
        comboList: [],
        selectComboList: []
      }
      this.paytypeAddDialog = {
        title: '选择支付方式',
        visible: false,
        payMold: '',
        payMolds: [],
        checkbox: false,
        paytypes: [],
        selectPaytypeList: []
      }
      this.settingForm = {
        cpcode: "",
        brandId: "",
        brandCode: "",
        brandName: "",
        cpname: "",
        couponType: "",
        isOnline: "0",
        useshopType: "2",
        shoplist: [],
        memo: '',
        introduction: '',
        maxMoney: '',
        isAdd: '',
        maxAddnum: '',
        discount: "",
        timeType: "",
        expiryDateRange: [],
        afterDay: "",
        expiryDay: "",
        conConmoney: "",
        isNopaytype: "",
        minMoney: null,
        isSelectProject: false,
        isSelectGood: false,
        isSelectCombo: false,
        isSelectConConMoney: false
      }
      if (this.$refs['settingForm'] != null) {
        this.$refs['settingForm'].resetFields()
      }
    },
    async init() {
      await this.getBrandList();
      await this.getBranchList();
      await this.getServiceTypeList();
      await this.getServiceList();
      await this.getGoodList();
      await this.getGoodTypeList();
      await this.getPaysMolds();
      /*service.chain.servShop.findregions({status:'1',parentId:'-1'}).then(res => {
          this.regions = res.data
      });*/
      service.chain.region.treeAll({status: '1'}).then(res => {
        this.regions = res.data
      });
      service.chain.payTypeInfo.getPayInfoList({enable: '1'}).then(res => {
        if (res && res.data.length > 0) {
          res.data.forEach(item => {
            this.paytypeAddDialog.paytypes.push({...item, isSelect: false})
          })
        } else {
          this.proAddDialog.paytypes = []
        }
      });
    },
    changeCouponType() {
      this.settingForm.discount = ""
      if (this.settingForm.couponType == "2") {
        this.settingForm.isAdd = "";
        this.settingForm.maxAddnum = "0";
        this.isEditAdd = true
        this.isEditMaxAddNum = true
      } else {
        this.settingForm.isNopaytype = "";
        this.settingForm.isAdd = "";
        this.settingForm.maxAddnum = "0";
        this.isEditAdd = false
      }
    },
    changeTimeType(type) {
      this.settingForm.expiryDateRange = []
      this.settingForm.afterDay = ""
      this.settingForm.expiryDay = ""
    },
    async changeBrand(id) {
      if (id) {
        await this.getComboList({brand: id})
      }
      this.brandList.forEach((item) => {
        if (id == item.id) {
          this.settingForm.brandCode = item.code
          this.settingForm.brandName = item.name
        }
      })
    },
    showProjectDialog(tag) {
      if (tag == "1") {
        this.proAddDialog.branch = '';
        this.proAddDialog.serviceType = '';
        this.proAddDialog.serviceTypes = [];
        this.proAddDialog.checkbox = false;
        this.proAddDialog.serviceList.forEach(item => {
          item.isSelect = false;
          this.proAddDialog.selectProjectList.forEach(serv => {
            if (serv.servid == item.servid) {
              item.isSelect = true;
            }
          })
        })
        this.proAddDialog.visible = true
      } else {
        if (this.proAddDialog.selectProjectList.length > 0) {
          this.proAddDialog.selectProjectList.forEach(item => {
            if (item.serType == 2) {
              this.proAddDialog2.selectProjectList = this.proAddDialog.selectProjectList
            }
          })
        }
        this.proAddDialog2.branch = '';
        this.proAddDialog2.serviceType = '';
        this.proAddDialog2.checkbox = false;
        this.proAddDialog2.visible = true
        this.proAddDialog2.serviceTypes.forEach(item => {
          item.isSelect = false;
          this.proAddDialog2.selectProjectList.forEach(serv => {
            if (serv.servid == item.id) {
              item.isSelect = true;
            }
          })
        })
      }
    },
    selectOk(e, val) {
      if (val.isSelect) {
        val.isSelect = true;
      } else {
        val.isSelect = false;
      }
      this.$forceUpdate();
    },
    showPaytypeDialog() {
      this.paytypeAddDialog.payMold = '';
      this.paytypeAddDialog.checkbox = false;
      this.paytypeAddDialog.paytypes.forEach(item => {
        item.isSelect = false;
        this.paytypeAddDialog.selectPaytypeList.forEach(pay => {
          if (pay.paycode == item.paycode) {
            item.isSelect = true;
          }
        })
      })
      this.paytypeAddDialog.visible = true
    },
    closeProjectDialog() {
      this.proAddDialog.visible = false
      this.proAddDialog2.visible = false
    },
    closePaytypeDialog() {
      this.paytypeAddDialog.visible = false;
    },
    addProject(tag) {
      if (tag == 1) {
        const that = this;
        if (that.proAddDialog.selectProjectList.length > 0) {
          that.proAddDialog.selectProjectList.forEach(item => {
            if (item.serType == 2) {
              that.proAddDialog.selectProjectList = [];
            }
          })
        }
        this.proAddDialog.serviceList.forEach(item => {
          if (item.isSelect && (that.proAddDialog.selectProjectList.length == 0 || that.proAddDialog.selectProjectList.findIndex(list => item.servid == list.servid) == -1)) {
            that.proAddDialog.selectProjectList.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              servid: item.servid,
              serType: tag,
            });
          }
        })
        this.closeProjectDialog();
      } else {
        const that = this;
        if (that.proAddDialog.selectProjectList.length > 0) {
          that.proAddDialog.selectProjectList.forEach(item => {
            if (item.serType == 1) {
              that.proAddDialog.selectProjectList = [];
            }
          })
        }
        this.proAddDialog2.serviceTypes.forEach(item => {
          if (item.isSelect && (that.proAddDialog2.selectProjectList.length == 0 || that.proAddDialog2.selectProjectList.findIndex(list => item.id == list.servid) == -1)) {
            that.proAddDialog2.selectProjectList.push({
              sdcode: item.scode,
              sdname: item.sname,
              servid: item.id,
              serType: tag,
            });
          }
        })
        that.proAddDialog.selectProjectList = that.proAddDialog2.selectProjectList
        this.proAddDialog2.visible = false
      }
    },
    selectType(e, val) {
      this.$forceUpdate();
    },
    addpaytype() {
      const that = this;
      this.paytypeAddDialog.paytypes.forEach(item => {
        if (item.isSelect && (that.paytypeAddDialog.selectPaytypeList.length == 0 || that.paytypeAddDialog.selectPaytypeList.findIndex(list => item.id == list.id) == -1)) {
          that.paytypeAddDialog.selectPaytypeList.push({
            paycode: item.paycode,
            payname: item.payname,
            payid: item.id,
          });
        }
      })
      this.closePaytypeDialog();
    },
    deleteProject(index) {
      if (!this.isCanEdit) {
        return
      }
      this.proAddDialog.selectProjectList.splice(index, 1)
    },
    deletePaytype(index) {
      if (!this.isCanEdit) {
        return
      }
      this.paytypeAddDialog.selectPaytypeList.splice(index, 1)
    },
    checkAllProject(val) {
      this.proAddDialog.serviceList.forEach(item => {
        if (!this.proAddDialog.branch) {
          item.isSelect = val;
        } else if (this.proAddDialog.branch == item.branch) {
          item.isSelect = val;
        }
      })
    },
    checkAllProject2(val) {
      this.proAddDialog2.serviceTypes.forEach(item => {
        if (!this.proAddDialog2.branch) {
          item.isSelect = val;
        } else if (this.proAddDialog2.branch == item.branch.toString()) {
          item.isSelect = val;
        }
      })
    },

    checkAllPaytype(val) {
      this.paytypeAddDialog.paytypes.forEach(item => {
        if (!this.paytypeAddDialog.payMold) {
          item.isSelect = val;
        } else if (this.paytypeAddDialog.payMold == item.id) {
          item.isSelect = val;
        }
      })
    },
    changeBranch(id, type) {
      if (type == '1') {
        this.proAddDialog.serviceType = '';
        this.proAddDialog.serviceTypes = [];
        this.serviceAllType.forEach(item => {
          if (id == item.branch) {
            this.proAddDialog.serviceTypes.push(item);
          }
        })
      }
      if (type == '2') {
        this.goodAddDialog.productType = '';
        this.goodAddDialog.productTypes = [];
        this.productAllType.forEach(item => {
          if (id == String(item.bbid)) {
            this.goodAddDialog.productTypes.push(item);
          }
        })
      }
      if (type == '3') {
        this.proAddDialog2.serviceType = '';
        this.proAddDialog2.serviceTypes = [];
        this.serviceAllType.forEach(item => {
          if (id == item.branch.toString()) {
            this.proAddDialog2.serviceTypes.push(item);
          }
        })
      }
    },
    showGoodDialog() {
      this.goodAddDialog.branch = '';
      this.goodAddDialog.productType = '';
      this.goodAddDialog.productTypes = [];
      this.goodAddDialog.checkbox = false;
      this.goodAddDialog.products.forEach(item => {
        item.isSelect = false;
        this.goodAddDialog.selectProducts.forEach(serv => {
          if (serv.pid == item.pid) {
            item.isSelect = true;
          }
        })
      })
      this.goodAddDialog.visible = true
    },
    closeGoodDialog() {
      this.goodAddDialog.visible = false;
    },
    addGood() {
      const that = this;
      //that.goodAddDialog.selectProducts = []
      this.goodAddDialog.products.forEach(item => {
        if (item.isSelect && (that.goodAddDialog.selectProducts.length == 0 || that.goodAddDialog.selectProducts.findIndex(list => item.pid == list.pid) == -1)) {
          that.goodAddDialog.selectProducts.push({
            sdcode: item.sdcode,
            sdname: item.sdname,
            pid: item.pid,
          });
        }
      })
      this.closeGoodDialog();
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
          item.isSelect = val;
        } else if (this.goodAddDialog.branch == item.branch) {
          item.isSelect = val;
        }
      })
    },
    showComboDialog() {
      if (!this.settingForm.brandId) {
        $yid.util.warning("请选择品牌");
        return
      }
      this.comboAddDialog.pcodename = '';
      this.comboAddDialog.checkbox = false;
      this.comboAddDialog.comboList.forEach(item => {
        item.isSelect = false;
        this.comboAddDialog.selectComboList.forEach(sitem => {
          if (sitem.id == item.id) {
            item.isSelect = true;
          }
        })
      })
      this.comboAddDialog.visible = true;
    },
    closeComboDialog() {
      this.comboAddDialog.visible = false;
    },
    checkAllCombo(val) {
      this.comboAddDialog.comboList.forEach(item => {
        if (!this.comboAddDialog.pcodename) {
          item.isSelect = val;
        } else if (this.comboAddDialog.pcodename == item.spcode || item.spname.indexOf(this.comboAddDialog.pcodename) != -1) {
          item.isSelect = val;
        }
      })
    },
    addCombo() {
      const that = this;
      //that.comboAddDialog.selectComboList = []
      this.comboAddDialog.comboList.forEach(item => {
        if (item.isSelect && (that.comboAddDialog.selectComboList.length == 0 || that.comboAddDialog.selectComboList.findIndex(list => item.id == list.id) == -1)) {
          that.comboAddDialog.selectComboList.push({
            id: item.id,
            spcode: item.spcode,
            spname: item.spname
          });
        }
      })
      this.closeComboDialog();
    },
    deleteCombo(index) {
      if (!this.isCanEdit) {
        return
      }
      this.comboAddDialog.selectComboList.splice(index, 1)
    },
    save(status) {
      console.log('return save', this.settingForm)
      if (status == "1") {
        yid.util.confirm('保存发布后，优惠券将不能再次编辑！', '', '', () => {
          this.toSave(status)
        });
      } else {
        this.toSave(status)
      }
    },
    toSave(status) {
      this.$refs["settingForm"].validate(valid => {
        if (!valid) {
          return
        }
        if (!this.settingForm.isSelectProject && !this.settingForm.isSelectGood && !this.settingForm.isSelectCombo) {
          $yid.util.warning("至少勾选项目、卖品、套餐中的一种！");
          return
        }
        let reqParam = {}
        if (!this.isNewAdd) {
          reqParam.id = this.originData.id;
        }
        reqParam.status = status
        reqParam.cpcode = this.settingForm.cpcode
        reqParam.brandId = this.settingForm.brandId
        reqParam.brandCode = this.settingForm.brandCode
        reqParam.brandName = this.settingForm.brandName
        reqParam.cpname = this.settingForm.cpname
        reqParam.couponType = this.settingForm.couponType
        reqParam.isOnline = this.settingForm.isOnline
        reqParam.useshopType = this.settingForm.useshopType
        reqParam.shoplist = this.settingForm.shoplist
        reqParam.memo = this.settingForm.memo
        reqParam.introduction = this.settingForm.introduction
        reqParam.forService = this.settingForm.forService
        if (!this.settingForm.yjSubsidy) {
          this.settingForm.yjSubsidy = 0;
        }
        reqParam.yjSubsidy = this.settingForm.yjSubsidy
        if (this.settingForm.maxMoney) {
          reqParam.maxMoney = this.settingForm.maxMoney
        }
        if (reqParam.couponType == "1") {
          if (!this.settingForm.discount || parseInt(this.settingForm.discount) <= 0) {
            $yid.util.warning("定额要大于0");
            return
          }
        } else if (reqParam.couponType == "2") {
          console.log(this.settingForm.discount);
          if (this.settingForm.discount.toString()) {
            if (parseInt(this.settingForm.discount) < 0 || parseInt(this.settingForm.discount) > 10) {
              $yid.util.warning("优惠券形式请输入0-10之间的折扣");
              return
            }
          }
          if (!this.settingForm.discount.toString()) {
            $yid.util.warning("优惠券形式请输入0-10之间的折扣");
            return
          }
          this.settingForm.discount = this.settingForm.discount.toString()
          // return  alert(typeof(this.settingForm.discount) )
          if (this.settingForm.discount.indexOf(".") != -1 && this.settingForm.discount.split(".")[1].length > 1) {
            $yid.util.warning("只能有一位小数的数字");
            return
          }
          if (this.settingForm.zeroTitle && this.settingForm.zeroTitle.length > 5) {
            $yid.util.warning("折扣标题不能超过5个字");
            return
          }
          reqParam.zeroTitle = this.settingForm.zeroTitle;
          console.log(this.settingForm.forService);
          if (this.settingForm.forService == undefined) {
            $yid.util.warning("请勾选针对单个项目还是多个项目");
            return
          }
        }
        reqParam.discount = this.settingForm.discount
        reqParam.timeType = this.settingForm.timeType;
        if (reqParam.timeType == "1") {
          if (!this.settingForm.expiryDateRange || this.settingForm.expiryDateRange.length < 2) {
            $yid.util.warning("请选择固定时间范围");
            return
          }
          reqParam.sdate = this.settingForm.expiryDateRange[0]
          reqParam.edate = this.settingForm.expiryDateRange[1]
        } else if (reqParam.timeType == "2") {
          reqParam.afterDay = this.settingForm.afterDay ? this.settingForm.afterDay : 0;
          if (parseInt(reqParam.afterDay) < 0) {
            $yid.util.warning("领取天数不能为负数");
            return
          }
          if (!this.settingForm.expiryDay || parseInt(this.settingForm.expiryDay) <= 0) {
            $yid.util.warning("领取有效期要大于0");
            return
          }
          reqParam.expiryDay = this.settingForm.expiryDay
        } else if (reqParam.timeType == "3") {
          reqParam.afterDay = this.settingForm.someDay ? this.settingForm.someDay : 0;
          if (parseInt(reqParam.afterDay) < 0) {
            $yid.util.warning("领取天数不能为负数");
            return
          }
          if (!this.settingForm.someMoth || parseInt(this.settingForm.someMoth) <= 0 || parseInt(this.settingForm.someMoth) > 36) {
            $yid.util.warning("领取有效期要大于1个月小于36个月");
            return
          }
          reqParam.expiryDay = this.settingForm.someMoth
        }
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(reqParam.yjSubsidy)) {
          yid.util.warning("业绩补贴请输入0到100整数!");
          return;
        }
        if (reqParam.yjSubsidy < 0 || reqParam.yjSubsidy > 100) {
          yid.util.warning("业绩补贴请输入0到100整数!");
          return;
        }
        reqParam.conConmoney = this.settingForm.isSelectConConMoney ? "1" : "2";
        if (this.settingForm.isSelectConConMoney) {
          if (!this.settingForm.minMoney || parseInt(this.settingForm.minMoney) <= 0) {
            $yid.util.warning("请输入满减金额");
            return
          }
          reqParam.minMoney = this.settingForm.minMoney;
        }

        reqParam.conIsserv = this.settingForm.isSelectProject ? "2" : "1";
        if (this.settingForm.isSelectProject) {
          if (this.proAddDialog.selectProjectList.length > 0) {
            reqParam.conIsserv = "3"
            reqParam.serList = this.proAddDialog.selectProjectList;
          }
        }

        reqParam.conIsproduct = this.settingForm.isSelectGood ? "2" : "1";
        if (this.settingForm.isSelectGood) {
          if (this.goodAddDialog.selectProducts.length > 0) {
            reqParam.conIsproduct = "3"
            reqParam.proList = this.goodAddDialog.selectProducts;
          }
        }

        reqParam.conIspackage = this.settingForm.isSelectCombo ? "2" : "1";
        if (this.settingForm.isSelectCombo) {
          if (this.comboAddDialog.selectComboList.length > 0) {
            reqParam.conIspackage = "3"
            reqParam.packageList = this.comboAddDialog.selectComboList;
          }
        }
        if (yid.util.isEmpty(this.settingForm.isAdd)) {
          reqParam.isAdd = '0'
        } else {
          reqParam.isAdd = '1'
          if (yid.util.isEmpty(this.settingForm.maxAddnum)) {
            yid.util.error("勾选支持叠加使用后必填最大可叠加次数!");
            return false;
          }
        }

        if (Number(this.settingForm.maxAddnum) < 0 || Number(this.settingForm.maxAddnum) > 100) {
          yid.util.error("最大可叠加次数必须填入0-100整数!");
          return false;
        }

        reqParam.maxAddnum = this.settingForm.maxAddnum;

        if (yid.util.isEmpty(this.settingForm.isNopaytype)) {
          reqParam.isNopaytype = '0'
        } else {
          reqParam.isNopaytype = '1'
        }
        if (this.settingForm.isNopaytype) {
          if (this.paytypeAddDialog.selectPaytypeList.length > 0) {
            reqParam.nopaytypes = this.paytypeAddDialog.selectPaytypeList;
          }
        }

        service.chain.coupon.add(reqParam).then(res => {
          if (res.resp_code == 200) {
            this.goBack()
          } else {
            yid.util.error("保存失败");
          }
        });
      });
    },
    goBack(data) {
      this.$emit('onClose', data);
    },
    async getBranchList() {
      await service.serviceInfo.findbranch({status: '1'}).then(res => {
        this.branchList = res.data
        this.proAddDialog.branchList = res.data
        this.proAddDialog2.branchList = res.data
        this.goodAddDialog.branchList = res.data
      });
    },
    async getBrandList() {
      await service.chain.brand.brandList({isDel: '0'}).then(res => {
        if (res.resp_code == 200) {
          this.brandList = res.data;
        }
      })
    },
    async getServiceTypeList() {
      await service.serviceInfo.findServiceType({status: '1'}).then(res => {
        this.serviceAllType = res.data;
        this.serviceAllType.forEach(item => {
          if (item.branch == 1) {
            item.branchName = "美发组"
            this.proAddDialog2.serviceTypes.push(item);
          }
          if (item.branch == 2) {
            item.branchName = "美容组"
            this.proAddDialog2.serviceTypes.push(item);
          }
          if (item.branch == 3) {
            item.branchName = "综合组"
            this.proAddDialog2.serviceTypes.push(item);
          }
        })
      })
    },
    async getGoodTypeList() {
      await service.serviceInfo.findProductType({status: '1'}).then(res => {
        this.productAllType = res.data;
      })
    },
    async getPaysMolds() {
      await service.pay.queryPaysMolds().then(res => {
        this.paytypeAddDialog.payMolds = res.data;
      });
    },
    async getServiceList() {
      await service.chain.servicepackage.servinfo({status: '1'}).then(res => {
        if (res && res.data.length > 0) {
          res.data.forEach(item => {
            this.proAddDialog.serviceList.push({...item, isSelect: false})
          })
        } else {
          this.serviceList = []
          this.proAddDialog.serviceList = []
        }
      });
    },
    async getGoodList() {
      await service.chain.servicepackage.productlist({status: '1'}).then(res => {
        if (res && res.data.length > 0) {
          res.data.forEach(item => {
            this.goodAddDialog.products.push({
              ...item, isSelect: false
            });
          })
        } else {
          this.goodAddDialog.products = []
        }
      });
    },
    async getComboList(params) {
      await service.chain.servicepackage.findAll({isDel: '0', ...params}).then(res => {
        if (res && res.data.length > 0) {
          res.data.forEach(item => {
            this.comboAddDialog.comboList.push({
              ...item, isSelect: false
            });
          })

        } else {
          this.comboAddDialog.comboList = [];
        }
      });
    },
    clearProjectData(data) {
      this.settingForm.type = '1';
      data.selectProjectList = [];
    },
    clearPaytypeData(data) {
      data.selectPaytypeList = [];
    },
    clearGoodData(data) {
      data.selectProducts = [];
    },
    clearComboData(data) {
      data.selectComboList = [];
    },
    clearSelectRegion() {
      this.shopDialog.region = {};
      this.$refs.templateRegionTree.setCheckedKeys([]);
    },
    handleNodeClick(data, checked, node) {
      if (checked == true) {
        let id = data.id;
        let valueObj = {};
        valueObj.id = id;
        valueObj.name = data.name;
        this.shopDialog.region = valueObj
        this.shopDialog.region.childrenIds = []
        this.getSelectAllRegion(data, this.shopDialog.region.childrenIds)
        this.$refs.templateRegionTree.setCheckedKeys([id]);
      } else {
        if (this.shopDialog.region.id == data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id]);
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
    showEditAddNum() {
      if (this.settingForm.isAdd) {
        this.isEditMaxAddNum = false;
      } else {
        this.settingForm.maxAddnum = "";
        this.isEditMaxAddNum = true;
      }
    },

    handleSelectionData(rows) {
      this.selectShopData = rows;
    },
    //批量删除
    deleteBatch() {
      if (this.selectShopData.length == 0) {
        yid.util.warning("请勾选删除的门店");
        return;
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

.titleys {
  /deep/ .el-form-item__label {
    text-align: left !important;
    width: auto !important;
  }

  /deep/ .el-form-item__content {
    margin-left: auto !important;
  }
}

.zeroTitle {
  /deep/ & > .el-form-item__label {
    width: auto !important;
  }

  /deep/ & > .el-form-item__content {
    margin-left: 0 !important
  }
}
</style>
