<template>

    <div class="dept">
        <el-row>
            <el-col :span="3"><el-button type="primary" @click="editShopInfo()">修改门店资料</el-button></el-col>
            <el-col :span="3"><el-button type="primary" @click="openShopImage()">修改门店宣传图</el-button></el-col>
            <el-col :span="3"><el-button type="primary" @click="shopmap.visible=true">设置经纬</el-button></el-col>
            <el-col :span="3"><el-button type="primary" @click="openQcode()">门店收银开单码</el-button></el-col>
            <el-col :span="3"><el-button type="primary" @click="openQcode()">门店推广二维码</el-button></el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="8">
                <div class="block" style="width: 360px;">
                    <el-carousel trigger="click" height="260px">
                        <el-carousel-item v-for="item in shop.shopImages" :key="item">
                            <h3 class="small">
                                <el-image
                                        style="width: 450px; height: 450px"
                                        :src="item.photoPath"
                                        :fit="fit">
                                </el-image>
                            </h3>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </el-col>
            <el-col :span="16">
                <el-form :inline="true"  label-width="100px" label-position="left">
                    <el-form-item label="门店名称：" class="formItemClass">{{shop.shopname}}</el-form-item>
                    <el-form-item label="预约名称：" class="formItemClass">{{shop.yyshopname}}</el-form-item><br/>
                    <el-form-item label="门店编号：" class="formItemClass">{{shop.shopcode}}</el-form-item>
                    <el-form-item label="业务类型：" class="formItemClass">
                        <div v-show="shop.type=='1'">{{shop.type=='1'?'美发':''}}</div>
                        <div v-show="shop.type=='2'">{{shop.type=='2'?'美容':''}}</div>
                        <div v-show="shop.type=='3'">{{shop.type=='3'?'综合':''}}</div>
                    </el-form-item><br/>
                    <el-form-item label="注册日期：" class="formItemClass">{{shop.regtime}}</el-form-item>
                    <el-form-item label="联系人：" class="formItemClass">{{shop.contacts}}</el-form-item><br/>
                    <el-form-item label="省市区：" class="formItemClass">
                        {{(shop.provincename?shop.provincename:'')+'-'+(shop.cityname?shop.cityname:'')+'-'+(shop.areaname?shop.areaname:'')}}</el-form-item>
                    <el-form-item label="联系电话：" class="formItemClass">{{shop.moblie}}</el-form-item><br/>
                    <el-form-item label="详细地址：" class="formItemClass">{{shop.address}}</el-form-item>
                    <el-form-item label="线上业务：" class="formItemClass">{{shop.isyy=='Y'?'开启':'关闭'}}</el-form-item><br/>
                    <el-form-item label="经纬度：" class="formItemClass">{{shop.lat +' , ' + shop.lng}}</el-form-item>
                    <el-form-item label="营业时间：" class="formItemClass">{{shop.openTime}}</el-form-item><br/>
                </el-form>
            </el-col>
        </el-row>

        <yid-dialog :title="editshop.title" :visible.sync="editshop.visible" @close="editshop.visible=false" width="800px">
            <el-form :model="shop"  :rules="shopRules" label-width="130px" label-position="right" ref="editForm">
                <el-form-item label="门店名称：" prop="shopname"><el-input v-model="shop.shopname"/></el-form-item>
                <el-form-item label="预约名称：" prop="yyshopname"><el-input v-model="shop.yyshopname" /></el-form-item>
                <el-form-item label="联系人：" prop="contacts"><el-input v-model="shop.contacts" /></el-form-item>
                <el-form-item label="联系电话：" prop="moblie"><el-input v-model="shop.moblie" /></el-form-item>
                <el-form-item label="省市区：" prop="pca">
                    <el-cascader v-model="shop.pca" :options="proCityArea" :props="{value:'code',label:'name'}" style="width: 320px"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="address"><el-input v-model="shop.address"/></el-form-item>
                <el-form-item label="营业时间：" prop="openTime"><el-input v-model="shop.openTime"/></el-form-item><br/>
                <el-form-item>
                    <el-button type="primary" @click="updateShop()">保存</el-button>
                    <el-button @click="editshop.visible=false" style="padding-left: 15px;">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="shopImage.title" :visible.sync="shopImage.visible" @close="shopImage.visible=false" width="640px">
            <div style="margin-bottom: 10px">
                <el-button @click="saveShopImages()" type="primary" style="margin-top: 10px;margin-right: 5px;">确定</el-button>
                <lebal>建议上传图片分辨率为233px *455px；支持图片格式：jpg、png最多仅支持上传6张</lebal></div>
                <el-upload
                    action="https://sass.yidmall.com/api/api-file/files-anon"
                    :headers="myheaders"
                    :on-success="uploadSuccess"
                    :before-upload="beforerUpload"
                    :on-remove="handleRemove"
                    :file-list="shopImage.shopImages"
                    list-type="picture-card">
                <i slot="default" class="el-icon-plus"></i>
            </el-upload>
        </yid-dialog>

        <el-dialog :title="shopmap.title" :visible.sync="shopmap.visible" @close="shopmap.visible=false" width="600px">
            <iframe id="mapPage" width="100%" height="500px" frameborder=0 src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OLEBZ-25DCQ-GHY5C-GJ6B4-BPHC2-4GF2N&referer=myapp">
            </iframe>
            <el-form ref="addressForm" label-width="200px">
                <el-form-item>
                    <el-button type="primary" @click="setLocation()" >确定</el-button>
                    <el-button @click="shopmap.visible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog :title="shopQCode.title" :visible.sync="shopQCode.visible" @close="shopQCode.visible=false" width="450px">
            <qrcode value="Hello, World!" :options="{ width: 400 }"></qrcode>
        </el-dialog>

    </div>
