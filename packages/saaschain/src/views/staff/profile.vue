<template>
    <div class="salaryRewardDetail">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="所属门店：">
                        <el-select clearable v-model.trim="searchForm.shopid" filterable :filter-method="filterShop" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职务：" prop="psid">
                        <el-select   filterable placeholder="请选择" v-model.trim="searchForm.psid" @change="getSearchFormPositionLevelList">
                            <el-option :key="item.id" :label="item.psname" :value="item.id" v-for="item in searchFormPositionList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="级别：" prop="pslid">
                        <el-select   filterable placeholder="请选择" v-model.trim="searchForm.pslid">
                            <el-option :key="item.id" :label="item.pslname" :value="item.id" v-for="item in searchFormPositionLevelList"></el-option>
                        </el-select>
                    </el-form-item>
                    <br/>
                    <el-form-item label="员工：" prop="eename">
                        <el-input  v-model="searchForm.eename" placeholder="姓名" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="mobile">
                        <el-input type='number' v-model="searchForm.mobile" placeholder="手机号" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-button @click="addEmployee" type="primary">新增员工</el-button>
                <el-button @click="lookup()">查看{{status=='2'?'已离职':'在职'}}员工</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button @click="mutiImportEmployee" type="primary">导入</el-button>
                <yid-table  ref="table" pagination style="width: 100%;margin-top: 20px;">
                    <yid-table-column
                            prop="eecode"
                            label="员工编号"
                            width="150">
                    </yid-table-column>
                    <yid-table-column
                            prop="eename"
                            label="姓名"
                            width="120">
                    </yid-table-column>
                    <yid-table-column
                            label="性别"
                            width="80">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            prop="mobile"
                            label="手机号">
                    </yid-table-column>
                    <yid-table-column
                            prop="psname"
                            label="职务">
                    </yid-table-column>
                    <yid-table-column
                            prop="pslname"
                            label="级别">
                    </yid-table-column>
                    <yid-table-column
                            prop = "entryTime"
                            label="入职时间">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.entryTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="bname"
                                      label="所属部门">
                    </yid-table-column>
                    <yid-table-column
                            label="员工状态">
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
                            prop = "quitTime"
                            label="离职时间">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.quitTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editAction(scope.row)">编辑</el-link>
                            <el-link style="margin-left: 6px" type="primary" @click="dimissionAction(scope.row)">{{scope.row.status == '1' ? "离职" : "恢复"}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button  @click="back" type="primary">返回</el-button>
                <el-button  @click="save" type="primary">保存</el-button>
                <el-form ref="employeeForm" :model="employeeForm" style="margin-top: 16px" :rules="rules" label-width="100px" label-position="right">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="员工头像：" prop="photo">
                                <el-upload
                                        class="avatar-uploader"
                                        action="https://sass.yidmall.com/api/api-file/files-anon"
                                        :headers="myheaders"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                    <img v-if="employeeForm.photo" :src="employeeForm.photo" class="avatar el-upload" style="width: 200px;height: 200px">
                                    <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
                                    <div class="el-upload__tip" slot="tip">
                                        仅支持jpg，png格式的图片上传

                                        图片尺寸：200px*200px</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="入职时间: " prop="entryTime" :rules="[{ required: true, message: '入职时间不能为空'}]">
                                <el-date-picker
                                        style="width: 195px;"
                                        v-model.trim="employeeForm.entryTime"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="所属部门: " prop="branchObj" :rules="[{ required: true, message: '部门不能为空'}]">
                                <el-select  value-key="id" filterable placeholder="请选择" v-model.trim="employeeForm.branchObj" @change="getEditFormPositionList">
                                    <el-option :key="item.id" :label="item.bname" :value="item" v-for="item in branchList"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="职务：" prop="positionObj" :rules="[{ required: true, message: '职务不能为空'}]">
                                <el-select   value-key="id"  filterable placeholder="请选择" v-model.trim="employeeForm.positionObj" @change="getEditFormPositionLevelList">
                                    <el-option :key="item.id" :label="item.psname" :value="item" v-for="item in editFormPositionList"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="级别：" prop="positionLevelObj" :rules="[{ required: true, message: '级别不能为空'}]">
                                <el-select   value-key="id" filterable placeholder="请选择" v-model.trim="employeeForm.positionLevelObj" @change="selectPositionLevel">
                                    <el-option :key="item.id" :label="item.pslname" :value="item" v-for="item in editFormPositionLevelList"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="员工编号："  prop="eecode" :rules="[{ required: true, message: '员工编号不能为空'}]">
                                <el-input  v-model="employeeForm.eecode" :disabled="this.isUser" placeholder="员工编号" style="width: 150px;" @change="checkEecode"></el-input>
                            </el-form-item>

                            <el-form-item label="员工姓名：" prop="eename" :rules="[{ required: true, message: '员工姓名不能为空'}]">
                                <el-input  v-model="employeeForm.eename" placeholder="姓名" style="width: 150px;"></el-input>
                            </el-form-item>

                            <el-form-item label="员工昵称：" prop="nickname">
                                <el-input  v-model="employeeForm.nickname" placeholder="昵称" style="width: 150px;"></el-input>
                            </el-form-item>

                            <el-form-item label="出生日期: " prop="birthday" :rules="[{ required: true, message: '出生日期不能为空'}]">
                                <el-date-picker
                                        style="width: 195px;"
                                        v-model.trim="employeeForm.birthday"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="性别：" prop="sex" :rules="[{ required: true, message: '请选择性别'}]">
                                <el-select   filterable placeholder="请选择" v-model.trim="employeeForm.sex" >
                                    <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in sexList"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="手机号：" prop="mobile" >
                                <el-input  v-model="employeeForm.mobile" placeholder="手机号" style="width: 170px;"></el-input>
                            </el-form-item>

                            <el-form-item label="身份证：" prop="idno" >
                                <el-input v-model="employeeForm.idno" placeholder="身份证号码" style="width: 170px;"></el-input>
                            </el-form-item>

                            <el-form-item label="银行卡：" prop="bankNo">
                                <el-input v-model="employeeForm.bankNo" placeholder="银行卡号" style="width: 170px;"></el-input>
                            </el-form-item>

                            <el-form-item label="备注：" prop="memo">
                                <el-input type="textarea"  v-model="employeeForm.memo"  style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设置账号：" prop="enabled">
                                <el-switch disabled="disabled" v-model="employeeForm.enabled" active-value="1" inactive-value="0" inactive-color="#ff4949">
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="用户名：" prop="username">
                                <!--<el-input  v-model="employeeForm.username"  placeholder="用户名" style="width: 150px;"></el-input>-->
                                {{employeeForm.username}}
                            </el-form-item>
                            <el-form-item label="基本工资：" prop="bsalary">
                                <el-input type="number"  v-model="employeeForm.bsalary" min="0" placeholder="基本工资" style="width: 170px;"></el-input>
                            </el-form-item>
                            <el-form-item label="特殊价：" prop="specPrice">
                                <el-input  v-model="employeeForm.specPrice" placeholder="特殊价" style="width: 170px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>





                </el-form>

            </div>
        </el-collapse-transition>
        <yid-dialog :title="mutiImportDialog.title" :visible.sync="mutiImportDialog.visible" @close="importCancel" width="700px">
            <el-form :model="mutiImportDialog.model"  label-width="120px" ref="copyForm" :label-position="labelPosition">
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
                            action="https://sass.yidmall.com/api/api-base/employee/importExcel"
                            :show-file-list="true"
                            :on-success="handleAvatarExcelSuccess"
                            :before-upload="beforeAvatarExcelUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入3000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportEmployees" type="primary">保存</el-button>
                    <el-button @click="importCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'
    import {isEmpty} from "../../library/helper/validate";

    export default {
        name: "profile",
        data(){
            return {
                myheaders:{},
                dataList:[],
                status : '2',
                quitShow : false,
                pageInfo:{page:0,limit:10,isDel:"0"},
                searchFormPositionList:[], //职务list
                searchFormPositionLevelList:[], //级别list 搜索表单用

                branchList:[], //部门list
                positionList : [],//职务list
                positionLevelList : [],//级别list
                editFormPositionLevelList:[], //级别List  新增or编辑员工表单用
                editFormPositionList:[],//职务list

                sexList:[{id:"1",name:"男"},{id:"2",name:"女"}],
                sysRoleTypeList:[],//角色list

                searchForm:{
                    shopid: null,
                    psid:null,
                    pslid:null,
                    eename:null,
                    mobile:null,
                },
                employeeForm:{
                    photo:"",
                    entryTime:"",
                    branchObj:null,
                    positionObj:null,
                    positionLevelObj:null,
                    eename:"",
                    nickname:"",
                    birthday:"",
                    sex:"",
                    enabled : "",
                    mobile:"",
                    memo:"",
                    bankNo:"",
                    idno:"",
                    eecode:"",
                    userId: "",
                    username:"",
                    bsalary : "",
                    specPrice : "",
                    status : '1',
                    shopid: "",
                },
                isUser : false,
                showList:true,
                rules: {
                    mobile:[{ required: true, message: '请输入手机号'},
                        {validator: this.checkMobile, trigger:"blur"}
                    ],
                    eecode:[{ required: true, message: '请输入员工编号'},
                        {validator: this.isHaveChinese, trigger:"blur"}
                    ],
                },
                mutiImportDialog: {
                    title: '',
                    visible: false,
                    employees: []
                },
                allShopList:[],
                filterShopList:[],
            }
        },
        mounted(){
            this.getData("1");
            this.getSearchFormPositionList();
            this.getPositionList();
            this.getPositionLevelList();
            this.getBranchList();
            this.getSysRoleTypeList();
            this.getShopList();
        },
        methods:{
            lookup(){
                this.getData(this.status);
                if(this.status=='1'){
                    this.status='2'
                    this.quitShow = false;
                }else{
                    this.status='1'
                    this.quitShow = true;
                }
            },

            getData(status,reqParams){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.employee.list
                const params = {...this.pageInfo,...reqParams}
                params.status = status
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },

            checkMobile(rule, value, callback){
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if(!yid.validate.mobile(value)){
                    callback(new Error('输入正确手机号'));
                }
                else {
                    callback();
                }
            },

             isHaveChinese(rule, value, callback){
                if (value === '') {
                    callback(new Error('请输入员工编号'));
                } else if(yid.validate.isHaveChinese(value)){
                    callback(new Error('不能含有中文'));
                }
                else {
                    callback();
                }
            },
            getSysRoleTypeList(){
                service.sysRoleType.list().then(res=> {
                    if(res.resp_code == 200) {
                        this.sysRoleTypeList = res.data;
                    }
                })
            },
            getSearchFormPositionList(){
                service.position.list({status:"1",isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchFormPositionList = res.data;
                    }
                })

            },
            getSearchFormPositionLevelList(pslid){
                // this.$refs['pslidAttr'].resetField();
                this.searchForm.pslid = null;
                service.positionLevel.list({status:"1",psid:pslid}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchFormPositionLevelList = res.data;
                    }
                })

            },
            getBranchList(){
                service.branch.list({isDel:'0'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.branchList = res.data;
                    }
                })
            },

            getPositionList(){
                service.position.list({status:"1",isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.positionList = res.data;
                    }
                })
            },

            getPositionLevelList(){
                service.dept.levelAll({status:"1",isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.positionLevelList = res.data;
                    }
                })
            },

            getEditFormPositionList(obj){
                this.employeeForm.positionObj = null;
                this.employeeForm.positionLevelObj = null;
                service.position.list({status:"1",bbid:obj.id,isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.editFormPositionList = res.data;
                    }
                })
            },

            getEditFormPositionLevelList(obj){
                this.employeeForm.positionLevelObj = null;
                service.positionLevel.list({status:"1",psid:obj.id,isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.editFormPositionLevelList = res.data;
                    }
                })

            },



            selectPositionLevel(){
                this.$forceUpdate();
            },
            addEmployee(){
                if(this.searchForm.shopid==null || this.searchForm.shopid==""){
                    yid.util.error("请先选择门店，再新增")
                    return;
                }
                this.$refs['employeeForm'].resetFields()
                this.employeeForm.id = '';
                this.employeeForm.userId = '';
                this.isUser = false;
                this.myheaders={
                    authorization:'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.showList = false;
            },
            editAction(row){
                this.employeeForm.id = row.id;
                this.employeeForm.photo = row.photo;
                this.employeeForm.entryTime = row.entryTime;
                this.employeeForm.bbid = row.bbid;
                this.employeeForm.psid = row.psid;
                this.employeeForm.pslid = row.pslid;
                this.employeeForm.eename = row.eename;
                this.employeeForm.nickname = row.nickname;
                this.employeeForm.birthday = row.birthday;
                this.employeeForm.sex = row.sex;
                this.employeeForm.mobile = row.mobile;
                this.employeeForm.memo = row.memo;
                this.employeeForm.bankNo = row.bankNo;
                this.employeeForm.idno = row.idno;
                this.employeeForm.eecode = row.eecode;
                this.employeeForm.bsalary = row.bsalary;
                this.employeeForm.specPrice = row.specPrice;
                this.employeeForm.isDel = row.isDel;
                this.employeeForm.status = row.status;
                this.employeeForm.userId = '';
                this.employeeForm.username = '';
                this.employeeForm.enabled = "0";
                this.isUser = true;
                //部门、职务、级别选中
                this.branchList.forEach(res=>{
                    if(Number(res.id) === Number(row.bbid)){
                        this.employeeForm.branchObj = res;
                        this.getEditFormPositionList(res);
                    }
                });
                this.positionList.forEach(res=>{
                    if(Number(res.id) === Number(row.psid)){
                        this.employeeForm.positionObj = res;
                        this.getEditFormPositionLevelList(res);
                    }
                });
                this.positionLevelList.forEach(res=>{
                    if(Number(res.id) === Number(row.pslid)){
                        this.employeeForm.positionLevelObj = res;
                    }
                });

                //获取员工帐号资料
                service.sysUser.findByEeid({eeid:row.id}).then(res=>{
                    if(res.resp_code == 200) {
                        if(res.data != null){
                            this.employeeForm.userId = res.data.id;
                            this.employeeForm.username = res.data.username;
                            this.employeeForm.enabled = "1";
                        }
                    }
                });
                console.log(this.employeeForm);
                this.showList = false;
            },
            search(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                if(this.status=='1'){
                    this.getData("2",this.searchForm);
                }else{
                    this.getData("1",this.searchForm);
                }

            },
            rest(){
                this.$refs["searchForm"].resetFields()
                this.searchForm.shopid = "";
                this.search()
            },
            dimissionAction(data){
                if(data.status == '1'){
                    yid.util.confirm('你确定要离职'+data.eename+'吗？', '','', ()=> {
                        data.status = '2'
                        service.employee.updateStatusEmployee(data).then(res=> {
                            if(res.resp_code == 200) {
                                //停用员工对应帐号
                                let reqSysUser = {}
                                reqSysUser.eeid = res.data.id;
                                reqSysUser.isEnable = '0';
                                reqSysUser.isDelete = res.data.isDel;
                                service.sysUser.updateUser(reqSysUser).then(res =>{
                                    if(res.resp_code == 200) {
                                        yid.util.success("操作成功")
                                        this.status = '2';
                                        this.getData("1",this.searchForm);
                                    }
                                });
                                this.status = '2';
                                this.getData("1",this.searchForm);
                            }
                        })
                    })
                }else{
                    yid.util.confirm('你确定要恢复'+data.eename+'吗？', '','', ()=> {
                        data.status = '1'
                        service.employee.updateStatusEmployee(data).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success("操作成功")
                                this.status = '1';
                                this.getData("2",this.searchForm);
                            }
                        })
                    })
                }
            },
            deleteAction(data){
                data.isDel = '1'
                service.employee.save(data).then(res=> {
                    if(res.resp_code == 200) {
                        //删除员工对应帐号
                        let reqSysUser = {}
                        reqSysUser.eeid = res.data.id;
                        reqSysUser.isEnable = res.data.enabled ?  "1" : "0";
                        reqSysUser.isDelete = '1';
                        service.sysUser.updateUser(reqSysUser).then(res =>{
                            if(res.resp_code == 200) {
                                this.getData("1",this.searchForm);
                            }
                        });
                        this.getData("1",this.searchForm);
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
            save(){
                this.$refs['employeeForm'].validate((valid) => {
                    if(valid){
                        if(this.employeeForm.status == null || this.employeeForm.status.length ==0){
                            this.employeeForm.status = "1";
                        }
                        this.employeeForm.shopid = this.searchForm.shopid;
                        //部门
                        this.employeeForm.bname = this.employeeForm.branchObj.bname
                        this.employeeForm.bbid = this.employeeForm.branchObj.id
                        //职位
                        this.employeeForm.psname = this.employeeForm.positionObj.psname
                        this.employeeForm.psid = this.employeeForm.positionObj.id
                        this.employeeForm.pscode = this.employeeForm.positionObj.pscode
                        //级别
                        this.employeeForm.pslname = this.employeeForm.positionLevelObj.pslname
                        this.employeeForm.pslid = this.employeeForm.positionLevelObj.id
                        this.employeeForm.pslcode = this.employeeForm.positionLevelObj.pslcode
                        console.log(this.employeeForm);
                        service.employee.save(this.employeeForm).then(res =>{
                            if(res.resp_code == 200) {
                                yid.util.success("保存成功");
                                if( this.employeeForm.id == '' || this.employeeForm.id.length == 0){
                                    this.status = "2";
                                    this.getData("1",this.searchForm);
                                }else{
                                    if(this.status == '2'){
                                        this.status = "2";
                                        this.getData("1",this.searchForm);
                                    }else{
                                        this.status = "1";
                                        this.getData("2",this.searchForm);
                                    }
                                }
                                this.showList = true
                            }
                        })

                    }

                });
            },
            back(){
                this.showList = true
            },
            checkEecode(){
                let id = this.employeeForm.id
                let eecode =  this.employeeForm.eecode;
                const param  = {id:id,eecode:eecode}
                service.employee.checkEecode(param).then(res=> {
                    if(res.resp_code=="200"){
                        if(res.data != "0"){
                            yid.util.info(res.resp_msg);
                            this.employeeForm.eecode = '';
                        }
                    }
                })
            },
            mutiImportEmployee(){
                this.mutiImportDialog.title = '批量导入员工资料';
                this.mutiImportDialog.visible = true;
                this.mutiImportDialog.employees = [];
                this.myheaders={
                    authorization:'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.$refs.uploadExcel.clearFiles()
            },
            downExcelTemplate(){
                download(yid.config.API.BASE + '/api-base/employee/excelTemplate', {})
            },
            beforeAvatarExcelUpload(file){
                const isJPG = (file.type.indexOf("sheet") ||file.type.indexOf('excel'));
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
            handleAvatarExcelSuccess(res){
                this.mutiImportDialog.employees = res.data;
                console.log(this.mutiImportDialog.employees);
            },
            saveImportEmployees(){
                if(this.mutiImportDialog.employees.length == 0){
                    yid.util.info("无导入数据");
                }else{
                    console.log(this.mutiImportDialog.employees);
                    service.employee.batchImport({maps:this.mutiImportDialog.employees}).then(res=>{
                        if(res.resp_code == 200) {
                            yid.util.success("导入成功")
                            this.importCancel();
                            this.getData("1",this.searchForm);
                        }
                    })
                }
            },
            importCancel(){
                this.mutiImportDialog.visible = false;
            },
            getShopList() {
                service.chain.shop.shopList({status:'0'}).then(res => {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
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
        }
    }
</script>

<style scoped lang="scss">

</style>
