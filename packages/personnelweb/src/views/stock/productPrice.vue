<template>
  <div class="productPrice">
    <el-collapse-transition>
      <div v-show="listShow">
        <el-button type="primary" @click="addShopPrice()">新增价格体系</el-button>
        <el-button @click="showImportDialog" type="primary">导入体系</el-button>

        <div style="margin-top: -10px;">
          <el-divider/>
        </div>
        <el-form inline>
          <el-form-item label="价格体系：">
            <el-input clearable v-model="form.name" placeholder="价格体系名称/编码" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="门店：">
            <el-input clearable v-model="form.shop" placeholder="门店名称/编码" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select clearable filterable placeholder="请选择" v-model.trim="form.status" style="width: 150px;">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in statusList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="queryShopPrice()">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 1010px;">
          <yid-table-column label="编号" prop="code" width="80"></yid-table-column>
          <yid-table-column label="名称" prop="name" width="160"></yid-table-column>
          <yid-table-column label="适用门店" prop="shopNum" width="180" align="left">
            <template slot-scope="scope">
              <label>共{{ scope.row.shopNum }}家门店</label><br/>
              <el-link @click="lookupShop(scope.row)" type="primary">查看修改</el-link>
            </template>
          </yid-table-column>
          <yid-table-column label="修改人" prop="updatedBy" width="100"></yid-table-column>
          <yid-table-column label="修改时间" prop="updatedTime" width="110"></yid-table-column>
          <yid-table-column label="备注" prop="memo" width="180"></yid-table-column>
          <yid-table-column label="状态" prop="sertype" width="80">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-value="1" inactive-value="2" active-color="#339933"
                         inactive-color="#DCDFE6" @change="stop(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" prop="status" width="120">
            <template slot-scope="scope">
              <el-link type="primary" @click="editShopPrice(scope.row)">编辑</el-link>
              <el-link type="primary" @click="setServPrice(scope.row)" style="margin-left: 10px;">设置售价</el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="!listShow">
        <el-button @click="back">返回</el-button>
        <el-button @click="openGood" type="primary">选择商品</el-button>&nbsp;&nbsp;&nbsp;
        <el-button @click="alertBatchEditPrice">批量修改门店售价</el-button>
        <el-form v-model="productForm" inline style="margin-top: 10px">
          <el-form-item label="产品：">
            <el-input clearable v-model="productForm.pcodename" placeholder="产品编码/产品名称"
                      style="width: 150px;"></el-input>
          </el-form-item>
          <el-form-item label="产品品牌：">
            <el-select clearable filterable placeholder="请选择" v-model.trim="productForm.brand" style="width: 120px;">
              <el-option :key="item.id" :label="item.bname" :value="item.id"
                         v-for="item in productBrandList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品类别：">
            <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="productForm.categrory"
                       style="width: 120px;">
              <el-option-group v-for="group in categroryList" :key="group.id" :label="group.cname">
                <el-option v-for="item in group.categroryListz" :key="item.id" :label="item.cname"
                           :value="item.id"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="允许客装销售：">
            <el-select clearable filterable placeholder="请选择" v-model.trim="productForm.iskz" style="width: 120px;">
              <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in iskzList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select clearable v-model="productForm.status" placeholder="请选择状态" style="width: 120px;">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getProductPriceList()">查询</el-button>
          </el-form-item>
        </el-form>

        <yid-table ref="productTable" pagination style="margin-top: 15px;" @selection-change="handleSelectionChange1">
          <yid-table-column type="selection" width="55"></yid-table-column>
          <yid-table-column label="产品编码" min-width="120" prop="pcode"></yid-table-column>
          <yid-table-column label="产品名称" min-width="150" prop="pname"></yid-table-column>
          <yid-table-column label="产品条码" min-width="120" prop="barcode"></yid-table-column>
          <yid-table-column label="规格" min-width="80" prop="norms"></yid-table-column>
          <yid-table-column label="单位" min-width="80" prop="unit"></yid-table-column>
          <yid-table-column label="品牌" min-width="100" prop="bname"></yid-table-column>
          <yid-table-column label="类别" min-width="100" prop="cname"></yid-table-column>
          <yid-table-column label="进价" min-width="80" prop="cost"></yid-table-column>
          <yid-table-column label="最低限价" min-width="80" prop="nprice">
            <template slot-scope="scope">
              {{ scope.row.minPrice }}
              <i class="el-icon-edit" @click="alertMinpriceDialog(scope.row)"></i>
            </template>
          </yid-table-column>
          <yid-table-column label="售价" min-width="80" prop="price">
            <template slot-scope="scope">
              {{ scope.row.price }}
              <i class="el-icon-edit" @click="alertPriceDialog(scope.row)"></i>
            </template>
          </yid-table-column>
          <yid-table-column label="内购价" min-width="80" prop="nprice">
            <template slot-scope="scope">
              {{ scope.row.nprice }}
              <i class="el-icon-edit" @click="alertNpriceDialog(scope.row)"></i>
            </template>
          </yid-table-column>
          <yid-table-column label="是否允许客装销售" min-width="80" prop="iskz">
            <!-- <template slot-scope="scope">
                 <span v-if='scope.row.iskz==0'>否</span>
                 <span v-if='scope.row.iskz==1'>是</span>
             </template>-->
            <template slot-scope="scope">
              <!--<el-select filterable placeholder="请选择" v-model="scope.row.iskz" style="width: 65px;" @change="editIskz(scope.row)">
                  <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in iskzListc"></el-option>
              </el-select>-->
              <el-switch v-model="scope.row.iskz" active-value="1" inactive-value="0" active-color="#339933"
                         inactive-color="#DCDFE6" @change="editIskz(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="修改人" prop="updatedBy" width="100"></yid-table-column>
          <yid-table-column label="修改时间" prop="updatedTime" width="110"></yid-table-column>
          <yid-table-column label="状态" min-width="80" prop="status">
            <template slot-scope="scope">
              <span v-if='scope.row.status==1'>正常</span>
              <span v-if='scope.row.status==2'>停用</span>
            </template>
          </yid-table-column>
          <yid-table-column label="门店产品状态" width="110">
            <template slot-scope="scope">
              <label style="color:blue" @click="setShopService(scope.row)" v-if="scope.row.status=='1'">设置</label>
              <label v-if="scope.row.status=='2'">设置</label>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <yid-dialog :title="addDialog.title" :visible.sync="addDialog.visible" @close="addDialog.visible=false"
                width="680px">
      <el-form ref="addDialog" :model="addDialog" label-width="150px">
        <el-form-item label="编号：" prop="code">
          <el-input value="自动生成" disabled placeholder="编号从K001开始递增，不可重复"/>
        </el-form-item>
        <el-form-item clearable label="价格体系名称：" prop="name" :rules="[{required: true,message:'请填写价格体系名称'}]">
          <el-input v-model="addDialog.name" placeholder="不超过16个汉字"/>
        </el-form-item>
        <el-form-item label="适用门店：" prop="shop">
          <el-button type="primary" @click="selectShop()">选择门店</el-button>
          {{ addDialog.shoplist ? '共选中' + addDialog.shoplist.length + '家门店' : '' }}
        </el-form-item>
        <el-form-item label="备注：" prop="memo">
          <el-input
              id="headtext"
              type="textarea"
              v-model="addDialog.memo"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="请输入备注"
              style="width: 400px; font-size: 12px">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveShopPrice()">保存</el-button>
          <el-button @click="addDialog.visible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="shopDialog.visible=false"
                width="1200px">
      <el-row type="flex" justify="space-between">
        <el-form inline :model="shopSearchForm" ref="shopSearchForm">
          <el-form-item label="门店：">
            <el-input clearable v-model="shopSearchForm.pcodename" placeholder="门店名称/编码"
                      style="width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select clearable filterable v-model="shopSearchForm.type" placeholder="请选择业务类型" style="width: 120px;">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in btypeList">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select clearable v-model="shopSearchForm.brandId" style="width: 120px;">
              <el-option v-for="item in brands" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select ref="selectRegionRef" v-model="shopSearchForm.regionObj" placeholder="请选择门店区域" multiple
                       collapse-tags @change="selectRegion" style="width: 180px;">
              <el-option hidden :value="shopSearchForm.regionObjValue" style="height: auto"></el-option>
              <el-tree
                  size="small"
                  accordion="true"
                  show-checkbox
                  :default-expand-all="true"
                  :data="regionData"
                  :props="defaultProps"
                  node-key="id"
                  :check-strictly="true"
                  @check-change="handleNodeClick"
                  ref="templateRegionTree">
              </el-tree>
            </el-select>
          </el-form-item>
          <el-form-item label="价格体系：">
            <el-select clearable v-model="shopSearchForm.ispptid" style="width: 120px;">
              <el-option value="0" label="未设置"></el-option>
              <el-option value="1" label="已设置"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="queryShop()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="14">
          <yid-table pagination ref="table1" style="margin-top: 10px;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
            <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="门店品牌" min-width="60" prop="brandName"></yid-table-column>
            <yid-table-column label="门店区域" min-width="120" prop="regionName"></yid-table-column>
            <yid-table-column label="业务类型" min-width="80" prop="type">
              <template slot-scope="scope">
                {{ scope.row.type | formatValue(btypeList) }}
              </template>
            </yid-table-column>
            <yid-table-column label="价格体系" min-width="120" prop="pricename">
              <template slot-scope="scope">
                {{ scope.row.productPtshops.length > 0 ? scope.row.productPtshops[0].ptempName : '' }}
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop()" type="primary" size="mini"><i class="el-icon-right"></i></el-button>
          </div>
        </el-col>
        <el-col :span="8" style="margin-left: 5px;">
          <el-link type="primary" @click="deleteBatch()">批量删除</el-link>
          <yid-table ref="table2" style="margin-top: 10px;" :data="shopDialog.shoplist"
                     @selection-change="handleSelectionData">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
            <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="价格体系" min-width="120" prop="pricename"></yid-table-column>
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteShop(scope.row)">删除</el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px;">
        <el-col :span="2" :offset="10" v-if="type=='1'">
          <el-button type="primary" @click="setShop()">选好了</el-button>
        </el-col>
        <el-col :span="2" :offset="10" v-if="type=='2'">
          <el-button type="primary" @click="saveShop()">保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible=false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog :title="goodAddDialog.title" :visible.sync="goodAddDialog.visible" width="700px">
      <el-form label-width="120px" ref="copyForm3">
        <el-form-item label="筛选：">
          <el-select clearable v-model="goodAddDialog.branch"
                     @change="changeBranch(goodAddDialog.branch,'2')" placeholder="所属部门" style="width: 140px;">
            <el-option v-for="item in goodAddDialog.branchs"
                       :key="item.id"
                       :value="item.id"
                       :label="item.bname"></el-option>
          </el-select>
          <el-select clearable v-model="goodAddDialog.productType" placeholder="请选择分类"
                     style="margin-left: 5px; width: 140px;">
            <el-option
                v-for="item in goodAddDialog.productTypes"
                :key="item.id"
                :label="item.cname"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox v-model="productCheck" @change="checkProd"></el-checkbox>
                (编号）产品名称 规格
              </th>
            </tr>
            <tr :key="item.pid" v-for="item in goodAddDialog.products"
                v-if="screenProduct(item)">
              <td>{{ item.bname }}</td>
              <td>{{ item.typename }}</td>
              <td>
                <el-checkbox v-model="item.type" :value="item.pid"></el-checkbox>
                ({{ item.sdcode }}) {{ item.sdname }} {{ item.norms }}
              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addGoods()" v-if="!duoflag">确认添加</el-button>
          <el-button type="primary" @click="levelCancel(2)">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog :title="priceDialog.title" :visible.sync="priceDialog.visible" width="450px">
      <el-form ref="priceForm" :model="priceForm" label-width="150px">
        <el-form-item label="产品名称：" prop="pname">
          {{ priceForm.pname }}
        </el-form-item>
        <el-form-item label="售价：" prop="price" :rules="[{ required: true, message: '请填写售价'}]">
          <el-input v-model="priceForm.price"></el-input>
        </el-form-item>
        <el-form-item label="最低限价：" prop="minPrice">
          <el-input v-model="priceForm.minPrice"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="priceDialog.visible=false">取消</el-button>
          <el-button type="primary" @click="editPrice()">确认修改</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog :title="npriceDialog.title" :visible.sync="npriceDialog.visible" width="450px">
      <el-form ref="npriceForm" :model="npriceForm" label-width="150px">
        <el-form-item label="产品名称：" prop="pname">
          {{ npriceForm.pname }}
        </el-form-item>
        <el-form-item label="内购价：" prop="nprice" :rules="[{ required: true, message: '请填写售价'}]">
          <el-input v-model="npriceForm.nprice"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="npriceDialog.visible=false">取消</el-button>
          <el-button type="primary" @click="editnPrice()">确认修改</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog :title="minpriceDialog.title" :visible.sync="minpriceDialog.visible" width="450px">
      <el-form ref="minpriceForm" :model="minpriceForm" label-width="150px">
        <el-form-item label="产品名称：" prop="pname">
          {{ minpriceForm.pname }}
        </el-form-item>
        <el-form-item label="最低限价：" prop="minPrice">
          <el-input v-model="minpriceForm.minPrice"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="minpriceDialog.visible=false">取消</el-button>
          <el-button type="primary" @click="editminPrice()">确认修改</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog :title="batchPriceDialog.title" :visible.sync="batchPriceDialog.visible" width="600px"
                @close="cancelBatchPriceDialog">
      <yid-table ref="batchPriceTable" style="margin-top: 15px;" :data="selectPricesCopy">
        <yid-table-column label="产品编码" min-width="100" prop="pcode"></yid-table-column>
        <yid-table-column label="产品名称" min-width="150" prop="pname"></yid-table-column>
        <yid-table-column label="售价" min-width="100" prop="price">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </yid-table-column>
        <yid-table-column label="最低限价" min-width="100" prop="minPrice">
          <template slot-scope="scope">
            <el-input v-model="scope.row.minPrice"></el-input>
          </template>
        </yid-table-column>
        <yid-table-column label="内购价" min-width="100" prop="nprice">
          <template slot-scope="scope">
            <el-input v-model="scope.row.nprice"></el-input>
          </template>
        </yid-table-column>
      </yid-table>
      <el-row style="text-align: center;margin-top: 20px">
        <el-button @click="cancelBatchPriceDialog">取消</el-button>
        <el-button type="primary" @click="batchEditPrice">保存</el-button>
      </el-row>
    </yid-dialog>

    <yid-dialog :title="shopStatusDialog.title" :visible.sync="shopStatusDialog.visible" width="800px">
      <el-form ref="shopStatusDialog" inline style="margin-top: 8px">
        <el-form-item label="产品：">{{ shopStatusDialog.pname }}</el-form-item>
        <br/>
        <el-form-item label="门店：">
          <el-select clearable v-model.trim="shopStatusDialog.shopid" @clear="clearShopForm"
                     @change="changeSelectShopForm" filterable :filter-method="filterShop" placeholder="请选择门店"
                     style="width: 160px;">
            <el-option :key="item.id" :label="item.shopname" :value="item.shopid" v-for="item in sptdata.shoplist">
              <span style="float: left">{{ item.shopcode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <row>
            <el-button type="primary" @click="batchUpdateServShopStatus('1')">启用</el-button>
            <el-button @click="batchUpdateServShopStatus('2')">停用</el-button>
            <el-button type="primary" @click="checkServShopStatus()">保存状态</el-button>
          </row>
        </el-form-item>
      </el-form>
      <yid-table ref="cardShopList" :data="shopStatusDialog.productShops" style="margin-top: 8px"
                 @selection-change="handleSelectionShopChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
        <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
        <yid-table-column label="门店名称" min-width="100" prop="status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       active-value="1" active-text="启用"
                       inactive-value="2" inactive-text="停用"
                       active-color="#339933" inactive-color="#DCDFE6">
            </el-switch>
          </template>
        </yid-table-column>
      </yid-table>
    </yid-dialog>

    <yid-dialog :title="importDialog.title" :visible.sync="importDialog.visible" @close="importCancel" width="700px">
      <el-form :model="importDialog.model" label-width="120px" ref="copyForm" :label-position="labelPosition">
        <p>批量导入产品基础资料方法</p>
        <p>1、点击链接：下载产品体系模板；</p>
        <p>2、下载完成并保存文件，然后打开文件并输入产品基础资料信息；</p>
        <p>3、在下面导入修改完毕的模板文件。</p>
        <el-form-item label="下载导入模板：" align="left">
          <el-link @click="downExcelTemplate" type="primary">产品基础资料模板</el-link>
        </el-form-item>
        <el-form-item label="选择导入文件:">
          <el-upload
              ref="uploadExcel"
              class="avatar-uploader"
              :headers="myheaders"
              :action="excelConvertUrl"
              :show-file-list="true"
              :limit="1"
              :on-exceed="handleExceed"
              :on-success="handleAvatarExcelSuccess"
              :before-upload="beforeAvatarExcelUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。</div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveImportProducts" type="primary">保存</el-button>
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>

</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import download from '@src/library/http/download'
import {productPriceListByPage} from "../../service/modules/chain/productPrice";

/**
 * 清空
 * @param obj
 */
function isClear(obj) {
  for (var i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = []
    } else {
      obj[i] = ''
    }
  }
}

export default {
  data() {
    return {
      excelConvertUrl: "",
      myheaders: {},
      listShow: true,
      type: '',
      sptid: '',
      spcode: '',
      spname: '',
      duoflag: false,
      form: {
        name: '',
        shop: ''
      },
      priceData: [],
      productData: [],
      productDataTemp: [],
      productBrandList: [],
      categroryList: [],
      addDialog: {
        id: '',
        title: '',
        visible: false,
        code: '',
        name: '',
        memo: '',
        status: '1',
        shoplist: []
      },
      productCheck: false,
      shopDialog: {
        id: '',
        title: '',
        visible: false,
        shop: '',
        type: '',
        branch: '',
        region: '',
        shoplist: []
      },
      shopSearchForm: {
        pcodename: "",
        type: "",
        brandId: "",
        regionObj: "",
        regionObjValue: "",
        ispptid: "",
      },
      productForm: {
        pptid: '',
        pcodename: '',
        brand: '',
        categrory: '',
        iskz: '',
        status: '',
      },
      goodAddDialog: {
        title: '添加产品',
        visible: false,
        branchs: [],
        branch: '',
        productTypes: [],
        productType: '',
        products: [],
        checkbox: false,
        index: -1
      },
      priceDialog: {
        title: '修改售价',
        visible: false,
      },
      npriceDialog: {
        title: '修改内购价',
        visible: false,
      },
      minpriceDialog:{
        title: '修改最低限价',
        visible: false,
      },
      batchPriceDialog: {
        title: '批量修改门店售价',
        visible: false,
      },
      iskzList: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],
      iskzListc: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],
      pageInfo: {
        page: 1,
        limit: 10,
        count: 0
      },
      pptid: '',
      pptcode: '',
      selectShops: [],
      branchs: [],
      brands: [],
      regions: [],
      productAllType: [],
      products: [],
      branchList: [],
      isSave: false,
      priceForm: {
        id: '',
        pname: '',
        price: '',
        minPrice: '',
        cost: '',
      },
      npriceForm: {
        id: '',
        pname: '',
        nprice: '',
      },
      minpriceForm: {
        id: '',
        pname: '',
        minPrice: '',
        cost: '',
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      selectPrices: [],
      selectPricesCopy: [],
      btypeList: [],
      regionData: [],
      checkedRegionId: '',
      statusList: [{
        id: 1,
        name: '正常'
      }, {
        id: 2,
        name: '停用'
      }],
      shopStatusDialog: {
        shopid: '',
        id: '',
        pname: '',
        sptid: '',
        visible: false,
        title: "设置门店产品状态",
        productShops: [],
        selectShopList: [],
      },
      sptdata: {
        shoplist: []
      },
      flag: false,
      importDialog: {
        title: '产品体系导入',
        visible: false,
        products: []
      },
      selectShopData: [],
    }
  },
  mounted() {
    this.init();
  },
  filters: {
    formatValue(str, stsList) {
      let label = ""
      stsList.map(m => {
        if (m.id == str) {
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
  computed: {
    screenProduct() {
      return function (item) {
        let flag = true
        if (this.goodAddDialog.branch) {
          if (this.goodAddDialog.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.goodAddDialog.productType) {
          if (this.goodAddDialog.productType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        return flag
      }
    }
  },
  methods: {
    init() {
      this.excelConvertUrl = $yid.config.API.BASE + "api-chain/product/convertSystem";

      service.chain.servShop.findbrands({isDel: '0'}).then(res => {
        this.brands = res.data
      });
      service.chain.servShop.findbranchs({status: '1', isDel: '0'}).then(res => {
        this.branchs = res.data
      });
      service.serviceInfo.findProductType({status: '1'}).then(res => {
        this.productAllType = res.data;
      });
      /*service.chain.servicepackage.product({}).then(res => {
          this.goodAddDialog.products=res.data
      });*/
      service.serviceInfo.findbranch({status: '1'}).then(res => {
        this.branchList = res.data;
      });
      service.serviceInfo.findProductType({status: '1'}).then(res => {
        this.productAllType = res.data;
      })

      service.chain.btype.btypeAllList({status: "1"}).then(res => {
        this.btypeList = res.data;
      })

      service.chain.region.treeAll({status: "1"}).then(res => {
        this.regionData = res.data;
      })

      this.getProductBrandList();
      this.getCategorylList();
      this.queryShopPrice();
    },
    checkProd(val) {
      this.goodAddDialog.products.forEach(item => {
        if (!this.goodAddDialog.branch) {
          item.type = val;
        } else if (this.goodAddDialog.branch == item.branch) {
          item.type = val;
        }
      })
    },
    levelCancel(i) {
      if (i == 2)
        this.goodAddDialog.visible = false;

    },
    changeBranch(id, type) {
      if (type == '2') {
        this.goodAddDialog.productType = '';
        this.goodAddDialog.productTypes = [];
        this.productAllType.forEach(item => {
          if (id == String(item.bbid)) {
            this.goodAddDialog.productTypes.push(item);
          }
        })
      }
    },
    handleSelectionChange(rows) {
      this.selectShops = rows;
    },
    queryShopPrice() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
      this.getData(this.form);
    },
    async getData(reqParams) {
      const fetch = service.chain.productPrice.findProductPricetempsBypage
      const params = {...this.pageInfo, ...reqParams}
      this.$refs.table.reloadData({
        fetch,
        params,
      });
    },
    getProductBrandList() {
      service.productBrand.alllist({isDel: '0'}).then(res => {
        if (res.resp_code == 200) {
          this.productBrandList = res.data;
        }
      })
    },
    getCategorylList() {
      service.chain.productCategory.allfz({level: '1'}).then(res => {
        if (res.resp_code == 200) {
          this.categroryList = res.data;
        }
      })
    },
    addShopPrice() {
      isClear(this.addDialog)
      this.addDialog.visible = true
      this.addDialog.title = '新增价格体系'
    },
    editShopPrice(row) {
      this.addDialog.visible = true
      this.addDialog.title = '新增价格体系'
      this.addDialog.code = row.code;
      this.addDialog.name = row.name;
      this.addDialog.memo = row.memo;
      this.addDialog.shoplist = row.shoplist || []
      this.addDialog.id = row.id
      this.spname = row.name
    },
    selectShop() {
      this.type = '1'
      this.flag = false
      isClear(this.shopDialog)
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      this.shopDialog.shoplist = this.addDialog.shoplist
      this.shopDialog.id = this.addDialog.id
      this.shopDialog.shoplist.forEach(each => {
        each.pricename = this.spname;
      })
      if (this.$refs['table1'] != null) {
        this.queryShop();
      }
    },
    lookupShop(row) {
      this.type = '2'
      this.flag = false
      isClear(this.shopDialog)
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      this.shopDialog.shoplist = row.shoplist || []
      this.shopDialog.id = row.id
      this.spname = row.name
      this.shopDialog.shoplist.forEach(each => {
        each.pricename = this.spname;
      })
      this.shopSearchForm = {pcodename: "", brandId: "", type: "", regionObjValue: [], ispptid: "0"}
      this.$refs['table1'].data = []
      if (this.$refs['table1'] != null) {
        this.queryShop();
      }
    },
    queryShop() {
      this.pageInfo = {page: 0, limit: 10};
      let req = {};
      req.pcodename = this.shopSearchForm.pcodename
      req.brandId = this.shopSearchForm.brandId
      req.type = this.shopSearchForm.type
      if (this.shopSearchForm.regionObjValue.length > 0) {
        req.regionId = this.shopSearchForm.regionObjValue[0].id
      } else {
        req.regionId = ''
      }
      req.ispptid = this.shopSearchForm.ispptid
      this.getShopList(req)
    },
    getShopList(p) {
      const fetch = service.chain.shop.shopListWithPage
      let params = {status: "1", ...this.pageInfo, ...p}
      this.$refs['table1'].reloadData({
        fetch,
        params,
      });
    },
    handleNodeClick(data, checked, child) {
      if (!checked) {
        this.clearSelectRegion();
        return
      }

      if (checked === true) {
        this.checkedRegionId = data.id
        this.$refs.templateRegionTree.setCheckedKeys([data.id]);
      } else {
        if (this.checkedRegionId === data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id]);
        }
      }

      let res = this.$refs.templateRegionTree.getCheckedNodes(false, false); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      let arrLabel = [];
      let arr = [];
      res.forEach(item => {
        arrLabel.push(item.name);
        arr.push(item);
      });
      this.shopSearchForm.regionObjValue = arr;
      this.shopSearchForm.regionObj = arrLabel;

      let _this = this;
      setTimeout(function () {
        _this.$refs.selectRegionRef.blur();
      }, 50);
    },
    clearSelectRegion() {
      this.shopSearchForm.regionObjValue = []
      this.shopSearchForm.regionObj = ""
      this.shopSearchForm.regionId = "";
      this.$refs.templateRegionTree.setCheckedNodes([]);//设置勾选的值
    },
    selectRegion(e) {
      var arrNew = [];
      var dataLength = this.shopSearchForm.regionObjValue.length;
      var eleng = e.length;
      for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < eleng; j++) {
          if (e[j] === this.shopSearchForm.regionObjValue[i].name) {
            arrNew.push(this.shopSearchForm.regionObjValue[i])
          }
        }
      }
      this.$refs.templateRegionTree.setCheckedNodes(arrNew);//设置勾选的值
    },
    addShop() {
      this.selectShops.map(m => {
        if (m.productPtshops.length > 0) {
          m.pricename = m.productPtshops[0].ptempName
        } else {
          m.pricename = ''
        }
        let flag = true
        this.shopDialog.shoplist.forEach(p => {
          if (String(p.shopcode) === String(m.shopcode)) {
            flag = false
          }
        })

        if (flag) {
          if (m.pricename) {
            this.flag = true
          }
          this.shopDialog.shoplist.push({
            shopid: m.id,
            shopcode: m.shopcode,
            shopname: m.shopname,
            pricename: m.pricename
          })
        }
      })
    },
    deleteShop(row) {
      yid.util.confirm('删除门店，【' + this.spname + '】下的产品将不在【' + row.shopname + '】中显示，确定要删除吗？', '', '', () => {
        let i = -1;
        this.shopDialog.shoplist.forEach((p, index) => {
          if (p.shopid == row.shopid) {
            i = index
          }
        })
        this.shopDialog.shoplist.splice(i, 1)
      })
    },
    saveShopPrice() {
      this.$refs['addDialog'].validate((valid) => {
        if (valid) {
          service.chain.productPrice.saveShopPrice(this.addDialog).then(res => {
            if (res.resp_code == "200") {
              this.queryShopPrice()
              this.addDialog.visible = false
              yid.util.success(res.resp_msg);
            } else {
              yid.util.error(res.resp_msg);
            }
          })
        }
      })
    },
    setShop() {
      if (this.flag) {
        yid.util.confirm('选择的门店包括已设置产品价格体系的门店，保存后门店将会从原价格体系移至本体系中！', '', '', () => {
          this.addDialog.shoplist = this.shopDialog.shoplist
          this.shopDialog.visible = false
        })
      } else {
        this.addDialog.shoplist = this.shopDialog.shoplist
        this.shopDialog.visible = false
      }
    },
    saveShop() {
      if (this.flag) {
        yid.util.confirm('选择的门店包括已设置产品价格体系的门店，保存后门店将会从原价格体系移至本体系中!', '', '', () => {
          this.saveShops()
        })
      } else {
        this.saveShops()
      }
    },
    saveShops() {
      service.chain.productPrice.saveShop(this.shopDialog).then(res => {
        if (res.resp_code == "200") {
          this.queryShopPrice()
          this.shopDialog.visible = false
          yid.util.success(res.resp_msg);
        } else {
          yid.util.error(res.resp_msg);
        }
      })
    },
    stop(row) {
      if (row.shopNum > 0) {
        yid.util.error("【" + row.name + "】还存在适用门店，不可禁用");
        this.queryShopPrice()
        return;
      }
      const param = {
        id: row.id,
        status: row.status,
      }
      console.log(param);
      service.chain.productPrice.stopPrice(param).then(res => {
        if (res.resp_code == "200") {
          yid.util.success(res.resp_msg);
          this.queryShopPrice()
        } else {
          yid.util.error(res.resp_msg);
          this.queryShopPrice()
        }

      })
    },
    setServPrice(row) {
      this.pptid = row.id;
      this.pptcode = row.code;
      this.listShow = false;
      this.isSave = false;
      this.productCheck = false;
      this.productForm.pptid = row.id;
      this.productForm.pcodename = '';
      this.productForm.brand = '';
      this.productForm.categrory = '';
      this.productForm.iskz = '';
      this.sptdata = row;
      this.getProductPriceList();
    },
    getProductPriceList() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.productTable.Pagination.internalPageSize
      this.getProductPriceData(this.productForm);
    },
    async getProductPriceData(reqParams) {
      const fetch = service.chain.productPrice.productPriceListByPage
      const params = {...this.pageInfo, ...reqParams}
      this.$refs.productTable.reloadData({
        fetch,
        params,
      });
    },
    back() {
      //if(this.isSave){
      this.listShow = true;
      this.queryShopPrice();
      /* }else{
           yid.util.confirm('页面上有新编辑内容未保存，是否保存后再退出？', '','', ()=> {
               //调用保存方法
               this.queryShopPrice();
               this.saveProductPrice();
               this.listShow = true;
           },()=>{
               this.listShow = true;
               this.queryShopPrice();
           })
       }*/
    },
    openGood() {
      this.duoflag = false;
      this.goodAddDialog.visible = true;
      this.goodAddDialog.branch = '';
      this.goodAddDialog.branchs = [];
      this.goodAddDialog.productType = '';
      this.goodAddDialog.productTypes = [];
      this.goodAddDialog.checkbox = false;
      this.branchList.forEach(item => {
        this.goodAddDialog.branchs.push({...item})
      });
      service.chain.servicepackage.product({pptid: this.productForm.pptid}).then(res => {
        this.goodAddDialog.products = res.data;
      });

      /*this.goodAddDialog.products.forEach(item =>{
          item.type=false;
          this.products.forEach(serv =>{
              if(serv.pid == item.pid ){
                  item.type=true;
              }
          })
      })*/
    },
    addGoods() {
      const that = this;
      if (this.goodAddDialog.products.length == 0) {
        yid.util.alert("请选择产品进行添加!")
        return false;
      }
      that.productDataTemp = [];
      for (let i = 0; i < this.goodAddDialog.products.length; i++) {
        if (this.goodAddDialog.products[i].type && (!that.goodAddDialog.branch || this.goodAddDialog.products[i].branch == that.goodAddDialog.branch)
            && (!that.goodAddDialog.productType || this.goodAddDialog.products[i].servtid == that.goodAddDialog.productType)) {
          let flag = true;
          that.products.forEach(pro => {
            if (this.goodAddDialog.products[i].pid == pro.pid) {
              flag = false;
            }
          })
          if (flag) {
            for (let n = 0; n < that.productData.length; n++) {
              let pcode = that.productData[n].pcode;
              if (this.goodAddDialog.products[i].sdcode === pcode) {
                yid.util.info("列表中存在【" + that.productData[n].pname + "】不能再次添加");
                return false;
              }
            }
            console.log("---------------" + this.goodAddDialog.products[i]);
            that.productDataTemp.push({
              pid: this.goodAddDialog.products[i].pid,
              pcode: this.goodAddDialog.products[i].sdcode,
              pname: this.goodAddDialog.products[i].sdname,
              barcode: this.goodAddDialog.products[i].barcode,
              norms: this.goodAddDialog.products[i].norms,
              unit: this.goodAddDialog.products[i].unit,
              bname: this.goodAddDialog.products[i].bname,
              cname: this.goodAddDialog.products[i].typename,
              cost: this.goodAddDialog.products[i].cost,
              price: this.goodAddDialog.products[i].price,
              iskz: this.goodAddDialog.products[i].iskz,
              status: this.goodAddDialog.products[i].status,
            });
          }
        }
      }
      this.saveProductPrice();
      this.levelCancel(2);
    },
    alertPriceDialog(row) {
      this.priceForm.id = row.id;
      this.priceForm.pname = row.pname;
      this.priceForm.price = row.price;
      this.priceForm.iskz = row.iskz;
      this.priceForm.minPrice = row.minPrice;
      this.priceForm.cost = row.cost;
      this.priceDialog.visible = true;
    },
    alertNpriceDialog(row) {
      this.npriceForm.id = row.id;
      this.npriceForm.pname = row.pname;
      this.npriceForm.nprice = row.nprice;
      this.npriceForm.iskz = row.iskz;
      this.npriceDialog.visible = true;
    },
    alertMinpriceDialog(row){
      this.minpriceForm.id = row.id;
      this.minpriceForm.pname = row.pname;
      this.minpriceForm.minPrice = row.minPrice;
      this.minpriceForm.iskz = row.iskz;
      this.minpriceForm.cost = row.cost;
      this.minpriceDialog.visible = true;
    },
    editPrice() {
      if(this.priceForm.minPrice != null && this.priceForm.minPrice != '' && (Number(this.priceForm.minPrice) < Number(this.priceForm.cost))){
        return yid.util.error('最低限价不得低于进价!');
      }
      this.$refs['priceForm'].validate((valid) => {
        service.chain.productPrice.saveOrUpdatePrice(this.priceForm).then(res => {
          if (res.resp_code == "200") {
            this.getProductPriceList();
            this.priceDialog.visible = false;
          } else {
            yid.util.error(res.resp_msg);
          }
        })
      })
    },
    editnPrice() {
      this.$refs['npriceForm'].validate((valid) => {
        service.chain.productPrice.saveOrUpdatePrice(this.npriceForm).then(res => {
          if (res.resp_code == "200") {
            this.getProductPriceList();
            this.npriceDialog.visible = false;
          } else {
            yid.util.error(res.resp_msg);
          }
        })
      })
    },
    editminPrice() {
      // console.log(this.minpriceForm.minPrice)
      if(this.minpriceForm.minPrice != null && this.minpriceForm.minPrice != '' && (Number(this.minpriceForm.minPrice) < Number(this.minpriceForm.cost))){
        return yid.util.error('最低限价不得低于进价!');
      }
      this.$refs['minpriceForm'].validate((valid) => {
        service.chain.productPrice.saveOrUpdatePrice(this.minpriceForm).then(res => {
          if (res.resp_code == "200") {
            this.getProductPriceList();
            this.minpriceDialog.visible = false;
          } else {
            yid.util.error(res.resp_msg);
          }
        })
      })
    },
    editIskz(row) {
      this.priceForm.id = row.id;
      this.priceForm.pname = row.pname;
      this.priceForm.price = row.price;
      this.priceForm.iskz = row.iskz;
      service.chain.productPrice.saveOrUpdatePrice(this.priceForm).then(res => {
        if (res.resp_code == "200") {
          this.getProductPriceList();
        } else {
          yid.util.error(res.resp_msg);
        }
      })
    },
    handleSelectionChange1(rows) {
      this.selectPrices = rows
    },
    alertBatchEditPrice() {
      this.selectPricesCopy = $yid.util.deepClone(this.selectPrices);
      if (this.selectPricesCopy.length === 0) {
        yid.util.alert("请选择需要批量修改的商品")
        return
      }
      console.log(this.selectPricesCopy)
      this.batchPriceDialog.visible = true;
    },
    cancelBatchPriceDialog() {
      this.getProductPriceList();
      this.batchPriceDialog.visible = false
    },
    batchEditPrice() {
      for (let i = 0; i < this.selectPricesCopy.length; i++) {
        if (this.selectPricesCopy[i].price === '' || this.selectPricesCopy[i].price.length == 0) {
          yid.util.alert("售价为必填值")
          return
        }
        if(this.selectPricesCopy[i].minPrice != null && this.selectPricesCopy[i].minPrice != '' && (Number(this.selectPricesCopy[i].minPrice) < Number(this.selectPricesCopy[i].cost))){
            yid.util.error('最低限价不得低于进价!');
            return
        }
      }
      const priceList = [];
      this.selectPricesCopy.forEach(res => {
        // if(res.minPrice < res.cost){
        //     return yid.util.error('最低限价不得低于进价!');
        // }
        let price = {};
        price.id = res.id;
        price.pptid = this.pptid;
        price.pptcode = this.pptcode;
        price.pcid = res.pid;
        price.pcode = res.pcode;
        price.pname = res.pname;
        price.price = res.price;
        price.nprice = res.nprice;
        price.minPrice = res.minPrice;
        price.iskz = res.iskz;
        priceList.push(price);
      })
      service.chain.productPrice.batchSave({productPrices: priceList}).then(res => {
        if (res.resp_code == "200") {
          this.getProductPriceList();
          this.batchPriceDialog.visible = false;
        } else {
          yid.util.error(res.resp_msg);
        }
      })
    },
    saveProductPrice() {
      if (this.productDataTemp.length == 0) {
        yid.util.alert("请选择商品进行保存");
        return false;
      }
      const priceList = [];
      console.log(this.productDataTemp);
      this.productDataTemp.forEach(res => {
        let price = {};
        price.id = res.id;
        price.pptid = this.pptid;
        price.pptcode = this.pptcode;
        price.pcid = res.pid;
        price.pcode = res.pcode;
        price.pname = res.pname;
        price.price = res.price;
        price.iskz = res.iskz;
        priceList.push(price);
      })
      service.chain.productPrice.batchSave({productPrices: priceList}).then(res => {
        if (res.resp_code == "200") {
          this.getProductPriceList();
        } else {
          yid.util.error(res.resp_msg);
        }
      })
    },
    deletePrice(row) {
      yid.util.confirm('确定要删除产品[' + row.pname + ']的价格？', '', '', () => {
        service.chain.productPrice.deleteproductPrice(row.id).then(res => {
          if (res.resp_code == "200") {
            this.getProductPriceList();
          } else {
            yid.util.error(res.resp_msg);
          }
        })
      })
    },
    setShopService(row) {
      service.chain.productPrice.getProductShopStatus({pid: row.id}).then(res => {
        if (res.resp_code == 200) {
          this.shopStatusDialog.productShops = []
          this.sptdata.shoplist.forEach(each => {
            let flag = true
            if (res.data) {
              res.data.forEach(shop => {
                if (shop.shopid == each.shopid) {
                  flag = false
                }
              })
            }
            this.shopStatusDialog.productShops.push({
              shopid: each.shopid,
              shopcode: each.shopcode,
              shopname: each.shopname,
              status: flag ? '1' : '2'
            })
          })
          this.shopStatusDialog.visible = true
          this.shopStatusDialog.id = row.id
          this.shopStatusDialog.pname = row.pname
          this.shopStatusDialog.sptid = this.sptdata.id;
        }
      });
    },
    batchUpdateServShopStatus(status) {
      if (this.shopStatusDialog.shopid) {
        this.shopStatusDialog.productShops.forEach(each => {
          if (this.shopStatusDialog.shopid == each.shopid) {
            each.status = status
          }
        })
      }
      this.shopStatusDialog.selectShopList.forEach(each => {
        each.status = status
      })
    },
    handleSelectionShopChange(rows) {
      this.shopStatusDialog.selectShopList = rows;
    },
    checkServShopStatus() {
      console.log(this.shopStatusDialog);
      service.chain.productPrice.checkProductShopStatus(this.shopStatusDialog).then(res => {
        if (res.data) {
          yid.util.confirm(res.data, '', '', () => {
            this.saveServShopStatus();
          })
        } else {
          this.saveServShopStatus();
        }
      })
    },
    saveServShopStatus() {
      service.chain.productPrice.saveProductShopStatus(this.shopStatusDialog).then(res => {
        if (res.resp_code == "200") {
          this.shopStatusDialog.visible = false
        } else {
          yid.util.error(res.resp_msg);
        }
      })
    },
    showImportDialog() {
      this.importDialog.visible = true;
      this.importDialog.products = [];
      // this.myheaders['saas-version'] = "zpw";
      this.myheaders['authorization'] = 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN);
      this.$refs.uploadExcel.clearFiles()
    },
    beforeAvatarExcelUpload(file) {
      const isJPG = (file.type.indexOf("sheet") || file.type.indexOf('excel'));
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        yid.util.error('上传excel只能是 xls/xlsx 格式!');
        return;
      }
      if (!isLt2M) {
        yid.util.error('上传excel大小不能超过 10MB!');
        return;
      }

      return isJPG && isLt2M;
    },
    handleExceed(files, fileList) {
      yid.util.error('只能导入一个文件，请先删除之前选择的文件');
      return;
    },
    handleAvatarExcelSuccess(res) {
      this.importDialog.products = res.data;
    },
    importCancel() {
      this.importDialog.visible = false;
    },
    saveImportProducts() {
      if (this.importDialog.products.length == 0) {
        yid.util.info("无导入数据");
      } else {

        service.chain.productPrice.saveSystem(this.importDialog.products).then(res => {
          if (res.resp_code == "200") {
            this.queryShopPrice();
            this.importDialog.visible = false
          } else {
            yid.util.error(res.resp_msg);
          }
        })
      }
    },
    downExcelTemplate() {
      download(yid.config.API.BASE + 'api-chain/product/downSysTemplate', {})
    },
    handleSelectionData(rows) {
      this.selectShopData = rows;
    },
    //批量删除
    deleteBatch() {
      if (this.selectShopData.length == 0) {
        yid.util.warning("请勾选删除的门店");
        return;
      }
      this.selectShopData.forEach(item => {
        this.shopDialog.shoplist.forEach((p, index) => {
          if (item.shopid == p.shopid) {
            this.shopDialog.shoplist.splice(index, 1)
          }
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
