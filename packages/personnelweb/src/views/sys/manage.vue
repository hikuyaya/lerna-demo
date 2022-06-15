<template>
  <div class="sys-manage">
    <el-collapse-transition>
      <div class="sys-list" v-show="listShow">
        <el-form :model="searchForm" ref="searchForm" inline>
          <el-form-item label="用户名：">
            <el-input
              clearable
              placeholder="用户名"
              v-model.trim="searchForm.username"
              style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="员工">
            <el-input
              clearable
              placeholder="员工编码/姓名/手机号"
              v-model.trim="searchForm.nickname"
              style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="系统角色：">
            <el-select
              clearable
              multiple
              placeholder="请选择"
              v-model.trim="searchForm.roleIds"
              filterable
              :filter-method="filterRole"
              style="width: 280px">
              <el-option
                :key="'roleId' + item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in filterRoleList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否校验登录：">
            <el-select
              clearable
              placeholder="请选择"
              v-model.trim="searchForm.ismac"
              style="width: 150px">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可登录门店：">
            <el-select
              clearable
              placeholder="请选择"
              v-model.trim="searchForm.shoptype"
              style="width: 150px"
              @change="shopcodeChange">
              <el-option label="无可登录门店" value="3"></el-option>
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option> </el-select
            >&nbsp;&nbsp;
            <el-input
              v-show="showShopcodename"
              clearable
              placeholder="请输入门店编码或名称"
              v-model.trim="searchForm.shopcodename"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              clearable
              placeholder="请选择状态"
              v-model.trim="searchForm.enabled"
              style="width: 150px">
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="get" type="primary">查询</el-button>
            <el-button @click="reset" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="showAdd">新建</el-button>
          <el-button @click="batchConfigRole">批量设置角色</el-button>
          <el-button @click="batchDeleteUsers">批量删除</el-button>
        </div>
        <yid-table
          pagination
          ref="userTable"
          :data="userData"
          style="margin-top: 15px"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <yid-table-column label="用户名" min-width="90" prop="username">
            <template slot-scope="scope">
              <el-link type="primary" @click="showEdit(scope.row)">{{
                scope.row.username
              }}</el-link>
            </template>
          </yid-table-column>
          <yid-table-column
            label="姓名"
            min-width="70"
            prop="nickname"></yid-table-column>
          <yid-table-column
            label="手机号"
            min-width="100"
            prop="mobile"></yid-table-column>
          <yid-table-column label="账号角色" width="180" prop="roleName">
            <template slot-scope="scope">
              <span v-if="scope.row.menus.length > 0"
                ><el-link type="primary" @click="showUserMenu(scope.row)"
                  >特</el-link
                ></span
              >
              <span style="margin-left: 10px">{{ scope.row.roleName }}</span>
            </template>
          </yid-table-column>
          <yid-table-column label="可登陆门店" width="190" prop="shopname">
            <template slot-scope="scope">
              <span>{{ scope.row.shopname }}</span>
              <span style="margin-left: 10px"
                ><el-link type="primary" @click="showLoginShop(scope.row)"
                  >设置</el-link
                ></span
              >
            </template>
          </yid-table-column>
          <yid-table-column label="是否校验登录" min-width="70" prop="ismac">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.ismac"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                @change="updateIsmac(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="创建日期" min-width="100" prop="createdTime">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column label="状态" min-width="70" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                inactive-color="#DCDFE6"
                @change="updateStatus(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="登录设备" min-width="70" prop="lastDevice">
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.lastDevice"
                class="item"
                effect="dark"
                :content="scope.row.lastDevice"
                placement="top">
                <el-link
                  :data-clipboard-text="scope.row.lastDevice"
                  class="copymac"
                  type="primary"
                  @click="copymac"
                  >复制
                </el-link>
              </el-tooltip>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="90" fixed="right">
            <template slot-scope="scope">
              <el-button @click="resetPassword(scope.row)" type="text"
                ><i class="edit"></i>重置密码
              </el-button>
              <el-button @click="openManageDialog(scope.row)" type="text"
                ><i class="edit"></i>数据查看管理
              </el-button>
            </template>
          </yid-table-column>
        </yid-table>

        <yid-dialog
          :title="dialog.title"
          :visible.sync="dialog.visible"
          @close="cancel"
          width="700px">
          <el-form ref="userForm" :model="userForm" label-width="80px">
            <el-form-item
              label="用户名"
              prop="username"
              :rules="[{ required: true, message: '用户名不能为空' }]">
              <el-input
                v-model="userForm.username"
                placeholder="请输入用户名"
                :disabled="this.disabledvalue"
                maxlength="13"
                show-word-limit
                @input="checkUsername"
                style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-alert
                title="请输入13位以内的字母或数字组合"
                type="info"
                :closable="false"
                show-icon>
              </el-alert>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
              :rules="[{ required: true, message: '密码不能为空' }]"
              v-show="!disabledvalue">
              <el-input
                clearable
                maxlength="20"
                placeholder="请输入密码"
                v-model.trim="userForm.password"
                show-password
                style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="系统角色" prop="roleIds">
              <el-select
                clearable
                multiple
                placeholder="请选择"
                v-model.trim="userForm.roleIds"
                filterable
                :filter-method="filterRole2"
                style="width: 300px">
                <el-option
                  :key="'roleId2' + item.id"
                  :label="item.name"
                  :value="item.id"
                  v-for="item in filterRoleList2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="特色权限">
              <span
                ><el-link type="primary" @click="editUserMenu()"
                  >设置</el-link
                ></span
              >
            </el-form-item>
            <el-form-item
              label="使用人"
              prop="nickname"
              :rules="[{ required: true, message: '使用人不能为空' }]">
              <el-input
                v-model="userForm.nickname"
                placeholder="请输入使用人"
                @input="checkEename"
                style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="员工信息" prop="eeInfo">
              <span v-if="userForm.eeInfo != null" style="margin-right: 7px"
                >{{ userForm.eeInfo.eename }}&nbsp;&nbsp;{{
                  userForm.eeInfo.mobile
                }}
              </span>
              <span v-if="userForm.eeInfo != null"
                ><el-link
                  type="primary"
                  @click="editBindEmployee(userForm.eeid)"
                  >修改</el-link
                ></span
              >
              <span v-if="userForm.eeInfo != null" style="margin-left: 20px"
                ><el-link type="primary" @click="clearEmployee()"
                  >解绑员工</el-link
                ></span
              >
              <span v-if="userForm.eeInfo == null"
                ><el-link type="primary" @click="editBindEmployee('0')"
                  >绑定员工</el-link
                ></span
              >
              <!--<el-select value-key="id" clearable placeholder="请选择" style="width: 300px;" v-model.trim="userForm.eeInfo"
                                       filterable :filter-method="filterEmployee" @clear="clearEmployee" @change="getEeShop">
                                <el-option :key="'emp'+item.id" :label="item.eename+'（'+item.mobile+'）'" :value="item" v-for="item in filterEmployeeList"></el-option>
                            </el-select>-->
            </el-form-item>
            <el-form-item>
              <el-alert
                title="绑定员工信息后，APP端可查看个人业绩等明细，当绑定员工停职时账号可自动停用"
                type="info"
                :closable="false"
                show-icon>
              </el-alert>
            </el-form-item>
            <el-form-item label="登录门店">
              <span style="margin-right: 7px">{{ userForm.shopname }} </span>
              <span
                ><el-link type="primary" @click="editLoginShop(userForm.shopid)"
                  >设置</el-link
                ></span
              >
            </el-form-item>
            <el-form-item label="校验登录" prop="ismac">
              <el-select
                placeholder="请选择"
                v-model.trim="userForm.ismac"
                style="width: 150px">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" ">
              <el-button @click="cancel" type="info">取消</el-button>
              <el-button @click="saveUser" type="primary">保存</el-button>
            </el-form-item>
          </el-form>
        </yid-dialog>

        <yid-dialog
          :title="roleDialog.title"
          :visible.sync="roleDialog.visible"
          @close="roleCancel"
          width="550px">
          <el-form
            :model="roleForm"
            ref="roleForm"
            :inline="true"
            class="demo-form-inline"
            style="margin-top: 20px">
            <el-form-item label="设定对象" prop="userIds">
              <el-select
                multiple
                placeholder="请选择账号："
                style="width: 350px"
                v-model.trim="roleForm.userIds"
                disabled
                filterable
                :filter-method="filterUser">
                <el-option
                  :key="'user' + item.id"
                  :label="item.username"
                  :value="item.id"
                  v-for="item in filterUserList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="系统角色" prop="roleIds">
              <el-select
                clearable
                multiple
                placeholder="请选择"
                v-model.trim="roleForm.roleIds"
                filterable
                :filter-method="filterRole3"
                style="width: 350px">
                <el-option
                  :key="'roleId3' + item.id"
                  :label="item.name"
                  :value="item.id"
                  v-for="item in filterRoleList3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="roleCancel"
                type=""
                size="mini"
                style="margin-left: 150px"
                >取消</el-button
              >
              <el-button @click="batchSaveRole" type="primary" size="mini"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </yid-dialog>

        <yid-dialog
          :title="pwdDialog.title"
          :visible.sync="pwdDialog.visible"
          @close="pwdCancel"
          width="550px">
          <el-form
            :model="pwdForm"
            ref="pwdForm"
            :inline="true"
            class="demo-form-inline"
            style="margin-top: 20px">
            <el-form-item
              label="新密码"
              prop="password"
              :rules="[{ required: true, message: '密码不能为空' }]">
              <el-input
                clearable
                maxlength="20"
                placeholder="请输入密码"
                v-model.trim="pwdForm.password"
                show-password
                style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="pwdCancel"
                type=""
                size="mini"
                style="margin-left: 150px"
                >取消</el-button
              >
              <el-button @click="savePwd" type="primary" size="mini"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </yid-dialog>

        <yid-dialog
          :title="menuDialog.title"
          :visible.sync="menuDialog.visible"
          @close="menuCancel"
          width="600px">
          <div class="auth-config">
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="margin-top: 20px">
              <el-form-item label="">
                <el-dropdown @command="addAuthMenu">
                  <span class="el-dropdown-link">
                    <el-button type="primary" icon="el-icon-circle-plus-outline"
                      >添加菜单</el-button
                    >
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :command="item"
                      v-for="item in authMenu"
                      :key="'menu' + item.id"
                      >{{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
              <el-form-item>
                <el-button
                  @click="selectAll"
                  type="primary"
                  size="mini"
                  style="margin-left: 40px"
                  >全选
                </el-button>
                <el-button @click="selectReverse" type="primary" size="mini"
                  >反选</el-button
                >
                <el-button @click="unSelectAll" type="primary" size="mini"
                  >取消</el-button
                >
                <el-button
                  @click="saveMenuConfig"
                  type="primary"
                  size="mini"
                  style="margin-left: 50px">
                  保存
                </el-button>
              </el-form-item>
            </el-form>
            <el-tabs
              v-model="activeTab"
              type="card"
              closable
              @tab-remove="removeTab"
              @tab-click="clickTab">
              <el-tab-pane
                v-for="(item, index) in treeData"
                :key="item.name"
                :label="item.name"
                :name="item.name">
                <el-tree
                  :data="item.menus"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :ref="'tree' + index"
                  highlight-current
                  :default-checked-keys="item.checks"
                  :props="defaultProps2"
                  :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="data.senauth == '1'" style="color: red">{{
                      node.label
                    }}</span>
                    <span v-if="data.senauth == '0'">{{ node.label }}</span>
                  </span>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </yid-dialog>

        <yid-dialog
          :title="shopDialog.title"
          :visible.sync="shopDialog.visible"
          @close="shopCancel"
          width="800px">
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
                  clearable
                  v-model="shopDialog.region"
                  style="width: 160px">
                  <el-option
                    v-for="item in regions"
                    :label="item.name"
                    :value="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店品牌：">
                <el-select clearable v-model="shopDialog.brand">
                  <el-option
                    v-for="item in brands"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="queryShop()">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col>
              <yid-table
                pagination
                ref="tableShop"
                :data="shopData"
                :header-cell-class-name="cellClass"
                style="margin-top: 10px"
                @select="handleSelectionChange2"
                :row-key="getRowKey"
                class="store-table">
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
          </el-row>
          <el-row justify="space-between" style="margin-top: 10px">
            <el-col>
              <el-button
                type="primary"
                @click="saveShop()"
                style="margin-left: 300px"
                >保存</el-button
              >
              <el-button @click="shopCancel">取消</el-button>
            </el-col>
          </el-row>
        </yid-dialog>

        <yid-dialog
          :title="shopDialog2.title"
          :visible.sync="shopDialog2.visible"
          @close="shopCancel2"
          width="800px">
          <el-row type="flex" justify="space-between">
            <el-form inline>
              <el-form-item label="门店：">
                <el-input
                  clearable
                  v-model="shopDialog2.shop"
                  placeholder="门店名称/编码"
                  style="width: 160px"></el-input>
              </el-form-item>
              <el-form-item label="业务类型：">
                <el-select clearable v-model="shopDialog2.type">
                  <el-option label="美发" value="1"></el-option>
                  <el-option label="美容" value="2"></el-option>
                  <el-option label="综合" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="区域：">
                <el-select
                  clearable
                  v-model="shopDialog2.region"
                  style="width: 160px">
                  <el-option
                    v-for="item in regions"
                    :label="item.name"
                    :value="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店品牌：">
                <el-select clearable v-model="shopDialog2.brand">
                  <el-option
                    v-for="item in brands"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="queryShop()">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col>
              <yid-table
                pagination
                ref="tableShop2"
                :data="shopData2"
                :header-cell-class-name="cellClass"
                style="margin-top: 10px"
                @select="handleSelectionChange3"
                :row-key="getRowKey"
                class="store-table">
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
          </el-row>
          <el-row justify="space-between" style="margin-top: 10px">
            <el-col>
              <el-button
                type="primary"
                @click="saveShop2()"
                style="margin-left: 300px"
                >保存</el-button
              >
              <el-button @click="shopCancel2">取消</el-button>
            </el-col>
          </el-row>
        </yid-dialog>

        <yid-dialog
          :title="eeDialog.title"
          :visible.sync="eeDialog.visible"
          @close="eeCancel"
          width="800px">
          <el-row type="flex" justify="space-between">
            <el-form inline>
              <el-form-item label="门店：">
                <el-input
                  clearable
                  v-model="eeDialog.shop"
                  placeholder="门店名称/编码"
                  style="width: 160px"></el-input>
              </el-form-item>
              <el-form-item label="员工：">
                <el-input
                  clearable
                  placeholder="员工编码/姓名/手机号"
                  v-model.trim="eeDialog.eename"
                  style="width: 190px"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="queryEmployee()"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col>
              <yid-table
                pagination
                ref="tableEmployee"
                :data="employeeData"
                :header-cell-class-name="cellClass"
                style="margin-top: 10px"
                @select="handleSelectionEmployeeChange"
                class="store-table">
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
                  label="员工编码"
                  min-width="60"
                  prop="eecode"></yid-table-column>
                <yid-table-column
                  label="员工姓名"
                  min-width="120"
                  prop="eename"></yid-table-column>
                <yid-table-column
                  label="手机号"
                  min-width="90"
                  prop="mobile"></yid-table-column>
              </yid-table>
            </el-col>
          </el-row>
          <el-row justify="space-between" style="margin-top: 10px">
            <el-col>
              <el-button
                type="primary"
                @click="saveBindEe"
                style="margin-left: 300px"
                >保存</el-button
              >
              <el-button @click="eeCancel">取消</el-button>
            </el-col>
          </el-row>
        </yid-dialog>

        <yid-dialog
          :title="manageData.title"
          :visible.sync="manageData.visible"
          @close="manageData.visible = false"
          width="800px">
          <el-row type="flex" justify="space-between">
            <el-form style="width: 600px">
              <el-form-item label="员工编码/姓名：">
                <el-label
                  >{{ manageData.eecode }} / {{ manageData.eename }}</el-label
                >
              </el-form-item>
              <el-form-item label="所在组织机构：">
                <el-label
                  >{{ manageData.orgcode }} {{ manageData.orgname }}</el-label
                >
              </el-form-item>
              <el-form-item label="数据查看范围">
                <el-button type="primary" @click="selectOrgs()"
                  >选择组织机构</el-button
                >
                <el-button type="primary" @click="selectShops()"
                  >选择门店</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col>
              <yid-table
                ref="tableOrg"
                :data="manageData.orgs"
                :header-cell-class-name="cellClass"
                style="margin-top: 10px"
                @select="handleSelectionEmployeeChange"
                class="store-table">
                <yid-table-column
                  label="机构编码"
                  min-width="60"
                  prop="orgcode"></yid-table-column>
                <yid-table-column
                  label="机构名称"
                  min-width="80"
                  prop="orgname"></yid-table-column>
                <yid-table-column label="操作" min-width="50">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="deleteOrg(scope.row)"
                      >删除</el-link
                    >
                  </template>
                </yid-table-column>
              </yid-table>
              <yid-table
                ref="tableShop"
                :data="manageData.shops"
                :header-cell-class-name="cellClass"
                style="margin-top: 10px"
                @select="handleSelectionEmployeeChange"
                class="store-table">
                <yid-table-column
                  label="门店编码"
                  min-width="60"
                  prop="orgcode"></yid-table-column>
                <yid-table-column
                  label="门店名称"
                  min-width="80"
                  prop="orgname"></yid-table-column>
                <yid-table-column label="操作" min-width="50">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="deleteShop(scope.row)"
                      >删除</el-link
                    >
                  </template>
                </yid-table-column>
              </yid-table>
            </el-col>
          </el-row>
          <el-row justify="space-between" style="margin-top: 10px">
            <el-col>
              <el-button
                type="primary"
                @click="saveManageData()"
                style="margin-left: 300px"
                >保存
              </el-button>
              <el-button @click="manageData.visible = false">取消</el-button>
            </el-col>
          </el-row>
        </yid-dialog>

        <yid-dialog
          :title="orgDialog.title"
          :visible.sync="orgDialog.visible"
          @close="orgDialog.visible = false"
          width="600px">
          <el-row type="flex" justify="space-between">
            <el-form inline>
              <el-form-item label="组织机构：">
                <el-input
                  clearable
                  v-model="orgDialog.codename"
                  placeholder="组织机构编码/名称"
                  style="width: 180px"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="queryOrgs()">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col>
              <yid-table
                pagination
                ref="tableOrg"
                :data="orgDialog.data"
                style="margin-top: 10px"
                @selection-change="mutlselectOrg">
                <el-table-column type="selection" width="55"></el-table-column>
                <yid-table-column
                  label="机构编码"
                  min-width="60"
                  prop="code"></yid-table-column>
                <yid-table-column
                  label="机构名称"
                  min-width="100"
                  prop="name"></yid-table-column>
              </yid-table>
            </el-col>
          </el-row>
          <el-row justify="space-between" style="margin-top: 10px">
            <el-col>
              <el-button
                type="primary"
                @click="saleOrgs()"
                style="margin-left: 300px"
                >保存</el-button
              >
              <el-button @click="orgDialog.visible = false">取消</el-button>
            </el-col>
          </el-row>
        </yid-dialog>

        <yid-dialog
          :title="shopDialog3.title"
          :visible.sync="shopDialog3.visible"
          @close="shopDialog3.visible = false"
          width="800px">
          <el-row type="flex" justify="space-between">
            <el-form inline>
              <el-form-item label="门店：">
                <el-input
                  clearable
                  v-model="shopDialog3.shop"
                  placeholder="门店名称/编码"
                  style="width: 160px"></el-input>
              </el-form-item>
              <el-form-item label="业务类型：">
                <el-select clearable v-model="shopDialog3.type">
                  <el-option label="美发" value="1"></el-option>
                  <el-option label="美容" value="2"></el-option>
                  <el-option label="综合" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="区域：">
                <el-select
                  clearable
                  v-model="shopDialog3.region"
                  style="width: 160px">
                  <el-option
                    v-for="item in regions"
                    :label="item.name"
                    :value="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店品牌：">
                <el-select clearable v-model="shopDialog3.brand">
                  <el-option
                    v-for="item in brands"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="queryShop()">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col>
              <yid-table
                pagination
                ref="tableShop3"
                :data="shopData3"
                style="margin-top: 10px"
                @selection-change="mutlselectShops"
                :row-key="getRowKey">
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
          </el-row>
          <el-row justify="space-between" style="margin-top: 10px">
            <el-col>
              <el-button
                type="primary"
                @click="saleShops()"
                style="margin-left: 300px"
                >保存</el-button
              >
              <el-button @click="shopDialog3.visible = false">取消</el-button>
            </el-col>
          </el-row>
        </yid-dialog>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import { isEmpty } from '../../library/helper/validate'
import Clipboard from 'clipboard'

export default {
  name: 'manage',
  components: {},
  data() {
    return {
      eeDialog: {
        visible: false,
        title: '选择员工',
        shop: '',
        eename: '',
        eeid: '',
        page: 1,
        limit: 10
      },
      multipleSelection: [],
      treeArr: [],
      userId: '',
      userIds: [],
      listShow: true,
      closable: false,
      shopDialog: {
        visible: false,
        title: '设置门店',
        type: '0',
        uid: '',
        id: '',
        username: '',
        spname: '',
        shop: '',
        type: '',
        eename: '',
        brandId: '',
        region: '',
        shoplist: [],
        status: '1',
        page: 1,
        limit: 10
      },
      shopDialog2: {
        visible: false,
        title: '设置门店',
        type: '0',
        uid: '',
        id: '',
        spname: '',
        shop: '',
        type: '',
        eename: '',
        brandId: '',
        region: '',
        shoplist: [],
        status: '1',
        page: 1,
        limit: 10
      },
      dialog: {
        visible: false,
        title: '新增账号'
      },
      userForm: {
        roleId: '',
        roleIds: [],
        id: '',
        username: '',
        nickname: '',
        mobile: '',
        password: '',
        sex: '',
        eeInfo: null,
        role: '',
        headImgUrl: '',
        isUserType: false,
        isUserRole: false,
        typeId: '',
        userMenus: [],
        userMenus2: [],
        menus: [],
        menuChecked: false,
        shopid: '',
        shopname: '',
        shopcode: '',
        eename: '',
        ismac: '1'
      },
      searchForm: {
        username: '',
        nickname: '',
        roleIds: '',
        ismac: '',
        shoptype: '',
        shopcodename: '',
        enabled: ''
      },
      pageInfo: {
        page: 1,
        limit: 10
      },
      allEmployeeList: [],
      filterEmployeeList: [],
      allRoleList: [],
      filterRoleList: [],
      filterRoleList2: [],
      filterRoleList3: [],
      allUserList: [],
      filterUserList: [],
      disabledvalue: false,
      shopTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'shopname'
      },
      roleDialog: {
        visible: false,
        title: '批量设置角色'
      },
      roleForm: {
        userIds: [],
        roleIds: []
      },
      pwdDialog: {
        visible: false,
        title: '重置密码'
      },
      pwdForm: {
        id: '',
        username: '',
        password: ''
      },
      menuDialog: {
        visible: false,
        title: '设置特殊权限',
        showEdit: false
      },
      menuForm: {
        userId: '',
        appId: [],
        menuId: []
      },
      bindedEeidList: [],
      shopMenu: [],
      isSelected: false,
      treeData: [],
      selectIndex: 0,
      existMenu: [],
      authMenu: [],
      activeTab: '',
      defaultProps2: {
        children: 'subMenus',
        label: 'name'
      },
      tabIndex: 1,
      selectShop: null,
      brands: [],
      regions: [],
      shopData: [],
      shopData2: [],
      shopData3: [],
      types: [
        { name: '美发', value: '1' },
        { name: '美容', value: '2' },
        { name: '综合', value: '3' }
      ],
      selectEmployee: null,
      employeeData: [],
      userData: [],
      showShopcodename: false,
      orgData: [],
      manageData: {
        visible: false,
        title: '数据查看管理',
        eeid: '',
        eecode: '',
        eename: '',
        orgcode: '',
        orgname: '',
        shops: [],
        orgs: []
      },
      orgDialog: {
        visible: false,
        title: '选择组织机构',
        codename: '',
        page: 1,
        limit: 10,
        data: [],
        select: []
      },
      shopDialog3: {
        visible: false,
        title: '设置门店',
        type: '0',
        uid: '',
        id: '',
        spname: '',
        shop: '',
        type: '',
        eename: '',
        brandId: '',
        region: '',
        shoplist: [],
        status: '1',
        page: 1,
        limit: 10,
        select: []
      }
    }
  },

  mounted() {
    //获取系统角色
    this.getRoles()
    //系统ID
    this.getClients()
    //菜单
    this.getAllMenu()

    this.getBrand()
    this.getRegion()
    this.get()
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
    copymac() {
      let clipboard = new Clipboard('.copymac')
      clipboard.on('success', e => {
        console.log('复制成功')
        //  释放内存
        clipboard.destory()
      })
      clipboard.on('error', e => {
        // 不支持复制
        console.log('该浏览器不支持复制')
        // 释放内存
        clipboard.destory()
      })
    },
    getRowKey(row) {
      return row.id
    },
    getBrand() {
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        this.brandData = res.data
        res.data.forEach(each => {
          each.flag = false
        })
        this.brands = res.data
      })
    },
    getRegion() {
      service.chain.servShop
        .findregions({ status: '1', parentId: '-1' })
        .then(res => {
          this.regions = res.data
        })
    },
    reset() {
      this.searchForm.username = ''
      this.searchForm.nickname = ''
      this.searchForm.roleIds = []
      this.searchForm.ismac = ''
      this.searchForm.shoptype = ''
      this.searchForm.shopcodename = ''
      this.searchForm.enabled = ''
      this.get()
    },
    get() {
      let requestObj = {}
      let id = ''
      if (this.searchForm.roleIds.length > 0) {
        this.searchForm.roleIds.map(item => {
          id += item + ','
        })
        if (id.length > 0) {
          id = id.substr(0, id.length - 1)
        }
      }
      requestObj.username = this.searchForm.username
      requestObj.nickname = this.searchForm.nickname
      requestObj.ismac = this.searchForm.ismac
      requestObj.roleIds = id
      requestObj.shoptype = this.searchForm.shoptype
      requestObj.shopcodename = this.searchForm.shopcodename
      requestObj.enabled = this.searchForm.enabled
      //查询用户
      const fetch = service.user.userlistForChain
      const params = { ...this.pageInfo, ...requestObj }
      this.$refs.userTable.reloadData({
        fetch,
        params
      })
    },
    getAllMenu() {
      service.sysMenu.getAllMenus({ notApp: 'shop_wxapp' }).then(res => {
        if (res.resp_code == '200') {
          this.shopMenu = res.data.shopMenu
        }
      })
    },
    getRoles() {
      service.sysRole.getSysRoleList().then(res => {
        if (res.resp_code == '200') {
          this.filterRoleList = res.data
          this.filterRoleList2 = res.data
          this.filterRoleList3 = res.data
          this.allRoleList = Object.assign(this.filterRoleList) //保留原数据
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    roleCancel() {
      this.roleDialog.visible = false
    },
    pwdCancel() {
      this.$refs['pwdForm'].resetFields()
      this.pwdDialog.visible = false
    },
    menuCancel() {
      this.menuDialog.visible = false
    },
    shopCancel() {
      this.shopDialog.visible = false
      this.shopDialog.uid = ''
      this.selectShop = null
    },
    shopCancel2() {
      this.shopDialog2.visible = false
      this.shopDialog2.uid = ''
      this.selectShop = null
    },
    eeCancel() {
      this.eeDialog.visible = false
      this.selectEmployee = null
    },
    deleteUsers() {
      const userObjs = []
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.map((item, index) => {
          if (item.isAdmin == '1') {
            yid.util.error('第' + (index + 1) + '行是超级管理员，不能删除')
            return
          } else {
            userObjs.push(item)
          }
        })
        if (userObjs.length > 0) {
          service.user
            .batchDeleteForChain({ sysUsers: this.multipleSelection })
            .then(res => {
              yid.util.alert(res.resp_msg)
              this.get()
            })
        }
      } else {
        yid.util.error('请至少勾选一项')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
    },
    handleSelectionChange2(selection, row) {
      console.log(row)
      this.selectShop = row
      this.$refs['tableShop'].clearSelection()
      this.$refs['tableShop'].toggleRowSelection(row)
    },
    handleSelectionChange3(selection, row) {
      console.log(row)
      this.selectShop = row
      this.$refs['tableShop2'].clearSelection()
      this.$refs['tableShop2'].toggleRowSelection(row)
    },
    handleSelectionEmployeeChange(selection, row) {
      this.selectEmployee = row
      this.$refs['tableEmployee'].clearSelection()
      this.$refs['tableEmployee'].toggleRowSelection(row)
    },
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1
      }
    },
    batchConfigRole() {
      if (this.multipleSelection.length > 0) {
        this.roleDialog.visible = true
        this.roleDialog.title = '批量设置角色'

        this.filterUserList = this.multipleSelection
        this.allUserList = Object.assign(this.filterUserList) //保留原数据

        let userIds = []
        this.multipleSelection.map((item, index) => {
          userIds.push(item.id + '')
        })
        this.roleForm.userIds = userIds
        this.roleForm.roleIds = []
      } else {
        yid.util.error('请至少勾选一项')
      }
    },
    batchSaveRole() {
      let roleIds = this.roleForm.roleIds
      if (roleIds.length > 0) {
        service.user.batchSaveUserRole(this.roleForm).then(res => {
          if (res.resp_code == '200') {
            yid.util.success('操作成功')
            this.get()
            this.roleDialog.visible = false
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      } else {
        yid.util.error('请至少选择一项')
      }
    },
    resetPassword(row) {
      this.pwdDialog.visible = true
      this.pwdDialog.title = '重置密码'
      this.pwdForm.id = row.id
      this.pwdForm.username = row.username
      this.pwdForm.password = ''
    },
    savePwd() {
      service.user.resetPassword(this.pwdForm).then(res => {
        if (res.resp_code == '200') {
          yid.util.success('操作成功')
          //this.get();
          this.$refs['pwdForm'].resetFields()
          this.pwdDialog.visible = false
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    batchDeleteUsers() {
      if (this.multipleSelection.length > 0) {
        let userIds = []
        this.multipleSelection.map((item, index) => {
          userIds.push(item.id)
        })
        if (userIds.length > 0) {
          service.user.deleteUsers(userIds).then(res => {
            if (res.resp_code == '200') {
              yid.util.success('删除成功！')
              this.get()
            }
          })
        }
      } else {
        yid.util.error('请至少勾选一项')
      }
    },
    getClients() {
      service.user.client({ notApp: 'shop_wxapp' }).then(res => {
        if (res.resp_code == '200') {
          this.authMenu = res.data
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    filterEmployee(v) {
      this.filterEmployeeList = this.allEmployeeList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.eename.indexOf(v) !== -1) return true
        if (item.mobile.indexOf(v) !== -1) return true
      })
    },
    filterRole(v) {
      this.filterRoleList = this.allRoleList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.name.indexOf(v) !== -1) return true
      })
    },
    filterRole2(v) {
      this.filterRoleList2 = this.allRoleList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.name.indexOf(v) !== -1) return true
      })
    },
    filterRole3(v) {
      this.filterRoleList3 = this.allRoleList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.name.indexOf(v) !== -1) return true
      })
    },
    filterUser(v) {
      this.filterUserList = this.allUserList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.username.indexOf(v) !== -1) return true
        if (item.mobile.indexOf(v) !== -1) return true
      })
    },
    updateStatus(row) {
      let params = {
        enabled: row.enabled,
        id: row.id,
        username: row.username
      }
      service.user.updateEnabled(params).then(res => {
        yid.util.alert(res.resp_msg)
      })
    },
    updateIsmac(row) {
      let params = {
        ismac: row.ismac,
        id: row.id,
        username: row.username
      }
      service.user.updateIsmac(params).then(res => {
        yid.util.alert(res.resp_msg)
      })
    },
    showAdd() {
      this.dialog.visible = true
      this.dialog.title = '新建账号'

      this.userForm.id = ''
      this.userForm.username = ''
      this.userForm.mobile = ''
      this.userForm.password = ''
      this.userForm.eename = ''
      this.userForm.shopname = ''
      this.userForm.eeInfo = null
      this.disabledvalue = false
      this.userForm.isUserType = false
      this.userForm.isUserRole = false
      this.userForm.typeId = ''
      this.userForm.roleId = ''
      this.userForm.roleIds = []
      this.userForm.userMenus = []
      this.userForm.userMenus2 = []
      this.userForm.ismac = '1'
    },
    async showEdit(row) {
      this.dialog.visible = true
      this.dialog.title = '编辑账号'

      if (!isEmpty(row.eeid)) {
        await service.employee.getInfoById(row.eeid).then(res => {
          if (res.resp_code == 200) {
            this.userForm.eeInfo = res.data
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      } else {
        this.userForm.eeInfo = null
      }

      this.userForm.id = row.id
      this.userForm.username = row.username
      this.userForm.password = row.password
      this.userForm.eename = row.eename
      this.userForm.nickname = row.nickname
      this.userForm.enabled = row.enabled
      this.userForm.shopid = row.shopid
      this.userForm.shopname = row.shopname
      this.userForm.shopcode = row.shopcode
      this.userForm.ismac = row.ismac

      let menuArr = []
      row.menus.map((itemCheck, itemIndex) => {
        menuArr.push({
          menuId: itemCheck.id,
          name: itemCheck.name,
          appID: itemCheck.appId
        })
      })
      this.userForm.userMenus = menuArr
      this.userForm.userMenus2 = row.userMenus

      if (!isEmpty(row.roleId)) {
        this.userForm.roleIds = row.roleId.split(',')
      } else {
        this.userForm.roleIds = []
      }
      this.disabledvalue = true
    },
    cancel() {
      this.$refs['userForm'].resetFields()
      this.resetUserForm()
      this.selectShop = null
      this.selectEmployee = null
      this.dialog.visible = false
    },
    clearEmployee() {
      this.userForm.eeInfo = null
      this.userForm.shopid = ''
      this.userForm.shopcode = ''
      this.userForm.shopname = ''
    },
    saveUser() {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          if (this.userForm.eeInfo != null) {
            this.userForm.sex = this.userForm.eeInfo.sex
            this.userForm.eeid = this.userForm.eeInfo.id
            this.userForm.eecode = this.userForm.eeInfo.eecode
            this.userForm.eename = this.userForm.eeInfo.eename
            if (isEmpty(this.userForm.eeInfo.nickname)) {
              this.userForm.nickname = this.userForm.eeInfo.eename
            } else {
              this.userForm.nickname = this.userForm.eeInfo.nickname
            }
            this.userForm.headImgUrl = this.userForm.eeInfo.photo
            this.userForm.mobile = this.userForm.eeInfo.mobile
          } else {
            this.userForm.sex = ''
            this.userForm.eeid = ''
            this.userForm.eecode = ''
            this.userForm.eename = ''
            this.userForm.headImgUrl = ''
            this.userForm.mobile = ''
          }
          this.userForm.isAdmin = '0'

          let id = ''
          this.userForm.roleIds.map(item => {
            id += item + ','
          })
          if (id.length > 0) {
            id = id.substr(0, id.length - 1)
          }
          this.userForm.roleId = id
          service.user.saveOrUpdateForChain(this.userForm).then(res => {
            if (res.resp_code == '200') {
              yid.util.success('保存成功')
              this.get()
              this.$refs['userForm'].resetFields()
              this.resetUserForm()
              this.selectShop = null
              this.selectEmployee = null
              this.dialog.visible = false
            }
          })
        }
      })
    },
    showLoginShop(row) {
      this.shopDialog.visible = true
      this.shopDialog.title = '设置可登录门店'
      this.shopDialog.uid = row.id
      this.shopDialog.username = row.username
      this.shopData = []
    },
    editLoginShop(shopid) {
      this.shopDialog2.visible = true
      this.shopDialog2.title = '设置可登录门店'
      this.shopData2 = []
    },
    selectAll() {
      let checkedIds = []
      this.shopTreeData.map(item => {
        checkedIds.push(item.id)
      })
      this.$refs.shopCheckedData.setCheckedKeys(checkedIds)
    },
    saveShop() {
      let params = {}
      params.id = this.shopDialog.uid
      params.username = this.shopDialog.username
      if (this.selectShop == null) {
        params.shopid = ''
        params.shopcode = ''
        params.shopname = ''
        params.brandId = ''
        params.brandCode = ''
        //yid.util.error("请选择一个登录门店！")
        //return;
      } else {
        params.shopid = this.selectShop.id
        params.shopcode = this.selectShop.shopcode
        params.shopname = this.selectShop.shopname
        params.brandId = this.selectShop.brandId
        params.brandCode = this.selectShop.brandCode
      }
      if (isEmpty(params.shopid)) {
        yid.util.confirm('确定不设置登录门店吗？', '', '', () => {
          service.user.updateUserShop(params).then(res => {
            if (res.resp_code == '200') {
              this.shopDialog.type = ''
              this.shopDialog.uid = ''
              this.shopDialog.username = ''
              yid.util.success('门店设置成功！')
              this.selectShop = null
              this.get()
              this.shopDialog.visible = false
            }
          })
        })
      } else {
        service.user.updateUserShop(params).then(res => {
          if (res.resp_code == '200') {
            this.shopDialog.type = ''
            this.shopDialog.uid = ''
            this.shopDialog.username = ''
            this.shopDialog.visible = false
            yid.util.success('门店设置成功！')
            this.selectShop = null
            this.get()
          }
        })
      }
    },
    saveShop2() {
      let params = {}
      params.id = this.shopDialog.uid
      if (this.selectShop == null) {
        params.shopid = ''
        params.shopcode = ''
        params.shopname = ''
        params.brandId = ''
        params.brandCode = ''
        //yid.util.error("请选择一个登录门店！")
        //return;
      } else {
        params.shopid = this.selectShop.id
        params.shopcode = this.selectShop.shopcode
        params.shopname = this.selectShop.shopname
        params.brandId = this.selectShop.brandId
        params.brandCode = this.selectShop.brandCode
      }
      if (isEmpty(params.shopid)) {
        yid.util.confirm('确定不设置登录门店吗？', '', '', () => {
          this.userForm.shopid = ''
          this.userForm.shopname = ''
          this.userForm.shopcode = ''
          this.userForm.brandId = ''
          this.userForm.brandCode = ''
          this.shopDialog2.visible = false
        })
      } else {
        this.userForm.shopid = params.shopid
        this.userForm.shopname = params.shopname
        this.userForm.shopcode = params.shopcode
        this.userForm.brandId = params.brandId
        this.userForm.brandCode = params.brandCode
        this.shopDialog2.visible = false
      }
    },
    showUserMenu(row) {
      this.menuDialog.visible = true
      this.menuDialog.showEdit = true

      if (!isEmpty(row.id)) {
        this.userForm.id = row.id
        this.userForm.username = row.username
        let checkArr = row.userMenus
        let tempArr = []
        tempArr = yid.util.deepClone(this.shopMenu)
        tempArr.map((item, index) => {
          checkArr.map(item2 => {
            if (item.appID == item2.appID) {
              item.checks = checkArr[index].checks
            }
          })
        })
        this.treeArr = tempArr
        this.treeData = yid.util.deepClone(this.treeArr)
        this.activeTab = this.treeData[0].name
        this.resetExistMenu()
        this.selectIndex = 0
      }
    },
    editUserMenu() {
      this.menuDialog.visible = true
      this.menuDialog.showEdit = false
      //this.userForm.menuChecked = true;
      if (!isEmpty(this.userForm.id)) {
        let checkArr = this.userForm.userMenus2
        let tempArr = []
        tempArr = yid.util.deepClone(this.shopMenu)
        tempArr.map((item, index) => {
          checkArr.map(item2 => {
            if (item.appID == item2.appID) {
              item.checks = checkArr[index].checks
            }
          })
        })
        this.treeArr = tempArr
      } else {
        this.treeArr = yid.util.deepClone(this.shopMenu)
      }
      this.treeData = yid.util.deepClone(this.treeArr)
      this.activeTab = this.treeData[0].name
      this.resetExistMenu()
      this.selectIndex = 0
    },
    clickTab(tab) {
      this.selectIndex = tab.index
    },
    selectAll() {
      console.log(this.treeData[this.selectIndex].menus)
      this.$refs['tree' + this.selectIndex][0].setCheckedNodes(
        this.treeData[this.selectIndex].menus
      )
    },
    selectReverse() {
      let nodes = this.$refs['tree' + this.selectIndex][0].getCheckedNodes(
        true,
        false
      )
      this.$refs['tree' + this.selectIndex][0].setCheckedNodes(
        this.treeData[this.selectIndex].menus
      )
      nodes.forEach(node => {
        this.$refs['tree' + this.selectIndex][0].setChecked(node, false, true)
      })
    },
    unSelectAll() {
      console.log(this.treeData[this.selectIndex].menus)
      this.$refs['tree' + this.selectIndex][0].setCheckedKeys([])
    },
    resetExistMenu() {
      let existTabArr = []
      this.treeData.map(item => {
        existTabArr.push(item.name)
      })
      this.existMenu = existTabArr
    },
    addAuthMenu(item) {
      //console.log(this.existMenu);
      console.log('addAuthMenu', this.existMenu)
      if (this.existMenu.includes(item.name)) {
        yid.util.error('此菜单已存在，请前往配置')
      } else {
        this.treeArr.map(item2 => {
          if (item.appId == item2.appID) {
            let name = item2.name
            let appId = item2.appID
            let menus = item2.menus
            let checks = []
            let newTree = {
              name,
              appId,
              menus,
              checks
            }
            //console.log(newTree);
            this.treeData.push(newTree)
            this.selectIndex = this.treeData.length - 1
            this.resetExistMenu()
            this.activeTab = item.name
            console.log(this.activeTab)
          }
        })
      }
    },
    removeTab(targetName) {
      let tabs = this.treeData
      let activeName = this.activeTab
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      //console.log(targetName)
      this.activeTab = activeName
      this.treeData = tabs.filter(tab => tab.name !== targetName)
      this.selectIndex = this.treeData.length - 1
      this.resetExistMenu()
      // console.log(this.treeData)
    },
    saveMenuConfig() {
      let checkedArr = [],
        checkedArr2 = [],
        menuArr = []
      let tempArr = []
      this.treeData.map((item, index) => {
        checkedArr = this.$refs['tree' + index][0].getCheckedNodes()
        checkedArr.map((itemCheck, itemIndex) => {
          menuArr.push({
            menuId: itemCheck.id,
            name: itemCheck.name,
            appID: item.appID
          })
        })
        checkedArr2 = this.$refs['tree' + index][0].getCheckedKeys()
        tempArr.push({
          name: item.name,
          appID: item.appID,
          checks: checkedArr2
        })
      })
      if (this.menuDialog.showEdit) {
        service.user.saveUserMenus(this.userForm.id, menuArr).then(res => {
          if (res.resp_code == '200') {
            yid.util.success('特殊权限设置成功！')
            this.get()
            this.menuDialog.showEdit = false
            this.menuDialog.visible = false
          }
        })
      } else {
        this.userForm.userMenus = menuArr
        this.userForm.userMenus2 = tempArr
        this.menuDialog.showEdit = false
        this.menuDialog.visible = false
      }
    },
    checkUsername(value) {
      this.userForm.username = value.replace(/[^\w\.\/]/gi, '')
    },
    checkEename(value) {
      if (!isEmpty(this.userForm.eeInfo)) {
        this.userForm.nickname = this.userForm.eeInfo.eename
      }
    },
    queryShop() {
      const fetch = service.chain.servShop.queryShop
      let params = {}
      if (this.shopDialog.visible) {
        params = {
          page: this.shopDialog.page,
          limit: this.shopDialog.limit,
          shop: this.shopDialog.shop,
          type: this.shopDialog.type,
          region: this.shopDialog.region,
          brandId: this.shopDialog.brand
        }
        this.$refs['tableShop'].reloadData({
          fetch,
          params
        })
      } else if (this.shopDialog2.visible) {
        params = {
          page: this.shopDialog2.page,
          limit: this.shopDialog2.limit,
          shop: this.shopDialog2.shop,
          type: this.shopDialog2.type,
          region: this.shopDialog2.region,
          brandId: this.shopDialog2.brand
        }
        this.$refs['tableShop2'].reloadData({
          fetch,
          params
        })
      } else if (this.shopDialog3.visible) {
        params = {
          page: this.shopDialog3.page,
          limit: this.shopDialog3.limit,
          shop: this.shopDialog3.shop,
          type: this.shopDialog3.type,
          region: this.shopDialog3.region,
          brandId: this.shopDialog3.brand
        }
        this.$refs['tableShop3'].reloadData({
          fetch,
          params
        })
      }
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        //return 'DisableSelection'
      }
    },
    queryEmployee() {
      const fetch = service.employee.getListUnbind
      let params = {}
      params = {
        page: this.eeDialog.page,
        limit: this.eeDialog.limit,
        shop: this.eeDialog.shop,
        eename: this.eeDialog.eename,
        eeid: this.eeDialog.eeid
      }
      this.$refs['tableEmployee'].reloadData({
        fetch,
        params
      })
    },
    editBindEmployee(eeid) {
      this.eeDialog.visible = true
      this.eeDialog.eeid = eeid
      this.employeeData = []
    },
    saveBindEe() {
      if (this.selectEmployee == null) {
        yid.util.error('请选择一个员工！')
        return
      } else {
        this.userForm.eeInfo = this.selectEmployee
        this.userForm.eename = this.selectEmployee.eename
        let nickname = this.selectEmployee.nickname
        if (!nickname) {
          nickname = this.selectEmployee.eename
        }
        this.userForm.nickname = nickname
        this.userForm.shopid = this.selectEmployee.shopid
        this.userForm.shopcode = this.selectEmployee.shopcode
        this.userForm.shopname = this.selectEmployee.shopname
        this.userForm.brandId = this.selectEmployee.brandId
        this.userForm.brandCode = this.selectEmployee.brandCode

        this.eeDialog.visible = false
      }
    },
    resetUserForm() {
      this.userForm = {
        roleId: '',
        roleIds: [],
        id: '',
        username: '',
        nickname: '',
        mobile: '',
        password: '',
        sex: '',
        eeInfo: null,
        role: '',
        headImgUrl: '',
        isUserType: false,
        isUserRole: false,
        typeId: '',
        userMenus: [],
        userMenus2: [],
        menus: [],
        menuChecked: false,
        shopid: '',
        shopname: '',
        shopcode: '',
        eename: '',
        ismac: '1'
      }
    },
    shopcodeChange() {
      let shoptye = this.searchForm.shoptype
      if (shoptye == 1) {
        this.showShopcodename = true
        this.searchForm.shopcodename = ''
      } else if (shoptye == 2) {
        this.showShopcodename = true
        this.searchForm.shopcodename = ''
      } else {
        this.showShopcodename = false
        this.searchForm.shopcodename = ''
      }
    },
    openManageDialog(row) {
      if (!row.eecode) {
        yid.util.alert('请先绑定员工')
        return
      }
      service.chain.employee.getManageData({ eecode: row.eecode }).then(res => {
        if (res.resp_code == '200') {
          this.manageData.visible = true
          this.manageData.eecode = res.data.eecode
          this.manageData.eename = res.data.eename
          this.manageData.eeid = res.data.id
          this.manageData.orgcode = res.data.shopcode
            ? res.data.shopcode
            : res.data.regionCode
          this.manageData.orgname = res.data.shopname
            ? res.data.shopname
            : res.data.regionName
          this.manageData.orgs = res.data.orgs
          this.manageData.shops = res.data.shops
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    selectOrgs() {
      this.orgDialog.visible = true
      this.orgDialog.select = []
      this.$refs['tableOrg'].clearData({})
    },
    queryOrgs() {
      const fetch = service.chain.region.list
      const params = {
        page: this.orgDialog.page,
        limit: this.orgDialog.limit,
        codename: this.orgDialog.codename
      }
      this.$refs['tableOrg'].reloadData({
        fetch,
        params
      })
    },
    mutlselectOrg(val) {
      this.orgDialog.select = val
    },
    saleOrgs() {
      if (this.orgDialog.select.length > 0) {
        this.orgDialog.select.forEach(org => {
          let flag = true
          this.manageData.orgs.forEach(o => {
            if (org.code == o.orgcode) {
              flag = false
            }
          })
          if (flag) {
            this.manageData.orgs.push({
              orgcode: org.code,
              orgname: org.name,
              pathcode: org.pathCode
            })
          }
        })
      }
      this.orgDialog.visible = false
    },
    deleteOrg(row) {
      this.manageData.orgs.forEach((org, index) => {
        if (org.orgcode == row.orgcode) {
          this.manageData.orgs.splice(index, 1)
        }
      })
    },
    selectShops() {
      this.shopDialog3.visible = true

      this.shopDialog3.select = []
      this.$refs['tableShop3'].clearData({})
    },
    mutlselectShops(val) {
      this.shopDialog3.select = val
    },
    saleShops() {
      if (this.shopDialog3.select.length > 0) {
        this.shopDialog3.select.forEach(org => {
          let flag = true
          this.manageData.shops.forEach(o => {
            if (org.shopcode == o.orgcode) {
              flag = false
            }
          })
          if (flag) {
            this.manageData.shops.push({
              orgcode: org.shopcode,
              orgname: org.shopname
            })
          }
        })
      }
      this.shopDialog3.visible = false
    },
    deleteShop(row) {
      this.manageData.shops.forEach((org, index) => {
        if (org.orgcode == row.orgcode) {
          this.manageData.shops.splice(index, 1)
        }
      })
    },
    saveManageData() {
      service.chain.employee.manageData(this.manageData).then(res => {
        if (res.resp_code == '200') {
          this.manageData.visible = false
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    }
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

.el-table .DisableSelection .cell .el-checkbox__inner {
  display: none !important;
  position: relative;
}

.el-table .DisableSelection .cell:before {
  content: '';
  position: absolute;
  right: 11px;
}

.store-table {
  /deep/ .el-table__header-wrapper .el-table-column--selection .cell {
    display: none;
  }
}
</style>
