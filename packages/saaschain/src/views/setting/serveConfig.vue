<template>
    <div class="dept">
        <el-form inline>
            <el-form-item label="">
                <el-button type="primary" @click="add()">新增</el-button>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="mutiImportAlert()">批量导入服务项目</el-button>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="exportServs()">导出服务项目</el-button>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="mutiPriceChange()">批量修改会员卡折扣价</el-button>
            </el-form-item> 
            <br/>
            <el-form-item label="筛选">
                <el-select clearable filterable v-model="form.branch"  @change="changeBranch" placeholder="请选择部门" style="width: 160px;">
                    <el-option
                            v-for="item in branch"
                            :key="item.id"
                            :label="item.bname"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select clearable filterable v-model="form.scode" placeholder="请选择分类" style="width: 160px;">
                    <el-option
                            v-for="item in serviceType"
                            :key="item.id"
                            :label="item.sname"
                            :value="item.scode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input clearable v-model="form.servname" placeholder="请输入名称" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select clearable v-model="form.status"  placeholder="请选择状态" style="width: 120px;">
                    <el-option label="停用" value="2"></el-option>
                    <el-option label="正常" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryServData()">查询</el-button>
            </el-form-item>
        </el-form>

        <yid-table ref="table"  :data="serveData" @selection-change="handleServicesChange">
            <yid-table-column type="selection" prop="servid" width="55"></yid-table-column>
            <yid-table-column label="编号"  prop="servcode" width="60"></yid-table-column>
            <yid-table-column label="名称"  prop="servname" width="120">
                <template slot-scope="scope">
                    <label style="color:blue" @click="editService(scope.row)">{{scope.row.servname}}</label>
                </template>
            </yid-table-column>
            <yid-table-column label="所属部门"  prop="dept" width="80"></yid-table-column>
            <yid-table-column label="分类"  prop="servtname" width="70"></yid-table-column>
            <yid-table-column label="类别"  prop="sertype" width="80">
                <template slot-scope="scope">
                    <label>{{scope.row.sertype=='1'?'大项目':'小项目'}}</label>
                </template>
            </yid-table-column>
            <yid-table-column label="套餐销售" prop="issale" width="80">
                <template slot-scope="scope">
                    <label>{{scope.row.issale=='1'?'允许':'不允许'}}</label>
                </template>
            </yid-table-column>
            <yid-table-column label="回访短信"  prop="isSms" width="80">
                <template slot-scope="scope">
                    <label>{{scope.row.isSms=='1'?'发送':'不发送'}}</label>
                </template>
            </yid-table-column>
            <yid-table-column label="基础定价"  prop="price" width="140">
                <template slot-scope="scope">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="2"><i class="el-icon-edit" @click="editPrice(scope.row)"></i></el-col>
                        <el-col :span="22">
                            <div>{{scope.row.price?'￥'+scope.row.price:''}}</div>
                            <div>{{scope.row.minPrice?'最低价:'+scope.row.minPrice+'元':''}}</div>
                        </el-col>
                    </el-row>
                </template>
            </yid-table-column>
            <yid-table-column label="会员卡折扣价设定"  prop="discount" width="180">
                <template slot-scope="scope">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="22">
                            <div :key="item.id" v-for="item in scope.row.servcards">{{item.cardname}}   {{item.dtype=='1'?item.value+'折':item.value+'元'}}</div>
                        </el-col>
                        <el-col :span="2"><i class="el-icon-plus" @click="editDiscount(scope.row)"></i></el-col>
                    </el-row>
                </template>
            </yid-table-column>
            <yid-table-column label="员工特殊价格设置"  prop="special" width="180">
                <template slot-scope="scope">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="22">
                            <div :key="item.id" v-for="item in scope.row.servspecs">
                                {{item.btype=='1'?item.pslname:item.eename}}  {{item.specialPrice+'元'}}
                            </div>
                        </el-col>
                        <el-col :span="2"><i class="el-icon-plus" @click="editSpeical(scope.row)"></i></el-col>
                    </el-row>
                </template>
            </yid-table-column>
            <yid-table-column label="状态"  prop="status" width="120">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editService(scope.row)">编辑</el-link>
                    <el-switch style="margin: 0 10px 0 10px;"
                            @change="stop(scope.row)"
                            v-model="scope.row.status=='1'?true:false"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </yid-table-column>
        </yid-table>

        <yid-dialog :title="addDialog.title" :visible.sync="addDialog.visible" @close="levelCancel" width="600px">
            <el-form :model="addDialog"  label-width="150px" ref="copyForm">
                <el-form-item label="项目编号：" prop="addDialog.servcode" :rules="[{required: true,message:'请填写项目编号'}]">
                    <el-input :value="addDialog.servcode" disabled placeholder="编号从001开始递增，不可重复"/>
                </el-form-item>
                <el-form-item label="项目名称：" prop="addDialog.servname" :rules="[{required: true,message:'请填写项目名称'}]">
                    <el-input v-model="addDialog.servname" placeholder="不超过10个汉字"/>
                </el-form-item>
                <el-form-item label="项目分类：" prop="addDialog.branch" :rules="[{required: true,message:'请选择项目分类'}]">
                    <el-select v-model="addDialog.branch" @change="changeServBranch" placeholder="请选择部门"  style="width: 160px;">
                        <el-option
                                v-for="item in branch"
                                :key="item.id"
                                :label="item.bname"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="addDialog.servtid" @change="changeServType" placeholder="请选择类别" style="width: 160px;margin-left: 20px;">
                        <el-option
                                v-for="item in addDialog.serviceType"
                                :key="item.id"
                                :label="item.sname"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目类别：">
                    <el-radio-group v-model="addDialog.sertype">
                        <el-radio :label="1">大项</el-radio>
                        <el-radio :label="2">小项</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否允许套餐销售：">
                    <el-radio-group v-model="addDialog.issale">
                        <el-radio :label="1">允许</el-radio>
                        <el-radio :label="0">不允许</el-radio>
                    </el-radio-group>
                    <el-popover style="padding-left: 10px;"
                            placement="right"
                            title="提示"
                            width="380"
                            trigger="hover">
                        <el-button slot="reference"><i class="el-icon-question"></i></el-button>
                        <ul class="tips-content">
                            <li>设置允许套餐销售可以销售单个项目的套餐</li>
                        </ul>
                    </el-popover>
                </el-form-item>
                <el-form-item label="回访短信：">
                    <el-radio-group v-model="addDialog.isSms">
                        <el-radio :label="0">不发送</el-radio>
                        <el-radio :label="1">发送</el-radio>
                    </el-radio-group>
                    <el-popover style="padding-left: 10px;"
                            placement="right"
                            title="提示"
                            width="380"
                            trigger="hover">
                        <el-button slot="reference"><i class="el-icon-question"></i></el-button>
                        <ul class="tips-content">
                            <li>如果设置该项目发送回访短信，则顾客做完该项目后,</li>
                            <li>系统将自动发送短信到顾客手机上回访，顾客收到短信后可直接回复,</li>
                            <li>回访短信内容在“菜单> 基础配置>短信消息设置”中设定，</li>
                            <li>顾客反馈的短信内容保留在短信回复记录中。</li>
                        </ul>
                    </el-popover>
                </el-form-item>
                <el-form-item label="项目图片：">
                    <el-upload
                            class="avatar-uploader"
                            action="https://sass.yidmall.com/api/api-file/files-anon"
                            :headers="myheaders"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="addDialog.photopath" :src="addDialog.photopath" class="avatar el-upload">
                        <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
                        <div class="el-upload__tip" slot="tip">仅支持jpg，png格式的图片上传 图片尺寸：120px*150px</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveService()">保存</el-button>
                    <el-button @click="levelCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="priceDialog.title" :visible.sync="priceDialog.visible" @close="levelCancel" width="450px">
            <el-form :model="priceDialog"  label-width="150px" ref="copyForm">
                <el-form-item label="项目名称：">
                    {{priceDialog.title}}
                </el-form-item>
                <el-form-item label="基础定价：" prop="priceDialog.price" :rules="[{required: true,message:'请填基础定价'}]">
                    <el-input clearable type="number" min="1" v-model="priceDialog.price"/><br/>
                    <!--<el-checkbox v-model="priceDialog.allowDiscount" @change="changAllowDiscount">允许手动改价</el-checkbox>-->
                </el-form-item>
                <el-form-item label="最低价：">
                    <el-input clearable type="number" min=0 :max="priceDialog.price" v-model="priceDialog.minPrice"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="salePriceDialog">保存</el-button>
                    <el-button @click="levelCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="discountDialog.title" :visible.sync="discountDialog.visible" @close="levelCancel" width="550px">
            <el-form :model="discountDialog"  label-width="150px" ref="copyForm">
                <el-form-item label="设置方式">
                    <el-select style="width: 160px;" v-model="discountDialog.type">
                        <el-option label="不设置" value="0"></el-option>
                        <el-option label="单独设置" value="1"></el-option>
                        <el-option label="全部会员卡" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="discountDialog.type==1">
                    <el-form-item :label="card.cardname" :key="card.cardid" v-for="card in discountDialog.cards">
                        <el-select clearable style="width: 160px;" @change="checkDiscount(card)" v-model="card.dtype">
                            <el-option label="折扣" value="1"></el-option>
                            <el-option label="会员价" value="2"></el-option>
                        </el-select>
                        <el-input clearable type="number" min="1" @blur="checkDiscount(card)" v-model="card.value" style="width: 100px;margin-left:15px"/>
                        <label-wrap v-show="card.dtype" v-text="card.dtype==1?'折':'元'"></label-wrap>
                    </el-form-item>
                </template>
                <template v-if="discountDialog.type==2">
                    <el-form-item :label="discountDialog.card.cardname" >
                        <el-select clearable style="width: 160px;" @change="checkDiscount(card)" v-model="discountDialog.card.dtype">
                            <el-option label="折扣" value="1"></el-option>
                            <el-option label="会员价" value="2"></el-option>
                        </el-select>
                        <el-input clearable type="number" min="1" @blur="checkDiscount(discountDialog.card)" v-model="discountDialog.card.value" style="width: 100px;margin-left:15px"/>
                        <label-wrap v-show="discountDialog.card.dtype" v-text="discountDialog.card.dtype==1?'折':'元'"></label-wrap>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="saveDiscount()">保存</el-button>
                    <el-button @click="levelCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="speicalDialog.title" :visible.sync="speicalDialog.visible" @close="levelCancel" width="auto">
            <el-row type="flex" justify="space-between">
                <el-col :span="6">
                    <el-select v-model="speicalDialog.type" @change="changSpeicalType">
                        <el-option
                                label="按职位级别"
                                value="1">
                        </el-option>
                        <el-option
                                label="按个人"
                                value="2">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="speicalDialog.id" @change="changSpeicalData" >
                        <el-option :key="item.id" v-for="item in speicalDialog.speicalData" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="12" style="text-align: right">
                    <el-button type="primary" @click="addSpeicalRow()">添加</el-button>
                </el-col>
            </el-row>
            <yid-table ref="table" style="margin-top: 15px;" :data="speicalDialog.speicalRows">
                <yid-table-column label="职位" min-width="150" prop="btype">
                    <template slot-scope="scope">
                        <div>[{{scope.row.btype=="1"?"职务级别":"个人"}}]{{scope.row.btype=="1"?scope.row.pslname:scope.row.eename}}</div>
                    </template>
                </yid-table-column>
                <yid-table-column label="特殊价格" min-width="120" prop="specialPrice">
                    <template slot-scope="scope">
                        <el-input clearable type="number" min="1" placeholder="必填" v-model="scope.row.specialPrice"/>
                    </template>
                </yid-table-column>
                <yid-table-column label="最低价格" min-width="130" prop="minPrice">
                    <template slot-scope="scope">
                        <el-input clearable type="number" min="1" :max="scope.row.specialPrice" @blur="checkSpecialPrice(scope.row)" placeholder="不必填" v-model="scope.row.minPrice"/>
                    </template>
                </yid-table-column>
                <yid-table-column label="会员卡折扣" min-width="380" align="left">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.discountType" style="width:120px">
                            <el-option label="不设置" value="0"></el-option>
                            <el-option label="单独设置" value="1"></el-option>
                            <el-option label="全部会员卡" value="2"></el-option>
                        </el-select>
                        <el-row type="flex" justify="space-between" class="margin5"
                                :key="item.cardid" v-for="item in scope.row.discounts"
                                v-show="scope.row.discountType==1">
                            <el-col :span="8">{{item.cardName}}</el-col>
                            <el-col :span="8">
                                <el-select clearable v-model="item.dtype" @change="checkDiscount(item)">
                                    <el-option label="折扣" value="1"></el-option>
                                    <el-option label="会员价" value="2"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <el-input type="number" min="1" @blur="checkDiscount(item)" v-model="item.value" clearable/>
                            </el-col>
                            <el-col :span="2"><label-wrap v-show="item.dtype" v-text="item.dtype==1?'折':'元'"></label-wrap></el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between" v-show="scope.row.discountType==2" >
                            <el-col :span="9">
                                <el-select clearable v-model="scope.row.dtype" @change="checkDiscount(scope.row)">
                                    <el-option label="折扣" value="1"></el-option>
                                    <el-option label="会员价" value="2"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="9">
                                <el-input type="number" min="1" @blur="checkDiscount(scope.row)" v-model="scope.row.value" clearable/>
                            </el-col>
                            <el-col :span="6"><label-wrap v-show="scope.row.dtype" v-text="scope.row.dtype==1?'折':'元'"></label-wrap></el-col>
                        </el-row>
                    </template>
                </yid-table-column>
                <yid-table-column label="操作" min-width="80">
                    <template slot-scope="scope">
                        <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteSpeicalRow(scope.row)">删除</el-link>
                    </template>
                </yid-table-column>
            </yid-table>
            <el-row  justify="space-between" class="margin5">
                <el-col :span="2" :offset="10"><el-button type="primary" @click="saveSpeical()">保存</el-button></el-col>
                <el-col :span="2" ><el-button @click="levelCancel">取消</el-button></el-col>
                <el-col :span="10"></el-col>
            </el-row>
        </yid-dialog>

        <yid-dialog :title="mutiPriceDialog.title" :visible.sync="mutiPriceDialog.visible" @close="levelCancel" width="760px">
            <div style="margin: 8px 10px;">折扣设置为0时,不打折。输入框为空时表示不设置（没有设置项目的会员卡折扣，项目会员卡价格应用基础折扣）</div>
            <el-form :model="mutiPriceDialog"  label-width="150px" ref="copyForm">
                <el-form-item label="所选项目">
                    <!--<el-row :gutter="20" type="flex" class="mutirow">-->
                        <!--<el-col :span="3" :key="item.id" v-for="item in servids"><el-tag type="info">{{item.servname}}</el-tag></el-col>-->
                    <!--</el-row>-->
                    <el-tag :key="item.id" v-for="item in servids" :disable-transitions="false">
                        {{item.servname}}
                    </el-tag>
                </el-form-item>
                <el-form-item label="设置方式">
                    <el-select placeholder="请选择" style="width: 160px;" v-model="mutiPriceDialog.type">
                        <el-option label="不设置" value="0"></el-option>
                        <el-option label="单独设置" value="1"></el-option>
                        <el-option label="全部会员卡" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="mutiPriceDialog.type==1">
                    <el-form-item :label="card.cardname" :key="card.cardid" v-for="card in mutiPriceDialog.cards" >
                        <el-select clearable v-model="card.dtype" @change="checkDiscount(card)" style="width: 160px;">
                            <el-option label="折扣" value="1"></el-option>
                            <el-option label="会员价" value="2"></el-option>
                        </el-select>
                        <el-input type="number" min="1" @blur="checkDiscount(card)" v-model="card.value" style="width: 100px;margin-left:15px"/>
                        <label-wrap v-show="card.dtype" v-text="card.dtype==1?'折':'元'"></label-wrap>
                    </el-form-item>
                </template>
                <template v-if="mutiPriceDialog.type==2">
                    <el-form-item :label="mutiPriceDialog.card.cardname" >
                        <el-select clearable  v-model="mutiPriceDialog.card.dtype" @change="checkDiscount(mutiPriceDialog.card)" style="width: 160px;">
                            <el-option label="折扣" value="1"></el-option>
                            <el-option label="会员价" value="2"></el-option>
                        </el-select>
                        <el-input type="number" min="1" @blur="checkDiscount(mutiPriceDialog.card)" v-model="mutiPriceDialog.card.value" style="width: 100px;margin-left:15px"/>
                        <label-wrap v-show="mutiPriceDialog.card.dtype" v-text="mutiPriceDialog.card.dtype==1?'折':'元'"></label-wrap>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="saveMutiPrice()">保存</el-button>
                    <el-button @click="levelCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="mutiImportDialog.title" :visible.sync="mutiImportDialog.visible" @close="levelCancel" width="700px">
            <el-form :model="mutiImportDialog.model"  label-width="120px" ref="copyForm" :label-position="labelPosition">
                <p>批量导入服务项目方法</p>
                <p>1、点击链接：下载服务项目模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入服务项目信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link type="primary" @click="downExcelTemplate()">服务项目模板</el-link>
                </el-form-item>

                <el-form-item label="选择导入文件:">
                    <el-upload ref="upload"
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :before-upload="handleChange">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入3000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportServs()" type="primary">保存</el-button>
                    <el-button @click="levelCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import {exportExecl,imporExecl} from "../../library/helper/execl";
    import download from '@src/library/http/download'
    export default {
        data() {
            return {
                myheaders:{},
                labelPosition: 'left',
                mutiPrice: '1',
                discountV: 1,
                serveData: [],
                discountData: [],
                addDialog: {
                    type: '',
                    title: '',
                    visible: false,
                    servid: '',
                    servcode: '',
                    servname: '',
                    branch: '',
                    dept: '',
                    servtid: '',
                    servtcode: '',
                    servtname: '',
                    sertype: '',
                    issale: '',
                    isSms: '',
                    photopath: '',
                    serviceType:[]
                },
                priceDialog: {
                    title: '',
                    visible: false,
                    servid: '',
                    price: '',
                    minPrice: '',
                    allowDiscount: true
                },
                discountDialog: {
                    servid: '',
                    title: '',
                    visible: false,
                    type: '',
                    cards: [],
                    card: {
                        cardid: '-1',
                        dtype: '',
                        value: '',
                        cardname: '全部会员卡'
                    }
                },
                speicalDialog: {
                    servid:'',
                    title: '',
                    visible: false,
                    type: '1',
                    speicalData: [],
                    id: '',
                    code: '',
                    name: '',
                    speicalRows: [],
                    cards: []
                },
                mutiPriceDialog: {
                    title: '',
                    visible: false,
                    type: '0',
                    cards: [],
                    card: {
                        cardid: '-1',
                        dtype: '',
                        value: '',
                        cardname: '全部会员卡'
                    }
                },
                mutiImportDialog: {
                    title: '',
                    visible: false,
                    servs: []
                },
                imageUrl: '',
                branch: [],
                serviceType: [],
                serviceAllType: [],
                form: {
                    branch: '',
                    scode:'',
                    servname:'',
                    status:'1',
                },
                employees: [],
                positions: [],
                servids: [],
            }
        },
        methods: {
            lookup(){
                this.queryServData();
                if(this.form.status=='1'){
                    this.form.status='2'
                }else{
                    this.form.status='1'
                }
            },
            levelCancel(){
                this.addDialog.visible = false;
                this.priceDialog.visible = false;
                this.discountDialog.visible = false;
                this.speicalDialog.visible = false;
                this.mutiPriceDialog.visible = false;
                this.mutiImportDialog.visible = false;
            },
            handleServicesChange(val){
                this.servids = val;
            },
            del(){
                if(!this.servids || this.servids.length==0){
                    yid.util.error("请选择服务项目");
                    return;
                }
                const than=this;
                yid.util.confirm('确定删除服务项目？', '','', ()=> {
                    const ids=[];
                    than.servids.forEach(item =>{
                        ids.push(item.id);
                    })
                    service.serviceInfo.deleteService({ids:ids.toString()}).then(res =>{
                        if(res.resp_code=="200"){
                            than.queryServData();
                            yid.util.success(res.resp_msg);
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    })
                })
            },
            add() {
                this.addDialog.type = '1';
                this.addDialog.title = '新增项目';
                this.addDialog.visible = true;
                this.addDialog.servid=undefined;
                this.addDialog.servcode='';
                this.addDialog.servname='';
                this.addDialog.branch='';
                this.addDialog.dept='';
                this.addDialog.servtid='';
                this.addDialog.servtcode='';
                this.addDialog.servtname='';
                this.addDialog.sertype=1;
                this.addDialog.issale=1;
                this.addDialog.isSms=2;
                this.addDialog.photopath='';
                this.addDialog.serviceType=[];
                service.serviceInfo.newcode().then(res => {
                    this.addDialog.servcode=res.data;
                })
                this.myheaders={
                    authorization:'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
            },
            stop(row) {
                const that=this;
                if(row.status=="1"){
                    service.serviceInfo.checkPackage(row.id).then(res =>{
                        if(res.resp_code=="200" && res.data){
                            yid.util.confirm('售卖的套餐['+res.data+']中包含此项目，停用后该套餐也将停止销售。是否继续停用？', '','', ()=> {
                                row.status="2";
                                const params={
                                    id:row.id,
                                    status:'2'
                                }
                                that.save(params);
                            },()=>{
                                row.status="1";
                            })
                        }else if(res.resp_code=="200"){
                            row.status="2";
                            const params={
                                id:row.id,
                                status:'2'
                            }
                            that.save(params);
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    })
                }else{
                    row.status="1";
                    const params={
                        id:row.id,
                        status:'1'
                    }
                    this.save(params);
                }
            },
            changeServBranch(id){
                this.addDialog.serviceType=[];
                this.serviceAllType.forEach(item =>{
                    if(id==item.branch){
                        this.addDialog.serviceType.push(item);
                    }
                })
                this.branch.forEach(item =>{
                    if(id==item.id){
                        this.addDialog.dept=item.bname;
                    }
                })
            },
            changeServType(id){
                this.addDialog.serviceType.forEach(item =>{
                    if(id==item.id){
                        this.addDialog.servtcode=item.scode;
                        this.addDialog.servtname=item.sname;
                    }
                })
            },
            editService(row){
                this.changeServBranch(row.branch);
                this.addDialog.type = '2';
                this.addDialog.title = '编辑项目';
                this.addDialog.visible = true;
                this.addDialog.servid=row.id;
                this.addDialog.servcode=row.servcode;
                this.addDialog.servname=row.servname;
                this.addDialog.branch=String(row.branch);
                this.addDialog.dept=row.dept;
                this.addDialog.servtid=String(row.servtid);
                this.addDialog.servtcode=row.servtcode;
                this.addDialog.servtname=row.servtname;
                this.addDialog.sertype=Number(row.sertype);
                this.addDialog.issale=Number(row.issale);
                this.addDialog.isSms=Number(row.isSms);
                this.addDialog.photopath=row.photopath;
                this.addDialog.revision=row.revision;
            },
            saveService(){
                if(!this.addDialog.servname){
                    yid.util.error("请填写服务项目名称");
                    return;
                }else{
                    if(this.addDialog.servname.length>10){
                        yid.util.error("服务项目名称不能超过10个汉字")
                        return;
                    }
                }
                if(!this.addDialog.servtid){
                    yid.util.error("请选择项目分别");
                    return;
                }else{
                    this.serviceType.forEach(item =>{
                        if(this.addDialog.servtid==item.id){
                            this.addDialog.servtcode=item.scode;
                            this.addDialog.servtname=item.sname;
                        }
                    })
                }
                const params={};
                if( this.addDialog.type =='2'){
                    params.id = this.addDialog.servid;
                }else{
                    params.status='1';
                }
                params.servname=this.addDialog.servname;
                params.branch=this.addDialog.branch;
                params.dept=this.addDialog.dept;
                params.servtid=this.addDialog.servtid;
                params.servtcode=this.addDialog.servtcode;
                params.sertype=this.addDialog.sertype;
                params.issale=this.addDialog.issale;
                params.isSms=this.addDialog.isSms;
                params.photopath=this.addDialog.photopath;
                params.revision=this.addDialog.revision;
                this.save(params);
            },
            editPrice(row) {
                this.priceDialog.title = row.servname;
                this.priceDialog.visible = true;
                this.priceDialog.servid =row.id;
                this.priceDialog.price = row.price;
                this.priceDialog.minPrice = row.allowDiscount=='1'?row.minPrice:'';
                this.priceDialog.allowDiscount = row.allowDiscount=='1'?true:false;
                this.priceDialog.revision = row.revision;
            },
            changAllowDiscount(){
                if(!this.priceDialog.allowDiscount){
                    this.priceDialog.minPrice = '';
                }
            },
            salePriceDialog(){
                if(!this.priceDialog.price){
                    yid.util.error("基础定价必填")
                    return
                }
                if(Number(this.priceDialog.minPrice) > Number(this.priceDialog.price)){
                    yid.util.error("最低价不能超过基础定价")
                }else{
                    const params={};
                    params.id=this.priceDialog.servid;
                    params.price=Number(this.priceDialog.price);
                    params.minPrice=Number(this.priceDialog.minPrice);
                    params.revision=this.priceDialog.revision;
                    this.save(params);
                }
            },
            editSpeical(row) {
                this.speicalDialog.title = '员工特殊价格设置';
                this.speicalDialog.visible = true;
                this.speicalDialog.servid = row.id;
                this.speicalDialog.speicalRows = [];
                if(row.servspecs && row.servspecs.length>0){
                    row.servspecs.filter(item =>{
                        this.speicalDialog.speicalRows.push({...item})
                    })
                }
                this.changSpeicalType(this.speicalDialog.type);
            },
            changSpeicalType(id){
                this.speicalDialog.id='';
                if(id=="1"){
                    this.speicalDialog.speicalData=this.positions;
                }else{
                    this.speicalDialog.speicalData=this.employees;
                }
            },
            changSpeicalData(id){
                this.speicalDialog.speicalData.forEach(item =>{
                    if(id==item.id){
                        this.speicalDialog.code=item.code;
                        this.speicalDialog.name=item.name;
                    }
                })
            },
            addSpeicalRow(){
                if(!this.speicalDialog.id){
                    yid.util.error("请选择职务或者员工");
                    return;
                }
                let flag=false;
                this.speicalDialog.speicalRows.forEach(item =>{
                    if(item.btype=="1" && this.speicalDialog.type=="1" && item.pslid==this.speicalDialog.id){
                        flag=true;
                    }
                    if(item.btype=="2" && this.speicalDialog.type=="2" && item.eeid==this.speicalDialog.id){
                        flag=true;
                    }
                })
                if(flag){
                    yid.util.error(this.speicalDialog.name+"已经在表格中")
                    return;
                }
                const discounts=[];
                this.speicalDialog.cards.filter(item =>{
                    discounts.push({...item})
                })
                this.speicalDialog.speicalRows.push({
                    servid: this.speicalDialog.servid,
                    pslid: this.speicalDialog.type=="1"?this.speicalDialog.id:'',
                    pslcode:this.speicalDialog.type=="1"?this.speicalDialog.code:'',
                    pslname:this.speicalDialog.type=="1"?this.speicalDialog.name:'',
                    eeid:this.speicalDialog.type=="2"?this.speicalDialog.id:'',
                    eecode:this.speicalDialog.type=="2"?this.speicalDialog.code:'',
                    eename:this.speicalDialog.type=="2"?this.speicalDialog.name:'',
                    btype:this.speicalDialog.type,
                    specialPrice:'',
                    minPrice:'',
                    discountType:'0',
                    discounts: discounts,
                    dtype:'',
                    value:''
                })

            },
            checkSpecialPrice(data){
                if(data.specialPrice && data.minPrice && data.minPrice>data.specialPrice){
                    yid.util.error("最低价不能超过基础定价")
                    data.minPrice="";
                    return;
                }
            },
            deleteSpeicalRow(row){
                let num=-1;
                this.speicalDialog.speicalRows.forEach((item,index) => {
                    if(row.btype==item.btype && (row.pslid==item.pslid || row.eeid==item.eeid)){
                        num=index;
                    }
                })
                if(num>=0){
                    this.speicalDialog.speicalRows.splice(num,1);
                }
            },
            saveSpeical(){
                let message="";
                this.speicalDialog.speicalRows.forEach(item =>{
                    if(!item.specialPrice){
                        message+=(item.dtype=='1'?item.pslname:item.eename)+"特殊价必填";
                    }
                })
                if(message){
                    yid.util.error(message);
                    return;
                }
                let messcode="";let messname="";
                this.speicalDialog.speicalRows.forEach(item =>{
                    const name=item.btype=='1'?item.pslname:item.eename;
                    if(item.discountType=="1" && item.discounts){
                        let i=0;
                        item.discounts.forEach(dis =>{
                            if(dis.dtype && dis.value) i++;
                            if((!dis.dtype && dis.value) || (dis.dtype && !dis.value))
                                message+=name+":"+ dis.cardName+" ";
                            if(dis.dtype=="1" && dis.value && (dis.value>10 || dis.value<0))
                                messcode+=name+":"+ dis.cardname+" ";
                        })
                        if(i==0){
                            messname+=name+" ";
                        }
                    }
                    if(item.discountType=="2"){
                        if(!item.dtype || !item.value)
                            message+=name+":"+"全部会员卡 ";
                        if(item.dtype=="1" && item.value && (item.value>10 || item.value<0))
                            messcode+=name+":"+"全部会员卡 ";
                    }
                })
                if(message || messcode || messname){
                    if(messname){
                        yid.util.error("[单卡设置:"+messname+"]不能全为空");
                    }
                    if(messcode){
                        yid.util.error("["+messcode+"]折扣范围应该是大于等于0，小于等于10");
                    }
                    if(message){
                        yid.util.error("["+message+"]折扣价没填完");
                    }
                    return;
                }
                const params={};
                this.serveData.forEach(item =>{
                    if(item.id==this.speicalDialog.servid){
                        params.id=item.id;
                        params.servspecs=this.speicalDialog.speicalRows;
                    }
                })
                service.serviceInfo.savespecials(params).then(res =>{
                    if(res.resp_code=="200"){
                        yid.util.success(res.resp_msg);
                        this.queryServData();
                        this.levelCancel();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            editDiscount(row) {
                this.discountDialog.servid = row.id;
                this.discountDialog.title = '设置会员卡折扣价';
                this.discountDialog.visible = true;
                this.discountDialog.type= row.cardtype || "0";
                this.discountDialog.revision= row.revision;
                if(this.discountDialog.type=="0"){
                    this.discountDialog.cards.forEach(item => {
                        item.dtype='';
                        item.value='';
                    })
                    this.discountDialog.card={}
                }
                if(this.discountDialog.type=="1"){
                    this.discountDialog.cards.forEach(item => {
                        item.dtype='';
                        item.value='';
                        row.servcards.forEach(card => {
                            if(item.cardid==card.cardid){
                                item.cardname=card.cardname;
                                item.dtype=card.dtype;
                                item.value=card.value;
                            }
                        })
                    })
                    this.discountDialog.card={}
                }
                if(this.discountDialog.type=="2"){
                    this.discountDialog.cards.forEach(item => {
                        item.dtype='';
                        item.value='';
                    })
                    if(row.servcards && row.servcards.length>0){
                        row.servcards.forEach(card => {
                            this.discountDialog.card.cardid=card.cardid;
                            this.discountDialog.card.cardname=card.cardname;
                            this.discountDialog.card.dtype=card.dtype;
                            this.discountDialog.card.value=card.value;
                        })
                    }else{
                        this.discountDialog.card.cardid=-1;
                        this.discountDialog.card.cardname="全部会员卡";
                        this.discountDialog.card.dtype='';
                        this.discountDialog.card.value='';
                    }
                }
            },
            checkDiscount(card){
                if(card.dtype=="1" && card.value && (card.value>10 || card.value<0)){
                    yid.util.error("折扣应该是大于等于0，小于等于10");
                    card.value="";
                    return false;
                }
            },
            saveDiscount(){
                let message=""; let messcode="";let i=0;
                if(this.discountDialog.type=='1' && this.discountDialog.cards && this.discountDialog.cards.length>0){
                    this.discountDialog.cards.forEach(card => {
                        if((!card.dtype && card.value) || (card.dtype && !card.value))
                            message+=card.cardname+" ";
                        if(card.dtype=="1" && card.value && (card.value>10 || card.value<0))
                            messcode+=card.cardname+" ";
                        if(card.dtype && card.value) i++;
                    })
                }
                if(this.discountDialog.type=='2'){
                    const card=this.discountDialog.card;
                    if(!card || !card.dtype || !card.value){
                        message+=card.cardname;
                    }
                    if(card.dtype=="1" && card.value && (card.value>10 || card.value<0)){
                        messcode+=card.cardname;
                    }
                }
                if(message || messcode){
                    if(message){
                        yid.util.error("折扣价没填完");
                    }
                    if(messcode){
                        yid.util.error("["+messcode+"]折扣应该是大于等于0，小于等于10");
                    }
                    return;
                }
                if(this.discountDialog.type=='1' && i==0){
                    yid.util.error("不能全为空");
                    return;
                }
                const params={};
                params.id=this.discountDialog.servid;
                params.cardtype=this.discountDialog.type;
                params.revision=this.discountDialog.revision;
                params.servcards=[];
                if(this.discountDialog.type=='1'){
                    this.discountDialog.cards.forEach(card => {
                        if(card.dtype && card.value){
                            params.servcards.push({
                                cardid:card.cardid,
                                cardname:card.cardname,
                                dtype:card.dtype,
                                value:card.value
                            })
                        }
                    })
                }
                if(this.discountDialog.type=='2'){
                    params.servcards.push({
                        cardid:-1,
                        cardname:'全部会员卡',
                        dtype:this.discountDialog.card.dtype,
                        value:this.discountDialog.card.value
                    })
                }
                service.serviceInfo.saveServcards(params).then(res =>{
                    if(res.resp_code=="200"){
                        yid.util.success(res.resp_msg);
                        this.queryServData();
                        this.levelCancel();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            mutiPriceChange() {
                if(!this.servids || this.servids.length==0){
                    yid.util.error("请选择服务项目");
                    return;
                }
                this.mutiPriceDialog.title = '批量设置会员卡折扣价';
                this.mutiPriceDialog.visible = true;
                this.mutiPriceDialog.type = '0';
                this.mutiPriceDialog.cards.forEach(card =>{
                    card.dtype='';
                    card.value='';
                });
                this.mutiPriceDialog.card = {
                    cardid: '-1',
                    dtype: '',
                    value: '',
                    cardname: '全部会员卡'
                };
            },
            saveMutiPrice(){
                let i=0;
                let message="", messcode="";
                if(this.mutiPriceDialog.type=='1'){
                    if(this.mutiPriceDialog.cards && this.mutiPriceDialog.cards.length>0){
                        this.mutiPriceDialog.cards.forEach(card => {
                            if((!card.dtype && card.value) || (card.dtype && !card.value)){
                                message+=card.cardname+" ";
                            }
                            if(card.dtype=="1" &&  (card.value>10 || card.value<0)){
                                messcode+=card.cardname+" ";
                            }
                            if(card.dtype && card.value) i++;
                        })
                    }
                }
                if(this.mutiPriceDialog.type=='2'){
                    const card=this.mutiPriceDialog.card;
                    if(!card.dtype || !card.value){
                        message+=card.cardname;
                    }
                    if(card.dtype=="1" && (card.value>10 || card.value<0)){
                        messcode+=card.cardname;
                    }
                }
                if(message){
                    yid.util.error("["+message+"]折扣价没填完");
                    return;
                }
                if(messcode){
                    yid.util.error("["+messcode+"]折扣应该是大于等于0，小于等于10");
                    return;
                }
                if(this.mutiPriceDialog.type=='1' && i==0){
                    yid.util.error("不能全为空");
                    return;
                }
                const params={};
                params.cardtype=this.mutiPriceDialog.type;
                if(this.mutiPriceDialog.type=='0'){
                    params.servcards=[];
                }
                if(this.mutiPriceDialog.type=='1'){
                    const cards=[];
                    this.mutiPriceDialog.cards.forEach(card => {
                        if(card.dtype && card.value){
                            cards.push({
                                cardid:card.cardid,
                                cardname:card.cardname,
                                dtype:card.dtype,
                                value:card.value
                            })
                        }
                    })
                    params.servcards=cards;
                }
                if(this.mutiPriceDialog.type=='2'){
                    params.servcards=[];
                    params.servcards.push({
                        cardid:this.mutiPriceDialog.card.cardid,
                        cardname:this.mutiPriceDialog.card.cardname,
                        dtype:this.mutiPriceDialog.card.dtype,
                        value:this.mutiPriceDialog.card.value
                    })
                }
                params.servs=this.servids;
                service.serviceInfo.batchServiceCards(params).then(res =>{
                    if(res.resp_code=="200"){
                        yid.util.success(res.resp_msg);
                        this.queryServData();
                        this.levelCancel();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            mutiImportAlert() {
                this.mutiImportDialog.title = '批量导入服务项目';
                this.mutiImportDialog.visible = true;
                this.$refs.upload.clearFiles();
            },
            changeBranch(id){
                this.form.scode='';
                this.serviceType=[];
                this.serviceAllType.forEach(item =>{
                    if(id==item.branch){
                        this.serviceType.push(item);
                    }
                })
            },
            init(){
                service.serviceInfo.findbranch().then(res => {
                    this.branch=res.data
                });
                service.serviceInfo.findServiceType().then(res => {
                    this.serviceAllType=res.data;
                })
                service.serviceInfo.findCardinfos().then(res => {
                    if(res.data){
                        res.data.forEach(item =>{
                            this.discountDialog.cards.push({cardid: item.id, cardname: item.cpname, value: '', dtype: ''});
                            this.speicalDialog.cards.push({cardid: item.id, cardName: item.cpname, value: '', dtype: ''});
                            this.mutiPriceDialog.cards.push({cardid: item.id, cardname: item.cpname, value: '', dtype: ''});
                        })
                    }
                });
                service.serviceInfo.findEmployees({"status":"1"}).then(res => {
                    this.employees=res.data;
                    if(this.employees){
                        this.employees.forEach(item =>{
                            item.code=item.eecode;
                            item.name=item.eename;
                        })
                    }
                })
                service.serviceInfo.findPositions({"status":"1"}).then(res => {
                    this.positions=res.data;
                    if(this.positions){
                        this.positions.forEach(item =>{
                            item.code=item.pslcode;
                            item.name=item.pslname;
                        })
                    }
                })
                this.queryServData();
            },
            queryServData(){
                service.serviceInfo.findServiceList({...this.form}).then(res => {
                    this.serveData=res.data;
                })
            },
            handleAvatarSuccess(res) {
                this.addDialog.photopath = res.data.url;
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
            handleChange(file){
                this.mutiImportDialog.servs=[];
                imporExecl(file,this.mutiImportDialog.servs);
            },
            saveImportServs(){
                if(this.mutiImportDialog.servs){
                    let message="";
                    const datas=this.mutiImportDialog.servs;
                    datas.forEach((item,index) =>{
                        if(item.servcode.length!=4){
                            message+="编号:"+item.servcode+",不是4位数 "
                        }
                        if(item.servname.length>10){
                            message+="名称:"+item.servname+", 大于10位汉字"
                        }
                        for(let j=index+1;j<datas.length;j++){
                            if(item.servcode==datas[j].servcode){
                                message+="编号:"+item.servcode+",重复了 "
                            }
                            if(item.servname==datas[j].servname){
                                message+="名称:"+item.servname+",重复了 "
                            }
                        }
                    })
                    if(message){
                        yid.util.error(message);
                        return;
                    }
                }else{
                    yid.util.error("没有导入数据");
                    return;
                }
                service.serviceInfo.batchImport(this.mutiImportDialog).then(res =>{
                    if(res.resp_code=="200"){
                        yid.util.success(res.resp_msg);
                        this.queryServData();
                        this.levelCancel();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
                //this.serveData=this.serveData.concat(this.mutiImportDialog.servs);
            },
            exportServs(){
                const head = {
                    servcode: '编号',
                    servname: '名称',
                    dept: '所属部门',
                    servtname: '项目分类',
                    sertype: '项目类别',
                    price: '基础定价',
                    minPrice: '最低价',
                    issale: '套餐销售',
                    isSms: '回访短信',
                    status: '状态',
                }
                service.serviceInfo.findServiceList({...this.form}).then(res => {
                    if(res.resp_code=="200"){
                        res.data.forEach(item =>{
                            if(item.sertype=="1"){
                                item.sertype="大项目";
                            }else{
                                item.sertype="小项目";
                            }
                            if(item.issale=="1"){
                                item.issale="允许";
                            }else{
                                item.issale="不允许";
                            }
                            if(item.isSms=="1"){
                                item.isSms="发送";
                            }else{
                                item.isSms="不发送";
                            }
                            if(item.status=="1"){
                                item.status="正常";
                            }else{
                                item.status="停用";
                            }
                        })
                        exportExecl(head,res.data,"服务项目导出");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            save(item){
                service.serviceInfo.saveService(item).then(res =>{
                    if(res.resp_code=="200"){
                        yid.util.success(res.resp_msg);
                        this.queryServData();
                        this.levelCancel();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            downExcelTemplate(){
                download($yid.config.API.BASE + '/api-base/serviceinfo/excelTemplate', {})
            },
        },
        mounted(){
            this.init();
        }
    }
</script>

<style scoped lang="scss">
    .margin5 {
        margin: 3px 2px;
    }
    .mutirow {
        flex-wrap: wrap;
        .el-tag {
            width: 100%;
        }
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>