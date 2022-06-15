<template>
    <div class="fwhfConfig">
        <el-form ref="searchForm" :model="searchForm" inline label-width="60px" color="#000" style="color: #000; font-weight: bold; margin-top: 20px;">
            <el-form-item label="品牌：">
                <el-select clearable v-model.trim="searchForm.brandId" filterable :filter-method="filterBrand" placeholder="请选择" style="width: 160px;">
                    <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in filterBrandList">
                        <!--<span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>-->
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=""><el-button type="primary" @click="getFwhfConfig()">查询</el-button></el-form-item><br/>
        </el-form>
        <div class="con">
            <div class="conleft">
                <div>
                    <el-tabs v-model="editableTabsValue" @tab-click="tabClick" type="card">
                        <el-tab-pane
                                :key="item.id"
                                v-for="(item, index) in tabs"
                                :label="item.sname"
                                :name="item.id"
                        >
                           <div class="content"  v-for="wxitem in wxreturns">
                                <div class="one">
                                    <div class="xmtit">
                                <span>
                                    <label>{{wxitem.servnames}}</label>
                                </span>
                                        <el-link type="primary" :underline="false" @click="showEditDialogType(wxitem.id)">编辑项目</el-link>
                                        &nbsp;&nbsp;
                                        <el-link type="primary" :underline="false" @click="deleteWxReturn(wxitem.id,wxitem.servtid)">删除</el-link>
                                    </div>
                                    <div   class='gongwei' @click="setThis(wxitem,'ser')">
                                        <span>服务人员（第{{wxitem.postion}}工位）</span>
                                        <el-switch
                                                @change=setSer($event,wxitem)
                                                v-model="wxitem.serStatus"
                                                active-color="#13ce66"
                                                active-value="1"
                                                inactive-value="2"
                                                inactive-color="#DCDFE6">
                                        </el-switch>
                                        <i class="el-icon-arrow-right"></i>
                                    </div>
                                    <div  class='gongwei'  @click="setThis(item,'cus')">
                                        <span>顾客</span>
                                        <el-switch
                                                @change=setCus($event,wxitem)
                                                active-value="1"
                                                inactive-value="2"
                                                v-model="wxitem.cusStatus"
                                                active-color="#13ce66"
                                                inactive-color="#DCDFE6">
                                        </el-switch>
                                        <i class="el-icon-arrow-right"></i>
                                    </div>
                                </div>

                            </div>
                            <el-button  @click="showAddDialogType" type="primary" style="margin: 15px 0 0 15px">新增回访设置</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </div>

            </div>
            <div class="conright" v-if="showtemp">
                <div style="text-align: right"><el-link type="primary" :underline="false" @click="getMbConfig">消息模板管理</el-link></div>
                <h3 style="margin-bottom: 30px">{{this.showPos ? "设置服务人员待办事项提醒设置" : "顾客微信提醒消息设置"}}</h3>
                <el-select v-model="postion" :disabled="wxtask.length>0?true:false" v-if="showPos" placeholder="请选择" style="width: 300px">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>


                <template v-for="(item, index) in wxtask"  >
                    <div style="max-height: 300px; overflow-y: scroll">
                        <div>
                            <div style="margin: 10px 0 15px 0">
                                <span style="margin-right: 20px">提醒期：  <el-input-number v-model="item.afterDay"  :min="1" :max="10" ></el-input-number>天</span>
                                <span>提醒模板：
                       <el-select v-model="item.pstid" @change="selectOne" placeholder="请选择" style="width: 200px">
                <el-option
                        v-for="item in optionsMb"
                        :key="item.id"
                        :label="item.sname"
                        :value="item.id">
                </el-option>

                   </el-select>
                   </span>
                                <el-button type="danger" style="height: 24px; margin-left: 10px" @click="delMb(item.id)">删除</el-button>

                            </div>

                        </div>
                    </div>
                </template>
                <div style="max-height: 300px; overflow-y: scroll">
                    <div>
                        <div style="margin: 10px 0 15px 0">
                            <span style="margin-right: 20px">提醒期：  <el-input-number v-model="afterDay"  :min="1" :max="10" ></el-input-number>天</span>
                            <span>提醒模板：
                       <el-select v-model="tempid" @change="selectOne" placeholder="请选择" style="width: 200px">
                <el-option
                        v-for="item in optionsMb"
                        :key="item.id"
                        :label="item.sname"
                        :value="item.id">
                </el-option>

                   </el-select>
                   </span>





                        </div>
                        <div class="colormb">
                            <label>模板内容：</label>
                            <p>{{temp}}</p>
                        </div>
                    </div>
                </div>
                <el-button  @click="savetemp" type="primary" style="margin: 15px 0 0 15px">添加</el-button>
            </div>
        </div>
        <!--添加服务回访设置弹出层-->
        <yid-dialog :title="dialogType.title" :visible.sync="dialogType.visible" @close="chanel" width="840px">
           <div style="padding: 20px">
            <!--   <div style="display: flex; color: #000">
                   服务类别：
                   <el-select v-model="value4" placeholder="请选择">
                       <el-option
                               v-for="item in optionsXm"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>
               </div>-->
               <label style="display: block; margin: 20px 0">选择项目:</label>
               <div style="max-height:350px; overflow-y:scroll; display: flex; flex-wrap: wrap;">
                   <template v-for="(item, index) in serverInfos"  >

                    <!--   <div &lt;!&ndash;:class="[isInArray(index)?'xiangm active':'xiangm']"&ndash;&gt; v-if="type === 'A'" @click="clickServer(index)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname">{{item.servname}}</label>
                        </div>-->
                          <!-- {{eitem.id}}
                           {{item.id}}-->

                           <div v-if="isInArray(item.id)==true&&item.disp=='open'"  class="xiangm active" @click="clickServer(item.id)">
                               <span></span>
                               <ul class="gou"><i class="el-icon-check"></i></ul>
                               <label class="xmname">{{item.servname}}</label>
                           </div>
                           <div v-if="isInArray(item.id)==false&&item.disp=='open'"  class="xiangm " @click="clickServer(item.id)">
                               <span></span>
                               <ul class="gou"><i class="el-icon-check"></i></ul>
                               <label class="xmname">{{item.servname}}</label>
                           </div>
                         <div v-if="item.disp=='close'"  class="xiangm ytjiao" @click="clickServer(item.id)">

                                 <span></span>
                                 <label class="xmname">{{item.servname}}(已添加)</label>
                                 <div class="zhezhao"></div>

                       </div>
                   </template>
           <!--        <div  :class="[isInArray(index)?'xiangm active':'xiangm']" v-for="(item, index) in serverInfos" :key="'index' + index" @click="clickServer(index)">
                       <span></span>
                       <ul class="gou"><i class="el-icon-check"></i></ul>
                       <label class="xmname">{{item.servname}}</label>
                   </div>
