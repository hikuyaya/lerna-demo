<template>
    <div class="auth-config">
        <el-form :inline="true" :model="authForm" ref="authForm" class="demo-form-inline">
            <el-form-item label="选择账户：">
                <el-select multiple clearable placeholder="请选择账号：" style="width: 400px;" v-model.trim="authForm.userIds" disabled>
                    <el-option :key="item.id" :label="item.username+'（'+item.mobile+'）'" :value="item.id" v-for="item in allUserList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="cancelConfig">取消</el-button>
                <el-button type="primary" @click="saveConfig">保存</el-button>
                <el-button type="primary" @click="cancelConfig" style="margin-left: 60px;">返回</el-button>
            </el-form-item>
        </el-form>
        <el-alert
                title='勾选的功能表示允许该管理员操作，不想对某个操作员开放的功能，只需把小勾去掉，然后点击"保存"按钮即可。'
                type="info"
                show-icon>
        </el-alert>
        <el-form :inline="true" class="demo-form-inline" style="margin-top: 20px;">
            <el-form-item label="">
                <el-dropdown @command="addAuthMenu">
              <span class="el-dropdown-link">
                <el-button type="primary" icon="el-icon-circle-plus-outline">添加菜单</el-button>
              </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item" v-for="item in authMenu" :key="'menu'+item.id">{{item.name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
            <el-form-item>
                <el-button @click="selectAll" type="primary" size="mini">全选</el-button>
                <el-button @click="unSelectAll" size="mini">清空</el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
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
                        :default-checked-keys="item.checks"
                        :props="defaultProps">
                </el-tree>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import {clientMenus} from "../../service/modules/user";
    export default {
        name: "auth-config",
        props: {
            treeArr: Array,
            userIds: Array
        },
        data() {
            return {
                selectIndex : 0,
                existMenu: [],
                authMenu: [],
                activeTab: '',
                defaultProps: {
                    children: 'subMenus',
                    label: 'name'
                },
                editableTabsValue: '2',
                treeData: [],
                UserIds: [],
                tabIndex: 1,
                authForm : {
                    userIds: null
                },
                allUserList:[],
            }
        },
        watch: {

            treeArr(newValue, oldvalue) {
                this.treeData = yid.util.deepClone(newValue);
                this.activeTab = this.treeData[0].name;
                this.resetExistMenu();
                this.selectIndex = 0;
                console.log('enter+treeArr')
            },

            userIds(newValue, oldvalue) {
                this.authForm.userIds = yid.util.deepClone(newValue);
                console.log('enter+userIds')
            },
        },

        mounted() {
            this.getAllUser();
            service.user.client().then(res=> {
                this.authMenu = res.data;
            });

        },
        methods: {
            getAllUser(){
                service.user.chainListAll({}).then(res=> {
                    if(res.resp_code == 200) {
                        this.allUserList = res.data;
                    }
                })
            },

            clickTab(tab) {
                this.selectIndex = tab.index;
            },
            selectAll() {
                console.log(this.treeData[this.selectIndex].menus)
                this.$refs['tree' + this.selectIndex][0].setCheckedNodes(this.treeData[this.selectIndex].menus);
            },
            unSelectAll() {
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
                //console.log(this.existMenu);
                console.log('addAuthMenu',this.existMenu)
                if(this.existMenu.includes(item.name)) {
                    yid.util.error("此菜单已存在，请前往配置")
                } else {
                    service.user.clientMenus(item.appId).then(res=> {
                        // console.log(res.data[0]);
                        let name = item.name;
                        let appID = item.appId;
                        let menus = res.data;
                        let checks = []
                        let newTree = {
                            name,
                            appID,
                            menus,
                            checks
                        }
                        //console.log(newTree);
                        this.treeData.push(newTree);
                        this.selectIndex = this.treeData.length - 1;
                        this.resetExistMenu();
                        this.activeTab = item.name;
                        console.log(this.activeTab)
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
            cancelConfig() {
                this.$emit('afterCancel')
            },
            saveConfig() {
                let checkedArr = [],
                    halfCheckedArr = [],
                    menuArr = [];
                // console.log(this.userId);
                this.treeData.map((item, index)=> {
                   let appId = this.treeData[index].appID;
                   checkedArr = this.$refs['tree' + index][0].getCheckedKeys();
                   halfCheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys();
                   // console.log('选中', this.$refs['tree' + index][0].getCheckedKeys());
                   // console.log('半选',this.$refs['tree' + index][0].getHalfCheckedKeys());
                    checkedArr.map((itemCheck, itemIndex)=> {
                       menuArr.push({
                           menuId : itemCheck,
                           appId,
                           //userId: this.userId
                       });
                   });
                    halfCheckedArr.map((itemCheck, itemIndex)=> {
                        menuArr.push({
                            menuId : itemCheck,
                            appId,
                            //userId: this.userId
                        });
                    });
                })
                //console.log(menuArr)
                service.user.saveMenus(this.authForm.userIds, menuArr).then(res=> {
                    if(res.resp_code == 200) {
                        yid.util.success("权限设置成功！")
                        this.$emit('afterCancel')
                    }
                });
                //this.$emit('afterSave')
            },

        }
    }
</script>

<style scoped lang="scss">

</style>