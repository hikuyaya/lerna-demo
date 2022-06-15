<template>

    <div class="dept">

        <el-collapse-transition>
            <div v-show="listShow">
                <el-form inline>
                    <el-form-item label="退款月份">
                        <el-date-picker clearable style="width: 140px;"
                                v-model="searchForm.month" type="month"
                                value-format="yyyy-MM"
                                placeholder="选择年月">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="顾客">
                        <el-input clearable v-model="searchForm.meminfo" placeholder="姓名/手机号"  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="seach()">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-left: 100px;">
                        <el-button type="primary" @click="refund()">退款</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table">
                    <yid-table-column label="退款单号" min-width="120" prop="billcode"></yid-table-column>
                    <yid-table-column label="顾客" min-width="100" prop="memname">
                        <template slot-scope="scope">
                             <div>{{scope.row.memname}}</div>
                            <div>{{scope.row.mobile}}</div>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="退款总金额" min-width="80" prop="totalJe"></yid-table-column>
                    <yid-table-column label="退款时间" min-width="140" prop="createdTime"></yid-table-column>
                    <yid-table-column label="备注" min-width="80" prop="memo"></yid-table-column>
                    <yid-table-column label="退款详细" min-width="130" prop="content"></yid-table-column>
                    <yid-table-column label="操作人" min-width="80" prop="createdBy"></yid-table-column>
                    <yid-table-column label="操作门店" min-width="80" prop="shopname"></yid-table-column>
                    <yid-table-column label="操作" min-width="80">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="getBill(scope.row.id)">
                                查看详细
                            </el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div class="meminfo" v-show="!listShow">
                <div>会员基础信息</div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="25%">手机号码:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{memberDesc.mobile}}</label></td>
                        <td align="right" width="25%">姓名:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{memberDesc.memname}}</label></td></tr>
                    <tr><td align="right" width="25%">生日:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{$yid.util.formatDate(memberDesc.birthday) }}</label></td>
                        <td align="right" width="25%">性别:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{memberDesc.sex=="1"?"男":"女"}}</label></td></tr>
                </table>
                <el-divider></el-divider>
                <div>退套餐项目</div>
                <yid-table ref="packageData" :data="memberDesc.packageData" default-expand-all style="margin-top: 15px;">
                    <yid-table-column label="套餐名称" prop="mpname">
                        <template slot-scope="scope">
                            <div>{{scope.row.mpname}}({{memberDesc.shopid==scope.row.shopid?'本店':scope.row.shopname}})</div>
                        </template>
                    </yid-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <yid-table ref="table1" style="margin-top: 5px;" :data="scope.row.descList">
                                <yid-table-column prop="servname" label="项目/商品" min-width="120" ></yid-table-column>
                                <yid-table-column prop="total" label="总次数" min-width="100" ></yid-table-column>
                                <yid-table-column prop="snum" label="剩余次数" min-width="100" ></yid-table-column>
                                <yid-table-column prop="pprice" label="套餐金额" min-width="100" ></yid-table-column>
                                <yid-table-column prop="expiryTime" label="到期日期" min-width="160" :formatter="formatter"></yid-table-column>
                                <yid-table-column prop="tkNum" label="退款次数" min-width="100">
                                    <template slot-scope="scopes">
                                        <div v-if="memberDesc.shopid==scope.row.shopid">
                                            <el-input type="number" min="0" v-model="scopes.row.tkNum"></el-input>
                                        </div>
                                    </template>
                                </yid-table-column>
                                <yid-table-column prop="tkje" label="退款金额" min-width="100"></yid-table-column>
                            </yid-table>
                        </template>
                    </el-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="合计退款金额：">￥{{memberDesc.packageMoney}}</el-form-item>
                    <el-form-item label="退款手续费："><el-input type="number" min="0" v-model="memberDesc.freePackage" ></el-input></el-form-item>
                    <el-form-item label="合计套餐退款总金额：">￥{{memberDesc.packageJe}}
                        <yid-ask>合计套餐退款金额 = 合计应退金额 - 手续费</yid-ask>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>退会员卡金</div>
                <yid-table ref="cardTable" :data="memberDesc.cardData" style="margin-top: 10px;">
                    <yid-table-column label="卡号" prop="cardno" min-width="100"></yid-table-column>
                    <yid-table-column label="本店剩余卡金" prop="shopmoney" min-width="100"></yid-table-column>
                    <yid-table-column label="本店剩余赠送金" prop="shopgmoney" min-width="100"></yid-table-column>
                    <yid-table-column label="已使用的本店赠送金额度" prop="shopugmoney" min-width="100"></yid-table-column>
                    <yid-table-column label="到期日期" prop="exprite" min-width="100" :formatter="formatter"></yid-table-column>
                    <yid-table-column label="退卡金额度" prop="tkje" min-width="100">
                        <template slot-scope="scope">
                            <div><el-input type="number" min="0" v-model="scope.row.tkje"/></div>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="扣除赠送金额度" prop="tzje" min-width="100">
                        <template slot-scope="scope">
                            <div><el-input type="number" min="0" v-model="scope.row.tzje"/></div>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="卡金总剩余" prop="money" min-width="100"></yid-table-column>
                    <yid-table-column label="赠送金总剩余" prop="gmoney" min-width="100"></yid-table-column>
                    <yid-table-column label="其他门店卡金" prop="cardshops" min-width="100">
                        <template slot-scope="scope">
                            <div v-for="card in scope.row.cardshops" v-if="memberDesc.shopid!=card.shopid">{{card.money}}</div>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="其他门店赠送金" prop="cardshops" min-width="100">
                        <template slot-scope="scope">
                            <div v-for="card in scope.row.cardshops" v-if="memberDesc.shopid!=card.shopid">{{card.gmoney}}</div>
                        </template>
                    </yid-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="合计退卡金：">￥{{memberDesc.cardMoney}}</el-form-item>
                    <el-form-item label="合计退卡赠送：">￥{{memberDesc.giftMoney}}</el-form-item>
                    <el-form-item label="退款后卡金和赠送金余额为0时自动销卡："><el-checkbox v-model="memberDesc.autokcard"></el-checkbox></el-form-item>
                    <el-form-item label="退款手续费："><el-input type="number" v-model="memberDesc.freeCard"></el-input>
                        <yid-ask>已使用的赠送金和以消耗卡金的折扣成本可以通过折算成手续费扣除出来，门店可根据实际情况填写，
                            手续费金额最高等于合计应退卡金， 最低为0.当手续费金额等于合计应退卡金时，
                            合计会员卡退款总金额等于0.</yid-ask></el-form-item>
                    <el-form-item label="合计套餐退款总金额：">￥{{memberDesc.cardJe}}
                        <yid-ask>合计会员卡退款总金额 = 合计应退卡金- 手续费</yid-ask>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>资格卡退款</div>
                <yid-table ref="cardTable" :data="memberDesc.cardzData" style="margin-top: 10px;">
                    <yid-table-column label="卡号" prop="cardno" min-width="120"></yid-table-column>
                    <yid-table-column label="卡名称" prop="cardname" min-width="130"></yid-table-column>
                    <yid-table-column label="开卡时间" prop="makedate" min-width="160"></yid-table-column>
                    <yid-table-column label="项目折扣" prop="serDis" min-width="80"></yid-table-column>
                    <yid-table-column label="商品折扣" prop="proDis" min-width="80"></yid-table-column>
                    <yid-table-column label="开卡/续卡金额" min-width="120">
                        <template slot-scope="scope">
                            <div><el-button @click="lookupLog(scope.row.id)">查看</el-button></div>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="到期日期" prop="exprite" min-width="160" :formatter="formatter"></yid-table-column>
                    <yid-table-column label="退卡金额" prop="tkje" min-width="120"></yid-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="退款后资格卡过期将自动销卡"><el-checkbox v-model="memberDesc.autozkcard"></el-checkbox></el-form-item>
                    <el-form-item label="退款手续费："><el-input type="number" v-model="memberDesc.freeCardzk"></el-input>
                        <yid-ask>已使用的资格卡的折扣成本可以通过折算成手续费扣除出来，门店可根据实际情况填写，
                            手续费金额最高等于合计应退款， 最低为0.当手续费金额等于合计应退款时，
                            合计资格卡退款总金额等于0.</yid-ask></el-form-item>
                    <el-form-item label="合计资格卡退款总金额：">￥{{memberDesc.cardzJe}}</el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>退寄存商品</div>
                <yid-table ref="goodTable" :data="memberDesc.productData" style="margin-top: 10px;">
                    <yid-table-column label="商品名称" prop="pname" min-width="150"></yid-table-column>
                    <yid-table-column label="编号" prop="pcode" min-width="100"></yid-table-column>
                    <yid-table-column label="购买单价" prop="price" min-width="120"></yid-table-column>
                    <yid-table-column label="订单号" prop="billcode" min-width="150"></yid-table-column>
                    <yid-table-column label="剩余数量" prop="checknum" min-width="120"></yid-table-column>
                    <yid-table-column label="退货数量" prop="thNum" min-width="150">
                        <template slot-scope="scope">
                            <el-input type="number" min="0" max="100" v-model="scope.row.thNum"/>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="退货金额" prop="thje" min-width="150"></yid-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="合计退货金额：">￥{{memberDesc.productMoney}}</el-form-item>
                    <el-form-item label="退款手续费：">
                        <el-input type="number" v-model="memberDesc.freeProduct"></el-input>
                        <yid-ask>已使用的套餐折扣成本可以通过手续费的形式扣除出来，
                            门店操作时可根据实际情景填写。手续费金额最高等于合计应退金额，
                            当手续费等于合计应退金额时，合计套餐退款金额为0</yid-ask></el-form-item>
                    <el-form-item label="合计寄存退款总金额：">￥{{memberDesc.productJe}}
                        <yid-ask>合计寄存退款金额 = 合计应退金额 - 手续费</yid-ask></el-form-item>
                </el-form>
                <el-divider></el-divider>
                <el-form>
                    <el-form-item label="备注">
                        <el-input
                                id="headtext"
                                type="textarea" v-model="memberDesc.memo"
                                :autosize="{ minRows: 3, maxRows: 5}"
                                placeholder="请输入退款相关内容比如退款原因，以供财务人员审核"
                                style="width: 600px; font-size: 12px">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="合计退款总金额：">￥{{memberDesc.totalJe}}
                        <yid-ask>合计退款总金额是门店最终需要退给顾客的金额数，
                            合计退款总金额=合计套餐退款总额+合计会员卡退款总额</yid-ask>
                    </el-form-item>
                </el-form>
                <el-form>
                    <el-form-item label="">
                        <el-row>
                        <el-col :span="3" :offset="6"><el-button type="primary" @click="back()">返回</el-button></el-col>
                        <el-col :span="3"><el-button type="primary" @click="save()">确定退款</el-button></el-col>
                        <el-col :span="3"><el-checkbox v-model="memberDesc.isPrint">打印退款单据</el-checkbox></el-col>
                       </el-row>
                    </el-form-item>
                </el-form>
            </div>
        </el-collapse-transition>

        <el-dialog :title="memDialog.title" :visible="memDialog.visible" @close="closeDialog(1)" width="600px">
            <el-row>
                <el-col>请输入顾客手机号：</el-col>
                <el-col class="margTop"><el-input v-model.trim="memDialog.mobile" placeholder="顾客手机号"></el-input></el-col>
                <el-col class="margTop"><el-button type="primary" @click="seachMember()">下一步</el-button></el-col>
            </el-row>
        </el-dialog>

        <yid-dialog :title="memCardlog.title" :visible.sync="memCardlog.visible" @close="closeDialog(3)" width="800px">
            <yid-table ref="cardztable" :data="memCardlog.cardlogs">
                <yid-table-column width="50">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" v-show="scope.row.status!='已过期'"></el-checkbox>
                    </template>
                </yid-table-column>
                <yid-table-column label="类型" min-width="60" prop="type"></yid-table-column>
                <yid-table-column label="金额" min-width="90" prop="money"></yid-table-column>
                <yid-table-column label="发生日期" min-width="100" prop="createdTime"></yid-table-column>
                <yid-table-column label="生效日期" min-width="100" prop="stime"></yid-table-column>
                <yid-table-column label="到期日期" min-width="100" prop="etime"></yid-table-column>
                <yid-table-column label="状态" min-width="60" prop="status"></yid-table-column>
                <yid-table-column label="操作门店" min-width="80" prop="shopname"></yid-table-column>
            </yid-table>
            <el-row style="margin-top: 10px;">
                <el-col :span="1" :offse="3"><el-button type="primary" @click="setCardzkje()">确定</el-button></el-col>
            </el-row>
        </yid-dialog>

        <yid-dialog :title="lookupdetailDialog.title" :visible.sync="lookupdetailDialog.visible" @close="closeDialog(4)" width="1120px">
            <div class="meminfo">
                <div>会员基础信息</div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="25%">手机号码:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{memberDesc.mobile}}</label></td>
                        <td align="right" width="25%">姓名:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{memberDesc.memname}}</label></td></tr>
                    <tr><td align="right" width="25%">生日:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{$yid.util.formatDate(memberDesc.birthday) }}</label></td>
                        <td align="right" width="25%">性别:</td>
                        <td width="25%"><label style="margin-left: 5px;">{{memberDesc.sex=="1"?"男":"女"}}</label></td></tr>
                </table>
                <el-divider></el-divider>
                <div>退套餐项目</div>
                <yid-table ref="packageData" style="margin-top: 5px;" :data="memberDesc.packages">
                    <yid-table-column prop="servname" label="项目/商品" min-width="120" ></yid-table-column>
                    <yid-table-column prop="total" label="总次数" min-width="100" ></yid-table-column>
                    <yid-table-column prop="snum" label="剩余次数" min-width="100" ></yid-table-column>
                    <yid-table-column prop="pprice" label="套餐金额" min-width="100" ></yid-table-column>
                    <yid-table-column prop="expiryTime" label="到期日期" min-width="160" :formatter="formatter"></yid-table-column>
                    <yid-table-column prop="tkNum" label="退款数量" min-width="100"></yid-table-column>
                    <yid-table-column prop="tkje" label="退款金额" min-width="100"></yid-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="合计退款金额：">￥{{memberDesc.packageMoney}}</el-form-item>
                    <el-form-item label="退款手续费：">￥{{memberDesc.freePackage}}
                        <yid-ask>已使用的套餐折扣成本可以通过手续费的形式扣除出来，
                            门店操作时可根据实际情景填写。手续费金额最高等于合计应退金额，
                            当手续费等于合计应退金额时，合计套餐退款金额为0</yid-ask></el-form-item>
                    <el-form-item label="合计套餐退款总金额：">￥{{memberDesc.packageJe}}
                        <yid-ask>合计套餐退款金额 = 合计应退金额 - 手续费</yid-ask></el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>退会员卡金</div>
                <yid-table ref="cardTable" :data="memberDesc.cards" style="margin-top: 10px;">
                    <yid-table-column label="卡号" prop="cardno" min-width="120"></yid-table-column>
                    <yid-table-column label="剩余卡金" prop="money" min-width="120"></yid-table-column>
                    <yid-table-column label="剩余赠送金" prop="gmoney" min-width="100"></yid-table-column>
                    <yid-table-column label="已使用的赠送金额度" prop="sgmoney" min-width="100"></yid-table-column>
                    <yid-table-column label="到期日期" prop="exprite" min-width="160" :formatter="formatter"></yid-table-column>
                    <yid-table-column label="退卡金额度" prop="tkje" min-width="120"></yid-table-column>
                    <yid-table-column label="扣除赠送金额度" prop="tzje" min-width="120"></yid-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="合计退卡金：">￥{{memberDesc.cardMoney}}</el-form-item>
                    <el-form-item label="合计退卡赠送：">￥{{memberDesc.giftMoney}}</el-form-item>
                    <el-form-item label="退款后卡金和赠送金余额为0时自动销卡：">{{memberDesc.autokcard=="1"?"是":"否"}}</el-form-item>
                    <el-form-item label="退款手续费：">￥{{memberDesc.freeCard}}
                        <yid-ask>已使用的赠送金和以消耗卡金的折扣成本可以通过折算成手续费扣除出来，
                            门店可根据实际情况填写，手续费金额最高等于合计应退卡金，
                            最低为0.当手续费金额等于合计应退卡金时，合计会员卡退款总金额等于0.</yid-ask></el-form-item>
                    <el-form-item label="合计套餐退款总金额：">￥{{memberDesc.cardJe}}
                        <yid-ask>合计会员卡退款总金额 = 合计应退卡金- 手续费</yid-ask></el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>资格卡退款</div>
                <yid-table ref="cardTable" :data="memberDesc.cardzs" style="margin-top: 10px;">
                    <yid-table-column label="卡号" prop="cardno" min-width="120"></yid-table-column>
                    <yid-table-column label="卡名称" prop="cardname" min-width="130"></yid-table-column>
                    <yid-table-column label="开卡时间" prop="makedate" min-width="160"></yid-table-column>
                    <yid-table-column label="项目折扣" prop="serDis" min-width="80"></yid-table-column>
                    <yid-table-column label="商品折扣" prop="proDis" min-width="80"></yid-table-column>
                    <yid-table-column label="到期日期" prop="exprite" min-width="160" :formatter="formatter"></yid-table-column>
                    <yid-table-column label="退卡金额" prop="tkje" min-width="120"></yid-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="退款后资格卡过期将自动销卡">{{memberDesc.autozkcard=="1"?"是":"否"}}</el-form-item>
                    <el-form-item label="退款手续费：">￥{{memberDesc.freeCardzk}}
                        <yid-ask>已使用的资格卡的折扣成本可以通过折算成手续费扣除出来，门店可根据实际情况填写，
                            手续费金额最高等于合计应退款， 最低为0.当手续费金额等于合计应退款时，
                            合计资格卡退款总金额等于0.</yid-ask></el-form-item>
                    <el-form-item label="合计会员卡退款总金额：">￥{{memberDesc.cardzJe}}</el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>退寄存商品</div>
                <yid-table ref="goodTable" :data="memberDesc.products" style="margin-top: 10px;">
                    <yid-table-column label="商品名称" prop="pname" min-width="150"></yid-table-column>
                    <yid-table-column label="编号" prop="pcode" min-width="100"></yid-table-column>
                    <yid-table-column label="购买单价" prop="price" min-width="120"></yid-table-column>
                    <yid-table-column label="订单号" prop="billcode" min-width="150"></yid-table-column>
                    <yid-table-column label="剩余数量" prop="checknum" min-width="120"></yid-table-column>
                    <yid-table-column label="退货数量" prop="thNum" min-width="150"></yid-table-column>
                    <yid-table-column label="退货金额" prop="thje" min-width="150"></yid-table-column>
                </yid-table>
                <el-form inline class="margTop">
                    <el-form-item label="合计退货金额：">￥{{memberDesc.productMoney}}</el-form-item>
                    <el-form-item label="退款手续费：">￥{{memberDesc.freeProduct}}
                        <yid-ask>已使用的套餐折扣成本可以通过手续费的形式扣除出来，
                            门店操作时可根据实际情景填写。手续费金额最高等于合计应退金额，
                            当手续费等于合计应退金额时，合计套餐退款金额为0</yid-ask>
                    </el-form-item>
                    <el-form-item label="合计寄存退款总金额：">￥{{memberDesc.productJe}}
                        <yid-ask>合计寄存退款金额 = 合计应退金额 - 手续费</yid-ask>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <el-form>
                    <el-form-item label="备注">{{memberDesc.memo}}</el-form-item>
                    <el-form-item label="合计退款总金额：">￥{{memberDesc.totalJe}}
                        <yid-ask>合计退款总金额是门店最终需要退给顾客的金额数，
                            合计退款总金额=合计套餐退款总额+合计会员卡退款总额</yid-ask>
                    </el-form-item>
                </el-form>
                <el-rol>
                    <el-col :span="4" :offset="8"><el-button type="primary" @click="closeDialog(4)">返回</el-button></el-col>
                    <el-col :span="4"><el-button type="primary" >打印退款单据</el-button></el-col>
                </el-rol>
            </div>
        </yid-dialog>

    </div>

