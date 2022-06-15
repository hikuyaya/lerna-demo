<template>
    <div class="salaryRewardDetail">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="组织机构：" prop="region">
                        <el-input v-model="searchForm.region" placeholder="组织机构名称/编码" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="门店：">
                        <el-select @clear="clearFormShop" @blur="clearFormShop" clearable v-model.trim="searchForm.shopid" filterable
                                   :filter-method="filterShop" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id"
                                       v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职务：" prop="psid">
                        <el-select filterable placeholder="请选择" v-model.trim="searchForm.psid"
                                   @change="getSearchFormPositionLevelList">
                            <el-option :key="item.id" :label="item.psname" :value="item.id"
                                       v-for="item in searchFormPositionList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="级别：" prop="pslid">
                        <el-select filterable placeholder="请选择" v-model.trim="searchForm.pslid">
                            <el-option :key="item.id" :label="item.pslname" :value="item.id"
                                       v-for="item in searchFormPositionLevelList"></el-option>
                        </el-select>
                    </el-form-item>
                    <br/>
                    <el-form-item label="员工：" prop="eename">
                        <el-input v-model="searchForm.eename" placeholder="姓名/编码" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="mobile">
                        <el-input v-model="searchForm.mobile" placeholder="手机号" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                        <el-button @click="addEmployee" type="primary">新增员工</el-button>
                        <el-button @click="lookup()" type="primary">查看{{status == '2' ? '已离职' : '在职'}}员工</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button @click="mutiImportEmployee" type="primary">导入</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column
                            prop="eecode"
                            label="员工编号"
                            width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="eename"
                            label="姓名"
                            width="120">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editAction(scope.row,true)">{{scope.row.eename}}</el-link>
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            prop="nickname"
                            label="昵称"
                            width="120">
                    </yid-table-column>
                    <yid-table-column
                            label="性别"
                            width="60">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            prop="mobile"
                            label="手机号"
                            width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="psname"
                            label="职务" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="pslname"
                            label="级别" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="shopcode"
                            label="所属机构/门店" width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.otype=='1'">{{"(" + scope.row.shopcode + ")" + scope.row.shopname}}
                            </div>
                            <div v-if="scope.row.otype=='2'">{{"(" + scope.row.regionCode + ")" + scope.row.regionName}}</div>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="bname" label="所属业务组" width="80"></yid-table-column>
                    <yid-table-column
                            prop="entryTime"
                            label="入职时间" width="120">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.entryTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            label="员工状态" width="80">
                        <template slot-scope="scope">
                            {{scope.row.status == '1' ? "在职" : "离职"}}
                        </template>
                    </yid-table-column>
                    <!--<yid-table-column
                            label="账号绑定">
                        <template slot-scope="scope">
                            {{getIsBd(scope.row.id)}}
                        </template>
                    </yid-table-column>-->
                    <yid-table-column v-if="this.quitShow"
                                      prop="quitTime"
                                      label="离职时间">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.quitTime)}}
                        </template>
                    </yid-table-column>
                  <yid-table-column label="剪发原价" min-width="100" prop="jfyjMoney">

                  </yid-table-column>
                  <yid-table-column label="剪发会员价" min-width="100" prop="jfhyjMoney">

                  </yid-table-column>
                    <yid-table-column
                            label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editAction(scope.row,false)">编辑</el-link>
                            <el-link type="primary" @click="transferAction(scope.row)" style="margin-left: 6px">调岗
                            </el-link>
                            <el-link type="primary" @click="dimissionAction(scope.row)" style="margin-left: 6px">
                                {{scope.row.status == '1' ? "离职" : "恢复"}}
                            </el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button @click="back" type="primary">返回</el-button>
                <el-button @click="edit" type="primary" v-show="showEdit">编辑</el-button>
                <el-button @click="save" type="primary" v-show="showSave">保存</el-button>
                <el-form ref="employeeForm" :model="employeeForm" style="margin-top: 16px" :rules="rules"
                         label-width="100px" label-position="right">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="员工头像：" prop="photo">
                                <el-upload :disabled="this.disabledvalue"
                                           class="avatar-uploader"
                                           :action="upload"
                                           :headers="myheaders"
                                           :show-file-list="false"
                                           :on-success="handleAvatarSuccess"
                                           :before-upload="beforeAvatarUpload">
                                    <img v-if="employeeForm.photo" :src="employeeForm.photo" class="avatar el-upload"
                                         style="width: 200px;height: 200px">
                                    <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
                                    <div class="el-upload__tip" slot="tip">仅支持jpg，png格式的图片上传图片尺寸：200px*200px</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="组织类型: " prop="otype" :rules="[{ required: true, message: '业务类型不能为空'}]">
                                <el-select placeholder="请选择" v-model.trim="employeeForm.otype"
                                           :disabled="this.disabledvalue || !this.isnow">
                                    <el-option label="门店" value="1"></el-option>
                                    <el-option label="总部" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="机构组织: " prop="regionObj" v-show="employeeForm.otype=='2'">
                                <el-select ref="selectRegionRef1" placeholder="请选择机构"
                                           v-model.trim="employeeForm.regionObj"
                                           collapse-tags @change="selectRegion1" :disabled="this.disabledvalue || !this.isnow">
                                    <el-option :value="employeeForm.regionObjValue" style="height: auto">
                                        <el-tree
                                                size="small"
                                                accordion="true"
                                                show-checkbox
                                                :default-expand-all="true"
                                                :data="regionData"
                                                :props="defaultProps"
                                                node-key="id"
                                                :check-strictly="true"
                                                @check-change="templateCheckChange1"
                                                ref="templateRegionTree1">
                                        </el-tree>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职务：" prop="regpositionObj" v-show="employeeForm.otype=='2'">
                                <el-select value-key="id" filterable placeholder="请选择"
                                           v-model.trim="employeeForm.regpositionObj"
                                           @change="getEditRegPositionLevelList" :disabled="this.disabledvalue">
                                    <el-option :key="item.id" :label="item.psname" :value="item"
                                               v-for="item in positionList">
                                        <span style="float: left">{{ item.pscode }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.psname
                                            }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="级别：" prop="regpositionLevelObj" v-show="employeeForm.otype=='2'">
                                <el-select value-key="id" filterable placeholder="请选择"
                                           v-model.trim="employeeForm.regpositionLevelObj"
                                           @change="selectPositionLevel" :disabled="this.disabledvalue">
                                    <el-option :key="item.id" :label="item.pslname" :value="item"
                                               v-for="item in editRegPositionLevelList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属门店: " prop="shopObj" v-show="employeeForm.otype=='1'">
                                <el-select value-key="id" filterable :filter-method="filterShop2" placeholder="请选择"
                                           v-model.trim="employeeForm.shopObj"
                                           @change="getEditFormBranchList" :disabled="this.disabledvalue || !this.isnow">
                                    <el-option :key="item.id" :label="item.shopname" :value="item"
                                               v-for="item in filterShopList2">
                                        <span style="float: left">{{ item.shopcode }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname
                                            }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="业务组: " prop="branchObj" v-show="employeeForm.otype=='1'">
                                <el-select value-key="id" filterable placeholder="请选择"
                                           v-model.trim="employeeForm.branchObj"
                                           @change="getEditFormPositionList" :disabled="this.disabledvalue">
                                    <el-option :key="item.id" :label="item.bname" :value="item"
                                               v-for="item in editFormBranchList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职务：" prop="positionObj" v-show="employeeForm.otype=='1'">
                                <el-select value-key="id" filterable placeholder="请选择"
                                           v-model.trim="employeeForm.positionObj"
                                           @change="getEditFormPositionLevelList" :disabled="this.disabledvalue">
                                    <el-option :key="item.id" :label="item.psname" :value="item"
                                               v-for="item in editFormPositionList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="级别：" prop="positionLevelObj" v-show="employeeForm.otype=='1'">
                                <el-select value-key="id" filterable placeholder="请选择"
                                           v-model.trim="employeeForm.positionLevelObj"
                                           @change="selectPositionLevel" :disabled="this.disabledvalue">
                                    <el-option :key="item.id" :label="item.pslname" :value="item"
                                               v-for="item in editFormPositionLevelList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="门店做业绩：" prop="shops">
                                <el-button type="primary" @click="selectEeShops(employeeForm)" :disabled="this.disabledvalue">选择门店</el-button>
                                <lable style="margin-left: 6px">
                                    共选中{{employeeForm.shoplist ? employeeForm.shoplist.length : '0'}}家门店
                                </lable>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="员工编号：" prop="eecode" :rules="[{ required: true, message: '员工编号不能为空'}]">
                                <el-input v-model="employeeForm.eecode" :disabled="this.isUser" placeholder="员工编号"
                                          style="width: 150px;" @change="checkEecode"></el-input>
                            </el-form-item>

                            <el-form-item label="员工姓名：" prop="eename" :rules="[{ required: true, message: '员工姓名不能为空'}]">
                                <el-input v-model="employeeForm.eename" placeholder="姓名" :disabled="this.disabledvalue"
                                          style="width: 150px;"></el-input>
                            </el-form-item>

                            <el-form-item label="员工昵称：" prop="nickname">
                                <el-input v-model="employeeForm.nickname" placeholder="昵称"
                                          :disabled="this.disabledvalue" style="width: 150px;"></el-input>
                            </el-form-item>

                            <el-form-item label="出生日期：" prop="birthday"
                                          :rules="[{ required: true, message: '出生日期不能为空'}]">
                                <el-date-picker :disabled="this.disabledvalue"
                                                style="width: 195px;"
                                                v-model.trim="employeeForm.birthday"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="性别：" prop="sex" :rules="[{ required: true, message: '请选择性别'}]">
                                <el-select filterable placeholder="请选择" v-model.trim="employeeForm.sex"
                                           :disabled="this.disabledvalue">
                                    <el-option :key="item.id" :label="item.name" :value="item.id"
                                               v-for="item in sexList"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="手机号：" prop="mobile">
                                <el-input v-model="employeeForm.mobile" placeholder="手机号" :disabled="this.disabledvalue"
                                          style="width: 170px;"></el-input>
                            </el-form-item>

                            <el-form-item label="身份证：" prop="idno">
                                <el-input v-model="employeeForm.idno" placeholder="身份证号码" :disabled="this.disabledvalue"
                                          style="width: 170px;"></el-input>
                            </el-form-item>

                            <el-form-item label="银行卡：" prop="bankNo">
                                <el-input v-model="employeeForm.bankNo" placeholder="银行卡号"
                                          :disabled="this.disabledvalue" style="width: 170px;"></el-input>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设置账号：" prop="enabled">
                                <el-switch disabled="disabled" v-model="employeeForm.enabled" active-value="1"
                                           inactive-value="0" inactive-color="#ff4949">
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="用户名：" prop="username">
                                <!--<el-input  v-model="employeeForm.username"  placeholder="用户名" style="width: 150px;"></el-input>-->
                                {{employeeForm.username}}
                            </el-form-item>
                            <el-form-item label="基本工资：" prop="bsalary">
                                <el-input type="number" v-model="employeeForm.bsalary" min="0" placeholder="基本工资"
                                          :disabled="this.disabledvalue" style="width: 170px;"></el-input>
                            </el-form-item>