-->



               </div>

           </div>
            <el-row style="text-align: center; margin-bottom: 15px">
                <el-button @click="chanel" >取消</el-button>
                <el-button type="primary"  @click="addserver">{{ctext}}</el-button>
            </el-row>
        </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from "../../service";
    export default {
        name: "fwhfConfig",
        data:function() {
            return {
                showPos:true,
                showtemp:false,
                id:-1,
                chosenIndex: [],
               exitsIndex: [],
                editableTabsValue: 1,
                editableTabsName:"",
                activeName: 'first',
                ctext:"新增",
                checkwho:-1,
                yg:true,
                gk:true,
                afterDay:1,
                dialogType: {
                    visible: false,
                    title:'添加服务回访设置',
                },
                options: [{
                    value: '1',
                    label: '第一工位'
                }, {
                    value: '2',
                    label: '第二工位'
                }, {
                    value: '3',
                    label: '第三工位'
                }],
                postion: '1',
                optionsMb: [
               ],
                tempid: '0',
                optionsXm: [{
                    value: '洗发类',
                    label: '洗发类'
                }, {
                    value: '剪发类',
                    label: '剪发类'
                }],
                value4: '剪发类',

                tabs:[],
                serverInfos:[],
                isActive:[],

                wxreturns:[],
                temp:'',
                tempname:"",
                wrid:0,
                type:1,
                wxtask:[],
                selectReobj:{},
                searchForm: {
                    brandId: ""
                },
                allBrandList: [],
                filterBrandList:[],
            }
        },
        mounted() {
            this.getBrandList()
        },

        methods: {
            delMb(id)
            {
                yid.service.fwbackConfig.deletWxTaskById(id).then(res => {
                    let par={wrid:this.wrid,type:this.type}
                    yid.service.fwbackConfig.getWxtaskBywrIdAndtype(par).then(restask => {


                        this.wxtask=restask.data;
                        console.log("restask",restask)
                    });
                });
            },
            selectOne(event)
            {
                console.log("event",event)
                this.temp=""
                this.tempname=""
                yid.service.wxTemplate.getTemplateByid(event).then(res => {

                    this.temp=res.data.remask
                    this.tempname=res.data.sname
                });
            },
            savetemp()
            {

                if(this.tempid==0)
                {
                    this.$message({ type: 'error', message: '请选择一个模板再保存'});
                    return;
                }
                console.log("this.postion",this.postion)
                if(this.showPos){
                    if(this.postion==null)
                    {
                        this.$message({ type: 'error', message: '请选择工位'});
                        return;
                    }
                }

                let addobj={afterDay:this.afterDay,pstid:this.tempid,pstname:this.tempname,wrid:this.wrid,
                type:this.type}
                console.log("addobj",addobj)
                yid.service.fwbackConfig.addWxtask(addobj).then(res => {

                    let par={wrid:this.wrid,type:this.type}
                    yid.service.fwbackConfig.getWxtaskBywrIdAndtype(par).then(restask => {
                        this.tempid=0
                        this.wxtask=restask.data;
                        this.selectReobj.postion=this.postion
                        console.log("selectReobj", this.selectReobj);
                        yid.service.fwbackConfig.saveServiceWxReturn( this.selectReobj).then(reschanl => {

                        });
                    });


                });
            },
            setThis(obj,type)
            {
                this.postion=obj.postion

                this.selectReobj=obj;
                this.wrid=obj.id;
                if(type=='ser')
                {
                    this.type=1;
                    this.showPos=true
                }
                else
                {
                    this.type=2;
                    this.showPos=false;
                }
                this.tempid=0;
                console.log("this.type",this.type)
                this.showtemp=true;
                let parm={stype:this.type,page:1,limit:100}
                yid.service.wxTemplate.getTemplateList(parm).then(res => {
                    let firstAll={id:0,sname:"请选择"}
                    res.data.unshift(firstAll);
                    console.log("res",res)
                   this.optionsMb=res.data;

                    let par={wrid:obj.id,type:this.type}
                    yid.service.fwbackConfig.getWxtaskBywrIdAndtype(par).then(restask => {


                        this.wxtask=restask.data;
                        this.wxtask.forEach(res=>{
                            res.pstid = String(res.pstid)
                        })
                        console.log("restask",restask)
                    });

                });

            },
            chanel()
            {
                this.chosenIndex=[]
                this.exitsIndex=[]
                this.dialogType.visible = false
            },

            setSer:function(callback,obj)
            {

                obj.serStatus=callback;
                yid.service.fwbackConfig.saveServiceWxReturn(obj).then(res => {
                    let param = {
                        brandId: this.searchForm.brandId,
                        status: "1"
                    }
                    yid.service.fwbackConfig.getServiceType(param).then(res => {

                        console.log("sssss",res.data)

                        this.tabs=res.data
                        //this.editableTabsValue=res.data[0].id
                        //this.editableTabsName=res.data[0].sname

                        let parm={servtid:this.editableTabsValue,isDel:'0',page:1,limit:1000}
                        yid.service.fwbackConfig.getServiceWxReturn(parm).then(res => {

                            console.log("res111111111111111111",res);
                            this.wxreturns=res.data



                        }).catch((res)=> {

                        });




                    }).catch((res)=> {

                    });
                })

            },
            setCus:function(callback,obj)
            {
                obj.cusStatus=callback;
                yid.service.fwbackConfig.saveServiceWxReturn(obj).then(res => {
                    let param = {
                        brandId: this.searchForm.brandId,
                        status: "1"
                    }
                    yid.service.fwbackConfig.getServiceType(param).then(res => {

                        console.log("sssss",res.data)

                        this.tabs=res.data
                        //this.editableTabsValue=res.data[0].id;
                        //this.editableTabsName=res.data[0].sname

                        let parm={servtid:this.editableTabsValue,isDel:'0',page:1,limit:1000}
                        yid.service.fwbackConfig.getServiceWxReturn(parm).then(res => {

                            console.log("res111111111111111111",res);
                            this.wxreturns=res.data


                        }).catch((res)=> {

                        });




                    }).catch((res)=> {

                    });
                })
            },
            tabClick: function (tab, event) {

             this.editableTabsName=event.target.innerText;

                console.log("id是",this.editableTabsValue)
                console.log("name是",this.editableTabsName)
                let parm={servtid:this.editableTabsValue,isDel:'0',page:1,limit:1000}
                yid.service.fwbackConfig.getServiceWxReturn(parm).then(res => {

                    console.log("res111111111111111111111",res);
                    this.wxreturns=res.data


                }).catch((res)=> {

                });
            },
            addserver()
            {
                console.log("chosenIndex",this.chosenIndex)
                let newChosenList=[];
                this.serverInfos.forEach((sitem,sindex,sarray)=>{
                    this.chosenIndex.forEach((item,index,array)=>{
                        console.log("item[index]",item)
                            if(sitem.id==item)
                        {
                            newChosenList.push(sitem)
                        }
                    })

                    //执行代码
                })
                console.log("newChosenList",newChosenList)
              //  let
                let servids="";
                let servnames="";
                newChosenList.forEach((nitem,nindex,narray)=> {
                    servids+=nitem.id+",";
                    servnames+=nitem.servname+",";

                });
                console.log("servids",servids)
                console.log("servnames",servnames)
                if(servids=="")
                {
                    this.$message({ type: 'error', message: '请至少选中一个服务项目'});
                    return;
                }

                servids=(servids.substring(servids.length-1)==',')?servids.substring(0,servids.length-1):servids
                servnames=(servnames.substring(servnames.length-1)==',')?servnames.substring(0,servnames.length-1):servnames
                let pm={}
                if(this.id==-1) {
                     pm = {
                        servtid: this.editableTabsValue,
                        servtname: this.editableTabsName,
                        servids: servids,
                        servnames: servnames,
                         brandid: this.searchForm.brandId
                    }
                }
                else
                {
                     pm = {
                         id:this.id,
                        servtid: this.editableTabsValue,
                        servtname: this.editableTabsName,
                        servids: servids,
                        servnames: servnames,
                         brandid: this.searchForm.brandId
                    }
                }
                console.log("pm",pm)
                    yid.service.fwbackConfig.saveServiceWxReturn(pm).then(res => {

                        let parm={servtid:this.editableTabsValue,isDel:'0',brandId:this.searchForm.brandId,page:1,limit:1000}
                        yid.service.fwbackConfig.getServiceWxReturn(parm).then(ppres => {


                            this.wxreturns=ppres.data
                            this.chosenIndex=[]
                            this.exitsIndex=[]
                            this.dialogType.visible = false

                        }).catch((res)=> {

                        });



                    }).catch((res)=> {

                    });


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
                   this.chosenIndex.push(index);
               } else {
                   this.chosenIndex.splice(this.chosenIndex.findIndex(item => item === index), 1)
               }
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            showAddDialogType() {

                console.log(this.editableTabsValue)
                this.id=-1
                this.ctext="新增"
                this.chosenIndex=[]
                this.exitsIndex=[]
                let typeParm={servtid:this.editableTabsValue,status:'1'}
                yid.service.fwbackConfig.getServiceInfoByTypeId(typeParm).then(res => {

                    let parm={servtid:this.editableTabsValue,isDel:'0',page:1,limit:1000}
                    yid.service.fwbackConfig.getServiceWxReturn(parm).then(resexits => {
                        let exitsobj=resexits.data;
                        exitsobj.forEach((item,index,array)=> {
                            let one=item.servids;
                            let oneobj=one.split(",");

                            oneobj.forEach((oneitem,oneindex,onearray)=> {
                               console.log("oneitem",oneitem)
                                oneitem=parseInt(oneitem)
                                let oobj={id:oneitem}
                                this.exitsIndex.push(oobj)
                            });
                        });

                        console.log(this.exitsIndex);

                        let showList=res.data;
                        showList.forEach(i => {
                            i.disp='open'
                        })
                        showList.forEach(i => {
                            this.exitsIndex.forEach(j => {
                                if (Number(i.id) === Number(j.id)) {
                                    i.disp='close'
                                }
                            })
                        })
                        this.serverInfos=showList;
                        console.log("最后的showList",showList)
                        this.dialogType.visible = true

                        }).catch((res)=> {

                    });

                }).catch((res)=> {

                });



            },

            showEditDialogType(id) {
                this.id=id
                this.chosenIndex=[]
                this.exitsIndex=[]
                this.ctext="保存"
                let typeParm={servtid:this.editableTabsValue}
                yid.service.fwbackConfig.getServiceInfoByTypeId(typeParm).then(res => {

                    console.log("this.serverInfos",this.serverInfos)
                    // console.log(" serverInfos", res.data)
                    let parm={servtid:this.editableTabsValue,isDel:'0',page:1,limit:1000}
                    yid.service.fwbackConfig.getServiceWxReturn(parm).then(resexits => {



                        yid.service.fwbackConfig.getServiceWxReturnById(id).then(saveedres => {
                            let exitsobj=resexits.data;
                            exitsobj.forEach((item,index,array)=> {
                                let one=item.servids;
                                let oneobj=one.split(",");

                                oneobj.forEach((oneitem,oneindex,onearray)=> {
                                    console.log("oneitem",oneitem)
                                    oneitem=parseInt(oneitem)
                                    let oobj={id:oneitem}
                                    this.exitsIndex.push(oobj)
                                });
                            });

                            let saveddate=saveedres.data.servids;
                           let saveddatesplit=saveddate.split(",");

                           console.log("saveddatesplit",saveddatesplit)

                            let showList=res.data;
                            showList.forEach(i => {
                                i.disp='open'
                            })
                            showList.forEach(i => {
                                this.exitsIndex.forEach(j => {
                                    if (i.id === j.id ) {
                                        i.disp='close'
                                    }
                                })
                            })

                            showList.forEach(i => {
                                saveddatesplit.forEach(j => {
                                    console.log("iiiiiiiiiii",i.id)
                                    console.log("jjjjjjjjjjjjj",j)
                                    if (i.id == j) {
                                        i.disp='open'
                                        this.clickServer(i.id)
                                    }
                                })
                            })


                            console.log("showList",showList)

                            this.serverInfos=showList;



                            this.dialogType.visible = true

                        });

                    }).catch((res)=> {

                    });

                }).catch((res)=> {

                });




            },
            deleteWxReturn(id,servtid){
                const param = {id:id,isDel:'1'};
                yid.service.fwbackConfig.saveServiceWxReturn(param).then(res=>{
                    if(res.resp_code == 200) {
                        let parm={servtid:servtid,isDel:'0',page:1,limit:1000}
                        yid.service.fwbackConfig.getServiceWxReturn(parm).then(res => {
                            this.wxreturns=res.data
                        }).catch((res)=> {

                        });
                    }
                });
            },
            getMbConfig(){
                this.$router.push("./messMbConfig");
            },
            getBrandList() {
                service.chain.brand.brandList({isDel:'0'}).then(res=>{
                    if(res.resp_code == 200) {
                        this.filterBrandList = res.data;
                        this.allBrandList = Object.assign(this.filterBrandList);//保留原数据
                    }
                });
            },
            filterBrand(v){
                this.filterBrandList = this.allBrandList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.name.indexOf(v) !== -1) return true
                })
            },
            getFwhfConfig(){
                let brandId = this.searchForm.brandId;
                if(brandId==""){
                    this.$message({ type: 'error', message: '请选择一个品牌'});
                    return
                }
                let param = {
                    //brandId: this.searchForm.brandId,
                    status: "1"
                }
                yid.service.fwbackConfig.getServiceType(param).then(res => {

                    console.log("sssss",res.data)

                    this.tabs=res.data
                    this.editableTabsValue=res.data[0].id,
                        this.editableTabsName=res.data[0].sname

                    let parm={servtid:this.editableTabsValue,isDel:'0',page:1,limit:1000}
                    yid.service.fwbackConfig.getServiceWxReturn(parm).then(res => {

                        console.log("res111111111111111111",res);
                        this.wxreturns=res.data


                    }).catch((res)=> {

                    });
                }).catch((res)=> {

                });
            }
        },

    }
