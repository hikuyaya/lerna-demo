<template>
  <div class="appoint-list">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="addServPack()">新增套餐</el-button>
        <el-button type="primary" @click="duoServPack()" v-if="false"
          >新增多选套餐</el-button
        >
      </el-form-item>
      <br />
      <el-form-item label="套餐：">
        <el-input
          clearable
          v-model.trim="form.package"
          placeholder="套餐编码/名称"
          style="width: 180px"></el-input>
      </el-form-item>
      <el-form-item label="套餐分类：">
        <el-select
          clearable
          filterable
          v-model="form.branch"
          @change="changeBranchType"
          placeholder="请选择组"
          style="width: 160px">
          <el-option
            v-for="item in branchs"
            :key="item.id"
            :label="item.bname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select
          clearable
          filterable
          v-model="form.ptid"
          placeholder="请选择分类"
          style="width: 160px">
          <el-option
            v-for="item in packageListType"
            :key="item.id"
            :label="item.pname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌：">
        <el-select
          clearable
          v-model="form.brand"
          @change="filterBrand(form.brand)"
          placeholder="请选择品牌"
          style="width: 120px">
          <el-option
            v-for="item in brands"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店：">
        <el-select
          @clear="clearFormShop"
          @blur="clearFormShop"
          clearable
          v-model.trim="form.shop"
          filterable
          :filter-method="filterShop"
          placeholder="请选择门店"
          style="width: 160px">
          <el-option
            :key="item.id"
            :label="item.shopname"
            :value="item.id"
            v-for="item in filterShopList">
            <span style="float: left">{{ item.shopcode }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.shopname
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select clearable v-model="form.status" style="width: 100px">
          <el-option label="正常" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="querylist()">查询</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="showImportDialog" type="primary">导入套餐</el-button>
      </el-form-item>
    </el-form>

    <yid-table
      pagination
      ref="tableData"
      @selection-change="handleServicesChange">
      <yid-table-column
        label="编号"
        min-width="60"
        prop="spcode"></yid-table-column>
      <yid-table-column
        label="套餐名称"
        min-width="140"
        prop="spname"></yid-table-column>
      <yid-table-column
        label="可售时间"
        min-width="180"
        prop="date"
        :formatter="dateFormat"></yid-table-column>
      <yid-table-column
        label="有效期"
        min-width="80"
        prop="expiryType"
        :formatter="dateFormat1"></yid-table-column>
      <yid-table-column
        label="套餐价"
        min-width="70"
        prop="totalprice"></yid-table-column>
      <yid-table-column
        label="成本价"
        min-width="70"
        prop="cost"></yid-table-column>
      <yid-table-column
        label="套餐内容"
        min-width="220"
        prop="content"
        align="left">
        <template slot-scope="scope">
          <el-row
            type="flex"
            :key="item.id"
            v-for="item in scope.row.servs"
            justify="space-between">
            <el-col :span="22">
              <div v-if="scope.row.isMultiple == '0'">
                {{ item.typename }}-{{ item.sdname }}, {{ item.num }}次, 总价:{{
                  item.pprice
                }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
              <div v-if="scope.row.isMultiple == '1'">
                {{ item.sdname }}, {{ item.num }}次, 总价:{{ item.pprice }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            :key="item.id"
            v-for="item in scope.row.products"
            justify="space-between">
            <el-col :span="22">
              <div v-if="scope.row.isMultiple == '0'">
                {{ item.typename }}-{{ item.sdname }}, {{ item.num }}次, 总价:{{
                  item.pprice
                }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
              <div v-if="scope.row.isMultiple == '1'">
                {{ item.sdname }}, {{ item.num }}次, 总价:{{ item.pprice }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
            </el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column
        label="适用门店"
        prop="shopNum"
        width="140"
        align="left">
        <template slot-scope="scope">
          <label
            >{{ scope.row.brandname ? scope.row.brandname + '' : '' }} <br />
            共{{ scope.row.shopNum ? scope.row.shopNum : '0' }}家门店</label
          ><br />
          <el-link
            v-if="scope.row.brandname"
            @click="lookupShop(scope.row)"
            type="primary"
            >查看修改</el-link
          >
        </template>
      </yid-table-column>
      <yid-table-column
        label="修改人"
        prop="updatedBy"
        width="100"></yid-table-column>
      <yid-table-column
        label="修改时间"
        prop="updatedTime"
        width="110"></yid-table-column>
      <yid-table-column label="状态" min-width="100" prop="status">
        <template slot-scope="scope">
          <el-link type="primary" @click="editServPack(scope.row)"
            >编辑</el-link
          >
          <el-switch
            style="margin: 0 10px 0 10px"
            @change="stop(scope.row)"
            v-model="scope.row.status == '1' ? true : false"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </yid-table-column>
      <yid-table-column label="展开" width="60" type="expand">
        <template slot-scope="scope">
          <div style="padding: 20px 50px">
            <h4>
              项目明细
              <el-link type="primary" style="margin-left: 20px"></el-link>
            </h4>
            <yid-table
              ref="table1"
              style="margin-top: 15px"
              :data="scope.row.servs">
              <yid-table-column
                label="项目编码"
                min-width="50"
                prop="sdcode"></yid-table-column>
              <yid-table-column
                label="项目名称"
                min-width="100"
                prop="sdname"></yid-table-column>
              <yid-table-column
                label="次数"
                min-width="50"
                prop="num"></yid-table-column>
              <yid-table-column
                label="单价"
                min-width="50"
                prop="price"></yid-table-column>
              <yid-table-column
                label="套餐价"
                min-width="50"
                prop="pprice"></yid-table-column>
              <yid-table-column label="是否赠送" min-width="50" prop="isGift">
                <template slot-scope="scope">
                  <div>{{ scope.row.isGift == '0' ? '否' : '是' }}</div>
                </template>
              </yid-table-column>
            </yid-table>
            <h4 style="margin-top: 20px">
              产品明细
              <el-link type="primary" style="margin-left: 20px"></el-link>
            </h4>
            <yid-table
              ref="table2"
              style="margin-top: 15px"
              :data="scope.row.products">
              <yid-table-column
                label="产品编码"
                min-width="50"
                prop="sdcode"></yid-table-column>
              <yid-table-column
                label="产品名称"
                min-width="100"
                prop="sdname"></yid-table-column>
              <yid-table-column
                label="次数"
                min-width="50"
                prop="num"></yid-table-column>
              <yid-table-column
                label="单价"
                min-width="50"
                prop="price"></yid-table-column>
              <yid-table-column
                label="套餐价"
                min-width="50"
                prop="pprice"></yid-table-column>
              <yid-table-column label="是否赠送" min-width="50" prop="isGift">
                <template slot-scope="scope">
                  <div>{{ scope.row.isGift == '0' ? '否' : '是' }}</div>
                </template>
              </yid-table-column>
            </yid-table>
          </div>
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog
      :title="packAddDialog.title"
      :visible.sync="packAddDialog.visible"
      width="740px">
      <el-form
        :model="packAddDialog"
        :rules="formrules"
        label-width="145px"
        ref="copyForm1"
        :label-position="labelPosition">
        <el-form-item label="套餐编号:">
          {{ packAddDialog.spcode }}
          <explain style="color: silver">套餐编号从001开始自动叠加</explain>
        </el-form-item>
        <el-form-item label="套餐名称:" prop="spname">
          <el-input
            v-model="packAddDialog.spname"
            style="width: 320px"
            clearable />
        </el-form-item>
        <el-form-item label="可售时间:">
          <el-date-picker
            style="width: 320px"
            v-model="packAddDialog.date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            @change="changDates1"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-checkbox
            v-model="packAddDialog.type"
            @change="changDate1"
            style="margin-left: 5px"
            >长期
          </el-checkbox>
        </el-form-item>
        <el-form-item label="有效期:">
          <el-radio-group v-model="packAddDialog.expiryType">
            <el-radio :label="0" @change="changeCheck">长期</el-radio>
            <br />
            <div style="margin-top: 3px">
              <el-radio :label="1" @change="changeCheck">有效期</el-radio>
              <el-input
                type="number"
                min="1"
                v-model="packAddDialog.expirtyMonth"
                :disabled="packAddDialog.expiryType != '1'"
                style="width: 100px"
                clearable />
              <el-tag style="margin-left: 5px">个月</el-tag>
              <explain style="color: silver"
                >从购买之日起延迟多少个月到期</explain
              >
            </div>
            <div style="margin-top: 4px">
              <el-radio :label="2" @change="changeCheck"
                >指定到固定日期</el-radio
              >
              <el-date-picker
                v-model="packAddDialog.expirydate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="packAddDialog.expiryType != '2'"
                style="width: 150px"
                placeholder="选择时间">
              </el-date-picker>
              <explain style="color: silver"
                >为套餐固定到期日期，不填为永久有效</explain
              >
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每人仅限购买:">
          <el-input
            type="number"
            min="1"
            v-model="packAddDialog.bugcs"
            style="width: 120px"
            clearable />
          <el-tag style="margin-left: 5px">次</el-tag>
        </el-form-item>
        <el-form-item label="添加服务项目:">
          <el-button type="primary" @click="openServ()">添加服务项目</el-button>
          <el-row
            :gutter="10"
            :key="item.servid"
            v-for="item in packAddDialog.servs"
            type="flex"
            style="margin-top: 12px">
            <el-col :span="4">{{ item.sdname }}</el-col>
            <el-col :span="7">
              <el-input
                type="number"
                min="1"
                v-model="item.num"
                style="width: 100px; margin: 0 10px 0 10px"
                placeholder="次数"
                clearable />
              次
            </el-col>
            <el-col :span="7">
              <el-input
                type="number"
                min="0"
                v-model="item.pprice"
                style="width: 120px; margin-right: 5px"
                placeholder="套餐总价"
                clearable />
              元
            </el-col>
            <el-col :span="3">
              <el-checkbox v-model="item.isGift">赠送</el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-link type="primary" @click="deleteServ(item.servid)"
                >删除</el-link
              >
            </el-col>
          </el-row>
          <!--                    <el-link type="primary" @click="serveAdd" style="margin-top: 10px;">继续添加项目</el-link>-->
        </el-form-item>
        <el-form-item label="添加产品:">
          <el-button type="primary" @click="openGood()">添加产品</el-button>
          <el-row
            :gutter="10"
            :key="item.pid"
            v-for="item in packAddDialog.products"
            type="flex"
            style="margin-top: 12px">
            <el-col :span="4">{{ item.sdname }}</el-col>
            <el-col :span="7">
              <el-input
                type="number"
                min="1"
                v-model="item.num"
                style="width: 100px; margin: 0 10px 0 10px"
                placeholder="次数"
                clearable />
              次
            </el-col>
            <el-col :span="7">
              <el-input
                type="number"
                min="0"
                v-model="item.pprice"
                style="width: 120px; margin-right: 5px"
                placeholder="套餐总价"
                clearable />
              元
            </el-col>
            <el-col :span="3">
              <el-checkbox v-model="item.isGift">赠送</el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-link type="primary" @click="deleteProd(item.pid)"
                >删除</el-link
              >
            </el-col>
          </el-row>
          <!--                    <el-link type="primary" @click="goodAdd" style="margin-top: 10px;">继续添加产品</el-link>-->
        </el-form-item>
        <el-form-item label="套餐成本价:">
          <el-input
            type="number"
            min="0"
            v-model="packAddDialog.cost"
            style="width: 220px"
            clearable />
        </el-form-item>
        <el-form-item label="套餐销售:">
          <el-checkbox v-model="packAddDialog.issale" style="margin-left: 5px"
            >允许线上销售</el-checkbox
          >
        </el-form-item>
        <el-form-item label="是否允许转赠：">
          <el-radio-group v-model="packAddDialog.isTransfer">
            <el-radio label="1">允许</el-radio>
            <el-radio label="0">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品牌：" prop="brand">
          <el-select
            v-if="packAddDialog.brandname ? false : true"
            clearable
            v-model="packAddDialog.brand"
            @change="changBrnad('1')">
            <el-option
              v-for="item in brands"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <el-label v-if="packAddDialog.brandname ? true : false">{{
            packAddDialog.brandname
          }}</el-label>
        </el-form-item>
        <el-form-item label="适用门店：" prop="shop">
          <el-button type="primary" @click="selectShop()">选择门店</el-button>
          {{
            packAddDialog.shoplist
              ? '共选中' + packAddDialog.shoplist.length + '家门店'
              : ''
          }}
        </el-form-item>
        <el-form-item
          label="套餐分类："
          prop="branch"
          :rules="[{ required: true, message: '请选择套餐分类' }]">
          <el-select
            v-model="packAddDialog.branch"
            @change="changePackageBranch"
            placeholder="请选择部门"
            style="width: 160px">
            <el-option
              v-for="item in branchs"
              :key="item.id"
              :label="item.bname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model="packAddDialog.ptid"
            @change="changePackageType"
            placeholder="请选择类别"
            style="width: 160px; margin-left: 20px">
            <el-option
              v-for="item in packAddDialog.packageType"
              :key="item.id"
              :label="item.pname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套餐图片：">
          <el-upload
            class="avatar-uploader"
            :action="upload"
            :headers="myheaderData"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <img
              v-if="packAddDialog.photopath"
              :src="packAddDialog.photopath"
              class="avatar el-upload" />
            <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
            <div class="el-upload__tip" slot="tip">
              仅支持jpg，png格式的图片上传 图片尺寸：120px*150px
            </div>
          </el-upload>
        </el-form-item>
        <el-divider>异店划套餐设置</el-divider>
        <el-form-item label="是否允许跨店消费:">
          <el-radio
            :label="1"
            v-model="packAddDialog.isDiffshop"
            style="margin-left: 5px"
            >允许</el-radio
          >
          <el-radio
            :label="0"
            v-model="packAddDialog.isDiffshop"
            style="margin-left: 5px"
            >不允许</el-radio
          >
          <yid-ask
            >适用门店内的跨店消费，赠送项目/产品仅能在赠送门店消费，不允许则只能在购买套餐门店消费；非适用门店内消费可设置跨品牌消费</yid-ask
          >
          <el-form-item
            label="套餐内容:"
            label-width="80px"
            v-if="packAddDialog.isDiffshop == '1'">
            <el-checkbox
              v-model="packAddDialog.isAllowPackage"
              style="margin-left: 5px"
              >服务项目</el-checkbox
            >
            <el-checkbox
              v-model="packAddDialog.isAllowProduct"
              style="margin-left: 5px"
              >产品</el-checkbox
            >
          </el-form-item>
        </el-form-item>
        <el-form-item label="是否允许跨品牌消费:">
          <el-radio
            :label="1"
            v-model="packAddDialog.isDiffbrand"
            style="margin-left: 5px"
            >允许</el-radio
          >
          <el-radio
            :label="0"
            v-model="packAddDialog.isDiffbrand"
            style="margin-left: 5px"
            >不允许</el-radio
          >
          <el-form-item
            label="套餐内容:"
            label-width="80px"
            style="margin-bottom: 5px"
            v-if="packAddDialog.isDiffbrand == '1'">
            <el-checkbox
              v-model="packAddDialog.ibAllowPackage"
              style="margin-left: 5px"
              >服务项目</el-checkbox
            >
            <el-checkbox
              v-model="packAddDialog.ibAllowProduct"
              style="margin-left: 5px"
              >产品</el-checkbox
            >
          </el-form-item>
          <el-form-item
            label="门店品牌:"
            label-width="80px"
            style="margin-bottom: 5px"
            v-if="packAddDialog.isDiffbrand == '1'">
            <el-checkbox
              v-model="packAddDialog.isBrandAll"
              @change="changBrand1"
              style="margin-left: 5px">
              全部
            </el-checkbox>
            <el-checkbox
              v-for="item in packAddDialog.brands"
              @change="changBrand3"
              v-model="item.flag">
              {{ item.name }}
            </el-checkbox>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savePack('copyForm1')"
            >保存</el-button
          >
          <el-button @click="levelCancel(0)">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="packDuoDialog.title"
      :visible.sync="packDuoDialog.visible"
      width="740px">
      <el-form
        ref="copyForm4"
        :model="packDuoDialog"
        :rules="formrules"
        label-width="130px"
        :label-position="labelPosition">
        <el-form-item label="套餐编号:">
          {{ packDuoDialog.spcode }}
          <explain style="color: silver">套餐编号从001开始自动叠加</explain>
        </el-form-item>
        <el-form-item label="套餐名称:" prop="spname">
          <el-input
            v-model="packDuoDialog.spname"
            style="width: 320px"
            clearable />
        </el-form-item>
        <el-form-item label="可售时间:">
          <el-date-picker
            style="width: 320px"
            @change="changDates2"
            v-model="packDuoDialog.date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-checkbox
            v-model="packDuoDialog.type"
            @change="changDate2"
            style="margin-left: 5px"
            >长期
          </el-checkbox>
        </el-form-item>
        <el-form-item label="有效期:">
          <el-radio-group v-model="packDuoDialog.expiryType">
            <el-radio :label="0" @change="changeDuoCheck">长期</el-radio>
            <br />
            <div style="margin-top: 3px">
              <el-radio :label="1" @change="changeDuoCheck">有效期</el-radio>
              <el-input
                type="number"
                min="1"
                v-model="packDuoDialog.expirtyMonth"
                :disabled="packDuoDialog.expiryType != '1'"
                style="width: 100px"
                clearable></el-input>
              <el-tag style="margin-left: 5px">个月</el-tag>
              <explain style="color: silver"
                >从购买之日起延迟多少个月到期</explain
              >
            </div>
            <div style="margin-top: 4px">
              <el-radio :label="2" @change="changeDuoCheck"
                >指定到固定日期</el-radio
              >
              <el-date-picker
                v-model="packDuoDialog.expirydate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                :disabled="packDuoDialog.expiryType != '2'"
                style="width: 140px"
                placeholder="选择时间">
              </el-date-picker>
              <explain style="color: silver"
                >为套餐固定到期日期，不填为永久有效</explain
              >
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每人仅限购买:">
          <el-input
            type="number"
            min="1"
            v-model="packDuoDialog.bugcs"
            style="width: 120px"
            clearable />
          <el-tag style="margin-left: 5px">次</el-tag>
        </el-form-item>
        <el-form-item label="添加服务项目:">
          <el-button type="primary" @click="openDuoServ()"
            >添加服务项目</el-button
          >
          <div :key="index" v-for="(serv, index) in packDuoDialog.servs">
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="15"
                >项目组标题
                <el-input
                  v-model="serv.sdname"
                  placeholder="项目组标题"
                  style="width: 240px; margin: 0 10px 0 10px"
                  clearable />
              </el-col>
              <el-col :span="3">
                <el-link type="primary" @click="deleteDuoServ(index)"
                  >删除</el-link
                >
              </el-col>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="18">
                <el-tag
                  :key="i"
                  v-for="(item, i) in serv.items"
                  @close="delDuoServ(index, i)"
                  style="margin-right: 5px"
                  closable
                  >{{ item.servname }}
                </el-tag>
              </el-col>
              <el-col :span="6">
                <el-link type="primary" @click="addDuoServ(index, serv.items)"
                  >添加</el-link
                >
              </el-col>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="12"
                >每次可选项目次数
                <el-input
                  type="number"
                  min="1"
                  v-model="serv.selNum"
                  style="width: 100px; margin: 0 10px 0 10px"
                  placeholder="次数"
                  clearable />
                次
              </el-col>
              <el-col :span="6">
                <el-checkbox v-model="serv.isGift">赠送</el-checkbox>
              </el-col>
              <el-col :span="6"></el-col>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="12"
                >套餐总次数
                <el-input
                  type="number"
                  min="1"
                  v-model="serv.totalNum"
                  style="width: 140px; margin: 0 10px 0 10px"
                  placeholder="总次数"
                  clearable />
                次
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="12"
                >套餐总价
                <el-input
                  type="number"
                  min="0"
                  v-model="serv.pprice"
                  style="width: 152px; margin: 0 10px 0 10px"
                  placeholder="套餐总价"
                  clearable />
                元
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
            <el-divider></el-divider>
          </div>
          <!-- <el-link type="primary" @click="serveAdd" style="margin-top: 10px;">继续添加项目</el-link>-->
        </el-form-item>
        <el-form-item label="添加产品:">
          <el-button type="primary" @click="openDuoGood()">添加产品</el-button>
          <div :key="index" v-for="(product, index) in packDuoDialog.products">
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="15"
                >商品组标题
                <el-input
                  v-model="product.sdname"
                  style="width: 240px; margin: 0 10px 0 10px"
                  placeholder="项目组标题"
                  clearable />
              </el-col>
              <el-col :span="3">
                <el-link type="primary" @click="deleteDuoGood(index)"
                  >删除</el-link
                >
              </el-col>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="18">
                <el-tag
                  :key="i"
                  v-for="(item, i) in product.items"
                  @close="delDuoGood(index, i)"
                  style="margin-right: 5px"
                  closable
                  >{{ item.pname }}
                </el-tag>
              </el-col>
              <el-col :span="6">
                <el-link
                  type="primary"
                  @click="addDuoGood(index, product.items)"
                  >添加</el-link
                >
              </el-col>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="12"
                >每次可选产品次数
                <el-input
                  type="number"
                  min="1"
                  v-model="product.selNum"
                  style="width: 100px; margin: 0 10px 0 10px"
                  placeholder="次数"
                  clearable />
                次
              </el-col>
              <el-col :span="6">
                <el-checkbox v-model="product.isGift">赠送</el-checkbox>
              </el-col>
              <el-col :span="6"></el-col>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="12"
                >套餐总次数
                <el-input
                  type="number"
                  min="1"
                  v-model="product.totalNum"
                  style="width: 140px; margin: 0 10px 0 10px"
                  placeholder="次数"
                  clearable />
                次
              </el-col>
              <el-row :span="12"></el-row>
            </el-row>
            <el-row :gutter="24" type="flex" style="margin-top: 12px">
              <el-col :span="12"
                >套餐总价
                <el-input
                  type="number"
                  min="0"
                  v-model="product.pprice"
                  style="width: 152px; margin: 0 10px 0 10px"
                  placeholder="套餐总价"
                  clearable />
                元
              </el-col>
              <el-row :span="12"></el-row>
            </el-row>
            <el-divider></el-divider>
          </div>
          <!-- <el-link type="primary" @click="goodAdd" style="margin-top: 10px;">继续添加产品</el-link>-->
        </el-form-item>
        <el-form-item label="套餐成本价:">
          <el-input
            type="number"
            min="0"
            v-model="packDuoDialog.cost"
            style="width: 220px"
            clearable />
        </el-form-item>
        <el-form-item label="套餐销售:">
          <el-checkbox v-model="packDuoDialog.issale" style="margin-left: 5px"
            >允许线上销售</el-checkbox
          >
        </el-form-item>
        <el-form-item label="是否允许转赠：">
          <el-radio-group v-model="packDuoDialog.isTransfer">
            <el-radio label="1">允许</el-radio>
            <el-radio label="0">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品牌：" prop="brand">
          <el-select
            v-if="packDuoDialog.brandname ? false : true"
            clearable
            v-model="packDuoDialog.brand"
            @change="changBrnad('2')">
            <el-option
              v-for="item in brands"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <el-label v-if="packDuoDialog.brandname ? true : false">{{
            packDuoDialog.brandname
          }}</el-label>
        </el-form-item>
        <el-form-item label="适用门店：" prop="shop">
          <el-button type="primary" @click="selectShop()">选择门店</el-button>
          {{
            packDuoDialog.shoplist
              ? '共选中' + packDuoDialog.shoplist.length + '家门店'
              : ''
          }}
        </el-form-item>
        <el-form-item
          label="套餐分类："
          prop="branch"
          :rules="[{ required: true, message: '请选择套餐分类' }]">
          <el-select
            v-model="packDuoDialog.branch"
            @change="changeDuoPackageBranch"
            placeholder="请选择部门"
            style="width: 160px">
            <el-option
              v-for="item in branchs"
              :key="item.id"
              :label="item.bname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model="packDuoDialog.ptid"
            @change="changeDuoPackageType"
            placeholder="请选择类别"
            style="width: 160px; margin-left: 20px">
            <el-option
              v-for="item in packDuoDialog.packageType"
              :key="item.id"
              :label="item.pname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-divider>异店划套餐设置</el-divider>
        <el-form-item label="是否允许跨店消费:">
          <el-radio
            :label="1"
            v-model="packDuoDialog.isDiffshop"
            style="margin-left: 5px"
            >允许</el-radio
          >
          <el-radio
            :label="0"
            v-model="packDuoDialog.isDiffshop"
            style="margin-left: 5px"
            >不允许</el-radio
          >
          <yid-ask
            >适用门店内的跨店消费，赠送项目/产品仅能在赠送门店消费，不允许则只能在购买套餐门店消费；非适用门店内消费可设置跨品牌消费</yid-ask
          >
          <el-form-item
            label="套餐内容:"
            label-width="80px"
            v-if="packDuoDialog.isDiffshop == '1'">
            <el-checkbox
              v-model="packDuoDialog.isAllowPackage"
              style="margin-left: 5px"
              >服务项目</el-checkbox
            >
            <el-checkbox
              v-model="packDuoDialog.isAllowProduct"
              style="margin-left: 5px"
              >产品</el-checkbox
            >
          </el-form-item>
        </el-form-item>
        <el-form-item label="是否允许跨品牌消费:">
          <el-radio
            :label="1"
            v-model="packDuoDialog.isDiffbrand"
            style="margin-left: 5px"
            >允许</el-radio
          >
          <el-radio
            :label="0"
            v-model="packDuoDialog.isDiffbrand"
            style="margin-left: 5px"
            >不允许</el-radio
          >
          <el-form-item
            label="套餐内容:"
            label-width="80px"
            style="margin-bottom: 5px"
            v-if="packDuoDialog.isDiffbrand == '1'">
            <el-checkbox
              v-model="packDuoDialog.ibAllowPackage"
              style="margin-left: 5px"
              >服务项目</el-checkbox
            >
            <el-checkbox
              v-model="packDuoDialog.ibAllowProduct"
              style="margin-left: 5px"
              >产品</el-checkbox
            >
          </el-form-item>
          <el-form-item
            label="门店品牌:"
            label-width="80px"
            style="margin-bottom: 5px"
            v-if="packDuoDialog.isDiffbrand == '1'">
            <el-checkbox
              v-model="packDuoDialog.isBrandAll"
              @change="changBrand2"
              style="margin-left: 5px">
              全部
            </el-checkbox>
            <el-checkbox
              v-for="item in packDuoDialog.brands"
              @change="changBrand3"
              v-model="item.flag">
              {{ item.name }}
            </el-checkbox>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveDuoPack('copyForm4')"
            >保存</el-button
          >
          <el-button @click="levelCancel(3)">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="servAddDialog.title"
      :visible.sync="servAddDialog.visible"
      width="800px">
      <el-form label-width="100px" ref="copyForm2">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="servAddDialog.branch"
            @change="changeBranch(servAddDialog.branch, '1')"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in servAddDialog.branchs"
              :key="item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="servAddDialog.serviceType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in servAddDialog.serviceTypes"
              :key="item.id"
              :label="item.sname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
            clearable
            v-model="servAddDialog.sername"
            placeholder="项目名称/编码"
            style="margin-left: 5px; width: 160px"></el-input>
          <el-button
            type="primary"
            @click="addServs()"
            v-if="!duoflag"
            style="margin-left: 6px"
            >确认添加
          </el-button>
          <el-button
            type="primary"
            @click="addDuoServs(servAddDialog.index)"
            v-if="duoflag"
            style="margin-left: 6px"
            >确认添加
          </el-button>
          <el-button type="primary" @click="levelCancel(1)">取消</el-button>
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox
                  v-model="servAddDialog.checkbox"
                  @change="checkServ"></el-checkbox>
                (编号）项目名称
              </th>
            </tr>
            <tr
              :key="item.servid"
              v-for="item in servAddDialog.services"
              v-if="screenService(item)">
              <td>{{ item.bname }}</td>
              <td>{{ item.typename }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :label="item.servid"></el-checkbox>
                ({{ item.sdcode }}){{ item.sdname }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="goodAddDialog.title"
      :visible.sync="goodAddDialog.visible"
      width="800px">
      <el-form label-width="120px" ref="copyForm3">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="goodAddDialog.branch"
            @change="changeBranch(goodAddDialog.branch, '2')"
            placeholder="所属部门"
            style="width: 140px">
            <el-option
              v-for="item in goodAddDialog.branchs"
              :key="item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="goodAddDialog.productType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in goodAddDialog.productTypes"
              :key="item.id"
              :label="item.cname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
            clearable
            v-model="goodAddDialog.goodname"
            placeholder="产品名称/编码"
            style="margin-left: 5px; width: 160px"></el-input>
          <el-button
            type="primary"
            @click="addGoods()"
            v-if="!duoflag"
            style="margin-left: 6px"
            >确认添加
          </el-button>
          <el-button
            type="primary"
            @click="addDuoGoods(goodAddDialog.index)"
            v-if="duoflag"
            tyle="margin-left: 6px"
            >确认添加多
          </el-button>
          <el-button type="primary" @click="levelCancel(2)">取消</el-button>
        </el-form-item>
        <el-form-item label="">
          <table border="1" style="width: 100%" class="serve-table">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox @change="checkProd"></el-checkbox>
                (编号）项目名称 规格
              </th>
            </tr>
            <tr
              :key="item.pid"
              v-for="item in goodAddDialog.products"
              v-if="screenProduct(item)">
              <td>{{ item.bname }}</td>
              <td>{{ item.typename }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :value="item.pid"></el-checkbox>
                ({{ item.sdcode }}) {{ item.sdname }} {{ item.norms }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
      @close="shopDialog.visible = false"
      width="1100px">
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
              ref="selectRegionRef"
              @clear="clearSelectRegion"
              clearable
              v-model="shopDialog.region.name"
              style="width: 160px">
              <el-option
                hidden
                :value="shopDialog.region.id"
                style="height: auto"></el-option>
              <el-tree
                :expand-on-click-node="false"
                :check-on-click-node="true"
                show-checkbox
                check-strictly
                node-key="id"
                :data="regions"
                :props="defaultProps"
                @check-change="handleNodeClick"
                ref="templateRegionTree">
              </el-tree>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="queryShop()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="14">
          <yid-table
            pagination
            ref="tableShop"
            style="margin-top: 10px"
            :data="shopData"
            @selection-change="handleSelectionChange">
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
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop()" type="primary" size="mini"
              ><i class="el-icon-right"></i>
            </el-button>
          </div>
        </el-col>
        <el-col :span="8" style="margin-left: 5px">
          <el-link type="primary" @click="deleteBatch()">批量删除</el-link>
          <yid-table
            ref="table2"
            style="margin-top: 10px"
            :data="shopDialog.shoplist"
            @selection-change="handleSelectionData">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column
              label="门店编码"
              min-width="80"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="deleteShop(scope.row, shopDialog.spname)"
                  >删除
                </el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col :span="2" :offset="10" v-if="type == '1'">
          <el-button type="primary" @click="setShop()">选好了</el-button>
        </el-col>
        <el-col :span="2" :offset="10" v-if="type == '2'">
          <el-button type="primary" @click="saveShop()">保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible = false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="importCancel"
      width="700px">
      <el-form
        :model="importDialog.model"
        label-width="120px"
        ref="copyForm"
        :label-position="labelPosition">
        <p>导入套餐项目方法</p>
        <p>1、从大系统美容疗程价格体系报表导出excle；</p>
        <p>2、将明细表导入；</p>
        <el-form-item label="选择导入文件:">
          <el-upload
            ref="uploadExcel"
            class="avatar-uploader"
            :headers="myheaders"
            :action="excelConvertUrl"
            :show-file-list="true"
            :limit="1"
            :on-success="handleAvatarExcelSuccess"
            :before-upload="beforeAvatarExcelUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持上传 .xls
              .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveImportPackage" type="primary">保存</el-button>
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import YidAsk from '../../library/components/ask/src/index.vue'

/**
 * 清空
 * @param obj
 */
function isClear(obj) {
  for (var i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = []
    } else if (i == 'page' || i == 'limit') {
    } else {
      obj[i] = ''
    }
  }
}

export default {
  components: { YidAsk },
  name: 'list',
  data() {
    return {
      upload: yid.config.API.UPLOAD,
      importDialog: {
        title: '项目体系导入',
        visible: false,
        services: []
      },
      myheaderData: {},
      myheaders: {},
      type: '',
      duoflag: false,
      spids: [],
      labelPosition: 'left',
      tableData: [],
      packAddDialog: {
        id: '',
        title: '',
        visible: false,
        spcode: '',
        spname: '',
        date: [],
        type: false,
        bugcs: '',
        expirtyMonth: '',
        expiryType: '',
        expirydate: '',
        servs: [],
        products: [],
        cost: '',
        totalprice: '',
        branch: [],
        issale: '',
        isDiffshop: '1',
        isAllowPackage: '1',
        isAllowProduct: '1',
        isDiffbrand: '0',
        ibAllowPackage: '',
        ibAllowProduct: '',
        dbBrands: [],
        isBrandAll: '',
        shoplist: [],
        brand: [],
        brandname: '',
        brands: [],
        isTransfer: '',
        packageType: [],
        ptid: '',
        ptcode: '',
        ptname: '',
        photopath: ''
      },
      packDuoDialog: {
        id: '',
        title: '',
        visible: false,
        spcode: '',
        spname: '',
        date: [],
        type: false,
        bugcs: '',
        expirtyMonth: '',
        expiryType: '',
        expirydate: '',
        servs: [],
        products: [],
        branch: [],
        cost: '',
        issale: '',
        isDiffshop: '1',
        isAllowPackage: '1',
        isAllowProduct: '1',
        isDiffbrand: '0',
        ibAllowPackage: '',
        ibAllowProduct: '',
        dbBrands: [],
        isBrandAll: '',
        shoplist: [],
        brand: [],
        brandname: '',
        brands: [],
        isTransfer: '',
        packageType: [],
        ptid: '',
        ptcode: '',
        ptname: ''
      },
      servAddDialog: {
        title: '添加服务项目',
        visible: false,
        branchs: [],
        branch: '',
        serviceTypes: [],
        serviceType: '',
        services: [],
        checkbox: false
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
      formrules: {
        spname: [
          { required: true, message: '请填写项套餐名称' },
          { min: 0, max: 16, message: '套餐名称在16个汉字以内' }
        ],
        brand: [{ required: true, message: '品牌必填' }]
      },
      serviceAllType: [],
      productAllType: [],
      packageAllType: [],
      form: {
        package: '',
        shop: '',
        brand: '',
        status: '1',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        branch: '',
        ptid: ''
      },
      filterShopList: [],
      allShopList: [],
      brandData: [],
      shopDialog: {
        id: '',
        spname: '',
        title: '',
        visible: false,
        shop: '',
        type: '',
        brandId: '',
        region: '',
        shoplist: [],
        status: '1',
        page: 1,
        limit: 10
      },
      selectShops: [],
      branchs: [],
      brands: [],
      regions: [],
      shopData: [],
      types: [
        { name: '美发', value: '1' },
        { name: '美容', value: '2' },
        { name: '综合', value: '3' }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      packageListType: [],
      selectShopData: [],
      isTrue: true
    }
  },
  computed: {
    screenService() {
      return function (item) {
        let flag = true
        if (this.servAddDialog.branch) {
          if (this.servAddDialog.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servAddDialog.serviceType) {
          if (this.servAddDialog.serviceType == item.servtid) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.servAddDialog.sername) {
          if (
            item.sdname.indexOf(this.servAddDialog.sername) !== -1 ||
            item.sdcode.indexOf(this.servAddDialog.sername) !== -1
          ) {
            flag = true
          } else {
            flag = false
          }
        }
        return flag
      }
    },
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
        if (this.goodAddDialog.goodname) {
          if (
            item.sdname.indexOf(this.goodAddDialog.goodname) !== -1 ||
            item.sdcode.indexOf(this.goodAddDialog.goodname) !== -1
          ) {
            flag = true
          } else {
            flag = false
          }
        }
        return flag
      }
    }
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
    handleNodeClick(data, checked, node) {
      if (checked == true) {
        let id = data.id
        let valueObj = {}
        valueObj.id = id
        valueObj.name = data.name
        this.shopDialog.region = valueObj
        this.shopDialog.region.childrenIds = []
        this.getSelectAllRegion(data, this.shopDialog.region.childrenIds)
        this.$refs.templateRegionTree.setCheckedKeys([id])
      } else {
        if (this.shopDialog.region.id == data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id])
        }
      }
      this.$refs.selectRegionRef.blur()
    },
    getSelectAllRegion(region, regionChildrenIds) {
      if (region.children == null) {
        return
      }
      for (let i = 0; i < region.children.length; i++) {
        let child = region.children[i]
        regionChildrenIds.push(child.id)
        this.getSelectAllRegion(child, regionChildrenIds)
      }
    },
    clearSelectRegion() {
      this.shopDialog.region = {}
      this.$refs.templateRegionTree.setCheckedKeys([])
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    filterBrand(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.brandId) {
          if (item.brandId.indexOf(v) !== -1) return true
        } else {
          return false
        }
      })
    },
    changDate1(val) {
      if (val) {
        this.packAddDialog.date = []
      }
    },
    changDate2(val) {
      if (val) {
        this.packDuoDialog.date = []
      }
    },
    changDates1(val) {
      if (val) {
        this.packAddDialog.type = false
      }
    },
    changDates2(val) {
      if (val) {
        this.packDuoDialog.type = false
      }
    },
    lookup() {
      const fetch = service.servicepackage.findServPackList
      const params = this.form
      this.$refs['tableData'].reloadData({
        fetch,
        params
      })
      if (this.form.status == '1') {
        this.form.status = '2'
      } else {
        this.form.status = '1'
      }
    },
    dateFormat: function (row) {
      if (row.btype == '1') {
        return '长期'
      }
      const sdate = row.sdate
      const edate = row.edate
      if (!sdate || !edate) {
        return ''
      }
      return $yid.util.formatDate(sdate) + ' ~ ' + $yid.util.formatDate(edate)
    },
    dateFormat1: function (row) {
      if (row.expiryType == '1') {
        return row.expirtyMonth + '个月'
      } else {
        if (row.expirydate) {
          return $yid.util.formatDate(row.expirydate)
        } else {
          return '长期'
        }
      }
    },
    showImportDialog() {
      this.importDialog.visible = true
      this.importDialog.services = []
      this.myheaders['saas-version'] = 'zpw'
      this.myheaders['authorization'] =
        'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
      this.$refs.uploadExcel.clearFiles()
    },
    levelCancel(i) {
      // this.$refs['copyForm1'].resetFields()
      if (i == 0) this.packAddDialog.visible = false
      if (i == 1) this.servAddDialog.visible = false
      if (i == 2) this.goodAddDialog.visible = false
      if (i == 3) this.packDuoDialog.visible = false
    },
    changeCheck(val) {
      if (val == '0') {
        this.packAddDialog.expirydate = ''
        this.packAddDialog.expirtyMonth = ''
      } else if (val == '1') {
        this.packAddDialog.expirydate = ''
      } else {
        this.packAddDialog.expirtyMonth = ''
      }
    },
    changeDuoCheck(val) {
      if (val == '0') {
        this.packDuoDialog.expirydate = ''
        this.packDuoDialog.expirtyMonth = ''
      } else if (val == 1) {
        this.packDuoDialog.expirydate = ''
      } else {
        this.packDuoDialog.expirtyMonth = ''
      }
    },
    addServPack() {
      this.duoflag = false
      this.packAddDialog.id = null
      this.packAddDialog.title = '新增套餐'
      //   service.servicepackage.newcode().then(res => {
      this.packAddDialog.spcode = ''
      this.packAddDialog.spname = ''
      this.packAddDialog.bugcs = ''
      this.packAddDialog.date = []
      this.packAddDialog.expirtyMonth = ''
      this.packAddDialog.expiryType = ''
      this.packAddDialog.expirydate = ''
      this.packAddDialog.servs = []
      this.packAddDialog.products = []
      this.packAddDialog.cost = ''
      this.packAddDialog.visible = true
      this.packAddDialog.type = false
      this.packAddDialog.brands = []
      this.packAddDialog.photopath = ''
      this.brands.forEach(a => {
        a.flag = false
        this.packAddDialog.brands.push({ ...a })
      })
      this.packAddDialog.issale = ''
      this.packAddDialog.isDiffshop = 1
      this.packAddDialog.isAllowPackage = true
      this.packAddDialog.isAllowProduct = true
      this.packAddDialog.isDiffbrand = 0
      this.packAddDialog.ibAllowPackage = ''
      this.packAddDialog.ibAllowProduct = ''
      this.packAddDialog.dbBrands = []
      this.packAddDialog.branch = ''
      this.packAddDialog.packageType = []
      this.packAddDialog.ptid = ''
      this.packAddDialog.ptcode = ''
      this.packAddDialog.isBrandAll = ''
      this.packAddDialog.shoplist = []
      this.packAddDialog.isTransfer = '1'
      this.packAddDialog.brand = ''
      this.packAddDialog.brandname = ''
      this.myheaderData = {
        authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
      }
      //});
    },
    openServ() {
      this.duoflag = false
      this.servAddDialog.visible = true
      this.servAddDialog.branch = ''
      this.servAddDialog.branchs = []
      this.servAddDialog.serviceType = ''
      this.servAddDialog.serviceTypes = []
      this.servAddDialog.checkbox = false
      this.branchs.forEach(item => {
        this.servAddDialog.branchs.push({ ...item })
      })
      this.servAddDialog.services.forEach(item => {
        item.type = false
        this.packAddDialog.servs.forEach(serv => {
          if (serv.servid == item.servid) {
            // item.type = true;
          }
        })
      })
    },
    checkServ(val) {
      this.servAddDialog.services.forEach(item => {
        if (!this.servAddDialog.branch) {
          item.type = val
        } else if (this.servAddDialog.branch == item.branch) {
          item.type = val
        }
      })
    },
    openGood() {
      this.duoflag = false
      this.goodAddDialog.visible = true
      this.goodAddDialog.branch = ''
      this.goodAddDialog.branchs = []
      this.goodAddDialog.productType = ''
      this.goodAddDialog.productTypes = []
      this.goodAddDialog.checkbox = false
      this.branchs.forEach(item => {
        this.goodAddDialog.branchs.push({ ...item })
      })
      this.goodAddDialog.products.forEach(item => {
        item.type = false
        this.packAddDialog.products.forEach(serv => {
          if (serv.pid == item.pid) {
            item.type = true
          }
        })
      })
    },
    addGoods() {
      const that = this
      this.goodAddDialog.products.forEach(item => {
        if (
          item.type &&
          (!that.goodAddDialog.branch ||
            item.branch == that.goodAddDialog.branch) &&
          (!that.goodAddDialog.productType ||
            item.servtid == that.goodAddDialog.productType)
        ) {
          let flag = true
          that.packAddDialog.products.forEach(pro => {
            if (item.pid == pro.pid) {
              flag = false
            }
          })
          if (flag) {
            that.packAddDialog.products.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              price: '',
              pprice: '',
              num: '',
              type: '1',
              pid: item.pid,
              is_gift: ''
            })
          }
        }
      })
      this.levelCancel(2)
    },
    addServs() {
      const that = this
      this.servAddDialog.services.forEach(item => {
        if (
          item.type &&
          (!that.servAddDialog.branch ||
            item.branch == that.servAddDialog.branch) &&
          (!that.servAddDialog.serviceType ||
            item.servtid == that.servAddDialog.serviceType)
        ) {
          let flag = true
          // that.packAddDialog.servs.forEach(serv =>{
          //     if(item.servid==serv.servid){
          //         flag=false;
          //     }
          // })
          if (flag) {
            that.packAddDialog.servs.push({
              sdcode: item.sdcode,
              sdname: item.sdname,
              price: '',
              pprice: '',
              num: '',
              type: '1',
              servid: item.servid,
              is_gift: ''
            })
          }
        }
      })
      this.levelCancel(1)
    },
    duoServPack() {
      this.duoflag = true
      this.packDuoDialog.id = null
      this.packDuoDialog.title = '新增多选套餐'
      //service.servicepackage.newcode().then(res => {
      this.packDuoDialog.spcode = ''
      this.packDuoDialog.spname = ''
      this.packDuoDialog.date = []
      this.packDuoDialog.bugcs = ''
      this.packDuoDialog.expirtyMonth = ''
      this.packDuoDialog.expiryType = ''
      this.packDuoDialog.expirydate = ''
      this.packDuoDialog.servs = []
      this.packDuoDialog.products = []
      this.packDuoDialog.visible = true
      this.packDuoDialog.type = false
      this.packDuoDialog.brands = []
      this.brands.forEach(a => {
        a.flag = false
        this.packDuoDialog.brands.push({ ...a })
      })
      this.packDuoDialog.issale = ''
      this.packDuoDialog.isDiffshop = 1
      this.packDuoDialog.isAllowPackage = true
      this.packDuoDialog.isAllowProduct = true
      this.packDuoDialog.isDiffbrand = 0
      this.packDuoDialog.ibAllowPackage = ''
      this.packDuoDialog.ibAllowProduct = ''
      this.packDuoDialog.dbBrands = []
      this.packDuoDialog.branch = ''
      this.packDuoDialog.packageType = []
      this.packDuoDialog.ptid = ''
      this.packDuoDialog.ptcode = ''
      this.packDuoDialog.isBrandAll = ''
      this.packDuoDialog.shoplist = []
      this.packDuoDialog.isTransfer = '0'
      this.packDuoDialog.brand = ''
      this.packDuoDialog.brandname = ''
      //});
    },
    editServPack(data) {
      const row = $yid.util.deepClone(data)
      if (row.isMultiple == '0') {
        this.duoflag = false
        this.packAddDialog.title = '修改套餐'
        this.packAddDialog.visible = true
        this.packAddDialog.id = row.id
        this.packAddDialog.spcode = row.spcode
        this.packAddDialog.spname = row.spname
        this.packAddDialog.bugcs = row.bugcs
        this.packAddDialog.date = []
        if (row.btype == '1') {
          this.packAddDialog.type = true
        } else {
          this.packAddDialog.type = false
          this.packAddDialog.date = [row.sdate, row.edate]
        }
        this.packAddDialog.expirtyMonth = row.expirtyMonth
        this.packAddDialog.expiryType = Number(row.expiryType)
        this.packAddDialog.expirydate = row.expirydate
        this.packAddDialog.cost = row.cost
        this.packAddDialog.revision = row.revision
        this.packAddDialog.photopath = row.photopath
        this.packAddDialog.servs = row.servs || []
        this.packAddDialog.servs.forEach(item => {
          if (item.isGift == '1') {
            //赠送
            item.isGift = true
          } else {
            //不赠送
            item.isGift = false
          }
        })
        this.packAddDialog.products = row.products || []
        this.packAddDialog.products.forEach(item => {
          if (item.isGift == '1') {
            //赠送
            item.isGift = true
          } else {
            //不赠送
            item.isGift = false
          }
        })
        this.packAddDialog.brand = row.brand
        this.packAddDialog.brandname = row.brandname
        this.packAddDialog.branch = String(row.branch)
        this.packAddDialog.packageType = []
        this.packageAllType.forEach(item => {
          if (String(row.branch) == String(item.branch)) {
            this.packAddDialog.packageType.push(item)
          }
        })
        this.packAddDialog.ptid = String(row.ptid)
        this.packAddDialog.ptcode = row.ptcode
        this.packAddDialog.shoplist = row.shoplist
        this.packAddDialog.isTransfer = row.isTransfer
        this.packAddDialog.issale = row.isSale == '1' ? true : false
        this.packAddDialog.isDiffshop = Number(row.isDiffshop)
        this.packAddDialog.isAllowPackage =
          row.dsAllowPackage == '1' ? true : false
        this.packAddDialog.isAllowProduct =
          row.dsAllowProduct == '1' ? true : false
        this.packAddDialog.isDiffbrand = Number(row.isDiffbrand)
        this.packAddDialog.ibAllowPackage =
          row.dbAllowPackage == '1' ? true : false
        this.packAddDialog.ibAllowProduct =
          row.dbAllowProduct == '1' ? true : false
        if (row.dbBrandnames) {
          this.packAddDialog.dbBrands = row.dbBrandnames.split(',')
        } else {
          this.packAddDialog.dbBrands = []
        }
        this.packAddDialog.brands = []
        this.brands.forEach(a => {
          a.flag = false
          this.packAddDialog.dbBrands.forEach(b => {
            if (a.name == b) {
              a.flag = true
            }
          })
          this.packAddDialog.brands.push({ ...a })
        })
        let isAll = true
        this.packAddDialog.brands.forEach(each => {
          if (each.flag == false) {
            isAll = false
          }
        })
        this.packAddDialog.isBrandAll = isAll
      }
      if (row.isMultiple == '1') {
        this.duoflag = true
        this.packDuoDialog.title = '修改多选套餐'
        this.packDuoDialog.visible = true
        this.packDuoDialog.id = row.id
        this.packDuoDialog.spcode = row.spcode
        this.packDuoDialog.spname = row.spname
        this.packDuoDialog.date = []
        this.packDuoDialog.bugcs = row.bugcs
        if (row.btype == '1') {
          this.packDuoDialog.type = true
        } else {
          this.packDuoDialog.type = false
          this.packDuoDialog.date = [row.sdate, row.edate]
        }
        this.packDuoDialog.expirtyMonth = row.expirtyMonth
        this.packDuoDialog.expiryType = Number(row.expiryType)
        this.packDuoDialog.expirydate = row.expirydate
        this.packDuoDialog.servs = row.servs || []
        this.packDuoDialog.products = row.products || []
        this.packDuoDialog.cost = row.cost
        this.packDuoDialog.isTransfer = row.isTransfer
        this.packDuoDialog.revision = row.revision
        this.packAddDialog.photopath = row.photopath
        this.packDuoDialog.servs.forEach(item => {
          if (item.isGift == '1') {
            //赠送
            item.isGift = true
          } else {
            //不赠送
            item.isGift = false
          }
          if (!item.items) {
            item.items = []
          }
        })
        this.packDuoDialog.products.forEach(item => {
          if (item.isGift == '1') {
            //赠送
            item.isGift = true
          } else {
            //不赠送
            item.isGift = false
          }
          if (!item.items) {
            item.items = []
          }
        })
        this.packDuoDialog.brand = row.brand
        this.packDuoDialog.brandname = row.brandname
        this.packDuoDialog.branch = String(row.branch)
        this.packDuoDialog.packageType = []
        this.packageAllType.forEach(item => {
          if (String(row.branch) == String(item.branch)) {
            this.packDuoDialog.packageType.push(item)
          }
        })
        this.packDuoDialog.ptid = String(row.ptid)
        this.packDuoDialog.ptcode = row.ptcode
        this.packDuoDialog.shoplist = row.shoplist
        this.packDuoDialog.issale = row.isSale == '1' ? true : false
        this.packDuoDialog.isDiffshop = Number(row.isDiffshop)
        this.packDuoDialog.isAllowPackage =
          row.dsAllowPackage == '1' ? true : false
        this.packDuoDialog.isAllowProduct =
          row.dsAllowProduct == '1' ? true : false
        this.packDuoDialog.isDiffbrand = Number(row.isDiffbrand)
        this.packDuoDialog.ibAllowPackage =
          row.dbAllowPackage == '1' ? true : false
        this.packDuoDialog.ibAllowProduct =
          row.dbAllowProduct == '1' ? true : false
        if (row.dbBrandnames) {
          this.packDuoDialog.dbBrands = row.dbBrandnames.split(',')
        } else {
          this.packDuoDialog.dbBrands = []
        }
        this.packDuoDialog.brands = []
        this.brands.forEach(a => {
          a.flag = false
          this.packDuoDialog.dbBrands.forEach(b => {
            if (a.name == b) {
              a.flag = true
            }
          })
          this.packDuoDialog.brands.push({ ...a })
        })
        let isAll = true
        this.packDuoDialog.brands.forEach(each => {
          if (each.flag == false) {
            isAll = false
          }
        })
        this.packDuoDialog.isBrandAll = isAll
      }
    },
    stop(row) {
      const params = {
        id: row.id,
        revision: row.revision
      }
      if (row.status == '1') {
        params.status = '2'
      } else {
        params.status = '1'
      }
      service.servicepackage.editStatus(params).then(res => {
        if (res.resp_code == '200') {
          this.querylist()
          yid.util.success(res.resp_msg)
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    openDuoServ() {
      this.duoflag = true
      this.servAddDialog.visible = true
      this.servAddDialog.branch = ''
      this.servAddDialog.branchs = []
      this.servAddDialog.checkbox = false
      this.branchs.forEach(item => {
        this.servAddDialog.branchs.push({ ...item })
      })
      this.servAddDialog.services.forEach(item => {
        item.type = false
      })
    },
    addDuoServ(index, rows) {
      this.servAddDialog.visible = true
      this.servAddDialog.index = index
      this.servAddDialog.branch = ''
      this.servAddDialog.branchs = []
      this.servAddDialog.checkbox = false
      this.branchs.forEach(item => {
        this.servAddDialog.branchs.push({ ...item })
      })
      this.servAddDialog.services.forEach(item => {
        item.type = false
        rows.forEach(row => {
          if (item.servid == row.servid) {
            item.type = true
          }
        })
      })
    },
    addDuoServs(index) {
      const servs = []
      this.servAddDialog.services.forEach(item => {
        if (
          item.type &&
          (!this.servAddDialog.branch ||
            item.branch == this.servAddDialog.branch)
        ) {
          servs.push({
            servid: item.servid,
            servcode: item.sdcode,
            servname: item.sdname
          })
        }
      })
      if (servs.length == 0) {
        yid.util.error('多选套餐没有选择项目')
        return
      }
      if (index || index >= 0) {
        this.packDuoDialog.servs[index].items = servs
      } else {
        this.packDuoDialog.servs.push({
          items: servs,
          price: '',
          pprice: '',
          num: '',
          type: '1',
          is_gift: '',
          sdcode: '',
          sdname: ''
        })
      }
      this.levelCancel(1)
    },
    deleteDuoServ(i) {
      this.packDuoDialog.servs.splice(i, 1)
    },
    delDuoServ(i, j) {
      if (
        this.packDuoDialog.servs &&
        this.packDuoDialog.servs[i] &&
        this.packDuoDialog.servs[i].items
      ) {
        this.packDuoDialog.servs[i].items.splice(j, 1)
      }
    },
    openDuoGood() {
      this.goodAddDialog.visible = true
      this.goodAddDialog.index = -1
      this.goodAddDialog.branch = ''
      this.goodAddDialog.branchs = []
      this.goodAddDialog.checkbox = false
      this.branchs.forEach(item => {
        this.goodAddDialog.branchs.push({ ...item })
      })
      this.goodAddDialog.products.forEach(item => {
        item.type = false
      })
    },
    addDuoGood(index, rows) {
      this.goodAddDialog.visible = true
      this.goodAddDialog.index = index
      this.goodAddDialog.branch = ''
      this.goodAddDialog.branchs = []
      this.goodAddDialog.checkbox = false
      this.branchs.forEach(item => {
        this.goodAddDialog.branchs.push({ ...item })
      })
      this.goodAddDialog.products.forEach(item => {
        item.type = false
        rows.forEach(row => {
          if (item.pid == row.pid) {
            item.type = true
          }
        })
      })
    },
    addDuoGoods(index) {
      const that = this
      const products = []
      this.goodAddDialog.products.forEach(item => {
        if (
          item.type &&
          (!that.goodAddDialog.branch ||
            item.branch == that.goodAddDialog.branch)
        ) {
          products.push({
            pid: item.pid,
            pcode: item.sdcode,
            pname: item.sdname
          })
        }
      })
      if (products.length == 0) {
        yid.util.error('多选套餐没有选择产品')
        return
      }
      if (index >= 0) {
        this.packDuoDialog.products[index].items = products
      } else {
        this.packDuoDialog.products.push({
          items: products,
          price: '',
          pprice: '',
          type: '2',
          num: '',
          is_gift: '',
          sdcode: '',
          sdname: ''
        })
      }
      this.levelCancel(2)
    },
    deleteDuoGood(i) {
      this.packDuoDialog.products.splice(i, 1)
    },
    delDuoGood(i, j) {
      if (
        this.packDuoDialog.products &&
        this.packDuoDialog.products[i] &&
        this.packDuoDialog.products[i].items
      ) {
        this.packDuoDialog.products[i].items.splice(j, 1)
      }
    },
    saveDuoPack(formName) {
      const that = this
      if (!this.packDuoDialog.type && this.packDuoDialog.date.length == 0) {
        yid.util.error('请输入可售时间:')
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let i = 0
          if (that.packDuoDialog.servs && that.packDuoDialog.servs.length > 0) {
            i += that.packDuoDialog.servs.length
          }
          if (
            that.packDuoDialog.products &&
            that.packDuoDialog.products.length > 0
          ) {
            i += that.packDuoDialog.products.length
          }
          if (i == 0) {
            yid.util.error('没有选择项目或产品')
            return
          }
          if (
            that.packDuoDialog.expiryType &&
            that.packDuoDialog.expiryType == '1' &&
            !that.packDuoDialog.expirtyMonth
          ) {
            yid.util.error('请输入有效期有多少个月')
            return
          }
          if (
            that.packDuoDialog.expiryType &&
            that.packDuoDialog.expiryType == '2' &&
            !that.packDuoDialog.expirydate
          ) {
            yid.util.error('请输入有效期到固定日期')
            return
          }
          let pprice = 0,
            message = ''
          that.packDuoDialog.servs.forEach((item, index) => {
            if (!item.items || item.items.length == 0) {
              message += '项目第' + (index + 1) + '行没有选择项目 '
            } else {
              item.sdcode = ''
              item.items.forEach(each => {
                item.sdcode += each.servcode + ','
              })
              if (item.sdcode) {
                item.sdcode = item.sdcode.substr(0, item.sdcode.length - 1)
              }
            }
            if (!item.sdname) {
              message += '项目第' + (index + 1) + '行没有填项目组标题 '
            }
            if (!item.selNum) {
              message += '项目第' + (index + 1) + '行没有填可选项目次数 '
            }
            if (!item.totalNum) {
              message += '项目第' + (index + 1) + '行没有填套餐总次数 '
            }
            if (item.pprice == '' || item.pprice == null) {
              message += '项目第' + (index + 1) + '行没填套餐总价 '
            }
            if (item.isGift) {
              item.isGift = '1'
            } else {
              pprice += item.pprice
              item.isGift = '0'
            }
            if (item.totalNum && item.pprice) {
              item.price =
                Number(item.pprice) / Number(item.totalNum).toFixed(1)
            }
          })
          that.packDuoDialog.products.forEach((item, index) => {
            if (!item.items || item.items.length == 0) {
              message += '产品第' + (index + 1) + '行没有选择产品 '
            } else {
              item.sdcode = ''
              item.items.forEach(each => {
                item.sdcode += each.pcode + ','
              })
              if (item.sdcode) {
                item.sdcode = item.sdcode.substr(0, item.sdcode.length - 1)
              }
            }
            if (!item.sdname) {
              message += '产品第' + (index + 1) + '行没有填产品组标题 '
            }
            if (!item.selNum) {
              message += '产品第' + (index + 1) + '行没有填可选产品次数 '
            }
            if (!item.totalNum) {
              message += '产品第' + (index + 1) + '行没有填套餐总次数 '
            }
            if (item.pprice == '' || item.pprice == null) {
              message += '产品第' + (index + 1) + '行没填套餐总价 '
            }
            if (item.isGift) {
              item.isGift = '1'
            } else {
              item.isGift = '0'
              pprice += item.pprice
            }
            if (item.totalNum && item.pprice) {
              item.price =
                Number(item.pprice) / Number(item.totalNum).toFixed(1)
            }
          })
          if (message) {
            yid.util.error(message)
            return
          }
          if (
            that.packDuoDialog.cost &&
            Number(that.packDuoDialog.cost) > Number(pprice)
          ) {
            yid.util.error(
              '成本价:' + that.packDuoDialog.cost + '大于套餐价:' + pprice
            )
            return
          }
          that.packDuoDialog.totalprice = pprice
          if (that.packDuoDialog.type) {
            that.packDuoDialog.btype = '1'
          } else {
            that.packDuoDialog.btype = '0'
            that.packDuoDialog.sdate = that.packDuoDialog.date[0]
            that.packDuoDialog.edate = that.packDuoDialog.date[1]
          }
          if (that.packDuoDialog.expirydate) {
            that.packDuoDialog.expirydate = that.packDuoDialog.expirydate
          }
          that.packDuoDialog.isMultiple = '1'
          if (that.packDuoDialog.issale) {
            that.packDuoDialog.isSale = 1
          } else {
            that.packDuoDialog.isSale = 0
          }
          if (that.packDuoDialog.isAllowPackage) {
            that.packDuoDialog.dsAllowPackage = 1
          } else {
            that.packDuoDialog.dsAllowPackage = 0
          }
          if (that.packDuoDialog.isAllowProduct) {
            that.packDuoDialog.dsAllowProduct = 1
          } else {
            that.packDuoDialog.dsAllowProduct = 0
          }
          if (that.packDuoDialog.ibAllowPackage) {
            that.packDuoDialog.dbAllowPackage = 1
          } else {
            that.packDuoDialog.dbAllowPackage = 0
          }
          if (that.packDuoDialog.ibAllowProduct) {
            that.packDuoDialog.dbAllowProduct = 1
          } else {
            that.packDuoDialog.dbAllowProduct = 0
          }

          let brands = ''
          let brandCodes = ''
          let brandnames = ''
          that.packDuoDialog.brands.forEach(each => {
            if (each.flag == true) {
              this.brands.forEach(a => {
                if (a.name == each.name) {
                  brands += a.id + ','
                  brandCodes += a.code + ','
                  brandnames += a.name + ','
                }
              })
            }
          })
          if (brands) {
            brands = brands.substr(0, brands.length - 1)
            brandCodes = brandCodes.substr(0, brandCodes.length - 1)
            brandnames = brandnames.substr(0, brandnames.length - 1)
          }
          that.packDuoDialog.dbBrands = brands
          that.packDuoDialog.dbBrandcodes = brandCodes
          that.packDuoDialog.dbBrandnames = brandnames
          if (that.packDuoDialog.isDiffshop == '1') {
            if (that.packDuoDialog.shoplist.length == 0) {
              //yid.util.error("设置可以跨店消费，请选择可跨店消费门店")
              //return
            }
            if (
              !that.packDuoDialog.isAllowPackage &&
              !that.packDuoDialog.isAllowProduct
            ) {
              yid.util.error('设置可以跨店消费，套餐内容必需勾选一项')
              return
            }
          } else {
            that.packDuoDialog.dsAllowPackage = 0
            that.packDuoDialog.dsAllowProduct = 0
          }
          if (that.packDuoDialog.isDiffbrand == '1') {
            if (that.packDuoDialog.dbBrands == '') {
              yid.util.error('设置可以跨品牌消费，请选择可跨品牌消费品牌')
              return
            }
            if (
              !that.packDuoDialog.ibAllowPackage &&
              !that.packDuoDialog.ibAllowProduct
            ) {
              yid.util.error('设置可以跨品牌消费，套餐内容必需勾选一项')
              return
            }
          } else {
            that.packDuoDialog.dbAllowPackage = 0
            that.packDuoDialog.dsAllowProduct = 0
            that.packDuoDialog.dbBrands = ''
            that.packDuoDialog.dbBrandcodes = ''
            that.packDuoDialog.dbBrandnames = ''
          }
          service.servicepackage
            .saveServDuoPack(that.packDuoDialog)
            .then(res => {
              if (res.resp_code == '200') {
                that.levelCancel(3)
                that.init()
                yid.util.success(res.resp_msg)
              } else {
                yid.util.error(res.resp_msg)
              }
            })
        } else {
          return false
        }
      })
    },
    checkProd(val) {
      this.goodAddDialog.products.forEach(item => {
        if (!this.goodAddDialog.branch) {
          item.type = val
        } else if (this.goodAddDialog.branch == item.branch) {
          item.type = val
        }
      })
    },
    deleteServ(id) {
      yid.util.confirm('确定删除服务项目？', '', '', () => {
        this.packAddDialog.servs.forEach((item, index) => {
          if (id == item.servid) {
            this.packAddDialog.servs.splice(index, 1)
          }
        })
      })
    },
    deleteProd(id) {
      yid.util.confirm('确定删除产品？', '', '', () => {
        this.packAddDialog.products.forEach((item, index) => {
          if (id == item.pid) {
            this.packAddDialog.products.splice(index, 1)
          }
        })
      })
    },
    savePack(formName) {
      const that = this
      if (!this.packAddDialog.type && this.packAddDialog.date.length == 0) {
        yid.util.error('请输入可售时间:')
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let i = 0
          if (that.packAddDialog.servs && that.packAddDialog.servs.length > 0) {
            i += that.packAddDialog.servs.length
          }
          if (
            that.packAddDialog.products &&
            that.packAddDialog.products.length > 0
          ) {
            i += that.packAddDialog.products.length
          }
          if (i == 0) {
            yid.util.error('没有选择项目或产品')
            return
          }
          if (
            that.packAddDialog.expiryType &&
            that.packAddDialog.expiryType == '1' &&
            !that.packAddDialog.expirtyMonth
          ) {
            yid.util.error('请输入有效期有多少个月')
            return
          }
          if (
            that.packAddDialog.expiryType &&
            that.packAddDialog.expiryType == '2' &&
            !that.packAddDialog.expirydate
          ) {
            yid.util.error('请输入有效期到固定日期')
            return
          }
          if (that.packAddDialog.expiryType == '0') {
            that.packAddDialog.expirtyMonth = ''
            that.packAddDialog.expirydate = ''
          }

          let pprice = 0
          let message = ''
          that.packAddDialog.servs.forEach(item => {
            if (!item.num) {
              message += item.sdname + ':次数没填 '
            }
            if (item.pprice == '' || item.pprice == null) {
              message += item.sdname + ':套餐价没填 '
            }
            if (item.isGift) {
              item.isGift = 1
            } else {
              pprice += Number(item.pprice)
              item.isGift = 0
            }
            if (item.num) {
              item.price = Number(item.pprice) / Number(item.num).toFixed(1)
            }
          })
          that.packAddDialog.products.forEach(item => {
            if (!item.num) {
              message += item.sdname + ':次数没填 '
            }
            if (item.pprice == '' || item.pprice == null) {
              message += item.sdname + ':套餐价没填 '
            }
            if (item.isGift) {
              item.isGift = 1
            } else {
              pprice += Number(item.pprice)
              item.isGift = 0
            }
            if (item.num) {
              item.price = Number(item.pprice) / Number(item.num).toFixed(1)
            }
          })
          if (message) {
            yid.util.error(message)
            return
          }
          if (
            that.packAddDialog.cost &&
            Number(that.packAddDialog.cost) > pprice
          ) {
            yid.util.error(
              '成本价:' + that.packAddDialog.cost + '大于套餐价:' + pprice
            )
            return
          }
          that.packAddDialog.totalprice = pprice
          if (that.packAddDialog.type) {
            that.packAddDialog.btype = '1'
          } else {
            that.packAddDialog.btype = '0'
            that.packAddDialog.sdate = that.packAddDialog.date[0]
            that.packAddDialog.edate = that.packAddDialog.date[1]
          }
          if (that.packAddDialog.issale) {
            that.packAddDialog.isSale = 1
          } else {
            that.packAddDialog.isSale = 0
          }
          if (that.packAddDialog.isAllowPackage) {
            that.packAddDialog.dsAllowPackage = 1
          } else {
            that.packAddDialog.dsAllowPackage = 0
          }
          if (that.packAddDialog.isAllowProduct) {
            that.packAddDialog.dsAllowProduct = 1
          } else {
            that.packAddDialog.dsAllowProduct = 0
          }
          if (that.packAddDialog.ibAllowPackage) {
            that.packAddDialog.dbAllowPackage = 1
          } else {
            that.packAddDialog.dbAllowPackage = 0
          }
          if (that.packAddDialog.ibAllowProduct) {
            that.packAddDialog.dbAllowProduct = 1
          } else {
            that.packAddDialog.dbAllowProduct = 0
          }

          let brands = ''
          let brandCodes = ''
          let brandnames = ''
          that.packAddDialog.brands.forEach(each => {
            if (each.flag == true) {
              this.brands.forEach(a => {
                if (a.name == each.name) {
                  brands += a.id + ','
                  brandCodes += a.code + ','
                  brandnames += a.name + ','
                }
              })
            }
          })
          if (brands) {
            brands = brands.substr(0, brands.length - 1)
            brandCodes = brandCodes.substr(0, brandCodes.length - 1)
            brandnames = brandnames.substr(0, brandnames.length - 1)
          }
          that.packAddDialog.dbBrands = brands
          that.packAddDialog.dbBrandcodes = brandCodes
          that.packAddDialog.dbBrandnames = brandnames

          if (that.packAddDialog.isDiffshop == '1') {
            if (that.packAddDialog.shoplist.length == 0) {
              //yid.util.error("设置可以跨店消费，请选择可跨店消费门店")
              //return
            }
            if (
              !that.packAddDialog.isAllowPackage &&
              !that.packAddDialog.isAllowProduct
            ) {
              yid.util.error('设置可以跨店消费，套餐内容必需勾选一项')
              return
            }
          } else {
            that.packAddDialog.dsAllowPackage = 0
            that.packAddDialog.dsAllowProduct = 0
          }
          if (that.packAddDialog.isDiffbrand == '1') {
            if (that.packAddDialog.dbBrands == '') {
              yid.util.error('设置可以跨品牌消费，请选择可跨品牌消费品牌')
              return
            }
            if (
              !that.packAddDialog.ibAllowPackage &&
              !that.packAddDialog.ibAllowProduct
            ) {
              yid.util.error('设置可以跨品牌消费，套餐内容必需勾选一项')
              return
            }
          } else {
            that.packAddDialog.dbAllowPackage = 0
            that.packAddDialog.dsAllowProduct = 0
            that.packAddDialog.dbBrands = ''
            that.packAddDialog.dbBrandcodes = ''
            that.packAddDialog.dbBrandnames = ''
          }
          service.servicepackage.saveServPack(that.packAddDialog).then(res => {
            if (res.resp_code == '200') {
              that.levelCancel(0)
              that.init()
              yid.util.success(res.resp_msg)
            } else {
              yid.util.error(res.resp_msg)
            }
          })
        } else {
          return false
        }
      })
    },
    handleServicesChange(val) {
      this.spids = val
    },
    delServPack() {
      if (!this.spids || this.spids.length == 0) {
        yid.util.error('请选择套餐')
        return
      }
      const than = this
      yid.util.confirm('确定删除套餐？', '', '', () => {
        than.spids.forEach(item => {
          const params = {
            id: item.id,
            revision: item.revision,
            isDel: '1'
          }
          service.servicepackage.delServPack(params).then(res => {
            if (res.resp_code == '200') {
              yid.util.success(res.resp_msg)
              this.querylist()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
        })
        than.init()
      })
    },
    querylist() {
      const fetch = service.servicepackage.findServPackList
      const params = this.form
      this.$refs.tableData.reloadData({
        fetch,
        params
      })
    },
    init() {
      this.excelConvertUrl =
        $yid.config.API.BASE + 'api-chain/servicepackage/convertSystem'
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
      service.serviceInfo.findbranch({ status: '1' }).then(res => {
        this.packAddDialog.branch = res.data
        this.branchs = res.data
      })
      service.servicepackage.servinfo({ status: '1' }).then(res => {
        this.servAddDialog.services = res.data
      })
      service.servicepackage.product({ status: '1' }).then(res => {
        this.goodAddDialog.products = res.data
      })
      service.serviceInfo.findServiceType({ status: '1' }).then(res => {
        this.serviceAllType = res.data
      })
      service.dept.packageTypeAll({ status: '1', isDel: '0' }).then(res => {
        this.packageAllType = res.data
      })
      service.serviceInfo.findProductType({ status: '1' }).then(res => {
        this.productAllType = res.data
      })
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        this.brandData = res.data
        res.data.forEach(each => {
          each.flag = false
        })
        this.brands = res.data
      })
      service.chain.region.treeAll({ status: '1' }).then(res => {
        this.regions = res.data
      })
      this.querylist()
    },
    changeBranch(id, type) {
      if (type == '1') {
        this.servAddDialog.serviceType = ''
        this.servAddDialog.serviceTypes = []
        this.serviceAllType.forEach(item => {
          if (id == item.branch) {
            this.servAddDialog.serviceTypes.push(item)
          }
        })
      }
      if (type == '2') {
        this.goodAddDialog.productType = ''
        this.goodAddDialog.productTypes = []
        this.productAllType.forEach(item => {
          if (id == String(item.bbid)) {
            this.goodAddDialog.productTypes.push(item)
          }
        })
      }
    },
    changBrand1(val) {
      this.packAddDialog.brands.forEach(e => {
        e.flag = val
      })
    },
    changBrand2(val) {
      this.packDuoDialog.brands.forEach(e => {
        e.flag = val
      })
    },
    changBrand3(val) {
      if (val == false) {
        this.packDuoDialog.isBrandAll = false
        this.packAddDialog.isBrandAll = false
      }
    },
    selectShop() {
      if (!this.packDuoDialog.brand || !this.packAddDialog.brand) {
        yid.util.error('请选择品牌，再选择门店')
        return
      }
      this.type = '1'
      isClear(this.shopDialog)
      this.shopData = []
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      if (this.duoflag) {
        this.shopDialog.id = this.packDuoDialog.id
        this.shopDialog.shoplist = this.packDuoDialog.shoplist
        this.shopDialog.spname = this.packDuoDialog.spname
        this.shopDialog.brand = this.packDuoDialog.brand
      } else {
        this.shopDialog.id = this.packAddDialog.id
        this.shopDialog.shoplist = this.packAddDialog.shoplist
        this.shopDialog.spname = this.packAddDialog.spname
        this.shopDialog.brand = this.packAddDialog.brand
      }
      this.$refs.templateRegionTree.setCheckedKeys([])
      this.queryShop()
    },
    changBrnad(type) {
      if (type == '1') {
        this.packAddDialog.shoplist = []
      } else {
        this.packDuoDialog.shoplist = []
      }
    },
    handleSelectionChange(rows) {
      this.selectShops = rows
    },
    queryShop() {
      if (this.shopDialog.region && this.shopDialog.region.id) {
        //大区及以内区域都保存进去
        this.shopDialog.region.childrenIds.push(this.shopDialog.region.id)
        this.shopDialog.regionIds =
          this.shopDialog.region.childrenIds.toString()
      } else {
        this.shopDialog.regionIds = ''
      }
      const fetch = service.chain.shop.shopListWithPage
      const params = {
        page: this.shopDialog.page,
        limit: this.shopDialog.limit,
        shop: this.shopDialog.shop,
        type: this.shopDialog.type,
        regionIds: this.shopDialog.regionIds,
        brandId: this.shopDialog.brand
      }
      this.$refs['tableShop'].reloadData({
        fetch,
        params
      })
    },
    addShop() {
      this.selectShops.map(m => {
        let flag = true
        this.shopDialog.shoplist.forEach(p => {
          if (p.id == m.id || p.shopid == m.id) {
            flag = false
          }
        })
        if (flag) {
          this.shopDialog.shoplist.push({
            shopid: m.id,
            shopcode: m.shopcode,
            shopname: m.shopname
          })
        }
      })
    },
    deleteShop(row, spname) {
      yid.util.confirm(
        '删除后【' +
          spname +
          '】不能在【' +
          row.shopname +
          '】售卖，确定要删除吗？？',
        '',
        '',
        () => {
          let i = -1
          this.shopDialog.shoplist.forEach((p, index) => {
            if (p.shopid == row.shopid) {
              i = index
            }
          })
          this.shopDialog.shoplist.splice(i, 1)
        }
      )
    },
    setShop() {
      if (this.duoflag) {
        this.packDuoDialog.shoplist = this.shopDialog.shoplist
      } else {
        this.packAddDialog.shoplist = this.shopDialog.shoplist
      }
      this.shopDialog.visible = false
    },
    saveShop() {
      service.servicepackage.saveShop(this.shopDialog).then(res => {
        if (res.resp_code == '200') {
          this.shopDialog.visible = false
          this.querylist()
          yid.util.success(res.resp_msg)
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    lookupShop(row) {
      this.type = '2'
      isClear(this.shopDialog)
      this.shopData = []
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      this.shopDialog.shoplist = row.shoplist || []
      this.shopDialog.id = row.id
      this.shopDialog.spname = row.spname
      this.shopDialog.brand = row.brand
      this.$refs.templateRegionTree.setCheckedKeys([])
      this.queryShop()
    },
    changePackageBranch(id) {
      this.packAddDialog.packageType = []
      this.packAddDialog.ptid = ''
      this.packageAllType.forEach(item => {
        if (id == item.branch) {
          this.packAddDialog.packageType.push(item)
        }
      })
      this.branch.forEach(item => {
        if (id == item.id) {
          this.packAddDialog.dept = item.bname
        }
      })
    },
    changePackageType(id) {
      this.packAddDialog.packageType.forEach(item => {
        if (id == item.id) {
          this.packAddDialog.ptid = item.id
          this.packAddDialog.ptcode = item.pcode
          this.packAddDialog.ptname = item.pname
        }
      })
    },
    changeDuoPackageBranch(id) {
      this.packDuoDialog.packageType = []
      this.packDuoDialog.ptid = ''
      this.packageAllType.forEach(item => {
        if (id == item.branch) {
          this.packDuoDialog.packageType.push(item)
        }
      })
      this.branch.forEach(item => {
        if (id == item.id) {
          this.packDuoDialog.dept = item.bname
        }
      })
    },
    changeDuoPackageType(id) {
      this.packDuoDialog.packageType.forEach(item => {
        if (id == item.id) {
          this.packDuoDialog.ptid = item.id
          this.packDuoDialog.ptcode = item.pcode
          this.packDuoDialog.ptname = item.pname
        }
      })
    },
    clearFormShop() {
      setTimeout(() => {
        if (this.form.shop == '') {
          this.form.shop = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    },
    beforeAvatarExcelUpload(file) {
      const isJPG = file.type.indexOf('sheet') || file.type.indexOf('excel')
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        yid.util.error('上传excel只能是 xls/xlsx 格式!')
        return
      }
      if (!isLt2M) {
        yid.util.error('上传excel大小不能超过 10MB!')
        return
      }
      return isJPG && isLt2M
    },
    handleAvatarExcelSuccess(res) {
      this.importDialog.services = res.data
    },
    importCancel() {
      this.importDialog.visible = false
    },
    saveImportPackage() {
      if (this.importDialog.services.length == 0) {
        yid.util.info('无导入数据')
      } else {
        service.servicepackage
          .saveSystem(this.importDialog.services)
          .then(res => {
            if (res.resp_code == '200') {
              this.querylist()
              yid.util.success('导入成功!')
              this.importDialog.visible = false
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    changeBranchType(id) {
      this.form.scode = ''
      this.packageListType = []
      this.packageAllType.forEach(item => {
        if (id == item.branch) {
          this.packageListType.push(item)
        }
      })
    },
    handleSelectionData(rows) {
      this.selectShopData = rows
    },
    //批量删除
    deleteBatch() {
      if (this.selectShopData.length == 0) {
        yid.util.warning('请勾选删除的门店')
        return
      }
      this.selectShopData.forEach(item => {
        this.shopDialog.shoplist.forEach((p, index) => {
          if (item.shopid == p.shopid) {
            this.shopDialog.shoplist.splice(index, 1)
          }
        })
      })
    },
    handleAvatarSuccess(res) {
      if (this.isTrue) {
        this.packAddDialog.photopath = res.data.url
      }
    },
    beforeAvatarUpload(file) {
      this.isTrue = true
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        yid.util.error('上传头像图片只能是 JPG/PNG 格式!')
        this.isTrue = false
        return this.isTrue
      }
      if (!isLt2M) {
        yid.util.error('上传头像图片大小不能超过 10MB!')
        this.isTrue = false
        return this.isTrue
      }
      return isJPG && isLt2M
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.serve-table {
  th,
  td {
    padding-left: 10px;
    text-align: left;
  }

  .el-checkbox {
    margin-right: 15px;
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
  border-color: #409eff;
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