<!--                            <el-form-item label="特殊价：" prop="specPrice">-->
<!--                                <el-input v-model="employeeForm.specPrice" placeholder="特殊价"-->
<!--                                          :disabled="this.disabledvalue" style="width: 170px;"></el-input>-->
<!--                            </el-form-item>-->
                            <el-form-item label="入职时间：" prop="entryTime"
                                          :rules="[{ required: true, message: '入职时间不能为空'}]">
                                <el-date-picker :disabled="this.disabledvalue"
                                                style="width: 195px;"
                                                v-model.trim="employeeForm.entryTime"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="备注：" prop="memo">
                                <el-input type="textarea" v-model="employeeForm.memo" :disabled="this.disabledvalue"
                                          style="width: 100%;"></el-input>
                            </el-form-item>
                            <el-form-item label="员工剪发原价：" prop="jfyjMoney" label-width="130px">
<!--                              <el-input type="number" v-model="employeeForm.jfyjMoney" min="0" :disabled="this.disabledvalue"-->
<!--                                        style="width: 170px;">-->
<!--                              </el-input>-->
                              {{employeeForm.jfyjMoney}}
                            </el-form-item>

                            <el-form-item label="员工剪发会员价：" prop="jfhyjMoney" label-width="130px">
<!--                              <el-input type="number" v-model="employeeForm.jfhyjMoney" min="0" :disabled="this.disabledvalue"-->
<!--                                        style="width: 170px;">-->
<!--                              </el-input>-->
                              {{employeeForm.jfhyjMoney}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
        <yid-dialog :title="mutiImportDialog.title" :visible.sync="mutiImportDialog.visible" @close="importCancel"
                    width="700px">
            <el-form :model="mutiImportDialog.model" label-width="120px" ref="copyForm" :label-position="labelPosition">
                <p>操作提示</p>
                <p>1、可从管理平台批量导入员工资料，并下载对应模板填写相关信息后保存提交上传；</p>
                <p>2、员工资料导入时，手机号已存在的则不导入；</p>
                <p>3、标识“*”的选项为必填项。</p>
                <p>4、导入资料后可从全部员工列表中找到该条员工数据。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">员工资料模板</el-link>
                </el-form-item>

                <el-form-item label="选择导入文件:">
                    <el-upload
                            ref="uploadExcel"
                            class="avatar-uploader"
                            :headers="myheaders"
                            action="https://sass.yidmall.com/api/api-chain/employee/importExcel"
                            :show-file-list="true"
                            :on-success="handleAvatarExcelSuccess"
                            :before-upload="beforeAvatarExcelUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportEmployees" type="primary">保存</el-button>
                    <el-button @click="importCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="transferDialog.title" :visible.sync="transferDialog.visible" width="450px">
            <el-form ref="transferForm" :model="transferForm" label-width="140px">
                <el-form-item label="组织类型: " prop="otype" :rules="[{ required: true, message: '业务类型不能为空'}]">
                    <el-select placeholder="请选择" v-model.trim="transferForm.otype" :disabled="this.disabledvalue">
                        <el-option label="门店" value="1"></el-option>
                        <el-option label="总部" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调入机构：" v-if="transferForm.otype=='2'" prop="regionObj">
                    <el-select ref="selectRegionRef" placeholder="请选择机构" v-model.trim="transferForm.regionObj"
                               collapse-tags @change="selectRegion">
                        <el-option :value="transferForm.regionObjValue" style="height: auto">
                            <el-tree
                                    size="small"
                                    accordion="true"
                                    show-checkbox
                                    :default-expand-all="true"
                                    :data="regionData"
                                    :props="defaultProps"
                                    node-key="id"
                                    :check-strictly="true"
                                    @check-change="templateCheckChange"
                                    ref="templateRegionTree">
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职务：" prop="regpositionObj" v-show="transferForm.otype=='2'">
                    <el-select value-key="id" filterable  placeholder="请选择" v-model.trim="transferForm.regpositionObj"
                               @change="getEditTransPositionLevelList">
                        <el-option :key="item.id" :label="item.psname" :value="item" v-for="item in positionList">
                            <span style="float: left">{{ item.pscode }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.psname }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="级别：" prop="regpositionLevelObj" v-show="transferForm.otype=='2'">
                    <el-select value-key="id" filterable placeholder="请选择"
                               v-model.trim="transferForm.regpositionLevelObj"
                               @change="selectPositionLevel">
                        <el-option :key="item.id" :label="item.pslname" :value="item"
                                   v-for="item in editRegPositionLevelList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调入门店：" v-if="transferForm.otype=='1'" prop="shopObj">
                    <el-select value-key="id" filterable :filter-method="filterShop3" placeholder="请选择" v-model.trim="transferForm.shopObj"
                               @change="getEditFormBranchList">
                        <el-option :key="item.id" :label="item.shopname" :value="item" v-for="item in filterShopList3">
                            <span style="float: left">{{ item.shopcode }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="修改业务类型：" v-if="transferForm.otype=='1'" prop="branchObj">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="transferForm.branchObj"
                               @change="getEditFormPositionList">
                        <el-option :key="item.id" :label="item.bname" :value="item"
                                   v-for="item in editFormBranchList"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="修改职务：" v-if="transferForm.otype=='1'" prop="positionObj">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="transferForm.positionObj"
                               @change="getEditFormPositionLevelList">
                        <el-option :key="item.id" :label="item.psname" :value="item"
                                   v-for="item in editFormPositionList"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="修改级别：" v-if="transferForm.otype=='1'" prop="positionLevelObj">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="transferForm.positionLevelObj"
                               @change="selectPositionLevel">
                        <el-option :key="item.id" :label="item.pslname" :value="item"
                                   v-for="item in editFormPositionLevelList"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveTransfer" type="primary">保存</el-button>
                    <el-button @click="cancelTransfer">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="shopDialog.visible=false"
                    width="1100px">
            <el-row type="flex" justify="space-between">
                <el-form inline ref="queryShop">
                    <el-form-item label="门店：">
                        <el-input clearable v-model="shopDialog.shop" placeholder="门店名称/编码"
                                  style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-select clearable v-model="shopDialog.status">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="停用" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务类型：">
                        <el-select clearable v-model="shopDialog.type">
                            <el-option label="美发" value="1"></el-option>
                            <el-option label="美容" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌：">
                        <el-select clearable v-model="shopDialog.brandId">
                            <el-option v-for="item in brands" :label="item.name" :value="item.id"></el-option>
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
                               @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                        <yid-table-column label="门店品牌" min-width="60" prop="brandName"></yid-table-column>
                        <yid-table-column label="业务类型" min-width="80" prop="type">
                            <template slot-scope="scope">
                                {{scope.row.type | formatValue(types)}}
                            </template>
                        </yid-table-column>
                    </yid-table>
                </el-col>
                <el-col :span="1" style="padding: 60px 0px">
                    <div>
                        <el-button @click="addShop()" type="primary" size="mini"><i class="el-icon-right"></i>
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="8" style="margin-left: 5px;">
                    <el-link type="primary" @click="deleteBatch()">批量删除</el-link>
                    <yid-table ref="table2" style="margin-top: 10px;" :data="shopDialog.shoplist" @selection-change="handleSelectionData">
                      <el-table-column type="selection" width="55"></el-table-column>
                        <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                        <yid-table-column label="业务组" min-width="80" prop="bbid">
                            <template slot-scope="scope">
                                {{scope.row.bbid | formatBrand(branchList)}}
                            </template>
                        </yid-table-column>
                        <yid-table-column label="操作" min-width="80">
                            <template slot-scope="scope">
                                <el-link type="primary" style="margin: 0 10px 0 10px;"
                                         @click="deleteShop(scope.row,shopDialog.spname)">删除
                                </el-link>
                            </template>
                        </yid-table-column>
                    </yid-table>
                </el-col>
            </el-row>
            <el-row justify="space-between" style="margin-top: 10px;">
                <el-col :span="2" :offset="10">
                    <el-button type="primary" @click="setShop()">选好了</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="shopDialog.visible=false">取消</el-button>
                </el-col>
                <el-col :span="10"></el-col>
            </el-row>
        </yid-dialog>

    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'
    import {isEmpty} from "../../library/helper/validate";
    import ElButton from "../../library/components/button/button";

    export default {
        components: {ElButton},
        name: "profile",
        data() {
            return {
                upload: yid.config.API.UPLOAD,
                myheaders: {},
                dataList: [],
                status: '2',
                quitShow: false,
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                searchFormPositionList: [], //职务list
                searchFormPositionLevelList: [], //级别list 搜索表单用

                branchList: [], //部门list
                positionList: [],//职务list
                positionLevelList: [],//级别list

                //新增or编辑员工表单用
                editFormBranchList: [], //部门List
                editFormPositionLevelList: [], //级别List
                editRegPositionLevelList: [], //
                editFormPositionList: [],//职务list

                sexList: [{id: "1", name: "男"}, {id: "2", name: "女"}],
                sysRoleTypeList: [],//角色list
                searchForm: {
                    shopid: "",
                    psid: "",
                    pslid: "",
                    eename: "",
                    mobile: "",
                    region: ""
                },
                employeeForm: {
                    photo: "",
                    entryTime: "",
                    otype: "",
                    regionObj: [],
                    regionObjValue: [],
                    shopObj: {},
                    branchObj: {},
                    positionObj: {},
                    positionLevelObj: {},
                    regpositionObj: {},
                    regpositionLevelObj: {},
                    eename: "",
                    nickname: "",
                    birthday: "",
                    sex: "",
                    enabled: "",
                    mobile: "",
                    memo: "",
                    bankNo: "",
                    idno: "",
                    eecode: "",
                    userId: "",
                    username: "",
                    bsalary: "",
                    specPrice: "",
                    status: '1',
                    shopid: "",
                    shopcode: "",
                    shopname: "",
                    shoplist: [],
                    jfyjMoney: null,
                    jfhyjMoney: null
                },
                isUser: false,
                showList: true,
                rules: {
                    mobile: [{required: true, message: '请输入手机号'},
                        {validator: this.checkMobile, trigger: "blur"}
                    ],
                    eecode: [{required: true, message: '请输入员工编号'},
                        {validator: this.isHaveChinese, trigger: "blur"}
                    ],
                },
                brands: [],
                mutiImportDialog: {
                    title: '',
                    visible: false,
                    employees: []
                },
                allShopList: [],
                filterShopList: [],
                allShopList2: [],
                filterShopList2: [],
                allShopList3: [],
                filterShopList3: [],
                disabledvalue: false,
                showEdit: false,
                showSave: false,
                isnow: false,
                transferDialog: {
                    title: '',
                    visible: false,
                    employee: []
                },
                transferForm: {
                    id: "",
                    otype: "",
                    employee: {},
                    shopObj: {},
                    regionObj: [],
                    regionObjValue: [],
                    branchObj: {},
                    positionObj: {},
                    positionLevelObj: {},
                    regpositionObj: {},
                    regpositionLevelObj: {},
                },
                labelPosition: 'left',
                shopDialog: {
                    id: '',
                    spname: '',
                    title: '',
                    visible: false,
                    shop: '',
                    type: '',
                    status: '',
                    brandId: '',
                    region: '',
                    shoplist: [],
                    status: '1',
                    page: 1,
                    limit: 10
                },
                selectShops: [],
                types: [{name: '美发', value: '1'}, {name: '美容', value: '2'}, {name: '综合', value: '3'}],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    disabled: this.disabledFn,
                },
                regionData: [],
                selectShopData: [],
            }
        },
        mounted() {
            this.getShopList();
            this.getSearchFormPositionList();
            this.getData("1");

            this.getPositionList();
            //this.getPositionLevelList();
            this.getBranchList();
            //this.getSysRoleTypeList();
            this.getBrandList();
            this.getRegionTreeAll();
        },
        filters: {
            formatValue(str, stsList) {
                let label = ""
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
            },
            formatBrand(str, stsList) {
                let label = ""
                stsList.map(m => {
                    if (Number(m.id) == str) {
                        label = m.bname
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
            lookup() {
                this.getData(this.status);
                if (this.status == '1') {
                    this.status = '2'
                    this.quitShow = false;
                } else {
                    this.status = '1'
                    this.quitShow = true;
                }
            },
            getData(status, reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.employee.list
                const params = {...this.pageInfo, ...reqParams}
                params.status = status
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            checkMobile(rule, value, callback) {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if (!yid.validate.mobile(value)) {
                    callback(new Error('输入正确手机号'));
                }
                else {
                    callback();
                }
            },
            isHaveChinese(rule, value, callback) {
                if (value === '') {
                    callback(new Error('请输入员工编号'));
                } else if (yid.validate.isHaveChinese(value)) {
                    callback(new Error('不能含有中文'));
                }
                else {
                    callback();
                }
            },
            getSysRoleTypeList() {
                service.sysRoleType.list().then(res => {
                    if (res.resp_code == 200) {
                        this.sysRoleTypeList = res.data;
                    }
                })
            },
            getSearchFormPositionList() {
                service.position.list({status: "1", isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.searchFormPositionList = res.data;
                    }
                })

            },
            getSearchFormPositionLevelList(pslid) {
                // this.$refs['pslidAttr'].resetField();
                this.searchForm.pslid = "";
                service.positionLevel.list({status: "1", psid: pslid}).then(res => {
                    if (res.resp_code == 200) {
                        this.searchFormPositionLevelList = res.data;
                    }
                })

            },
            getBrandList() {
                service.chain.brand.brandList({isDel: '0'}).then(res => {
                    this.brands = res.data
                })
            },
            getBranchList() {
                service.branch.list({isDel: '0'}).then(res => {
                    if (res.resp_code == 200) {
                        this.branchList = res.data;
                    }
                })
            },
            getPositionList() {
                service.position.list({status: "1", isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.positionList = res.data;
                    }
                })
            },
            getPositionLevelList() {
                service.dept.levelAll({status: "1", isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.positionLevelList = res.data;
                    }
                })
            },
            getEditFormBranchList(obj) {
                this.employeeForm.branchObj = {};
                this.employeeForm.positionObj = {};
                this.employeeForm.positionLevelObj = {};
                this.transferForm.branchObj = {};
                this.transferForm.positionObj = {};
                this.transferForm.positionLevelObj = {};
                service.branch.getListByShopType({
                    shopid: obj.id,
                    type: obj.type,
                    isDel: '0',
                    status: '1'
                }).then(res => {
                    if (res.resp_code == 200) {
                        this.editFormBranchList = res.data;
                    }
                })

            },
            getEditFormPositionList(obj) {
                this.employeeForm.positionObj = {};
                this.employeeForm.positionLevelObj = {};
                service.position.listForChain({status: "1", bbid: obj.id, isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.editFormPositionList = res.data;
                    }
                })
            },
            getEditFormPositionLevelList(obj) {
                this.employeeForm.positionLevelObj = {};
                service.positionLevel.listForChain({status: "1", psid: obj.id, isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.editFormPositionLevelList = res.data;
                    }
                })
            },
            getEditRegPositionLevelList(obj) {
                this.employeeForm.regpositionLevelObj = {};
                service.positionLevel.listForChain({status: "1", psid: obj.id, isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.editRegPositionLevelList = res.data;
                    }
                })
            },
            getEditTransPositionLevelList(obj) {
                this.transferForm.regpositionLevelObj = {};
                service.positionLevel.listForChain({status: "1", psid: obj.id, isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.editRegPositionLevelList = res.data;
                    }
                })
            },
            selectPositionLevel() {
                this.$forceUpdate();
            },
            addEmployee() {
                this.employeeForm.id = '';
                this.employeeForm.userId = '';
                this.employeeForm.otype = '2';
                this.isUser = false;
                this.myheaders = {
                    authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.disabledvalue = false;
                this.showList = false;
                this.showEdit = false;
                this.showSave = true;
                this.isnow = true;
            },
            async editAction(row, disabledvalue) {
                this.employeeForm.branchObj = {};
                this.employeeForm.positionObj = {};
                this.employeeForm.positionLevelObj = {};
                this.employeeForm.regionObj = [];
                this.employeeForm.regpositionObj = {};
                this.employeeForm.regpositionLevelObj = {};
                await service.branch.list({shopid: row.shopid, isDel: '0', status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.editFormBranchList = res.data;
                    }
                })
                await service.position.list({status: "1", bbid: row.bbid, isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.editFormPositionList = res.data;
                    }
                })
                await service.positionLevel.list({status: "1", psid: row.psid, isDel: "0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.editFormPositionLevelList = res.data;
                        this.editRegPositionLevelList = res.data;
                    }
                })

                this.employeeForm.id = row.id;
                this.employeeForm.photo = row.photo;
                this.employeeForm.entryTime = row.entryTime;

                this.employeeForm.nickname = row.nickname;
                this.employeeForm.birthday = row.birthday;
                this.employeeForm.sex = row.sex;
                this.employeeForm.mobile = row.mobile;
                this.employeeForm.memo = row.memo;
                this.employeeForm.bankNo = row.bankNo;
                this.employeeForm.idno = row.idno;
                this.employeeForm.eecode = row.eecode;
                this.employeeForm.eename = row.eename;
                this.employeeForm.bsalary = row.bsalary;
                this.employeeForm.specPrice = row.specPrice;
                this.employeeForm.isDel = row.isDel;
                this.employeeForm.status = row.status;
                this.employeeForm.userId = '';
                this.employeeForm.username = '';
                this.employeeForm.enabled = "0";
                this.employeeForm.otype = row.otype;
                this.employeeForm.revision = row.revision;
                this.employeeForm.jfyjMoney = row.jfyjMoney;
                this.employeeForm.jfhyjMoney = row.jfhyjMoney;

                if (row.otype == "1") {
                    this.employeeForm.shopid = row.shopid;
                    this.employeeForm.bbid = row.bbid;
                    this.employeeForm.psid = row.psid;
                    this.employeeForm.pslid = row.pslid;
                    //门店
                    this.filterShopList2.forEach(res => {
                        if (Number(res.id) === Number(row.shopid)) {
                            this.employeeForm.shopObj = res;
                            //this.getEditFormBranchList(res);
                        }
                    });
                    //部门、职务、级别选中
                    this.editFormBranchList.forEach(res => {
                        if (Number(res.id) === Number(row.bbid)) {
                            this.employeeForm.branchObj = res;
                        }
                    });
                    this.editFormPositionList.forEach(res => {
                        if (Number(res.id) === Number(row.psid)) {
                            this.employeeForm.positionObj = res;
                        }
                    });
                    this.editFormPositionLevelList.forEach(res => {
                        if (Number(res.id) === Number(row.pslid)) {
                            this.employeeForm.positionLevelObj = res;
                        }
                    });
                }
                if (row.otype == "2") {
                    this.employeeForm.regionId = row.regionId;
                    this.employeeForm.regionCode = row.regionCode;
                    this.employeeForm.psid = row.psid;
                    this.employeeForm.pslid = row.pslid;

                    this.editRegPositionLevelList.forEach(res => {
                        if (Number(res.id) === Number(row.pslid)) {
                            this.employeeForm.regpositionLevelObj = res;
                        }
                    });

                    this.positionList.forEach(res => {
                        if (Number(res.id) === Number(row.psid)) {
                            this.employeeForm.regpositionObj = res;
                        }
                    });

                    this.editFormPositionLevelList.forEach(res => {
                        if (Number(res.id) === Number(row.pslid)) {
                            this.employeeForm.regpositionLevelObj = res;
                        }
                    });

                    this.regionData.forEach(item => {
                        this.traverseRegion(item, row.regionId, this.employeeForm);
                    })

                }



                this.isUser = true;

                //获取员工帐号资料
                await service.sysUser.findByEeid({eeid: row.id}).then(res => {
                    if (res.resp_code == 200) {
                        if (res.data != null) {
                            this.employeeForm.userId = res.data.id;
                            this.employeeForm.username = res.data.username;
                            this.employeeForm.enabled = res.data.enabled;
                        }
                    }
                });

                this.employeeForm.shoplist = [];
                //获取员工业绩门店
                await service.employee.getEmployeeDshop({eeid: row.id}).then(res => {
                    if (res.resp_code == 200) {
                        this.employeeForm.shoplist = res.data;
                    }
                })

                this.disabledvalue = disabledvalue;
                if (disabledvalue) {
                    this.showEdit = true;
                    this.showSave = false;
                } else {
                    this.showEdit = false;
                    this.showSave = true;
                }
                console.log(this.employeeForm);
                this.showList = false;
                this.isnow = false;
            },
            search() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                if (this.status == '1') {
                    this.getData("2", this.searchForm);
                } else {
                    this.getData("1", this.searchForm);
                }

            },
            rest() {
                this.$refs["searchForm"].resetFields()
                this.searchForm.shopid = "";
                this.search()
            },
            dimissionAction(data) {
                if (data.status == '1') {
                    yid.util.confirm('你确定要离职' + data.eename + '吗？', '', '', () => {
                        data.status = '2'
                        service.employee.updateStatusEmployee(data).then(res => {
                            if (res.resp_code == 200) {
                                //停用员工对应帐号
                                let reqSysUser = {}
                                reqSysUser.eeid = res.data.id;
                                reqSysUser.isEnable = '0';
                                reqSysUser.isDelete = res.data.isDel;
                                service.sysUser.updateUser(reqSysUser).then(res => {
                                    if (res.resp_code == 200) {
                                        yid.util.success("操作成功")
                                        this.status = '2';
                                        this.getData("1", this.searchForm);
                                    }
                                });
                                this.status = '2';
                                this.getData("1", this.searchForm);
                            }
                        })
                    })
                } else {
                    yid.util.confirm('你确定要恢复' + data.eename + '吗？', '', '', () => {
                        data.status = '1'
                        service.employee.updateStatusEmployee(data).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("操作成功")
                                this.status = '1';
                                this.getData("2", this.searchForm);
                            }
                        })
                    })
                }
            },
            deleteAction(data) {
                data.isDel = '1'
                service.employee.save(data).then(res => {
                    if (res.resp_code == 200) {
                        //删除员工对应帐号
                        let reqSysUser = {}
                        reqSysUser.eeid = res.data.id;
                        reqSysUser.isEnable = res.data.enabled ? "1" : "0";
                        reqSysUser.isDelete = '1';
                        service.sysUser.updateUser(reqSysUser).then(res => {
                            if (res.resp_code == 200) {
                                this.getData("1", this.searchForm);
                            }
                        });
                        this.getData("1", this.searchForm);
                    }
                })
            },
            handleAvatarSuccess(res, file) {
                this.employeeForm.photo = res.data.url;
            },
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传头像图片只能是 JPG/PNG 格式!');
                    return;
                }
                if (!isLt2M) {
                    yid.util.error('上传头像图片大小不能超过 10MB!');
                    return;
                }
                return isJPG && isLt2M;
            },
            save() {
                const that = this;
                this.$refs['employeeForm'].validate((valid) => {
                    if (valid) {
                        if (that.employeeForm.status == null || that.employeeForm.status.length == 0) {
                            that.employeeForm.status = "1";
                        }
                        if (!that.employeeForm.otype) {
                            yid.util.error('请选择业务类型');
                            return;
                        }
                        if (that.employeeForm.otype == "1") {
                            if (!that.employeeForm.shopObj.id) {
                                yid.util.error('请选择门店');
                                return;
                            }
                            if (!that.employeeForm.branchObj.id) {
                                yid.util.error('请选择业务组');
                                return;
                            }
                            if (!that.employeeForm.positionObj.id) {
                                yid.util.error('请选择职务');
                                return;
                            }
                            // var numReg = /^[0-9]*$/
                            // var numRe = new RegExp(numReg)
                            // if (!numRe.test(that.employeeForm.jfyjMoney)) {
                            //   yid.util.error("员工剪发原价请输入正整数");
                            //   return;
                            // }
                            // if (!numRe.test(that.employeeForm.jfhyjMoney)) {
                            //   yid.util.error("员工剪发员价请输入正整数");
                            //   return;
                            // }
                            //门店
                            that.employeeForm.shopid = that.employeeForm.shopObj.id;
                            that.employeeForm.shopcode = that.employeeForm.shopObj.shopcode;
                            that.employeeForm.shopname = that.employeeForm.shopObj.shopname;
                            //部门
                            that.employeeForm.bname = that.employeeForm.branchObj.bname
                            that.employeeForm.bbid = that.employeeForm.branchObj.id
                            //职位
                            that.employeeForm.psname = that.employeeForm.positionObj.psname
                            that.employeeForm.psid = that.employeeForm.positionObj.id
                            that.employeeForm.pscode = that.employeeForm.positionObj.pscode
                            //级别
                            if (that.employeeForm.positionLevelObj) {
                                that.employeeForm.pslname = that.employeeForm.positionLevelObj.pslname
                                that.employeeForm.pslid = that.employeeForm.positionLevelObj.id
                                that.employeeForm.pslcode = that.employeeForm.positionLevelObj.pslcode
                            }else{
                                that.employeeForm.pslid = null;
                                that.employeeForm.pslcode = null;
                                that.employeeForm.pslname = null;
                            }

                            // 机构
                            that.employeeForm.regionId = null;
                            that.employeeForm.regionCode = null;
                            that.employeeForm.regionName = null;
                            // that.employeeForm.shoplist = [];
                        }
                        if (that.employeeForm.otype == "2") {
                            if (!that.employeeForm.regionObjValue.length) {
                                yid.util.error('请选择机构');
                                return;
                            }
                            if (!that.employeeForm.regpositionObj.id) {
                                yid.util.error('请选择职务');
                                return;
                            }
                            // 机构
                            that.employeeForm.regionObjValue.forEach(each => {
                                that.employeeForm.regionId = each.id;
                                that.employeeForm.regionCode = each.code;
                                that.employeeForm.regionName = each.oname;
                            })

                            //职位
                            that.employeeForm.psid = that.employeeForm.regpositionObj.id
                            that.employeeForm.pscode = that.employeeForm.regpositionObj.pscode
                            that.employeeForm.psname = that.employeeForm.regpositionObj.psname
                            //级别
                            if (that.employeeForm.regpositionLevelObj) {
                                that.employeeForm.pslid = that.employeeForm.regpositionLevelObj.id
                                that.employeeForm.pslcode = that.employeeForm.regpositionLevelObj.pslcode
                                that.employeeForm.pslname = that.employeeForm.regpositionLevelObj.pslname
                            }else{
                                that.employeeForm.pslid = null;
                                that.employeeForm.pslcode = null;
                                that.employeeForm.pslname = null;
                            }

                            //门店
                            that.employeeForm.shopid = null;
                            that.employeeForm.shopcode = null;
                            that.employeeForm.shopname = null;
                            //部门
                            that.employeeForm.bname = null;
                            that.employeeForm.bbid = null;
                        }

                        service.employee.save(that.employeeForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                if (that.employeeForm.id == '' || that.employeeForm.id.length == 0) {
                                    that.status = "2";
                                    that.getData("1", that.searchForm);
                                } else {
                                    if (that.status == '2') {
                                        that.status = "2";
                                        that.getData("1", that.searchForm);
                                    } else {
                                        that.status = "1";
                                        that.getData("2", that.searchForm);
                                    }
                                }
                                that.$refs['employeeForm'].resetFields()
                                that.showList = true
                            }
                        })
                    }
                });
            },
            back() {
                this.$refs['employeeForm'].resetFields()
                this.showList = true
            },
            edit() {
                this.showEdit = false;
                this.showSave = true;
                this.disabledvalue = false;
            },
            checkEecode() {
                let id = this.employeeForm.id
                let eecode = this.employeeForm.eecode;
                const param = {id: id, eecode: eecode}
                service.employee.checkEecode(param).then(res => {
                    if (res.resp_code == "200") {
                        if (res.data != "0") {
                            yid.util.info(res.resp_msg);
                            this.employeeForm.eecode = '';
                        }
                    }
                })
            },
            mutiImportEmployee() {
                this.mutiImportDialog.title = '批量导入员工资料';
                this.mutiImportDialog.visible = true;
                this.mutiImportDialog.employees = [];
                this.myheaders = {
                    authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.$refs.uploadExcel.clearFiles()
            },
            downExcelTemplate() {
                download(yid.config.API.BASE + 'api-chain/employee/excelTemplate', {})
            },
            beforeAvatarExcelUpload(file) {
                const isJPG = (file.type.indexOf("sheet") || file.type.indexOf('excel'));
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                    return;
                }
                if (!isLt2M) {
                    yid.util.error('上传excel大小不能超过 10MB!');
                    return;
                }
                return isJPG && isLt2M;
            },
            handleAvatarExcelSuccess(res) {
                this.mutiImportDialog.employees = res.data;
                console.log(this.mutiImportDialog.employees);
            },
            saveImportEmployees() {
                if (this.mutiImportDialog.employees.length == 0) {
                    yid.util.info("无导入数据");
                } else {
                    console.log(this.mutiImportDialog.employees);
                    service.employee.batchImport({maps: this.mutiImportDialog.employees}).then(res => {
                        if (res.resp_code == 200) {
                            yid.util.success("导入成功")
                            this.importCancel();
                            this.getData("1", this.searchForm);
                        }
                    })
                }
            },
            importCancel() {
                this.mutiImportDialog.visible = false;
            },
            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                        this.filterShopList2 = res.data;
                        this.allShopList2 = Object.assign(this.filterShopList2);//保留原数据
                        this.filterShopList3 = res.data;
                        this.allShopList3 = Object.assign(this.filterShopList3);//保留原数据
                    }
                })
            },
            filterShop(v) {
                this.filterShopList = this.allShopList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            filterShop2(v) {
                v = v.toLocaleUpperCase();
                this.filterShopList2 = this.allShopList2.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            filterShop3(v) {
                this.filterShopList3 = this.allShopList3.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            transferAction(row) {
                this.transferDialog.title = '员工调店';
                this.transferDialog.visible = true;
                this.transferForm.employee = row;
                this.transferForm.id = row.id;
                this.transferForm.shopObj = {};
                this.transferForm.branchObj = {};
                this.transferForm.positionObj = {};
                this.transferForm.positionLevelObj = {};
                this.transferForm.regpositionObj = {};
                this.transferForm.regpositionLevelObj = {};
                this.transferForm.regionObj = [];
                this.transferForm.regionObjValue = [];
                this.transferForm.otype = row.otype;
                this.transferForm.revision = row.revision;
            },
            cancelTransfer() {
                this.$refs['transferForm'].resetFields();
                this.transferDialog.visible = false;
            },
            saveTransfer() {
                const that = this;
                this.$refs['transferForm'].validate((valid) => {
                    if (valid) {
                        if (that.transferForm.employee.id && that.transferForm.shopObj.id == that.transferForm.employee.shopid) {
                            //yid.util.error('调入门店和原门店相同');
                            //return;
                        }
                        if (!that.transferForm.otype) {
                            yid.util.error('请选择业务类型');
                            return;
                        }
                        if (that.transferForm.otype == "1") {
                            if (!that.transferForm.shopObj.id) {
                                yid.util.error('请选择门店');
                                return;
                            }
                            if (!that.transferForm.branchObj.id) {
                                yid.util.error('请选择业务组');
                                return;
                            }
                            if (!that.transferForm.positionObj.id) {
                                yid.util.error('请选择职务');
                                return;
                            }
                            //门店
                            that.transferForm.shopid = that.transferForm.shopObj.id;
                            that.transferForm.shopcode = that.transferForm.shopObj.shopcode;
                            that.transferForm.shopname = that.transferForm.shopObj.shopname;
                            //部门
                            that.transferForm.bname = that.transferForm.branchObj.bname
                            that.transferForm.bbid = that.transferForm.branchObj.id

                            //职位
                            that.transferForm.psid = that.transferForm.positionObj.id
                            that.transferForm.pscode = that.transferForm.positionObj.pscode
                            that.transferForm.psname = that.transferForm.positionObj.psname
                            //级别
                            if (that.transferForm.positionLevelObj) {
                                that.transferForm.pslid = that.transferForm.positionLevelObj.id
                                that.transferForm.pslcode = that.transferForm.positionLevelObj.pslcode
                                that.transferForm.pslname = that.transferForm.positionLevelObj.pslname
                            } else {
                                that.transferForm.pslid = null
                                that.transferForm.pslcode = null
                                that.transferForm.pslname = null
                            }
                            that.transferForm.regionId = null;
                            that.transferForm.regionCode = null;
                            that.transferForm.regionName = null;
                        }
                        if (that.transferForm.otype == "2") {
                            if (!that.transferForm.regionObjValue.length) {
                                yid.util.error('请选择调入机构');
                                return;
                            }
                            if (!that.transferForm.regpositionObj.id) {
                                yid.util.error('请选择职务');
                                return;
                            }
                            that.transferForm.regionObjValue.forEach(each => {
                                that.transferForm.regionId = each.id;
                                that.transferForm.regionCode = each.code;
                                that.transferForm.regionName = each.oname;
                            })
                            //职位
                            that.transferForm.psid = that.transferForm.regpositionObj.id
                            that.transferForm.pscode = that.transferForm.regpositionObj.pscode
                            that.transferForm.psname = that.transferForm.regpositionObj.psname
                            //级别
                            if (that.transferForm.positionLevelObj) {
                                that.transferForm.pslid = that.transferForm.regpositionLevelObj.id
                                that.transferForm.pslcode = that.transferForm.regpositionLevelObj.pslcode
                                that.transferForm.pslname = that.transferForm.regpositionLevelObj.pslname
                            } else {
                                that.transferForm.pslid = null
                                that.transferForm.pslcode = null
                                that.transferForm.pslname = null
                            }
                            //门店
                            that.transferForm.shopid = null;
                            that.transferForm.shopcode = null;
                            that.transferForm.shopname = null;
                            //部门
                            that.transferForm.bname = null;
                            that.transferForm.bbid = null;
                        }

                        service.employee.saveTransfer(that.transferForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                if (that.status == '2') {
                                    that.status = "2";
                                    that.getData("1", that.searchForm);
                                } else {
                                    that.status = "1";
                                    that.getData("2", that.searchForm);
                                }
                                that.$refs['transferForm'].resetFields();
                                that.transferDialog.visible = false;
                            }
                        })

                    }

                });
            },
            clearFormShop() {
                setTimeout(() =>{
                    if(this.searchForm.shopid == ''){
                        this.searchForm.shopid = "";
                        this.filterShopList = Object.assign(this.allShopList);
                    }

                },300)
            },
            selectEeShops(ee) {
                this.shopDialog.shoplist = [];
                if (null != ee.shoplist && ee.shoplist.length > 0) {
                    ee.shoplist.forEach(m => {
                        this.shopDialog.shoplist.push({
                            shopid: m.shopid,
                            shopcode: m.shopcode,
                            shopname: m.shopname,
                            bbid: m.bbid
                        })
                    })
                }
                this.shopDialog.visible = true
                this.$refs['tableShop'].clearData()
                this.$refs['queryShop'].resetFields()
            },
            handleSelectionChange(rows) {
                this.selectShops = rows;
            },
            queryShop() {
                const fetch = service.chain.servShop.queryShop
                const params = {
                    page: this.shopDialog.page,
                    limit: this.shopDialog.limit,
                    shop: this.shopDialog.shop,
                    type: this.shopDialog.type,
                    status: this.shopDialog.status,
                    brandId: this.shopDialog.brandId
                }
                this.$refs['tableShop'].reloadData({
                    fetch,
                    params,
                });
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
                        service.branch.getListByShopType({
                            shopid: m.id,
                            type: m.type,
                            isDel: '0',
                            status: '1'
                        }).then(res => {
                            if (res.resp_code == 200) {
                                res.data.forEach(e =>{
                                    this.shopDialog.shoplist.push({
                                        shopid: m.id,
                                        shopcode: m.shopcode,
                                        shopname: m.shopname,
                                        bbid: e.id
                                    })
                                });
                            }
                        })
                    }
                })
            },
            deleteShop(row) {
                let i = -1;
                this.shopDialog.shoplist.forEach((p, index) => {
                    if (p.shopid == row.shopid) {
                        i = index
                    }
                })
                this.shopDialog.shoplist.splice(i, 1)
            },
            setShop() {
                this.employeeForm.shoplist = this.shopDialog.shoplist
                this.shopDialog.visible = false
            },
            selectRegion(e) {
                let arrNew = [];
                let dataLength = this.selectRegionObj.regionObjValue.length;
                let eleng = e.length;
                for (let i = 0; i < dataLength; i++) {
                    for (let j = 0; j < eleng; j++) {
                        if (e[j] === this.selectRegionObj.regionObjValue[i].name) {
                            arrNew.push(this.selectRegionObj.regionObjValue[i])
                        }
                    }
                }
                this.$refs.templateRegionTree.setCheckedNodes(arrNew);//设置勾选的值
            },
            templateCheckChange(data, checked, child) {
                if (!checked) {
                    this.clearSelectRegion();
                    return
                }

                if (checked === true) {
                    this.checkedRegionId = data.id
                    this.$refs.templateRegionTree.setCheckedKeys([data.id]);
                } else {
                    if (this.checkedRegionId === data.id) {
                        this.$refs.templateRegionTree.setCheckedKeys([data.id]);
                    }
                }

                //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
                let res = this.$refs.templateRegionTree.getCheckedNodes(false, false);
                let arrLabel = [];
                let arr = [];
                res.forEach(item => {
                    arrLabel.push(item.name);
                    arr.push(item);
                });
                this.transferForm.regionObjValue = arr;
                this.transferForm.regionObj = arrLabel;

                let _this = this;
                setTimeout(function () {
                    _this.$refs.selectRegionRef.blur();
                }, 50);
            },
            clearSelectRegion() {
                this.transferForm.regionObjValue = []
                this.transferForm.regionObj = []
                this.$refs.templateRegionTree.setCheckedNodes([]);//设置勾选的值
            },
            getRegionTreeAll() {
                service.chain.region.treeAll({status: "1"}).then(res => {
                    if (res.resp_code == 200) {
                        this.regionData = res.data;
                    }
                })
            },
            selectRegion1(e) {
                let arrNew = [];
                let dataLength = this.selectRegionObj.regionObjValue.length;
                let eleng = e.length;
                for (let i = 0; i < dataLength; i++) {
                    for (let j = 0; j < eleng; j++) {
                        if (e[j] === this.selectRegionObj.regionObjValue[i].name) {
                            arrNew.push(this.selectRegionObj.regionObjValue[i])
                        }
                    }
                }
                this.$refs.templateRegionTree1.setCheckedNodes(arrNew);//设置勾选的值
            },
            templateCheckChange1(data, checked, child) {
                if (!checked) {
                    this.clearSelectRegion1();
                    return
                }

                if (checked === true) {
                    this.checkedRegionId = data.id
                    this.$refs.templateRegionTree1.setCheckedKeys([data.id]);
                } else {
                    if (this.checkedRegionId === data.id) {
                        this.$refs.templateRegionTree1.setCheckedKeys([data.id]);
                    }
                }

                //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
                let res = this.$refs.templateRegionTree1.getCheckedNodes(false, false);
                let arrLabel = [];
                let arr = [];
                res.forEach(item => {
                    arrLabel.push(item.name);
                    arr.push(item);
                });
                this.employeeForm.regionObjValue = arr;
                this.employeeForm.regionObj = arrLabel;

                let _this = this;
                setTimeout(function () {
                    _this.$refs.selectRegionRef1.blur();
                }, 50);
            },
            clearSelectRegion1() {
                this.employeeForm.regionObjValue = []
                this.employeeForm.regionObj = []
                this.$refs.templateRegionTree1.setCheckedNodes([]);//设置勾选的值
            },
            traverseRegion(regionData, selectRegionId, selectRegionObj) {
                let that = this;
                if (parseInt(regionData.id) == selectRegionId) {
                    selectRegionObj.regionObjValue.push(regionData);
                    selectRegionObj.regionObj.push(regionData.name);
                    that.$refs.templateRegionTree1.setCheckedNodes(selectRegionObj.regionObjValue)
                    return
                }
                if (regionData.children && regionData.children.length > 0) {
                    regionData.children.map((item) => {
                        that.traverseRegion(item, selectRegionId, selectRegionObj)
                    })
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
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
