<template>
    <div>
        <el-row>
            <el-button @click="back" type="primary">返回</el-button>
            <el-button v-show="showButton"  @click="saveBill" type="primary" style="margin-left: 60px">保存</el-button>
            <el-button v-show="showButton" @click="auditBill" type="primary">确认提交</el-button>
            <el-button v-show="showButton" @click="censorforM" type="primary">免回访</el-button>
        </el-row>
        <el-form ref="billForm" :model="billForm" style="margin-top: 16px; padding-bottom: 20px" label-width="100px" label-position="right">
            <el-row>
                <span><b>单据编码：</b>{{billForm.billcode}}</span>
                <span style="margin-left: 80px"><b>店号：</b>{{billForm.shopcode}}</span>
                <span style="margin-left: 80px"><b>会员姓名：</b>{{billForm.memname}}</span>
                <span style="margin-left: 80px"><b>会员手机号：</b>{{billForm.mobile}}</span>
                <span style="margin-left: 80px"><b>会员id：</b>{{billForm.memid}}</span>
            </el-row>
            <el-row style="margin-top: 10px">
                <b>是否跨店承担退款：</b>
                <el-radio v-model="billForm.isKd" disabled label="0">否</el-radio>
                <el-radio v-model="billForm.isKd" disabled label="1">是</el-radio>
                <el-tooltip class="item" effect="dark" content="当跨店承担为否，则其他门店批次的卡金不可选中退款" placement="right-start">
                    <i class="icon iconfont el-icon-question"></i>
                </el-tooltip>
            </el-row>
            <el-row style="margin-top: 10px; font-size: 16px"><b>退款明细:</b></el-row>
            <div style="position:relative;">
                <el-tabs v-model="activetab">
                    <el-tab-pane :label="'会员储值卡'+billForm.cards.length" name="first">
                        <div>
                            <yid-table :data="billForm.cards" ref="hycards" :row-class-name="rowClass"  height="300">
                                <yid-table-column label="卡号" min-width="140" prop="cardno"></yid-table-column>
                                <yid-table-column label="卡名称" min-width="120" prop="cardname"></yid-table-column>
                                <yid-table-column label="卡金余额" min-width="120" prop="money"></yid-table-column>
                                <yid-table-column label="赠送金余额" min-width="140" prop="gmoney"></yid-table-column>
                                <yid-table-column label="批次门店" min-width="250">
                                    <template slot-scope="scope">{{scope.row.shopcode+' '+ scope.row.shopname}}</template>
                                </yid-table-column>
                                <yid-table-column label="注销卡金额度" min-width="150" prop="tkje"></yid-table-column>
                                <yid-table-column label="注销赠送金额度" min-width="150" prop="tzje"></yid-table-column>
                            </yid-table>
                            <div style="display: flex; justify-content: space-between; padding: 15px 0">
                                <span style="color: #00AAEE; cursor: pointer" @click="showDetail('cards')">查看卡金明细</span>

                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'可用套餐'+billForm.packages.length" name="second">
                        <div>
                            <yid-table :data="billForm.packages"  ref="hypackages" :row-class-name="rowClass" height="300">
                                <yid-table-column label="套餐名称" min-width="140" prop="packageinfoname"></yid-table-column>
                                <yid-table-column label="项目/产品名称" prop="servname"></yid-table-column>
                                <yid-table-column label="所属门店" min-width="250">
                                    <template slot-scope="scope">{{scope.row.shopcode+' '+ scope.row.shopname}}</template>
                                </yid-table-column>
                                <yid-table-column label="所属卡号" min-width="100" prop="cardno"></yid-table-column>
                                <yid-table-column label="总次数" min-width="60" prop="total"></yid-table-column>
                                <yid-table-column label="剩余次数" min-width="60" prop="snum"></yid-table-column>
                                <yid-table-column label="剩余金额" min-width="70" prop="lessmoney"></yid-table-column>
                                <yid-table-column label="到期日期" min-width="150" prop="expiryTime"></yid-table-column>
                                <yid-table-column label="批次单价" min-width="70" prop="singlePrice"></yid-table-column>
                                <yid-table-column label="注销项目次数" min-width="100" property="tkpackageNum"></yid-table-column>
                                <yid-table-column label="注销项目金额" min-width="100" prop="tkpackageje"></yid-table-column>
                            </yid-table>
                            <div style="display: flex; justify-content: space-between; padding: 15px 0">
                                <span style="color: #00AAEE; cursor: pointer" @click="showDetail('packages')">查看套餐记录</span>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'寄存产品'+billForm.products.length" name="third">
                        <div>
                            <yid-table :data="billForm.products"  ref="hyproducts" :row-class-name="rowClass"  height="300">
                                <yid-table-column label="商品编号" min-width="80" prop="pcode"></yid-table-column>
                                <yid-table-column label="商品名称" prop="pname"></yid-table-column>
                                <yid-table-column label="寄存来源" min-width="80" >
                                    <template slot-scope="scope">{{scope.row.source==1?'购买商品':scope.row.couponType==2?'套餐划扣':''}}</template>

                                </yid-table-column>
                                <yid-table-column label="所属门店" min-width="150">
                                    <template slot-scope="scope">{{scope.row.shopcode+' '+ scope.row.shopname}}</template>
                                </yid-table-column>
                                <yid-table-column label="所属卡号" min-width="100" prop="cardno"></yid-table-column>
                                <yid-table-column label="购买时间" min-width="140" prop="buyTime"></yid-table-column>
                                <yid-table-column label="寄存数量" min-width="70" prop="total"></yid-table-column>
                                <yid-table-column label="剩余数量" min-width="70" prop="checknum"></yid-table-column>
                                <yid-table-column label="寄存单价" min-width="70" prop="price"></yid-table-column>
                                <yid-table-column label="注销数量" min-width="150" prop="tkproductNum"></yid-table-column>
                                <yid-table-column label="注销金额" min-width="100" prop="tkproductje"></yid-table-column>
                            </yid-table>
                            <div style="display: flex; justify-content: space-between; padding: 15px 0">
                                <span style="color: #00AAEE; cursor: pointer" @click="showDetail('products')">查看寄存记录</span>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'优惠券'+billForm.coupons.length" name="four">
                        <div>
                            <yid-table :data="billForm.coupons" ref="hycoupons" :row-class-name="rowClass"  height="300">
                                <yid-table-column label="活动名称" min-width="140" prop="maname"></yid-table-column>
                                <yid-table-column label="优惠券名称" min-width="120" prop="cpname"></yid-table-column>
                                <yid-table-column label="发券单号" min-width="120" prop="sbillcode"></yid-table-column>
                                <yid-table-column label="形式" min-width="120">
                                    <template slot-scope="scope">{{scope.row.couponType==2?'折扣'+scope.row.discount+'折':scope.row.couponType==1?'固定金额'+scope.row.discount+'元':''}}</template>
                                </yid-table-column>
                                <yid-table-column label="领券时间" min-width="150" prop="couponcreatedTime"></yid-table-column>
                                <yid-table-column label="发券门店" min-width="250">
                                    <template slot-scope="scope">{{scope.row.shopcode+' '+ scope.row.shopname}}</template>
                                </yid-table-column>
                                <yid-table-column label="有效期" min-width="120" >
                                    <template slot-scope="scope">
                                        {{ (scope.row.sdate && scope.row.edate) ? (scope.row.sdate.substring(0, 10) + "~" + scope.row.edate.substring(0, 10)) : '不限期'
                                        }}
                                    </template>
                                </yid-table-column>
                            </yid-table>
                            <!--<div style="display: flex; justify-content: space-between; padding: 15px 0">
                                <span style="color: #00AAEE; cursor: pointer" @click="showDetail('coupons')">查看优惠券使用明细</span>
                            </div>-->
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'红包'+billForm.redpacks.length" name="five">
                        <div>
                            <yid-table :data="billForm.redpacks" ref="hyredpacks" :row-class-name="rowClass"  height="300">
                                <yid-table-column label="活动名称" min-width="140" prop="maname"></yid-table-column>
                                <yid-table-column label="红包名称" min-width="120" prop="rname"></yid-table-column>
                                <yid-table-column label="发券单号" min-width="120" prop="sbillcode"></yid-table-column>
                                <yid-table-column label="价值" min-width="80" prop="money"></yid-table-column>
                                <yid-table-column label="剩余金额" min-width="80" prop="ye"></yid-table-column>
                                <yid-table-column label="领券时间" min-width="140" prop="redcreatedTime"></yid-table-column>
                                <yid-table-column label="发券门店">
                                    <template slot-scope="scope">{{scope.row.shopcode+' '+ scope.row.shopname}}</template>
                                </yid-table-column>
                                <yid-table-column label="有效期" min-width="140" >
                                    <template slot-scope="scope">
                                        {{ (scope.row.sdate && scope.row.edate) ? (scope.row.sdate.substring(0, 10) + "~" + scope.row.edate.substring(0, 10)) : '不限期' }}
                                    </template>
                                </yid-table-column>
                                <yid-table-column label="注销金额" min-width="80" prop="tkredje"></yid-table-column>
                            </yid-table>
                           <!-- <div style="display: flex; justify-content: space-between; padding: 15px 0">
                                <span style="color: #00AAEE; cursor: pointer" @click="showDetail('coupons')">查看红包使用明细</span>
                            </div>-->
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div>
                <el-row>
                    <el-col :span="5">会员卡注销金额：<label style="font-size: 16px; font-weight: bold">￥{{billForm.cardMoney}}</label></el-col>
                    <el-col :span="5">可用套餐注销金额：<label style="font-size: 16px; font-weight: bold">￥{{billForm.packageMoney}}</label></el-col>
                    <el-col :span="5">寄存产品注销金额：<label style="font-size: 16px; font-weight: bold">￥{{billForm.productMoney}}</label></el-col>
                    <el-col :span="5">注销优惠券数：<label style="font-size: 16px; font-weight: bold">{{billForm.couponnum}}</label></el-col>
                    <el-col :span="4">注销红包金额：<label style="font-size: 16px; font-weight: bold">￥{{billForm.redpacksMoney}}</label></el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                            <span style="font-size: 16px; font-weight: bold;">
                                <label style="color: red">*</label>
                                合计实退金额：
                                <el-input placeholder="" type="number" disabled v-model.trim="billForm.totalMoney"  style="width: 150px;"></el-input>
                                <el-tooltip class="item" effect="dark" content="
                                    1、已使用的赠送项目折扣成本可以通过折算扣除出来，门店可根据实际情况填写实退金额。
                                    2、只退赠送项目时，输入实退金额为0
                                    " placement="right-start" style="margin-left: 15px">
                                            <i class="icon iconfont el-icon-question"></i>
                                </el-tooltip>
                            </span>
                </el-row>
            </div>
            <el-row style="margin-top: 15px">
                <el-col :span="8">
                    <div><label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款联系人：
                        <el-input clearable placeholder="姓名" disabled  v-model.trim="billForm.tkname"  style="width: 100px;"></el-input>
                        <el-input clearable placeholder="手机号" disabled v-model.trim="billForm.tkmobile"  style="width: 150px;margin-left: 10px"></el-input>
                    </div>
                    <div style="display: flex;flex-wrap: wrap;margin-top: 15px; line-height: 36px">
                        <label style="color: red; font-weight: bold; margin-right: 5px">*</label>打款方式：
                        <el-select clearable filterable placeholder="请选择" style="width: 160px;  margin-right: 10px" disabled v-model.trim="billForm.tktype">
                            <el-option key="'k_'+1" value="1" label="店内支出卡"></el-option>
                            <el-option key="'k_'+2" value="2" label="顾客银行卡"></el-option>
                            <el-option key="'k_'+3" value="3" label="退为卡金"></el-option>
                        </el-select>
                        <el-input clearable placeholder="开户行" disabled v-model.trim="billForm.bank"  style="width: 150px; margin-right: 10px"></el-input>
                        <el-input clearable placeholder="户名" disabled v-model.trim="billForm.payee"  style="width: 100px; margin-right: 10px"></el-input>
                        <el-input clearable placeholder="账户" disabled v-model.trim="billForm.bankno" style="width: 200px; margin-right: 10px"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div style="display: flex;flex-wrap: wrap;margin-top: 15px; line-height: 36px">
                        <label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款属性：
                        <el-select clearable filterable placeholder="请选择" disabled style="width: 300px;" v-model.trim="billForm.tkattr">
                            <el-option key="'tk_'+1" value="1" label="仅注销无退款"></el-option>
                            <el-option key="'tk_'+2" value="2" label="员工离职"></el-option>
                            <el-option key="'tk_'+3" value="3" label="个人原因"></el-option>
                            <el-option key="'tk_'+4" value="4" label="技术原因"></el-option>
                            <el-option key="'tk_'+5" value="5" label="消费原因"></el-option>
                            <el-option key="'tk_'+6" value="6" label="服务及接待"></el-option>
                            <el-option key="'tk_'+7" value="7" label="关店原因"></el-option>
                            <el-option key="'tk_'+8" value="8" label="其它"></el-option>
                        </el-select>
                    </div>
                    <div style="display: flex;flex-wrap: wrap;margin-top: 15px; line-height: 36px">
                        <label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款方式：
                        <el-select clearable filterable placeholder="请选择" disabled style="width: 300px;" v-model.trim="billForm.tkway">
                            <el-option key="'tk0_'+1" value="1" label="营业款"></el-option>
                            <el-option key="'tk0_'+2" value="2" label="预留款"></el-option>
                            <el-option key="'tk0_'+3" value="3" label="退卡保证金"></el-option>
                            <el-option key="'tk0_'+4" value="4" label="风险金"></el-option>
                            <el-option key="'tk0_'+5" value="5" label="关店退款"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="8">
                    <label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款原因：
                    <el-input
                            type="textarea" disabled
                            :rows="5"
                            placeholder="请输入内容500字以内"
                            v-model="billForm.tkcontent" style="margin-top: 10px">
                    </el-input>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 15px; border-top: 1px #f2f2f2 solid; padding-top: 15px">
                <el-col :span="8" style="overflow: hidden">
                    <div style="display: flex; flex-direction: column">
                        <div>
                            核实退款属性：
                            <el-select clearable filterable placeholder="请选择" style="width: 200px;" v-model.trim="billForm.hstkattr">
                                <el-option key="'tk_'+1" value="1" label="仅注销无退款"></el-option>
                                <el-option key="'tk_'+2" value="2" label="员工离职"></el-option>
                                <el-option key="'tk_'+3" value="3" label="个人原因"></el-option>
                                <el-option key="'tk_'+4" value="4" label="技术原因"></el-option>
                                <el-option key="'tk_'+5" value="5" label="消费原因"></el-option>
                                <el-option key="'tk_'+6" value="6" label="服务及接待"></el-option>
                                <el-option key="'tk_'+7" value="7" label="关店原因"></el-option>
                                <el-option key="'tk_'+8" value="8" label="其它"></el-option>
                            </el-select>
                        </div>
                        <div>
                            核实退款原因：
                            <el-input
                                    type="textarea"
                                    :rows="5"
                                    placeholder="请输入内容500字以内"
                                    v-model="billForm.hstkcontent" style="margin-top: 10px">
                            </el-input>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div style="display: flex; flex-direction: column">
                        <div>
                            <yid-table :data="billForm.details"  :row-class-name="rowClass"  height="300">
                                <yid-table-column label="回访日期" min-width="140" prop="hfTime"></yid-table-column>
                                <yid-table-column label="回访人" min-width="120" prop="hfBy"></yid-table-column>
                                <yid-table-column label="核实原因" min-width="140" prop="hstkcontent"></yid-table-column>
                                <yid-table-column label="备注" min-width="140" prop="hsmemo"></yid-table-column>
                            </yid-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--消费记录-->
        <el-dialog
                :title="detailDialog.title"
                :visible.sync="detailDialog.visible"
                width="1300px"
                center :close-on-click-modal ='false'>
            <!--会员卡消费明细-->
            <el-row v-if="activetab=='first'">
                <el-form ref="record" label-width="100px" label-position="right">
                    选择会员卡：
                    <el-select clearable filterable placeholder="请选择" style="width: 300px;" v-model.trim="formCard.cardid" @change="changeCardinfo">
                        <el-option v-for="(card, cardindex) in cardLists" :key="card.cardid" :value="card.cardid" :label="card.cardno + ' ' +card.cardname"></el-option>
                    </el-select>
                </el-form>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <div style="padding:15px 0 17px 0">卡金批次明细：</div>
                        <yid-table :data="cardsye" height="300">
                            <yid-table-column label="门店编码" min-width="70" prop="shopcode"></yid-table-column>
                            <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                            <yid-table-column label="卡金余额" min-width="70" prop="money"></yid-table-column>
                            <yid-table-column label="赠送金余额" min-width="90" prop="zmoney"></yid-table-column>
                        </yid-table>
                    </el-col>
                    <el-col :span="16">
                        <div style="padding:15px 0 10px 0">
                            <label>充值赠送记录：</label>
                            <el-date-picker
                                    v-model="formCard.date"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期" style="width:300px; margin-right: 15px">
                            </el-date-picker>
                            <el-button @click="searchRechages" type="primary">查询</el-button>
                        </div>
                        <yid-table :data="rechanges" height="300">
                            <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                            <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                            <yid-table-column label="充值单号" min-width="120" prop="billcode"></yid-table-column>
                            <yid-table-column label="充值时间" min-width="120" prop="updateTime"></yid-table-column>
                            <yid-table-column label="充值金额" min-width="70" prop="money"></yid-table-column>
                            <yid-table-column label="赠送金额" min-width="70" prop="zmoney"></yid-table-column>
                            <yid-table-column label="赠送项目" prop="zinfo"></yid-table-column>
                        </yid-table>
                    </el-col>
                </el-row>
            </el-row>
            <!--套餐记录-->
            <el-row v-if="activetab=='second'">
                <el-row>
                    <label>购买时间：</label>
                    <el-date-picker
                            v-model="formCard.date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" style="width:300px; margin-right: 15px">
                    </el-date-picker>
                    <label style="margin-left: 20px">购买门店：</label>
                    <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.shopcode" @change="changCard">
                        <el-option v-for="shop in shopLists" :key="shop.shopcode" :value="shop.shopcode" :label="shop.shopname"></el-option>
                    </el-select>
                    <label style="margin-left: 20px">查看余量：</label>
                    <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.lessNum" @change="changCard">
                        <el-option v-for="less in lessType" :key="less.id" :value="less.id" :label="less.value"></el-option>
                    </el-select>
                    <el-button style="margin-left: 20px" @click="searchPackages" type="primary">查询</el-button>
                </el-row>
                <yid-table :data="packages" pagination style="margin-top: 20px; min-height: 443px">
                    <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                    <yid-table-column label="购买时间" min-width="120" prop="buytime"></yid-table-column>
                    <yid-table-column label="订单号" min-width="120" prop="billcode"></yid-table-column>
                    <yid-table-column label="类型" min-width="70" prop="type"></yid-table-column>
                    <yid-table-column label="套餐名称" min-width="90" prop="packageinfoname"></yid-table-column>
                    <yid-table-column label="项目/产品名称"  prop="servname"></yid-table-column>
                    <yid-table-column label="总数量" min-width="60" prop="total"></yid-table-column>
                    <yid-table-column label="剩余数量" min-width="60" prop="snum"></yid-table-column>
                    <yid-table-column label="到期日期" min-width="100" prop="expiryTime">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.expiryTime)}}
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-row>
            <!--寄存记录-->
            <el-row v-if="activetab=='third'">
                <el-row>
                    <label>购买时间：</label>
                    <el-date-picker
                            v-model="formCard.date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" style="width:300px; margin-right: 15px">
                    </el-date-picker>
                    <label style="margin-left: 20px">购买门店：</label>
                    <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.shopcode" @change="changCard">
                        <el-option v-for="shop in shopLists" :key="shop.shopcode" :value="shop.shopcode" :label="shop.shopname"></el-option>
                    </el-select>
                    <label style="margin-left: 20px">查看余量：</label>
                    <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.lessNum" @change="changCard">
                        <el-option v-for="less in lessType" :key="less.id" :value="less.id" :label="less.value"></el-option>
                    </el-select>
                    <el-button style="margin-left: 20px" @click="searchPicks" type="primary">查询</el-button>
                </el-row>
                <yid-table :data="picks" pagination style="margin-top: 20px; min-height: 443px">
                    <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                    <yid-table-column label="购买时间" min-width="120" prop="buyTime"></yid-table-column>
                    <yid-table-column label="订单号" min-width="120" prop="billcode"></yid-table-column>
                    <yid-table-column label="寄存来源" min-width="70">
                        <template slot-scope="scope">{{scope.row.source==1?'购买商品':scope.row.couponType==2?'套餐划扣':''}}</template>
                    </yid-table-column>
                    <yid-table-column label="商品名称"  prop="pname"></yid-table-column>
                    <yid-table-column label="商品编号"  prop="pcode"></yid-table-column>
                    <yid-table-column label="购买单价" min-width="60" prop="price"></yid-table-column>
                    <yid-table-column label="寄存数量" min-width="60" prop="total"></yid-table-column>
                    <yid-table-column label="已领取" min-width="100" prop="outnum"></yid-table-column>
                    <yid-table-column label="剩余数量" min-width="100" prop="checknum"></yid-table-column>
                </yid-table>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
    import yid from '@src/library'
    import { mapGetters } from 'vuex'
    import moment from 'moment';

    import service from '@src/service'

    export default {
        name: "hyrefundDetail",
        data() {
            return {
                recordsinfo:{},
                tableData:[
                    {
                        billcode:'',
                        shopcode:'',
                        memname:'',
                        memid:'',
                        mobile:'',
                        stmoney:0,
                        creatBy:'',
                        creatTime:'',
                        updateBy:'',
                        updateTime:'',
                        status:'',
                        memo:'',
                        rejectmemo:'',
                        rejectTime:'',
                        rejectBy:'',

                    }
                ],

                billForm:{
                    id:'',
                    billcode:'',
                    shopid:'',
                    shopcode:'',
                    shopname:'',
                    memname:'',
                    mobile:'',
                    memid:'',
                    isKd:'0',
                    cardChecked:false,
                    packChecked:false,
                    proChecked:false,
                    totalMoney:0,//实退金额
                    status:1,//1 未提交  2 已提交  3 已审批  4 已驳回  5 已复核
                    cardMoney:0,
                    packageMoney:0,
                    productMoney:0,
                    redpacksMoney:0,
                    couponnum:0,
                    tkname:'',
                    tkmobile:'',
                    tktype:'',
                    payee:'',
                    bank:'',
                    bankno:'',
                    tkattr:'',
                    tkway:'',
                    tkcontent:'',
                    photopath:'',
                    cardVOs:[],
                    packageVOs:[],
                    couponVOs:[],
                    productVOs:[],
                    redpackVOs:[],
                    cards:[],
                    packages:[],
                    products:[],
                    coupons:[],
                    redpacks:[],
                    details:[],
                    hstkattr:'',
                    hstkcontent:'',
                },
                activetab:'first',
                showButton : true,

                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                maxImgs:1,
                upload:"https://api.yidmall.com/api-file/files-anon",
                // upload: yid.config.API.UPLOAD,
                myheaders:{},
                detailDialog:{
                    visible:false,
                    title:'',
                },
                cards:[
                ],
                cardsye:[
                ],
                rechanges:[
                ],
                formCard:{
                    memid:'',
                    brandCode:'',
                    cardid:'',
                    date:[],
                    shopcode:'',//购买门店
                    lessNum:'',//余量
                },
                pageInfo:{page:0,limit:10},
                packages:[],
                shopLists:[],
                cardLists:[],
                lessType:[
                    {
                        id:'01',
                        value:'全部'
                    },
                    {
                        id:'02',
                        value:'大于0'
                    },
                    {
                        id:'03',
                        value:'等于0'
                    }
                ],
                picks:[],
            }
        },
        computed: {
            ...mapGetters({
                userInfo: 'user/userInfo',
            })
        },
        mounted(){
            this.myheaders = {
                authorization: "Bearer " + yid.cache.get(yid.type.USER.TOKEN)
            }

        },
        methods:{

            async initData(obj){
                //   await this.restData();
                this.baseData = obj;
                let headData =  this.baseData.headData
                this.billForm.shopid = headData.shopid;
                this.billForm.shopcode = headData.shopcode;
                this.billForm.shopname = headData.shopname;
                this.billForm.memname =headData.memname;
                this.billForm.mobile =headData.mobile;
                this.billForm.memid =headData.memid;
                this.formCard.memid=headData.memid;
                this.billForm.cards =headData.cardVOs;
                this.billForm.packages = headData.packageVOs;
                this.billForm.coupons = headData.couponVOs;
                this.billForm.redpacks = headData.redpackVOs;
                this.billForm.products = headData.productVOs;
                this.billForm.details = headData.detailVOs;
                this.billForm.billcode = headData.billcode;
                this.billForm.status = headData.status;
                this.billForm.id = headData.id;
                this.billForm.cardMoney = headData.cardMoney;
                this.billForm.packageMoney = headData.packageMoney;
                this.billForm.productMoney = headData.productMoney;
                this.billForm.redpacksMoney = headData.redpacksMoney;
                this.billForm.couponnum = headData.couponnum;
                this.billForm.tkname = headData.tkname;
                this.billForm.tkmobile = headData.tkmobile;
                this.billForm.tktype = headData.tktype;
                this.billForm.payee = headData.payee;
                this.billForm.bank = headData.bank;
                this.billForm.bankno = headData.bankno;
                this.billForm.tkattr = headData.tkattr;
                this.billForm.tkway = headData.tkway;
                this.billForm.tkcontent = headData.tkcontent;
                this.billForm.photopath = headData.photopath;
                this.billForm.totalMoney = headData.totalMoney;
                this.billForm.hstkattr = headData.hstkattr;
                this.billForm.hstkcontent=headData.hstkcontent;
                this.billForm.isKd = headData.isKd;
                this.showButton = headData.status=='1'||headData.status=='2';

            },



            //注销全部
            logout(){

            },
            back() {
                //this.search();
                this.$parent.showList = true;
                this.$parent.backsearch();

            },



            rowClass(scope){
                if(this.billForm.isKd == 0 && scope.row.shopcode != this.userInfo.shopcode){
                    return 'disableRowClass'
                }
            },
            showDetail(type){
                type=='cards'?this.detailDialog.title = '卡金明细':
                    type=='packages'?this.detailDialog.title = '套餐明细':
                        type=='products'?this.detailDialog.title = '寄存记录':
                            type=='coupons'?this.detailDialog.title = '优惠券记录':
                                type=='redpacks'?this.detailDialog.title = '红包记录':''

                if(type =="cards"){
                    const res = new Map();
                    this.cardLists = this.billForm.cards.filter(
                        card=>!res.has(card.cardno) && res.set(card.cardno,1)
                    )
                }
                if(type =="packages"){
                    const res = new Map();
                    this.shopLists = this.billForm.packages.filter(
                        pack=>!res.has(pack.shopcode) && res.set(pack.shopcode,1)
                    )

                }
                if(type =="products"){
                    const res = new Map();
                    this.shopLists = this.billForm.products.filter(
                        product=>!res.has(product.shopcode) && res.set(product.shopcode,1)
                    )
                }
                if(type =="coupons"){
                    const res = new Map();
                    this.shopLists = this.billForm.coupons.filter(
                        coupon=>!res.has(coupon.shopcode) && res.set(coupon.shopcode,1)
                    )
                }
                if(type =="redpacks"){
                    const res = new Map();
                    this.shopLists = this.billForm.redpacks.filter(
                        redpack=>!res.has(redpack.shopcode) && res.set(redpack.shopcode,1)
                    )
                }

                this.detailDialog.visible = true

            },
            handleRemove(file) {
                this.billForm.tkphoto = ''
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file;
                this.dialogVisible = true;
            },
            /*handleDownload(file) {
                console.log(file);
            }*/
            handleAvatarSuccess(res, file) {
                this.billForm.tkphoto = res.data.url;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/jpeg" || file.type === "image/png";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    yid.util.error("上传头像图片只能是 JPG/PNG 格式!");
                    return;
                }
                if (!isLt2M) {
                    yid.util.error("上传头像图片大小不能超过 2MB!");
                    return;
                }
                return isJPG && isLt2M;
            },
            changeCardinfo() {
                this.formCard.shopcode = ''
                this.formCard.date=[]
                if (this.formCard.cardid) {
                    this.queryShopCardMoney(this.formCard.cardid);
                }
            },
            queryShopCardMoney(id) {
                this.cardsye = []
                service.member.memberinfo.queryShopcardmoney({cardid: id}).then(res => {
                    this.cardsye = res.data
                })
            },
            changCard(e){
                this.formCard.cardid= e
            },
            searchRechages(){
                if(!this.formCard.cardid){
                    yid.util.warning("请选择会员卡");
                    return
                }
                if(this.formCard.date.length==0){
                    yid.util.warning("请选择查询日期");
                    return
                }
                let sdate = this.formCard.date[0];
                let edate = this.formCard.date[1];

                service.finance.hyrefund.queryCardRecords({cardid:this.formCard.cardid,sdate,edate}).then(res => {
                    if (res.resp_code == "200") {
                        this.rechanges = res.data;
                        yid.util.alert("查询完成");
                    } else {
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            //查询套餐明细
            searchPackages(){

                if(this.formCard.date.length==0){
                    yid.util.warning("请选择查询日期");
                    return
                }
                let sSTimeStart = this.formCard.date[0]
                let sSTimeEnd = this.formCard.date[1]
                let parms = {
                    memid:this.formCard.memid,
                    brandCode:this.formCard.brandCode,
                    sSTimeStart,
                    sSTimeEnd,
                    shopcode:this.formCard.shopcode,
                    snum:this.formCard.lessNum,
                };
                service.finance.hyrefund.queryMemPackageTk(parms).then(res =>{
                    if(res.resp_code == "200"){
                        this.packages = res.data;
                        yid.util.alert("查询完成");
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            //查询寄存明细
            searchPicks(){

                if(this.formCard.date.length==0){
                    yid.util.warning("请选择查询日期");
                    return
                }
                let sSTimeStart = this.formCard.date[0]
                let sSTimeEnd = this.formCard.date[1]
                let parms = {
                    memid:this.formCard.memid,
                    brandCode:this.formCard.brandCode,
                    sSTimeStart,
                    sSTimeEnd,
                    shopcode:this.formCard.shopcode,
                    snum:this.formCard.lessNum,
                }
                service.finance.hyrefund.queryMemProductTk(parms).then(res =>{
                    if(res.resp_code == "200"){
                        this.picks = res.data.data;
                        debugger;
                        yid.util.alert("查询完成");
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            saveBill(){
                service.finance.hyrefundhf.save(this.billForm).then(res=>{
                    if(res.resp_code=="200"){

                        this.billForm.id = res.data.id;
                        yid.util.success("保存成功");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            //免回访
            censorforM(){

                let id = this.billForm.id;
                let billcode = this.billForm.billcode;
                let status = this.billForm.status;
                if(!yid.util.isEmpty(billcode)){
                    if(status == '3'){
                        yid.util.error("已回访的单据不能进行免回访");
                        return;
                    }
                    if(status == '4'){
                        yid.util.error("已免回访的单据不能再次进行免回访");
                        return;
                    }
                    if(status == '9'){
                        yid.util.error("已作废的单据不能进行免回访");
                        return;
                    }
                    //调用免回访接口
                    service.finance.hyrefundhf.censorforM({ids:id,billcodes:billcode}).then(res=>{
                        if(res.resp_code=="200"){
                            yid.util.success("免回访成功");
                            this.search();
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    })
                }else{
                    yid.util.error("请先选中需要免回访的单据");
                    return;
                }
            },

             auditBill(){

                let id = this.billForm.id;
                let billcode = this.billForm.billcode;
                let status = this.billForm.status;
                if(!yid.util.isEmpty(billcode)){
                    yid.util.confirm("您确定要提交["+billcode+"]的单据?","","",()=>{
                        if(status == '3'){
                            yid.util.error("已回访的单据不能再次进行回访");
                            return;
                        }
                        if(status == '4'){
                            yid.util.error("已免回访的单据不能进行回访");
                            return;
                        }
                        if(status == '9'){
                            yid.util.error("已作废的单据不能进行回访");
                            return;
                        }
                            //调用审核单据接口
                            service.finance.hyrefundhf.censor({id:id,billcode:billcode,status:"3"}).then(res=>{
                                if(res.resp_code=="200"){
                                    yid.util.success("提交成功");
                                    this.showList = true;
                                    this.showButton = false;

                                }else{
                                    yid.util.error(res.resp_msg);
                                }
                            })

                    })
                }else{
                    yid.util.error("单据保存后再进行提交!");
                    return;
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    .hyrefund{
        height: 100%;
        /deep/.el-table{
            .disableRowClass{
                color: #ccc;
            }
        }

    }
</style>