</script>

<style scoped lang="scss">
    .con {
    display: flex;

    .conleft {
        width: 48%;

        .content {
            max-height: 500px;

            overflow-y: scroll;
            .one{
                border-bottom:1px #e4e7ed solid;
                padding:10px 15px 20px 15px;
                margin-bottom: 5px;
                .xmtit{
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 5px;
                    span{
                        flex: 1;
                        padding-right: 30px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        label::after{
                            content: '、';
                        }

                    }

                }
                .gongwei{
                    display: flex;
                    justify-content: space-between;
                    border: 1px #e4e7ed solid;
                    height: 30px;
                    padding: 0 10px;
                    align-items: center;
                    margin-top: 10px;
                    cursor: pointer;
                    span{
                        flex: 1;
                    }
                    i{
                        padding-left: 15px;
                        color: #999;
                    }
                }
                .active{
                    background-color: #00AAEE;
                    color: #fff;
                    i{
                        color: #fff;
                    }
                }
            }

        }
    }

    .conright {
        width: 52%;
        background-color: #f2f2f2;
        padding: 25px 25px 30px 60px;
        .colormb{
            color: #999;
        }
    }
}
    .xiangm{
        width: 120px;
        height: 150px;
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
            width: 35px;
            height: 35px;
            border-radius: 4px;
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
    .xiangm.ytjiao{
        .xmname{
            color: #999;
        }

        .zhezhao{
            position: absolute;
            z-index: 999999;
            top: 0;
            left: 0;
            width: 120px;
            height: 150px;
            overflow: hidden;
            background-color:#000;
            opacity: 0.3;
        }
    }
</style>