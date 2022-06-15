<template>
    <div class="role">
        <div class="top">
            <el-button @click="showAdd" type="primary">新建角色</el-button>
        </div>
        <div class="middle">
            <div class="table">
                <yid-table pagination ref="table" style="margin-top: 15px;" highlight-current-row
                           @cell-click="handleSelectionChange">
                    <yid-table-column label="角色名称" min-width="150" prop="name">
                        <template slot-scope="scope">
                            <el-link type="primary">{{scope.row.name}}</el-link>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="90" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="showEdit(scope.row)" type="text"><i class="edit"></i>编辑</el-button>
                            <el-button @click="deleteRole(scope.row)" type="text"><i class="view"></i>删除</el-button>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
            <div class="tree">
                <div style="margin-top: 15px">
                    <span style="margin-right: 150px">角色名称：{{rolename}}</span>
                    <span>角色描述：{{roledesc}}</span>
                </div>

                <div class="auth-config">
                    <el-form :inline="true" class="demo-form-inline" style="margin-top: 20px;">
                        <el-form-item label="">
                            <el-dropdown @command="addAuthMenu">
                              <span class="el-dropdown-link">
                                <el-button type="primary" icon="el-icon-circle-plus-outline">添加菜单</el-button>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="item" v-for="item in authMenu" :key="'menu'+item.id">
                                        {{item.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="selectAll" type="primary" size="mini" style="margin-left: 50px">全选
                            </el-button>
                            <el-button @click="selectReverse" type="primary" size="mini">反选</el-button>
                            <el-button @click="unSelectAll" type="primary" size="mini">取消</el-button>
                            <el-button @click="saveConfig" type="primary" size="mini" style="margin-left: 50px">保存
                            </el-button>
                            <el-button @click="showCopy" type="primary" size="mini" style="margin-left: 10px">保存并复制角色
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <div v-if="this.treeData.length==0" style="margin-top: 50px;margin-left: 70px;color: #cccccc">
                        <span v-if="!this.isSelected">点击角色名称，开始配置权限</span>
                        <span v-if="this.isSelected">暂无权限，请点击【添加菜单】按钮，为角色配置权限</span>
                    </div>
                    <el-tabs v-if="this.treeData.length>0" v-model="activeTab" type="card" closable
                             @tab-remove="removeTab" @tab-click="clickTab">
                        <el-tab-pane
                                v-for="(item, index) in treeData"
                                :key="item.name"
                                :label="item.name"
                                :name="item.name"
                        >
                            <el-tree
                                    :data="item.menus"
                                    show-checkbox
                                    default-expand-all
                                    node-key="id"
                                    :ref="'tree'+ index"
                                    highlight-current
                                    @node-click="clickNode"
                                    check-strictly
                                    :default-checked-keys="item.checks"
                                    :props="defaultProps"
                                    :expand-on-click-node="false"
                            >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span v-if="data.senauth=='1'" style="color: red;">{{ node.label }}</span>
                                    <span v-if="data.senauth=='0'">{{ node.label }}</span>
                                    <span v-if="data.headId" style="color: red; margin-left: 5px;">{{ data.headId ? '指标' : '' }}</span>
                                </span>
                            </el-tree>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>

        <yid-dialog :title="dialog.title" :visible="dialog.visible" @close="closeDialog" width="550px">
            <el-form ref="roleForm" :model="roleForm" label-width="80px">
                <el-form-item label="角色名称" prop="name" :rules="[{ required: true, message: '角色名称不能为空'}]">
                    <el-input v-model="roleForm.name" placeholder="角色名称" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roledesc">
                    <el-input v-model="roleForm.roledesc" placeholder="可输入0-30个字" type="textarea" :rows="3"
                              maxlength="30" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="closeDialog" type="info">取消</el-button>
                    <el-button @click="saveRole" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="rptdialog.title" :visible="rptdialog.visible" @close="rptdialog.visible=false"
                    width="750px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <div style="margin: 10px 0;"></div>
            <el-checkbox-group v-model="checkedItems" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in rptItemList" :label="item.fieldName" :key="item.id">
                    {{item.fieldTxt}}
                </el-checkbox>
            </el-checkbox-group>
            <div style="margin: 10px 0;"></div>
            <el-form ref="roleForm1" label-width="80px">
                <el-form-item label=" ">
                    <el-button @click="rptdialog.visible=false" type="info">取消</el-button>
                    <el-button @click="saveRptItem" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

    </div>

</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import {isEmpty} from "../../library/helper/validate";

    function unique(arr) {
        arr = arr.sort();
        // console.log(arr);

        var arr1 = [arr[0]];
        for (var i = 1, len = arr.length; i < len; i++) {
            if (arr[i] !== arr[i - 1]) {
                arr1.push(arr[i]);
            }
        }
        return arr1;
    }


    export default {
        name: "role",
        components: {},
        data() {
            return {
                pageInfo: {
                    page: 0,
                    limit: 10
                },
                dialog: {
                    title: "",
                    visible: false
                },
                roleForm: {
                    id: "",
                    name: "",
                    roledesc: "",
                    isCopy: false,
                    roleMenuList: [],
                },
                rolename: "",
                roledesc: "",
                defaultProps: {
                    children: 'subMenus',
                    label: 'name',
                },
                treeArr: [],
                //菜单
                shopMenu: [],

                isSelected: false,
                treeData: [],
                selectIndex: 0,
                existMenu: [],
                authMenu: [],
                activeTab: '',
                defaultProps: {
                    children: 'subMenus',
                    label: 'name'
                },
                tabIndex: 1,
                authForm: {
                    roleId: "",
                },
                rptdialog: {
                    title: "",
                    visible: false
                },
                checkedItems: [],
                rptItemList: [{fieldName: '1', fieldTxt: 'A'}, {fieldName: '2', fieldTxt: 'B'}],
                checkAll: false,
                isIndeterminate: true
            }
        },
        mounted() {
            this.get();
            this.getAllMenu();
            this.getClient();
        },
        methods: {
            treeChange(tree, node) {

            },
            get() {
                const fetch = service.sysRole.list
                const params = {...this.pageInfo}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getAllMenu() {
                service.sysMenu.getAllMenus({notApp: "shop_wxapp"}).then(res => {
                    if (res.resp_code == "200") {
                        this.shopMenu = res.data.shopMenu;
                    }
                });
            },
            getClient() {
                service.user.client({notApp: "shop_wxapp"}).then(res => {
                    this.authMenu = res.data;
                });
            },
            showAdd() {
                this.dialog.title = "新增角色";
                this.dialog.visible = true;

                this.roleForm.id = "";
                this.roleForm.name = "";
                this.roleForm.roledesc = "";
                this.roleForm.isCopy = false;
            },
            showEdit(row) {
                this.dialog.title = "编辑角色";
                this.dialog.visible = true;

                this.roleForm.id = row.id;
                this.roleForm.name = row.name;
                this.roleForm.roledesc = row.roledesc;
                this.roleForm.isCopy = false;
            },
            saveRole() {
                this.$refs['roleForm'].validate(valid => {
                    if (valid) {
                        console.log(this.roleForm);
                        if (this.roleForm.isCopy) {
                            let checkedArr = [],
                                halfcheckedArr = [],
                                menuArr = [];

                            this.treeData.map((item, index) => {
                                let appId = item.appId;
                                checkedArr = this.$refs['tree' + index][0].getCheckedKeys();
                                checkedArr.map((itemCheck, itemIndex) => {
                                    menuArr.push({
                                        menuId: itemCheck,
                                        appId: appId,
                                        roleId: this.authForm.roleId,
                                    });
                                });
                                halfcheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys();
                                halfcheckedArr.map((itemCheck, itemIndex) => {
                                    menuArr.push({
                                        menuId: itemCheck,
                                        appId: appId,
                                        roleId: this.authForm.roleId,
                                    });
                                });
                            })
                            this.roleForm.id = this.authForm.roleId;
                            this.roleForm.roleMenuList = menuArr;
                            service.sysRole.saveCopyRoleMenu(this.roleForm).then(res => {
                                if (res.resp_code == "200") {
                                    this.get();
                                    this.isSelected = false;
                                    yid.util.success("保存成功");
                                    this.dialog.visible = false
                                }
                            })
                        }
                        else {
                            service.sysRole.saveOrUpdate(this.roleForm).then(res => {
                                if (res.resp_code == "200") {
                                    this.get();
                                    this.isSelected = false;
                                    yid.util.success("保存成功");
                                    this.dialog.visible = false
                                }
                            })
                        }
                    }
                })
            },
            deleteRole(row) {
                service.sysRole.getUsersByRoleId(row.id).then(res => {
                    if (res.resp_code == "200") {
                        let len = res.data == null ? 0 : res.data.length;
                        let text = "确定删除此角色吗？";
                        if (len > 0) {
                            text = "该角色已被" + len + "个账号绑定，删除角色时，将影响相关账号功能，删除操作不可撤销。" + text;
                        }
                        yid.util.confirm(text, '', '', () => {
                            service.sysRole.deleteRole(row.id).then(res => {
                                this.treeData = [];
                                this.isSelected = false;
                                if (res.resp_code == "200") {
                                    this.get();
                                    yid.util.success(res.resp_msg);
                                } else {
                                    yid.util.error(res.resp_msg);
                                }
                            })
                        })
                    } else {
                        yid.util.error(res.resp_msg);
                    }
                })

            },
            closeDialog() {
                this.menuForm = {};
                this.dialog.visible = false
            },
            handleSelectionChange(row) {
                this.rolename = row.name;
                this.roledesc = row.roledesc;
                if (isEmpty(this.roledesc)) {
                    this.roledesc = "无";
                }

                //},
                //editMenu(row){
                this.isSelected = true;
                let params = row.id;
                service.sysMenu.getRoleMenus(params).then(res => {
                    if (res.resp_code == "200") {
                        let checkArr = res.data;
                        this.treeArr = this.shopMenu;

                        this.authForm.roleId = yid.util.deepClone(row.id);
                        this.treeData = yid.util.deepClone(checkArr);
                        if (this.treeData.length > 0) {
                            this.activeTab = this.treeData[0].name;
                            this.resetExistMenu();
                            this.selectIndex = 0;
                        } else {
                            this.activeTab = "";
                            this.existMenu = [];
                            this.selectIndex = 0;
                        }
                    }
                });
            },
            clickTab(tab) {
                this.selectIndex = tab.index;
            },
            selectAll() {
                console.log(this.treeData[this.selectIndex].menus)
                this.$refs['tree' + this.selectIndex][0].setCheckedNodes(this.treeData[this.selectIndex].menus);
            },
            selectReverse() {
                let nodes = this.$refs['tree' + this.selectIndex][0].getCheckedNodes(true, false);
                this.$refs['tree' + this.selectIndex][0].setCheckedNodes(this.treeData[this.selectIndex].menus);
                nodes.forEach(node => {
                    this.$refs['tree' + this.selectIndex][0].setChecked(node, false, true);
                });
            },
            unSelectAll() {
                console.log(this.treeData[this.selectIndex].menus)
                this.$refs['tree' + this.selectIndex][0].setCheckedKeys([]);
            },
            resetExistMenu() {
                let existTabArr = [];
                this.treeData.map(item => {
                    existTabArr.push(item.name);
                });
                this.existMenu = existTabArr;
            },
            addAuthMenu(item) {
                if (!this.isSelected) {
                    yid.util.error("请先选择一个角色")
                    return;
                }
                //console.log(this.existMenu);
                console.log('addAuthMenu', this.existMenu)
                if (this.existMenu.includes(item.name)) {
                    yid.util.error("此菜单已存在，请前往配置")
                } else {
                    this.treeArr.map(item2 => {
                        if (item.appId == item2.appID) {
                            let name = item2.name;
                            let appId = item2.appID;
                            let menus = item2.menus;
                            let checks = []
                            let newTree = {
                                name,
                                appId,
                                menus,
                                checks
                            }
                            //console.log(newTree);
                            this.treeData.push(newTree);
                            this.selectIndex = this.treeData.length - 1;
                            this.resetExistMenu();
                            this.activeTab = item.name;
                            console.log(this.activeTab)
                        }
                    });
                }
            },
            removeTab(targetName) {
                let tabs = this.treeData;
                let activeName = this.activeTab;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }
                //console.log(targetName)
                this.activeTab = activeName;
                this.treeData = tabs.filter(tab => tab.name !== targetName);
                this.selectIndex = this.treeData.length - 1;
                this.resetExistMenu();
                // console.log(this.treeData)
            },
            saveConfig() {
                if (!this.isSelected) {
                    yid.util.error("请先选择一个角色")
                    return;
                }
                let checkedArr = [],
                    halfcheckedArr = [],
                    menuArr = [];

                this.treeData.map((item, index) => {
                    let appId = item.appId;
                    checkedArr = this.$refs['tree' + index][0].getCheckedKeys();
                    checkedArr.map((itemCheck, itemIndex) => {
                        menuArr.push({
                            menuId: itemCheck,
                            appId: appId,
                            roleId: this.authForm.roleId,
                        });
                    });
                    halfcheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys();
                    halfcheckedArr.map((itemCheck, itemIndex) => {
                        menuArr.push({
                            menuId: itemCheck,
                            appId: appId,
                            roleId: this.authForm.roleId,
                        });
                    });
                })
                service.sysRole.saveRoleMenu(this.authForm.roleId, menuArr).then(res => {
                    if (res.resp_code == 200) {

                        yid.util.success("权限设置成功！")
                    }
                });
            },
            showCopy() {
                if (!this.isSelected) {
                    yid.util.error("请先选择一个角色")
                    return;
                }
                this.dialog.title = "复制角色";
                this.dialog.visible = true;

                this.roleForm.id = this.authForm.roleId;
                this.roleForm.name = "";
                this.roleForm.roledesc = "";
                this.roleForm.isCopy = true;
            },
            clickNode(node) {
                this.checkedItems = [];
                this.rptItemList = [];
                if(node.headId){
                    this.getRptItem(node.headId);
                    this.rptdialog.visible = true;
                }
            },
            getRptItem(headId) {
                const that = this;
                service.sysMenu.getRptItem({pageSize: 100, headId: headId}).then(res => {
                    if (res.resp_code == "200" && null != res.data) {
                        res.data.records.forEach(each => {
                            that.rptItemList.push(each);
                            if (each.fieldRole) {
                                if (each.fieldRole.indexOf(that.authForm.roleId) >= 0) {
                                    that.checkedItems.push(each.fieldName)
                                }
                            }
                        })
                        this.checkAll = that.rptItemList.length === that.checkedItems.length;
                    }
                })
            },
            saveRptItem() {
                const that = this;
                this.rptItemList.forEach(item => {
                    let exist = false;
                    that.checkedItems.forEach(name => {
                        if (item.fieldName == name) exist = true;
                    })
                    if (exist) {
                        if(!item.fieldRole){
                            item.fieldRole = that.authForm.roleId
                        } else if (item.fieldRole && item.fieldRole.indexOf(that.authForm.roleId) < 0) {
                            item.fieldRole = item.fieldRole + ',' + that.authForm.roleId
                        }
                    } else {
                        if (item.fieldRole && item.fieldRole.indexOf(that.authForm.roleId) >= 0) {
                            item.fieldRole = item.fieldRole.replace(that.authForm.roleId, '')
                        }
                    }
                    service.sysMenu.saveRptItem(item).then(res => {
                        if (res.resp_code == "200") {

                        }
                    })
                })
                this.rptdialog.visible = false;
            },
            handleCheckAllChange(val) {
                this.isIndeterminate = false;
                this.checkedItems = [];
                if (val) {
                    this.rptItemList.forEach(e => {
                        this.checkedItems.push(e.fieldName)
                    })
                }
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.rptItemList.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.rptItemList.length;
            }
        }
    }
</script>

<style scoped lang="scss">
    .role {
        .middle {
            display: flex;
            .table {
                width: 320px;

            }
            .tree {
                flex: 1;
                margin-left: 30px;
            }
        }
    }
</style>
