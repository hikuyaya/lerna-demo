<template>
    <div class="member-relation">
        <el-tabs v-model="activeName" @tab-click="handleClick" v-show="!detailShow">
            <el-tab-pane label="服务单" name="analyze">
                <el-button @click="showRecordDia(1)" type="primary">新增</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="门店：" prop="shopid" :rules="[{ required: true, message: '请选择一个门店'}]">
                        <el-select clearable v-model.trim="searchForm.shopid" filterable :filter-method="filterShop" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="撤单日期：">
                        <el-date-picker
                                :clearable = false
                                v-model="searchForm.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="seniorSearch1" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>

                <yid-table pagination ref="table" >
                    <yid-table-column label="服务单号" min-width="150" prop="billcode"></yid-table-column>
                    <yid-table-column label="店名" min-width="120" prop="shopname"></yid-table-column>
                    <yid-table-column label="客户" min-width="180" prop="cardInfo">
                        <template slot-scope="scope">
                            <span>{{scope.row.memName}} {{getSexName(scope.row.sex)}}</span><br>
                            <span>{{scope.row.mobile}}</span><br>
                            <span>{{scope.row.cardInfo == null ? '' : '【'+scope.row.cardInfo+' '+scope.row.cmcode+'】'}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="计客数" min-width="70" prop="isCompute">
                        <template slot-scope="scope">
                            {{scope.row.isCompute == '1' ? "是" : "否"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="消费时间" min-width="160" prop="saleTime"></yid-table-column>
                    <yid-table-column label="消费金额" min-width="150" prop="hjbillje">
                        <template slot-scope="scope">
                            ￥{{scope.row.hjbillje}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="支付方式" min-width="150" prop="pays">
                        <template slot-scope="scope">
                            <span v-for="pays in scope.row.payList">￥{{pays.money}} {{pays.payname}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="项目/客装商品" min-width="150" prop="servs">
                        <template slot-scope="scope">
                            <span v-for="servs in scope.row.servVOList">{{servs.sname}}*{{servs.num}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="总业绩" min-width="150" prop="sumyj"></yid-table-column>
                    <yid-table-column label="员工" min-width="200" prop="members">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">第{{royaltys.postion}}工位：{{royaltys.eecode}} {{royaltys.eename}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="员工业绩" min-width="150" prop="yjs">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">业绩：￥{{royaltys.yj}} {{getisAppoint(royaltys.isApppoint)}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">提成：￥{{royaltys.royalty}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="撤单时间" min-width="150" prop="hcTime"></yid-table-column>
                    <yid-table-column label="撤单人" min-width="150" prop="hcBy"></yid-table-column>
                    <yid-table-column label="撤单备注" min-width="150" prop="hcMemo"></yid-table-column>
                    <yid-table-column label="补单信息" min-width="150" prop="refBillcode"></yid-table-column>
                    <yid-table-column label="操作" min-width="200" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="checkDetail(scope.row)">查看详情</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="开卡充值" name="assignment">
                <el-button @click="showRecordDia(2)" type="primary">新增</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="czSearchForm" inline :model="czSearchForm">
                    <el-form-item label="门店：" prop="shopid" :rules="[{ required: true, message: '请选择一个门店'}]">
                        <el-select clearable v-model.trim="czSearchForm.shopid" filterable :filter-method="filterShop2" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList2">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="撤单日期：">
                        <el-date-picker
                                :clearable = false
                                v-model="czSearchForm.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="searchCz" type="primary">查询</el-button>
                        <el-button @click="seniorSearch2" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="tableCz">
                    <yid-table-column label="服务单号" min-width="180" prop="billcode"></yid-table-column>
                    <yid-table-column label="店名" min-width="120" prop="shopname"></yid-table-column>
                    <yid-table-column label="充值时间" min-width="150" prop="createdTime"></yid-table-column>
                    <yid-table-column label="顾客信息" min-width="180" prop="cardInfo">
                        <template slot-scope="scope">
                            <span>{{scope.row.memName}} {{getSexName(scope.row.sex)}}</span><br>
                            <span>{{scope.row.mobile}}</span><br>
                            <span>{{scope.row.cardname == null ? '' : '【'+scope.row.cardname+' '+scope.row.cardno+'】'}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="金额" min-width="150" prop="payments">
                        <template slot-scope="scope">
                            <span v-for="pays in scope.row.paysList">￥{{pays.payje}} {{pays.payname}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="充值类型" min-width="120" prop="isOpen">
                        <template slot-scope="scope">
                            {{scope.row.isOpen == '1' ? "开卡" : "充值"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="员工" min-width="180" prop="members">
                        <template slot-scope="scope">
                            <span v-for="yjs in scope.row.yjsList">{{yjs.eecode}} {{yjs.eename}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="业绩" min-width="150" prop="eeyjs">
                        <template slot-scope="scope">
                            <span v-for="yjs in scope.row.yjsList">￥{{yjs.yjje== null ? 0 :yjs.yjje}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys">
                        <template slot-scope="scope">
                            <span v-for="yjs in scope.row.yjsList">￥{{yjs.royalty== null ? 0 :yjs.royalty}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="撤单时间" min-width="150" prop="hcTime"></yid-table-column>
                    <yid-table-column label="撤单人" min-width="150" prop="hcBy"></yid-table-column>
                    <yid-table-column label="撤单备注" min-width="150" prop="hcMemo"></yid-table-column>
                    <yid-table-column label="补单信息" min-width="150" prop="refBillcode"></yid-table-column>
                    <yid-table-column label="操作" min-width="200" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="checkDetailCz(scope.row)">查看详情</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="套餐购买" name="logs">
                <el-button @click="showRecordDia(3)" type="primary">新增</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="packSearchForm" inline :model="packSearchForm">
                    <el-form-item label="门店：" prop="shopid" :rules="[{ required: true, message: '请选择一个门店'}]">
                        <el-select clearable v-model.trim="packSearchForm.shopid" filterable :filter-method="filterShop3" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList3">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="撤单日期：">
                        <el-date-picker
                                :clearable = false
                                v-model="packSearchForm.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="searchPack" type="primary">查询</el-button>
                        <el-button @click="seniorSearch3" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>

                <yid-table pagination ref="tablePack">
                    <yid-table-column label="单号" min-width="150" prop="billcode"></yid-table-column>
                    <yid-table-column label="店名" min-width="120" prop="shopname"></yid-table-column>
                    <yid-table-column label="销售时间" min-width="180" prop="saleTime"></yid-table-column>
                    <yid-table-column label="顾客信息" min-width="200" prop="cardInfo">
                        <template slot-scope="scope">
                            <span>{{scope.row.memName}} {{getSexName(scope.row.sex)}}</span><br>
                            <span>{{scope.row.mobile}}</span><br>
                            <span>{{scope.row.cardInfo == null ? '' : '【'+scope.row.cardInfo+' '+scope.row.cmcode+'】'}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="金额" min-width="150" prop="payments">
                        <template slot-scope="scope">
                            <span v-for="pays in scope.row.paysList">￥{{pays.money}} {{pays.payname}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="套餐内容" min-width="150" prop="snames">
                        <template slot-scope="scope">
                            <span v-for="serv in scope.row.infoVOList">{{serv.spname}}*1 ￥{{serv.totalprice}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="员工" min-width="150" prop="members">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">{{royaltys.eecode}} {{royaltys.eename}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="业绩" min-width="150" prop="eeyjs">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">￥{{royaltys.yj}} {{getisAppoint(royaltys.isApppoint)}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">￥{{royaltys.royalty == null ? 0 :royaltys.royalty}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="撤单时间" min-width="150" prop="hcTime"></yid-table-column>
                    <yid-table-column label="撤单人" min-width="150" prop="hcBy"></yid-table-column>
                    <yid-table-column label="撤单备注" min-width="150" prop="hcMemo"></yid-table-column>
                    <yid-table-column label="补单信息" min-width="150" prop="refBillcode"></yid-table-column>
                    <yid-table-column label="操作" min-width="200" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="checkDetailPack(scope.row)">查看详情</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>

        <el-collapse-transition>
            <div v-show="detailShowSale">
                <billDetail ref="billDetailPage" @onClose="closeDetailPage"></billDetail>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div v-show="detailShowCz">
                <cardbillDetail ref="billDetailPageCz" @onClose="closeDetailPageCz"></cardbillDetail>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div v-show="detailShowPack">
                <packagebillDetail ref="billDetailPagePack" @onClose="closeDetailPagePack"></packagebillDetail>
            </div>
        </el-collapse-transition>

        <yid-dialog :title="searchDialog1.title" :visible.sync="searchDialog1.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="消费日期：" prop="billcode">
                    <el-date-picker
                            :clearable = true
                            v-model="searchForm.saleTimeRange1"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="服务单号：" prop="billcode">
                    <el-input clearable v-model="searchForm.billcode"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="电话号码：" prop="mobile">
                    <el-input clearable v-model="searchForm.mobile"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="支付方式：" prop="cardpay">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.cardpay">
                        <el-option :key="item.paycode" :label="item.payname" :value="item.paycode" v-for="item in cardpays"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客姓名：" prop="memName">
                    <el-input clearable  v-model="searchForm.memName" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号：" prop="channel">
                    <el-input clearable v-model="searchForm.cmcode" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="操作人：" prop="createdBy">
                    <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.createdBy">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>-->
                    <el-input clearable v-model="searchForm.createdBy" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="服务员工：" prop="eeid">
                    <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>-->
                    <el-input clearable v-model="searchForm.eename" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="gjSearch" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="searchDialog2.title" :visible.sync="searchDialog2.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="消费日期：" prop="billcode">
                    <el-date-picker
                            :clearable = true
                            v-model="czSearchForm.saleTimeRange1"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="充值单号：" prop="billcode">
                    <el-input clearable v-model="czSearchForm.billcode"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="电话号码：" prop="mobile">
                    <el-input clearable v-model="czSearchForm.mobile"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="支付方式：" prop="paycode">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="czSearchForm.paycode">
                        <el-option :key="item.paycode" :label="item.payname" :value="item.paycode" v-for="item in cardpays"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客姓名：" prop="memName">
                    <el-input clearable v-model="czSearchForm.memName" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号：" prop="channel">
                    <el-input clearable v-model="czSearchForm.cmcode" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="充值类型：" prop="isOpen">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="czSearchForm.isOpen">
                        <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in opens"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务员工：" prop="eeid">
                    <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="czSearchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>-->
                    <el-input clearable v-model="czSearchForm.eename" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel1">取消</el-button>
                    <el-button @click="gjSearch1" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="searchDialog3.title" :visible.sync="searchDialog3.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="消费日期：" prop="billcode">
                    <el-date-picker
                            :clearable = true
                            v-model="packSearchForm.saleTimeRange1"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="套餐单号：" prop="billcode">
                    <el-input clearable v-model="packSearchForm.billcode"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="电话号码：" prop="mobile">
                    <el-input clearable v-model="packSearchForm.mobile"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="顾客姓名：" prop="memName">
                    <el-input clearable v-model="packSearchForm.memName" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="项目/套餐名称：" prop="isOpen">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="packSearchForm.sid">
                        <el-option :key="item.id" :label="item.spname" :value="item.id" v-for="item in packages"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式：" prop="paycode">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="packSearchForm.paycode">
                        <el-option :key="item.paycode" :label="item.payname" :value="item.paycode" v-for="item in cardpays"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提成员工：" prop="eeid">
                    <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="packSearchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>-->
                    <el-input clearable v-model="packSearchForm.eename"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel2">取消</el-button>
                    <el-button @click="gjSearch2" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog title="新增撤单" :visible.sync="addRecordVisible" width="700px">
            <el-form :model="addRecordForm" label-width="300px">
                <el-form-item label="单据编码:" label-width="120px">
                    <el-input v-model="addRecordForm.billcode"   style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="撤单备注:" label-width="120px">
                    <el-input  type="textarea" v-model="addRecordForm.hcMemo" placeholder="请输入1-30个字符" maxlength="30"
                               show-word-limit style="width: 500px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addRecordVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRecord(addRecordType)">确 定</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import billDetail from './billDetail'
    import cardbillDetail from './cardbillDetail'
    import packagebillDetail from './packagebillDetail'
    import service from '@src/service'
    export default {
        name: "member-relation",
        components: {
            billDetail,cardbillDetail,packagebillDetail
        },
        data() {
            return {
                value1: '',
                detailShow: false,
                detailShowSale: false,
                detailShowCz: false,
                detailShowPack: false,
                activeName : 'analyze',
                searchForm  : {
                    shopid: '',
                    saleTimeRange : [],
                    saleTimeRange1 : [],
                    isDel : '0',
                    isHc : '1',
                    billcode : '',
                    mobile : '',
                    cardpay :'',
                    memName : '',
                    cmcode : '',
                    createdBy : '',
                    eeid : '',
                    eename : "",
                },
                czSearchForm : {
                    shopid: '',
                    saleTimeRange : [],
                    saleTimeRange1 : [],
                    isDel : '0',
                    isHc : '1',
                    billcode : '',
                    mobile : '',
                    paycode : '',
                    memName : '',
                    cmcode : '',
                    isOpen : '',
                    eeid : '',
                    eename : "",
                },
                packSearchForm : {
                    shopid: '',
                    saleTimeRange : [],
                    saleTimeRange1 : [],
                    isDel : '0',
                    isHc : '1',
                    billcode : '',
                    mobile : '',
                    memName : '',
                    sid : '',
                    paycode : '',
                    eeid : '',
                    eename : "",
                },
                employeeList : [],
                cardpays : [],
                packages : [],
                pageInfo:{page:1,limit:10},
                allShopList:[],
                filterShopList:[],
                allShopList2:[],
                filterShopList2:[],
                allShopList3:[],
                filterShopList3:[],
                searchDialog1:{
                    title: '高级查询',
                    visible: false,
                },
                searchDialog2:{
                    title: '高级查询',
                    visible: false,
                },
                searchDialog3:{
                    title: '高级查询',
                    visible: false,
                },
                opens : [{
                    id : '0',
                    name : '充值'
                },{
                    id : '1',
                    name : '开卡'
                }],
                addRecordVisible:false,
                addRecordType:"",
                addRecordForm : {
                    billcode:'',
                    hcMemo:'',
                },
                detailInitData:{}, // 传入明细组件的初始值
                detailInitDataCz:{}, // 传入明细组件的初始值
                detailInitDataPack:{}, // 传入明细组件的初始值
            }
        },
        mounted(){
            this.getShopList();
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let day = d.getDate()
            if(Number(day) < 10){
                day = "0" + day
            }
            let date1 = year + "-" + month + "-" + day
            this.searchForm.saleTimeRange.push(date1)
            this.searchForm.saleTimeRange.unshift(date1)
            this.czSearchForm.saleTimeRange.push(date1)
            this.czSearchForm.saleTimeRange.unshift(date1)
            this.packSearchForm.saleTimeRange.push(date1)
            this.packSearchForm.saleTimeRange.unshift(date1)
            //this.getCraftsmans();
            this.getCardpays();
            this.getPackages();
            //this.search();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let saleTimeRange = this.searchForm.saleTimeRange;
                let saleTimeRange1 = this.searchForm.saleTimeRange1;
                if(saleTimeRange){
                    reqObj.hcTimeStart = this.searchForm.saleTimeRange[0];
                    reqObj.hcTimeEnd = this.searchForm.saleTimeRange[1];
                }else{
                    reqObj.hcTimeStart = ''
                    reqObj.hcTimeEnd = ''
                }
                if(saleTimeRange1){
                    reqObj.saleTimeStart = this.searchForm.saleTimeRange1[0];
                    reqObj.saleTimeEnd = this.searchForm.saleTimeRange1[1];
                }else{
                    reqObj.saleTimeStart = ''
                    reqObj.saleTimeEnd = ''
                }
                reqObj.isDel = this.searchForm.isDel;
                reqObj.isHc = this.searchForm.isHc;
                reqObj.shopid = this.searchForm.shopid;
                reqObj.billcode = this.searchForm.billcode;
                reqObj.mobile = this.searchForm.mobile;
                reqObj.cardpay = this.searchForm.cardpay;
                reqObj.memName = this.searchForm.memName;
                reqObj.cmcode = this.searchForm.cmcode;
                reqObj.createdBy = this.searchForm.createdBy;
                reqObj.eeid = this.searchForm.eeid;
                reqObj.eename = this.searchForm.eename;
                return reqObj;
            },
            searchFormReqCz : function () {
                let reqObj = {}
                let saleTimeRangeOver = this.czSearchForm.saleTimeRange;
                let saleTimeRangeOver1 = this.czSearchForm.saleTimeRange1;
                if(saleTimeRangeOver){
                    reqObj.hcTimeStart = this.czSearchForm.saleTimeRange[0];
                    reqObj.hcTimeEnd = this.czSearchForm.saleTimeRange[1];
                }else{
                    reqObj.hcTimeStart = ''
                    reqObj.hcTimeEnd = ''
                }
                if(saleTimeRangeOver1){
                    reqObj.updatedTimeStart = this.czSearchForm.saleTimeRange1[0];
                    reqObj.updatedTimeEnd = this.czSearchForm.saleTimeRange1[1];
                }else{
                    reqObj.updatedTimeStart = ''
                    reqObj.updatedTimeEnd = ''
                }
                reqObj.isDel = this.czSearchForm.isDel;
                reqObj.isHc = this.czSearchForm.isHc;
                reqObj.shopid = this.czSearchForm.shopid;
                reqObj.billcode = this.czSearchForm.billcode;
                reqObj.mobile = this.czSearchForm.mobile;
                reqObj.paycode = this.czSearchForm.paycode;
                reqObj.memName = this.czSearchForm.memName;
                reqObj.cmcode = this.czSearchForm.cmcode;
                reqObj.isOpen = this.czSearchForm.isOpen;
                reqObj.eeid = this.czSearchForm.eeid;
                reqObj.eename = this.czSearchForm.eename;
                return reqObj;
            },
            searchFormReqPack : function () {
                let reqObj = {}
                let saleTimeRangeZf = this.packSearchForm.saleTimeRange;
                let saleTimeRangeZf1 = this.packSearchForm.saleTimeRange1;
                if(saleTimeRangeZf){
                    reqObj.hcTimeStart = this.packSearchForm.saleTimeRange[0];
                    reqObj.hcTimeEnd = this.packSearchForm.saleTimeRange[1];
                }else{
                    reqObj.hcTimeStart = ''
                    reqObj.hcTimeEnd = ''
                }
                if(saleTimeRangeZf1){
                    reqObj.saleTimeStart = this.packSearchForm.saleTimeRange1[0];
                    reqObj.saleTimeEnd = this.packSearchForm.saleTimeRange1[1];
                }else{
                    reqObj.saleTimeStart = ''
                    reqObj.saleTimeEnd = ''
                }
                reqObj.isDel = this.packSearchForm.isDel;
                reqObj.isHc = this.packSearchForm.isHc;
                reqObj.shopid = this.packSearchForm.shopid;
                reqObj.billcode = this.packSearchForm.billcode;
                reqObj.mobile = this.packSearchForm.mobile;
                reqObj.memName = this.packSearchForm.memName;
                reqObj.sid = this.packSearchForm.sid;
                reqObj.paycode = this.packSearchForm.paycode;
                reqObj.eeid = this.packSearchForm.eeid;
                reqObj.eename = this.packSearchForm.eename;
                return reqObj;
            }
        },
        methods: {
            getData(reqParams){
                const fetch = service.cashier.serviceRecords.servicerecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            //获取服务人员列表
            /*getCraftsmans(){
                service.employee.listAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },*/
            getCardpays(){
                service.cashier.payType.listAll({}).then(res=> {
                    if(res.resp_code == 200) {
                        this.cardpays = res.data;
                    }
                })
            },
            getPackages(){
                service.servicepackage.findAll({isDel:'0'}).then(res=>{
                    if(res.resp_code == 200){
                        this.packages = res.data;
                    }
                })
            },
            getDateCz(reqParams){
                const fetch = service.cashier.cardRecords.cardRecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.tableCz.reloadData({
                    fetch,
                    params,
                });
            },
            getDatePack(reqParams){
                const fetch = service.cashier.packageRecords.packagerecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.tablePack.reloadData({
                    fetch,
                    params,
                });
            },
            search(){
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                        let arg = this.DateMinus(this.searchFormReq.hcTimeStart, this.searchFormReq.hcTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("撤销时间间隔请选择30天之内!");
                            return;
                        }
                        this.cleanSearch1();
                        this.getData(this.searchFormReq);
                    }})
            },
            searchgj(){
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                        let arg = this.DateMinus(this.searchFormReq.hcTimeStart, this.searchFormReq.hcTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("撤销时间间隔请选择30天之内!");
                            return;
                        }
                        let arg1 = this.DateMinus(this.searchFormReq.saleTimeStart, this.searchFormReq.saleTimeEnd);
                        if(Number(arg1) > 30){
                            $yid.util.error("消费时间间隔请选择30天之内!");
                            return;
                        }
                        this.getData(this.searchFormReq);
                        this.searchDialog1.visible = false;
                    }})
            },
            searchCz(){
                this.$refs['czSearchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.tableCz.Pagination.internalPageSize;
                        let arg = this.DateMinus(this.searchFormReqCz.updatedTimeStart, this.searchFormReqCz.updatedTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("撤销时间间隔请选择30天之内!");
                            return;
                        }
                        this.cleanSearch2();
                        this.getDateCz(this.searchFormReqCz);
                    }})
            },
            searchCzgj(){
                this.$refs['czSearchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.tableCz.Pagination.internalPageSize;
                        let arg = this.DateMinus(this.searchFormReqCz.updatedTimeStart, this.searchFormReqCz.updatedTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("撤销时间间隔请选择30天之内!");
                            return;
                        }
                        let arg1 = this.DateMinus(this.searchFormReqCz.updatedTimeStart, this.searchFormReqCz.updatedTimeEnd);
                        if(Number(arg1) > 30){
                            $yid.util.error("消费时间间隔请选择30天之内!");
                            return;
                        }
                        this.getDateCz(this.searchFormReqCz);
                        this.searchDialog2.visible = false;
                    }})
            },
            searchPack(){
                this.$refs['packSearchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.tablePack.Pagination.internalPageSize;
                        let arg = this.DateMinus(this.searchFormReqPack.saleTimeStart, this.searchFormReqPack.saleTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("撤销时间间隔请选择30天之内!");
                            return;
                        }
                        this.cleanSearch3();
                        this.getDatePack(this.searchFormReqPack);
                    }})
            },
            searchPackgj(){
                this.$refs['packSearchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.tablePack.Pagination.internalPageSize;
                        let arg = this.DateMinus(this.searchFormReqPack.saleTimeStart, this.searchFormReqPack.saleTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("撤销时间间隔请选择30天之内!");
                            return;
                        }
                        let arg1 = this.DateMinus(this.searchFormReqPack.saleTimeStart, this.searchFormReqPack.saleTimeEnd);
                        if(Number(arg1) > 30){
                            $yid.util.error("消费时间间隔请选择30天之内!");
                            return;
                        }
                        this.getDatePack(this.searchFormReqPack);
                        this.searchDialog3.visible = false;
                    }})
            },
            handleClick(tab){
                if(tab.name == 'analyze'){
                    this.search();
                }else if(tab.name == 'assignment'){
                    this.searchCz();
                }else if(tab.name == 'logs'){
                    this.searchPack();
                }
            },
            getShopList() {
                service.chain.shop.shopList({status:'1'}).then(res => {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                        this.filterShopList2 = res.data;
                        this.allShopList2 = Object.assign(this.filterShopList2);//保留原数据
                        this.filterShopList3 = res.data;
                        this.allShopList3 = Object.assign(this.filterShopList3);//保留原数据
                    }
                })
            },
            filterShop(v){
                this.filterShopList = this.allShopList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            filterShop2(v){
                this.filterShopList2 = this.allShopList2.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            filterShop3(v){
                this.filterShopList3 = this.allShopList3.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            getSexName(sex){
                let res = '';
                if(sex === '1'){
                    res = '男';
                }else if(sex === '2'){
                    res = '女';
                }
                return res;
            },
            getisAppoint(isApppoint){
                let res = "";
                if(isApppoint === "0"){
                    res = "非指定"
                }else if(isApppoint === "1"){
                    res = "指定"
                }
                return res;
            },
            cleanSearch1(){
                this.searchForm.saleTimeRange1 = [];
                this.searchForm.billcode = '';
                this.searchForm.mobile = '';
                this.searchForm.cardpay = '';
                this.searchForm.memName = '';
                this.searchForm.cmcode = '';
                this.searchForm.createdBy = '';
                this.searchForm.eeid = '';
            },
            seniorSearch1(){
                this.searchDialog1.visible = true;
            },
            cancel(){
                this.searchDialog1.visible = false;
            },
            gjSearch(){
                this.searchgj();
            },
            cleanSearch2(){
                this.czSearchForm.saleTimeRange1 = [];
                this.czSearchForm.billcode = '';
                this.czSearchForm.mobile = '';
                this.czSearchForm.paycode = '';
                this.czSearchForm.memName = '';
                this.czSearchForm.cmcode = '';
                this.czSearchForm.isOpen = '';
                this.czSearchForm.eeid = '';
            },
            seniorSearch2(){
                this.searchDialog2.visible = true;
            },
            cancel1(){
                this.searchDialog2.visible = false;
            },
            gjSearch1(){
                this.searchCzgj();
            },
            cleanSearch3(){
                this.packSearchForm.saleTimeRange1 = [];
                this.packSearchForm.billcode = '';
                this.packSearchForm.mobile = '';
                this.packSearchForm.memName = '';
                this.packSearchForm.sid = '';
                this.packSearchForm.paycode = '';
                this.packSearchForm.eeid = '';
            },
            seniorSearch3(){
                this.searchDialog3.visible = true;
            },
            cancel2(){
                this.searchDialog3.visible = false;
            },
            gjSearch2(){
                this.searchPackgj();
            },
            DateMinus(date1, date2) {
                //date1:小日期   date2:大日期
                var sdate = new Date(date1);
                var now = new Date(date2);
                var days = now.getTime() - sdate.getTime();
                var day = parseInt(days / (1000 * 60 * 60 * 24));
                return day;
            },

            showRecordDia(type){
                this.addRecordVisible = true;
                this.addRecordType=type;
                this.addRecordForm.billcode="";
                this.addRecordForm.hcMemo="";
            },
            addRecord(type){

                if($yid.util.isEmpty(this.addRecordForm.billcode)){
                    $yid.util.error("请先填写单据编码");
                    return false;
                }
                if($yid.util.isEmpty(this.addRecordForm.hcMemo)){
                    $yid.util.error("请先填写撤单备注");
                    return false;
                }

                if(type==1){
                    service.cashier.serviceRecords.revokeBill(this.addRecordForm).then(res=>{
                        if(res.resp_code == 200) {
                            $yid.util.success("操作成功");
                            this.addRecordVisible = false;
                        }else{
                            $yid.util.error(res.resp_msg)
                            return
                        }
                    })
                }else if(type==2){
                    service.cashier.cardRecords.recall(this.addRecordForm).then(res=>{
                        if(res.resp_code == 200) {
                            $yid.util.success("操作成功");
                            this.addRecordVisible = false;
                            this.search();
                        }else{
                            $yid.util.error(res.resp_msg)
                            return
                        }
                    })

                }else if(type==3){
                    service.cashier.packageRecords.revokeBill(this.addRecordForm).then(res => {
                        if (res.resp_code == 200) {
                            $yid.util.success("操作成功");
                            this.addRecordVisible = false;
                            this.search();
                        } else {
                            $yid.util.error(res.resp_msg)
                            return
                        }
                    })

                }

            },

            checkDetail(row) {
                this.detailShowSale = true;
                this.detailShow = true;
                this.detailInitData.billid = row.id;
                this.detailInitData.entryData = row;
                this.$refs.billDetailPage.initData(this.detailInitData);
            },
            closeDetailPage(){
                this.detailInitData = {};
                this.detailShowSale = false;
                this.detailShow = false;
                this.search();
            },
            checkDetailCz(row){
                this.detailShowCz = true;
                this.detailShow = true;
                this.detailInitDataCz.billid = row.id;
                this.detailInitDataCz.entryData = row;
                this.$refs.billDetailPageCz.initData(this.detailInitDataCz);
            },
            closeDetailPageCz(){
                this.detailInitDataCz = {};
                this.detailShowCz = false;
                this.detailShow = false;
                this.searchCz();
            },
            checkDetailPack(row){
                this.detailShowPack = true;
                this.detailShow = true;
                this.detailInitDataPack.billid = row.id;
                this.detailInitDataPack.entryData = row;
                this.$refs.billDetailPagePack.initData(this.detailInitDataPack);
            },
            closeDetailPagePack(){
                this.detailInitDataPack = {};
                this.detailShowPack = false;
                this.detailShow = false;
                this.searchPack();
            },
        }
    }
</script>

<style scoped lang="scss">
    .member-relation {

    }
</style>