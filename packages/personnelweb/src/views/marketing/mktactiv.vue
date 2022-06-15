<template>
  <div>
    <el-collapse-transition>
      <div v-show="showList">
        <div>
          <el-button type="primary" @click="showAdd">新增活动</el-button>
        </div>
        <el-form :model="searchForm" inline style="margin-top: 15px">
          <el-form-item label="活动：">
            <el-input
              clearable
              placeholder="活动名称/编码"
              v-model.trim="searchForm.name"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="活动类型">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 140px"
              v-model.trim="searchForm.matype">
              <el-option
                :key="'matype' + item.value"
                :label="item.name"
                :value="item.value"
                v-for="item in matypes"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动状态">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 130px"
              v-model.trim="searchForm.status">
              <el-option
                :key="'mastatus' + item.value"
                :label="item.name"
                :value="item.value"
                v-for="item in mastatuss"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店品牌">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              style="width: 160px"
              @change="filterBrand(searchForm.brandId)"
              v-model.trim="searchForm.brandId">
              <el-option
                :key="'brand' + item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in brands"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店：">
            <el-select
              @clear="clearFormShop"
              @blur="clearFormShop"
              clearable
              v-model.trim="searchForm.shop"
              filterable
              :filter-method="filterShop"
              placeholder="门店名称/编码"
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
          <el-form-item>
            <el-button type="primary" @click="querylist">查询</el-button>
            <el-button type="primary" @click="resetSearchForm">重置</el-button>
          </el-form-item>
        </el-form>
        <yid-table pagination ref="mktactivTable" style="margin-top: 15px">
          <yid-table-column
            label="编码"
            min-width="60"
            prop="billcode"
            fixed></yid-table-column>
          <yid-table-column
            label="门店品牌"
            min-width="90"
            prop="brandName"
            fixed></yid-table-column>
          <yid-table-column
            label="活动名称"
            min-width="120"
            prop="name"></yid-table-column>
          <yid-table-column label="活动类型" width="120" prop="matype">
            <template slot-scope="scope">
              {{ scope.row.matype | formatValue(matypes) }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="活动时间"
            width="200"
            prop="timeType"
            :formatter="dateFormat"></yid-table-column>
          <yid-table-column
            label="创建人"
            min-width="100"
            prop="createdBy"></yid-table-column>
          <yid-table-column label="创建日期" min-width="100" prop="createdTime">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="修改人"
            min-width="100"
            prop="updatedBy"></yid-table-column>
          <yid-table-column label="修改日期" min-width="100" prop="updatedTime">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.updatedTime) }}
            </template>
          </yid-table-column>
          <yid-table-column label="状态" min-width="80" prop="status">
            <template slot-scope="scope">
              {{ scope.row.status | formatValue(mastatuss) }}
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status != '4'"
                @click="showEdit(scope.row, false)"
                type="text"
                ><i class="edit"></i>编辑
              </el-button>
              <el-button
                v-if="scope.row.status == '4'"
                @click="showEdit(scope.row, true)"
                type="text"
                ><i class="edit"></i>查看
              </el-button>
              <el-button
                v-if="scope.row.status == '1' || scope.row.status == '2'"
                @click="updateStatus(scope.row.id, '3')"
                type="text"
                ><i class="edit"></i>暂停
              </el-button>
              <el-button
                v-if="scope.row.status == '3'"
                @click="updateStatus(scope.row.id, '2')"
                type="text"
                ><i class="edit"></i>启用
              </el-button>
              <el-button @click="copyTemplate(scope.row, false)" type="text"
                ><i class="edit"></i>复制</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="cancel()" type="info">返回</el-button>
        <el-button
          @click="saveMktactiv('2')"
          type="primary"
          isDisabled="isDisabled"
          >保存并启用</el-button
        >
        <el-button
          @click="saveMktactiv('3')"
          type="primary"
          isDisabled="isDisabled"
          >仅保存</el-button
        >
        <el-form
          ref="mktactivForm"
          :model="mktactivForm"
          label-width="80px"
          :disabled="isSelect"
          style="margin-top: 15px">
          <el-form-item
            label="门店品牌"
            prop="brandId"
            :rules="[{ required: true, message: '门店品牌不能为空' }]">
            <el-select
              placeholder="请选择"
              style="width: 160px"
              v-model.trim="mktactivForm.brandId"
              @change="changBrnad"
              :disabled="mktactivForm.id != ''">
              <el-option
                :key="'brand2' + item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in brands"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="活动类型"
            prop="matype"
            :rules="[{ required: true, message: '活动类型不能为空' }]">
            <el-select
              placeholder="请选择"
              style="width: 140px"
              v-model.trim="mktactivForm.matype"
              :disabled="mktactivForm.id != ''">
              <el-option
                :key="'matype2' + item.value"
                :label="item.name"
                :value="item.value"
                v-for="item in matypes"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码" prop="billcode">
            <el-input
              placeholder="自动生成"
              v-model.trim="mktactivForm.billcode"
              :disabled="true"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="活动名称"
            prop="name"
            :rules="[{ required: true, message: '活动名称不能为空' }]">
            <el-input
              v-model.trim="mktactivForm.name"
              placeholder="20字以内"
              maxlength="20"
              style="width: 320px"></el-input>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              style="width: 320px"
              v-model="mktactivForm.mktdate"
              value-format="yyyy-MM-dd"
              type="daterange"
              @change="changMktdate"
              start-placeholder="开始日期"
              range-separator="至"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-checkbox
              v-model="mktactivForm.expType"
              @change="changMktdate2"
              style="margin-left: 5px"
              >长期
            </el-checkbox>
          </el-form-item>
          <el-form-item label="参与条件" v-if="mktactivForm.matype == '2'">
            <el-checkbox
              @change="editCktype"
              v-model="mktactivForm.firstOrderFlag"
              >首次开卡(当前品牌)</el-checkbox
            >
          </el-form-item>
          <el-form-item label="充值累计" v-if="mktactivForm.matype == '2'">
            <el-radio-group
              v-model="mktactivForm.cktype"
              :disabled="editCktypeFlag">
              <el-radio label="0">不可累计</el-radio>
              <el-radio label="1">可累计</el-radio>
            </el-radio-group>
            <br />
            <div v-if="mktactivForm.cktype == '1'" style="margin-top: 3px">
              <el-radio
                label="1"
                v-model="mktactivForm.ckdatetype"
                @change="changeCkdatetype"
                >固定时间</el-radio
              >
              <el-date-picker
                v-model="mktactivForm.ckdate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="mktactivForm.ckdatetype == '2'"
                style="width: 260px"
                start-placeholder="开始时间"
                range-separator="至"
                end-placeholder="结束时间">
              </el-date-picker>
            </div>
            <div v-if="mktactivForm.cktype == '1'" style="margin-top: 3px">
              <el-radio
                label="2"
                v-model="mktactivForm.ckdatetype"
                @change="changeCkdatetype"
                >相对时间</el-radio
              >
              <el-input
                type="number"
                min="1"
                v-model="mktactivForm.relatime"
                :disabled="mktactivForm.ckdatetype == '1'"
                style="width: 100px"
                clearable />
              <el-tag style="margin-left: 5px">天内</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="活动门店" prop="shop">
            <el-button type="primary" @click="selectShop()">选择门店</el-button>
            {{
              mktactivForm.shoplist
                ? '共选中' + mktactivForm.shoplist.length + '家门店'
                : ''
            }}
          </el-form-item>
          <el-form-item
            label="使用门店"
            prop="useshopType"
            v-if="mktactivForm.matype != '1'">
            <el-radio-group v-model="mktactivForm.useshopType">
              <el-radio label="1">所有活动门店</el-radio>
              <el-radio label="2">仅赠送门店</el-radio>
            </el-radio-group>
            <span
              style="margin-left: 30px; color: grey; font-size: 12px"
              v-if="mktactivForm.matype == '2'"
              >注：赠送红包/优惠券的使用门店设置，赠送项目/产品默认仅赠送门店使用</span
            >
          </el-form-item>
          <el-form-item
            label="活动业绩折扣"
            prop="discount"
            label-width="120px"
            v-if="mktactivForm.matype == '2'"
            :rules="[{ required: true, message: '活动业绩折扣不能为空' }]">
            <el-input-number
              v-model.trim="mktactivForm.discount"
              :min="0"
              :max="100"
              style="width: 150px"></el-input-number
            >&nbsp;&nbsp;（输入范围：0-100）
          </el-form-item>
          <el-form-item
            label="优先级"
            prop="priority"
            label-width="120px"
            v-if="mktactivForm.matype == '4'">
            <el-input-number
              v-model.trim="mktactivForm.priority"
              :min="0"
              :max="100"
              style="width: 150px"></el-input-number
            >&nbsp;&nbsp;按照数字从大到小匹配活动,不填默认为0
          </el-form-item>
          <!--          <el-form-item label="限制条件" v-if="mktactivForm.matype=='2' || mktactivForm.matype=='3'">-->
          <!--            <div style="margin-bottom: 10px">-->
          <!--              <el-checkbox v-model="mktactivForm.isPnum" @change="isSelectNum(mktactivForm.isPnum)" style="margin-left: 5px;">每个顾客可参与</el-checkbox>-->
          <!--              <el-input :disabled="!mktactivForm.isPnum" type="number" min="1" v-model="mktactivForm.pnum" style="width:100px; margin: 0 10px"-->
          <!--                        oninput="value=value.replace(/[^\d]/g,'')"/>-->
          <!--              次&nbsp;&nbsp;-->
          <!--            </div>-->
          <!--          </el-form-item>-->
          <el-form-item
            label="限制条件"
            v-if="mktactivForm.matype == '2' || mktactivForm.matype == '3'">
            <div class="rechargeitem">
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isPnum"
                  @change="isSelectNum(mktactivForm.isPnum)"
                  style="margin-left: 5px"
                  >每个顾客可参与</el-checkbox
                >
                <el-input
                  type="number"
                  min="1"
                  v-model="mktactivForm.pnum"
                  style="width: 100px; margin: 0 10px"
                  oninput="value=value.replace(/[^\d]/g,'')" />
                次&nbsp;&nbsp;
              </div>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isNopaytype"
                  style="margin-left: 5px"
                  >不支持以下支付方式</el-checkbox
                >
                <br />
                <el-button type="primary" @click="selectPaytype"
                  >添加支付方式</el-button
                >
                <div
                  class="walletitem ser1"
                  v-show="
                    mktactivForm.nopaytypes &&
                    mktactivForm.nopaytypes.length > 0
                  ">
                  <div
                    class="item1"
                    :key="'pay' + item.payid"
                    v-for="item in mktactivForm.nopaytypes">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deletePaytype(item.payid)"
                      style="vertical-align: middle"></i>
                    <ul style="display: inline-block">
                      {{
                        item.payname
                      }}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="活动规则" v-if="mktactivForm.matype == '1'">
            <span>会员生日当天且该会员有本品牌的会员卡的自动赠送 </span>
            <el-form-item
              label="赠送红包"
              label-width="70px"
              style="margin-top: 10px">
              <div
                style="
                  list-style: none;
                  text-align: left;
                  padding: 0;
                  margin: 0;
                ">
                <ul
                  :key="'red1' + item.redid"
                  v-for="item in mktactivForm.redenvs"
                  class="walletitem">
                  <i
                    class="el-icon-error iconshanchu"
                    @click="deleteRedenv(item.redid)"></i>
                  <div class="right">
                    <el-row :gutter="24" type="flex">
                      <el-col :span="14"
                        >{{ item.redname
                        }}{{ item.status == '' ? '' : item.status }}</el-col
                      >
                      <el-col :span="10" style="text-align: right">{{
                        item.expTime
                      }}</el-col>
                    </el-row>
                    <el-row> {{ item.rule }}</el-row>
                  </div>
                </ul>
              </div>
              <el-button type="primary" @click="selectRedenv"
                >增加红包</el-button
              >
            </el-form-item>
          </el-form-item>
          <el-form-item label="活动规则" v-if="mktactivForm.matype == '2'">
            <div
              :key="'rule' + itemRule.clevel"
              v-for="itemRule in mktactivForm.mktactivRules"
              class="rechargeitem">
              <div style="margin-bottom: 10px">
                <span style="color: red">*</span>&nbsp;&nbsp;规则名称
                <el-input
                  type="text"
                  placeholder="20字以内"
                  maxlength="20"
                  v-model="itemRule.recharge.rulename"
                  style="width: 320px; margin: 0 10px"
                  clearable />&nbsp;&nbsp;
                <el-checkbox
                  label="预售"
                  v-model="itemRule.recharge.presale"
                  v-if="mktactivForm.cktype === '1'"></el-checkbox>
                <el-input
                  type="number"
                  min="0"
                  maxlength="8"
                  v-model="itemRule.recharge.minMoney"
                  v-if="mktactivForm.cktype === '1'"
                  style="width: 200px; margin: 0 10px"
                  clearable></el-input>
              </div>
              <div style="margin-bottom: 10px">
                开卡充值满
                <el-input
                  type="number"
                  min="1"
                  maxlength="8"
                  v-model="itemRule.recharge.money"
                  style="width: 100px; margin: 0 10px"
                  clearable />
                元&nbsp;&nbsp; 赠送
                <el-input
                  :disabled="itemRule.recharge.isCustom"
                  type="number"
                  min="0"
                  maxlength="8"
                  v-model="itemRule.recharge.giftMoney"
                  style="width: 100px; margin: 0 10px"
                  clearable />
                元 &nbsp;&nbsp;
                <el-checkbox
                  @change="changeCustom($event, itemRule)"
                  v-model="itemRule.recharge.isCustom"
                  >自定义金额:
                </el-checkbox>
                最高赠送
                <el-input
                  :disabled="!itemRule.recharge.isCustom"
                  type="number"
                  min="0"
                  maxlength="8"
                  v-model="itemRule.recharge.highestMoney"
                  placeholder=">0,不填无上限"
                  style="width: 140px; margin: 0 10px" />
                元
                <span style="float: right"
                  ><el-link
                    type="primary"
                    style="color: red"
                    @click="deleteRule(itemRule.clevel)"
                    >删除规则</el-link
                  ></span
                >
              </div>
              <el-form-item label="赠送红包" label-width="85px">
                <el-button
                  type="primary"
                  @click="selectRedenv2(itemRule.clevel)"
                  >增加红包</el-button
                >
                <ul
                  style="list-style: none; text-align: left; margin-top: 10px">
                  <div
                    :key="'red2' + item.clevel + item.rindex"
                    v-for="item in itemRule.redenvs"
                    class="walletitem">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteRedenv2(item.clevel, item.rindex)"></i>
                    <div class="right">
                      <el-row :gutter="24" type="flex">
                        <el-col :span="14"
                          >{{ item.redname
                          }}{{ item.status == '' ? '' : item.status }}</el-col
                        >
                        <el-col :span="10" style="text-align: right">{{
                          item.expTime
                        }}</el-col>
                      </el-row>
                      <el-row> {{ item.rule }}</el-row>
                    </div>
                  </div>
                </ul>
              </el-form-item>

              <el-form-item label="赠送优惠券" label-width="85px">
                <el-button
                  type="primary"
                  @click="selectCoupon2(itemRule.clevel)"
                  >增加优惠券</el-button
                >
                <ul
                  style="list-style: none; text-align: left; margin-top: 10px">
                  <div
                    :key="'cou2' + item.clevel + item.cindex"
                    v-for="item in itemRule.coupons"
                    class="walletitem">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteCoupon2(item.clevel, item.cindex)"></i>
                    <div class="right">
                      <el-row :gutter="24" type="flex">
                        <el-col :span="14"
                          >{{ item.cpname
                          }}{{ item.status == '' ? '' : item.status }}</el-col
                        >
                        <el-col :span="10" style="text-align: right">{{
                          item.expTime
                        }}</el-col>
                      </el-row>
                      <el-row> {{ item.rule }}</el-row>
                    </div>
                  </div>
                </ul>
              </el-form-item>

              <el-form-item label="赠送项目" label-width="85px">
                <el-button
                  type="primary"
                  @click="selectServ(itemRule.clevel)"
                  style="margin-bottom: 15px"
                  >增加项目
                </el-button>
                <div
                  class="walletitem ser"
                  v-show="itemRule.servs && itemRule.servs.length > 0">
                  <div class="item first">
                    <i></i>
                    <ul class="one">
                      项目名称
                    </ul>
                    <ul class="two">
                      次数
                    </ul>
                    <ul class="three">
                      总价
                    </ul>
                    <ul class="four">
                      有效期
                    </ul>
                  </div>
                  <div
                    class="item"
                    :key="'serv' + item.clevel + '' + item.servid"
                    v-for="item in itemRule.servs">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteServ(item.clevel, item.servid)"></i>
                    <ul class="one">
                      {{
                        item.servname
                      }}
                    </ul>
                    <ul class="two">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.totalNum"
                        style="width: 60px; margin-right: 5px"
                        placeholder="次数" />
                      次
                    </ul>
                    <ul class="three">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.pprice"
                        style="width: 70px; margin-right: 5px"
                        placeholder="总价" />
                      元
                    </ul>
                    <ul class="four">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.timenum"
                        @input="checkServPrice(item.clevel)"
                        style="width: 70px; margin-right: 5px"
                        placeholder="有效期" />
                      <el-select
                        v-model="item.timeunit"
                        style="width: 50px; margin-right: 5px">
                        <el-option
                          :key="'unit' + itemUnit.value"
                          :label="itemUnit.name"
                          :value="itemUnit.value"
                          v-for="itemUnit in timeunits"></el-option>
                      </el-select>
                      <el-checkbox
                        style="width: 50px; margin-right: 5px"
                        v-model="item.timeType2Checked"
                        @change="changSerstime(item.clevel)"
                        >长期
                      </el-checkbox>
                      <el-checkbox
                        style="width: 80px; margin-right: 5px"
                        v-model="item.timeType3Checked"
                        @change="changSersdate(item.clevel)"
                        >截止日期
                      </el-checkbox>
                      <el-date-picker
                        v-model="item.edate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="!item.timeType3Checked"
                        style="width: 110px">
                      </el-date-picker>
                    </ul>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="赠送产品" label-width="85px">
                <el-button
                  type="primary"
                  @click="selectGood(itemRule.clevel)"
                  style="margin-bottom: 15px"
                  >增加产品
                </el-button>
                <div
                  class="walletitem ser"
                  v-show="itemRule.products && itemRule.products.length > 0">
                  <div class="item first">
                    <i></i>
                    <ul class="one">
                      产品名称
                    </ul>
                    <ul class="two">
                      次数
                    </ul>
                    <ul class="three">
                      总价
                    </ul>
                    <ul class="four">
                      有效期
                    </ul>
                  </div>
                  <div
                    class="item"
                    :key="'prod' + item.clevel + '' + item.pid"
                    v-for="item in itemRule.products">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteGood(item.clevel, item.pid)"></i>
                    <ul class="one">
                      {{
                        item.pname
                      }}
                    </ul>
                    <ul class="two">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.totalNum"
                        style="width: 60px; margin-right: 5px"
                        placeholder="次数" />
                      次
                    </ul>
                    <ul class="three">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.pprice"
                        style="width: 70px; margin-right: 5px"
                        placeholder="总价" />
                      元
                    </ul>
                    <ul class="four">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.timenum"
                        @input="checkGoodPrice(item.clevel)"
                        style="width: 70px; margin-right: 5px"
                        placeholder="有效期" />
                      <el-select
                        v-model="item.timeunit"
                        style="width: 60px; margin-right: 5px">
                        <el-option
                          :key="'unit2' + itemUnit.value"
                          :label="itemUnit.name"
                          :value="itemUnit.value"
                          v-for="itemUnit in timeunits"></el-option>
                      </el-select>
                      <el-checkbox
                        v-model="item.timeType2Checked"
                        style="width: 50px; margin-right: 5px"
                        @change="changGoodtime(item.clevel)"
                        >长期
                      </el-checkbox>
                      <el-checkbox
                        v-model="item.timeType3Checked"
                        style="width: 80px; margin-right: 5px"
                        @change="changGooddate(item.clevel)"
                        >截止日期
                      </el-checkbox>
                      <el-date-picker
                        v-model="item.edate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="!item.timeType3Checked"
                        style="width: 110px">
                      </el-date-picker>
                    </ul>
                  </div>
                </div>
              </el-form-item>
            </div>
            <el-button type="primary" @click="addRule">新增规则</el-button>
          </el-form-item>
          <el-form-item label="活动规则" v-if="mktactivForm.matype == '3'">
            <span style="margin-bottom: 15px">会员购买指定套餐后自动赠送 </span>
            <el-form-item label="指定套餐" label-width="85px">
              <div
                class="walletitem pack"
                v-show="
                  mktactivForm.packages && mktactivForm.packages.length > 0
                ">
                <div
                  class="pitem"
                  :key="'pkg3' + item.spid"
                  v-for="item in mktactivForm.packages">
                  <i
                    class="el-icon-error iconshanchu"
                    @click="deletePack(item.spid)"></i>
                  <label>({{ item.spcode }}){{ item.spname }}</label>
                </div>
              </div>
              <el-button type="primary" @click="selectPack()"
                >选择套餐</el-button
              >
            </el-form-item>
            <el-form-item label="赠送优惠券" label-width="85px">
              <ul
                style="
                  list-style: none;
                  text-align: left;
                  margin: 0;
                  padding: 0;
                ">
                <div
                  :key="'cou3' + item.cpid"
                  v-for="item in mktactivForm.coupons"
                  class="walletitem">
                  <i
                    class="el-icon-error iconshanchu"
                    @click="deleteCoupon(item.cpid)"></i>
                  <div class="right">
                    <el-row :gutter="24" type="flex">
                      <el-col :span="14"
                        >{{ item.cpname
                        }}{{ item.status == '' ? '' : item.status }}</el-col
                      >
                      <el-col :span="10" style="text-align: right">{{
                        item.expTime
                      }}</el-col>
                    </el-row>
                    <el-row> {{ item.rule }}</el-row>
                  </div>
                </div>
              </ul>
              <el-button type="primary" @click="selectCoupon()"
                >增加优惠券</el-button
              >
            </el-form-item>
            <el-form-item label="赠送红包" label-width="85px">
              <ul
                style="
                  list-style: none;
                  text-align: left;
                  margin: 0;
                  padding: 0;
                ">
                <div
                  :key="'red3' + item.redid"
                  v-for="item in mktactivForm.redenvs"
                  class="walletitem">
                  <i
                    class="el-icon-error iconshanchu"
                    @click="deleteRedenv(item.redid)"></i>
                  <div class="right">
                    <el-row :gutter="24" type="flex">
                      <el-col :span="14"
                        >{{ item.redname
                        }}{{ item.status == '' ? '' : item.status }}</el-col
                      >
                      <el-col :span="10" style="text-align: right">{{
                        item.expTime
                      }}</el-col>
                    </el-row>
                    <el-row> {{ item.rule }}</el-row>
                  </div>
                </div>
              </ul>
              <el-button type="primary" @click="selectRedenv"
                >增加红包</el-button
              >
            </el-form-item>
          </el-form-item>
          <el-form-item label="活动规则" v-if="mktactivForm.matype == '4'">
            <div class="rechargeitem">
              <div style="margin-bottom: 10px">
                <span style="color: red">*</span>&nbsp;&nbsp;<font
                  style="font-weight: bolder"
                  >触发条件</font
                >&nbsp;&nbsp;
              </div>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isJe"
                  style="margin-left: 5px"
                  >消费金额满</el-checkbox
                >
                <el-input
                  type="number"
                  min="0"
                  v-model="mktactivForm.minje"
                  style="width: 100px; margin: 0 10px"
                  oninput="value=value.replace(/[^\d]/g,'')" />
                元&nbsp;&nbsp;
              </div>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isBirthday"
                  style="margin-left: 5px"
                  @change="changeBirthday"
                  >生日当天
                </el-checkbox>
              </div>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isServzd"
                  style="margin-left: 5px"
                  @change="addFirstzd()"
                  >指定项目
                </el-checkbox>
                <el-button @click="addZscom">添加指定项目组合</el-button>
                <el-popover
                  style="padding-left: 10px"
                  placement="right"
                  title="提示"
                  width="380"
                  trigger="hover">
                  <el-button slot="reference"
                    ><i class="el-icon-question"></i
                  ></el-button>
                  <ul class="tips-content">
                    <li>
                      添加单个指定项目时，表示开单时任选一个或一个以上指定项目，可以享受优惠。
                    </li>
                    <li>
                      如果添加多个组合，则表示开单时，必须在每个组合中任选一个或以上，才能享受优惠。
                    </li>
                    <li>最多可支持创建5个指定项目组.</li>
                  </ul>
                </el-popover>
              </div>
              <div
                :key="'rule4' + itemRule.servzdid"
                v-for="itemRule in mktactivForm.zscomlist">
                指定{{ itemRule.servzdid }}&nbsp;&nbsp;<el-select
                  placeholder="请选择"
                  style="width: 100px"
                  v-model.trim="itemRule.type"
                  @change="selectType($event, itemRule.type)">
                  <el-option
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                    v-for="item in classifi"></el-option> </el-select
                >&nbsp;&nbsp;&nbsp;<el-button
                  type="primary"
                  @click="selectServ2(itemRule.servzdid, itemRule.type)"
                  >添加
                </el-button>
                <i
                  class="el-icon-error iconshanchu"
                  @click="deleteZscom(itemRule.servzdid)"></i>
                <div
                  class="walletitem ser1"
                  v-show="itemRule.zscoms && itemRule.zscoms.length > 0">
                  <div
                    class="item1"
                    :key="'serv' + item.servzdid + '' + item.servid"
                    v-for="item in itemRule.zscoms">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteServ2(item.servzdid, item.servid)"
                      style="vertical-align: middle"></i>
                    <ul style="display: inline-block">
                      {{
                        item.servname
                      }}
                    </ul>
                  </div>
                </div>
              </div>
              <div style="margin-bottom: 10px">
                <font style="font-weight: bolder">设置优惠</font>&nbsp;&nbsp;
              </div>
              <div style="margin-bottom: 10px">
                优惠形式：
                <el-select
                  placeholder="请选择"
                  style="width: 120px"
                  v-model.trim="mktactivForm.ptype">
                  <el-option
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                    v-for="item in ptypes"></el-option> </el-select
                >&nbsp;&nbsp;
                <el-input
                  type="number"
                  style="width: 100px"
                  min="0"
                  v-model="mktactivForm.pvalue" />
                <span v-if="mktactivForm.ptype == '2'">折</span>
                <span v-if="mktactivForm.ptype == '1'">元</span>
              </div>
              <div style="margin-bottom: 10px">
                最高减额：
                <el-input
                  :disabled="mktactivForm.ptype == '1'"
                  type="number"
                  min="0"
                  v-model="mktactivForm.maxsub"
                  style="width: 120px"></el-input>
                元&nbsp;（默认为0.0表示不限）
              </div>
              <div style="margin-bottom: 10px">
                <font style="font-weight: bolder">设置赠送</font>&nbsp;&nbsp;
              </div>
              <el-form-item label="赠送优惠券" label-width="85px">
                <ul
                  style="
                    list-style: none;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                  ">
                  <div
                    :key="'cou4' + item.cpid"
                    v-for="item in mktactivForm.coupons3"
                    class="walletitem">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteCoupon3(item.cpid)"></i>
                    <div class="right">
                      <el-row :gutter="24" type="flex">
                        <el-col :span="14"
                          >{{ item.cpname
                          }}{{ item.status == '' ? '' : item.status }}</el-col
                        >
                        <el-col :span="10" style="text-align: right">{{
                          item.expTime
                        }}</el-col>
                      </el-row>
                      <el-row> {{ item.rule }}</el-row>
                    </div>
                  </div>
                </ul>
                <el-button type="primary" @click="selectCoupon3"
                  >增加优惠券</el-button
                >
              </el-form-item>
              <el-form-item label="赠送红包" label-width="85px">
                <ul
                  style="
                    list-style: none;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                  ">
                  <div
                    :key="'red4' + item.redid"
                    v-for="item in mktactivForm.redenvs3"
                    class="walletitem">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteRedenv3(item.redid)"></i>
                    <div class="right">
                      <el-row :gutter="24" type="flex">
                        <el-col :span="14"
                          >{{ item.redname
                          }}{{ item.status == '' ? '' : item.status }}</el-col
                        >
                        <el-col :span="10" style="text-align: right">{{
                          item.expTime
                        }}</el-col>
                      </el-row>
                      <el-row> {{ item.rule }}</el-row>
                    </div>
                  </div>
                </ul>
                <el-button type="primary" @click="selectRedenv3"
                  >增加红包</el-button
                >
              </el-form-item>

              <el-form-item label="赠送项目" label-width="85px">
                <el-button
                  type="primary"
                  @click="selectServ3"
                  style="margin-bottom: 15px"
                  >增加项目</el-button
                >
                <div
                  class="walletitem ser"
                  v-show="
                    mktactivForm.servs3 && mktactivForm.servs3.length > 0
                  ">
                  <div class="item first">
                    <i></i>
                    <ul class="one">
                      项目名称
                    </ul>
                    <ul class="two">
                      次数
                    </ul>
                    <ul class="three">
                      总价
                    </ul>
                    <ul class="four">
                      有效期
                    </ul>
                  </div>
                  <div
                    class="item"
                    :key="'serv' + item.servid"
                    v-for="item in mktactivForm.servs3">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteServ3(item.servid)"></i>
                    <ul class="one">
                      {{
                        item.servname
                      }}
                    </ul>
                    <ul class="two">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.totalNum"
                        style="width: 60px; margin-right: 5px"
                        placeholder="次数" />
                      次
                    </ul>
                    <ul class="three">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.pprice"
                        style="width: 70px; margin-right: 5px"
                        placeholder="总价" />
                      元
                    </ul>
                    <ul class="four">
                      <el-input
                        type="number"
                        min="1"
                        v-model="item.timenum"
                        @input="checkServPrice(item.clevel)"
                        style="width: 70px; margin-right: 5px"
                        placeholder="有效期" />
                      <el-select
                        v-model="item.timeunit"
                        style="width: 50px; margin-right: 5px">
                        <el-option
                          :key="'unit' + itemUnit.value"
                          :label="itemUnit.name"
                          :value="itemUnit.value"
                          v-for="itemUnit in timeunits"></el-option>
                      </el-select>
                      <el-checkbox
                        style="width: 50px; margin-right: 5px"
                        v-model="item.timeType2Checked"
                        @change="changSerstime3()"
                        >长期
                      </el-checkbox>
                      <el-checkbox
                        style="width: 80px; margin-right: 5px"
                        v-model="item.timeType3Checked"
                        @change="changSersdate3()"
                        >截止日期
                      </el-checkbox>
                      <el-date-picker
                        v-model="item.edate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="!item.timeType3Checked"
                        style="width: 110px">
                      </el-date-picker>
                    </ul>
                  </div>
                </div>
              </el-form-item>

              <div style="margin-bottom: 10px">
                <font style="font-weight: bolder">限制条件</font>&nbsp;&nbsp;
              </div>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isPnum"
                  @change="isSelectNum(mktactivForm.isPnum)"
                  style="margin-left: 5px"
                  >每个顾客可参与</el-checkbox
                >
                <el-input
                  type="number"
                  min="1"
                  v-model="mktactivForm.pnum"
                  style="width: 100px; margin: 0 10px"
                  oninput="value=value.replace(/[^\d]/g,'')" />
                次&nbsp;&nbsp;
              </div>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isShared"
                  style="margin-left: 5px"
                  >不可与其他优惠同享</el-checkbox
                >
                <el-popover
                  style="padding-left: 10px"
                  placement="right"
                  title="提示"
                  width="380"
                  trigger="hover">
                  <el-button slot="reference"
                    ><i class="el-icon-question"></i
                  ></el-button>
                  <ul class="tips-content">
                    <li>
                      有指定优惠券，则仅不可与指定优惠券同享。
                      无指定券，则不可与所有券同享。
                    </li>
                  </ul>
                </el-popover>
              </div>
              <el-form-item label="选择优惠券" label-width="85px">
                <ul
                  style="
                    list-style: none;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                  ">
                  <div
                    :key="'cou5' + item.cpid"
                    v-for="item in mktactivForm.couponZsdiffs"
                    class="walletitem">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteCoupon4(item.cpid)"></i>
                    <div class="right">
                      <el-row :gutter="24" type="flex">
                        <el-col :span="14"
                          >{{ item.cpname
                          }}{{ item.status == '' ? '' : item.status }}</el-col
                        >
                        <el-col :span="10" style="text-align: right">{{
                          item.expTime
                        }}</el-col>
                      </el-row>
                      <el-row> {{ item.rule }}</el-row>
                    </div>
                  </div>
                </ul>
                <el-button type="primary" @click="selectCoupon4"
                  >增加优惠券</el-button
                >
              </el-form-item>
              <el-form-item label="选择红包" label-width="85px">
                <ul
                  style="
                    list-style: none;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                  ">
                  <div
                    :key="'red5' + item.redid"
                    v-for="item in mktactivForm.redenvZsdiffs"
                    class="walletitem">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deleteRedenv4(item.redid)"></i>
                    <div class="right">
                      <el-row :gutter="24" type="flex">
                        <el-col :span="14"
                          >{{ item.redname
                          }}{{ item.status == '' ? '' : item.status }}</el-col
                        >
                        <el-col :span="10" style="text-align: right">{{
                          item.expTime
                        }}</el-col>
                      </el-row>
                      <el-row> {{ item.rule }}</el-row>
                    </div>
                  </div>
                </ul>
                <el-button type="primary" @click="selectRedenv4"
                  >增加红包</el-button
                >
              </el-form-item>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isPd"
                  style="margin-left: 5px"
                  :disabled="isEditPd"
                  >支持拼单
                </el-checkbox>
                <br />
                最少拼单人数
                <el-input
                  type="number"
                  min="0"
                  v-model="mktactivForm.minpdnum"
                  style="width: 100px"
                  oninput="value=value.replace(/[^\d]/g,'')" />
                人
                <el-popover
                  style="padding-left: 10px"
                  placement="right"
                  title="提示"
                  width="380"
                  trigger="hover">
                  <el-button slot="reference"
                    ><i class="el-icon-question"></i
                  ></el-button>
                  <ul class="tips-content">
                    <li>
                      表示可多个单据合并结账时，判断所有单据中的内容合并起来是否符合触发条件。如果符合则每个单据都可以享受优惠。
                    </li>
                    <li>
                      设置最少拼单人数，则需要合并结账单据数量满足最少拼单人数时，才开始参与活动。
                    </li>
                    <li>默认值为0，当设置为0时，表示不限制最少拼单数。</li>
                    <li>
                      例如：最少拼单数为3，则表示，在拼单情况下买单，需要达到最少3个单据一起结账才可以享受优惠。
                    </li>
                  </ul>
                </el-popover>
              </div>
              <div style="margin-bottom: 10px">
                <el-checkbox
                  v-model="mktactivForm.isNopaytype"
                  style="margin-left: 5px"
                  >不支持以下支付方式</el-checkbox
                >
                <br />
                <el-button type="primary" @click="selectPaytype"
                  >添加支付方式</el-button
                >
                <div
                  class="walletitem ser1"
                  v-show="
                    mktactivForm.nopaytypes &&
                    mktactivForm.nopaytypes.length > 0
                  ">
                  <div
                    class="item1"
                    :key="'pay' + item.payid"
                    v-for="item in mktactivForm.nopaytypes">
                    <i
                      class="el-icon-error iconshanchu"
                      @click="deletePaytype(item.payid)"
                      style="vertical-align: middle"></i>
                    <ul style="display: inline-block">
                      {{
                        item.payname
                      }}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="活动描述"
            v-if="
              mktactivForm.matype == '2' ||
              mktactivForm.matype == '3' ||
              mktactivForm.matype == '4'
            ">
            <template>
              <vue-editor v-model="mktactivForm.memo" />
            </template>
            <el-link type="primary" @click="clearMemo()">清空描述</el-link>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

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
        <el-col :span="2" :offset="10" v-if="type == '2'">
          <el-button type="primary" @click="saveShop()">保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible = false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="redenvDialog.title"
      :visible.sync="redenvDialog.visible"
      @close="redenvDialog.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm1">
        <el-form-item label="红包：">
          <el-input
            clearable
            v-model="redenvDialog.rname"
            placeholder="红包名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryRedenv()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setRedenv()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableRedenv"
          style="margin-top: 10px"
          :data="redenvDialog.redenvs"
          @selection-change="handleSelectionChangeRedenv">
          <el-table-column type="selection" width="55"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="rcode"></yid-table-column>
          <yid-table-column
            label="红包名称"
            min-width="100"
            prop="rname"></yid-table-column>
          <yid-table-column
            label="价值"
            min-width="70"
            prop="money"></yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="redenvDialog2.title"
      :visible.sync="redenvDialog2.visible"
      @close="redenvDialog2.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm10">
        <el-form-item label="红包：">
          <el-input
            clearable
            v-model="redenvDialog2.rname"
            placeholder="红包名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryRedenv2()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setRedenv2()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableRedenv"
          style="margin-top: 10px"
          :data="redenvDialog2.redenvs"
          @selection-change="handleSelectionChangeRedenv2">
          <el-table-column type="selection" width="55"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="rcode"></yid-table-column>
          <yid-table-column
            label="红包名称"
            min-width="100"
            prop="rname"></yid-table-column>
          <yid-table-column
            label="价值"
            min-width="70"
            prop="money"></yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="redenvDialog3.title"
      :visible.sync="redenvDialog3.visible"
      @close="redenvDialog3.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm11">
        <el-form-item label="红包：">
          <el-input
            clearable
            v-model="redenvDialog3.rname"
            placeholder="红包名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryRedenv3()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setRedenv3()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableRedenv"
          style="margin-top: 10px"
          :data="redenvDialog3.redenvs"
          @selection-change="handleSelectionChangeRedenv">
          <el-table-column type="selection" width="55"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="rcode"></yid-table-column>
          <yid-table-column
            label="红包名称"
            min-width="100"
            prop="rname"></yid-table-column>
          <yid-table-column
            label="价值"
            min-width="70"
            prop="money"></yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="redenvDialog4.title"
      :visible.sync="redenvDialog4.visible"
      @close="redenvDialog4.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm1">
        <el-form-item label="红包：">
          <el-input
            clearable
            v-model="redenvDialog4.rname"
            placeholder="红包名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryRedenv4()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setRedenv4()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableRedenv"
          style="margin-top: 10px"
          :data="redenvDialog4.redenvs"
          @selection-change="handleSelectionChangeRedenv">
          <el-table-column type="selection" width="55"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="rcode"></yid-table-column>
          <yid-table-column
            label="红包名称"
            min-width="100"
            prop="rname"></yid-table-column>
          <yid-table-column
            label="价值"
            min-width="70"
            prop="money"></yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="servDialog.title"
      :visible.sync="servDialog.visible"
      @close="servDialog.visible = false"
      width="800px">
      <el-form label-width="100px" ref="copyForm3">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="servDialog.branch"
            @change="changeBranch(servDialog.branch, '1')"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in servDialog.branchs"
              :key="'bra' + item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="servDialog.serviceType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in servDialog.serviceTypes"
              :key="'sty' + item.id"
              :label="item.sname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
            clearable
            v-model="servDialog.sername"
            placeholder="项目名称/编码"
            style="margin-left: 5px; width: 160px"></el-input>
          <el-button
            type="primary"
            @click="setServs()"
            style="margin-left: 10px"
            >确认添加</el-button
          >
          <el-button type="primary" @click="servDialog.visible = false"
            >取消</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox
                  v-model="servDialog.checkbox"
                  @change="checkServ"></el-checkbox>
                (编号）项目名称
              </th>
            </tr>
            <tr
              :key="'servs' + item.servid"
              v-for="item in servDialog.services"
              v-if="screenService(item)">
              <td>{{ item.bname }}</td>
              <td>{{ item.typename }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :value="item.servid"></el-checkbox>
                ({{ item.sdcode }}){{ item.sdname }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="servDialog2.title"
      :visible.sync="servDialog2.visible"
      @close="servDialog2.visible = false"
      width="800px">
      <el-form label-width="100px" ref="copyForm4">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="servDialog2.branch"
            @change="changeBranch2(servDialog2.branch, '1')"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in servDialog2.branchs"
              :key="'bra' + item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="servDialog2.serviceType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in servDialog2.serviceTypes"
              :key="'sty' + item.id"
              :label="item.sname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
            clearable
            v-model="servDialog2.sername"
            placeholder="项目名称/编码"
            style="margin-left: 5px; width: 160px"></el-input>
          <el-button
            type="primary"
            @click="setServs2(1)"
            style="margin-left: 10px"
            >确认添加</el-button
          >
          <el-button type="primary" @click="servDialog2.visible = false"
            >取消</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox
                  v-model="servDialog2.checkbox"
                  @change="checkSer2"></el-checkbox>
                (编号）项目名称
              </th>
            </tr>
            <tr
              :key="'servs' + item.servid"
              v-for="item in servDialog2.services"
              v-if="screenService2(item)">
              <td>{{ item.bname }}</td>
              <td>{{ item.typename }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :value="item.servid"></el-checkbox>
                ({{ item.sdcode }}){{ item.sdname }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="servDialog3.title"
      :visible.sync="servDialog3.visible"
      @close="servDialog3.visible = false"
      width="800px">
      <el-form label-width="100px" ref="copyForm10">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="servDialog3.branch"
            @change="changeBranch3(servDialog3.branch, '1')"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in servDialog3.branchs"
              :key="'bra' + item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="servDialog3.serviceType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in servDialog3.serviceTypes"
              :key="'sty' + item.id"
              :label="item.sname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
            clearable
            v-model="servDialog3.sername"
            placeholder="项目名称/编码"
            style="margin-left: 5px; width: 160px"></el-input>
          <el-button
            type="primary"
            @click="setServs3()"
            style="margin-left: 10px"
            >确认添加</el-button
          >
          <el-button type="primary" @click="servDialog3.visible = false"
            >取消</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox
                  v-model="servDialog3.checkbox"
                  @change="checkSer3"></el-checkbox>
                (编号）项目名称
              </th>
            </tr>
            <tr
              :key="'servs' + item.servid"
              v-for="item in servDialog3.services"
              v-if="screenService3(item)">
              <td>{{ item.bname }}</td>
              <td>{{ item.typename }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :value="item.servid"></el-checkbox>
                ({{ item.sdcode }}){{ item.sdname }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="servDialog4.title"
      :visible.sync="servDialog4.visible"
      @close="servDialog4.visible = false"
      width="800px">
      <el-form label-width="100px" ref="copyForm4">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="servDialog4.branch"
            @change="changeBranch2(servDialog4.branch, '2')"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in servDialog4.branchs"
              :key="'bra' + item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-button
            type="primary"
            @click="setServs2(2)"
            style="margin-left: 10px"
            >确认添加</el-button
          >
          <el-button type="primary" @click="servDialog4.visible = false"
            >取消</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">
                <el-checkbox
                  v-model="servDialog4.checkbox"
                  @change="checkSer4"></el-checkbox>
                分类
              </th>
            </tr>
            <tr :key="item.id" v-for="item in servDialog4.serviceTypes">
              <td>{{ item.branchName }}</td>
              <td>
                <el-checkbox
                  @change="selectOk($event, item)"
                  v-model="item.type"
                  :value="item.id"></el-checkbox>
                ({{ item.scode }}){{ item.sname }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="goodDialog.title"
      :visible.sync="goodDialog.visible"
      @close="goodDialog.visible = false"
      width="800px">
      <el-form label-width="120px" ref="copyForm4">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="goodDialog.branch"
            @change="changeBranch(goodDialog.branch, '2')"
            placeholder="所属部门"
            style="width: 140px">
            <el-option
              v-for="item in goodDialog.branchs"
              :key="'br' + item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="goodDialog.productType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in goodDialog.productTypes"
              :key="'ty' + item.id"
              :label="item.cname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
            clearable
            v-model="goodDialog.goodname"
            placeholder="产品名称/编码"
            style="margin-left: 5px; width: 160px"></el-input>
          <el-button
            type="primary"
            @click="setGoods()"
            style="margin-left: 10px"
            >确认添加</el-button
          >
          <el-button type="primary" @click="goodDialog.visible = false"
            >取消</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox @change="checkGood"></el-checkbox>
                (编号）项目名称 规格
              </th>
            </tr>
            <tr
              :key="'prd' + item.pid"
              v-for="item in goodDialog.products"
              v-if="screenProduct(item)">
              <td>{{ item.bname }}</td>
              <td>{{ item.typename }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :value="item.pid"></el-checkbox>
                ({{ item.sdcode }}) {{ item.sdname }} {{ item.norms }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="packDialog.title"
      :visible.sync="packDialog.visible"
      @close="packDialog.visible = false"
      width="700px">
      <el-form label-width="120px" ref="copyForm5">
        <el-form-item label="套餐：">
          <el-input
            placeholder="套餐名称/编码"
            style="width: 200px"
            v-model="packDialog.pcodename"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="25%">所属品牌</th>
              <th width="55%">
                <el-checkbox
                  @change="checkPack"
                  v-model="packDialog.checkbox"></el-checkbox>
                (编号）套餐名称
              </th>
            </tr>
            <tr
              :key="'packa' + item.spid"
              v-for="item in packDialog.packages"
              v-if="screenPackage(item)">
              <td>{{ item.brandname }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :value="item.spid"></el-checkbox>
                ({{ item.spcode }})&nbsp;{{ item.spname }}
              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="setPacks()">确认添加</el-button>
          <el-button type="primary" @click="packDialog.visible = false"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="couponDialog.title"
      :visible.sync="couponDialog.visible"
      @close="couponDialog.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm6">
        <el-form-item label="优惠券：">
          <el-input
            clearable
            v-model="couponDialog.cpcodename"
            placeholder="优惠券名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryCoupon()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setCoupons()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableCoupon"
          style="margin-top: 10px"
          :data="couponDialog.coupons"
          @selection-change="handleSelectionChangeCoupon">
          <el-table-column type="selection" width="50"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="cpcode"></yid-table-column>
          <yid-table-column
            label="优惠券名称"
            min-width="100"
            prop="cpname"></yid-table-column>
          <yid-table-column label="价值" min-width="80" prop="couponType">
            <template slot-scope="scope">
              <div v-if="scope.row.couponType == '1'">
                {{ '定额' + scope.row.discount + '元' }}
              </div>
              <div v-if="scope.row.couponType == '2'">
                {{ '折扣' + scope.row.discount + '折' }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="couponDialog2.title"
      :visible.sync="couponDialog2.visible"
      @close="couponDialog2.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm7">
        <el-form-item label="优惠券：">
          <el-input
            clearable
            v-model="couponDialog2.cpcodename"
            placeholder="优惠券名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryCoupon2()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setCoupons2()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableCoupon2"
          style="margin-top: 10px"
          :data="couponDialog2.coupons"
          @selection-change="handleSelectionChangeCoupon2">
          <el-table-column type="selection" width="55"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="cpcode"></yid-table-column>
          <yid-table-column
            label="优惠券名称"
            min-width="100"
            prop="cpname"></yid-table-column>
          <yid-table-column label="价值" min-width="80" prop="couponType">
            <template slot-scope="scope">
              <div v-if="scope.row.couponType == '1'">
                {{ '定额' + scope.row.discount + '元' }}
              </div>
              <div v-if="scope.row.couponType == '2'">
                {{ '折扣' + scope.row.discount + '折' }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="couponDialog3.title"
      :visible.sync="couponDialog3.visible"
      @close="couponDialog3.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm8">
        <el-form-item label="优惠券：">
          <el-input
            clearable
            v-model="couponDialog3.cpcodename"
            placeholder="优惠券名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryCoupon3()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setCoupons3()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableCoupon3"
          style="margin-top: 10px"
          :data="couponDialog3.coupons"
          @selection-change="handleSelectionChangeCoupon">
          <el-table-column type="selection" width="50"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="cpcode"></yid-table-column>
          <yid-table-column
            label="优惠券名称"
            min-width="100"
            prop="cpname"></yid-table-column>
          <yid-table-column label="价值" min-width="80" prop="couponType">
            <template slot-scope="scope">
              <div v-if="scope.row.couponType == '1'">
                {{ '定额' + scope.row.discount + '元' }}
              </div>
              <div v-if="scope.row.couponType == '2'">
                {{ '折扣' + scope.row.discount + '折' }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="couponDialog4.title"
      :visible.sync="couponDialog4.visible"
      @close="couponDialog4.visible = false"
      width="700px">
      <el-form label-width="100px" ref="copyForm9">
        <el-form-item label="优惠券：">
          <el-input
            clearable
            v-model="couponDialog4.cpcodename"
            placeholder="优惠券名称/编码"
            style="width: 160px"></el-input>
          <el-button
            type="primary"
            @click="queryCoupon4()"
            style="margin-left: 20px"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="setCoupons4()"
            style="margin-left: 20px"
            >确认选择</el-button
          >
        </el-form-item>
        <yid-table
          ref="tableCoupon4"
          style="margin-top: 10px"
          :data="couponDialog4.coupons"
          @selection-change="handleSelectionChangeCoupon">
          <el-table-column type="selection" width="50"></el-table-column>
          <yid-table-column
            label="编码"
            min-width="60"
            prop="cpcode"></yid-table-column>
          <yid-table-column
            label="优惠券名称"
            min-width="100"
            prop="cpname"></yid-table-column>
          <yid-table-column label="价值" min-width="80" prop="couponType">
            <template slot-scope="scope">
              <div v-if="scope.row.couponType == '1'">
                {{ '定额' + scope.row.discount + '元' }}
              </div>
              <div v-if="scope.row.couponType == '2'">
                {{ '折扣' + scope.row.discount + '折' }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="有效期"
            min-width="160"
            prop="expTime"></yid-table-column>
          <yid-table-column
            label="门店使用"
            min-width="160"
            prop="rule"></yid-table-column>
        </yid-table>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="paytypeDialog.title"
      :visible.sync="paytypeDialog.visible"
      @close="paytypeDialog.visible = false"
      width="800px">
      <el-form label-width="100px" ref="copyForm12">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="paytypeDialog.payMold"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in paytypeDialog.payMolds"
              :key="'sty' + item.id"
              :label="item.ptname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button
            type="primary"
            @click="setpaytypes()"
            style="margin-left: 10px"
            >确认添加</el-button
          >
          <el-button type="primary" @click="paytypeDialog.visible = false"
            >取消</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="30%">
                <el-checkbox
                  v-model="paytypeDialog.checkbox"
                  @change="checkPaytype"></el-checkbox>
                编码
              </th>
              <th width="50%">付款方式名称</th>
              <th width="20%">类型</th>
            </tr>
            <tr
              :key="'paytypes' + item.id"
              v-for="item in paytypeDialog.paytypes"
              v-if="screenPaytype(item)">
              <td>
                <el-checkbox v-model="item.type" :value="item.id"></el-checkbox>
                {{ item.paycode }}
              </td>
              <td>{{ item.payname }}</td>
              <td>{{ item.ptname }}</td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>
<script>
import yid from '@src/library'
import service from '@src/service'
import { VueEditor } from 'vue2-editor'

//清空
function isClear(obj) {
  for (var i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = []
    } else if (i == 'page' || i == 'limit') {
    } else {
      obj[i] = ''
    }
  }
}

export default {
  name: 'mktactiv',
  components: { VueEditor },
  data() {
    return {
      showList: true,
      isSelect: false,
      isDisabled: false,
      editCktypeFlag: false,
      isEditPd: false,
      type: '',
      duoflag: false,
      matypes: [
        { name: '生日赠送', value: '1' },
        { name: '开卡充值赠送', value: '2' },
        { name: '购买套餐赠送', value: '3' },
        {
          name: '服务开单赠送',
          value: '4'
        }
      ],
      mastatuss: [
        { name: '未开始', value: '1' },
        { name: '进行中', value: '2' },
        { name: '暂停中', value: '3' },
        {
          name: '已结束',
          value: '4'
        }
      ],
      timeunits: [
        { name: '年', value: '1' },
        { name: '月', value: '2' },
        { name: '日', value: '3' }
      ],
      ptypes: [
        { name: '固定金额', value: '1' },
        { name: '折扣', value: '2' }
      ],
      pageInfo: {
        page: 1,
        limit: 10
      },
      searchForm: {
        name: '',
        matype: '',
        status: '',
        brandId: '',
        shop: ''
      },
      mktactivForm: {
        id: '',
        brandId: '',
        brandCode: '',
        brandName: '',
        matype: '',
        billcode: '',
        name: '',
        status: '',
        memo: '',
        mktdate: [],
        sdate: '',
        edate: '',
        useshopType: '2',
        timeType: '2',
        expType: false,
        shoplist: [],
        clevel: '0',
        redenvs: [],
        packages: [],
        coupons: [],
        mktactivRules: [],
        cktype: '0',
        ckdatetype: '',
        ckdate: [],
        relatime: '',
        discount: '100',
        priority: '0',
        isBirthday: '',
        firstOrder: '',
        firstOrderFlag: false,
        isJe: '',
        minje: '',
        isServzd: '',
        servzdid: '0',
        servzdids: '',
        ptype: '',
        pvalue: '',
        maxsub: '',
        isPnum: '',
        pnum: '',
        isShared: '',
        isPd: '',
        isNopaytype: '',
        minpdnum: '',
        zscomlist: [],
        couponZsdiffs: [],
        redenvZsdiffs: [],
        coupons3: [],
        redenvs3: [],
        servs3: [],
        nopaytypes: []
      },
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
      selectShops: [],
      selectRedenvs: [],
      selectCoupons: [],
      branchs: [],
      brands: [],
      regions: [],
      packages: [],
      coupons: [],
      shopData: [],
      paytypes: [],
      payMolds: [],
      types: [
        { name: '美发', value: '1' },
        { name: '美容', value: '2' },
        { name: '综合', value: '3' }
      ],
      redenvDialog: {
        title: '',
        visible: false,
        redname: '',
        brandId: '',
        redenvs: [],
        checkbox: false,
        type: '1',
        clevel: '1'
      },
      redenvDialog2: {
        title: '',
        visible: false,
        redname: '',
        brandId: '',
        redenvs: [],
        checkbox: false,
        type: '1',
        clevel: '1'
      },
      redenvDialog3: {
        title: '',
        visible: false,
        redname: '',
        brandId: '',
        redenvs: [],
        checkbox: false,
        type: '1',
        clevel: '1'
      },
      redenvDialog4: {
        title: '',
        visible: false,
        redname: '',
        brandId: '',
        redenvs: [],
        checkbox: false,
        type: '1',
        clevel: '1'
      },
      paytypeDialog: {
        title: '选择付款方式',
        visible: false,
        payMolds: [],
        payMold: '',
        paytypes: [],
        checkbox: false
      },
      servDialog: {
        title: '选择项目',
        visible: false,
        branchs: [],
        branch: '',
        serviceTypes: [],
        serviceType: '',
        services: [],
        sername: '',
        checkbox: false,
        clevel: ''
      },
      servDialog2: {
        title: '选择项目',
        visible: false,
        branchs: [],
        branch: '',
        serviceTypes: [],
        serviceType: '',
        services: [],
        sername: '',
        checkbox: false,
        servzdid: ''
      },
      servDialog3: {
        title: '选择项目',
        visible: false,
        branchs: [],
        branch: '',
        serviceTypes: [],
        serviceType: '',
        services: [],
        sername: '',
        checkbox: false
      },
      servDialog4: {
        title: '选择分类',
        visible: false,
        branchs: [],
        branch: '',
        serviceTypes: [],
        serviceType: '',
        services: [],
        sername: '',
        checkbox: false,
        servzdid: ''
      },
      goodDialog: {
        title: '选择产品',
        visible: false,
        branchs: [],
        branch: '',
        productTypes: [],
        productType: '',
        products: [],
        goodname: '',
        checkbox: false,
        clevel: '',
        index: -1
      },
      packDialog: {
        title: '选择套餐',
        visible: false,
        brandId: '',
        pcodename: '',
        packages: [],
        checkbox: false
      },
      couponDialog: {
        title: '选择优惠券',
        visible: false,
        brandId: '',
        cpcodename: '',
        coupons: [],
        checkbox: false
      },
      couponDialog2: {
        title: '选择优惠券',
        visible: false,
        cpcodename: '',
        brandId: '',
        coupons: [],
        checkbox: false,
        type: '1',
        clevel: '1'
      },
      couponDialog3: {
        title: '选择优惠券',
        visible: false,
        brandId: '',
        cpcodename: '',
        coupons: [],
        checkbox: false
      },
      couponDialog4: {
        title: '选择优惠券',
        visible: false,
        brandId: '',
        cpcodename: '',
        coupons: [],
        checkbox: false
      },
      serviceAllType: [],
      productAllType: [],
      redenvs: [],
      brandId: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterShopList: [],
      allShopList: [],
      form: {
        package: '',
        shop: '',
        brand: '',
        status: '1',
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      classifi: [
        { name: '按项目', value: '1' },
        { name: '按分类', value: '2' }
      ],
      selectShopData: []
    }
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
    changeCustom(e, item) {
      this.mktactivForm.mktactivRules.forEach(rule => {
        //rule.recharge.presale = rule.recharge.ispresale==="1"?true:false;
        if (rule.recharge.isCustom) {
          rule.recharge.customMoney = 1
        }
      })
      this.$forceUpdate()
    },
    //活动
    showAdd() {
      this.showList = false
      this.isDisabled = true
      this.mktactivForm.ptype = '1'
      this.$nextTick(() => {
        if (this.$refs['mktactivForm']) {
          this.$refs['mktactivForm'].resetFields()
        }
      })
      this.resetForm()
    },
    //编辑
    showEdit(row, value) {
      this.showList = false
      this.isDisabled = true
      this.isEditPd = row.isBirthday == '1'
      this.resetForm()
      this.isSelect = value
      this.mktactivForm.id = row.id
      this.mktactivForm.billcode = row.billcode
      this.mktactivForm.status = row.status
      this.mktactivForm.brandId = row.brandId + ''
      this.mktactivForm.brandName = row.brandName
      this.mktactivForm.brandCode = row.brandCode
      this.mktactivForm.name = row.name
      this.mktactivForm.matype = row.matype
      this.mktactivForm.memo = row.memo
      this.mktactivForm.discount = row.discount
      this.mktactivForm.timeType = row.timeType
      this.mktactivForm.sdate = ''
      this.mktactivForm.edate = ''
      this.mktactivForm.mktdate = []
      this.mktactivForm.expType = true
      if (row.timeType == '2') {
        this.mktactivForm.expType = false
        this.mktactivForm.sdate = row.sdate
        this.mktactivForm.edate = row.edate
        this.mktactivForm.mktdate = [row.sdate, row.edate]
      }
      this.mktactivForm.useshopType = row.useshopType
      this.mktactivForm.shoplist = row.shoplist
      this.mktactivForm.clevel = row.clevel
      if (this.mktactivForm.matype == '1') {
        this.mktactivForm.redenvs = yid.util.deepClone(row.redenvs)
        this.mktactivForm.mktactivRules = []
        this.mktactivForm.packages = []
        this.mktactivForm.coupons = []
      }
      if (this.mktactivForm.matype == '2') {
        this.mktactivForm.ckdate = []
        this.mktactivForm.relatime = ''
        this.mktactivForm.cktype = row.cktype
        this.mktactivForm.ckdatetype = row.ckdatetype
        let isPnum = row.isPnum == '1' ? true : false
        this.mktactivForm.isPnum = isPnum
        this.mktactivForm.pnum = row.pnum
        let isNopaytype = row.isNopaytype == '1' ? true : false
        this.mktactivForm.isNopaytype = isNopaytype
        if (row.ckdatetype) {
          this.mktactivForm.ckdatetype = row.ckdatetype
          if (row.ckdatetype == '1') {
            this.mktactivForm.ckdate = [row.cksdate, row.ckedate]
          }
          if (row.ckdatetype == '2') {
            this.mktactivForm.relatime = row.relatime
          }
        }
        this.mktactivForm.packages = []
        this.mktactivForm.redenvs = []
        this.mktactivForm.coupons = []
        this.mktactivForm.nopaytypes = yid.util.deepClone(row.nopaytypes)
        this.mktactivForm.mktactivRules = yid.util.deepClone(row.mktactivRules)
        this.mktactivForm.mktactivRules.forEach(rule => {
          //rule.recharge.presale = rule.recharge.ispresale==="1"?true:false;
          this.$set(
            rule.recharge,
            'presale',
            rule.recharge.ispresale === '1' ? true : false
          )
          if (rule.recharge.customMoney == 1) {
            rule.recharge.isCustom = true
          } else {
            rule.recharge.isCustom = false
          }
        })
        this.mktactivForm.firstOrderFlag = row.firstOrder == '1' ? true : false
        if (this.mktactivForm.firstOrderFlag) {
          this.editCktypeFlag = true
        } else {
          this.editCktypeFlag = false
        }
      }
      if (this.mktactivForm.matype == '3') {
        this.mktactivForm.packages = yid.util.deepClone(row.packages)
        this.mktactivForm.redenvs = yid.util.deepClone(row.redenvs)
        this.mktactivForm.coupons = yid.util.deepClone(row.coupons)
        this.mktactivForm.mktactivRules = []
        let isPnum = row.isPnum == '1' ? true : false
        this.mktactivForm.isPnum = isPnum
        this.mktactivForm.pnum = row.pnum
        let isNopaytype = row.isNopaytype == '1' ? true : false
        this.mktactivForm.nopaytypes = yid.util.deepClone(row.nopaytypes)
        this.mktactivForm.isNopaytype = isNopaytype
      }
      if (this.mktactivForm.matype == '4') {
        let isJe = row.isJe == '1' ? true : false
        this.mktactivForm.isJe = isJe
        this.mktactivForm.minje = row.minje
        let isServzd = row.isServzd == '1' ? true : false
        this.mktactivForm.isServzd = isServzd
        this.mktactivForm.servzdids = row.servzdids
        this.mktactivForm.ptype = row.ptype
        this.mktactivForm.pvalue = row.pvalue
        this.mktactivForm.maxsub = row.maxsub
        if (yid.util.isEmpty(row.priority)) {
          this.mktactivForm.priority = '0'
        } else {
          this.mktactivForm.priority = row.priority
        }
        let isPnum = row.isPnum == '1' ? true : false
        this.mktactivForm.isPnum = isPnum
        this.mktactivForm.pnum = row.pnum
        let isShared = row.isShared == '1' ? true : false
        this.mktactivForm.isShared = isShared
        let isPd = row.isPd == '1' ? true : false
        this.mktactivForm.isPd = isPd
        let isNopaytype = row.isNopaytype == '1' ? true : false
        this.mktactivForm.isNopaytype = isNopaytype
        let isBirthday = row.isBirthday == '1' ? true : false
        this.mktactivForm.isBirthday = isBirthday
        this.mktactivForm.minpdnum = row.minpdnum
        this.mktactivForm.redenvs3 = yid.util.deepClone(row.redenvs3)
        this.mktactivForm.coupons3 = yid.util.deepClone(row.coupons3)
        this.mktactivForm.servs3 = yid.util.deepClone(row.servs3)
        this.mktactivForm.nopaytypes = yid.util.deepClone(row.nopaytypes)
        this.mktactivForm.zscomlist = yid.util.deepClone(row.zscomlist)
        this.mktactivForm.couponZsdiffs = yid.util.deepClone(row.couponZsdiffs)
        this.mktactivForm.redenvZsdiffs = yid.util.deepClone(row.redenvZsdiffs)
        this.mktactivForm.mktactivRules = []
        //取最大的servzdid
        const servzdids = []
        if (this.mktactivForm.zscomlist.length > 0) {
          this.mktactivForm.zscomlist.forEach(e => {
            servzdids.push(Number(e.servzdid))
            if (e.zscoms.length > 0) {
              e.type = e.zscoms[0].type.toString()
            }
          })
        }
        if (servzdids.length > 0) {
          let maxid = Math.max(...servzdids)
          this.mktactivForm.servzdid = maxid
        } else {
          this.mktactivForm.servzdid = 0
        }
      }
    },
    //复制
    copyTemplate(row, value) {
      this.showList = false
      this.isDisabled = true
      this.isEditPd = false
      this.resetForm()
      this.isSelect = value
      this.mktactivForm.billcode = row.billcode
      this.mktactivForm.status = row.status
      this.mktactivForm.brandId = row.brandId + ''
      this.mktactivForm.brandName = row.brandName
      this.mktactivForm.brandCode = row.brandCode
      this.mktactivForm.matype = row.matype
      this.mktactivForm.memo = row.memo
      this.mktactivForm.discount = row.discount
      this.mktactivForm.sdate = ''
      this.mktactivForm.edate = ''
      this.mktactivForm.mktdate = []
      this.mktactivForm.useshopType = row.useshopType
      this.mktactivForm.shoplist = row.shoplist
      if (this.mktactivForm.matype == '1') {
        this.mktactivForm.redenvs = yid.util.deepClone(row.redenvs)
        this.mktactivForm.mktactivRules = []
        this.mktactivForm.packages = []
        this.mktactivForm.coupons = []
        this.mktactivForm.mktactivRules.push({
          clevel: this.mktactivForm.clevel,
          recharge: {
            money: '',
            giftMoney: '',
            rulename: '',
            presale: false,
            minMoney: '',
            customMoney: '',
            highestMoney: '',
            isCustom: false
          },
          servs: [],
          products: []
        })
      }
      if (this.mktactivForm.matype == '2') {
        this.mktactivForm.clevel = row.clevel
        this.mktactivForm.ckdate = []
        this.mktactivForm.relatime = ''
        this.mktactivForm.cktype = row.cktype
        let isPnum = row.isPnum == '1' ? true : false
        this.mktactivForm.isPnum = isPnum
        this.mktactivForm.pnum = row.pnum
        let isNopaytype = row.isNopaytype == '1' ? true : false
        this.mktactivForm.isNopaytype = isNopaytype
        this.mktactivForm.ckdatetype = row.ckdatetype
        if (row.ckdatetype) {
          this.mktactivForm.ckdatetype = row.ckdatetype
          if (row.ckdatetype == '1') {
            this.mktactivForm.ckdate = [row.cksdate, row.ckedate]
          }
          if (row.ckdatetype == '2') {
            this.mktactivForm.relatime = row.relatime
          }
        }
        this.mktactivForm.packages = []
        this.mktactivForm.redenvs = []
        this.mktactivForm.coupons = []
        this.mktactivForm.mktactivRules = yid.util.deepClone(row.mktactivRules)
        this.mktactivForm.mktactivRules.forEach(rule => {
          //rule.recharge.presale = rule.recharge.ispresale==="1"?true:false;
          this.$set(
            rule.recharge,
            'presale',
            rule.recharge.ispresale === '1' ? true : false
          )
          if (rule.recharge.customMoney == 1) {
            rule.recharge.isCustom = true
          } else {
            rule.recharge.isCustom = false
          }
        })
        this.mktactivForm.firstOrderFlag = row.firstOrder == '1' ? true : false
        if (this.mktactivForm.firstOrderFlag) {
          this.editCktypeFlag = true
        } else {
          this.editCktypeFlag = false
        }
      }
      if (this.mktactivForm.matype == '3') {
        this.mktactivForm.packages = yid.util.deepClone(row.packages)
        this.mktactivForm.redenvs = yid.util.deepClone(row.redenvs)
        this.mktactivForm.coupons = yid.util.deepClone(row.coupons)
        let isPnum = row.isPnum == '1' ? true : false
        this.mktactivForm.isPnum = isPnum
        this.mktactivForm.pnum = row.pnum
        let isNopaytype = row.isNopaytype == '1' ? true : false
        this.mktactivForm.isNopaytype = isNopaytype
        this.mktactivForm.mktactivRules = []
        this.mktactivForm.mktactivRules.push({
          clevel: this.mktactivForm.clevel,
          recharge: {
            money: '',
            giftMoney: '',
            rulename: '',
            presale: false,
            minMoney: '',
            customMoney: '',
            highestMoney: '',
            isCustom: false
          },
          servs: [],
          products: []
        })
      }
      if (this.mktactivForm.matype == '4') {
        let isJe = row.isJe == '1' ? true : false
        this.mktactivForm.is_je = isJe
        this.mktactivForm.minje = row.minje
        let isServzd = row.isServzd == '1' ? true : false
        this.mktactivForm.isServzd = isServzd
        this.mktactivForm.servzdids = row.servzdids
        this.mktactivForm.ptype = row.ptype
        this.mktactivForm.pvalue = row.pvalue
        this.mktactivForm.maxsub = row.maxsub
        if (yid.util.isEmpty(row.priority)) {
          this.mktactivForm.priority = '0'
        } else {
          this.mktactivForm.priority = row.priority
        }
        let isPnum = row.isPnum == '1' ? true : false
        this.mktactivForm.isPnum = isPnum
        this.mktactivForm.pnum = row.pnum
        let isShared = row.isShared == '1' ? true : false
        this.mktactivForm.isShared = isShared
        let isPd = row.isPd == '1' ? true : false
        this.mktactivForm.isPd = isPd
        let isNopaytype = row.isNopaytype == '1' ? true : false
        this.mktactivForm.isNopaytype = isNopaytype
        let isBirthday = row.isBirthday == '1' ? true : false
        this.mktactivForm.isBirthday = isBirthday
        this.mktactivForm.minpdnum = row.minpdnum
        this.mktactivForm.redenvs3 = yid.util.deepClone(row.redenvs3)
        this.mktactivForm.coupons3 = yid.util.deepClone(row.coupons3)
        this.mktactivForm.servs3 = yid.util.deepClone(row.servs3)
        this.mktactivForm.nopaytypes = yid.util.deepClone(row.nopaytypes)
        this.mktactivForm.zscomlist = yid.util.deepClone(row.zscomlist)
        this.mktactivForm.couponZsdiffs = yid.util.deepClone(row.couponZsdiffs)
        this.mktactivForm.redenvZsdiffs = yid.util.deepClone(row.redenvZsdiffs)
        this.mktactivForm.mktactivRules = []
        this.mktactivForm.mktactivRules.push({
          clevel: this.mktactivForm.clevel,
          recharge: {
            money: '',
            giftMoney: '',
            rulename: '',
            presale: false,
            minMoney: '',
            customMoney: '',
            highestMoney: '',
            isCustom: false
          },
          servs: [],
          products: []
        })
        //取最大的servzdid
        const servzdids = []
        if (this.mktactivForm.zscomlist.length > 0) {
          this.mktactivForm.zscomlist.forEach(e => {
            servzdids.push(Number(e.servzdid))
          })
        }
        if (servzdids.length > 0) {
          let maxid = Math.max(...servzdids)
          this.mktactivForm.servzdid = maxid
        } else {
          this.mktactivForm.servzdid = 0
        }
      }
    },
    cancel() {
      this.showList = true
      this.resetForm()
    },
    //其他
    resetForm() {
      this.mktactivForm.id = ''
      this.mktactivForm.status = ''
      this.mktactivForm.billcode = ''
      this.mktactivForm.brandId = ''
      this.mktactivForm.brandName = ''
      this.mktactivForm.brandCode = ''
      this.mktactivForm.name = ''
      this.mktactivForm.matype = ''
      this.mktactivForm.cktype = '0'
      this.mktactivForm.ckdate = []
      this.mktactivForm.ckdatetype = ''
      this.mktactivForm.relatime = ''
      this.mktactivForm.memo = ''
      this.mktactivForm.timeType = '2'
      this.mktactivForm.sdate = ''
      this.mktactivForm.edate = ''
      this.mktactivForm.firstOrder = ''
      this.mktactivForm.firstOrderFlag = false
      this.mktactivForm.mktdate = []
      this.mktactivForm.expType = false
      this.mktactivForm.useshopType = '2'
      this.mktactivForm.shoplist = []
      this.mktactivForm.discount = '100'
      this.mktactivForm.priority = '0'
      this.mktactivForm.clevel = 0
      this.mktactivForm.servzdid = 0
      this.mktactivForm.redenvs = []
      this.mktactivForm.packages = []
      this.mktactivForm.coupons = []
      this.mktactivForm.mktactivRules = []
      this.mktactivForm.isJe = ''
      this.mktactivForm.minje = ''
      this.mktactivForm.isServzd = ''
      this.mktactivForm.servzdids = ''
      this.mktactivForm.ptype = ''
      this.mktactivForm.pvalue = ''
      this.mktactivForm.maxsub = 0
      this.mktactivForm.isPnum = ''
      this.mktactivForm.pnum = ''
      this.mktactivForm.isShared = ''
      this.mktactivForm.isPd = ''
      this.mktactivForm.isBirthday = ''
      this.mktactivForm.isNopaytype = ''
      this.mktactivForm.minpdnum = ''
      this.mktactivForm.clevel = parseInt(this.mktactivForm.clevel) + 1
      this.mktactivForm.mktactivRules.push({
        clevel: this.mktactivForm.clevel,
        recharge: {
          money: '',
          giftMoney: '',
          rulename: '',
          presale: false,
          minMoney: '',
          customMoney: '',
          highestMoney: '',
          isCustom: false
        },
        redenvs: [],
        coupons: [],
        servs: [],
        products: []
      })
      this.mktactivForm.zscomlist = []
      this.mktactivForm.coupons3 = []
      this.mktactivForm.couponZsdiffs = []
      this.mktactivForm.redenvs3 = []
      this.mktactivForm.redenvZsdiffs = []
      this.mktactivForm.servs3 = []
      this.mktactivForm.nopaytypes = []
    },
    editCktype() {
      if (this.mktactivForm.firstOrderFlag) {
        this.mktactivForm.cktype = '0'
        this.editCktypeFlag = true
      } else {
        this.editCktypeFlag = false
      }
    },
    addRule() {
      this.mktactivForm.clevel = parseInt(this.mktactivForm.clevel) + 1
      this.mktactivForm.mktactivRules.push({
        clevel: this.mktactivForm.clevel,
        recharge: {
          money: '',
          giftMoney: '',
          rulename: '',
          presale: false,
          minMoney: '',
          customMoney: '',
          highestMoney: '',
          isCustom: false
        },
        redenvs: [],
        coupons: [],
        servs: [],
        products: []
      })
    },
    deleteRule(clevel) {
      if (this.mktactivForm.clevel == 1) {
        yid.util.error('至少保留一个活动规则')
        return
      } else {
        this.mktactivForm.clevel = parseInt(this.mktactivForm.clevel) - 1
        this.mktactivForm.mktactivRules.forEach((rule, index) => {
          if (clevel == rule.clevel) {
            this.mktactivForm.mktactivRules.splice(index, 1)
          }
        })
      }
    },
    addZscom() {
      if (this.mktactivForm.zscomlist.length >= 5) {
        yid.util.error('最多添加5个指定项目组')
        return false
      }
      this.mktactivForm.servzdid = parseInt(this.mktactivForm.servzdid) + 1
      this.mktactivForm.zscomlist.push({
        servzdid: this.mktactivForm.servzdid,
        zscoms: [],
        type: '1'
      })
    },
    deleteZscom(servzdid) {
      yid.util.confirm('确定要删除该项目组合吗？', '', '', () => {
        this.mktactivForm.servzdid = parseInt(this.mktactivForm.servzdid) - 1
        this.mktactivForm.zscomlist.forEach((rule, index) => {
          if (servzdid == rule.servzdid) {
            this.mktactivForm.zscomlist.splice(index, 1)
          }
        })
      })
    },
    saveMktactiv(status) {
      const that = this
      this.$refs['mktactivForm'].validate(valid => {
        if (valid) {
          if (that.mktactivForm.timeType == '') {
            yid.util.error('请选择开始时间和结束时间，或者长期')
            return
          }
          if (
            that.mktactivForm.timeType == '2' &&
            that.mktactivForm.mktdate.length == 0
          ) {
            yid.util.error('请选择开始时间和结束时间')
            return
          }
          if (that.mktactivForm.shoplist.length == 0) {
            yid.util.error('请选择至少一个活动门店')
            return
          }
          if (that.mktactivForm.timeType == '2') {
            that.mktactivForm.sdate = that.mktactivForm.mktdate[0]
            that.mktactivForm.edate = that.mktactivForm.mktdate[1]
          }
          that.mktactivForm.status = status

          let errmsg = '5001'
          //使用门店类型：所有门店
          if (that.mktactivForm.matype == '1') {
            //生日赠送
            that.mktactivForm.firstOrder = ''
            that.mktactivForm.useshopType = '2' //默认：所有门店
            if (that.mktactivForm.redenvs.length == 0) {
              yid.util.error('请选择至少一个红包')
              return
            }
          } else if (that.mktactivForm.matype == '2') {
            //开卡充值赠送
            if (that.mktactivForm.firstOrderFlag) {
              that.mktactivForm.firstOrder = '1'
            } else {
              that.mktactivForm.firstOrder = '0'
            }
            if (that.mktactivForm.cktype == '1') {
              // 可累计
              if (that.mktactivForm.ckdatetype == '1') {
                // 固定时间
                if (that.mktactivForm.ckdate.length > 0) {
                  that.mktactivForm.cksdate = that.mktactivForm.ckdate[0]
                  that.mktactivForm.ckedate = that.mktactivForm.ckdate[1]
                } else {
                  yid.util.error('请选择固定时间')
                  return
                }
              } else if (that.mktactivForm.ckdatetype == '2') {
                //相对时间
                if (!that.mktactivForm.relatime) {
                  yid.util.error('请输入相对时间')
                  return
                }
              } else {
                yid.util.error('请选择可累计查询时间')
                return
              }
            }
            let czmoney = []
            try {
              if (that.mktactivForm.mktactivRules.length == 0) {
                errmsg = '没有设置活动规则,请添加!'
                throw new Error(errmsg)
              }
              if (yid.util.isEmpty(that.mktactivForm.isPnum)) {
                that.mktactivForm.isPnum = '0'
              } else {
                that.mktactivForm.isPnum = '1'
              }
              if (this.mktactivForm.isNopaytype) {
                if (this.mktactivForm.nopaytypes.length == 0) {
                  yid.util.error(
                    "勾选了'不支持使用以下支付方式'后必须添加一个或多个支付方式!"
                  )
                  return false
                }
              }
              if (yid.util.isEmpty(this.mktactivForm.isNopaytype)) {
                that.mktactivForm.isNopaytype = '0'
              } else {
                this.mktactivForm.isNopaytype = '1'
              }
              that.mktactivForm.mktactivRules.forEach((rule, index) => {
                let text = '第' + (index + 1) + '级别：'
                if (!rule.recharge.rulename) {
                  errmsg = text + '规则名称不能为空!'
                  throw new Error(errmsg)
                }
                if (String(rule.recharge.money) == '') {
                  errmsg = text + '开卡充值金额不能为空!'
                  throw new Error(errmsg)
                }
                if (rule.recharge.isCustom) {
                  rule.recharge.customMoney = 1
                } else {
                  rule.recharge.customMoney = 0
                  czmoney.push(rule.recharge.money)
                  if (
                    rule.recharge.giftMoney === '' &&
                    rule.redenvs.length == 0 &&
                    rule.servs.length == 0 &&
                    rule.products.length == 0
                  ) {
                    errmsg = text + '赠送金，红包，项目，产品至少选择一个!'
                    throw new Error(errmsg)
                  }
                }
                if (that.mktactivForm.cktype === '1') {
                  //可累计
                  rule.recharge.ispresale = rule.recharge.presale ? '1' : '0'
                } else {
                  //不可累计
                  rule.recharge.ispresale = '0'
                }
                let message = ''
                rule.servs.forEach(item => {
                  let temp = ''
                  if (!item.totalNum) {
                    temp += '次数没填，'
                  }
                  if (!item.pprice) {
                    temp += '总价没填，'
                  }
                  if (
                    !item.timenum &&
                    !item.timeType2Checked &&
                    !item.timeType3Checked
                  ) {
                    temp += '有效期没选填，'
                  }
                  if (item.timeType3Checked && !item.edate) {
                    temp += '截止日期没填，'
                  }
                  if (temp) {
                    temp = temp.substring(0, temp.length - 1)
                    message += item.servname + '：' + temp + '；'
                  }
                })
                if (message) {
                  errmsg = text + message
                  throw new Error(errmsg)
                }
                message = ''
                rule.products.forEach(item => {
                  let temp = ''
                  if (!item.totalNum) {
                    temp += '次数没填，'
                  }
                  if (!item.pprice) {
                    temp += '总价没填，'
                  }
                  if (
                    !item.timenum &&
                    !item.timeType2Checked &&
                    !item.timeType3Checked
                  ) {
                    temp += '有效期没选填，'
                  }
                  if (item.timeType3Checked && !item.edate) {
                    temp += '截止日期没填，'
                  }
                  if (temp) {
                    temp = temp.substring(0, temp.length - 1)
                    message += item.pname + '：' + temp + '；'
                  }
                })
                if (message) {
                  errmsg = text + message
                  throw new Error(errmsg)
                }
              })
            } catch (e) {
              yid.util.error(errmsg)
              return
            }
            //判断充值金额大小
            /*try{
                                let tmoney = 0;
                                czmoney.forEach((item,index) =>{
                                    let text = "第"+(index+1)+"级别"
                                    if(index==0){
                                        tmoney = item;
                                    }else{
                                        if(parseFloat(item) <= parseFloat(tmoney)){
                                            errmsg = "开卡充值金额："+text +"必须大于第"+(index)+"级别；";
                                            throw new Error(errmsg)
                                        }else{
                                            tmoney = item;
                                        }
                                    }
                                })
                            }catch(e){
                                yid.util.error(errmsg)
                                return
                            }*/

            // if(!that.mktactivForm.memo){
            //     errmsg = "活动描述不能为空";
            //     yid.util.error(errmsg)
            //     return;
            // }
            if (that.mktactivForm.memo) {
              if (that.mktactivForm.memo.length > 2000) {
                errmsg = '活动描述最大长度为2000'
                yid.util.error(errmsg)
                return
              }
            }
          } else if (that.mktactivForm.matype == '3') {
            //购买套餐赠送
            that.mktactivForm.firstOrder = ''
            if (yid.util.isEmpty(that.mktactivForm.isPnum)) {
              that.mktactivForm.isPnum = '0'
            } else {
              that.mktactivForm.isPnum = '1'
            }
            if (this.mktactivForm.isNopaytype) {
              if (this.mktactivForm.nopaytypes.length == 0) {
                yid.util.error(
                  "勾选了'不支持使用以下支付方式'后必须添加一个或多个支付方式!"
                )
                return false
              }
            }
            if (yid.util.isEmpty(this.mktactivForm.isNopaytype)) {
              that.mktactivForm.isNopaytype = '0'
            } else {
              this.mktactivForm.isNopaytype = '1'
            }
            if (that.mktactivForm.packages.length == 0) {
              yid.util.error('请选择至少一个套餐')
              return
            }
            if (
              that.mktactivForm.coupons.length == 0 &&
              that.mktactivForm.redenvs.length == 0
            ) {
              yid.util.error('红包，优惠券至少选择一个！')
              return
            }
            // if(!that.mktactivForm.memo){
            //     yid.util.error("活动描述不能为空")
            //     return;
            // }
            if (that.mktactivForm.memo) {
              if (that.mktactivForm.memo.length > 1500) {
                yid.util.error('活动描述最大长度为1500')
                return
              }
            }
          } else if (that.mktactivForm.matype == '4') {
            //服务开单活动
            if (
              yid.util.isEmpty(that.mktactivForm.minje) &&
              yid.util.isEmpty(that.mktactivForm.zscomlist)
            ) {
              yid.util.error('触发条件必须选中一项!')
              return false
            }
            if (that.mktactivForm.zscomlist.length > 0) {
              let flag = false
              for (var i = 0; i < that.mktactivForm.zscomlist.length; i++) {
                if (that.mktactivForm.zscomlist[i].zscoms.length == 0) {
                  flag = true
                }
              }
              if (flag) {
                yid.util.error('指定项目组合中必须添加一个或多少项目!')
                return false
              }
            }
            if (!yid.util.isEmpty(that.mktactivForm.pvalue)) {
              if (that.mktactivForm.ptype == '2') {
                if (Number(that.mktactivForm.pvalue) > 10) {
                  yid.util.error('折扣请输入10以内的数字')
                  return false
                }
              }
              if (Number(that.mktactivForm.pvalue) <= 0) {
                yid.util.error('折扣/固定金额请输入大于0的数字')
                return false
              }
              if (Number(that.mktactivForm.maxsub) < 0) {
                yid.util.error('最高减额请输入大于0的数字')
                return false
              }
            }
            let message = ''
            that.mktactivForm.servs3.forEach(item => {
              let temp = ''
              if (!item.totalNum) {
                temp += '次数没填，'
              }
              if (!item.pprice) {
                temp += '总价没填，'
              }
              if (
                !item.timenum &&
                !item.timeType2Checked &&
                !item.timeType3Checked
              ) {
                temp += '有效期没选填，'
              }
              if (item.timeType3Checked && !item.edate) {
                temp += '截止日期没填，'
              }
              if (temp) {
                temp = temp.substring(0, temp.length - 1)
                message += item.servname + '：' + temp + '；'
              }
            })
            if (message) {
              errmsg = message
              yid.util.error(errmsg)
              return false
            }
            if (this.mktactivForm.isNopaytype) {
              if (this.mktactivForm.nopaytypes.length == 0) {
                yid.util.error(
                  "勾选了'不支持使用以下支付方式'后必须添加一个或多个支付方式!"
                )
                return false
              }
            }
            if (yid.util.isEmpty(that.mktactivForm.isJe)) {
              that.mktactivForm.isJe = '0'
            } else {
              that.mktactivForm.isJe = '1'
            }
            if (yid.util.isEmpty(that.mktactivForm.isServzd)) {
              that.mktactivForm.isServzd = '0'
            } else {
              that.mktactivForm.isServzd = '1'
            }
            if (yid.util.isEmpty(that.mktactivForm.isPnum)) {
              that.mktactivForm.isPnum = '0'
            } else {
              that.mktactivForm.isPnum = '1'
            }
            if (yid.util.isEmpty(that.mktactivForm.isShared)) {
              that.mktactivForm.isShared = '0'
            } else {
              that.mktactivForm.isShared = '1'
            }
            if (yid.util.isEmpty(that.mktactivForm.isPd)) {
              that.mktactivForm.isPd = '0'
            } else {
              that.mktactivForm.isPd = '1'
            }
            if (yid.util.isEmpty(this.mktactivForm.isNopaytype)) {
              that.mktactivForm.isNopaytype = '0'
            } else {
              this.mktactivForm.isNopaytype = '1'
            }
            if (yid.util.isEmpty(that.mktactivForm.isBirthday)) {
              that.mktactivForm.isBirthday = '0'
            } else {
              that.mktactivForm.isBirthday = '1'
            }
            that.mktactivForm.firstOrder = ''
          }
          if (errmsg == '5001') {
            console.log(this.mktactivForm)
            this.isDisabled = true
            service.chain.mktactiv.saveMktactiv(this.mktactivForm).then(res => {
              if (res.resp_code == '200') {
                //this.cancel();
                yid.util.success(res.resp_msg)
                this.querylist()
              } else {
                yid.util.error(res.resp_msg)
              }
              this.showList = true
            })
          }
        }
      })
    },
    querylist() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.mktactivTable.Pagination.internalPageSize
      const fetch = service.chain.mktactiv.findList
      const params = { ...this.pageInfo, ...this.searchForm }
      this.$refs.mktactivTable.reloadData({
        fetch,
        params
      })
    },
    resetSearchForm() {
      this.searchForm = {
        name: '',
        matype: '',
        status: '',
        brandId: '',
        shop: ''
      }
      this.querylist()
    },
    clearMemo() {
      this.mktactivForm.memo = ''
    },
    updateStatus(id, status) {
      let params = {
        id: id,
        status: status
      }
      if (status == '2') {
        service.chain.mktactiv.updateStatus(params).then(res => {
          if (res.resp_code == 200) {
            yid.util.success('操作成功！')
            this.querylist()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      } else if (status == '3') {
        yid.util.confirm('确定要暂停该活动吗？', '', '', () => {
          service.chain.mktactiv.updateStatus(params).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('操作成功！')
              this.querylist()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
        })
      }
    },
    changBrnad() {
      this.mktactivForm.shoplist = []
      this.mktactivForm.redenvs = []
      this.mktactivForm.packages = []
      this.mktactivForm.coupons = []
      this.brands.map(item => {
        if (this.mktactivForm.brandId == item.id) {
          this.mktactivForm.brandName = item.name
          this.mktactivForm.brandCode = item.code
        }
      })
    },
    //门店
    selectShop() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择门店')
        return
      }
      if (!this.mktactivForm.name) {
        yid.util.error('请输入活动名称，再选择门店')
        return
      }
      this.type = '1'
      isClear(this.shopDialog)
      this.shopData = []
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      this.shopDialog.id = this.mktactivForm.id
      this.shopDialog.name = this.mktactivForm.name
      this.shopDialog.shoplist = this.mktactivForm.shoplist
      this.shopDialog.brand = this.mktactivForm.brandId
    },
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
    deleteShop(row, name) {
      yid.util.confirm(
        '删除【' +
          row.shopname +
          '】后，本店将不再参与【' +
          name +
          '】且已参与的赠送在本店也不能继续使用，确定要删除吗？',
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
    setShops() {
      this.mktactivForm.shoplist = this.shopDialog.shoplist
      this.shopDialog.visible = false
    },
    handleSelectionChangeShop(rows) {
      this.selectShops = rows
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
    //红包
    selectRedenv() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.redenvDialog)
      this.redenvDialog.visible = true
      this.redenvDialog.title = '选择红包'
      this.redenvDialog.redenvs = []
      this.redenvDialog.brandId = this.mktactivForm.brandId
      this.redenvDialog.redname = ''
      this.redenvDialog.clevel = '1'
      this.redenvDialog.checkbox = false
      this.queryRedenv()
    },
    selectRedenv3() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.redenvDialog3)
      this.redenvDialog3.visible = true
      this.redenvDialog3.title = '选择红包'
      this.redenvDialog3.redenvs = []
      this.redenvDialog3.brandId = this.mktactivForm.brandId
      this.redenvDialog3.redname = ''
      this.redenvDialog3.clevel = '1'
      this.redenvDialog3.checkbox = false
      this.queryRedenv3()
    },
    selectRedenv4() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.redenvDialog4)
      this.redenvDialog4.visible = true
      this.redenvDialog4.title = '选择红包'
      this.redenvDialog4.redenvs = []
      this.redenvDialog4.brandId = this.mktactivForm.brandId
      this.redenvDialog4.redname = ''
      this.redenvDialog4.clevel = '1'
      this.redenvDialog4.checkbox = false
      this.queryRedenv4()
    },
    handleSelectionChangeRedenv(row) {
      this.selectRedenvs = row
    },
    queryRedenv() {
      const params = {
        rname: this.redenvDialog.rname,
        brandId: this.redenvDialog.brandId,
        isOnline: '0'
      }
      service.chain.redEnvelopeInfo.queryRedenv(params).then(res => {
        this.redenvDialog.redenvs = res.data
      })
    },
    queryRedenv3() {
      const params = {
        rname: this.redenvDialog3.rname,
        brandId: this.redenvDialog3.brandId,
        isOnline: '0'
      }
      service.chain.redEnvelopeInfo.queryRedenv(params).then(res => {
        this.redenvDialog3.redenvs = res.data
      })
    },
    queryRedenv4() {
      const params = {
        rname: this.redenvDialog4.rname,
        brandId: this.redenvDialog4.brandId,
        isOnline: '0'
      }
      service.chain.redEnvelopeInfo.queryRedenv(params).then(res => {
        this.redenvDialog4.redenvs = res.data
      })
    },
    setRedenv() {
      this.selectRedenvs.forEach((item, index) => {
        let flag = true
        //                    this.mktactivForm.redenvs.forEach(red =>{
        //                        if(item.id==red.redid){
        //                            flag=false;
        //                        }
        //                    })
        if (flag) {
          this.mktactivForm.redenvs.push({
            clevel: this.redenvDialog.clevel,
            marid: '',
            redid: item.id,
            redcode: item.rcode,
            redname: item.rname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule
          })
        }
      })
      this.redenvDialog.visible = false
    },
    setRedenv3() {
      this.selectRedenvs.forEach((item, index) => {
        let flag = true
        //                    this.mktactivForm.redenvs.forEach(red =>{
        //                        if(item.id==red.redid){
        //                            flag=false;
        //                        }
        //                    })
        if (flag) {
          this.mktactivForm.redenvs3.push({
            marid: '',
            redid: item.id,
            redcode: item.rcode,
            redname: item.rname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule
          })
        }
      })
      this.redenvDialog3.visible = false
    },
    setRedenv4() {
      this.selectRedenvs.forEach((item, index) => {
        let flag = true
        //                    this.mktactivForm.redenvs.forEach(red =>{
        //                        if(item.id==red.redid){
        //                            flag=false;
        //                        }
        //                    })
        if (flag) {
          this.mktactivForm.redenvZsdiffs.push({
            marid: '',
            redid: item.id,
            redcode: item.rcode,
            redname: item.rname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule
          })
        }
      })
      this.redenvDialog4.visible = false
    },
    deleteRedenv(redid) {
      yid.util.confirm('确定删除此红包？', '', '', () => {
        this.mktactivForm.redenvs.forEach((item, index) => {
          if (redid == item.redid) {
            this.mktactivForm.redenvs.splice(index, 1)
          }
        })
      })
    },
    deleteRedenv3(redid) {
      yid.util.confirm('确定删除此红包？', '', '', () => {
        this.mktactivForm.redenvs3.forEach((item, index) => {
          if (redid == item.redid) {
            this.mktactivForm.redenvs3.splice(index, 1)
          }
        })
      })
    },
    deleteRedenv4(redid) {
      yid.util.confirm('确定删除此红包？', '', '', () => {
        this.mktactivForm.redenvZsdiffs.forEach((item, index) => {
          if (redid == item.redid) {
            this.mktactivForm.redenvZsdiffs.splice(index, 1)
          }
        })
      })
    },
    //红包222--开卡充值赠送
    selectRedenv2(clevel) {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.redenvDialog2)
      this.redenvDialog2.visible = true
      this.redenvDialog2.title = '选择红包'
      this.redenvDialog2.clevel = clevel
      this.redenvDialog2.redenvs = []
      this.redenvDialog2.brandId = this.mktactivForm.brandId
      this.redenvDialog2.redname = ''
      this.redenvDialog2.checkbox = false
      this.queryRedenv2()
    },
    handleSelectionChangeRedenv2(row) {
      this.selectRedenvs = row
    },
    queryRedenv2() {
      const params = {
        rname: this.redenvDialog.rname,
        brandId: this.redenvDialog.brandId,
        isOnline: '0'
      }
      service.chain.redEnvelopeInfo.queryRedenv(params).then(res => {
        this.redenvDialog2.redenvs = res.data
      })
    },
    setRedenv2() {
      const that = this
      let reds = []
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.redenvDialog2.clevel == rule.clevel) {
          reds = rule.redenvs
        }
      })
      let len = reds.length
      that.selectRedenvs.forEach((item, index) => {
        let flag = true
        //                    reds.forEach(red =>{
        //                        if(item.id==red.redid){
        //                            flag=false;
        //                        }
        //                    })
        if (flag) {
          reds.push({
            clevel: this.redenvDialog2.clevel,
            rindex: len + index + 1,
            redid: item.id,
            redcode: item.rcode,
            redname: item.rname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule
          })
        }
      })
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.redenvDialog2.clevel == rule.clevel) {
          rule.redenvs = reds
        }
      })
      this.redenvDialog2.visible = false
    },
    deleteRedenv2(clevel, rindex) {
      yid.util.confirm('确定删除此红包？', '', '', () => {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (clevel == rule.clevel) {
            rule.redenvs.forEach((item, index2) => {
              if (rindex == item.rindex) {
                rule.redenvs.splice(index2, 1)
              }
            })
          }
        })
      })
    },
    //优惠券
    selectCoupon2(clevel) {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.couponDialog2)
      this.couponDialog2.visible = true
      this.couponDialog2.title = '选择优惠券'
      this.couponDialog2.clevel = clevel
      this.couponDialog2.coupons = []
      this.couponDialog2.brandId = this.mktactivForm.brandId
      this.couponDialog2.cpcodename = ''
      this.couponDialog2.checkbox = false
      this.queryCoupon2()
    },
    handleSelectionChangeCoupon2(row) {
      this.selectCoupons = row
    },
    queryCoupon2() {
      const params = {
        cpcodename: this.couponDialog2.cpcodename,
        brandId: this.couponDialog2.brandId,
        isOnline: '0'
      }
      service.chain.coupon.queryCoupon(params).then(res => {
        this.couponDialog2.coupons = res.data
      })
    },
    setCoupons2() {
      const that = this
      let coupons = []
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.couponDialog2.clevel == rule.clevel) {
          coupons = rule.coupons
        }
      })
      let len = coupons.length
      that.selectCoupons.forEach((item, index) => {
        let flag = true
        /*coupons.forEach(coup =>{
                        if(item.id==coup.cpid){
                            flag=false;
                        }
                    })*/
        if (flag) {
          coupons.push({
            clevel: this.couponDialog2.clevel,
            cindex: len + index + 1,
            cpid: item.id,
            cpcode: item.cpcode,
            cpname: item.cpname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule
          })
        }
      })
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.couponDialog2.clevel == rule.clevel) {
          rule.coupons = coupons
        }
      })
      this.couponDialog2.visible = false
    },
    deleteCoupon2(clevel, cindex) {
      yid.util.confirm('确定删除此优惠券？', '', '', () => {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (clevel == rule.clevel) {
            rule.coupons.forEach((item, index2) => {
              if (cindex == item.cindex) {
                rule.coupons.splice(index2, 1)
              }
            })
          }
        })
      })
    },
    //项目
    selectServ(clevel) {
      this.servDialog.visible = true
      this.servDialog.branch = ''
      this.servDialog.branchs = []
      this.servDialog.serviceType = ''
      this.servDialog.serviceTypes = []
      this.servDialog.checkbox = false
      this.servDialog.clevel = clevel
      this.branchs.forEach(item => {
        this.servDialog.branchs.push({ ...item })
      })
      this.servDialog.services.forEach(item => {
        item.type = false
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (clevel == rule.clevel) {
            rule.servs.forEach(item2 => {
              if (item.servid == item2.servid) {
                item.type = true
              }
            })
          }
        })
      })
    },
    //项目2
    selectServ2(servzdid, type) {
      if (type == '1') {
        this.servDialog2.visible = true
        this.servDialog2.branch = ''
        this.servDialog2.branchs = []
        this.servDialog2.serviceType = ''
        this.servDialog2.serviceTypes = []
        this.servDialog2.checkbox = false
        this.servDialog2.servzdid = servzdid
        this.branchs.forEach(item => {
          this.servDialog2.branchs.push({ ...item })
        })
        this.servDialog2.services.forEach(item => {
          item.type = false
          this.mktactivForm.zscomlist.forEach(rule => {
            if (servzdid == rule.servzdid) {
              rule.zscoms.forEach(item2 => {
                if (item.servid == item2.servid) {
                  item.type = true
                }
              })
            }
          })
        })
      } else {
        this.servDialog4.visible = true
        this.servDialog4.branch = ''
        this.servDialog4.branchs = []
        this.servDialog4.checkbox = false
        this.servDialog4.servzdid = servzdid
        this.branchs.forEach(item => {
          this.servDialog4.branchs.push({ ...item })
        })
        this.servDialog4.serviceTypes.forEach(item => {
          item.type = false
          this.mktactivForm.zscomlist.forEach(rule => {
            if (servzdid == rule.servzdid) {
              rule.zscoms.forEach(item2 => {
                if (item.id == item2.servid.toString()) {
                  item.type = true
                }
              })
            }
          })
        })
      }
    },
    selectType(e, val) {
      this.$forceUpdate()
    },
    //项目3
    selectServ3() {
      this.servDialog3.visible = true
      this.servDialog3.branch = ''
      this.servDialog3.branchs = []
      this.servDialog3.serviceType = ''
      this.servDialog3.serviceTypes = []
      this.servDialog3.checkbox = false
      this.branchs.forEach(item => {
        this.servDialog3.branchs.push({ ...item })
      })
      this.servDialog3.services.forEach(item => {
        item.type = false
        this.mktactivForm.servs3.forEach(rule => {
          if (rule.servid == item.servid) {
            item.type = true
          }
        })
      })
    },
    selectPaytype() {
      this.paytypeDialog.visible = true
      this.paytypeDialog.payMold = ''
      this.paytypeDialog.payMolds = []
      this.paytypeDialog.checkbox = false
      this.payMolds.forEach(item => {
        this.paytypeDialog.payMolds.push({ ...item })
      })
      this.paytypeDialog.paytypes.forEach(item => {
        item.type = false
        this.mktactivForm.nopaytypes.forEach(rule => {
          if (rule.paycode == item.paycode) {
            item.type = true
          }
        })
      })
    },
    // timeType=2:年月日
    checkServPrice(val) {
      if (val) {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (val == rule.clevel) {
            rule.servs.forEach(item => {
              if (item.timenum) {
                item.timeType = '2'
                item.timeunit = '1'
                item.timeType2Checked = false //年月日
                item.timeType3Checked = false //固定日期
                item.edate = ''
              }
            })
          }
        })
      }
    },
    // timeType=1:长期
    changSerstime(val) {
      if (val) {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (val == rule.clevel) {
            rule.servs.forEach(item => {
              if (item.timeType2Checked) {
                item.timeType = '1'
                item.timenum = ''
                item.timeunit = '1'
                item.timeType3Checked = false //长期
                item.edate = ''
              }
            })
          }
        })
      }
    },
    changSerstime3() {
      this.mktactivForm.servs3.forEach(item => {
        if (item.timeType2Checked) {
          item.timeType = '1'
          item.timenum = ''
          item.timeunit = '1'
          item.timeType3Checked = false //长期
          item.edate = ''
        }
      })
    },
    // timeType=3：固定日期
    changSersdate(val) {
      if (val) {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (val == rule.clevel) {
            rule.servs.forEach(item => {
              if (item.timeType3Checked) {
                item.timeType = '3'
                item.timeType2Checked = false //年月日
                item.timenum = ''
                item.timeunit = '1'
                item.edate = ''
              } else {
                item.edate = ''
              }
            })
          }
        })
      }
    },
    changSersdate3() {
      this.mktactivForm.servs3.forEach(item => {
        if (item.timeType3Checked) {
          item.timeType = '3'
          item.timeType2Checked = false //年月日
          item.timenum = ''
          item.timeunit = '1'
          item.edate = ''
        } else {
          item.edate = ''
        }
      })
    },
    deleteServ(clevel, id) {
      yid.util.confirm('确定删除此项目？', '', '', () => {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (clevel == rule.clevel) {
            rule.servs.forEach((item, index) => {
              if (id == item.servid) {
                rule.servs.splice(index, 1)
              }
            })
          }
        })
      })
    },
    deleteServ2(servzdid, id) {
      yid.util.confirm('确定删除此项目？', '', '', () => {
        this.mktactivForm.zscomlist.forEach(rule => {
          if (servzdid == rule.servzdid) {
            rule.zscoms.forEach((item, index) => {
              if (id == item.servid) {
                rule.zscoms.splice(index, 1)
              }
            })
          }
        })
      })
    },
    deleteServ3(id) {
      yid.util.confirm('确定删除此项目？', '', '', () => {
        this.mktactivForm.servs3.forEach((item, index) => {
          if (id == item.servid) {
            this.mktactivForm.servs3.splice(index, 1)
          }
        })
      })
    },
    deletePaytype(id) {
      yid.util.confirm('确定删除此支付方式？', '', '', () => {
        this.mktactivForm.nopaytypes.forEach((item, index) => {
          if (id == item.payid) {
            this.mktactivForm.nopaytypes.splice(index, 1)
          }
        })
      })
    },
    setServs() {
      const that = this
      let servs = []
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.servDialog.clevel == rule.clevel) {
          servs = rule.servs
        }
      })
      that.servDialog.services.forEach(item => {
        if (
          item.type &&
          (!that.servDialog.branch || item.branch == that.servDialog.branch) &&
          (!that.servDialog.serviceType ||
            item.servtid == that.servDialog.serviceType)
        ) {
          let flag = true
          servs.forEach(serv => {
            if (item.servid == serv.servid) {
              flag = false
            }
          })
          if (flag) {
            servs.push({
              clevel: that.servDialog.clevel,
              servid: item.servid,
              servcode: item.sdcode,
              servname: item.sdname,
              pprice: '',
              totalNum: '',
              timeType: '2',
              timeType2Checked: false,
              timeType3Checked: false,
              timenum: '',
              timeunit: '1',
              edate: ''
            })
          }
        }
      })
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.servDialog.clevel == rule.clevel) {
          rule.servs = servs
        }
      })
      that.servDialog.visible = false
    },
    setServs2(tag) {
      if (tag == 1) {
        const that = this
        let zscoms = []
        that.mktactivForm.zscomlist.forEach(rule => {
          if (that.servDialog2.servzdid == rule.servzdid) {
            if (rule.zscoms.length > 0) {
              if (rule.zscoms[0].type == 1) {
                zscoms = rule.zscoms
              }
            }
          }
        })
        that.servDialog2.services.forEach(item => {
          if (
            item.type &&
            (!that.servDialog2.branch ||
              item.branch == that.servDialog2.branch) &&
            (!that.servDialog2.serviceType ||
              item.servtid == that.servDialog2.serviceType)
          ) {
            let flag = true
            zscoms.forEach(serv => {
              if (item.servid == serv.servid) {
                flag = false
              }
            })
            if (flag) {
              zscoms.push({
                servzdid: that.servDialog2.servzdid,
                servid: item.servid,
                servcode: item.sdcode,
                servname: item.sdname,
                type: tag
              })
            }
          }
        })
        that.mktactivForm.zscomlist.forEach(rule => {
          if (that.servDialog2.servzdid == rule.servzdid) {
            rule.zscoms = zscoms
          }
        })
        that.servDialog2.visible = false
      } else {
        let zscoms = []
        this.mktactivForm.zscomlist.forEach(rule => {
          if (this.servDialog4.servzdid == rule.servzdid) {
            if (rule.zscoms.length > 0) {
              if (rule.zscoms[0].type == 2) {
                zscoms = rule.zscoms
              }
            }
          }
        })
        this.servDialog4.serviceTypes.forEach(item => {
          if (
            item.type &&
            (!this.servDialog4.branch ||
              item.branch.toString() == this.servDialog4.branch)
          ) {
            let flag = true
            zscoms.forEach(serv => {
              if (item.id == serv.servid) {
                flag = false
              }
            })
            if (flag) {
              zscoms.push({
                servzdid: this.servDialog4.servzdid,
                servid: item.id,
                servcode: item.scode,
                servname: item.sname,
                type: tag
              })
            }
          }
        })
        this.mktactivForm.zscomlist.forEach(rule => {
          if (this.servDialog4.servzdid == rule.servzdid) {
            rule.zscoms = zscoms
          }
        })
        this.servDialog4.visible = false
      }
    },
    setServs3() {
      const that = this
      let servs3 = this.mktactivForm.servs3

      that.servDialog3.services.forEach(item => {
        if (
          item.type &&
          (!that.servDialog3.branch ||
            item.branch == that.servDialog3.branch) &&
          (!that.servDialog3.serviceType ||
            item.servtid == that.servDialog3.serviceType)
        ) {
          let flag = true
          servs3.forEach(serv => {
            if (item.servid == serv.servid) {
              flag = false
            }
          })
          if (flag) {
            servs3.push({
              servid: item.servid,
              servcode: item.sdcode,
              servname: item.sdname,
              pprice: '',
              totalNum: '',
              timeType: '2',
              timeType2Checked: false,
              timeType3Checked: false,
              timenum: '',
              timeunit: '1',
              edate: ''
            })
          }
        }
      })

      that.mktactivForm.servs3 = servs3

      that.servDialog3.visible = false
    },
    setpaytypes() {
      const that = this
      let nopaytypes = this.mktactivForm.nopaytypes

      that.paytypeDialog.paytypes.forEach(item => {
        if (
          item.type &&
          (!that.paytypeDialog.payMold ||
            item.ptid == that.paytypeDialog.payMold)
        ) {
          let flag = true
          nopaytypes.forEach(paytype => {
            if (item.id == paytype.payid) {
              flag = false
            }
          })
          if (flag) {
            nopaytypes.push({
              payid: item.id,
              paycode: item.paycode,
              payname: item.payname
            })
          }
        }
      })

      that.mktactivForm.nopaytypes = nopaytypes

      that.paytypeDialog.visible = false
    },
    checkServ(val) {
      this.servDialog.services.forEach(item => {
        if (!this.servDialog.branch) {
          item.type = val
        } else if (this.servDialog.branch == item.branch) {
          item.type = val
        }
      })
    },
    checkPaytype(val) {
      this.paytypeDialog.paytypes.forEach(item => {
        if (!this.paytypeDialog.payMold) {
          item.type = val
        } else if (this.paytypeDialog.payMold == item.payMold) {
          item.type = val
        }
      })
    },
    checkSer2(val) {
      this.servDialog2.services.forEach(item => {
        if (!this.servDialog2.branch) {
          item.type = val
        } else if (this.servDialog2.branch == item.branch) {
          item.type = val
        }
      })
    },
    checkSer3(val) {
      this.servDialog3.services.forEach(item => {
        if (!this.servDialog3.branch) {
          item.type = val
        } else if (this.servDialog3.branch == item.branch) {
          item.type = val
        }
      })
    },
    checkSer4(val) {
      this.servDialog4.serviceTypes.forEach(item => {
        if (!this.servDialog4.branch) {
          item.type = val
        } else if (this.servDialog4.branch == item.branch.toString()) {
          item.type = val
        }
      })
    },
    changeBranch(id, type) {
      if (type == '1') {
        this.servDialog.serviceType = ''
        this.servDialog.serviceTypes = []
        this.serviceAllType.forEach(item => {
          if (id == item.branch) {
            this.servDialog.serviceTypes.push(item)
          }
        })
      }
      if (type == '2') {
        this.goodDialog.productType = ''
        this.goodDialog.productTypes = []
        this.productAllType.forEach(item => {
          if (id == String(item.bbid)) {
            this.goodDialog.productTypes.push(item)
          }
        })
      }
    },
    changeBranch2(id, type) {
      if (type == '1') {
        this.servDialog2.serviceType = ''
        this.servDialog2.serviceTypes = []
        this.serviceAllType.forEach(item => {
          if (id == item.branch) {
            this.servDialog2.serviceTypes.push(item)
          }
        })
      } else {
        this.servDialog4.serviceType = ''
        this.servDialog4.serviceTypes = []
        this.serviceAllType.forEach(item => {
          if (id == item.branch) {
            if (item.branch == '1') {
              item.branchName = '美发组'
              this.servDialog4.serviceTypes.push(item)
            }
            if (item.branch == '2') {
              item.branchName = '美容组'
              this.servDialog4.serviceTypes.push(item)
            }
            if (item.branch == '3') {
              item.branchName = '综合组'
              this.servDialog4.serviceTypes.push(item)
            }
          }
        })
      }
    },
    changeBranch3(id, type) {
      if (type == '1') {
        this.servDialog3.serviceType = ''
        this.servDialog3.serviceTypes = []
        this.serviceAllType.forEach(item => {
          if (id == item.branch) {
            this.servDialog3.serviceTypes.push(item)
          }
        })
      }
    },

    selectOk(e, val) {
      if (val.type) {
        val.type = true
      } else {
        val.type = false
      }
      this.$forceUpdate()
    },
    //产品
    selectGood(clevel) {
      this.goodDialog.visible = true
      this.goodDialog.branch = ''
      this.goodDialog.branchs = []
      this.goodDialog.productType = ''
      this.goodDialog.productTypes = []
      this.goodDialog.clevel = clevel
      this.goodDialog.checkbox = false
      this.branchs.forEach(item => {
        this.goodDialog.branchs.push({ ...item })
      })
      this.goodDialog.products.forEach(item => {
        item.type = false
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (clevel == rule.clevel) {
            rule.products.forEach(item2 => {
              if (item.pid == item2.pid) {
                item.type = true
              }
            })
          }
        })
      })
    },
    checkGoodPrice(val) {
      if (val) {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (val == rule.clevel) {
            rule.products.forEach(item => {
              if (item.timenum) {
                item.timeType = '2'
                item.timeType2Checked = false
                item.timeType3Checked = false
                item.edate = ''
              }
            })
          }
        })
      }
    },
    changGoodtime(val) {
      if (val) {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (val == rule.clevel) {
            rule.products.forEach(item => {
              if (item.timeType2Checked) {
                item.timeType = '1'
                item.timeType3Checked = false
                item.edate = ''
                item.timenum = ''
                item.timeunit = '1'
              }
            })
          }
        })
      }
    },
    changGooddate(val) {
      if (val) {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (val == rule.clevel) {
            rule.products.forEach(item => {
              if (item.timeType3Checked) {
                item.timeType = '3'
                item.timeType2Checked = false
                item.timenum = ''
                item.timeunit = '1'
              } else {
                item.edate = ''
              }
            })
          }
        })
      }
    },
    deleteGood(clevel, id) {
      yid.util.confirm('确定删除此项目？', '', '', () => {
        this.mktactivForm.mktactivRules.forEach(rule => {
          if (clevel == rule.clevel) {
            rule.products.forEach((item, index) => {
              if (id == item.pid) {
                rule.products.splice(index, 1)
              }
            })
          }
        })
      })
    },
    changeBirthday() {
      if (this.mktactivForm.isBirthday) {
        this.mktactivForm.isPd = false
        this.isEditPd = true
      } else {
        this.isEditPd = false
      }
    },
    setGoods() {
      const that = this
      let products = []
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.goodDialog.clevel == rule.clevel) {
          products = rule.products
        }
      })
      that.goodDialog.products.forEach(item => {
        if (
          item.type &&
          (!that.goodDialog.branch || item.branch == that.goodDialog.branch) &&
          (!that.goodDialog.productType ||
            item.servtid == that.goodDialog.productType)
        ) {
          let flag = true
          products.forEach(prod => {
            if (item.pid == prod.pid) {
              flag = false
            }
          })
          if (flag) {
            products.push({
              clevel: that.goodDialog.clevel,
              pid: item.pid,
              pcode: item.sdcode,
              pname: item.sdname,
              pprice: '',
              totalNum: '',
              timeType: '2',
              timeType2Checked: false,
              timeType3Checked: false,
              timenum: '',
              timeunit: '1',
              edate: ''
            })
          }
        }
      })
      that.mktactivForm.mktactivRules.forEach(rule => {
        if (that.goodDialog.clevel == rule.clevel) {
          rule.products = products
        }
      })
      that.goodDialog.visible = false
    },
    checkGood(val) {
      this.goodDialog.products.forEach(item => {
        if (!this.goodDialog.branch) {
          item.type = val
        } else if (this.goodDialog.branch == item.branch) {
          item.type = val
        }
      })
    },
    //套餐
    selectPack() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择套餐')
        return
      }
      isClear(this.packDialog)
      this.packDialog.visible = true
      this.packDialog.brandId = this.mktactivForm.brandId
      this.packDialog.pcodename = ''
      this.packDialog.packages = []
      this.packDialog.checkbox = false
      let temp = []
      this.packages.forEach(item => {
        if (item.brand + '' == this.packDialog.brandId) {
          temp.push({
            brandId: item.brand + '',
            brandname: item.brandname,
            spid: item.id + '',
            spcode: item.spcode,
            spname: item.spname,
            type: false
          })
        }
      })
      this.packDialog.packages = temp
      this.packDialog.packages.forEach(item => {
        item.type = false
        this.mktactivForm.packages.forEach(pack => {
          if (pack.spid == item.spid) {
            item.type = true
          }
        })
      })
    },
    checkPack(val) {
      this.packDialog.packages.forEach(item => {
        if (!this.packDialog.pcodename) {
          item.type = val
        } else if (
          this.packDialog.pcodename == item.spcode ||
          item.spname.indexOf(this.packDialog.pcodename) != -1
        ) {
          item.type = val
        }
      })

      //console.log(this.packDialog.packages)
    },
    deletePack(id) {
      yid.util.confirm('确定删除此套餐？', '', '', () => {
        this.mktactivForm.packages.forEach((item, index) => {
          if (id == item.spid) {
            this.mktactivForm.packages.splice(index, 1)
          }
        })
      })
    },
    setPacks() {
      const that = this
      that.packDialog.packages.forEach(item => {
        if (
          item.type &&
          (!that.packDialog.brandId || item.brandId == that.packDialog.brandId)
        ) {
          let flag = true
          that.mktactivForm.packages.forEach(red => {
            if (item.spid == red.spid) {
              flag = false
            }
          })
          if (flag) {
            that.mktactivForm.packages.push({
              brandId: item.brandId,
              brandname: item.brandname,
              spid: item.spid,
              spcode: item.spcode,
              spname: item.spname
            })
          }
        }
      })
      that.packDialog.visible = false
    },
    //优惠券
    selectCoupon() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.couponDialog)
      this.couponDialog.visible = true
      this.couponDialog.title = '选择优惠券'
      this.couponDialog.coupons = []
      this.couponDialog.brandId = this.mktactivForm.brandId
      this.couponDialog.cpcodename = ''
      this.couponDialog.checkbox = false
      this.queryCoupon()
    },
    //优惠券
    selectCoupon3() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.couponDialog3)
      this.couponDialog3.visible = true
      this.couponDialog3.title = '选择优惠券'
      this.couponDialog3.coupons = []
      this.couponDialog3.brandId = this.mktactivForm.brandId
      this.couponDialog3.cpcodename = ''
      this.couponDialog3.checkbox = false
      this.queryCoupon3()
    },
    addFirstzd() {
      if (!yid.util.isEmpty(this.mktactivForm.isServzd)) {
        if (this.mktactivForm.zscomlist.length == 0) {
          this.addZscom()
        }
      } else {
        if (this.mktactivForm.zscomlist.length == 1) {
          //如果只加了一条取消勾选就清空
          this.mktactivForm.zscomlist = []
          this.mktactivForm.servzdid = 0
        }
      }
    },
    //优惠券
    selectCoupon4() {
      if (!this.mktactivForm.brandId) {
        yid.util.error('请选择品牌，再选择红包')
        return
      }
      isClear(this.couponDialog4)
      this.couponDialog4.visible = true
      this.couponDialog4.title = '选择优惠券'
      this.couponDialog4.coupons = []
      this.couponDialog4.brandId = this.mktactivForm.brandId
      this.couponDialog4.cpcodename = ''
      this.couponDialog4.checkbox = false
      this.queryCoupon4()
    },
    handleSelectionChangeCoupon(row) {
      this.selectCoupons = row
    },
    queryCoupon() {
      const params = {
        cpcodename: this.couponDialog.cpcodename,
        brandId: this.couponDialog.brandId,
        isOnline: '0'
      }
      service.chain.coupon.queryCoupon(params).then(res => {
        this.couponDialog.coupons = res.data
      })
    },
    queryCoupon3() {
      const params = {
        cpcodename: this.couponDialog3.cpcodename,
        brandId: this.couponDialog3.brandId,
        isOnline: '0'
      }
      service.chain.coupon.queryCoupon(params).then(res => {
        this.couponDialog3.coupons = res.data
      })
    },
    queryCoupon4() {
      const params = {
        cpcodename: this.couponDialog4.cpcodename,
        brandId: this.couponDialog4.brandId,
        isOnline: '0'
      }
      service.chain.coupon.queryCoupon(params).then(res => {
        this.couponDialog4.coupons = res.data
      })
    },
    setCoupons() {
      //let coupons = [];
      this.selectCoupons.forEach(item => {
        let flag = true
        /*this.mktactivForm.coupons.forEach(red =>{
                        if(item.id==red.cpid){
                            flag=false;
                        }
                    })*/
        if (flag) {
          this.mktactivForm.coupons.push({
            marid: '',
            cpid: item.id,
            cpcode: item.cpcode,
            cpname: item.cpname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule,
            brandId: item.brandId,
            brandName: item.brandName
          })
        }
      })
      this.couponDialog.visible = false
    },
    setCoupons3() {
      //let coupons = [];
      this.selectCoupons.forEach(item => {
        let flag = true
        /*this.mktactivForm.coupons.forEach(red =>{
                        if(item.id==red.cpid){
                            flag=false;
                        }
                    })*/
        if (flag) {
          this.mktactivForm.coupons3.push({
            marid: '',
            cpid: item.id,
            cpcode: item.cpcode,
            cpname: item.cpname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule,
            brandId: item.brandId,
            brandName: item.brandName
          })
        }
      })
      this.couponDialog3.visible = false
    },
    setCoupons4() {
      //let coupons = [];
      this.selectCoupons.forEach(item => {
        let flag = true
        /*this.mktactivForm.coupons.forEach(red =>{
                        if(item.id==red.cpid){
                            flag=false;
                        }
                    })*/
        if (flag) {
          this.mktactivForm.couponZsdiffs.push({
            marid: '',
            cpid: item.id,
            cpcode: item.cpcode,
            cpname: item.cpname,
            status: item.status,
            expTime: item.expTime,
            rule: item.rule,
            brandId: item.brandId,
            brandName: item.brandName
          })
        }
      })
      this.couponDialog4.visible = false
    },
    deleteCoupon(id) {
      yid.util.confirm('确定删除此优惠券？', '', '', () => {
        this.mktactivForm.coupons.forEach((item, index) => {
          if (id == item.cpid) {
            this.mktactivForm.coupons.splice(index, 1)
          }
        })
      })
    },
    deleteCoupon3(id) {
      yid.util.confirm('确定删除此优惠券？', '', '', () => {
        this.mktactivForm.coupons3.forEach((item, index) => {
          if (id == item.cpid) {
            this.mktactivForm.coupons3.splice(index, 1)
          }
        })
      })
    },
    deleteCoupon4(id) {
      yid.util.confirm('确定删除此优惠券？', '', '', () => {
        this.mktactivForm.couponZsdiffs.forEach((item, index) => {
          if (id == item.cpid) {
            this.mktactivForm.couponZsdiffs.splice(index, 1)
          }
        })
      })
    },
    changMktdate(val) {
      if (val) {
        this.mktactivForm.expType = false
        this.mktactivForm.timeType = '2'
      }
    },
    changMktdate2(val) {
      if (val) {
        this.mktactivForm.mktdate = []
        this.mktactivForm.timeType = '1'
      } else {
        this.mktactivForm.timeType = '2'
      }
    },
    dateFormat: function (row) {
      if (row.timeType == '1') {
        return '长期'
      }
      const sdate = row.sdate
      const edate = row.edate
      if (!sdate || !edate) {
        return ''
      }
      return yid.util.formatDate(sdate) + ' ~ ' + yid.util.formatDate(edate)
    },
    changeCkdatetype() {
      if (this.mktactivForm.ckdatetype == '1') {
        this.mktactivForm.relatime = ''
      }
      if (this.mktactivForm.ckdatetype == '2') {
        this.mktactivForm.ckdate = []
      }
    },
    init() {
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        this.brands = res.data
      })
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
      /*service.chain.servShop.findregions({status:'1',parentId:'-1'}).then(res => {
                    this.regions = res.data
                });*/
      service.chain.region.treeAll({ status: '1' }).then(res => {
        this.regions = res.data
      })
      service.serviceInfo.findbranch({ status: '1' }).then(res => {
        this.branchs = res.data
      })
      service.servicepackage.servinfo({ status: '1' }).then(res => {
        this.servDialog.services = res.data
        let servDialoga = JSON.parse(JSON.stringify(this.servDialog.services))
        this.servDialog2.services = servDialoga
        let servDialogb = JSON.parse(JSON.stringify(this.servDialog.services))
        this.servDialog3.services = servDialogb
      })
      service.servicepackage.product({ status: '1' }).then(res => {
        this.goodDialog.products = res.data
      })
      service.serviceInfo.findServiceType({ status: '1' }).then(res => {
        this.serviceAllType = res.data
        this.serviceAllType.forEach(item => {
          if (item.branch == 1) {
            item.branchName = '美发组'
            this.servDialog4.serviceTypes.push(item)
          }
          if (item.branch == 2) {
            item.branchName = '美容组'
            this.servDialog4.serviceTypes.push(item)
          }
          if (item.branch == 3) {
            item.branchName = '综合组'
            this.servDialog4.serviceTypes.push(item)
          }
        })
      })
      service.serviceInfo.findProductType({ status: '1' }).then(res => {
        this.productAllType = res.data
      })
      service.chain.servicepackage
        .findAll({ isDel: '0', status: '1' })
        .then(res => {
          this.packages = res.data
        })
      service.chain.payTypeInfo.getPayInfoList({ enable: '1' }).then(res => {
        this.paytypes = res.data
        let paytypesd = JSON.parse(JSON.stringify(this.paytypes))
        this.paytypeDialog.paytypes = paytypesd
      })
      service.pay.queryPaysMolds().then(res => {
        this.payMolds = res.data
      })
      this.querylist()
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
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shop == '') {
          this.searchForm.shop = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    filterBrand(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.brandId) {
          if (item.brandId.indexOf(v) !== -1) return true
        } else {
          return false
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
    isSelectNum(val) {
      if (val) {
        this.mktactivForm.pnum = 1
      } else {
        this.mktactivForm.pnum = ''
      }
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    screenService() {
      return function (item) {
        let flag = true
        if (this.servDialog.branch) {
          if (this.servDialog.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servDialog.serviceType) {
          if (this.servDialog.serviceType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servDialog.sername) {
          if (
            item.sdname.indexOf(this.servDialog.sername) !== -1 ||
            item.sdcode.indexOf(this.servDialog.sername) !== -1
          ) {
            flag = true
          } else {
            flag = false
          }
        }
        if (!flag) {
          item.type = false
        }
        return flag
      }
    },
    screenService2() {
      return function (item) {
        let flag = true
        if (this.servDialog2.branch) {
          if (this.servDialog2.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servDialog2.serviceType) {
          if (this.servDialog2.serviceType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servDialog2.sername) {
          if (
            item.sdname.indexOf(this.servDialog2.sername) !== -1 ||
            item.sdcode.indexOf(this.servDialog2.sername) !== -1
          ) {
            flag = true
          } else {
            flag = false
          }
        }
        if (!flag) {
          item.type = false
        }
        return flag
      }
    },
    screenService3() {
      return function (item) {
        let flag = true
        if (this.servDialog3.branch) {
          if (this.servDialog3.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servDialog3.serviceType) {
          if (this.servDialog3.serviceType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servDialog3.sername) {
          if (
            item.sdname.indexOf(this.servDialog3.sername) !== -1 ||
            item.sdcode.indexOf(this.servDialog3.sername) !== -1
          ) {
            flag = true
          } else {
            flag = false
          }
        }
        if (!flag) {
          item.type = false
        }
        return flag
      }
    },
    //   screenService4(){
    //     return function(item){
    //     let flag=true
    //     if(this.servDialog4.branch){
    //       if(this.servDialog4.branch == item.branch){
    //         flag=true
    //       }else{
    //         flag=false
    //       }
    //     }
    //     if(this.servDialog4.serviceTypes){
    //       if(this.servDialog4.serviceTypes == item.servtid){
    //         flag=true
    //       }else{
    //         flag=false
    //       }
    //     }
    //     // if(this.servDialog2.sername){
    //     //   if( item.sdname.indexOf(this.servDialog2.sername) !== -1 ||
    //     //       item.sdcode.indexOf(this.servDialog2.sername) !== -1){
    //     //     flag=true
    //     //   }else{
    //     //     flag=false
    //     //   }
    //     // }
    //     if(!flag){
    //       item.type=false
    //     }
    //     return flag
    //   }
    // },
    screenPaytype() {
      return function (item) {
        let flag = true
        if (this.paytypeDialog.payMold) {
          if (this.paytypeDialog.payMold == item.ptid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (!flag) {
          item.type = false
        }
        return flag
      }
    },
    screenProduct() {
      return function (item) {
        let flag = true
        if (this.goodDialog.branch) {
          if (this.goodDialog.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.goodDialog.productType) {
          if (this.goodDialog.productType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.goodDialog.goodname) {
          if (
            item.sdname.indexOf(this.goodDialog.goodname) !== -1 ||
            item.sdcode.indexOf(this.goodDialog.goodname) !== -1
          ) {
            flag = true
          } else {
            flag = false
          }
        }
        if (!flag) {
          item.type = false
        }
        return flag
      }
    },
    screenPackage() {
      return function (item) {
        let flag = true
        if (!this.packDialog.pcodename) {
          return flag
        }
        if (
          this.packDialog.pcodename == item.spcode ||
          item.spname.indexOf(this.packDialog.pcodename) != -1
        ) {
          flag = true
        } else {
          flag = false
        }
        if (!flag) {
          item.type = false
        }
        return flag
      }
    }
  }
}
</script>

<style scoped lang="scss">
.serve-table {
  th,
  td {
    padding-left: 10px;
    text-align: left;
  }

  .el-checkbox {
    margin-right: 15px;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: textfield;
}

input[type='number'] {
  -moz-appearance: textfield;
}

.walletitem {
  background-color: #f2f2f2;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 0 0 15px 0;
  display: flex;
  width: 820px;

  /deep/ .el-input__inner {
    padding-right: 0;
    padding-left: 5px;
  }

  &.ser {
    flex-direction: column;
    //width: 820px;
  }

  &.ser1 {
    flex-direction: inherit;
    flex-wrap: wrap;
    //width: 820px;
  }

  &.pack {
    flex-direction: column;

    .pitem {
      display: flex;

      label {
        flex: 1;
      }
    }
  }

  .iconshanchu {
    width: 30px;
    font-size: 20px;
    color: #999999;
    padding-top: 5px;
    cursor: pointer;
  }

  .right {
    flex: 1;
  }

  .item {
    display: flex;
    margin-bottom: 10px;

    &.first {
      text-align: left;
      padding-left: 10px;
    }

    .one {
      flex: 1;
    }

    .two,
    .three {
      width: 100px;
    }

    .four {
      width: 400px;
    }
  }

  .item1 {
    display: flex;
    margin-bottom: 10px;
  }
}

.rechargeitem {
  border: 1px #cccccc solid;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 15px;
  width: 920px;

  ul,
  li {
    margin: 0;
    padding: 0;
  }
}
</style>
