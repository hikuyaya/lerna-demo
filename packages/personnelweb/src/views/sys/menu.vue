<template>
    <div class="sys-log">
        <el-form :model="model" inline>
            <el-form-item label="所属应用：">
                <el-select clearable filterable placeholder="请选择" style="width: 160px;" v-model.trim="model.appId" >
                    <el-option :key="'app'+item.id" :label="item.name" :value="item.appId" v-for="item in clientMap"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="供应端">
                <el-select clearable filterable placeholder="请选择" style="width: 160px;" v-model.trim="model.client">
                    <el-option :key="'client'+item.value" :label="item.text" :value="item.value" v-for="item in clients"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="get()">查询</el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary"  @click="showAdd">新增</el-button>
            <span style="margin-left: 30px;color: red;">选中一行为上级菜单，不选则为根目录（单击选中，双击取消）</span>
        </div>
        <el-table highlight-current-row height="330" @row-click="selectRow" @row-dblclick="unSelect"
                  ref="tableTree"
                  :data="treeMenuData"
                  style="width: 100%;margin-top: 15px;"
                  row-key="id"
                  border
                  default-expand-all
                  :tree-props="{children: 'subMenus', lable: 'name' }"
        >
            <el-table-column label="菜单名称" min-width="180" prop="name" ></el-table-column>
            <el-table-column label="类型" min-width="60" prop="type" >
                <template slot-scope="scope">
                    {{getMenutype(scope.row.type)}}
                </template>
            </el-table-column>
            <el-table-column label="敏感数据" min-width="90" prop="senauth" >
                <template slot-scope="scope">
                    <span>{{scope.row.senauth==1?"是":"否"}}</span>
                </template>
            </el-table-column>
            <el-table-column label="菜单URL" min-width="180" prop="url"> </el-table-column>
            <el-table-column label="菜单PATH" min-width="100" prop="path"> </el-table-column>
            <el-table-column label="样式" min-width="70" prop="css"> </el-table-column>
            <el-table-column label="请求方法" min-width="90" prop="pathMethod"></el-table-column>
            <el-table-column label="排序号" min-width="70" prop="sort"></el-table-column>
            <el-table-column label="供应端" min-width="70" prop="client">
                <template slot-scope="scope">
                    {{scope.row.client=="1"?"普通":"连锁"}}
                </template>
            </el-table-column>
            <el-table-column label="隐藏" min-width="70" prop="hidden">
                <template slot-scope="scope">
                    {{scope.row.hidden==0?"显示":"隐藏"}}
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="showEdit(scope.row)" type="text"><i class="edit"></i>编辑</el-button>
                    <el-button @click="deleteMenu(scope.row)" type="text"><i class="view"></i>删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <yid-dialog :title="dialog.title" :visible="dialog.visible" @close="closeDialog" width="550px">
            <el-form ref="menuForm" :model="menuForm" label-width="80px">
                <el-form-item label="菜单名称" prop="name" >
                    <el-input  v-model="menuForm.name" placeholder="菜单名称" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentName" >
                    <el-input  v-model="menuForm.parentName" :disabled="true" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="菜单URL" prop="url" >
                    <el-input  v-model="menuForm.url" placeholder="菜单URL" style="width: 200px;" ref="input1"></el-input>
                </el-form-item>
                <el-form-item label="菜单PATH" prop="path" >
                    <el-input  v-model="menuForm.path" placeholder="菜单PATH" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="css" >
                    <el-input  v-model="menuForm.css" placeholder="菜单图标" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="供应端" prop="client">
                    <el-radio v-model="menuForm.client" label="1">普通</el-radio>
                    <el-radio v-model="menuForm.client" label="2">连锁</el-radio>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio v-model="menuForm.type" label="1">菜单</el-radio>
                    <el-radio v-model="menuForm.type" label="2">按钮</el-radio>
                    <el-radio v-model="menuForm.type" label="3">Tap</el-radio>
                </el-form-item>
                <el-form-item label="是否隐藏" prop="hidden">
                    <el-radio v-model="menuForm.hidden" label="1">是</el-radio>
                    <el-radio v-model="menuForm.hidden" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="敏感数据" prop="senauth">
                    <el-radio v-model="menuForm.senauth" label="1">是</el-radio>
                    <el-radio v-model="menuForm.senauth" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="请求方法" prop="pathMethod">
                    <el-select v-model="menuForm.pathMethod">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                    <el-input-number v-model="menuForm.sort" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="closeDialog" type="info">取消</el-button>
                    <el-button @click="saveMenu" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>