</template>

<script>
    import service from '@src/service'
    import moment from 'moment';
    moment.locale();

    export default {
        name:'refund',
        data(){
            return {
                listShow: true,
                searchForm:{
                    month:'',
                    meminfo:''
                },
                refundDatas:[],
                pageInfo:{page:1,limit:10},
                memDialog:{
                    title:'查询会员',
                    visible:false,
                    mobile:'',
                },
                detailDialog:{
                    title:'退款明细',
                    visible:false,
                },
                lookupdetailDialog:{
                    title:'退款明细',
                    visible:false,
                },
                memberDesc: {
                    shopid:'',
                    memid:'',
                    mobile:'',
                    memname:'',
                    birthday:'',
                    sex:'1',
                    packageMoney:'',
                    freePackage:'',
                    packageJe:'',
                    cardMoney:'',
                    giftMOney:'',
                    freeCard:'',
                    cardJe:'',
                    freeCardzk:'',
                    cardzJe:'',
                    productMoney:'',
                    freeProduct:'',
                    productJe:'',
                    totalJe:'',
                    memo:'',
                    isPrint:'',
                    packageData:[],
                    cardData:[],
                    cardzData:[],
                    productData:[],
                    packages:[],
                    cards:[],
                    products:[],
                    autokcard:'',
                    autozkcard:''
                },
                memCardlog: {
                    title:'资格卡查看开卡/续卡记录',
                    visible:false,
                    cardid:'',
                    cardlogs:[],
                }
            }
        },
        watch:{
            memberDesc:{
                handler(n){
                    let tje=0;
                    n.packageData.map(pack =>{
                        pack.descList.map(desc => {
                            if(desc.tkNum > desc.snum)
                                desc.tkNum =desc.snum
                            if(desc.tkNum == desc.snum)
                                desc.tkje = desc.pprice
                            if(desc.tkNum){
                                if(desc.isGift == '1'){
                                    desc.tkje = 0
                                }else{
                                    desc.tkje = Number((desc.tkNum * desc.singlePrice).toFixed(1))
                                }
                                tje+=desc.tkje;
                            }else{
                                desc.tkje = ''
                            }
                        })
                    })
                    let tkje=0, tzje=0;
                    n.cardData.map(card =>{
                        if(card.tkje>card.shopmoney){
                            card.tkje=card.shopmoney
                        }
                        if(card.tkje<0){
                            card.tkje=0
                        }
                        if(card.tkje){
                            tkje+=Number(card.tkje)
                        }
                        if(card.tzje>card.shopgmoney){
                            card.tzje=card.shopgmoney
                        }
                        if(card.tzje<0){
                            card.tzje=0
                        }
                        if(card.tzje){
                            tzje+=Number(card.tzje);
                        }
                    })
                    let tzkje=0;
                    n.cardzData.map(card =>{
                        if(card.tkje<0){
                            card.tkje=0
                        }
                        if(card.tkje){
                            tzkje+=Number(card.tkje)
                        }
                    })
                    let thje=0;
                    n.productData.map(pro =>{
                        if(pro.thNum>pro.checknum){
                            pro.thNum=pro.checknum
                        }
                        if(pro.thNum<0){
                            pro.thNum=0
                        }
                        if(pro.thNum){
                            pro.thje =  pro.thNum * pro.price;
                            thje+=pro.thje;
                        }else{
                            pro.thje = ''
                        }
                    })
                    this.memberDesc.packageMoney=tje;
                    if(this.memberDesc.freePackage<0){
                        this.memberDesc.freePackage=0
                    }
                    this.memberDesc.packageJe=this.memberDesc.packageMoney-(this.memberDesc.freePackage?this.memberDesc.freePackage:0);
                    if(this.memberDesc.packageJe<0){
                        this.memberDesc.freePackage=this.memberDesc.packageMoney;
                        this.memberDesc.packageJe=0;
                    }
                    this.memberDesc.cardMoney=tkje;
                    this.memberDesc.giftMoney=tzje;
                    if(this.memberDesc.freeCard<0){
                        this.memberDesc.freeCard=0
                    }
                    this.memberDesc.cardJe=this.memberDesc.cardMoney-(this.memberDesc.freeCard?this.memberDesc.freeCard:0);
                    if(this.memberDesc.cardJe<0){
                        this.memberDesc.freeCard=this.memberDesc.cardMoney;
                        this.memberDesc.cardJe=0;
                    }
                    if(this.memberDesc.freeCardzk<0){
                        this.memberDesc.freeCardzk=0
                    }
                    if(this.memberDesc.freeCardzk && Number(this.memberDesc.freeCardzk)>tzkje){
                        this.memberDesc.freeCardzk=tzkje
                        this.memberDesc.cardzJe=0
                    }else{
                        this.memberDesc.cardzJe=tzkje-(this.memberDesc.freeCardzk?this.memberDesc.freeCardzk:0);
                    }

                    this.memberDesc.productMoney=thje;
                    if(this.memberDesc.freeProduct<0){
                        this.memberDesc.freeProduct=0
                    }
                    this.memberDesc.productJe=this.memberDesc.productMoney-(this.memberDesc.freeProduct?this.memberDesc.freeProduct:0);
                    if(this.memberDesc.productJe<0){
                        this.memberDesc.freeProduct=this.memberDesc.productMoney;
                        this.memberDesc.productJe=0;
                    }
                    this.memberDesc.totalJe= Number(this.memberDesc.packageJe)+Number(this.memberDesc.cardJe)+
                        Number(this.memberDesc.cardzJe)+Number(this.memberDesc.productJe);
                },
                deep: true
            }
        },
        methods:{
            formatter(row, column) {
                if(row.expiryTime){
                    return row.expiryTime.substr(0,10);
                }else if(row.exprite){
                    return row.exprite.substr(0,10);
                }else{
                    return ""
                }
            },
            handleServicesChange(val){
                this.ids = val;
            },
            seach(){
                const fetch = service.member.refund.shoppageList
                const params = {...this.pageInfo}
                if(this.searchForm.meminfo){
                    if(!isNaN(this.searchForm.meminfo) && this.searchForm.meminfo.length==11){
                        params.mobile=this.searchForm.meminfo
                        params.memname=''
                    }else{
                        params.memname=this.searchForm.meminfo
                        params.mobile=''
                    }
                }else{
                    params.memname=''
                    params.mobile=''
                }
                if(this.searchForm.month){
                    params.month=this.searchForm.month
                }else{
                    params.month=''
                }
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            refund(){
                this.memDialog.visible=true
                this.memDialog.mobile=''
            },
            seachMember(){
                if(!this.memDialog.mobile){
                    $yid.util.error("手机号不能为空");
                    return
                }
                if(this.memDialog.mobile.length!=11){
                    $yid.util.error("手机号不是11位数");
                    return
                }
                this.memDialog.visible=false
                service.member.refund.getDiffMember({mobile:this.memDialog.mobile}).then(res =>{
                    if(res.resp_code == "200"){
                        this.listShow=false
                        this.memberDesc=res.data
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            back(){
                this.listShow=true
                this.memDialog.visible=true
            },
            save(){
                const params={
                    ...this.memberDesc
                }
                delete params.cardData;
                delete params.packageData;
                delete params.cardzData;
                delete params.productData;
                let i=0;
                params.packages=[];
                this.memberDesc.packageData.map(pack =>{
                    pack.descList.map(m =>{
                        if(m.tkNum>0){
                            i++
                            params.packages.push({...m,id:0,pdid:m.id})
                        }
                    })
                })
                params.cards=[];
                this.memberDesc.cardData.map(m =>{
                    if(m.tkje>=0 || m.tzje>=0){
                        i++
                        params.cards.push({...m,id:0,cardid:m.id})
                    }
                })
                this.memberDesc.cardzData.map(m =>{
                    if(m.tkje>=0){
                        i++
                        params.cards.push({...m,id:0,cardid:m.id})
                    }
                })
                params.products=[];
                this.memberDesc.productData.map(m =>{
                    if(m.thNum>0){
                        i++
                        params.products.push({...m,id:0,dbid:m.id})
                    }
                })
                if(i==0){
                    $yid.util.error("没有退款内容");
                    return
                }
                if(params.autokcard){
                    params.autokcard='1'
                }
                service.member.refund.saveRefund(params).then(res =>{
                    if(res.resp_code == "200"){
                        this.listShow=true
                        this.memDialog.visible=false
                        this.seach();
                        $yid.util.success(res.resp_msg)
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            closeDialog(val){
                if(val == 1){
                    this.memDialog.visible=false
                }
                if(val == 2){
                    this.memDialog.visible=true
                    this.detailDialog.visible=false
                }
                if(val == 3){
                    this.detailDialog.visible=true
                    this.memCardlog.visible=false
                }
                if(val == 4){
                    this.lookupdetailDialog.visible=false
                }
            },
            lookupLog(id){
                service.member.refund.cardzkLogs({cardid:id}).then(res =>{
                    if(res.resp_code == "200"){
                        this.detailDialog.visible=false
                        this.memCardlog.visible=true
                        this.memCardlog.cardid=id
                        res.data.map(m =>{
                            m.checked=false
                            if(m.type=="1"){
                                m.type="开卡"
                            }else{
                                m.type="续卡"
                            }
                            if(m.stime>moment().format("YYYY-MM-DD HH:mm:ss")){
                                m.status="末生效"
                            }else{
                                m.status="已生效"
                            }
                            if(m.etime<moment().format("YYYY-MM-DD HH:mm:ss")){
                                m.status="已过期"
                            }
                            if(m.refundtime){
                                m.status="已退款"
                            }
                            m.stime=moment(m.stime).format("YYYY-MM-DD")
                            m.etime=moment(m.etime).format("YYYY-MM-DD")
                            m.createdTime=moment(m.createdTime).format("YYYY-MM-DD")
                        })
                        this.memCardlog.cardlogs=res.data
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            getBill(id){
                service.member.refund.getBill(id).then(res =>{
                    if(res.resp_code == "200"){
                        this.lookupdetailDialog.visible=true
                        this.memberDesc=res.data
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            setCardzkje(){
                let money=0;let ids='';
                this.memCardlog.cardlogs.forEach(m =>{
                    if(m.checked){
                        ids+=m.id+','
                        money+=Number(m.money)
                    }
                })
                const that=this
                this.memberDesc.cardzData.forEach(m =>{
                    if(that.memCardlog.cardid == m.id){
                        m.tkje=money
                        m.zkcardids=ids
                    }
                })
                this.memberDesc.cardzJe=money
                this.closeDialog(3)
            }
        }
    }
</script>

<style scoped>

    .margTop {
        margin-top: 10px;
    }

    .meminfo {
        margin:0 auto;
    }

    .meminfo div {
        padding: 2px;
        font-weight:bold;
    }

    .meminfo table {
        width: 800px;
        height:120px;
    }

</style>
