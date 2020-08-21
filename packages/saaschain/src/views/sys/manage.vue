<template>
  <div class="sys-manage">
    <el-collapse-transition>
       <div class="sys-list" v-show="listShow">
      <el-form :model="searchForm" ref="searchForm" inline>
        <el-form-item label="姓名或手机号">
          <el-input clearable placeholder="姓名或手机号" v-model.trim="searchForm.username" style="width: 150px;"></el-input>
        </el-form-item>
        <!--<el-form-item label="系统ID：">
          <el-select clearable filterable placeholder="系统ID" style="width: 160px;" v-model.trim="searchForm.appId" @change="getRoleList">
            <template v-if="clients.length>0">
              <el-option :key="'client' + item.id" :label="item.name" :value="item.appId" v-for="item in clients"></el-option>
            </template>
          </el-select>
        </el-form-item>-->
        <el-form-item label="账号类型：">
          <el-select clearable filterable placeholder="账号类型" style="width: 160px;" v-model.trim="searchForm.typeId">
            <template v-if="roles.length>0">
              <el-option :key="'roles' + item.id" :label="item.name" :value="item.id" v-for="item in roles"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色：">
          <el-select clearable filterable placeholder="系统角色" style="width: 160px;" v-model.trim="searchForm.roleId">
            <template v-if="sysroles.length>0">
              <el-option :key="'sysrole' + item.id" :label="item.name" :value="item.id" v-for="item in sysroles"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="get" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
         <div>
        <el-button type="primary"  @click="showAdd">新建</el-button>
        <el-button @click="batchConfigAuth">批量设置权限</el-button>
        <el-button @click="showCopyDialog">复制权限</el-button>
        <!--<el-button @click="deleteUsers">删除</el-button>-->
      </div>
      <yid-table pagination ref="userTable" style="margin-top: 15px;" @selection-change="handleSelectionChange">
        <el-table-column  type="selection"  width="55">
        </el-table-column>
        <yid-table-column label="用户名" min-width="140" prop="username">
          <template slot-scope="scope">
            <el-link type="primary" @click="showEdit(scope.row)">{{scope.row.username}}</el-link>
          </template>
        </yid-table-column>
        <yid-table-column label="昵称" min-width="80" prop="nickname"></yid-table-column>
        <yid-table-column label="手机号" min-width="120" prop="mobile"></yid-table-column>
        <yid-table-column label="关联微信id" min-width="130" prop="openId"></yid-table-column>
        <yid-table-column label="门店账号类型" width="110" prop="roleTypeName">
        </yid-table-column>
        <yid-table-column label="登陆门店" width="110" prop="loginShopList">
        </yid-table-column>
        <yid-table-column label="连锁系统角色" width="110" prop="roleName">
        </yid-table-column>
        <yid-table-column label="管理门店" width="110" prop="manageShopList">
        </yid-table-column>
        <yid-table-column label="状态" min-width="100" prop="enabled">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabled" inactive-color="#ff4949" @change="updateStatus(scope.row.enabled, scope.row.id)">
              </el-switch>
            </template>
        </yid-table-column>
        <yid-table-column label="创建日期" min-width="110" prop="createdTime">
          <template slot-scope="scope">
              {{$yid.util.formatDate(scope.row.createdTime)}}
          </template>
        </yid-table-column>
        <yid-table-column label="登录次数" min-width="100" prop="loginNum"></yid-table-column>
        <yid-table-column label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="resetPassword(scope.row.id)" type="text"><i class="edit"></i>重置密码</el-button>
            <el-button @click="configAuth(scope.row)" type="text"><i class="view"></i>设置门店权限</el-button>
          </template>
        </yid-table-column>
      </yid-table>

      <yid-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="cancel" width="550px">
        <el-form ref="userForm" :model="userForm" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '用户名不能为空'}]">
            <el-input  v-model="userForm.username" placeholder="姓名" :disabled="this.disabledvalue" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-alert
                    title="账号格式为：前缀（品牌名或店名）+10位以内字母或数字组合"
                    type="info"
                    :closable="closable"
                    show-icon>
            </el-alert>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" :rules="[{ required: true, message: '手机号不能为空'}]">
            <el-input type='number' v-model="userForm.mobile" placeholder="手机号" maxlength="11" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '密码不能为空'}]" v-show="!disabledvalue">
            <el-input clearable maxlength="20" placeholder="请输入密码" v-model.trim="userForm.password" show-password style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="员工信息" prop="eeInfo">
            <el-select value-key="id" clearable placeholder="请选择" style="width: 290px;" v-model.trim="userForm.eeInfo" @change="selectEmployee"
                       filterable :filter-method="filterEmployee" @clear="clearEmployee">
                <el-option :key="item.id" :label="item.eename+'（'+item.mobile+'）'" :value="item" v-for="item in filterEmployeeList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-alert
                    title="绑定员工信息卡APP端可查看个人业绩等明细，当绑定员工停职时账号可自动停用"
                    type="info"
                    :closable="closable"
                    show-icon>
            </el-alert>
          </el-form-item>
          <!--<el-form-item label="系统角色">
            <el-select clearable placeholder="请选择系统角色" style="width: 160px;" v-model.trim="dialog.model.role">
              <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in source.status"></el-option>
            </el-select>
          </el-form-item>-->

          <el-form-item label=" ">
            <el-button @click="cancel" type="info">取消</el-button>
            <el-button @click="saveUser" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </yid-dialog>

      <yid-dialog :title="copyDialog.title" :visible.sync="copyDialog.visible" @close="copyCancel" width="450px">
           <el-form :model="copyForm"  label-width="170px" ref="copyForm">
             <el-form-item label="从哪个账号复制：" prop="userId">
               <el-select clearable placeholder="请选择账号：" style="width: 200px;" v-model.trim="copyForm.userId"
                          filterable :filter-method="filterUser" @clear="clearUser">
                    <el-option :key="item.id" :label="item.username+'（'+item.mobile+'）'" :value="item.id" v-for="item in filterUserList"></el-option>
               </el-select>
             </el-form-item>

             <el-form-item label="">
               <el-button @click="copyCancel" type="info">取消</el-button>
               <el-button @click="copySave" type="primary">确定</el-button>
             </el-form-item>
           </el-form>
         </yid-dialog>

    </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!listShow">
        <authConfig :treeArr="treeArr" :userIds="userIds" @afterSave="save()" @afterCancel="cancelConfig()"/>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import authConfig from "./authConfig";