<script>
    import yid from '@src/library'
    import service from '@src/service'
    import {isEmpty} from "../../library/helper/validate";

    export default {
        name: "menu",
        components: {

        },
        data() {
            return {
                treeMenuData:[],
                model: {
                    appId: "shop_chain",
                    client: '',
                },
                pageInfo:{
                    page:0,
                    limit:10
                },
                clientMap: [],
                clients:[{
                    value: "1",
                    text: "普通",
                },{
                    value: "2",
                    text: "连锁",
                }],
                dialog:{
                    title: "",
                    visible: false
                },
                menuForm:{
                    id:"",
                    name:"",
                    url:"",
                    path:"",
                    pathMethod:"",
                    css:"",
                    hidden:"",
                    type:"",
                    client:"",
                    senauth:"",
                    sort:"",
                    appId:"",
                    parentId:"",
                    parentName:"",
                },
                defaultProps: {
                    children: 'subMenus',
                    label: 'name',
                },
                selectedRow:{},
            }
        },
        mounted() {
            this.getClients();
            this.get();
        },
        methods: {
            getClients() {
                service.user.client({notApp:"shop_wxapp"}).then(res => {
                    this.clientMap = res.data;
                });
            },
            get() {
                if (this.model.appId == "") {
                    yid.util.error("请选择一个所属应用");
                    return
                }
                service.sysMenu.treeList(this.model).then(res => {
                    if (res.resp_code == "200") {
                        this.treeMenuData = res.data;
                        this.selectedRow = {};
                    }
                })
            },
            selectRow(row){
                this.selectedRow = row;
            },
            unSelect(row){
                this.selectedRow = {};
                this.$refs.tableTree.setCurrentRow();
            },
            showAdd() {
                if (this.model.appId == "") {
                    yid.util.error("请选择一个所属应用");
                    return
                }
                this.dialog.visible = true;
                this.dialog.title = "新增菜单";

                if (isEmpty(this.selectedRow.id)) {
                    this.menuForm.parentId = "-1";
                    this.menuForm.parentName = "根目录";
                }else{
                    this.menuForm.parentId = this.selectedRow.id;
                    this.menuForm.parentName = this.selectedRow.name;
                }

                this.menuForm.id = "";
                this.menuForm.name = "";
                this.menuForm.url = "";
                this.menuForm.path = "";
                this.menuForm.pathMethod = "";
                this.menuForm.css = "";
                this.menuForm.hidden = "0";
                this.menuForm.type = "1";
                this.menuForm.sort = "1";
                this.menuForm.senauth = "0";
                this.menuForm.client = "1";
                this.menuForm.appId = this.model.appId;
            },
            showEdit(row) {
                this.dialog.visible = true;
                this.dialog.title = "编辑菜单";

                this.menuForm.id = row.id;
                this.menuForm.parentId = row.parentId;
                this.menuForm.parentName = row.parentName;
                this.menuForm.name = row.name;
                this.menuForm.url = row.url;
                this.menuForm.path = row.path;
                this.menuForm.pathMethod = row.pathMethod;
                this.menuForm.css = row.css;
                this.menuForm.hidden = row.hidden+"";
                this.menuForm.type = row.type+"";
                this.menuForm.sort = row.sort;
                this.menuForm.appId = row.appId;
                this.menuForm.senauth = row.senauth;
                this.menuForm.client = row.client;
            },
            saveMenu() {
                this.$refs['menuForm'].validate(valid => {
                    if (valid) {

                        console.log(this.menuForm);
                        service.sysMenu.saveOrUpdate(this.menuForm).then(res => {
                            if (res.resp_code == "200") {
                                this.get();
                                yid.util.success("保存成功");
                                this.dialog.visible = false
                            }
                        })
                    }
                })
            },
            deleteMenu(row) {
                yid.util.confirm('确定删除此菜单吗？', '', '', () => {
                    service.sysMenu.deleteMenu(row.id).then(res => {
                        if (res.resp_code == "200") {
                            this.get();
                            yid.util.success(res.resp_msg);
                        } else {
                            yid.util.error(res.resp_msg);
                        }
                    })
                })
            },
            closeDialog() {
                this.dialog.visible = false
            },
            getMenutype(type){
                if(type=="1"){
                    return "菜单"
                }else if(type=="2"){
                    return "按钮"
                }else if(type=="3"){
                    return "Tap"
                }else{
                    return "";
                }
            },
        }
    }
</script>

<style scoped lang='scss'>

</style>
