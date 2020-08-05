<template>
    <div class="dept">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="服务项目分类" name="serve">
                <el-button @click="serveAlert(false,'')" type="primary">添加</el-button>
                <el-button @click="lookup()">查看{{status=='2'?'禁用':'正常'}}的服务项目分类</el-button>
                <yid-table pagination ref="servetable" style="margin-top: 15px;" :data="serveData" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="类型编号" min-width="100" prop="scode"></yid-table-column>
                    <yid-table-column label="所属部门" min-width="150" prop="bname"></yid-table-column>
                    <yid-table-column label="类型名称" min-width="150" prop="sname"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="serveAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="serveDelete(scope.row)">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="商品类别" name="catalog">
                <el-button @click="goodsAlert(false,row)" type="primary">添加</el-button>
                <el-button @click="lookup1()">查看{{status1=='2'?'禁用':'正常'}}的商品类别</el-button>
                <yid-table pagination ref="goodstable" style="margin-top: 15px;" :data="goodsData" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="类型编号" min-width="100" prop="ccode"></yid-table-column>
                    <yid-table-column label="所属部门" min-width="150" prop="bname"></yid-table-column>
                    <yid-table-column label="商品类别" min-width="150" prop="cname"></yid-table-column>
                    <yid-table-column label="商品子类" min-width="200" prop="son">
                        <template slot-scope="scope">
                            {{scope.row.son}}
                            <el-link type="primary" @click="subAlert(scope.row)">编辑</el-link>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="goodsAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" @click="goodsDelete(scope.$index, scope.row)" style="margin: 0 10px 0 10px;">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="会员来源配置" name="origin">
                <el-button @click="originAlert(false,'')" type="primary">添加</el-button>
                <el-button @click="lookup2()">查看{{status2=='2'?'禁用':'正常'}}的会员来源</el-button>
                <yid-table pagination ref="origintable" style="margin-top: 15px;" :data="originData" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="来源编号" min-width="100" prop="dccode"></yid-table-column>
                    <yid-table-column label="来源名称" min-width="150" prop="dcname"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="originAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="originDelete(scope.row)">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="会员状态" name="status">
                <el-table pagination ref="statustable" style="margin-top: 15px;" :data="statusData" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="状态编码" min-width="100" prop="mdscode"></yid-table-column>
                    <yid-table-column label="状态名称" min-width="150" prop="mdsname" :render-header="renderHeaderMethods"></yid-table-column>
                    <yid-table-column label="未来店（天数）" min-width="150" prop="missDay"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="statusAlert(true,scope.row)">编辑</el-link>
                        </template>
                    </yid-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="会员等级" name="level">
                <el-button @click="levelAlert(false,'')" type="primary">添加</el-button>
                <el-button @click="lookup3()">查看{{status3=='2'?'禁用':'正常'}}的会员等级</el-button>
                <font color="red">（最多可添加5个等级）</font>
                <yid-table pagination ref="leveltable" style="margin-top: 15px;" :data="levelData" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="等级名称" min-width="100" prop="mdgname"></yid-table-column>
                    <yid-table-column label="等级图标" min-width="150" prop="photopath">
                        <!-- 图片的显示 -->
                        <template  slot-scope="scope">
                            <img :src="getGradePng(scope.row)"  min-width="25" height="25" />
                        </template>
                    </yid-table-column>
                    <yid-table-column label="近一年消费金额≥（元）" min-width="150" prop="smoney"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="levelAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="levelDelete(scope.$index, scope.row)">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>
        <yid-dialog :title="serveDialog.title" :visible.sync="serveDialog.visible" width="450px">
            <el-form ref="serviceForm" :model="serviceForm"  label-width="140px" >
                <el-form-item label="项目类型编号：" prop="scode" :rules="[{ required: true, message: '项目类型编号为空'}]">
                    {{serviceForm.scode}}
                </el-form-item>
                <el-form-item label="项目类型名称：" prop="sname" :rules="[{ required: true, message: '项目类型名称为空'}]">
                    <el-input v-model="serviceForm.sname"/>
                </el-form-item>
                <el-form-item label="所属部门：" prop="deptObj" :rules="[{ required: true, message: '请选择所属部门'}]">
                    <el-select placeholder="请选择所属部门" v-model.trim="serviceForm.deptObj">
                        <el-option v-for="val in deptData" :key="val.id" :value="val.id" :label="val.bname"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="serviceTypeSave" type="primary">确定</el-button>
                    <el-button @click="cancleService">取消</el-button>
                </el-form-item>

            </el-form>
        </yid-dialog>
        <yid-dialog :title="goodsDialog.title" :visible.sync="goodsDialog.visible" width="450px">
            <el-form ref="goodsForm" :model="goodsForm"  label-width="140px" >
                <el-form-item label="商品类型编号：" prop="ccode" :rules="[{ required: true, message: '商品类型编号为空'}]">
                    {{goodsForm.ccode}}
                </el-form-item>
                <el-form-item label="商品类型名称：" prop="cname" :rules="[{ required: true, message: '商品类型名称为空'}]">
                    <el-input v-model="goodsForm.cname"/>
                </el-form-item>
                <el-form-item label="所属部门：" prop="branchObj" :rules="[{ required: true, message: '请选择所属部门'}]">
                    <el-select placeholder="请选择所属部门" v-model.trim="goodsForm.branchObj">
                        <el-option v-for="val in deptData" :key="val.id" :value="val.id" :label="val.bname"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goodsSave" type="primary">确定</el-button>
                    <el-button @click="goodsCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="subDialog.title" :visible.sync="subDialog.visible" width="auto" @close="closez">


            <el-button @click="subAdd(false,'')" type="primary">添加</el-button>
            <el-button @click="lookupz()">查看{{statusz=='2'?'禁用':'正常'}}的商品子类</el-button>
            <div style="margin-top: -10px;">
                <el-divider/>
            </div>

            <yid-table pagination ref="subtable" style="margin-top: 15px;" :data="subData">
                <yid-table-column label="子类编号" min-width="100" prop="ccode"></yid-table-column>
                <yid-table-column label="商品子类" min-width="150" prop="cname"></yid-table-column>
                <yid-table-column label="父类类型" min-width="150" prop="parentname"></yid-table-column>
                <yid-table-column label="操作" min-width="250" prop="content">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="subAdd(true,scope.row)">编辑</el-link>
                        <el-link type="primary" @click="goodsDeletez(scope.row)" style="margin: 0 10px 0 10px;">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                    </template>
                </yid-table-column>
            </yid-table>
        </yid-dialog>

        <yid-dialog :title="subAddDialog.title" :visible.sync="subAddDialog.visible" width="auto">
        <el-form  ref="subForm" :model="subForm"  label-width="140px" >
            <el-form-item label="商品子类编号：" prop="ccode" :rules="[{ required: true, message: '商品子类编号为空'}]">
                {{subForm.ccode}}
            </el-form-item>
            <el-form-item label="所属父类：" prop="parentId" :rules="[{ required: true, message: '请选择所属父类'}]">
                <el-select placeholder="请选择所属父类" v-model.trim="subForm.parentId">
                    <el-option v-for="val in categoryfs" :disabled="val.status=='1' ? false : true" :key="val.id" :value="val.id" :label="val.cname"/>
                </el-select>
            </el-form-item>
            <el-form-item label="商品子类型名称：" prop="cname" :rules="[{ required: true, message: '商品子类型名称为空'}]">
                <el-input v-model="subForm.cname"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="savez" type="primary">保存</el-button>
                <el-button @click="cancelz" type="primary">取消</el-button>
            </el-form-item>
        </el-form>
    </yid-dialog>

    <yid-dialog :title="originDialog.title" :visible.sync="originDialog.visible" width="auto">
        <el-form  :model="channelForm"  label-width="140px" ref="channelForm">
            <el-form-item label="来源编号：" prop="dccode" :rules="[{ required: true, message: '来源编号为空'}]">
                {{channelForm.dccode}}
            </el-form-item>
            <el-form-item label="来源名称：" prop="dcname" :rules="[{ required: true, message: '来源名称为空'}]">
                <el-input v-model="channelForm.dcname"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveOrigin">保存</el-button>
                <el-button @click="originCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </yid-dialog>

    <yid-dialog :title="statusDialog.title" :visible.sync="statusDialog.visible" width="auto">
        <el-form :model="statusForm"  label-width="140px" ref="statusForm">
            <el-form-item label="状态编号：" prop="mdscode" :rules="[{ required: true, message: '状态编号为空'}]">
                {{statusForm.mdscode}}
            </el-form-item>
            <el-form-item label="状态名称：" prop="mdsname" :rules="[{ required: true, message: '状态名称为空'}]">
                <!--<el-input v-model="statusForm.mdsname" readonly="readonly"/>-->
                {{statusForm.mdsname}}
            </el-form-item>
            <el-form-item label="未来店（天数）：" prop="missDay"  :rules="[{ required: true, message: '未来店（天数）为空'}]">
                <el-input onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="4" v-model="statusForm.missDay"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="savememStatus">保存</el-button>
                <el-button @click="statusCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </yid-dialog>

    <yid-dialog :title="levelDialog.title" :visible.sync="levelDialog.visible" width="500px">
        <el-form :model="levelForm"  label-width="160px" ref="levelForm">
            <el-form-item label="等级名称：" prop="mdgname" :rules="[{ required: true, message: '等级名称为空'}]">
                <el-input v-model="levelForm.mdgname"/>
            </el-form-item>
            <el-form-item label="最近一年消费金额≥：" prop="smoney" :rules="[{ required: true, message: '最近一年消费金额≥为空'}]">
                <el-input type="number" v-model="levelForm.smoney"/>
            </el-form-item>
            <el-form-item label="等级图标：" prop="photopath">
               <div class="levelWrap">
                   <div :class="[isInArray(0)?'xiangm active':'xiangm']" :key="'index' + 0" @click="clickServer(0)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname">无图标</label>
                   </div>
                   <div :class="[isInArray(1)?'xiangm active':'xiangm']" :key="'index' + 1" @click="clickServer(1)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175f6-ARoYHAAANb29Tguw672.png"/></label>
                   </div>
                   <div :class="[isInArray(2)?'xiangm active':'xiangm']" :key="'index' + 2" @click="clickServer(2)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175g-GAW9jzAAAQco5nH_E710.png"/></label>
                   </div>
                   <div :class="[isInArray(3)?'xiangm active':'xiangm']" :key="'index' + 3" @click="clickServer(3)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175g_CAeMxRAAARWUOeZSs880.png"/></label>
                   </div>
                   <div :class="[isInArray(4)?'xiangm active':'xiangm']" :key="'index' + 4" @click="clickServer(4)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hAaARfSAAAAPZHkUPaU498.png"/></label>
                   </div>
                   <div :class="[isInArray(5)?'xiangm active':'xiangm']" :key="'index' + 5" @click="clickServer(5)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hKKAah18AAAPj0ot3XM129.png"/></label>
                   </div>
                   <div :class="[isInArray(6)?'xiangm active':'xiangm']" :key="'index' + 6" @click="clickServer(6)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hLKAWGI8AAASSAhWVXc491.png"></label>
                   </div>
                   <div :class="[isInArray(7)?'xiangm active':'xiangm']" :key="'index' + 7" @click="clickServer(7)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hPGAX4y2AAAPHrPn_eA904.png"/></label>
                   </div>
                   <div :class="[isInArray(8)?'xiangm active':'xiangm']" :key="'index' + 8" @click="clickServer(8)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname"><img width="50px" height="50px" src="http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hPuATLD1AAAW3bzDY6w499.png"/></label>
                   </div>
               </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="savememLevel">保存</el-button>
                <el-button @click="levelCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "catalog",
        data() {
            return {
                status : '2',
                status1 : '2',
                status2 : '2',
                statusz : '2',
                status3 : '2',
                parentId : '',
                categoryfs : [],
                activeName: 'serve',
                serviceForm : {
                    scode : '',
                    sname : '',
                    deptObj : '',
                    status : '1',
                },
                goodsForm:{
                    ccode :'',
                    cname : '',
                    branchObj : '',
                    parentId : '0',
                    level : '1',
                    bbid : '',
                    status : '1',
                },
                subForm :{
                    ccode :'',
                    cname : '',
                    branchObj : '',
                    parentId : '',
                    level : '2',
                    bbid : '',
                    status : '1',
                },
                pageInfo:{page:1,limit:10},
                maxCode:0,
                channelForm :{
                    dccode :'',
                    dcname : '',
                    isDel : '0',
                    status : '1',
                },
                statusForm : {
                    mdscode : '',
                    mdsname : '',
                    missDay : '',
                    isDel : '0',
                },
                levelForm : {
                    mdgcode :'',
                    mdgname :'',
                    photopath :'',
                    smoney : '',
                    isDel : '0',
                    status : '1',
                    type : '0'
                },
                parentData : {
                    bbid : "",
                    parentId : ""
                },
                deptData : [
                    {}
                ],
                serveData: [
                    {}
                ],
                goodsData: [
                    {}
                ],
                originData: [

                ],
                serveDialog: {
                    title: '',
                    visible: false,
                },
                goodsDialog: {
                    title: '',
                    visible: false,
                },
                subData:[
                    {

                    }
                ],
                statusData: [
                    {
                        no: 1,
                        name: '状态名称',
                        days: '90'
                    }
                ],
                levelData: [
                    {
                        no: 1,
                        name: '洗发',
                        dept: '美发'
                    }
                ],
                subDialog: {
                    title: '',
                    visible: false,
                },
                subAddDialog: {
                    title: '',
                    visible: false,
                },
                originDialog: {
                    title: '',
                    visible: false,
                },
                statusDialog: {
                    title: '',
                    visible: false,
                },
                levelDialog: {
                    title: '',
                    visible: false,
                },
                chosenIndex:[],
            }
        },
        created() {

        },

        mounted() {
            /**获取部门列表**/
            this.getserviceTypeList("1");
        },
        methods: {
            lookup(){
                this.getserviceTypeList(this.status);
                if(this.status=='1'){
                    this.status='2'
                }else{
                    this.status='1'
                }
            },
            lookup1(){
                this.getproductcategoryList(this.status1);
                if(this.status1=='1'){
                    this.status1='2'
                }else{
                    this.status1='1'
                }
            },
            lookup2(){
                this.getdistchannelList(this.status2);
                if(this.status2=='1'){
                    this.status2='2'
                }else{
                    this.status2='1'
                }
            },
            lookupz(){
                this.getproductcategoryListz(this.statusz,this.parentId);
                if(this.statusz=='1'){
                    this.statusz='2'
                }else{
                    this.statusz='1'
                }
            },
            lookup3(){
                this.getdictgradelList(this.status3);
                if(this.status3=='1'){
                    this.status3='2'
                }else{
                    this.status3='1'
                }
            },
            isInArray(index) {
                if(this.chosenIndex.includes(index)) {
                    return true;
                } else {
                    return false;
                }
            },
            clickServer(index)
            {
                if(!this.chosenIndex.includes(index)) {
                    this.chosenIndex = [];
                    this.chosenIndex.push(index);
                    console.log(this.chosenIndex);
                } else {
                    this.chosenIndex = [];
                    //this.chosenIndex.splice(this.chosenIndex.findIndex(item => item === index), 1)
                }
            },
            handleClick(tab, event) {
                console.log(tab, event);
                if(tab.name == 'serve'){
                    this.status = "2";
                    this.getserviceTypeList("1");
                }else if(tab.name == 'catalog'){
                    this.status1 = "2";
                    this.getproductcategoryList("1");
                }else if(tab.name == 'origin'){
                    this.status2 = "2";
                    this.getdistchannelList("1");
                }else if(tab.name == 'status'){
                    this.getstatuslList();
                }else if(tab.name == 'level'){
                    this.status3 = "2";
                    this.getdictgradelList("1");
                }
            },
            getdeptListAll(){
                service.dept.deptAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.deptData = res.data;
                    }
                })
            },
            getCategoryfs(){
                service.dept.getAllf({level:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.categoryfs = res.data;
                    }
                })
            },
            getserviceTypeList(status){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.servetable.Pagination.internalPageSize;
                const fetch = service.dept.serviceTypeList
                const params = this.pageInfo
                params.status = status
                this.$refs.servetable.reloadData({
                    fetch,
                    params
                });
            },
            getproductcategoryList(status1){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.goodstable.Pagination.internalPageSize;
                const fetch = service.dept.productcategoryList
                const params = this.pageInfo
                params.status = status1
                this.$refs.goodstable.reloadData({
                    fetch,
                    params
                });
            },
            getproductcategoryListz(statusz,pid){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.subtable.Pagination.internalPageSize;
                const fetch = service.dept.productcategoryListz
                const params = this.pageInfo
                params.status = statusz
                params.pid  = pid
                this.$refs.subtable.reloadData({
                    fetch,
                    params
                });
            },
            getdistchannelList(status2){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.origintable.Pagination.internalPageSize;
                const fetch = service.memInfo.distchannelList
                const params = this.pageInfo
                params.isDel = '0'
                params.status = status2
                this.$refs.origintable.reloadData({
                    fetch,
                    params
                });
            },
            getstatuslList(){
                service.memInfo.statuslListAll({isDel:'0'}).then(res=>{
                    if(res.resp_code == 200) {
                        this.statusData = res.data;
                    }
                });
            },
            getdictgradelList(status3){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.leveltable.Pagination.internalPageSize;
                const fetch = service.memInfo.dictgradelList
                const params = this.pageInfo
                params.isDel = '0'
                params.status = status3
                this.$refs.leveltable.reloadData({
                    fetch,
                    params
                });
            },
            ServiceTypeMaxId(){
                service.dept.getServiceTypeMaxId().then(res=> {
                    this.serviceForm.scode = res.data;
                })
            },
            ProductcategoryMaxId(){
                service.dept.getProductcategoryMaxId().then(res=> {
                    this.goodsForm.ccode = res.data;
                })
            },
            ProductcategoryMaxIdz(){
                service.dept.getProductcategoryMaxId().then(res=> {
                    this.subForm.ccode = res.data;
                })
            },
            DistchannelMaxId(){
                service.memInfo.getDistchannelMaxId().then(res=> {
                    this.channelForm.dccode = res.data;
                })
            },
            StatusMaxId(){
                service.memInfo.getStatusMaxId().then(res=> {
                    this.statusForm.mdscode = res.data;
                })
            },
            DictgradelMaxId(){
                service.memInfo.getDictgradelMaxId().then(res=> {
                    this.levelForm.mdgcode = res.data;
                })
            },
            serveAlert(tag = false,row) {
                this.serveDialog.visible = true;
                this.serveDialog.title = tag? '编辑服务项目分类' : '添加服务项目分类';
                this.getdeptListAll();
                if(tag == false){
                    this.serviceForm.id = ''
                    /**获取最大code+1**/
                    this.ServiceTypeMaxId();
                    this.$refs['serviceForm'].resetFields();
                    this.serviceForm.scode = ''
                    this.serviceForm.sname = ''
                    this.serviceForm.deptObj = ''
                    this.serviceForm.branch =''
                    this.serviceForm.isyy ='1'
                    this.serviceForm.revision = '1'
                    this.serviceForm.status = '1'
                    console.log(this.serviceForm);
                }else{
                    this.serviceForm.id = row.id;
                    this.serviceForm.scode = row.scode;
                    this.serviceForm.sname = row.sname;
                    this.serviceForm.deptObj = String(row.branch)
                    this.serviceForm.isyy = row.isyy
                    this.serviceForm.revision = row.revision
                    this.serviceForm.status = row.status
                }
            },
            serviceTypeSave(){
                this.$refs['serviceForm'].validate((valid) => {
                        if(valid){
                            //获取部门id
                            this.serviceForm.branch = this.serviceForm.deptObj;
                            service.dept.saveServiceType(this.serviceForm).then(res=> {
                                if(res.resp_code == 200) {
                                    yid.util.success(res.resp_msg)
                                }else{
                                    yid.util.error(res.resp_msg)
                                }
                                if(this.serviceForm.id == '' || this.serviceForm.id.length == 0){
                                    this.status = "2";
                                    this.getserviceTypeList("1");
                                }else{
                                    if(this.status == '2'){
                                        this.status = "2";
                                        this.getserviceTypeList("1");
                                    }else{
                                        this.status = "1";
                                        this.getserviceTypeList("2");
                                    }
                                }
                            });
                            this.cancleService();
                        }
                })
            },
            cancleService() {
                this.serveDialog.visible = false;
            },
            serveDelete(row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.sname+'吗？', '','', ()=> {
                    const serviceType = {};
                    serviceType.id = row.id;
                    serviceType.sname = row.sname;
                    serviceType.branch = row.branch;
                    if(row.status == '1'){//如果是正常-禁用
                        serviceType.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        serviceType.status = '1';
                    }else{
                        yid.util.info("服务项目分类"+row.sname+"状态异常")
                        return;
                    }
                    service.dept.updateStatusServiceType(serviceType).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功")
                        }else{
                            yid.util.error(res.resp_msg)
                            return
                        }
                        this.status = "2";
                        this.getserviceTypeList("1");
                    });
                })
            },
            goodsAlert(tag = false,row) {
                this.goodsDialog.visible = true;
                this.goodsDialog.title = tag? '编辑商品分类' : '添加商品分类';
                this.getdeptListAll();
                if(tag == false){
                    this.goodsForm.id = ''
                    /**获取最大code+1**/
                    this.ProductcategoryMaxId();
                    this.$refs['goodsForm'].resetFields();
                    this.goodsForm.ccode='';
                    this.goodsForm.cname= '';
                    this.goodsForm.branchObj = ''
                    this.goodsForm.parentId = '0'
                    this.goodsForm.level = '1'
                    this.goodsForm.bbid = ''
                    this.goodsForm.revision = '1'
                    this.goodsForm.status='1';
                }else{
                    this.goodsForm.id = row.id;
                    this.goodsForm.ccode=row.ccode;
                    this.goodsForm.cname= row.cname;
                    this.goodsForm.parentId = row.parentId
                    this.goodsForm.level = row.level
                    this.goodsForm.branchObj = String(row.bbid)
                    this.goodsForm.revision = row.revision
                    this.goodsForm.status=row.status;
                }
            },
            goodsSave(){
                this.$refs['goodsForm'].validate((valid) => {
                    if(valid){
                        //获取部门id
                        this.goodsForm.bbid = this.goodsForm.branchObj;
                        console.log(this.goodsForm);
                        service.dept.saveProductcategory(this.goodsForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            if(this.goodsForm.id == '' || this.goodsForm.id.length == 0){
                                this.status = "2";
                                this.getproductcategoryList("1");
                            }else{
                                if(this.status == '2'){
                                    this.status = "2";
                                    this.getproductcategoryList("1");
                                }else{
                                    this.status = "1";
                                    this.getproductcategoryList("2");
                                }
                            }
                        });
                        this.goodsCancel();
                    }
                })
            },
            goodsCancel() {
                this.goodsDialog.visible = false;
            },
            goodsDelete(index,row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.cname+'吗？', '','', ()=> {
                    const goods = {};
                    goods.id = row.id;
                    goods.cname = row.cname;
                    goods.bbid = row.bbid;
                    goods.level = row.level;
                    if(row.status == '1'){//如果是正常-禁用
                        goods.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        goods.status = '1';
                    }else{
                        yid.util.info("商品类别["+row.bname+"]状态异常")
                        return;
                    }
                    service.dept.updateStatusCategory(goods).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg);
                            return
                        }
                        this.status = "2";
                        this.getproductcategoryList("1");
                    });
                })
            },
            goodsDeletez(row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.cname+'吗？', '','', ()=> {
                    const goodsz = {};
                    goodsz.id = row.id;
                    goodsz.cname = row.cname;
                    goodsz.bbid = row.bbid;
                    goodsz.level = row.level;
                    if(row.status == '1'){//如果是正常-禁用
                        goodsz.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        goodsz.status = '1';
                    }else{
                        yid.util.info("商品子类["+row.bname+"]状态异常")
                        return;
                    }
                    service.dept.updateStatusCategory(goodsz).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg);
                            return
                        }
                        this.status = "2";
                        this.getproductcategoryListz("1",this.parentId);
                    });
                })
            },
            subAlert(row) {
                this.subDialog.visible = true;
                this.subDialog.title = '编辑商品子类';
                this.parentData.bbid = row.bbid;
                this.parentData.parentId = row.id;
                this.parentId = row.id;
                this.getCategoryfs();
                //查询子类列表
                this.statusz = '2';
                this.$nextTick(()=> {
                    this.getproductcategoryListz('1',row.id)
                });

            },
            subAdd(tag,row) {
                this.subAddDialog.visible = true;
                this.subAddDialog.title = tag? '编辑商品子类' : '添加商品子类';
                if(tag == false){
                    this.subForm.id = ''
                    /**获取最大code+1**/
                    this.ProductcategoryMaxIdz();
                    //this.$refs['subForm'].resetFields();
                    this.subForm.ccode='';
                    this.subForm.cname= '';
                    this.subForm.parentId = this.parentId;
                    this.subForm.level = '2'
                    this.subForm.bbid = ''
                    this.subForm.revision = '1'
                    this.subForm.status = '1'
                }else{
                    this.subForm.id = row.id;
                    this.subForm.ccode=row.ccode;
                    this.subForm.cname= row.cname;
                    this.subForm.parentId = String(row.parentId);
                    this.subForm.level = row.level;
                    this.subForm.bbid = row.bbid;
                    this.subForm.revision = row.revision;
                    this.subForm.status = row.status;
                }
            },
            savez(){
                this.$refs['subForm'].validate((valid) => {
                    if(valid){
                        service.dept.saveProductcategory(this.subForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            if(this.subForm.id == '' || this.subForm.id.length == 0){
                                this.status = "2";
                                this.getproductcategoryListz("1",this.parentData.parentId);
                            }else{
                                if(this.status == '2'){
                                    this.status = "2";
                                    this.getproductcategoryListz("1",this.parentData.parentId);
                                }else{
                                    this.status = "1";
                                    this.getproductcategoryListz("2",this.parentData.parentId);
                                }
                            }
                        });
                        this.cancelz();
                    }
                })
            },
            cancelz(){
                this.subAddDialog.visible = false;
            },
            closez(){
                if(this.status1 == '2'){
                    this.status1 = "2";
                    this.getproductcategoryList("1");
                }else{
                    this.status1 = "1";
                    this.getproductcategoryList("2");
                }
            },
            originAlert(tag = false,row) {
                this.originDialog.visible = true;
                this.originDialog.title = tag? '编辑会员来源' : '添加会员来源';
                if(tag == false){
                    this.channelForm.id = ''
                    /**获取最大code+1**/
                    this.DistchannelMaxId();
                    this.$refs['channelForm'].resetFields();
                    this.channelForm.dccode = '';
                    this.channelForm.dcname = '';
                    this.channelForm.isDel = '0'
                    this.channelForm.revision = '1'
                    this.channelForm.status='1';
                }else{
                    this.channelForm.id = row.id;
                    this.channelForm.dccode = row.dccode;
                    this.channelForm.dcname = row.dcname;
                    this.channelForm.isDel = row.isDel;
                    this.channelForm.revision = row.revision;
                    this.channelForm.status=row.status;
                }
            },
            saveOrigin(){
                this.$refs['channelForm'].validate((valid) => {
                    if(valid){
                        service.memInfo.saveDistchannel(this.channelForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            if(this.branchForm.id == '' || this.branchForm.id.length == 0){
                                this.status2 = "2";
                                this.getdistchannelList("1");
                            }else{
                                if(this.status2 == '2'){
                                    this.status2 = "2";
                                    this.getdistchannelList("1");
                                }else{
                                    this.status2 = "1";
                                    this.getdistchannelList("2");
                                }
                            }

                        });
                        this.originCancel();
                    }
                })
            },
            originCancel() {
                this.originDialog.visible = false;
            },
            originDelete(row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.dcname+'吗？', '','', ()=> {
                    const channel = {};
                    channel.id = row.id;
                    channel.dcname = row.dcname;
                    if(row.status == '1'){//如果是正常-禁用
                        channel.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        channel.status = '1';
                    }else{
                        yid.util.info("会员来源["+row.dcname+"]状态异常")
                        return;
                    }
                    service.memInfo.saveDistchannel(channel).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg);
                            return
                        }
                        this.status = "2";
                        this.getdistchannelList("1");
                    });
                })
            },

            statusAlert(tag = false,row) {
                this.statusDialog.visible = true;
                this.statusDialog.title = tag? '编辑会员状态' : '编辑会员状态';
                if(tag == false){
                    this.statusForm.id = ''
                    /**获取最大code+1**/
                    this.StatusMaxId();
                    this.$refs['statusForm'].resetFields();
                    this.statusForm.mdscode = '';
                    this.statusForm.mdsname = '';
                    this.statusForm.missDay = '';
                    this.statusForm.isDel = '0'
                    //this.statusForm.revision = '1'
                }else{
                    this.statusForm.id = row.id;
                    this.statusForm.mdscode = row.mdscode;
                    this.statusForm.mdsname = row.mdsname;
                    this.statusForm.missDay = row.missDay;
                    this.statusForm.isDel = row.isDel;
                    //this.statusForm.revision = row.revision;
                }
            },
            statusCancel() {
                this.statusDialog.visible = false;
            },
            savememStatus(){
                this.$refs['statusForm'].validate((valid) => {
                    if(valid){
                        service.memInfo.saveStatus(this.statusForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            this.getstatuslList();
                        });
                        this.statusCancel();
                    }
                })
            },
            statusDelete(index,row) {
                yid.util.confirm('你确定要删除'+row.mdsname+'吗？', '','', ()=> {
                    row.isDel = '1'
                    service.memInfo.saveStatus(row).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success(res.resp_msg)
                        }else{
                            yid.util.error(res.resp_msg)
                        }
                        this.getstatuslList();
                    });
                })
            },
            levelAlert(tag = false,row) {
                this.levelDialog.visible = true;
                this.levelDialog.title = tag? '编辑会员等级' : '添加会员等级';
                if(tag == false){
                    this.levelForm.id = ''
                    /**获取最大code+1**/
                    this.DictgradelMaxId();
                    this.$refs['levelForm'].resetFields();
                    this.levelForm.mdgname = '';
                    this.chosenIndex = []
                    this.levelForm.photopath = ''
                    this.levelForm.smoney = '';
                    this.levelForm.isDel = '0'
                    this.levelForm.revision = '1'
                    this.levelForm.status = '1'
                    this.levelForm.type = '0'
                    console.log(this.levelForm);
                }else{
                    this.levelForm.id = row.id;
                    this.levelForm.mdgcode = row.mdgcode;
                    this.levelForm.mdgname = row.mdgname;
                    this.chosenIndex = []
                    this.chosenIndex.push(Number(row.photopath))
                    this.levelForm.smoney = row.smoney;
                    this.levelForm.isDel = row.isDel;
                    this.levelForm.revision = row.revision;
                    this.levelForm.status = row.status;
                    this.levelForm.type = '0'
                    console.log(this.chosenIndex);
                }
            },
            savememLevel(){
                this.$refs['levelForm'].validate((valid) => {
                    if(valid){
                        this.levelForm.photopath = this.chosenIndex[0];
                        service.memInfo.saveDictgradel(this.levelForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            if(this.levelForm.id == '' || this.levelForm.id.length == 0){
                                this.status3 = "2";
                                this.getdictgradelList("1");
                            }else{
                                if(this.status3 == '2'){
                                    this.status3 = "2";
                                    this.getdictgradelList("1");
                                }else{
                                    this.status3 = "1";
                                    this.getdictgradelList("2");
                                }
                            }
                        });
                        this.levelCancel();
                    }
                })
            },
            levelCancel() {
                this.levelDialog.visible = false;
            },
            levelDelete(index,row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.mdgname+'吗？', '','', ()=> {
                    const level = {};
                    level.id = row.id;
                    level.mdgname = row.mdgname;
                    level.photopath = row.photopath;
                    if(row.status == '1'){//如果是正常-禁用
                        level.status = '2';
                        level.type = '0';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        level.status = '1';
                        level.type = '1';
                    }else{
                        yid.util.info("会员等级["+row.mdgname+"]状态异常")
                        return;
                    }
                    service.memInfo.saveDictgradel(level).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!")
                        }else{
                            yid.util.error(res.resp_msg)
                        }
                        this.status3 = "2";
                        this.getdictgradelList("1");
                    });
                })
            },
            getGradePng(row){
                if(Number(row.photopath) === 0){
                    return '0';
                }else if(Number(row.photopath) === 1){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175f6-ARoYHAAANb29Tguw672.png';
                }else if(Number(row.photopath) === 2){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175g-GAW9jzAAAQco5nH_E710.png';
                }else if(Number(row.photopath) === 3){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175g_CAeMxRAAARWUOeZSs880.png';
                }else if(Number(row.photopath) === 4){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hAaARfSAAAAPZHkUPaU498.png';
                }else if(Number(row.photopath) === 5){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hKKAah18AAAPj0ot3XM129.png';
                }else if(Number(row.photopath) === 6){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hLKAWGI8AAASSAhWVXc491.png';
                }else if(Number(row.photopath) === 7){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hPGAX4y2AAAPHrPn_eA904.png';
                }else if(Number(row.photopath) === 8){
                    return 'http://120.119.110.251:8888/group1/M00/00/01/eHdu-175hPuATLD1AAAW3bzDY6w499.png';
                }else{
                    return '0'
                }
            },
            // 自定义表格展示提示信息
            renderHeaderMethods(h, {column}) {
                return h(
                    'div', {
                        style: 'display:flex;margin:auto;'
                    },
                    [
                        h('span', column.label),
                        h('promptMessages', {
                            props: {
                                messages: [
                                    '有效客：未超过预设天数就产生了消费记录的顾客；',
                                    '流失风险：超过预设天数没有消费记录被视为有流失风险；',
                                    '沉睡客：超过设定天数没有来店的，视为已经沉睡的顾客；',
                                ]
                            }
                        })
                    ]
                )
            },
        }
    }
</script>

<style scoped lang="scss">
.levelWrap {
    display: flex;
    width: 300px;
    flex-wrap: wrap;
    .box {
        width: 55px;
        height: 55px;
        border: 1px solid #969896;
        margin: 0 10px 10px 0;
    }
    .xiangm{
        width: 50px;
        height: 50px;
        border:1px #999 solid;
        box-sizing:content-box;
        position: relative;
        border-radius: 4px;
        margin:0 25px 25px 0 ;
        padding: 0;
        span{
            width: 100%;
            height: 100%;
            overflow: hidden;
            img{
                width: 120px;
                height: 150px;
                margin: 0;
                padding: 0;
            }
        }
        .gou{
            display: none;
        }

        .xmname{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;justify-content: center;
            align-items: center;
            color: #000;
            z-index: 2222;
        }
    }
    .xiangm.active{
        border:5px rgba(255, 102, 0, 1) solid;

        .gou{
            width: 5px;
            height: 5px;
            border-radius: 1px;
            background-color: rgba(255, 102, 0, 1);
            position: absolute;
            top: -5px;
            right: -5px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            margin: 0;
            i{
                color: #fff;
                font-size: 20px;
                font-weight: bold;
            }
        }
    }
}
</style>
