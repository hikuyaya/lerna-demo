<template>
    <div class="member-relation">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部会员(总部)" name="chainMember">
                <el-form ref="chainMemberForm" inline :model="chainMemberForm">
                    <el-form-item label="会员查询：">
                        <el-input clearable v-model.trim="chainMemberForm.name" placeholder="姓名/手机号/卡号" style="width: 220px;"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0; margin-left: 35px;">
                        <el-button @click="chainMemberSearch" type="primary">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0; margin-left: 35px;" v-if="false">
                        <el-button @click="chainSeniorForm.visible=true" type="primary">高级查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0; margin-left: 535px;" v-if="false">
                        <el-button @click="exportChainMember" type="primary">会员导出</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="chainMemberTable">
                    <yid-table-column prop="memname" label="姓名" min-width="100" ></yid-table-column>
                    <yid-table-column prop="mobile" label="手机号" min-width="100" ></yid-table-column>
                    <yid-table-column prop="sex" label="性别" min-width="50" >
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="birthday" label="生日" min-width="60"  >
                        <template slot-scope="scope">
                            {{scope.row.birthday | dateFormat }}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="regdate" label="注册日期" width="180"></yid-table-column>
                    <yid-table-column prop="moneyAll" label="总储值总额" width="90"></yid-table-column>
                    <yid-table-column prop="money" label="总卡金余额" width="90"></yid-table-column>
                    <yid-table-column prop="moneyGift" label="总赠送金余额" width="80"></yid-table-column>
                    <yid-table-column prop="moneyPackage" label="总套餐剩余金额" width="80"></yid-table-column>
                    <yid-table-column prop="servTotal" label="消费总额" width="80"></yid-table-column>
                    <yid-table-column prop="servNum" label="消费次数" width="80"></yid-table-column>
                    <yid-table-column prop="jf" label="当前积分" width="80"></yid-table-column>
                    <yid-table-column prop="name" label="操作" width="70">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="getMember(scope.row)">详细</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="全部会员(门店)" name="shopMember">
                <el-form ref="shopMembertable" inline :model="shopMemberForm" :rules="rules">
                    <el-form-item label="门店：" prop="shopid">
                        <el-select clearable v-model.trim="shopid" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in ShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="会员查询：">
                        <el-input clearable v-model.trim="shopMemberForm.name" placeholder="姓名/手机号/卡号" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0; margin-left: 35px;">
                        <el-button @click="shopMemberSearch()" type="primary">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0; margin-left: 35px;">
                        <el-button @click="shopSerniorForm.visible=true" type="primary">高级查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0; margin-left: 115px;">
                        <el-button @click="exportMember" type="primary">会员导出</el-button>
                    </el-form-item>
                </el-form>
                <div style="padding-bottom: 5px">本次查询出{{memberHj.count}}位会员，卡金总余额:{{memberHj.zkj}}元, 赠送金总余额:{{memberHj.zzs}}元</div>
                <el-table :data="memberTables" :span-method="objectSpanMethod" style="width: 100%">
                    <el-table-column prop="memname" label="姓名" width="80"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
                    <el-table-column prop="sex" label="性别" width="40">
                        <template slot-scope="scope">
                        {{scope.row.sex == '1' ? "男" : "女"}}
                    </template></el-table-column>
                    <el-table-column prop="birthday" label="生日" min-width="60"  >
                        <template slot-scope="scope">
                            {{scope.row.birthday | dateFormat }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="regdate" label="注册日期" width="100"></el-table-column>
                    <el-table-column label="卡账户信息" align="center">
                        <el-table-column prop="cardno" label="卡号" width="100"></el-table-column>
                        <el-table-column prop="cardname" label="卡名称" width="110"></el-table-column>
                        <el-table-column prop="cardtype" label="卡类型" width="70">
                            <template slot-scope="scope">
                                {{scope.row.cardtype == '1' ? "储值卡" : ""}}
                                {{scope.row.cardtype == '2' ? "资格卡" : ""}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="smoney" label="储值总额" width="80"></el-table-column>
                        <el-table-column prop="money" label="卡余额" width="70"></el-table-column>
                        <el-table-column prop="gmoney" label="赠送余额" width="80"></el-table-column>
                        <el-table-column prop="status" label="状态" width="80"></el-table-column>
                        <el-table-column prop="exprite" label="到期日期" width="100"></el-table-column>
                        <el-table-column prop="shopname" label="开卡门店" width="100"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="servTotal" label="本店消费总额" width="70"></el-table-column>
                    <el-table-column prop="servNum" label="本店消费次数" width="70"></el-table-column>
                    <el-table-column prop="name" label="操作" width="60">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="getMember(scope.row)">详细</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="removeMem(scope.row)">移除</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 8px;">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageInfo.page"
                            :page-sizes="[10, 20, 50, 100, 500]"
                            :page-size="pageInfo.limit"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageInfo.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="套餐会员" name="assignment">
                <el-form ref="memberpackfrom" inline :model="memberpackfrom" :rules="rules">
                    <el-form-item label="门店：" prop="shopid">
                        <el-select clearable v-model.trim="shopid" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in ShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="会员查询：">
                        <el-input clearable v-model="memberpackfrom.name" placeholder="姓名/手机号" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐名称：">
                        <el-input clearable v-model="memberpackfrom.mpname" placeholder="套餐名称" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="项目/产品名称：">
                        <el-input clearable v-model="memberpackfrom.servname" placeholder="项目/产品名称" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="到期日期：">
                        <el-date-picker style="width: 240px;"
                            v-model="memberpackfrom.date"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="queryMemberPackages()" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <div style="padding-bottom: 5px">本次查询出的所有会员套餐项目总剩次数:{{memberpackhj.servsum}}次， 总剩余金额:{{memberpackhj.servje}}元；产品总剩余数量{{memberpackhj.packsum}}个</div>
                <el-table ref="memberpacktable" :data="memberpackData" :span-method="objectSpanMethod2" style="width: 100%">
                    <el-table-column prop="memname" label="姓名" width="100"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
                    <el-table-column prop="sex" label="性别" width="60">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template></el-table-column>
                    <el-table-column label="套餐明细" align="center">
                        <el-table-column prop="mpname" label="套餐名称" width="180"></el-table-column>
                        <el-table-column prop="servname" label="项目/产品名称" width="240"></el-table-column>
                        <el-table-column prop="total" label="总数量" width="100"></el-table-column>
                        <el-table-column prop="snum" label="剩余数量" width="100"></el-table-column>
                        <el-table-column prop="lessmoney" label="剩余金额" width="100"></el-table-column>
                        <el-table-column prop="expiryTime" label="到期日期" width="160"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="name" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="getMember(scope.row)">详细</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 8px;">
                    <el-pagination
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page="memberpackfrom.page"
                            :page-sizes="[10, 20, 50, 100, 500]"
                            :page-size="memberpackfrom.limit"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="memberpackfrom.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已移除会员" name="removeMember">
                <el-form ref="memberDelfrom" inline :model="memberDelfrom" :rules="rules">
                    <el-form-item label="门店：" prop="shopid">
                        <el-select clearable v-model.trim="shopid" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in ShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="会员查询：">
                        <el-input clearable v-model="memberDelfrom.name" placeholder="姓名/手机号"  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="移除日期：">
                        <el-date-picker class="margl5" style="width: 240px;"
                                        v-model="memberDelfrom.date"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="queryDelMembers()" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="memberDelTable">
                    <yid-table-column label="姓名" min-width="80" prop="memname"></yid-table-column>
                    <yid-table-column label="性别" min-width="50" prop="sex">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="手机号" min-width="100" prop="mobile"></yid-table-column>
                    <yid-table-column label="卡号" min-width="100" prop="cardno"></yid-table-column>
                    <yid-table-column label="卡名称" min-width="120" prop="cardname"></yid-table-column>
                    <yid-table-column label="储值总额" min-width="80" prop="smoney"></yid-table-column>
                    <yid-table-column label="卡金余额" min-width="80" prop="money"></yid-table-column>
                    <yid-table-column label="赠送金余额" min-width="90" prop="gmoney"></yid-table-column>
                    <yid-table-column label="移除时间" min-width="150" prop="deldate"></yid-table-column>
                    <yid-table-column label="操作门店" min-width="80" prop="delshopname"></yid-table-column>
                    <yid-table-column label="操作" min-width="80" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="recoverMem(scope.row)">恢复</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="已过期卡会员" name="expiredCard">
                <el-form ref="memberExporfrom" inline :model="memberExporfrom" :rules="rules">
                    <el-form-item label="门店：" prop="shopid">
                        <el-select clearable v-model.trim="shopid" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in ShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="会员查询：">
                        <el-input clearable v-model="memberExporfrom.name" placeholder="姓名/手机号/卡号"  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="到期日期：">
                        <el-date-picker class="margl5" style="width: 240px;"
                                        v-model="memberExporfrom.date"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="queryExpritMembers()" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="memberExproTable">
                    <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
                    <yid-table-column label="性别" min-width="50" prop="sex">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="手机号" min-width="110" prop="mobile"></yid-table-column>
                    <yid-table-column label="卡号" min-width="100" prop="cardno"></yid-table-column>
                    <yid-table-column label="卡名称" min-width="100" prop="cardname"></yid-table-column>
                    <yid-table-column label="储值总额" min-width="80" prop="smoney"></yid-table-column>
                    <yid-table-column label="卡金余额" min-width="80" prop="money"></yid-table-column>
                    <yid-table-column label="赠送金余额" min-width="90" prop="gmoney"></yid-table-column>
                    <yid-table-column label="上次消费日" min-width="140" prop="latelyTime"></yid-table-column>
                    <yid-table-column label="到期日" min-width="140" prop="exprite"></yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="会员导入" name="improtMember">
                <table style="border:1px dashed #000; padding: 10px 5px;">
                    <tr><td style="border:0px;">操作提示：</td></tr>
                    <tr>
                        <td class="tableTd">1.可从管理平台批量导入会员，并下载对应模板填写相关信息后保存提交上传。</td></tr>
                    <tr>
                        <td class="tableTd">2.储值卡会员和资格卡会员导入时，手机号已存在且会员卡号已存在的则不导入；
                            套餐会员导入时，手机号已存在且套餐已存在，则导入的套餐将覆盖原有套餐，请谨慎操作！</td></tr>
                    <tr><td class="tableTd">3.标识“*”的选项为必填项。</td></tr>
                    <tr><td class="tableTd">4.导入会员后可从全部会员列表中找到该条会员数据。</td></tr>
                </table>
                <el-row class="margsx10">
                    <el-col :span="3" :offset="2"><i style="color: red">*</i>下载导入模板：</el-col>
                    <el-col :span="3"><el-link type="primary" @click="downExcelTemplate1()">储值卡会员模板</el-link></el-col>
                    <el-col :span="3"><el-link type="primary" @click="downExcelTemplate2()">资格卡会员模板</el-link></el-col>
                    <el-col :span="3"><el-link type="primary" @click="downExcelTemplate3()">套餐会员模板</el-link></el-col>
                </el-row>
                <el-row class="margsx10">
                    <el-row class="margsx10">
                        <el-col :span="3" :offset="2"><i style="color: red">*</i>选择导入门店：</el-col>
                        <el-col :span="12">
                            <el-select clearable v-model.trim="memberImport.shopid" placeholder="请选择">
                                <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in impShopList">
                                    <span style="float: left">{{ item.shopcode }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="margsx10">
                        <el-col :span="3" :offset="2"><i style="color: red">*</i>选择导入类型：</el-col>
                        <el-col :span="6"><el-select v-model="memberImport.type">
                            <el-option value="1" label="储值卡会员"></el-option>
                            <el-option value="2" label="资格卡会员"></el-option>
                            <el-option value="3" label="套餐会员"></el-option>
                        </el-select></el-col>
                    </el-row>
                    <el-col :span="3" :offset="2"><i style="color: red">*</i>选择导入文件：</el-col>
                    <el-col :span="12">
                        <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :file-list="fileList"
                            :on-remove="handleRemove"
                            :before-upload="importMembers">
                        <el-button size="small" type="primary">点击上传</el-button> <label style="margin-left: 10px">{{memberImport.filename}}</label>
                        <div slot="tip" class="el-upload__tip">*支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。</div>
                        </el-upload>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3" :offset="5"><el-button @click="sureImportMembers()" type="primary">确定导入</el-button></el-col>
                </el-row>
                <yid-table pagination ref="memberImportTable" style="margin-top: 20px;">
                    <yid-table-column label="导入时间" min-width="140" prop="impdate"></yid-table-column>
                    <yid-table-column label="导入类型" min-width="80" prop="imptype">
                        <template slot-scope="scope">
                            {{scope.row.imptype == '1' ? "储值卡会员" : ""}}
                            {{scope.row.imptype == '2' ? "资格卡会员" : ""}}
                            {{scope.row.imptype == '3' ? "套餐会员" : ""}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="预计导入数" min-width="110" prop="sumimps"></yid-table-column>
                    <yid-table-column label="成功数" min-width="80" prop="sussimp"></yid-table-column>
                    <yid-table-column label="失败数" min-width="80" prop="fails">
                        <template slot-scope="scope">
                            <div>{{scope.row.fails}}</div>
                            <div v-show="scope.row.fails > 0"><el-link type="primary" @click="exportServs(scope.row)">下载</el-link></div>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作人" min-width="140" prop="oper"></yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>

        <yid-dialog :title="chainSeniorForm.title" :visible.sync="chainSeniorForm.visible" width="860px">
            <el-form label-width="140px" ref="chainSeniorForm" :inline="true" :model="chainSeniorForm" class="demo-form-inline">
                <el-form-item label="性别：" prop="sex" label-width="90px">
                    <div style="width: 300px;">
                    <el-select clearable v-model="chainSeniorForm.sex">
                        <el-option value="1" label="男"></el-option>
                        <el-option value="2" label="女"></el-option>
                    </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="卡金余额：" prop="money" label-width="90px">
                    <el-input clearable type="number" v-model="chainSeniorForm.smoney" style="width: 120px;"></el-input>
                    -
                    <el-input clearable type="number" v-model="chainSeniorForm.emoney" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="注册日期：" prop="regdate" label-width="90px">
                    <div style="width: 300px;">
                     <el-date-picker clearable style="width: 140px;" v-model="chainSeniorForm.sregdate"
                                     value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>
                    -<el-date-picker clearable style="width: 140px;" v-model="chainSeniorForm.eregdate"
                                     value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="储值总额：" prop="smoney" label-width="90px">
                    <div style="width: 300px;">
                    <el-input clearable type="number" v-model="chainSeniorForm.ssmoney" style="width: 120px;"></el-input>
                    -
                    <el-input clearable type="number" v-model="chainSeniorForm.esmoney" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <!--<el-form-item label="未来店：" prop="daynum" label-width="90px">-->
                    <!--<div style="width: 300px;">-->
                    <!--<el-input clearable type="number" v-model="shopMemberForm.daynum" style="width: 100px;"></el-input>至今天（有多少天未到店）-->
                    <!--</div>-->
                <!--</el-form-item>-->
                <el-form-item label="赠送余额：" prop="gmoney" label-width="90px">
                    <div style="width: 300px;">
                    <el-input clearable type="number" v-model="chainSeniorForm.sgmoney" style="width: 120px;"></el-input>
                    -
                    <el-input clearable type="number" v-model="chainSeniorForm.egmoney" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="消费总额：" prop="servTotal" label-width="90px">
                    <div style="width: 300px;">
                    <el-input clearable type="number" v-model="chainSeniorForm.stotal" style="width: 120px;"></el-input>
                    -
                    <el-input clearable type="number" v-model="chainSeniorForm.etotal" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <!--<el-form-item label="到期日期：" prop="exprite" label-width="90px">-->
                    <!--<div style="width: 300px;">-->
                       <!--<el-date-picker clearable style="width: 140px;" v-model="shopMemberForm.sexprite" value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>-->
                    <!-- - <el-date-picker clearable style="width: 140px;" v-model="shopMemberForm.eexprite" value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>-->
                    <!--</div>-->
                <!--</el-form-item>-->
                <el-form-item label="当前积分：" prop="servNum" label-width="90px">
                    <div style="width: 300px;">
                        <el-input clearable type="number" v-model="chainSeniorForm.jf1" style="width: 120px;"></el-input>
                        -
                        <el-input clearable type="number" v-model="chainSeniorForm.jf2" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="消费次数：" prop="servNum" label-width="90px">
                    <div style="width: 300px;">
                    <el-input clearable type="number" v-model="chainSeniorForm.snum" style="width: 120px;"></el-input>
                    -
                    <el-input clearable type="number" v-model="chainSeniorForm.enum" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="顾客来源：" prop="channel" label-width="90px">
                    <div style="width: 300px;">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="chainSeniorForm.channel">
                        <el-option :key="item.id" :label="item.dcname" :value="item.id"
                                   v-for="item in distChannelList"></el-option>
                    </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="录入渠道：" prop="channel" label-width="90px">
                    <div style="width: 300px;">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="chainSeniorForm.inchanel">
                        <el-option :key="item.value" :label="item.name" :value="item.value"
                                   v-for="item in inchanels"></el-option>
                    </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="生日方式：" label-width="90px">
                    <div style="width: 300px;">
                        <el-select clearable v-model="chainSeniorForm.type" style="width:120px;">
                            <el-option value="month" label="按月"></el-option>
                            <el-option value="day" label="按天"></el-option>
                        </el-select>
                        <el-date-picker
                                v-model="chainSeniorForm.day" style="width:180px;" clearable
                                format="MM 月 dd 日"
                                value-format="MM-dd"
                                v-if="chainSeniorForm.type=='day'?true:false" placeholder="选择日期">
                        </el-date-picker>
                        <el-select clearable v-model="chainSeniorForm.month"  style="width:180px;" v-if="chainSeniorForm.type=='month'?true:false">
                            <el-option value="01" label="1月"></el-option>
                            <el-option value="02" label="2月"></el-option>
                            <el-option value="03" label="3月"></el-option>
                            <el-option value="04" label="4月"></el-option>
                            <el-option value="05" label="5月"></el-option>
                            <el-option value="06" label="6月"></el-option>
                            <el-option value="07" label="7月"></el-option>
                            <el-option value="08" label="8月"></el-option>
                            <el-option value="09" label="9月"></el-option>
                            <el-option value="10" label="10月"></el-option>
                            <el-option value="11" label="11月"></el-option>
                            <el-option value="12" label="12月"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="会员类型：" label-width="90px">
                    <el-select clearable v-model.trim="chainSeniorForm.mtype" filterable placeholder="请选择"
                               style="width: 160px;">
                        <el-option :key="item.id" :label="item.name" :value="item.code"
                                   v-for="item in dictStatusList"></el-option>
                    </el-select>
                    <el-popover
                            placement="right"
                            title="提示"
                            width="310"
                            trigger="hover">
                        <el-button slot="reference"><i class="el-icon-question"></i></el-button>
                        <ul class="tips-content">
                            <li>储值卡会员：开过储值卡的顾客</li>
                            <li>套餐会员：开过资格卡的顾客</li>
                            <li>资格卡会员：购买过套餐的顾客</li>
                            <li>潜在会员：有顾客资料，并且有消费记录但未开卡或者购买过套餐的</li>
                            <li>新客：有顾客资料，但没有消费记录的</li>
                            <li>异店会员：有顾客资料，有异店卡金或资格卡或套餐，但在本店无卡金或资格卡或套餐的</li>
                        </ul>
                    </el-popover>
                </el-form-item>
                <el-row >
                    <el-col :span="6" :offset="6"><el-button @click="seniorMemberSearch" type="primary">提交</el-button></el-col>
                    <el-col :span="6" :offset="4"><el-button @click="chainSeniorForm.visible=false">取消</el-button></el-col>
                </el-row>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="shopSerniorForm.title" :visible.sync="shopSerniorForm.visible" width="860px">
            <el-form label-width="140px" ref="copyForm" :inline="true" class="demo-form-inline">
                <el-form-item label="性别：" prop="sex" label-width="90px">
                    <div style="width: 300px;">
                        <el-select clearable v-model="shopSerniorForm.sex">
                            <el-option value="1" label="男"></el-option>
                            <el-option value="2" label="女"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="卡金余额：" prop="money" label-width="90px">
                    <el-input clearable type="number" v-model="shopSerniorForm.smoney" style="width: 120px;"></el-input>
                    -
                    <el-input clearable type="number" v-model="shopSerniorForm.emoney" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="注册日期：" prop="regdate" label-width="90px">
                    <div style="width: 300px;">
                        <el-date-picker clearable style="width: 140px;" v-model="shopSerniorForm.sregdate" value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>
                        -<el-date-picker clearable style="width: 140px;" v-model="shopSerniorForm.eregdate" value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="储值总额：" prop="smoney" label-width="90px">
                    <div style="width: 300px;">
                        <el-input clearable type="number" v-model="shopSerniorForm.ssmoney" style="width: 120px;"></el-input>
                        -
                        <el-input clearable type="number" v-model="shopSerniorForm.esmoney" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="未来店：" prop="daynum" label-width="90px">
                    <div style="width: 300px;">
                        <el-input clearable type="number" v-model="shopSerniorForm.daynum" style="width: 100px;"></el-input>至今天（有多少天未到店）
                    </div>
                </el-form-item>
                <el-form-item label="赠送余额：" prop="gmoney" label-width="90px">
                    <div style="width: 300px;">
                        <el-input clearable type="number" v-model="shopSerniorForm.sgmoney" style="width: 120px;"></el-input>
                        -
                        <el-input clearable type="number" v-model="shopSerniorForm.egmoney" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="消费总额：" prop="servTotal" label-width="90px">
                    <div style="width: 300px;">
                        <el-input clearable type="number" v-model="shopSerniorForm.stotal" style="width: 120px;"></el-input>
                        -
                        <el-input clearable type="number" v-model="shopSerniorForm.etotal" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="到期日期：" prop="exprite" label-width="90px">
                    <div style="width: 300px;">
                        <el-date-picker clearable style="width: 140px;" v-model="shopSerniorForm.sexprite" value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>
                        - <el-date-picker clearable style="width: 140px;" v-model="shopSerniorForm.eexprite" value-format="yyyy-MM-dd" type="date"  placeholder="选择日期"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="消费次数：" prop="servNum" label-width="90px">
                    <div style="width: 300px;">
                        <el-input clearable type="number" v-model="shopSerniorForm.snum" style="width: 120px;"></el-input>
                        -
                        <el-input clearable type="number" v-model="shopSerniorForm.enum" style="width: 120px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="顾客来源：" prop="channel" label-width="90px">
                    <div style="width: 300px;">
                        <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="shopSerniorForm.channel">
                            <el-option :key="item.id" :label="item.dcname" :value="item.id"
                                       v-for="item in distChannelList"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="录入渠道：" prop="channel" label-width="90px">
                    <div style="width: 300px;">
                        <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="shopSerniorForm.inchanel">
                            <el-option :key="item.value" :label="item.name" :value="item.value"
                                       v-for="item in inchanels"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="会员类型：" label-width="90px">
                    <div style="width: 300px;">
                    <el-select clearable v-model.trim="shopSerniorForm.mtype" filterable placeholder="请选择"
                               style="width: 160px;">
                        <el-option :key="item.id" :label="item.name" :value="item.code"
                                   v-for="item in dictStatusList"></el-option>
                    </el-select>
                    <el-popover
                            placement="right"
                            title="提示"
                            width="310"
                            trigger="hover">
                        <el-button slot="reference"><i class="el-icon-question"></i></el-button>
                        <ul class="tips-content">
                            <li>储值卡会员：开过储值卡的顾客</li>
                            <li>套餐会员：开过资格卡的顾客</li>
                            <li>资格卡会员：购买过套餐的顾客</li>
                            <li>潜在会员：有顾客资料，并且有消费记录但未开卡或者购买过套餐的</li>
                            <li>新客：有顾客资料，但没有消费记录的</li>
                            <li>异店会员：有顾客资料，有异店卡金或资格卡或套餐，但在本店无卡金或资格卡或套餐的</li>
                        </ul>
                    </el-popover>
                    </div>
                </el-form-item>
                <el-form-item label="查询方式：" label-width="90px">
                    <el-select clearable v-model="shopSerniorForm.type">
                        <el-option value="month" label="按月"></el-option>
                        <el-option value="day" label="按天"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <div style="width: 300px;">
                        <el-date-picker v-model="shopSerniorForm.day"
                                        :value-format="yyyy-MM-dd"
                                        v-if="shopSerniorForm.type=='day'?true:false"
                                        placeholder="选择日期"></el-date-picker>
                        <el-select v-model="shopSerniorForm.month" v-if="shopSerniorForm.type=='month'?true:false">
                            <el-option value="01" label="1月"></el-option>
                            <el-option value="02" label="2月"></el-option>
                            <el-option value="03" label="3月"></el-option>
                            <el-option value="04" label="4月"></el-option>
                            <el-option value="05" label="5月"></el-option>
                            <el-option value="06" label="6月"></el-option>
                            <el-option value="07" label="7月"></el-option>
                            <el-option value="08" label="8月"></el-option>
                            <el-option value="09" label="9月"></el-option>
                            <el-option value="10" label="10月"></el-option>
                            <el-option value="11" label="11月"></el-option>
                            <el-option value="12" label="12月"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-row >
                    <el-col :span="6" :offset="8"><el-button @click="shopSeniorSearch()" type="primary">提交</el-button></el-col>
                    <el-col :span="6" :offset="2"><el-button @click="shopSerniorForm.visible=false">取消</el-button></el-col>
                </el-row>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="meminfoDialog.title" :visible.sync="meminfoDialog.visible" width="1150px">
            <el-row style="padding-left: 45px;margin: 0;" width="980px" justify="center">
            <el-button @click="meminfoDialog.showNum=1" type="primary" :plain="meminfoDialog.showNum!=1">基础资料</el-button>
            <el-button @click="meminfoDialog.showNum=2" type="primary" :plain="meminfoDialog.showNum!=2">资料修改</el-button>
            <el-button @click="meminfoDialog.showNum=3" type="primary" :plain="meminfoDialog.showNum!=3">账户调整</el-button>
            <el-button @click="meminfoDialog.showNum=4" type="primary" :plain="meminfoDialog.showNum!=4">卡金流水</el-button>
            <el-button @click="meminfoDialog.showNum=5" type="primary" :plain="meminfoDialog.showNum!=5">套餐记录</el-button>
            <el-button @click="meminfoDialog.showNum=6" type="primary" :plain="meminfoDialog.showNum!=6">消费记录</el-button>
            <el-button @click="meminfoDialog.showNum=7" type="primary" :plain="meminfoDialog.showNum!=7">资料修改记录</el-button>
            <el-button @click="meminfoDialog.showNum=8" type="primary" :plain="meminfoDialog.showNum!=8">寄存记录</el-button>
            <el-button @click="meminfoDialog.showNum=9" type="primary" :plain="meminfoDialog.showNum!=9">优惠券</el-button>
            <el-button @click="meminfoDialog.showNum=10" type="primary" :plain="meminfoDialog.showNum!=10">红包</el-button>
            </el-row>
            <div class="meminfo" v-show="meminfoDialog.showNum==1">
                <div>会员基础信息</div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="22%">手机号码:</td>
                        <td width="28%"><label class="marg5">{{memberDesc.mobile}}</label></td>
                        <td align="right" width="22%">姓名:</td>
                        <td><label class="marg5" width="28%">{{memberDesc.memname}}</label></td></tr>
                    <tr><td align="right">生日:</td>
                        <td><label class="marg5">{{memberDesc.birthday}}</label></td>
                        <td align="right">性别:</td>
                        <td><label class="marg5">{{memberDesc.sex=="1"?"男":"女"}}</label></td></tr>
                    <tr><td align="right">顾客来源:</td>
                        <td><label class="marg5">{{memberDesc.channelName}}</label></td>
                        <td align="right">录入渠道:</td>
                        <td><label class="marg5">{{memberDesc.inchanel | formatValue(inchanels)}}</label></td></tr>
                    <!--<tr><td align="right">积分:</td>-->
                        <!--<td><label class="marg5">0</label></td>-->
                        <!--<td align="right">上次服务员工:</td>-->
                        <!--<td><label class="marg5">{{memberDesc.lastEename}}</label></td></tr>-->
                    <tr><td align="right">住址:</td><td colspan="3"><label class="marg5">{{memberDesc.address}}</label></td></tr>
                    <tr><td align="right">预约权限:</td><td colspan="3" ><el-link type="primary" class="marg5">[关闭预约权限]</el-link></td>  </tr>
                    <tr v-for="member in memberDesc.shopmembers">
                        <td align="right">{{member.shopcode}} {{member.shopname}} 备注:</td><td colspan="3" ><label class="marg5">{{member.memo}}</label></td>
                    </tr>
                </table>
                <div>卡信息:
                    <el-select v-model="cardinfo.id" @change="changeCardinfo()" style="width: 260px;">
                    <el-option v-for="card in memberDesc.cards" :key="card.id" :value="card.id" :label="card.cardno+'('+card.cardname+')'"></el-option>
                   </el-select>
                </div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="22%">卡号:</td>
                        <td width="28%"><label class="marg5">{{cardinfo.cardno}}</label></td>
                        <td align="right" width="22%">卡金余额:</td>
                        <td width="28%"><label class="marg5">{{cardinfo.money}}
                            <el-link v-if="cardinfo.cardtype=='1'"
                                     @click="queryShopCardMoney(cardinfo.id)" type="primary" class="marg5">明细</el-link></label>
                        </td>
                    </tr>
                    <tr><td align="right">储值总额:</td>
                        <td><label class="marg5">{{cardinfo.smoney}}<el-link v-if="cardinfo.cardtype=='1'"
                              @click="queryShopCardMoney(cardinfo.id)" type="primary" class="marg5">明细</el-link></label></td>
                        <td align="right">赠送金余额:</td>
                        <td><label class="marg5">{{cardinfo.gmoney}}
                            <el-link v-if="cardinfo.cardtype=='1'"
                                     @click="queryShopCardMoney(cardinfo.id)" type="primary" class="marg5">明细</el-link></label>
                        </td>
                    </tr>
                    <tr><td align="right">项目折扣:</td>
                        <td><label class="marg5">{{cardinfo.serDis}}折</label></td>
                        <td align="right">产品折扣:</td>
                        <td><label class="marg5">{{cardinfo.proDis}}折</label></td>
                    </tr>
                    <tr><td align="right">开卡门店 :</td>
                        <td><label class="marg5">{{cardinfo.shopname}}</label></td>
                        <td align="right">到期日期:</td>
                        <td><label class="marg5">{{cardinfo.exprite}}</label></td>
                    </tr>
                    <tr><td align="right">开卡日期:</td>
                        <td><label class="marg5">{{cardinfo.makedate}}</label></td>
                        <td align="right"></td><td></td>
                    </tr>
                </table>
                <div>套餐信息</div>
                <table border="1" cellspacing="0"  class="taoctable">
                    <tr><td rowspan="2" width="22%">套餐名称</td><td colspan="5">套餐明细</td></tr>
                    <tr><td>项目/产品名称</td><td>总数量</td><td>剩余数量</td><td>剩余金额</td><td>到期日期</td></tr>
                    <tr v-for="item in memberDesc.packages" style="height: 26px;">
                        <td>{{item.mpname}}</td><td>{{item.servname}}<label style="color: #ee9900"> {{item.isGift=='1'?'赠':''}}</label></td>
                        <td>{{item.total}}</td><td>{{item.snum}}</td>
                        <td>{{item.lessmoney}}</td><td>{{item.expiryTime}}</td>
                    </tr>
                </table>
                <div>跟进信息</div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="22%">兴趣爱好:</td>
                        <td width="28%"><label class="marg5">{{memberDesc.hobby}}</label></td>
                        <td align="right" width="22%">学历:</td>
                        <td width="28%"><label class="marg5">{{memberDesc.education}}</label></td>
                    </tr>
                    <tr><td align="right">消费习惯:</td>
                        <td><label class="marg5">{{memberDesc.saleHabit}}</label></td>
                        <td align="right">职业:</td>
                        <td><label class="marg5">{{memberDesc.job}}</label></td>
                    </tr>
                    <tr><td align="right">饮食习惯:</td>
                        <td><label class="marg5">{{memberDesc.foodHabit}}</label></td>
                        <td align="right">年收入:</td>
                        <td><label class="marg5">{{memberDesc.incomes}}</label></td>
                    </tr>
                    <tr><td align="right">运动习惯 :</td>
                        <td><label class="marg5">{{memberDesc.sportHabit}}</label></td>
                        <td align="right">伴侣职业:</td>
                        <td><label class="marg5">{{memberDesc.partnerJob}}</label></td>
                    </tr>
                    <tr><td align="right">其他:</td><td colspan="3"><label class="marg5">{{memberDesc.others}}</label></td></tr>
                </table>
                <div>智能分析
                     <el-button size="small" icon="el-icon-arrow-left" @click="downMemberStatic"></el-button>
                     <el-button size="small">{{memberStatic.yearmonth}}</el-button>
                     <el-button size="small" @click="upMemberStatic"><i class="el-icon-arrow-right" ></i></el-button>
                </div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="22%">当月消费金额:</td>
                        <td width="28%"><label class="marg5">{{memberStatic.cmMoney}}</label></td>
                        <td align="right"  width="22%">当月消费次数:</td>
                        <td width="28%"><label class="marg5">{{memberStatic.cmNum}}</label></td></tr>
                    <tr><td align="right">
                        <el-popover placement="right" width="400" trigger="hover">
                            <el-button slot="reference"><i class="el-icon-question"></i></el-button>
                        <ul class="tips-content">
                            <li>从当前月回溯12个月的消费金额</li>
                        </ul></el-popover>近一年消费金额:</td>
                        <td><label class="marg5">{{memberStatic.cyMoney}}</label></td>
                        <td align="right">
                        <el-popover placement="right" width="400" trigger="hover">
                            <el-button slot="reference"><i class="el-icon-question"></i></el-button>
                        <ul class="tips-content">
                              <li>从当前月回溯12个月的消费次数</li>
                        </ul></el-popover>近一年消费次数:</td>
                        <td><label class="marg5">{{memberStatic.cyNum}}</label></td></tr>
                    <tr><td align="right">平均月消费金额:</td>
                        <td><label class="marg5">{{memberStatic.serviceJe}}</label></td>
                        <td align="right">平均月消费次数:</td>
                        <td><label class="marg5">{{memberStatic.serviceRate | formatNumber }}</label></td>
                    </tr>
                </table>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==2">
                <div>会员信息</div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="20%">手机号码:</td><td width="30%"><el-input v-model="membercard.mobile"/></td>
                        <td align="right" width="20%">姓名:</td><td width="30%"><el-input v-model="membercard.memname"/></td></tr>
                    <tr><td align="right">生日:</td>
                        <td><el-date-picker v-model="membercard.birthday" type="date" placeholder="选择日期"
                                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker></td>
                        <td align="right">性别:</td>
                        <td style="padding-left: 5px">
                            <el-radio v-model="membercard.sex" label="1">男</el-radio>
                            <el-radio v-model="membercard.sex" label="2">女</el-radio>
                       </td>
                    </tr>
                    <tr><td align="right">住址:</td><td colspan="3"><el-input v-model="membercard.address"/></td></tr>
                </table>
                <div>卡信息:<el-select style="width: 260px;" v-model="membercard.cardid" @change="changeMemberCard()">
                    <el-option v-for="card in memberDesc.cards" :key="card.id" :value="card.id" :label="card.cardno+'('+card.cardname+')'"></el-option></el-select>
                </div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="20%">卡号:</td><td width="30%"><label class="margl0">{{membercard.cardno}}</label></td>
                        <td align="right" width="20%">会员卡级别:</td><td width="30%">
                            <el-select v-model="membercard.chid" width="300px">
                                <el-option v-for="card in cardlist"
                                           :value="card.id"
                                           :label="card.cpname"
                                           :disabled="card.status=='2'"
                                           v-if="membercard.cardtype==card.cardType"></el-option>
                            </el-select>
                        </td></tr>
                    <tr><td align="right">到期日期:</td>
                        <td><el-date-picker v-model="membercard.exprite" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd HH:mm:ss"
                                            :disabled="membercard.cardtype=='2'">
                            </el-date-picker><br/>
                            <lable style="font-size: 10px">*如此卡没有有效期请不要填</lable> </td>
                        <td align="right">卡备注:</td><td><el-input v-model="membercard.cardmemo"/></td>
                    </tr>
                </table>
                <el-row><el-col :offset="22" :span="1"><el-button type="primary" @click="saveMemberCard()">确认修改</el-button></el-col></el-row>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==3">
                <div>修改卡内余额及赠送金额:<el-select v-model="cardmoney.id" @change="changeCardmoney()">
                    <el-option v-for="card in cardmoney.cards" style="width: 280px;"
                               :key="card.id"
                               :value="card.id"
                               :label="card.cardno+'('+card.cardname+')'">
                    </el-option></el-select></div>
                <table border="1" cellspacing="0" >
                    <tr><td align="right" width="25%">会员卡内可用金额:</td><td><label>{{cardmoney.money}} </label>
                        <el-link  @click="editShopCardMoney(cardmoney.id)" type="primary" class="marg5">修改</el-link></td>
                        <td align="right" width="25%">赠送可用金额:</td><td><label>{{cardmoney.gmoney}}</label>
                        <el-link  @click="editShopCardMoney(cardmoney.id)" type="primary" class="marg5">修改</el-link></td></tr>
                    <tr>
                        <td align="left" colspan="4">提示：卡内余额是指充值卡内原本剩下的金额。此功能用于恢复使用本平台以前的会员卡里的卡金，
                            此处填入的数字不进入当日的店内现金报表，但此操作将被记录在"会员资料修改日志”和“卡金流水”中。</td>
                    </tr>
                </table>
                <yid-table  ref="shopcardmoneyTable" :data="cardmoney.shopcards" v-show="cardmoney.shopcards.length>0">
                    <yid-table-column prop="shopcode" label="门店编码" min-width="100"></yid-table-column>
                    <yid-table-column prop="shopname" label="门店名称" min-width="100"></yid-table-column>
                    <yid-table-column prop="nmoney" label="卡金金额" min-width="100">
                        <template slot-scope="scope">
                            <el-input type="number" v-model="scope.row.nmoney"/>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="ngmoney" label="赠送金额" min-width="100">
                        <template slot-scope="scope">
                            <el-input type="number" v-model="scope.row.ngmoney"/>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="updateCardmoney(scope.row)">确认修改</el-button>
                        </template>
                    </yid-table-column>
                </yid-table>
                <el-row><el-col :offset="22" :span="1"></el-col></el-row>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==4">
                <div>
                    <label style="color: red">*</label>卡信息:
                    <el-select v-model="cardrecordform.cardno" @change="changCardRecord" style="width:360px;">
                    <el-option v-for="card in memberDesc.cards"
                               :value="card.cardno"
                               :label="card.cardno+'('+card.cardname+')'"></el-option>
                   </el-select><!--1充值2消费3买套餐4买产品5退卡6退项目7退产品-->
                    <label v-if="cardrecordform.cardtype=='1'">单据类型:</label>
                    <el-select clearable v-model="cardrecordform.btype" style="width:220px;" v-if="cardrecordform.cardtype=='1'">
                    <el-option value="1" label="充值"></el-option>
                    <el-option value="2" label="消费"></el-option>
                    <el-option value="3" label="买套餐"></el-option>
                    <!--<el-option value="4" label="买产品"></el-option>-->
                    <el-option value="5" label="退卡"></el-option>
                    <el-option value="6" label="退项目"></el-option>
                    <el-option value="7" label="退产品"></el-option>
                    <el-option value="8" label="卡调整"></el-option>
                    </el-select>
                    <lable v-if="cardrecordform.cardtype=='1'">卡金类型:</lable>
                    <el-select clearable v-model="cardrecordform.mtype" style="width:220px;" v-if="cardrecordform.cardtype=='1'">
                    <el-option value="1" label="卡金"></el-option>
                    <el-option value="2" label="赠送金"></el-option>
                    </el-select>
                    发生日期:<el-date-picker class="margl5"
                        v-model="cardrecordform.date" value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                       </el-date-picker>
                    <el-button type="primary" @click="queryCardRecords()" style="margin-left: 10px;">查询</el-button>
                </div>
                <div v-if="cardrecordform.cardtype=='1'">
                <yid-table pagination ref="cardrecords">
                    <yid-table-column label="单号" min-width="160" prop="billcode"></yid-table-column>
                    <yid-table-column label="单据类型" min-width="80" prop="btype">
                        <template slot-scope="scope">
                            {{scope.row.btype | formatValue(cardbtype)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="变动金额" min-width="80" prop="money">
                        <template slot-scope="scope">{{scope.row.money*scope.row.direction}}</template>
                    </yid-table-column>
                    <yid-table-column label="结存余额" min-width="80" prop="balance"></yid-table-column>
                    <yid-table-column label="卡金类型" min-width="80" prop="mtype">
                        <template slot-scope="scope">
                            {{scope.row.mtype=='1'?'卡金':'赠送'}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="发生时间" min-width="160" prop="createdTime"></yid-table-column>
                    <yid-table-column label="操作门店" min-width="80" prop="shopname"></yid-table-column>
                    <yid-table-column label="操作人" min-width="80" prop="createdBy"></yid-table-column>
                </yid-table>
                </div>
                <yid-table pagination ref="cardzklogs" v-if="cardrecordform.cardtype=='2'">
                    <yid-table-column label="单号" min-width="160" prop="billcode"></yid-table-column>
                    <yid-table-column label="单据类型" min-width="80" prop="type">
                        <template slot-scope="scope">
                            {{scope.row.type=='1'?'开卡':'续卡'}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="金额" min-width="80" prop="money"></yid-table-column>
                    <yid-table-column label="发生日期" min-width="120" prop="createdTime"></yid-table-column>
                    <yid-table-column label="生效日期" min-width="120" prop="stime"></yid-table-column>
                    <yid-table-column label="到期日期" min-width="120" prop="etime"></yid-table-column>
                    <yid-table-column label="状态" min-width="80" prop="status">
                        <template slot-scope="scope">
                            {{scope.row.status}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="退期日期" min-width="120" prop="refundtime"></yid-table-column>
                    <yid-table-column label="操作门店" min-width="80" prop="shopname"></yid-table-column>
                </yid-table>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==5">
                <div>
                    套餐名称:<el-input v-model="packrecordform.mpname" style="width:160px;" placeholder="套餐名称"/>
                    项目/产品名称:<el-input v-model="packrecordform.name" style="width:160px;" placeholder="项目/产品名称"/>
                    发生日期:<el-date-picker class="margl5"
                        v-model="packrecordform.date" value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                     </el-date-picker>
                    <el-button type="primary" @click="queryPackageList()" style="margin-left: 10px;">查询</el-button>
                </div>
                <yid-table pagination ref="packageRecords">
                    <yid-table-column label="单号" min-width="160" prop="billcode"></yid-table-column>
                    <yid-table-column label="套餐名称" min-width="120" prop="mpname"></yid-table-column>
                    <yid-table-column label="类型" min-width="60" prop="isShareOper">
                        <template slot-scope="scope">
                            {{getPackageRecordTypeName(scope.row)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="项目名称/产品名称" min-width="140" prop="sername">
                        <template slot-scope="scope">
                            {{ scope.row.sername | jsonSernameFormate }}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="变动数量" min-width="80" prop="saleNum">
                        <template slot-scope="scope">{{scope.row.saleNum*scope.row.direction}}</template>
                    </yid-table-column>
                    <yid-table-column label="剩余数量" min-width="80" prop="surplusNum"></yid-table-column>
                    <yid-table-column label="发生时间" min-width="180" prop="saleTime"></yid-table-column>
                    <yid-table-column label="门店" min-width="80" prop="shopname"></yid-table-column>
                    <yid-table-column label="操作人" min-width="100" prop="oper"></yid-table-column>
                </yid-table>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==6">
            <div>
                发生日期:<el-date-picker class="margl5"
                    v-model="memberfrom.date" value-format="yyyy-MM-dd"
                    style="margin-left: 5px"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
                <el-button type="primary" @click="queryMemberRecords()" style="margin-left: 10px;">查询</el-button>
            </div>
            <yid-table pagination ref="memberRedcords">
                <yid-table-column label="单号" min-width="180" prop="billcode"></yid-table-column>
                <yid-table-column label="消费内容" min-width="140" prop="content"></yid-table-column>
                <yid-table-column label="单据金额" min-width="80" prop="hjje">
                    <template slot-scope="scope">
                        {{ scope.row.hjje | jsonStringFormate }}
                    </template>
                </yid-table-column>
                <yid-table-column label="合计折扣" min-width="80" prop="zkeTotal">
                    <template slot-scope="scope">
                        {{ scope.row.zkeTotal | jsonStringFormate }}
                    </template>
                </yid-table-column>
                <yid-table-column label="消费金额" min-width="80" prop="payje"></yid-table-column>
                <yid-table-column label="付款方式" min-width="140" prop="payinfo">
                    <template slot-scope="scope">
                        {{ scope.row.payinfo | jsonStringFormate }}
                    </template>
                </yid-table-column>
                <yid-table-column label="消费时间" min-width="160" prop="servdate"></yid-table-column>
                <yid-table-column label="消费门店" min-width="80" prop="shopname"></yid-table-column>
                <yid-table-column label="服务人员" min-width="80" prop="eeinfo">
                    <template slot-scope="scope">
                        {{ scope.row.eeinfo | jsonEenameFormate }}
                    </template>
                </yid-table-column>
                <yid-table-column label="操作人" min-width="80" prop="oper"></yid-table-column>
            </yid-table>
        </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==7">
                <div>
                    更改时间:<el-date-picker class="margl5" style="width: 220px;"
                        v-model="memberlogfrom.date" value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                    <el-button type="primary" @click="queryMemberEditlogs()" style="margin-left: 10px;">查询</el-button>
                </div>
                <yid-table pagination ref="memberlog">
                    <yid-table-column label="序号" type="index" width="60" ></yid-table-column>
                    <yid-table-column label="更改人" min-width="140" prop="oper"></yid-table-column>
                    <yid-table-column label="更改时间" min-width="140" prop="opertime"></yid-table-column>
                    <yid-table-column label="执行操作" min-width="320" prop="opercontent"></yid-table-column>
                </yid-table>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==8">
                <div>
                    购买时间:<el-date-picker class="margl5"
                                         v-model="storefrom.date" value-format="yyyy-MM-dd"
                                         type="daterange"
                                         range-separator="至"
                                         start-placeholder="开始日期"
                                         end-placeholder="结束日期">
                            </el-date-picker>
                    订单编号:<el-input clearable v-model="storefrom.billcode" placeholder="订单编号" style="width: 130px;"></el-input>
                    商品编号:<el-input clearable v-model="storefrom.pcode" placeholder="商品编号" style="width: 120px;"></el-input>
                    商品名称:<el-input clearable v-model="storefrom.pname" placeholder="商品名称" style="width: 130px;"></el-input>
                    <el-button type="primary" @click="queryMemberStores()" class="margl5">查询</el-button>
                </div>
                <yid-table pagination ref="memberStores" :data="this.storeData">
                    <yid-table-column label="商品编号" min-width="80" prop="pcode"></yid-table-column>
                    <yid-table-column label="商品名称" min-width="140" prop="pname"></yid-table-column>
                    <yid-table-column label="寄存数量" min-width="80" prop="total"></yid-table-column>
                    <yid-table-column label="寄存门店" min-width="120" prop="shopname"></yid-table-column>
                    <yid-table-column label="购买时间" min-width="160" prop="createdTime"></yid-table-column>
                    <yid-table-column label="寄存来源" min-width="100" prop="source">
                        <template slot-scope="scope">
                            {{  scope.row.source == '1' ? '购买商品' : '套餐划扣'}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="订单编号" min-width="130" prop="billcode"></yid-table-column>
                    <yid-table-column label="购买单价" min-width="100" prop="price"></yid-table-column>
                    <yid-table-column label="已领取/剩余" min-width="100">
                        <template slot-scope="scope">
                            {{  scope.row.outnum}} / {{scope.row.checknum }}
                        </template>
                    </yid-table-column>
                    <yid-table-column  label="提货记录" width="100" type="expand">
                        <template slot-scope="scope">
                            <yid-table ref="memberStorelogs" style="margin-top: 5px;" :data="scope.row.logs">
                                <yid-table-column prop="billcode" label="出库单号" min-width="130" ></yid-table-column>
                                <yid-table-column prop="createdTime" label="操作时间" min-width="160" ></yid-table-column>
                                <yid-table-column label="操作方式" min-width="80" >
                                    <template slot-scope="scope">提货</template>
                                </yid-table-column>
                                <yid-table-column prop="btype" label="类型" min-width="80" >
                                    <template slot-scope="scope">{{scope.row.btype=='1'?'寄存入库':'寄存出库'}}</template>
                                </yid-table-column>
                                <yid-table-column prop="num" label="出库数量" min-width="80" ></yid-table-column>
                                <yid-table-column prop="stock" label="剩余库存" min-width="80" ></yid-table-column>
                                <yid-table-column prop="createdBy" label="操作人" min-width="80"></yid-table-column>
                                <yid-table-column prop="memo" label="备注" min-width="100"></yid-table-column>
                            </yid-table>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==9">
                <div>
                    活动名称:<el-input clearable v-model="coupon.maname" placeholder="活动名称" style="width: 130px;"></el-input>
                    状态:<el-select clearable v-model="coupon.status" style="width:110px;">
                            <el-option value="1" label="未使用"></el-option><el-option value="2" label="已使用"></el-option>
                    <el-option value="3" label="已过期"></el-option></el-select>
                    领用时间:<el-date-picker class="margl5" style="width: 200px;"
                                         v-model="coupon.date" value-format="yyyy-MM-dd"
                                         type="daterange"
                                         range-separator="至"
                                         start-placeholder="开始日期"
                                         end-placeholder="结束日期"></el-date-picker>
                    使用时间:<el-date-picker class="margl5" style="width: 200px;"
                                         v-model="coupon.udate" value-format="yyyy-MM-dd"
                                         type="daterange"
                                         range-separator="至"
                                         start-placeholder="开始日期"
                                         end-placeholder="结束日期"></el-date-picker>
                    <el-button type="primary" @click="queryCouponlogs()" style="margin-left: 10px;">查询</el-button>
                </div>
                <yid-table pagination ref="couponlogs">
                    <yid-table-column label="活动名称" min-width="140" prop="maname" ></yid-table-column>
                    <yid-table-column label="优惠券名称" min-width="140" prop="cpname"></yid-table-column>
                    <yid-table-column label="优惠券码" min-width="140" prop="bcode"></yid-table-column>
                    <yid-table-column label="形式" min-width="100" prop="couponType">
                        <template slot-scope="scope">
                            {{scope.row.couponType=='1'?'定额':'折扣' + scope.row.discount + scope.row.couponType=='1'?'元':'折'}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="领用时间" min-width="220" prop="createdTime"></yid-table-column>
                    <yid-table-column label="有效期" min-width="220" prop="date">
                        <template slot-scope="scope">
                            {{ (scope.row.sdate && scope.row.edate)?(scope.row.sdate.substring(0,10)+ "~" + scope.row.edate.substring(0,10)):'' }}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="状态" min-width="100" prop="status">
                        <template slot-scope="scope">
                            {{scope.row.status=='1'?'未使用':''}}
                            {{scope.row.status=='2'?'已使用':''}}
                            {{scope.row.status=='3'?'已过期':''}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="消费单号" min-width="120" prop="billcode"></yid-table-column>
                    <yid-table-column label="使用时间" min-width="120" prop="usedDate"></yid-table-column>
                    <yid-table-column label="使用门店" min-width="120" prop="shopname"></yid-table-column>
                </yid-table>
            </div>
            <div class="meminfo" v-show="meminfoDialog.showNum==10">
                <div>
                    活动名称:<el-input clearable v-model="redenvelope.maname" placeholder="活动名称" style="width: 130px;"></el-input>
                    状态:<el-select clearable v-model="redenvelope.status" style="width:140px;">
                    <el-option value="1" label="未使用"></el-option><el-option value="2" label="已使用"></el-option>
                    <el-option value="3" label="已过期"></el-option></el-select>
                    领用时间:<el-date-picker class="margl5" style="width: 200px;"
                                         v-model="redenvelope.date" value-format="yyyy-MM-dd"
                                         type="daterange"
                                         range-separator="至"
                                         start-placeholder="开始日期"
                                         end-placeholder="结束日期"></el-date-picker>
                    <el-button type="primary" @click="queryRedenvelopes()" class="margl5">查询</el-button>
                </div>
                <yid-table pagination ref="redenvelopes" :data="this.redenvelopeData">
                    <yid-table-column label="活动名称" min-width="140" prop="maname" ></yid-table-column>
                    <yid-table-column label="红包名称" min-width="140" prop="rname"></yid-table-column>
                    <yid-table-column label="红包码" min-width="140" prop="bcode"></yid-table-column>
                    <yid-table-column label="价值" min-width="100" prop="money"></yid-table-column>
                    <yid-table-column label="领用时间" min-width="220" prop="createdTime"></yid-table-column>
                    <yid-table-column label="有效期" min-width="220" prop="date">
                        <template slot-scope="scope">
                            {{ (scope.row.sdate && scope.row.edate)?(scope.row.sdate.substring(0,10)+ "~" + scope.row.edate.substring(0,10)):'' }}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="状态" min-width="100" prop="status">
                        <template slot-scope="scope">
                            {{scope.row.status=='1'?'未使用':''}}
                            {{scope.row.status=='2'?'已使用':''}}
                            {{scope.row.status=='3'?'已过期':''}}
                        </template>
                    </yid-table-column>
                    <yid-table-column  label="使用次数" width="60" type="expand" prop="rnum">
                        <template slot-scope="scope">
                            <yid-table ref="redenvelopelogs" style="margin-top: 5px;" :data="scope.row.logs">
                                <yid-table-column prop="billcode" label="消费单号" min-width="160" ></yid-table-column>
                                <yid-table-column prop="money" label="使用金额" min-width="100" ></yid-table-column>
                                <yid-table-column prop="lessMoney" label="剩余金额" min-width="100" ></yid-table-column>
                                <yid-table-column prop="shopname" label="使用门店" min-width="120"></yid-table-column>
                            </yid-table>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </yid-dialog>

        <yid-dialog :title="shopcardmoneyDialog.title" :visible.sync="shopcardmoneyDialog.visible" width="650px">
            <yid-table ref="shopcardmoneyTable" :data="shopcardmoneyDialog.data">
                <yid-table-column prop="shopcode" label="门店编码" min-width="100"></yid-table-column>
                <yid-table-column prop="shopname" label="门店名称" min-width="100"></yid-table-column>
                <yid-table-column prop="smoney" label="储值总额" min-width="100"></yid-table-column>
                <yid-table-column prop="money" label="卡金金额" min-width="100"></yid-table-column>
                <yid-table-column prop="gmoney" label="赠送金额" min-width="100"></yid-table-column>
            </yid-table>
        </yid-dialog>

    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import {exportExecl,imporExecl} from "../../library/helper/memberexecl";
    import moment from 'moment';
    import download from '@src/library/http/download'
    import YidDialog from "../../library/components/dialog/src/dialog";
    import YidTableColumn from "../../library/components/table/src/table-column";
    moment.locale();

    export default {
        components: {
            YidTableColumn,
            YidDialog},
        name: "member-relation",
        data() {
            return {
                activeName: 'chainMember',
                dictStatusList: [
                    {id: '2', code: '2', name: '储值卡会员'},
                    {id: '3', code: '3', name: '套餐会员'},
                    {id: '4', code: '4', name: '资格卡会员'},
                    {id: '1', code: '1', name: '潜在会员'},
                    {id: '0', code: '0', name: '新客'},
                    {id: '5', code: '4', name: '异店会员'},
                ],
                distChannelList: [],
                inchanels: [{value:"1",name:'门店业务端'},{value:"2",name:'门店管理端'},{value:"3",name:'顾客手机端'},{value:"4",name:'设计师端'}],
                cardbtype: [{value:"1",name:"卡账户调整"},{value:"2",name:"消费"},
                    {value:"3",name:"购买套餐"},{value:"4",name:"充值"},
                    {value:"5",name:"开卡"},{value:"6",name:"退款"},
                    {value:"7",name:"卡转入"},{value:"8",name:"卡转出"},
                    {value:"9",name:"导入"},{value:"10",name:"代付"}],
                employeeList: [],
                chainMemberForm: {
                    name: '',page: 1, limit: 10, total: 0
                },
                chainSeniorForm:{
                    title: '高级查询',
                    visible: false,
                    sex:'',
                    channel:'',
                    inchanel:'',
                    sregdate:'',
                    eregdate:'',
                    daynum:'',
                    stotal:'',
                    etotal:'',
                    snum:'',
                    enum:'',
                    smoney:'',
                    emoney:'',
                    sgmoney:'',
                    egmoney:'',
                    ssmoney:'',
                    esmoney:'',
                    sexprite:'',
                    eexprite:'',
                    type:'',
                    month:'',
                    day:'',
                    jf1:'',
                    jf2:'',
                    mtype:'',
                    page: 1, limit: 10, total: 0
                },
                pageInfo: {page: 1, limit: 10, total: 0 ,type: '1'},
                shopMemberForm:{ name:''},
                shopSerniorForm:{
                    title: '高级查询',
                    visible: false,
                    mtype:'',
                    sex:'',
                    channel:'',
                    inchanel:'',
                    sregdate:'',
                    eregdate:'',
                    daynum:'',
                    stotal:'',
                    etotal:'',
                    snum:'',
                    enum:'',
                    smoney:'',
                    emoney:'',
                    sgmoney:'',
                    egmoney:'',
                    ssmoney:'',
                    esmoney:'',
                    sexprite:'',
                    eexprite:'',
                    type:'',
                    month:'',
                    day:'',
                    jf1:'',
                    jf2:''
                },
                model: {
                    startTime: '',
                    endTime: ''
                },
                meminfoDialog: {
                    title: '会员资料详细',
                    visible: false,
                    showNum:1
                },
                memberHj:{
                    count:0, zkj:0, zzs:0
                },
                memberTables:[],
                memberDesc: {
                    memid:'',
                    memname:'',
                    mobile:'',
                    sex:'',
                    birthday:'',
                    channelName:'',
                    inchanel:'',
                    lastEename:'',
                    latelyTime:'',
                    latelyJe:'',
                    address:'',
                    hobby:'',
                    education:'',
                    job:'',
                    incomes:'',
                    partnerJob:'',
                    saleHabit:'',
                    foodHabit:'',
                    sportHabit:'',
                    others:'',
                    cards:[],
                    cardindex:'',
                    packages:[],
                    memo:''
                },
                memberStatic: {yearmonth:"", cmMoney:'', cmNum:'', cyMoney:'', cyNum:'', servNum:'', serviceRate:'', serviceJe:''},
                cardinfo: {id:"",cardno:"",cardtype:"",money:"",gmoney:"",smoney:"",serDis:"",proDis:"",shopname:"",exprite:"",makedate:""},
                membercard: { memid:"",memname:"",  mobile:"", sex:"", birthday:"", cardid:"", cardtype:'',
                              cardname:"", chid:"", cardname1:"", exprite:"", cardmemo:"" ,address: "" },
                cardmoney: { cards:[], id:"",cardtype:"",money:"",gmoney:"",nmoney:"",ngmoney:"",bmoney:"",bgmoney:"" ,shopcards:[]},
                cardlist:[],
                cardrecordform:{ memid:'', cardid:'', cardtype:'1', btype:'', mtype:'', date:[], sdate:'', edate:'',page: 1, limit: 10, total: 0},
                packrecordform:{ memid:'',mpname:'', name:'', date:[], sdate:'', edate:'',page: 1, limit: 10, total: 0},
                packagelist:[],
                memberfrom: { memid:'', date:'', sdate:'', edate:'',page: 1, limit: 10, total: 0 },
                memberlogfrom: { memid:'', date:'', sdate:'', edate:'',page: 1, limit: 10, total: 0 },
                memberpackfrom: { name:'', mpname:'',servname:'',date:[], page: 1, limit: 10, total: 0 },
                memberpackData: [],
                memberpackhj: {servsum:0,packsum:0,servje:0,packje:0 },
                memberDelfrom: { name:'' , date:[], page: 1, limit: 10, total: 0},
                memberExporfrom: { name:'', date:[], page: 1, limit: 10, total: 0},
                memberBirthfrom: { type:'', day:'', month:'', page: 1, limit: 10, total: 0},
                memberImport:{ shopid: '', type: '', members:[] },
                memberImpform:{
                    page: 1, limit: 10, total: 0
                },
                memberImpdata:[
                    [""],
                    ["mobile","memname","sex","cardno","cpcode","cpname","impmoney","impgmoney","impexprite","impbirthday","cardmemo","jf","impregdate"],
                    ["mobile","memname","sex","cardno","cpcode","cpname","impexprite","impbirthday","cardmemo"],
                    ["mobile","memname","sex","type","servcode","impsl","impmoney","impexprite"]
                ],
                memberExpdata:[
                    {
                        memname: '姓名',
                        mobile: '手机号',
                        sex: '性别',
                        shopname: '门店',
                        money: '卡金总余额',
                        univalent: '客单价',
                        servTotal: '消费总额',
                        servNum: '消费次数',
                        serviceRate: '消费频率',
                        latelyTime: '上次消费时间',
                        lastEename: '上次服务员工',
                        tags: '会员状态',
                    },{
                        mobile: '手机号',
                        memname: '姓名',
                        sex: '性别',
                        cardno: '会员卡号',
                        cpcode: '储值卡编码',
                        cpname: '储值卡名称',
                        impmoney: '卡内余额（元）',
                        impgmoney: '赠送金余额（元）',
                        impexprite: '到期日期',
                        impbirthday: '生日',
                        memo: '卡备注',
                        jf: '积分',
                        impregdate: '注册日期',
                        errorInfo: '错误信息'
                      }, {
                            mobile: '手机号',
                            memname: '姓名',
                            sex: '性别',
                            cardno: '会员卡号',
                            cpcode: '储值卡编码',
                            cpname: '储值卡名称',
                            impexprite: '到期日期',
                            impbirthday: '生日',
                            memo: '卡备注',
                            errorInfo: '错误信息'
                        }, {
                            mobile: '手机号',
                            memname: '姓名',
                            sex: '性别',
                            type: '类型',
                            servcode: '项目/产品编码',
                            impsl: '剩余数量',
                            impmoney: '剩余金额（元）',
                            impexprite: '到期日期',
                            errorInfo: '错误信息'
                      }
                    ],
                fileList:[],
                selectPackages:[],
                selectServices:[],
                selectProducts:[],
                storefrom: { mimid:'', date:[], billcode:'', pcode:'', pname:'',page: 1, limit: 10, total: 0 },
                storeData:[],
                ShopList:[],
                shopid:'',
                impShopList:[],
                rules: {shopid:{required: true, message: '请选择门店', trigger: 'red'}},
                shopcardmoneyDialog: { title: '', visible: false, data: [] },
                coupon: { maname:'',status:'',date:[],udate:[] },
                redenvelope: { maname:'',status:'',date:[] , page: 1, limit: 10, total: 0 },
                redenvelopeData: []
            }
        },
        filters: {
            jsonStringFormate(str){
                if(str){
                    let info=""
                    try{
                        const list=JSON.parse(str);
                        list.forEach(l =>{
                            info=info+l.payname+":"+l.money+" "
                        })
                        return info;
                    }catch (e){
                        return str
                    }
                }else{
                    return "";
                }
            },
            jsonEenameFormate(str){
                if(str){
                    let info=""
                    try{
                        const list=JSON.parse(str);
                        list.forEach(l =>{
                            info=info+l.eename+" "
                        })
                        return info;
                    }catch (e){
                        return str
                    }
                }else{
                    return "";
                }
            },
            jsonSernameFormate(str){
                if(str){
                    try{
                        const list=JSON.parse(str);
                        if(list && list.length>0){
                            let info=""
                            list.forEach(l =>{
                                info=info+l.sname+","
                            })
                            return info
                        }else{
                            return str
                        }
                    }catch (e){
                        return str
                    }

                }else{
                    return "";
                }
            },
            dateFormat(str){
                if(str){
                    return str.substring(5,10)
                }else{
                    return ""
                }
            },
            formatNumber(num){
                if(num){
                    return num.toFixed(2)
                }
            },
            formatValue(str,stsList){
                let label=""
                stsList.map(m =>{
                    if(m.value == str){
                        label=m.name
                    }
                })
                if(label){
                    return label
                }else{
                    return str
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                service.member.memberinfo.queryCardList().then(res =>{
                    if(res.resp_code=="200"){
                        this.cardlist=res.data;
                    }
                })
                service.member.memberinfo.selectPackages({status:'1'}).then(res => {
                    if(res.resp_code=="200"){
                        this.selectPackages=res.data;
                    }
                })
                service.member.memberinfo.selectServices({status:'1'}).then(res => {
                    if(res.resp_code=="200"){
                        this.selectServices=res.data;
                    }
                })
                service.member.memberinfo.selectProducts({status:'1'}).then(res => {
                    if(res.resp_code=="200"){
                        this.selectProducts=res.data;
                    }
                })
                service.memInfo.distchannelListAll({isDel: '0'}).then(res => {
                    if (res.resp_code == 200) {
                        this.distChannelList = res.data;
                    }
                })
                service.chain.shop.shopList({status:'1'}).then(res => {
                    if(res.resp_code == 200) {
                        this.ShopList = res.data;
                        this.impShopList = res.data;
                    }
                })
            },
            handleSizeChange(val) {
                this.pageInfo.limit=val;
                if(this.pageInfo.type=='1'){
                    this.shopMemberSearch();
                }else{
                    this.shopSeniorSearch();
                }
            },
            handleCurrentChange(val) {
                if(this.pageInfo.type=='1'){
                    this.shopMemberSearch(val);
                }else{
                    this.shopSeniorSearch(val);
                }
            },
            handleSizeChange2(val) {
                this.memberpackfrom.limit=val;
                this.queryMemberPackages();
            },
            handleCurrentChange2(val) {
                this.queryMemberPackages(val);
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex<5 || columnIndex>12) {
                    if (row.rownum > 0) {
                        return {
                            rowspan: row.rownum,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
                if (columnIndex<3 || columnIndex>8) {
                    if (row.rownum > 0) {
                        return {
                            rowspan: row.rownum,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            handleClick(tab) {
                if (tab.name == 'shopMember') {
                    //this.search();
                } else if (tab.name == 'assignment') {
                    //this.getjobList();
                } else if (tab.name == 'logs') {
                    //ServiceLog.methods.searchLog()
                } else if(tab.name == 'improtMember'){
                    this.queryImportMembers();
                }
            },
            removeMem(row) {
                yid.util.confirm('删除会员将会删除会员下所有卡账户，您确认要删除会员信息吗？', '', '', () => {
                    const params = {id:row.memshopid,isDel:'1',revision:row.revision}
                    service.member.userinfo.removeUserinfo(params).then(res => {
                        if (res.resp_code == 200) {
                            this.shopMemberSearch();
                        }
                    });
                })
            },
            recoverMem(row) {
                const params = {id:row.memshopid,isDel:'0',revision:row.revision}
                service.member.userinfo.removeUserinfo(params).then(res => {
                    if (res.resp_code == 200) {
                        this.queryDelMembers();
                    }
                });
            },
            chainMemberSearch(){
                const params = this.chainMemberForm
                const fetch = service.member.memberinfo.querychainMembers;
                this.$refs.chainMemberTable.reloadData({
                    fetch,
                    params,
                });
            },
            seniorMemberSearch() {
                const params = this.chainSeniorForm
                const fetch = service.member.memberinfo.querychainMembers;
                this.$refs.chainMemberTable.reloadData({
                    fetch,
                    params,
                });
                this.chainSeniorForm.visible = false;
            },
            exportChainMember(){
                const head = {
                    memname: '姓名',
                    mobile: '手机号',
                    sex: '性别',
                    cardno: '生日',
                    regdate: '注册日期',
                    cardname: '总储值总额',
                    money: '总卡金余额',
                    gmoney: '总赠送余额',
                    money: '卡余额',
                    gmoney: '赠送余额',
                    exprite: '到期日期',
                    servTotal: '消费总额',
                    servNum: '消费次数'
                }
                service.member.memberinfo.exportMember(this.shopMemberForm).then(res => {
                    if(res.resp_code=="200"){
                        res.data.forEach(item =>{
                            if(item.sex=="1"){
                                item.sertype="男";
                            }else{
                                item.sertype="女";
                            }
                            if(item.cardtype=="1"){
                                item.issale="储值卡";
                            }else{
                                item.issale="资格卡";
                            }
                        })
                        exportExecl(head,res.data,"会员资料导出");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            queryShopCardMoney(id){
                this.shopcardmoneyDialog.data=[]
                service.member.memberinfo.queryShopcardmoney({cardid:id}).then(res =>{
                    this.shopcardmoneyDialog.visible=true
                    this.shopcardmoneyDialog.data=res.data
                })
            },
            checkShopid(){
                if(!this.shopid){
                    yid.util.error("请选择门店");
                    return true
                }else{
                    return false
                }
            },
            shopMemberSearch(page=1){
                if(this.checkShopid()){
                    return
                }
                this.pageInfo.page=page;
                const params = {...this.shopMemberForm,...this.pageInfo,shopid:this.shopid}
                this.shopMemberQuery(params)
                this.pageInfo.type='1'
            },
            shopSeniorSearch(page=1){
                if(this.checkShopid()){
                    return
                }
                this.pageInfo.page=page;
                const params = {...this.shopSerniorForm,...this.pageInfo,shopid:this.shopid}
                this.shopMemberQuery(params)
                this.pageInfo.type='2'
                this.shopSerniorForm.visible=false
            },
            shopMemberQuery(params){
                service.member.memberinfo.queryAllMember(params).then(res =>{
                    if(res.resp_code=="200"){
                        this.memberTables=res.data;
                        this.memberTables.forEach(each =>{
                            if(each.isDel=="1"){
                                each.status="注销"
                            }else if(each.exprite && each.exprite < moment().format("YYYY-MM-DD HH:mm:ss")){
                                this.cardlist.map(m =>{
                                    if(m.id == each.shid && m.expireLimit == "0"){
                                        each.status="过期(不可用)"
                                    }else{
                                        each.status="过期(可用)"
                                    }
                                })
                            }else if(each.cardno){
                                each.status="正常"
                            }else{
                                each.status=""
                            }
                        })
                        this.pageInfo.total = res.count;
                    }
                })
                service.member.memberinfo.queryAllMemberHj(params).then(res =>{
                    if(res.resp_code=="200"){
                        this.memberHj.count = res.data.zsum || 0;
                        this.memberHj.zkj = res.data.zkj || 0;
                        this.memberHj.zzs = res.data.zzs || 0;
                    }
                })
            },
            exportMember(){
                const head = {
                    memname: '姓名',
                    mobile: '手机号',
                    sex: '性别',
                    regdate: '注册日期',
                    cardno: '卡号',
                    cardname: '卡名称',
                    cardtype: '卡类型',
                    smoney: '储值总额',
                    money: '卡余额',
                    gmoney: '赠送余额',
                    exprite: '到期日期',
                    servTotal: '消费总额',
                    servNum: '消费次数'
                }
                service.member.memberinfo.exportMember(this.shopMemberForm).then(res => {
                    if(res.resp_code=="200"){
                        res.data.forEach(item =>{
                            if(item.sex=="1"){
                                item.sertype="男";
                            }else{
                                item.sertype="女";
                            }
                            if(item.cardtype=="1"){
                                item.issale="储值卡";
                            }else{
                                item.issale="资格卡";
                            }
                        })
                        exportExecl(head,res.data,"会员资料导出");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            sendMessage(){
                this.$router.push({path: '/setting/msgConfig'})
            },
            getMember(row){
                service.member.memberinfo.queryMember({memid:row.memid||row.id}).then(res => {
                    if(res.resp_code=="200"){
                        if(res.data){
                            this.memberDesc=res.data;
                            //默认赋值
                            this.memberDesc.cardindex=undefined;
                            this.membercard.cardid='';
                            this.cardinfo.id='';
                            this.cardmoney.id='';
                            if(this.memberDesc.cards &&　this.memberDesc.cards.length>0){
                                this.memberDesc.cardindex=0;
                                const id=this.memberDesc.cards[0].id
                                this.membercard.cardid=id
                                this.cardinfo.id=id
                            }
                            this.changeCardinfo();
                            this.changeMemberCard();
                            this.queryMemberStatic("",0);
                            this.meminfoDialog.visible=true;
                            this.meminfoDialog.showNum=1;
                            //清空查询条件
                            this.cardrecordform={memid:res.data.memid,cardid:'',cardtype:'1',btype:'',mtype:'',
                                date:[],sdate:'',edate:'',page: 1,limit: 10,total: 0};
                            this.packrecordform={memid:res.data.memid ,mpname:'', name:'', date:[], sdate:'', edate:'',page: 1, limit: 10, total: 0};
                            this.memberfrom={memid:res.data.memid, date:'', sdate:'', edate:'',page: 1, limit: 10, total: 0 };
                            this.memberlogfrom={memid:res.data.memid, date:'', sdate:'', edate:'',page: 1, limit: 10, total: 0 };
                            this.storefrom={memid:res.data.memid, date:[], billcode:'', pcode:'', pname:'',page: 1, limit: 10, total: 0 };
                            this.cardmoney={cards:[],id:"",cardtype:"",money:"",gmoney:"",nmoney:"",ngmoney:"",bmoney:"",bgmoney:"",shopcards:[] };
                            this.memberDesc.cards.forEach(card =>{
                                if(card.cardtype == '1'){
                                    this.cardmoney.cards.push(card)
                                }
                            })
                        }
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            changeCardinfo(){
                this.cardinfo.cardtype=''
                this.cardinfo.cardno=''
                this.cardinfo.money=''
                this.cardinfo.gmoney=''
                this.cardinfo.smoney=''
                this.cardinfo.serDis=''
                this.cardinfo.proDis=''
                this.cardinfo.shopname=''
                this.cardinfo.exprite=''
                this.cardinfo.makedate=''
                if(this.cardinfo.id){
                    this.memberDesc.cards.forEach(card =>{
                        if(this.cardinfo.id == card.id){
                            this.cardinfo.cardtype=card.cardtype
                            this.cardinfo.cardno=card.cardno
                            this.cardinfo.money=card.money
                            this.cardinfo.gmoney=card.gmoney
                            this.cardinfo.smoney=card.smoney
                            this.cardinfo.serDis=card.serDis
                            this.cardinfo.proDis=card.proDis
                            this.cardinfo.shopname=card.shopname
                            this.cardinfo.exprite=card.exprite
                            this.cardinfo.makedate=card.makedate
                        }
                    })
                }
            },
            changeCardmoney(){
                this.cardmoney.cardtype=''
                this.cardmoney.money=''
                this.cardmoney.gmoney=''
                this.cardmoney.nmoney=''
                this.cardmoney.ngmoney=''
                this.cardmoney.shopcards=[]
                if(this.cardmoney.id){
                    this.cardmoney.cards.forEach(card =>{
                        if(this.cardmoney.id==card.id){
                            this.cardmoney.cardtype=card.cardtype;
                            this.cardmoney.money=card.money;
                            this.cardmoney.gmoney=card.gmoney;
                            this.cardmoney.nmoney=card.money;
                            this.cardmoney.ngmoney=card.gmoney;
                        }
                    })
                }
            },
            editShopCardMoney(id){
                if(!id){
                    return
                }
                this.cardmoney.shopcards=[]
                service.member.memberinfo.queryShopcardmoney({cardid:id}).then(res =>{
                    res.data.forEach(each =>{
                        this.cardmoney.shopcards.push({...each,nmoney:each.money,ngmoney:each.gmoney})
                    })
                })
            },
            queryMemberStatic(yearmonth,offset){
                service.member.memberinfo.queryMemberStatis({memid:this.memberDesc.memid,yearmonth:yearmonth,offset:offset}).then(res => {
                    if(res.resp_code=="200"){
                        this.memberStatic=res.data;
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            changeMemberCard(){
                //会员资料
                this.membercard.memid=this.memberDesc.memid;
                this.membercard.memname=this.memberDesc.memname;
                this.membercard.mobile=this.memberDesc.mobile;
                this.membercard.sex=this.memberDesc.sex;
                this.membercard.birthday=this.memberDesc.birthday;
                this.membercard.address=this.memberDesc.address;
                this.membercard.chid='';
                this.membercard.cardno='';
                this.membercard.exprite='';
                this.membercard.cardmemo='';
                this.membercard.cardname='';
                this.membercard.cardtype='';
                if(this.membercard.cardid){
                    this.memberDesc.cards.forEach(card =>{
                        if(this.membercard.cardid == card.id){
                            this.membercard.chid=String(card.chid);
                            this.membercard.cardno=card.cardno;
                            this.membercard.exprite=card.exprite;
                            this.membercard.cardmemo=card.cardmemo;
                            this.membercard.cardname=card.cardname;
                            this.membercard.cardtype=card.cardtype;
                        }
                    })
                }
            },
            upMemberStatic(){
                this.queryMemberStatic(this.memberStatic.yearmonth,1);
            },
            downMemberStatic(){
                this.queryMemberStatic(this.memberStatic.yearmonth,-1);
            },
            saveMemberCard(){
                if(!this.membercard.mobile){
                    yid.util.error("手机号不能为空");
                    return
                }else if(this.membercard.mobile.length!=11){
                    yid.util.error("手机号格式不正确");
                    return
                }
                if(!this.membercard.memname){
                    yid.util.error("会员姓名不能为空");
                    return
                }else if(this.membercard.memname.length>10){
                    yid.util.error("会员姓名不能大于10位");
                    return
                }
                if(!this.membercard.birthday){
                    yid.util.error("会员生日不能为空");
                    return
                }
                service.member.memberinfo.saveMemberCard(this.membercard).then(res =>{
                    if(res.resp_code=="200"){
                        yid.util.success(res.resp_msg);
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            updateCardmoney(row){
                if(Number(row.nmoney) == Number(row.money) && Number(row.ngmoney) == Number(row.gmoney)){
                    $yid.util.error("金额没有变动");
                }else{
                    if(Number(row.nmoney) != Number(row.money)){
                        row.bmoney=Number(row.nmoney)-Number(row.money)
                    }else{
                        row.bmoney=0
                    }
                    if(Number(row.ngmoney) != Number(row.gmoney)){
                        row.bgmoney=Number(row.ngmoney)-Number(row.gmoney)
                    }else{
                        row.bgmoney=0
                    }
                    const cardmoney = {
                        memid:row.memid,
                        cardid:row.cardid,
                        cardtype:row.cardtype,
                        money:Number(row.money),
                        gmoney:Number(row.gmoney),
                        nmoney:Number(row.nmoney),
                        ngmoney:Number(row.ngmoney),
                        bmoney:row.bmoney,
                        bgmoney:row.bgmoney,
                        shopid:row.shopid,
                        shopcode:row.shopcode,
                        shopname:row.shopname
                    }
                    const that=this;
                    service.member.memberinfo.updateCardmoney(cardmoney).then(res =>{
                        if(res.resp_code=="200"){
                            that.cardmoney.cards.forEach(card =>{
                                if(cardmoney.cardid==card.id){
                                    card.money+=cardmoney.bmoney;
                                    card.gmoney+=cardmoney.bgmoney;
                                }
                            })
                            that.changeCardmoney();
                            yid.util.success(res.resp_msg);
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    })
                }
            },
            changCardRecord(){
                this.memberDesc.cards.forEach(card =>{
                    if(card.cardno==this.cardrecordform.cardno){
                        this.cardrecordform.cardid=card.id
                        this.cardrecordform.cardtype=card.cardtype
                    }
                })
            },
            queryCardRecords(){
                if(!this.cardrecordform.cardno){
                    yid.util.error("选择卡号");
                    return;
                }
                this.cardrecordform.memid=this.memberDesc.memid;
                if(this.cardrecordform.date && this.cardrecordform.date.length>1){
                    this.cardrecordform.sdate=this.cardrecordform.date[0];
                    this.cardrecordform.edate=this.cardrecordform.date[1]+' 23:59:59';
                }else{
                    this.cardrecordform.sdate=null;
                    this.cardrecordform.edate=null;
                }
                const params = {...this.cardrecordform}
                if(this.cardrecordform.cardtype == '1'){
                    const fetch = service.member.memberinfo.queryCardRecords;
                    this.$refs.cardrecords.reloadData({
                        fetch,
                        params,
                    });
                }else{
                    const fetch = service.member.memberinfo.queryCardzklogs;
                    this.$refs.cardzklogs.reloadData({
                        fetch,
                        params,
                    });
                }
            },
            queryPackageList(){
                this.packrecordform.memid=this.memberDesc.memid;
                if(this.packrecordform.date && this.packrecordform.date.length>1){
                    this.packrecordform.sdate=this.packrecordform.date[0];
                    this.packrecordform.edate=this.packrecordform.date[1]+' 23:59:59';
                }else{
                    this.packrecordform.sdate=null;
                    this.packrecordform.edate=null;
                }
                const params = {...this.packrecordform}
                const fetch = service.member.memberinfo.queryPackageRecords
                this.$refs.packageRecords.reloadData({
                    fetch,
                    params,
                });
            },
            queryMemberRecords(){
                this.memberfrom.memid=this.memberDesc.memid;
                if(this.memberfrom.date && this.memberfrom.date.length>1){
                    this.memberfrom.sdate=this.memberfrom.date[0];
                    this.memberfrom.edate=this.memberfrom.date[1]+' 23:59:59';
                }else{
                    this.memberfrom.sdate=null;
                    this.memberfrom.edate=null;
                }
                const params = {...this.memberfrom}
                const fetch = service.member.memberinfo.queryMemberRecords
                this.$refs.memberRedcords.reloadData({
                    fetch,
                    params,
                });
            },
            queryMemberEditlogs(){
                this.memberlogfrom.memid=this.memberDesc.memid;
                if(this.memberlogfrom.date && this.memberlogfrom.date.length>1){
                    this.memberlogfrom.sdate=this.memberlogfrom.date[0];
                    this.memberlogfrom.edate=this.memberlogfrom.date[1]+' 23:59:59';
                }else{
                    this.memberlogfrom.sdate=null;
                    this.memberlogfrom.edate=null;
                }
                const params = {...this.memberlogfrom}
                const fetch = service.member.memberinfo.queryMemberEditlogs
                this.$refs.memberlog.reloadData({
                    fetch,
                    params,
                });
            },
            queryMemberPackages(page=1){
                if(this.checkShopid()){
                    return
                }
                this.memberpackfrom.shopid=this.shopid
                this.memberpackfrom.page=page;
                if(this.memberpackfrom.date && this.memberpackfrom.date.length>1){
                    this.memberpackfrom.sdate=this.memberpackfrom.date[0];
                    this.memberpackfrom.edate=this.memberpackfrom.date[1]+' 23:59:59';
                }else{
                    this.memberpackfrom.sdate=null;
                    this.memberpackfrom.edate=null;
                }
                service.member.memberinfo.queryMemberpagePackages(this.memberpackfrom).then(res =>{
                    if(res.resp_code=="200"){
                        this.memberpackData=res.data;
                        this.memberpackfrom.total = res.count;
                    }
                })
                service.member.memberinfo.queryPackageHj(this.memberpackfrom).then(res =>{
                    if(res.resp_code=="200"){
                        this.memberpackhj = res.data || {servsum:0,packsum:0,servje:0,packje:0};
                    }
                })
            },
            queryDelMembers(){
                if(this.checkShopid()){
                    return
                }
                if(this.memberDelfrom.date && this.memberDelfrom.date.length>1){
                    this.memberDelfrom.sdate=this.memberDelfrom.date[0];
                    this.memberDelfrom.edate=this.memberDelfrom.date[1]+' 23:59:59';
                }else{
                    this.memberDelfrom.sdate=null;
                    this.memberDelfrom.edate=null;
                }
                const fetch = service.member.memberinfo.queryDelMembers;
                const params = {...this.memberDelfrom}
                this.$refs.memberDelTable.reloadData({
                    fetch,
                    params
                });
            },
            queryExpritMembers(){
                if(this.checkShopid()){
                    return
                }
                if(this.memberExporfrom.date && this.memberExporfrom.date.length>1){
                    this.memberExporfrom.sdate=this.memberExporfrom.date[0];
                    this.memberExporfrom.edate=this.memberExporfrom.date[1]+' 23:59:59';
                    this.memberExporfrom.datetime=null;
                }else{
                    this.memberExporfrom.sdate=null;
                    this.memberExporfrom.edate=null;
                    this.memberExporfrom.datetime= moment().format("YYYY-MM-DD HH:mm:ss");
                }
                const fetch = service.member.memberinfo.queryExpritMembers;
                const params = {...this.memberExporfrom}
                this.$refs.memberExproTable.reloadData({
                    fetch,
                    params
                });
            },
            queryDirthdayMembers(){
                if(this.checkShopid()){
                    return
                }
                if(this.memberBirthfrom.type=="day" && !this.memberBirthfrom.day){
                   yid.util.error("请选择日期");
                   return;
                }
                if(this.memberBirthfrom.type=="month" && !this.memberBirthfrom.month){
                    yid.util.error("请选择月份");
                    return;
                }
                if(!this.memberBirthfrom.type){
                    this.memberBirthfrom.day=''
                    this.memberBirthfrom.month=''
                }
                const fetch = service.member.memberinfo.queryDirthdayMembers;
                const params = {...this.memberBirthfrom}
                this.$refs.memberBirthTable.reloadData({
                    fetch,
                    params
                });
            },
            importMembers(file){
                if(!this.memberImport.type){
                    yid.util.error("没有导入类型");
                    return false;
                }
                if (file.name && (file.name.indexOf("xls")>0 || file.name.indexOf("xlsx")>0)) {
                    this.memberImport.members=[];
                    imporExecl(file,this.memberImport.members,this.memberImpdata[this.memberImport.type]);
                }else{
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                    return false;
                }
            },
            sureImportMembers(){
                if(!this.memberImport.shopid){
                    yid.util.error("没有选择导入门店");
                    return;
                }
                if(!this.memberImport.type){
                    yid.util.error("没有选择导入类型");
                    return;
                }
                if(!this.memberImport.members){
                    yid.util.error("没有导入数据");
                    return;
                }
                this.impShopList.forEach(each => {
                    if(each.id == this.memberImport.shopid){
                        this.memberImport.shopcode=each.shopcode
                        this.memberImport.shopname=each.shopname
                    }
                })
                service.member.memberinfo.memberImport(this.memberImport).then(res =>{
                    if(res.resp_code=="200"){
                        yid.util.success(res.resp_msg);
                        this.queryImportMembers();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            queryImportMembers(){
                const fetch = service.member.memberinfo.queryMemberImplogs;
                const params = {...this.memberImpform}
                this.$refs.memberImportTable.reloadData({
                    fetch,
                    params
                });
            },
            exportServs(row){
                service.member.memberinfo.queryMemberLog({impid:row.id}).then(res => {
                    if(res.resp_code=="200"){
                        const datas=[];
                        if(res.data && res.data.length>0){
                            res.data.forEach(item =>{
                                datas.push(JSON.parse(item.content));
                            })
                        }
                        if(datas.length>0){
                            exportExecl(this.memberExpdata[row.imptype],datas,"导入失败会员");
                        }
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            queryMemberStores(){
                if(this.storefrom.date && this.storefrom.date.length>1){
                    this.storefrom.sdate=this.storefrom.date[0];
                    this.storefrom.edate=this.storefrom.date[1];
                }else{
                    this.storefrom.sdate=null;
                    this.storefrom.edate=null;
                }
                const params = {...this.storefrom}
                delete params.date
                service.member.memberinfo.queryMemberStorelogs(params).then(res =>{
                    if(res.resp_code=="200"){
                        this.storeData = res.data;
                        this.storefrom.total = res.count;
                    }
                })
            },
            downExcelTemplate1(){
                download($yid.config.API.BASE + '/api-member/memberinfo/excelTemplate1', {})
            },
            downExcelTemplate2(){
                download($yid.config.API.BASE + '/api-member/memberinfo/excelTemplate2', {})
            },
            downExcelTemplate3(){
                download($yid.config.API.BASE + '/api-member/memberinfo/excelTemplate3', {})
            },
            handleRemove(file, fileList) {
                this.memberImport.members=[]
            },
            getPackageRecordTypeName(row){
                if(!row.btype){
                    //btype 是后面加的字段  兼容之前的数据  上线之后慢慢可以去掉
                    return row.direction == 1 ? '购买': (row.isShareOper == '1' ? '代付' : '划扣')
                }

                let type = row.btype
                //0:购买 1:代付 2:划扣 3:套餐支付 4:套餐赠送支付
                switch (type) {
                    case "0": return "购买";
                    case "1": return "代付";
                    case "2": return "划扣";
                    case "3": return "套餐支付";
                    case "4": return "套餐赠送支付";
                    case "5": return "活动赠送";
                    default: return "未知";
                }
            },
            queryCouponlogs(){
                this.coupon.memid=this.memberDesc.memid;
                if(this.coupon.date && this.coupon.date.length>1){
                    this.coupon.sdate=this.coupon.date[0];
                    this.coupon.edate=this.coupon.date[1]+' 23:59:59';
                }else{
                    this.coupon.sdate=null;
                    this.coupon.edate=null;
                }
                if(this.coupon.udate && this.coupon.udate.length>1){
                    this.coupon.sudate=this.coupon.udate[0];
                    this.coupon.eudate=this.coupon.udate[1]+' 23:59:59';
                }else{
                    this.coupon.sudate=null;
                    this.coupon.eudate=null;
                }
                const params = {...this.coupon}
                delete params.date
                delete params.udate
                const fetch = service.member.memberinfo.queryCouponLogs
                this.$refs.couponlogs.reloadData({
                    fetch,
                    params,
                });
            },
            queryRedenvelopes(){
                this.redenvelope.memid=this.memberDesc.memid;
                if(this.redenvelope.date && this.redenvelope.date.length>1){
                    this.redenvelope.sdate=this.redenvelope.date[0];
                    this.redenvelope.edate=this.redenvelope.date[1];
                }else{
                    this.redenvelope.sdate=null;
                    this.redenvelope.edate=null;
                }
                const params = {...this.redenvelope}
                delete params.date
                service.member.memberinfo.queryRedenvelopeLogs(params).then(res =>{
                    if(res.resp_code=="200"){
                        this.redenvelopeData = res.data;
                        this.redenvelope.total = res.count;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .margl5{
        margin-left: 15px
    }

    .margl0{
        margin-left: 10px
    }

    .marg5{
        margin-left: 5px
    }

    .margsx10{
        margin: 10px auto
    }

    .member-relation {
    }

    table tr td {
        border:1px solid rgba(96, 93, 99, 0.62);
    }

    table thead td{
        border:1px solid rgba(96, 93, 99, 0.62);
    }

    .meminfo{
        width: 1000px;
        margin:0 auto;
    }

    .meminfo div {
        margin-top: 10px;
        padding: 5px;
        font-weight:bold;
    }

    .meminfo table {
        width: 980px;
        height: 120px;
        cellspacing: 0;
        cellpadding: 0;
    }

    .taoctable tr td {
        text-align:center;
    }

    .tableTd {
        border: 0px;
        padding-left: 10px;
    }

</style>