</template>

<script>
    import service from '@src/service'

    let location;


    export default {
        name: "shopinfo",
        data(){
            return {
                myheaders:{},
                shop:{
                    shopname:'',shopcode:'',shopImages:[],id:""
                },
                editshop:{
                    title:'修改门店信息',
                    visible:false
                },
                shopImage:{
                    title: '修改门店宣传图',
                    visible: false,
                    shopImages:[]
                },
                shopmap:{
                    title: '修改经纬度',
                    visible: false,
                },
                shopQCode:{
                    type: 1,
                    title: '门店收银开单码',
                    visible: false,
                },
                proCityArea:[],
                shopRules:{
                    shopname:[{required: true, message:'请填写门店名称'}, {min: 0, max: 12, message: '支付名称在12个字符以内'}],
                    yyshopname:[{required: true, message:'请填写门店预约名称'},{min: 0, max: 12, message: '支付名称在12个字符以内'}],
                    contacts:[{required: true, message:'请填写联系人'}],
                    moblie:[{required: true, message:'请填写联系电话'}],
                    pca:[{required: true, message:'请选择省市区'}],
                    address:[{required: true, message:'请填写详细地址'}],
                    openTime:[{required: true, message:'请填写营业时间'}]
                }
            }
        },
        mounted() {
            this.myheaders={
                authorization:'Bearer ' + $yid.cache.get($yid.type.USER.TOKEN)
            };
            window.addEventListener('message', function(event) {
                // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                var loc = event.data;
                if (loc && loc.module == 'locationPicker') {
                    //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                    console.log('location', loc);
                    location = loc;
                }else{
                    //$yid.util.error("定位失败，请重试");
                }
            }, false);
        },
        methods:{
            init(obj){
                if(obj != null){
                    this.id = obj.id;
                }

                this.getProCityArea();
            },
            openQcode(){
                this.shopQCode.visible=true
            },
            openShopImage(){
                this.shopImage.visible=true;
                this.shopImage.shopImages=[];
                this.shop.shopImages.forEach(m =>{
                    this.shopImage.shopImages.push({url:m.photoPath})
                })
            },
            getProCityArea(){
                service.shop.getProCityArea().then(res =>{
                    this.proCityArea=res.data;
                    this.getShopInfo();
                    this.getShopImages();
                })
            },
            getShopInfo(){
                service.shop.getShopInfo().then(res =>{
                    this.shop=res.data;
                    this.shop.pca=[];
                    this.proCityArea.map(p =>{
                        if(this.shop.province && this.shop.province==p.code){
                            this.shop.provincename=p.name;
                            this.shop.pca.push(p.code)
                            p.children.map(c =>{
                                if(this.shop.city && this.shop.city==c.code){
                                    this.shop.cityname=c.name;
                                }
                                this.shop.pca.push(c.code)
                                c.children.map(a =>{
                                    if(this.shop.area && this.shop.area==a.code){
                                        this.shop.areaname=a.name;
                                    }
                                    this.shop.pca.push(a.code)
                                })
                            } )
                        }
                    })
                })
            },
            getShopImages(){
                service.shop.getShopImages().then(res =>{
                    this.shopImages=res.data.data;
                })
            },
            editShopInfo(){
                this.editshop.visible=true;
            },
            beforerUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    $yid.util.error('上传头像图片只能是 JPG/PNG 格式!');
                    return;
                }
                if (!isLt2M) {
                    $yid.util.error('上传头像图片大小不能超过 10MB!');
                    return;
                }
                return isJPG && isLt2M;
            },
            uploadSuccess(res, file) {
                this.shopImage.shopImages.push(
                    {
                        url:res.data.url,
                        showOrder:this.shopImages.length
                    }
                )
            },
            handleRemove(file) {
                if(file){
                    this.shopImage.shopImages.map((m,index) =>{
                        if(file.url == m.url){
                            this.shopImage.shopImages.splice(index,1)
                        }
                    })
                }
                console.log(file);
            },
            saveShopImages(){
                if(!this.shopImage.shopImages && this.shopImage.shopImages.length==0){
                    $yid.util.error('请上传门店宣传图!');
                    return
                }
                if(this.shopImage.shopImages.length>6){
                    $yid.util.error('最多上传6张图片!');
                    return
                }
                const params = {
                    id:this.shop.id,
                    imageFlag:'1',
                    shopImages:[]
                };
                this.shopImage.shopImages.map((m,index) =>{
                    params.shopImages.push({
                        shopid:this.shop.id,
                        photoPath:m.url,
                        showOrder:index+1
                    })
                })
                this.saveShop(params)
            },
            setLocation(){
                if(!location){
                    $yid.util.error('没有定位，请选择定位!');
                    return
                }
                const params={
                    id:this.shop.id
                };
                params.lat=location.latlng.lat;
                params.lng=location.latlng.lng;
                this.saveShop(params)
            },
            updateShop(){
                const that=this;
                this.$refs['editForm'].validate(valid => {
                    if (valid) {
                        if(!$yid.validate.telephone(that.shop.moblie) && !$yid.validate.mobile(that.shop.moblie)){
                            $yid.util.error('联系电话格式不对!');
                            return
                        }
                        const params={...that.shop};
                        if(that.shop.pca && that.shop.pca.length==3){
                            params.province=that.shop.pca[0];
                            params.city=that.shop.pca[1];
                            params.area=that.shop.pca[2];
                        }
                        that.saveShop(params);
                    }
                })
            },
            saveShop(params){
                service.shop.saveShop(params).then(res =>{
                    if(res.resp_code=="200"){
                        $yid.util.success(res.resp_msg);
                        this.closeDialog();
                        this.getShopInfo();
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            closeDialog(){
                this.shop.visible=false;
                this.editshop.visible=false;
                this.shopImages.visible=false;
            },
        }
    }
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }

    .formItemClass {
        width: 380px;
    }

    .formItemClass1 {
        width: 340px;
    }

</style>
