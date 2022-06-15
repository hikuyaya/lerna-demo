<template>
  <div class="dept">
    <el-form inline>
      <el-form-item>
        <el-page-header @back="backup()"></el-page-header>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="openAddServ()"
          >选择添加项目</el-button
        >
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="batchChangPrice()"
          >批量修改基础定价</el-button
        >
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="batchChangeCard()"
          >批量修改会员卡折扣价</el-button
        >
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="batchChangeSort()"
          >分组和排序</el-button
        >
      </el-form-item>
      <br />
      <el-form-item label="筛选">
        <el-select
          clearable
          filterable
          v-model="form.branch"
          @change="changeBranch"
          placeholder="请选择部门"
          style="width: 160px">
          <el-option
            v-for="item in branch"
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
          v-model="form.scode"
          placeholder="请选择分类"
          style="width: 160px">
          <el-option
            v-for="item in serviceType"
            :key="item.id"
            :label="item.sname"
            :value="item.scode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目">
        <el-input
          clearable
          v-model="form.servname"
          placeholder="项目名称/编码"
          style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          clearable
          v-model="form.status"
          placeholder="请选择状态"
          style="width: 120px">
          <el-option label="正常" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryServData()">查询</el-button>
      </el-form-item>
    </el-form>

    <yid-table
      ref="tableService"
      pagination
      style="width: 100%"
      @selection-change="handleServicesChange">
      <yid-table-column
        type="selection"
        prop="servid"
        width="55"></yid-table-column>
      <yid-table-column
        label="编号"
        prop="servcode"
        width="90"></yid-table-column>
      <yid-table-column
        label="名称"
        prop="servname"
        width="140"></yid-table-column>
      <yid-table-column
        label="所属部门"
        prop="bname"
        width="80"></yid-table-column>
      <yid-table-column
        label="分类"
        prop="sname"
        width="100"></yid-table-column>
      <yid-table-column label="类别" prop="sertype" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sertype == '1'">大项目</span>
          <span v-if="scope.row.sertype == '2'">小项目</span>
          <span v-if="scope.row.sertype == '3'">不计服务业绩</span>
        </template>
      </yid-table-column>
      <yid-table-column
        label="基础定价"
        :show-overflow-tooltip="false"
        prop="price"
        width="120">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="2"
              ><i class="el-icon-edit" @click="editPrice(scope.row)"></i
            ></el-col>
            <el-col :span="22">
              <div v-if="scope.row.price || scope.row.price == 0">
                {{ '￥' + scope.row.price }}
              </div>
              <div v-else style="color: red">未定价</div>
              <div>
                {{
                  scope.row.minPrice || scope.row.minPrice == 0
                    ? '最低价:' + scope.row.minPrice + '元'
                    : ''
                }}
              </div>
            </el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column
        label="会员卡折扣价设定"
        :show-overflow-tooltip="false"
        prop="discount">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <div :key="item.id" v-for="item in scope.row.servcards">
                {{ item.cardname }}
                {{ item.dtype == '1' ? item.value + '折' : '￥' + item.value }}
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="deldiscount(item)"
                  >[删除]
                </el-link>
              </div>
            </el-col>
            <el-col :span="2"
              ><i class="el-icon-plus" @click="editDiscount(scope.row)"></i
            ></el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column
        label="员工级别价格设置"
        :show-overflow-tooltip="false"
        prop="special">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <div :key="item.id" v-for="item in scope.row.servspecs">
                {{ item.btype == '1' ? item.pslname : item.eename }}
                {{ '￥' + item.specialPrice }}
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="delspeical(item)"
                  >[删除]
                </el-link>
              </div>
            </el-col>
            <el-col :span="2"
              ><i class="el-icon-plus" @click="editSpeical(scope.row)"></i
            ></el-col>
          </el-row>
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
      <yid-table-column label="状态" prop="status" width="60">
        <template slot-scope="scope">
          {{ scope.row.status == '1' ? '正常' : '停用' }}
        </template>
      </yid-table-column>
      <yid-table-column label="门店项目状态" width="80">
        <template slot-scope="scope">
          <label style="color: blue" @click="setShopServStatus(scope.row)"
            >设置</label
          >
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog
      :title="addServDialog.title"
      :visible.sync="addServDialog.visible"
      width="700px">
      <el-form label-width="100px" ref="copyForm2">
        <el-form-item label="筛选：">
          <el-select
            clearable
            v-model="addServDialog.branch"
            @change="changeBranchType(addServDialog.branch)"
            placeholder="选择部门"
            style="width: 140px">
            <el-option
              v-for="item in branch"
              :key="item.id"
              :value="item.id"
              :label="item.bname"></el-option>
          </el-select>
          <el-select
            clearable
            v-model="addServDialog.serviceType"
            placeholder="请选择分类"
            style="margin-left: 5px; width: 140px">
            <el-option
              v-for="item in addServDialog.serviceTypes"
              :key="item.id"
              :label="item.sname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button
            type="primary"
            @click="addServs()"
            style="margin-left: 10px"
            >确认添加</el-button
          >
          <el-button type="primary" @click="addServDialog.visible = false"
            >取消</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <table border="1" cellspacing="0" style="width: 100%">
            <tr>
              <th width="20%">所属部门</th>
              <th width="25%">分类</th>
              <th width="55%">
                <el-checkbox
                  v-model="addServDialog.checkbox"
                  @change="checkAllServ"></el-checkbox>
                (编号）项目名称
              </th>
            </tr>
            <tr
              :key="item.servid"
              v-for="item in addServDialog.services"
              v-if="screenService(item)">
              <td>{{ item.dept }}</td>
              <td>{{ item.servtname }}</td>
              <td>
                <el-checkbox
                  v-model="item.type"
                  :label="item.servid"></el-checkbox>
                ({{ item.servcode }}){{ item.servname }}
              </td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="priceDialog.title"
      :visible.sync="priceDialog.visible"
      @close="priceDialog.visible = false"
      width="450px">
      <el-form :model="priceDialog" label-width="150px" ref="copyForm">
        <el-form-item label="项目名称：">
          {{ priceDialog.title }}
        </el-form-item>
        <el-form-item label="基础定价：">
          <el-input
            clearable
            type="number"
            min="0"
            v-model="priceDialog.price"
            style="width: 200px" />
          <br />
        </el-form-item>
        <el-form-item label="最低价：" width="400px">
          <el-input
            clearable
            type="number"
            min="0"
            :max="priceDialog.price"
            v-model="priceDialog.minPrice"
            style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="salePriceDialog">保存</el-button>
          <el-button @click="levelCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="pricesDialog.title"
      :visible.sync="pricesDialog.visible"
      @close="pricesDialog.visible = false"
      width="510px">
      <yid-table
        ref="table1"
        :data="pricesDialog.servs"
        @selection-change="handleServicesChange">
        <yid-table-column
          label="编号"
          prop="servcode"
          width="60"></yid-table-column>
        <yid-table-column
          label="名称"
          prop="servname"
          width="120"></yid-table-column>
        <yid-table-column label="基础定价" prop="price" width="140">
          <template slot-scope="scope">
            <el-input
              clearable
              type="number"
              min="1"
              v-model="scope.row.price" />
          </template>
        </yid-table-column>
        <yid-table-column label="最低价" prop="minPrice" width="140">
          <template slot-scope="scope">
            <el-input
              clearable
              type="number"
              min="0"
              :max="scope.row.minPrice"
              v-model="scope.row.minPrice" />
          </template>
        </yid-table-column>
      </yid-table>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="6">
          <el-button type="primary" @click="savePrices()">保存</el-button>
        </el-col>
        <el-col :span="6" :offset="4">
          <el-button @click="pricesDialog.visible = false">取消</el-button>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="disCardDialog.title"
      :visible.sync="disCardDialog.visible"
      @close="levelCancel"
      width="550px">
      <el-form :model="disCardDialog" label-width="150px" ref="copyForm">
        <el-form-item label="项目名称：">
          {{ disCardDialog.servname }}
        </el-form-item>
        <el-form-item label="设置方式">
          <el-select style="width: 160px" v-model="disCardDialog.type">
            <el-option label="不设置" value="0"></el-option>
            <el-option label="单独设置" value="1"></el-option>
            <el-option label="全部会员卡" value="2"></el-option>
          </el-select>
          <yid-ask
            >折扣设置为0时，不打折；输入框为空时表示不设置（没有设置项目的会员卡折扣，项目会员卡价格应用基础折扣）。</yid-ask
          >
        </el-form-item>
        <template v-if="disCardDialog.type == 1">
          <el-form-item
            :label="card.cardname"
            :key="card.cardid"
            v-for="card in disCardDialog.cards">
            <el-select
              clearable
              style="width: 160px"
              @change="checkDiscount(card)"
              v-model="card.dtype">
              <el-option label="折扣" value="1"></el-option>
              <el-option label="会员价" value="2"></el-option>
            </el-select>
            <el-input
              clearable
              type="number"
              min="1"
              @blur="checkDiscount(card)"
              v-model="card.value"
              style="width: 100px; margin-left: 15px" />
            <label-wrap
              v-show="card.dtype"
              v-text="card.dtype == 1 ? '折' : '元'"></label-wrap>
          </el-form-item>
        </template>
        <template v-if="disCardDialog.type == 2">
          <el-form-item :label="disCardDialog.card.cardname">
            <el-select
              clearable
              style="width: 160px"
              @change="checkDiscount(card)"
              v-model="disCardDialog.card.dtype">
              <el-option label="折扣" value="1"></el-option>
              <el-option label="会员价" value="2"></el-option>
            </el-select>
            <el-input
              clearable
              type="number"
              min="1"
              @blur="checkDiscount(disCardDialog.card)"
              v-model="disCardDialog.card.value"
              style="width: 100px; margin-left: 15px" />
            <label-wrap
              v-show="disCardDialog.card.dtype"
              v-text="disCardDialog.card.dtype == 1 ? '折' : '元'"></label-wrap>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="saveDiscount()">保存</el-button>
          <el-button @click="levelCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="speicalDialog.title"
      :visible.sync="speicalDialog.visible"
      @close="levelCancel"
      width="auto">
      <el-row type="flex" justify="space-between">
        <el-form inline>
          <el-form-item label="项目名称：">
            {{ speicalDialog.servname }}
          </el-form-item>
          <el-form-item label="按职位级别">
            <el-select v-model="speicalDialog.id" @change="changSpeicalData">
              <el-option
                :key="item.id"
                v-for="item in speicalDialog.speicalData"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="addSpeicalRow()">添加</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <yid-table
        ref="table"
        style="margin-top: 15px"
        :data="speicalDialog.speicalRows">
        <yid-table-column label="职位" min-width="150" prop="btype">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.btype == '1' ? scope.row.pslname : scope.row.eename
              }}
            </div>
          </template>
        </yid-table-column>
        <yid-table-column label="特殊价格" min-width="120" prop="specialPrice">
          <template slot-scope="scope">
            <el-input
              clearable
              type="number"
              min="1"
              placeholder="必填"
              v-model="scope.row.specialPrice" />
          </template>
        </yid-table-column>
        <yid-table-column label="最低价格" min-width="130" prop="minPrice">
          <template slot-scope="scope">
            <el-input
              clearable
              type="number"
              min="1"
              :max="scope.row.specialPrice"
              @blur="checkSpecialPrice(scope.row)"
              placeholder="不必填"
              v-model="scope.row.minPrice" />
          </template>
        </yid-table-column>
        <yid-table-column label="会员卡折扣" min-width="380" align="left">
          <template slot-scope="scope">
            <el-select v-model="scope.row.discountType" style="width: 120px">
              <el-option label="不设置" value="0"></el-option>
              <el-option label="单独设置" value="1"></el-option>
              <el-option label="全部会员卡" value="2"></el-option>
            </el-select>
            <el-row
              type="flex"
              justify="space-between"
              class="margin5"
              :key="item.cardid"
              v-for="item in scope.row.discounts"
              v-show="scope.row.discountType == 1">
              <el-col :span="8">{{ item.cardName }}</el-col>
              <el-col :span="8">
                <el-select
                  clearable
                  v-model="item.dtype"
                  @change="checkDiscount(item)">
                  <el-option label="折扣" value="1"></el-option>
                  <el-option label="会员价" value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input
                  type="number"
                  min="1"
                  @blur="checkDiscount(item)"
                  v-model="item.value"
                  clearable />
              </el-col>
              <el-col :span="2">
                <label-wrap
                  v-show="item.dtype"
                  v-text="item.dtype == 1 ? '折' : '元'"></label-wrap>
              </el-col>
            </el-row>
            <el-row
              type="flex"
              justify="space-between"
              v-show="scope.row.discountType == 2"
              class="margin5">
              <el-col :span="9">
                <el-select
                  clearable
                  v-model="scope.row.dtype"
                  @change="checkDiscount(scope.row)">
                  <el-option label="折扣" value="1"></el-option>
                  <el-option label="会员价" value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-input
                  type="number"
                  min="1"
                  @blur="checkDiscount(scope.row)"
                  v-model="scope.row.value"
                  clearable />
              </el-col>
              <el-col :span="6">
                <label-wrap
                  v-show="scope.row.dtype"
                  v-text="scope.row.dtype == 1 ? '折' : '元'"></label-wrap>
              </el-col>
            </el-row>
          </template>
        </yid-table-column>
        <yid-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <el-link
              type="primary"
              style="margin: 0 10px 0 10px"
              @click="deleteSpeicalRow(scope.row)"
              >删除
            </el-link>
          </template>
        </yid-table-column>
      </yid-table>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveSpeical()">保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="levelCancel">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="mutiPriceDialog.title"
      :visible.sync="mutiPriceDialog.visible"
      @close="levelCancel"
      width="760px">
      <div style="margin: 8px 10px">
        折扣设置为0时,不打折。输入框为空时表示不设置（没有设置项目的会员卡折扣，项目会员卡价格应用基础折扣）
      </div>
      <el-form :model="mutiPriceDialog" label-width="150px" ref="copyForm">
        <el-form-item label="所选项目">
          <!--<el-row :gutter="20" type="flex" class="mutirow">-->
          <!--<el-col :span="3" :key="item.id" v-for="item in servids"><el-tag type="info">{{item.servname}}</el-tag></el-col>-->
          <!--</el-row>-->
          <el-tag
            :key="item.id"
            v-for="item in servids"
            :disable-transitions="false">
            {{ item.servname }}
          </el-tag>
        </el-form-item>
        <el-form-item label="设置方式">
          <el-select
            placeholder="请选择"
            style="width: 160px"
            v-model="mutiPriceDialog.type">
            <el-option label="不设置" value="0"></el-option>
            <el-option label="单独设置" value="1"></el-option>
            <el-option label="全部会员卡" value="2"></el-option>
          </el-select>
          <yid-ask
            >折扣设置为0时，不打折；输入框为空时表示不设置（没有设置项目的会员卡折扣，项目会员卡价格应用基础折扣）。</yid-ask
          >
        </el-form-item>
        <template v-if="mutiPriceDialog.type == 1">
          <el-form-item
            :label="card.cardname"
            :key="card.cardid"
            v-for="card in mutiPriceDialog.cards">
            <el-select
              clearable
              v-model="card.dtype"
              @change="checkDiscount(card)"
              style="width: 160px">
              <el-option label="折扣" value="1"></el-option>
              <el-option label="会员价" value="2"></el-option>
            </el-select>
            <el-input
              type="number"
              min="1"
              @blur="checkDiscount(card)"
              v-model="card.value"
              style="width: 100px; margin-left: 15px" />
            <label-wrap
              v-show="card.dtype"
              v-text="card.dtype == 1 ? '折' : '元'"></label-wrap>
          </el-form-item>
        </template>
        <template v-if="mutiPriceDialog.type == 2">
          <el-form-item :label="mutiPriceDialog.card.cardname">
            <el-select
              clearable
              v-model="mutiPriceDialog.card.dtype"
              @change="checkDiscount(mutiPriceDialog.card)"
              style="width: 160px">
              <el-option label="折扣" value="1"></el-option>
              <el-option label="会员价" value="2"></el-option>
            </el-select>
            <el-input
              type="number"
              min="1"
              @blur="checkDiscount(mutiPriceDialog.card)"
              v-model="mutiPriceDialog.card.value"
              style="width: 100px; margin-left: 15px" />
            <label-wrap
              v-show="mutiPriceDialog.card.dtype"
              v-text="
                mutiPriceDialog.card.dtype == 1 ? '折' : '元'
              "></label-wrap>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="saveBatchCard()">保存</el-button>
          <el-button @click="levelCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
      width="800px">
      <el-form ref="shopDialog" inline style="margin-top: 8px">
        <el-form-item label="项目：">{{ shopDialog.servname }}</el-form-item>
        <br />
        <el-form-item label="门店：">
          <el-select
            clearable
            v-model.trim="shopDialog.shopid"
            placeholder="请选择门店"
            style="width: 160px">
            <el-option
              :key="item.id"
              :label="item.shopname"
              :value="item.shopid"
              v-for="item in shopDialog.servshops">
              <span style="float: left">{{ item.shopcode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.shopname
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <row>
            <el-button type="primary" @click="batchUpdateServShopStatus('1')"
              >启用</el-button
            >
            <el-button @click="batchUpdateServShopStatus('2')">停用</el-button>
            <el-button type="primary" @click="checkServShopStatus()"
              >保存状态</el-button
            >
          </row>
        </el-form-item>
      </el-form>
      <yid-table
        ref="cardShopList"
        :data="shopDialog.servshops"
        style="margin-top: 8px"
        @selection-change="handleSelectionShopChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <yid-table-column
          label="门店编码"
          min-width="80"
          prop="shopcode"></yid-table-column>
        <yid-table-column
          label="门店名称"
          min-width="100"
          prop="shopname"></yid-table-column>
        <yid-table-column label="门店名称" min-width="100" prop="status">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              active-text="启用"
              inactive-value="2"
              inactive-text="停用"
              active-color="#339933"
              inactive-color="#DCDFE6">
            </el-switch>
          </template>
        </yid-table-column>
      </yid-table>
    </yid-dialog>

    <!--分组和排序-->
    <yid-dialog
      :title="addServGroup.title"
      :visible.sync="addServGroup.visible"
      width="1000px"
      v-if="addServGroup.visible">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form label-width="" ref="copyForm2" class="shuax">
            <el-form-item label="筛选">
              <el-select
                clearable
                filterable
                v-model="formGroup.branch"
                @change="changeBranch"
                placeholder="请选择部门"
                style="width: 120px">
                <el-option
                  v-for="item in branch"
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
                v-model="formGroup.scode"
                placeholder="请选择分类"
                style="width: 160px"
                @change="changeType">
                <el-option
                  v-for="item in serviceType"
                  :key="item.id"
                  :label="item.sname"
                  :value="item.scode">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-button type="primary" style="margin-left: 20px" @click="getDataType">查询</el-button>-->
          </el-form>
          <span style="margin-top: 20px; display: flex; align-items: center"
            ><label
              style="
                width: 6px;
                height: 17px;
                background-color: #00aaee;
                margin-right: 10px;
              "></label
            >默认</span
          >
          <draggable
            class="moren"
            tag="div"
            group="services"
            v-model="servicesGroup"
            :sort="true"
            @start="isDragging3 = true"
            @end="isDragging3 = false"
            @change="moveChange">
            <span v-for="serv in servicesGroup" :key="serv.servcode">{{
              serv.servname
            }}</span></draggable
          >
        </el-col>
        <el-col :span="14">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 540px;
              overflow-y: auto;
            ">
            <div
              v-for="(servtype, serindex) in servicesTypeGroup"
              :key="servtype.id">
              <el-row>
                <label
                  style="
                    width: 6px;
                    height: 17px;
                    background-color: #00aaee;
                    margin-right: 10px;
                    color: #00aaee;
                  "
                  >3</label
                >
                <el-input
                  v-model="servtype.name"
                  type="text"
                  style="width: 300px" />
                <label
                  style="cursor: pointer; margin-left: 20px; color: #00aaee"
                  @click="deleteGroup(serindex)"
                  >删除</label
                >
              </el-row>
              <draggable
                :class="['group', 's' + servtype.servtid]"
                tag="div"
                group="services"
                :move="onMove"
                :sort="true"
                @remove="reMove"
                @sort="sort"
                v-model="servtype.serviceInfo"
                @start="isDragging1 = true"
                @end="isDragging1 = false"
                @change="moveChange">
                <span
                  v-for="servicein in servtype.serviceInfo"
                  :key="servicein.servcode"
                  >{{ servicein.servname }}</span
                >
              </draggable>
            </div>
          </div>
          <div>
            <el-button plain style="width: 100%" @click="addGroup"
              >+添加分组</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-row style="text-align: center; margin: 20px 0">
        <el-button type="primary" @click="addServGroup.visible = false"
          >取消</el-button
        >
        <el-button type="primary" style="margin-left: 40px" @click="saveType"
          >保存方案</el-button
        >
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import YidAsk from '../../library/components/ask/src/index.vue'
import draggable from 'vuedraggable'

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
  components: { YidAsk, draggable },
  data() {
    return {
      activeName: 'project',
      myheaders: {},
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
        serviceType: []
      },
      priceDialog: {
        title: '',
        visible: false,
        servid: '',
        price: '',
        minPrice: '',
        allowDiscount: true
      },
      pricesDialog: {
        title: '批量修改基础定价',
        visible: false,
        servs: []
      },
      disCardDialog: {
        servid: '',
        servname: '',
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
        servid: '',
        servname: '',
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
      employees: [],
      positions: [],
      servids: [],
      addServDialog: {
        title: '添加服务项目',
        visible: false,
        branchs: [],
        branch: '',
        serviceTypes: [],
        serviceType: '',
        services: [],
        checkbox: false
      },
      form: {
        branch: '',
        scode: '',
        servname: '',
        status: '1'
      },
      shopDialog: {
        shopid: '',
        id: '',
        servcode: '',
        servname: '',
        sptid: '',
        sptcode: '',
        visible: false,
        title: '设置门店项目状态',
        servshops: [],
        selectShopList: []
      },
      sptdata: null,
      pageInfo: { page: 1, limit: 10 },
      addServGroup: {
        title: '分组和排序',
        visible: false
      },
      formGroup: {
        status: '1',
        branch: '',
        scode: ''
      },
      servicesGroup: [], //分组弹层中，根据分类筛选出的项目
      servicesTypeGroup: [],
      serindex: 0,
      isDragging3: false,
      isDragging1: false,
      isDragging2: false
    }
  },
  computed: {
    screenService() {
      return function (item) {
        let flag = true
        if (this.addServDialog.branch) {
          if (this.addServDialog.branch == item.branch) {
            flag = true
          } else {
            flag = false
          }
        }
        if (this.addServDialog.serviceType) {
          if (this.addServDialog.serviceType == item.servtid) {
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
    changeType(e) {
      this.getDataType()
    },
    init() {
      service.serviceInfo.findbranch().then(res => {
        this.branch = res.data
        this.addServDialog.branchs = res.data
      })
      service.serviceInfo.findServiceType().then(res => {
        this.serviceAllType = res.data
      })
      /*service.serviceInfo.findEmployees({"status":"1"}).then(res => {
                    this.employees=res.data;
                    if(this.employees){
                        this.employees.forEach(item =>{
                            item.code=item.eecode;
                            item.name=item.eename;
                        })
                    }
                })*/
      service.serviceInfo.findPositions({ status: '1' }).then(res => {
        this.positions = res.data
        if (this.positions) {
          this.positions.forEach(item => {
            item.code = item.pslcode
            item.name = item.pslname
          })
        }
      })
      this.queryServData()
    },
    levelCancel() {
      this.addDialog.visible = false
      this.priceDialog.visible = false
      this.disCardDialog.visible = false
      this.speicalDialog.visible = false
      this.mutiPriceDialog.visible = false
      this.mutiImportDialog.visible = false
      this.pricesDialog.visible = false
    },
    handleServicesChange(val) {
      this.servids = val
    },
    clear(data) {
      isClear(this.form)
      this.serveData = []
      this.servids = []
      this.sptdata = data
      this.queryServData()
    },
    backup() {
      this.$emit('onClose')
    },
    openAddServ() {
      service.servicePrice
        .findServiceList({ sptid: this.sptdata.sptid, status: '1' })
        .then(res => {
          this.addServDialog.visible = true
          this.addServDialog.branch = ''
          this.addServDialog.branchs = []
          this.addServDialog.serviceType = ''
          this.addServDialog.serviceTypes = []
          this.addServDialog.checkbox = false
          this.addServDialog.services = res.data
        })
    },
    batchChangeSort() {
      this.formGroup.branch = ''
      this.formGroup.scode = ''
      this.servicesGroup = []
      this.servicesTypeGroup = []
      this.addServGroup.visible = true
    },
    changeBranchType(id) {
      this.addServDialog.serviceType = ''
      this.addServDialog.serviceTypes = []
      this.serviceAllType.forEach(item => {
        if (id == String(item.branch)) {
          this.addServDialog.serviceTypes.push(item)
        }
      })
    },
    checkAllServ(val) {
      this.addServDialog.services.forEach(item => {
        if (!this.addServDialog.branch) {
          item.type = val
        } else if (this.addServDialog.branch == item.branch) {
          item.type = val
        }
      })
    },
    addServs() {
      this.serveData = []
      this.addServDialog.services.forEach(item => {
        let flag = true
        if (
          this.addServDialog.branch &&
          this.addServDialog.branch != item.branch
        ) {
          flag = false
        }
        if (
          this.addServDialog.serviceType &&
          this.addServDialog.serviceType != item.servtid
        ) {
          flag = false
        }
        if (flag) {
          if (item.type) {
            this.serveData.push({
              servid: item.id,
              servcode: item.servcode,
              servname: item.servname,
              servtid: item.servtid,
              servtcode: item.servtcode,
              branch: item.branch,
              sptid: this.sptdata.sptid,
              spcode: this.sptdata.spcode
            })
          }
        }
      })
      if (this.serveData.length == 0) {
        this.addServDialog.visible = false
        return
      }
      const params = {
        sptid: this.sptdata.sptid,
        spcode: this.sptdata.spcode,
        servprs: this.serveData
      }
      service.servicePrice.addServs(params).then(res => {
        if (res.resp_code == '200') {
          this.addServDialog.visible = false
          this.queryServData()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    batchChangPrice() {
      if (!this.servids || this.servids.length == 0) {
        yid.util.error('请选择服务项目')
        return
      }
      this.pricesDialog.servs = []
      this.servids.forEach(each => {
        this.pricesDialog.servs.push(yid.util.deepClone(each))
      })
      this.pricesDialog.visible = true
    },
    savePrices() {
      let flag = false
      this.pricesDialog.servs.forEach(each => {
        if (Number(each.minPrice) > Number(each.price)) {
          flag = true
        }
      })
      if (flag) {
        yid.util.error('最低价不能超过基础定价')
        return
      }
      const params = {
        sptid: this.sptdata.sptid,
        spcode: this.sptdata.spcode,
        servprs: this.pricesDialog.servs
      }
      service.servicePrice.batchChangPrices(params).then(res => {
        if (res.resp_code == '200') {
          yid.util.success(res.resp_msg)
          this.queryServData()
          this.levelCancel()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    batchChangeCard() {
      if (!this.servids || this.servids.length == 0) {
        yid.util.error('请选择服务项目')
        return
      }
      this.mutiPriceDialog.title = '批量设置会员卡折扣价'
      this.mutiPriceDialog.visible = true
      this.mutiPriceDialog.type = '0'
      this.mutiPriceDialog.cards.forEach(card => {
        card.dtype = ''
        card.value = ''
      })
      this.mutiPriceDialog.card = {
        cardid: '-1',
        dtype: '',
        value: '',
        cardname: '全部会员卡',
        cpcode: '-1'
      }
    },
    saveBatchCard() {
      let i = 0
      let message = '',
        messcode = ''
      if (this.mutiPriceDialog.type == '1') {
        if (
          this.mutiPriceDialog.cards &&
          this.mutiPriceDialog.cards.length > 0
        ) {
          this.mutiPriceDialog.cards.forEach(card => {
            if ((!card.dtype && card.value) || (card.dtype && !card.value)) {
              message += card.cardname + ' '
            }
            if (card.dtype == '1' && (card.value > 10 || card.value < 0)) {
              messcode += card.cardname + ' '
            }
            if (card.dtype && card.value) i++
          })
        }
      }
      if (this.mutiPriceDialog.type == '2') {
        const card = this.mutiPriceDialog.card
        if (!card.dtype || !card.value) {
          message += card.cardname
        }
        if (card.dtype == '1' && (card.value > 10 || card.value < 0)) {
          messcode += card.cardname
        }
      }
      if (message) {
        yid.util.error('[' + message + ']折扣价没填完')
        return
      }
      if (messcode) {
        yid.util.error('[' + messcode + ']折扣应该是大于等于0，小于等于10')
        return
      }
      if (this.mutiPriceDialog.type == '1' && i == 0) {
        yid.util.error('不能全为空')
        return
      }
      const params = {}
      params.sptid = this.sptdata.sptid
      params.spcode = this.sptdata.spcode
      params.cardtype = this.mutiPriceDialog.type
      if (this.mutiPriceDialog.type == '0') {
        params.servcards = []
      }
      if (this.mutiPriceDialog.type == '1') {
        const cards = []
        this.mutiPriceDialog.cards.forEach(card => {
          if (card.dtype && card.value) {
            cards.push({
              cardid: card.cardid,
              cardname: card.cardname,
              dtype: card.dtype,
              value: card.value,
              cpcode: card.cpcode
            })
          }
        })
        params.servcards = cards
      }
      if (this.mutiPriceDialog.type == '2') {
        params.servcards = []
        params.servcards.push({
          cardid: this.mutiPriceDialog.card.cardid,
          cardname: this.mutiPriceDialog.card.cardname,
          dtype: this.mutiPriceDialog.card.dtype,
          value: this.mutiPriceDialog.card.value,
          cpcode: '-1'
        })
      }
      params.servs = this.servids
      service.servicePrice.batchServiceCards(params).then(res => {
        if (res.resp_code == '200') {
          yid.util.success(res.resp_msg)
          this.queryServData()
          this.levelCancel()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    changeBranch(id) {
      this.form.scode = ''
      this.serviceType = []
      this.formGroup.scode = ''
      this.serviceAllType.forEach(item => {
        if (id == item.branch) {
          this.serviceType.push(item)
        }
      })
    },
    queryServData() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.tableService.Pagination.internalPageSize
      this.getData(this.form, this.sptdata.sptid)
      /*service.servicePrice.findServPriceList({...this.form,sptid:this.sptdata.sptid}).then(res => {
                    this.serveData=res.data;
                })*/
      service.serviceInfo
        .findServPriceCards({ sptid: this.sptdata.sptid })
        .then(res => {
          if (res.data) {
            this.disCardDialog.cards = []
            this.mutiPriceDialog.cards = []
            this.speicalDialog.cards = []
            res.data.forEach(item => {
              this.disCardDialog.cards.push({
                cardid: item.id,
                cardname: item.cpname,
                value: '',
                dtype: '',
                cpcode: item.cpcode
              })
              this.mutiPriceDialog.cards.push({
                cardid: item.id,
                cardname: item.cpname,
                value: '',
                dtype: '',
                cpcode: item.cpcode
              })
              this.speicalDialog.cards.push({
                cardid: item.id,
                cardName: item.cpname,
                value: '',
                dtype: '',
                cpcode: item.cpcode
              })
            })
          }
        })
    },
    async getData(reqParams, sptid) {
      const fetch = service.servicePrice.findServPriceListPage
      const params = { ...this.pageInfo, ...reqParams, ...{ sptid: sptid } }
      this.$refs.tableService.reloadData({
        fetch,
        params
      })
    },
    editPrice(row) {
      this.priceDialog.title = row.servname
      this.priceDialog.visible = true
      this.priceDialog.servid = row.id
      this.priceDialog.price = row.price
      this.priceDialog.minPrice = row.minPrice
      this.priceDialog.revision = row.revision
    },
    salePriceDialog() {
      if (Number(this.priceDialog.minPrice) > Number(this.priceDialog.price)) {
        yid.util.error('最低价不能超过基础定价')
      } else {
        const params = {}
        params.id = this.priceDialog.servid
        if (this.priceDialog.price === 0) {
          params.price = 0
        } else {
          params.price = this.priceDialog.price
            ? Number(this.priceDialog.price)
            : null
        }
        if (this.priceDialog.minPrice === 0) {
          params.minPrice = 0
        } else {
          params.minPrice = this.priceDialog.minPrice
            ? Number(this.priceDialog.minPrice)
            : null
        }
        params.revision = this.priceDialog.revision
        service.servicePrice.saveBasePrice(params).then(res => {
          if (res.resp_code == '200') {
            yid.util.success(res.resp_msg)
            this.queryServData()
            this.levelCancel()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      }
    },
    editDiscount(row) {
      this.disCardDialog.servid = row.id
      this.disCardDialog.servname = row.servname
      this.disCardDialog.title = '设置会员卡折扣价'
      this.disCardDialog.visible = true
      this.disCardDialog.type = row.cardtype || '0'
      this.disCardDialog.revision = row.revision
      if (this.disCardDialog.type == '0') {
        this.disCardDialog.cards.forEach(item => {
          item.dtype = ''
          item.value = ''
        })
        this.disCardDialog.card = {}
      }
      if (this.disCardDialog.type == '1') {
        this.disCardDialog.cards.forEach(item => {
          item.dtype = ''
          item.value = ''
          row.servcards.forEach(card => {
            if (item.cardid == card.cardid) {
              item.cardname = card.cardname
              item.dtype = card.dtype
              item.value = card.value
              item.cpcode = card.cpcode
            }
          })
        })
        this.disCardDialog.card = {}
      }
      if (this.disCardDialog.type == '2') {
        this.disCardDialog.cards.forEach(item => {
          item.dtype = ''
          item.value = ''
        })
        if (row.servcards && row.servcards.length > 0) {
          row.servcards.forEach(card => {
            this.disCardDialog.card.cardid = card.cardid
            this.disCardDialog.card.cardname = card.cardname
            this.disCardDialog.card.dtype = card.dtype
            this.disCardDialog.card.value = card.value
            this.disCardDialog.card.cpcode = card.cpcode
          })
        } else {
          this.disCardDialog.card.cardid = -1
          this.disCardDialog.card.cardname = '全部会员卡'
          this.disCardDialog.card.dtype = ''
          this.disCardDialog.card.value = ''
          this.disCardDialog.card.cpcode = '-1'
        }
      }
    },
    checkDiscount(card) {
      if (
        card.dtype == '1' &&
        card.value &&
        (card.value > 10 || card.value < 0)
      ) {
        yid.util.error('折扣应该是大于等于0，小于等于10')
        card.value = ''
        return false
      }
    },
    saveDiscount() {
      let message = ''
      let messcode = ''
      let i = 0
      if (
        this.disCardDialog.type == '1' &&
        this.disCardDialog.cards &&
        this.disCardDialog.cards.length > 0
      ) {
        this.disCardDialog.cards.forEach(card => {
          if ((!card.dtype && card.value) || (card.dtype && !card.value))
            message += card.cardname + ' '
          if (
            card.dtype == '1' &&
            card.value &&
            (card.value > 10 || card.value < 0)
          )
            messcode += card.cardname + ' '
          if (card.dtype && card.value) i++
        })
      }
      if (this.disCardDialog.type == '2') {
        const card = this.disCardDialog.card
        if (!card || !card.dtype || !card.value) {
          message += card.cardname
        }
        if (
          card.dtype == '1' &&
          card.value &&
          (card.value > 10 || card.value < 0)
        ) {
          messcode += card.cardname
        }
      }
      if (message || messcode) {
        if (message) {
          yid.util.error('折扣价没填完')
        }
        if (messcode) {
          yid.util.error('[' + messcode + ']折扣应该是大于等于0，小于等于10')
        }
        return
      }
      if (this.disCardDialog.type == '1' && i == 0) {
        yid.util.error('不能全为空')
        return
      }
      const params = {}
      params.id = this.disCardDialog.servid
      params.cardtype = this.disCardDialog.type
      //params.revision=this.disCardDialog.revision;
      params.sptid = this.sptdata.sptid
      params.spcode = this.sptdata.spcode
      params.servcards = []
      if (this.disCardDialog.type == '1') {
        this.disCardDialog.cards.forEach(card => {
          if (card.dtype && card.value) {
            params.servcards.push({
              cardid: card.cardid,
              cardname: card.cardname,
              dtype: card.dtype,
              value: card.value,
              cpcode: card.cpcode
            })
          }
        })
      }
      if (this.disCardDialog.type == '2') {
        params.servcards.push({
          cardid: -1,
          cardname: '全部会员卡',
          dtype: this.disCardDialog.card.dtype,
          value: this.disCardDialog.card.value,
          cpcode: '-1'
        })
      }
      service.servicePrice.saveServcards(params).then(res => {
        if (res.resp_code == '200') {
          yid.util.success(res.resp_msg)
          this.queryServData()
          this.levelCancel()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    deldiscount(row) {
      yid.util.confirm('您确定删除该设定吗？', '', '', () => {
        service.servicePrice.delServCard(row.id).then(res => {
          if (res.resp_code == '200') {
            this.queryServData()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      })
    },
    editSpeical(row) {
      this.speicalDialog.title = '员工级别价格设置'
      this.speicalDialog.visible = true
      this.speicalDialog.servid = row.id
      this.speicalDialog.servname = row.servname
      this.speicalDialog.speicalRows = []
      if (row.servspecs && row.servspecs.length > 0) {
        row.servspecs.filter(item => {
          this.speicalDialog.speicalRows.push({ ...item })
        })
      }
      this.changSpeicalType(this.speicalDialog.type)
    },
    changSpeicalType(id) {
      this.speicalDialog.id = ''
      if (id == '1') {
        this.speicalDialog.speicalData = this.positions
      } else {
        this.speicalDialog.speicalData = this.employees
      }
    },
    changSpeicalData(id) {
      this.speicalDialog.speicalData.forEach(item => {
        if (id == item.id) {
          this.speicalDialog.code = item.code
          this.speicalDialog.name = item.name
        }
      })
    },
    addSpeicalRow() {
      if (!this.speicalDialog.id) {
        yid.util.error('请选择职务级别')
        return
      }
      let flag = false
      this.speicalDialog.speicalRows.forEach(item => {
        if (
          item.btype == '1' &&
          this.speicalDialog.type == '1' &&
          item.pslid == this.speicalDialog.id
        ) {
          flag = true
        }
        if (
          item.btype == '2' &&
          this.speicalDialog.type == '2' &&
          item.eeid == this.speicalDialog.id
        ) {
          flag = true
        }
      })
      if (flag) {
        yid.util.error(this.speicalDialog.name + '已经在表格中')
        return
      }
      const discounts = []
      this.speicalDialog.cards.filter(item => {
        discounts.push({ ...item })
      })
      this.speicalDialog.speicalRows.push({
        servid: this.speicalDialog.servid,
        pslid: this.speicalDialog.type == '1' ? this.speicalDialog.id : '',
        pslcode: this.speicalDialog.type == '1' ? this.speicalDialog.code : '',
        pslname: this.speicalDialog.type == '1' ? this.speicalDialog.name : '',
        eeid: this.speicalDialog.type == '2' ? this.speicalDialog.id : '',
        eecode: this.speicalDialog.type == '2' ? this.speicalDialog.code : '',
        eename: this.speicalDialog.type == '2' ? this.speicalDialog.name : '',
        btype: this.speicalDialog.type,
        specialPrice: '',
        minPrice: '',
        discountType: '0',
        discounts: discounts,
        dtype: '',
        value: ''
      })
    },
    checkSpecialPrice(data) {
      if (
        data.specialPrice &&
        data.minPrice &&
        data.minPrice > data.specialPrice
      ) {
        yid.util.error('最低价不能超过基础定价')
        data.minPrice = ''
        return
      }
    },
    deleteSpeicalRow(row) {
      yid.util.confirm('您确定删除该设定吗？', '', '', () => {
        let num = -1
        this.speicalDialog.speicalRows.forEach((item, index) => {
          if (
            row.btype == item.btype &&
            (row.pslid == item.pslid || row.eeid == item.eeid)
          ) {
            num = index
          }
        })
        if (num >= 0) {
          this.speicalDialog.speicalRows.splice(num, 1)
        }
      })
    },
    saveSpeical() {
      let message = ''
      this.speicalDialog.speicalRows.forEach(item => {
        if (!item.specialPrice) {
          message +=
            (item.dtype == '1' ? item.pslname : item.eename) + '特殊价必填'
        }
      })
      if (message) {
        yid.util.error(message)
        return
      }
      let messcode = ''
      let messname = ''
      this.speicalDialog.speicalRows.forEach(item => {
        const name = item.btype == '1' ? item.pslname : item.eename
        if (item.discountType == '1' && item.discounts) {
          let i = 0
          item.discounts.forEach(dis => {
            if (dis.dtype && dis.value) i++
            if ((!dis.dtype && dis.value) || (dis.dtype && !dis.value))
              message += name + ':' + dis.cardName + ' '
            if (
              dis.dtype == '1' &&
              dis.value &&
              (dis.value > 10 || dis.value < 0)
            )
              messcode += name + ':' + dis.cardname + ' '
          })
          if (i == 0) {
            messname += name + ' '
          }
        }
        if (item.discountType == '2') {
          if (!item.dtype || !item.value) message += name + ':' + '全部会员卡 '
          if (
            item.dtype == '1' &&
            item.value &&
            (item.value > 10 || item.value < 0)
          )
            messcode += name + ':' + '全部会员卡 '
        }
      })
      if (message || messcode || messname) {
        if (messname) {
          yid.util.error('[单卡设置:' + messname + ']不能全为空')
        }
        if (messcode) {
          yid.util.error(
            '[' + messcode + ']折扣范围应该是大于等于0，小于等于10'
          )
        }
        if (message) {
          yid.util.error('[' + message + ']折扣价没填完')
        }
        return
      }
      const params = {
        id: this.speicalDialog.servid,
        sptid: this.sptdata.sptid,
        spcode: this.sptdata.spcode,
        servspecs: this.speicalDialog.speicalRows
      }
      service.servicePrice.savespecials(params).then(res => {
        if (res.resp_code == '200') {
          yid.util.success(res.resp_msg)
          this.queryServData()
          this.levelCancel()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    delspeical(row) {
      yid.util.confirm('您确定删除该设定吗？', '', '', () => {
        service.servicePrice.delServSpeical(row.id).then(res => {
          if (res.resp_code == '200') {
            this.queryServData()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      })
    },
    setShopService(row) {
      service.chain.servicePrice
        .getServShopStatus({ servid: row.id })
        .then(res => {
          if (res.resp_code == 200) {
            this.shopDialog.servshops = []
            this.sptdata.shoplist.forEach(each => {
              let flag = true
              if (res.data) {
                res.data.forEach(shop => {
                  if (shop.shopid == each.shopid) {
                    flag = false
                  }
                })
              }
              this.shopDialog.servshops.push({
                shopid: each.shopid,
                shopcode: each.shopcode,
                shopname: each.shopname,
                status: flag ? '1' : '2'
              })
            })
            this.shopDialog.visible = true
            this.shopDialog.id = row.id
            this.shopDialog.servcode = row.servcode
            this.shopDialog.servname = row.servname
            this.shopDialog.sptid = this.sptdata.sptid
            this.shopDialog.sptcode = this.sptdata.sptcode
          }
        })
    },
    setShopServStatus(row) {
      service.base.servicebaseInfo
        .listAll({
          servcode: row.servcode,
          sptid: row.sptid,
          isDel: '0',
          shoppid: 0
        })
        .then(res => {
          if (res.resp_code == 200) {
            this.shopDialog.servshops = []
            if (res.data) {
              res.data.forEach(each => {
                this.shopDialog.servshops.push({
                  id: each.id,
                  shopid: each.shopid,
                  shopcode: each.shopcode,
                  shopname: each.shopname,
                  status: each.status
                })
              })
            }
            this.shopDialog.visible = true
            this.shopDialog.id = row.id
            this.shopDialog.servcode = row.servcode
            this.shopDialog.servname = row.servname
            this.shopDialog.sptid = this.sptdata.sptid
            this.shopDialog.sptcode = this.sptdata.sptcode
          }
        })
    },
    handleSelectionShopChange(rows) {
      this.shopDialog.selectShopList = rows
    },
    batchUpdateServShopStatus(status) {
      if (this.shopDialog.shopid) {
        this.shopDialog.servshops.forEach(each => {
          if (this.shopDialog.shopid == each.shopid) {
            each.status = status
          }
        })
      }
      this.shopDialog.selectShopList.forEach(each => {
        each.status = status
      })
    },
    checkServShopStatus() {
      service.chain.servicePrice
        .checkServShopStatus(this.shopDialog)
        .then(res => {
          if (res.data) {
            yid.util.confirm(res.data, '', '', () => {
              this.saveServStatus()
            })
          } else {
            this.saveServStatus()
          }
        })
    },
    saveServShopStatus() {
      service.chain.servicePrice
        .saveServShopStatus(this.shopDialog)
        .then(res => {
          if (res.resp_code == '200') {
            this.shopDialog.visible = false
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },
    saveServStatus() {
      service.base.servicebaseInfo
        .saveServShopStatus(this.shopDialog)
        .then(res => {
          if (res.resp_code == '200') {
            this.shopDialog.visible = false
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },
    //获取分类项目
    async getDataType() {
      if (!this.formGroup.branch || !this.formGroup.scode) {
        yid.util.warning('请选择部门和分类！')
        return
      }
      await this.getServicesGroup()
      service.servicePrice
        .findServPriceListPage({
          page: 1,
          limit: 1000,
          ...this.formGroup,
          sptid: this.sptdata.sptid,
          status: 1
        })
        .then(res => {
          if (res.resp_code == '200') {
            this.servicesGroup = res.data && res.data.length > 0 ? res.data : []
            if (
              this.servicesGroup.length > 0 &&
              this.servicesTypeGroup.length > 0
            ) {
              this.servicesTypeGroup.forEach(sertg => {
                sertg.serviceInfo.forEach(serinfo => {
                  let tindex = this.servicesGroup.findIndex(
                    serg => serg.servcode == serinfo.servcode
                  )
                  if (tindex > -1) {
                    this.servicesGroup.splice(tindex, 1)
                  }
                })
              })
            }
          }
        })
    },
    //新增分组
    addGroup() {
      if (!this.formGroup.branch || !this.formGroup.scode) {
        yid.util.warning('请选择部门和分类！')
        return
      }
      let obj = {
        id: '',
        servcode: this.sptdata.spcode,
        name: '',
        servtid: this.formGroup.scode,
        serviceInfo: []
      }
      this.servicesTypeGroup.push(obj)
    },
    //删除分组
    deleteGroup(index) {
      this.servicesGroup.push(...this.servicesTypeGroup[index].serviceInfo)
      this.servicesTypeGroup.splice(index, 1)
    },
    //获取分组项目
    getServicesGroup() {
      let tt = this.sptdata
      service.servicePrice
        .getServiceGroup({
          servcode: this.sptdata.spcode,
          servtid: this.formGroup.scode
        })
        .then(res => {
          if (res.resp_code == '200') {
            this.servicesTypeGroup =
              res.data && res.data.length > 0 ? res.data : []
          }
        })
    },
    //保存分组
    saveType() {
      if (!this.formGroup.scode) {
        yid.util.warning('请选择分类！')
        return
      }
      if (this.servicesTypeGroup.length == 0) {
        yid.util.warning('请添加分组！')
        return
      }
      let isNotname = this.servicesTypeGroup.every(sertg => sertg.name)
      if (!isNotname) {
        yid.util.warning('分组名称必填！')
        return
      }
      this.servicesTypeGroup.forEach(sertg => {
        sertg.serviceInfo.forEach((serinfo, index) => {
          serinfo.sort = index + 1
        })
      })
      let params = {
        servcode: this.sptdata.spcode,
        servtid: this.formGroup.scode,
        serviceGroups: this.servicesTypeGroup
      }
      service.servicePrice.saveServiceGroup(params).then(res => {
        if (res.resp_code == '200') {
          this.addServGroup.visible = false
        }
      })
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext
      const draggedElement = draggedContext
      console.log('relatedElement', relatedElement)
      console.log('draggedElement', draggedElement)
    },
    reMove(evevt) {
      console.log('evevt', evevt)
    },
    moveChange(e) {
      this.servicesTypeGroup.forEach(sertg => {
        sertg.serviceInfo.forEach((serinfo, index) => {
          serinfo.sort = index + 1
        })
      })
    },
    sort(e) {
      console.log('排序e', e)
    }
    /* moveChange2(e){
                 console.log('e2',e2)
             }*/
  },
  mounted() {
    this.init()
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

/deep/ .el-form {
  &.shuax {
    display: flex;
    align-items: center;
    .el-form-item {
      display: inline-block;
      margin-bottom: 0;
    }
    .el-form-item__content {
      display: flex;
    }
  }
}

.moren {
  display: flex;
  flex-wrap: wrap;
  background-color: #f2f2f2;
  padding: 10px 0 0 10px;
  max-height: 500px;
  overflow-y: auto;
  span {
    width: calc(50% - 10px);
    background-color: #fff;
    line-height: 36px;
    text-align: center;
    margin: 0 10px 10px 0;
    cursor: pointer;
  }
}

.group {
  display: flex;
  flex-wrap: wrap;
  background-color: #f2f2f2;
  padding: 10px 0 0 10px;
  overflow-y: auto;
  margin: 10px 0;
  min-height: 50px;
  span {
    width: auto;
    background-color: #fff;
    padding: 0 15px;
    line-height: 36px;
    margin: 0 10px 10px 0;
    cursor: pointer;
  }
}
</style>