import {isEmpty} from "../../library/helper/validate";
/*import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.component('v-chart', ECharts);
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line';*/

export default {
    name: "manage",
    components: {
      authConfig
    },
    data() {
      return {
          multipleSelection: [],
          treeArr: [],
          userId: "",
          userIds: [],
          listShow: true,
          closable: false,
          copyDialog: {
            visible: false,
            title: '复制权限',
          },
          dialog: {
            visible: false,
            title: '新增渠道',
          },
          userForm: {
              username:'',
              mobile:'',
              password : '',
              eeInfo:{},
              role: '',
          },
          copyForm:{
              userId : '',
          },
          searchForm:{
              username : '',
              typeId : '',
              roleId:"",
          },
          roles: [],
          clients:[],
          sysroles:[],
          pageInfo:{
              page:0,
              limit:10
          },
          allEmployeeList:[],
          filterEmployeeList:[],
          allUserList:[],
          filterUserList:[],
          disabledvalue: false,
      }
    },

  mounted() {
      //获取角色
      this.getRoles();
      //系统ID
      this.getClients();
      //员工
      this.getEmployee();
      //所有账号
      this.getAllUser();
  },

  methods: {
    copyCancel() {
      this.copyDialog.visible = false;
    },
    showCopyDialog() {
        if(this.multipleSelection.length > 0) {
            this.copyDialog.visible = true;
        } else {
            yid.util.error("请至少勾选一项")
        }
    },
    deleteUsers() {
      const userObjs = [];
      if(this.multipleSelection.length > 0) {
        this.multipleSelection.map((item,index)=> {
            if(item.isAdmin=="1"){
                yid.util.error("第"+(index+1)+"行是超级管理员，不能删除");
                return
            }else{
                userObjs.push(item);
            }
        });
        if(userObjs.length>0) {
          service.user.batchDeleteForChain({sysUsers: this.multipleSelection}).then(res => {
             yid.util.alert(res.resp_msg);
             this.get();
          })
        }
      } else {
        yid.util.error("请至少勾选一项")
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },
    save() {
      //console.log('afterSAVE')
      this.listShow = true;

    },
    cancelConfig() {
      //console.log('aftercancel')
      this.listShow = true;
    },
    configAuth(row) {

      service.user.usermenus(row.id).then(res=> {
          if(res.resp_code == 200) {
              this.userIds = [];
              this.userIds.push(row.id);
              this.treeArr = res.data;
              this.listShow = false;
          }
      });
    },
      batchConfigAuth(){
          if(this.multipleSelection.length > 0) {
              let userIds = [];
              this.multipleSelection.map((item,index) => {
                  if(isEmpty(item.typeId)){
                      yid.util.error("第"+(index+1)+"行账户没有分配账号类型")
                      return
                  }else{
                      userIds.push(item.id);
                  }
              });
              if(userIds.length>0){
                  service.user.usermenusList(userIds).then(res=> {
                      if(res.resp_code == 200) {
                          this.userIds = userIds;
                          this.treeArr = res.data;
                          this.listShow = false;
                      }
                  });
              }

          } else {
              yid.util.error("请至少勾选一项")
          }
      },

    get() {
        this.pageInfo.page=1
        this.pageInfo.limit = this.$refs.userTable.Pagination.internalPageSize;
        const fetch = service.user.userlistForChain
        const params = {...this.pageInfo,...this.searchForm}
        this.$refs.userTable.reloadData({
            fetch,
            params,
        });
    },
    getRoles() {
      service.user.roles({}).then(res=> {
        console.log('roles', res.data);
        this.roles = res.data;
      });
    },
      getClients() {
          service.user.client().then(res=> {
              console.log('clients', res.data);
              this.clients = res.data;
          });
      },
      getRoleList(obj){
          this.sysroles = [];
          if(obj==""){
              return
          }
        service.user.getSysRole(obj).then(res=> {
            if(res.resp_code == 200) {
                this.sysroles = res.data;
            }
        })
      },
      getEmployee(){
          service.employee.chainListAll({isDel:'0',status:'1'}).then(res=> {
              if(res.resp_code == 200) {
                  this.filterEmployeeList = res.data;
                  this.allEmployeeList = Object.assign(this.filterEmployeeList);//保留原数据
              }
          })
      },
      filterEmployee(v){
          this.filterEmployeeList = this.allEmployeeList.filter(item => {
              // 如果直接包含输入值直接返回true
              if (item.eename.indexOf(v) !== -1) return true
              if (item.mobile.indexOf(v) !== -1) return true
          })
      },
      getAllUser(){
          service.user.chainListAll({id:null}).then(res=> {
              if(res.resp_code == 200) {
                  this.filterUserList = res.data;
                  this.allUserList = Object.assign(this.filterUserList);//保留原数据
              }
          })
      },
      filterUser(v){
          this.filterUserList = this.allUserList.filter(item => {
              // 如果直接包含输入值直接返回true
              if (item.username.indexOf(v) !== -1) return true
              if (item.mobile.indexOf(v) !== -1) return true
          })
      },
      getRoleTypeName(id){
          this.roles.map(item =>{
              if(id == item.id){
                  return item.name;
              }
          })
      },
    updateStatus(enabled, id) {
      let params = {enabled, id};
      service.user.updateEnabled(params).then(res=> {
         yid.util.alert(res.resp_msg);
      });
    },
    resetPassword(id) {
      yid.util.confirm('确定重置此用户的密码吗？', '','', ()=> {
        service.user.resetPassword(id).then(res=> {
           yid.util.alert(res.resp_msg);
        });
      })
    },
    showAdd() {
      this.dialog.visible = true
      this.dialog.title = '新建账号'
        this.userForm.id = "";
      this.userForm.username = "";
        this.userForm.mobile = "";
        this.userForm.password = "";
        this.userForm.eeInfo = null;
      this.disabledvalue = false;
    },
    showEdit(row){
          this.dialog.visible = true
          this.dialog.title = '编辑账号';
          this.userForm.id = row.id;
          this.userForm.username = row.username;
          this.userForm.mobile = row.mobile;
          this.userForm.password = row.password;
              this.userForm.eeInfo = null;
          this.allEmployeeList.forEach(res=>{
              if(Number(res.id) === Number(row.eeid)){
                  this.userForm.eeInfo = res;
                  return
              }
          });
          this.userForm.enabled = row.enabled;
          this.disabledvalue = true;
      },
    cancel() {
      this.dialog.visible = false
    },
      selectEmployee(){
          this.$forceUpdate();
      },
      clearEmployee(){
          this.userForm.eeInfo = null;
      },
      clearUser(){
          this.copyForm.userId = null;
      },
      saveUser(){
          this.$refs['userForm'].validate(valid => {
              if(valid){
                  if(!yid.validate.mobile(this.userForm.mobile)){
                      yid.util.error("手机号格式不正确");
                      return
                  }
                  if(this.userForm.eeInfo != null){
                      this.userForm.sex = this.userForm.eeInfo.sex;
                      this.userForm.shopid = this.userForm.eeInfo.shopid;
                      this.userForm.shopcode = this.userForm.eeInfo.shopcode;
                      this.userForm.shopname = this.userForm.eeInfo.shopname;
                      this.userForm.eeid = this.userForm.eeInfo.id;
                      this.userForm.eecode = this.userForm.eeInfo.eecode;
                      this.userForm.eename = this.userForm.eeInfo.eename;
                      this.userForm.nickname = this.userForm.eeInfo.nickname;
                  }else{
                      this.userForm.sex = "";
                      this.userForm.shopid = "";
                      this.userForm.shopcode = "";
                      this.userForm.shopname = "";
                      this.userForm.eeid = "";
                      this.userForm.eecode = "";
                      this.userForm.eename = "";
                      this.userForm.nickname = "";
                  }

                  console.log(this.userForm);

                  service.user.saveOrUpdateForChain(this.userForm).then(res =>{
                      if(res.resp_code == 200) {
                          yid.util.success("保存成功");
                          this.dialog.visible = false
                          this.get();
                      }
                  })
              }
          })
      },
      copySave(){
          if(this.copyForm.userId==''){
              yid.util.error("请选择账户")
              return
          }else{
              let userIds = [];
              this.multipleSelection.map(item => {
                  userIds.push(item.id);
              });
              let params = {
                  userIds: userIds,
                  copyUserId: this.copyForm.userId
              };
              service.user.batchCopyAuthForChain(params).then(res => {
                  if(res.resp_code == 200) {
                      yid.util.alert(res.resp_msg);
                      this.copyDialog.visible = false;
                  }
              })
          }

      },
  }
}
</script>

<style lang="scss" scoped>
 .sys-index {
  /deep/ .el-divider--horizontal {
      margin: 0;
   }
   .box-card {
      .item {
        .static {
          font-size: 25px;
          line-height: 27px;
        }
        .bottom {
           height: 30px;
           line-height: 30px;
           margin-top: 10px;
        }
      }
     .menu {
       display: flex;
       flex-wrap: wrap;
       .box {
          width: 80px;
          height: 90px;
          border: 1px solid #999;
          color: #999;
          margin-right: 20px;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          i {
            font-size: 40px;
            margin-bottom: 10px;
          }
       }
     }
   }
 }
</style>
