<template>
  <div class="sys-manage">
    <el-collapse-transition>
       <div class="sys-list" v-show="listShow">
      <el-form :model="model" inline>
        <el-form-item label="姓名或手机号">
          <el-input clearable placeholder="请输入姓名或手机号" v-model.trim="model.other" style="width: 180px;"></el-input>
        </el-form-item>
        <el-form-item label="系统角色：">
          <el-select clearable filterable placeholder="系统角色" style="width: 160px;" v-model.trim="model.role">
            <template v-if="roles.length>0">
              <el-option :key="'roles' + item.id" :label="item.name" :value="item.id" v-for="item in roles"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="get" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
         <div>
        <el-button type="primary"  @click="showAdd">新建</el-button>
<!--        <el-button @click="">批量设置权限</el-button>-->
        <el-button @click="showCopyDialog">复制权限</el-button>
        <el-button @click="deleteUsers">删除</el-button>
      </div>
      <yid-table pagination ref="table" style="margin-top: 15px;" @selection-change="handleSelectionChange">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <yid-table-column label="用户名" min-width="150" prop="username"></yid-table-column>
        <yid-table-column label="姓名" min-width="80" prop="nickname"></yid-table-column>
        <yid-table-column label="手机号" min-width="120" prop="mobile"></yid-table-column>
        <yid-table-column label="关联微信id" min-width="130" prop="openId"></yid-table-column>
        <yid-table-column label="系统角色" width="100" prop="roles">
          <template slot-scope="scope">
            {{scope.row.roles && scope.row.roles[0].name}}
          </template>
        </yid-table-column>
        <yid-table-column label="状态" min-width="100" prop="enabled">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabled" inactive-color="#ff4949" @change="updateStatus(scope.row.enabled, scope.row.id)">
              </el-switch>
  <!--            <div>-->
  <!--              <span :class="{ disable: scope.row.status, enable: !scope.row.status }" class="circle"></span>-->
  <!--              <span>{{ formatStatus(scope.row.status) }}</span>-->
  <!--            </div>-->
            </template>
        </yid-table-column>
        <yid-table-column label="创建日期" min-width="110" prop="createTime">
          <template slot-scope="scope">
              {{$yid.util.formatDate(scope.row.createTime)}}
          </template>
        </yid-table-column>
        <yid-table-column label="登录次数" min-width="100" prop="loginTimes"></yid-table-column>
        <yid-table-column label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="resetPassword(scope.row.id)" type="text"><i class="edit"></i>重置密码</el-button>
            <el-button @click="configAuth(scope.row.id)" type="text"><i class="view"></i>设置权限</el-button>
          </template>
        </yid-table-column>
      </yid-table>

      <yid-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="cancel" width="550px">
        <el-form :model="dialog.model" :rules="dialog.rules" label-width="80px" ref="form">
          <el-form-item label="用户名">
              leejee
          </el-form-item>
          <el-form-item>
            <el-alert
                    title="账号格式为：前缀（品牌名或店名）+10位以内字母或数字组合"
                    type="info"
                    :closable="closable"
                    show-icon>
            </el-alert>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input clearable maxlength="20" placeholder="请输入密码" v-model.trim="dialog.model.password" style="width: 200px;"></el-input>
          </el-form-item>

          <el-form-item label="系统角色">
            <el-select clearable placeholder="请选择系统角色" style="width: 160px;" v-model.trim="dialog.model.role">
  <!--            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in source.status"></el-option>-->
            </el-select>
          </el-form-item>

          <el-form-item label="员工信息" prop="info">
            <el-select clearable placeholder="请选择员工信息" style="width: 160px;" v-model.trim="dialog.model.info">
  <!--            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in source.status"></el-option>-->
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <el-button @click="cancel" type="info">取消</el-button>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </yid-dialog>
      <yid-dialog :title="copyDialog.title" :visible.sync="copyDialog.visible" @close="copyCancel" width="450px">
           <el-form :model="copyDialog.model"  label-width="170px" ref="copyForm">
             <el-form-item label="从哪个账号复制：">
               <el-select clearable placeholder="请选择系统角色：" style="width: 200px;" v-model.trim="dialog.model.role">
                 <!--            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in source.status"></el-option>-->
               </el-select>
             </el-form-item>

             <el-form-item label="请选择要复制的权限：" prop="info">
               <el-select clearable placeholder="请选择员工信息" style="width: 200px;" v-model.trim="dialog.model.info">
                 <!--            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in source.status"></el-option>-->
               </el-select>
             </el-form-item>

             <el-form-item label="">
               <el-button @click="copyCancel" type="info">取消</el-button>
               <el-button type="primary">确定</el-button>
             </el-form-item>
           </el-form>
         </yid-dialog>
    </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!listShow">
        <authConfig :treeArr="treeArr" :userId="userId" @afterSave="save()" @afterCancel="cancelConfig()"/>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import yid from '@src/library'

import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import service from '@src/service'
Vue.use(VueClipboard)

import ECharts from 'vue-echarts';

import 'echarts/lib/chart/bar';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line';
import authConfig from "./authConfig";
Vue.component('v-chart', ECharts);
export default {
  components: {
    authConfig
  },
  data() {
    return {
      multipleSelection: [],
      treeArr: [],
      userId: 0,
      listShow: true,
      closable: false,
      copyDialog: {
        visible: false,
        title: '复制权限',
      },
      dialog: {
        visible: false,
        title: '新增渠道',
        model: {
          password : '',
          role: '',
          info: ''
        }
      },
      model:{
        other : '',
        typeId : '',
        page: 1,
        limit: 10
      },
      roles: [
      ]
    }
  },

  created() {

  },

  mounted() {
    this.get()
  },

  methods: {
    copyCancel() {
      this.copyDialog.visible = false;
    },
    showCopyDialog() {
      this.copyDialog.visible = true;
    },
    deleteUsers() {
      let ids = [];
      if(this.multipleSelection.length > 0) {
        this.multipleSelection.map(item=> {
          ids.push(item.id);
        });
        if(ids.length>0) {
          service.user.deleteUsers({data: ids}).then(res => {
             $yid.util.alert(res.resp_msg);
             this.get();
          })
        }
      } else {
        $yid.util.warning("请至少勾选一项")
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
    configAuth(id) {
      this.listShow = false;
      service.user.usermenus(id).then(res=> {
         this.treeArr = res.data;
         this.userId = id;
      });
    },
    get() {
      const fetch = service.user.userList
      const params = this.model
      this.$refs.table.reloadData({
        fetch,
        params
      });
      //获取角色
      this.getRoles();
    },
    getRoles() {
      service.user.roles({}).then(res=> {
        console.log('roles', res.data);
        this.roles = res.data;
      });
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
      this.$nextTick(function() {
        //this.dialog.model = yid.util.deepClone(this.dialog.modelCache)
      })
    },
    cancel() {
      this.dialog.visible = false
      //this.$refs.form.resetFields()
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
