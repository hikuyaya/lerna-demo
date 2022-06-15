<template>
  <div class="Rq">
    <el-collapse-transition>
      <div v-show="showList">
        <el-button @click="cancleFhBilllBatch" type="primary"
          >取消复核</el-button
        >
        <el-button @click="openRject(2)" type="primary">批量驳回</el-button>
        <el-button @click="auditFhBilllBatch" type="primary"
          >批量复核</el-button
        >
        <el-button @click="importBill" type="primary">导出</el-button>
        <el-button @click="setLimitbillBatch" type="primary"
          >设置支出上限设置</el-button
        >
        <el-button @click="selectChangeGather()" type="success"
          >修改汇总类型</el-button
        >
        <el-button @click="lockrq" type="success">锁定</el-button>
        <el-button type="text" @click="dialogLogTableVisible = true"
          >查看操作记录</el-button
        >
        <div style="margin-top: 5px">
          <!--<el-divider/>-->
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="单据编码：" prop="billcode" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.billcode"
              placeholder="单据编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="审核人：" prop="code" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.auditBy"
              placeholder="审核人"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="单据状态：" prop="status">
            <el-select
              style="width: 100px"
              v-model="searchForm.status"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="审核日期："
            prop="sTimeRange"
            label-width="100px">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.auditTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>

          <br />

          <el-form-item label="店号：" prop="shopcode" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.shopcode"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：" prop="shopType" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.shopType"
              style="width: 150px">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="汇总类型：" prop="gathertype">
            <el-select
              clearable
              v-model="searchForm.gathertype"
              style="width: 150px">
              <el-option label="单笔" value="1"></el-option>
              <el-option label="汇总" value="2"></el-option>
              <el-option label="工资" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="复核日期："
            prop="sTimeRange"
            label-width="100px">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.checkTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <br />
          <el-form-item label="备用金类型：" prop="type">
            <el-select clearable v-model="searchForm.type" style="width: 180px">
              <el-option label="日常备用金" value="1"></el-option>
              <el-option label="大额备用金" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审批部门：" prop="orgcode" label-width="100px">
            <el-select
              clearable
              v-model="searchForm.orgcode"
              style="width: 180px">
              <el-option label="财务部" value="0"></el-option>
              <el-option label="信息部" value="1"></el-option>
              <el-option label="美发部" value="2"></el-option>
              <el-option label="美容部" value="3"></el-option>
              <el-option label="工程部" value="4"></el-option>
              <el-option label="物流部" value="5"></el-option>
              <el-option label="市场部" value="6"></el-option>
              <el-option label="拓展部" value="7"></el-option>
              <el-option label="安全督查部" value="8"></el-option>
              <el-option label="行政部" value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上传：" prop="isphoto">
            <el-select
              clearable
              v-model="searchForm.isphoto"
              style="width: 180px">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请原因：" prop="reason" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.reason"
              placeholder="申请原因"
              style="width: 180px"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="申请金额：" prop="money" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.startmoney"
              style="width: 80px"></el-input>
            至
            <el-input
              clearable
              v-model="searchForm.endmoney"
              style="width: 80px"></el-input>
          </el-form-item>

          <el-form-item label="财务片区：" prop="status" label-width="100px">
            <el-select
              style="width: 200px"
              v-model="searchForm.areacode"
              multiple
              placeholder="请选择">
              <el-option
                v-for="item in financeAreaList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支出项目：" prop="status">
            <el-select
              style="width: 200px"
              v-model="searchForm.outcode"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="rest" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
        <yid-table
          ref="table"
          pagination
          style="width: 100%; margin-top: 10px"
          @selection-change="handleSelectionChange">
          <yid-table-column type="selection" width="55"></yid-table-column>
          <yid-table-column prop="orgcode" label="审批部门" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.orgcode == 0">财务部</span>
              <span v-if="scope.row.orgcode == 1">信息部</span>
              <span v-if="scope.row.orgcode == 2">美发部</span>
              <span v-if="scope.row.orgcode == 3">美容部</span>
              <span v-if="scope.row.orgcode == 4">工程部</span>
              <span v-if="scope.row.orgcode == 5">物流部</span>
              <span v-if="scope.row.orgcode == 6">市场部</span>
              <span v-if="scope.row.orgcode == 7">拓展部</span>
              <span v-if="scope.row.orgcode == 8">安全督查部</span>
              <span v-if="scope.row.orgcode == 9">行政部</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="shopcode"
            label="门店"
            width="100"></yid-table-column>
          <yid-table-column
            prop="money"
            label="合计金额"
            width="80"></yid-table-column>
          <yid-table-column
            prop="ioitemName"
            label="支出项目"
            width="100"></yid-table-column>
          <yid-table-column
            prop="reason"
            label="申请原因"
            width="320"></yid-table-column>
          <yid-table-column prop="isMatched" label="收款人" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.isMatched == 0">否</span>
              <span v-if="scope.row.isMatched == 1">是</span>
              <span v-if="scope.row.isMatched == 2">未设置</span>
            </template>
          </yid-table-column>
          <yid-table-column prop="gathertype" label="汇总类型" width="100">
            <template slot-scope="scope">
              <el-select
                placeholder="请选择"
                :disabled="false"
                @change="changeGathertype(scope.row)"
                v-model="scope.row.gathertype">
                <el-option label="单笔" value="1"></el-option>
                <el-option label="汇总" value="2"></el-option>
                <el-option label="工资" value="3"></el-option>
              </el-select>
            </template>
          </yid-table-column>
          <yid-table-column prop="isphoto" label="图片" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.isphoto == 'Y'">是</span>
              <span v-if="scope.row.isphoto == 'N'">否</span>
            </template>
          </yid-table-column>
          <yid-table-column prop="type" label="备用金类型" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">日常备用金</span>
              <span v-if="scope.row.type == 2">大额备用金</span>
            </template>
          </yid-table-column>

          <yid-table-column
            prop="billcode"
            label="单据编码"
            width="135"></yid-table-column>
          <yid-table-column prop="status" label="审核状态" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">未提交</span>
              <span v-if="scope.row.status == 2">已提交</span>
              <span v-if="scope.row.status == 3">已审批</span>
              <span v-if="scope.row.status == 4">已复核</span>
              <span v-if="scope.row.status == 5">已驳回</span>
              <span v-if="scope.row.status == 9">已作废</span>
            </template>
          </yid-table-column>

          <yid-table-column prop="isLimit" label="支出上限" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.isLimit == 0">否</span>
              <span v-if="scope.row.isLimit == 1">是</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="auditor"
            label="审核人"
            width="100"></yid-table-column>
          <yid-table-column prop="auditdate" label="审核日期" width="100">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.auditdate) }}
            </template>
          </yid-table-column>

          <yid-table-column
            prop="checkor"
            label="复核人"
            width="100"></yid-table-column>
          <yid-table-column prop="checkdate" label="复核时间" width="100">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.checkdate) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="rejectmemo"
            label="驳回原因"
            width="100"></yid-table-column>

          <yid-table-column label="操作" min-width="70" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="editBill(scope.row)"
                >详情</el-link
              >
              <!--               <el-link  v-if="scope.row.status=='3'" style="margin: 0 10px 0 10px;" type="primary" @click="auditBillrow(scope.row)">复核</el-link>
                                           <el-link  v-if="scope.row.status=='3'"  style="margin: 0 10px 0 10px;" type="primary" @click="openRjectrow(scope.row)">驳回</el-link>

                                           <el-link  v-if="scope.row.status=='4'"  style="margin: 0 10px 0 10px;" type="primary" @click="cancleFhBilllrow(scope.row)">取消复核</el-link>

                            <el  v-if="scope.row.type=='2' && scope.row.status=='4' && scope.row.isLimit=='1'"  style="margin: 0 10px 0 10px;" type="info" >已设置</el>
                            <el-link  v-if="scope.row.type=='2' && scope.row.status=='4' && scope.row.isLimit=='0'"  style="margin: 0 10px 0 10px;" @click="setLimitbill(scope.row)" type="primary" >设置支出上限</el-link>
   -->
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button v-show="isEdit" @click="auditBill" type="primary"
          >复核</el-button
        >
        <el-button v-show="isZc" @click="setLimitbillInfo" type="primary"
          >设置支出上限</el-button
        >
        <el-button v-show="isEdit" @click="openRject(1)" type="primary"
          >驳回</el-button
        >
        <el-button
          v-print="printObj"
          v-show="true"
          @click="handleprint(printObj)"
          type="primary"
          >打印</el-button
        >
        <div
          ref="printId"
          id="printId"
          cellspacing="0"
          cellpadding="0"
          border="0">
          <el-form
            ref="billForm"
            :model="billForm"
            style="margin-top: 16px"
            :rules="rules"
            label-width="100px"
            label-position="right">
            <div class="container">
              <div style="width: 210px; display: inline-block">
                单据编码：{{ billForm.billcode }}
              </div>
              <div style="width: 210px; display: inline-block">
                创建人：{{ billForm.createdBy }}
              </div>
              <div style="width: 250px; display: inline-block">
                创建时间：{{ billForm.createdTime }}
              </div>
              <div style="width: 250px; display: inline-block"></div>
            </div>
            <div class="container">
              <div style="width: 210px; display: inline-block">
                审核状态：<el-select
                  style="width: 100px"
                  v-model="billForm.status"
                  disabled="disabled">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="width: 210px; display: inline-block">
                审核人：{{ billForm.auditor }}
              </div>
              <div style="width: 250px; display: inline-block">
                审核时间：{{ billForm.auditdate }}
              </div>
            </div>
          </el-form>
          <div style="margin-top: -5px">
            <el-divider />
          </div>
          <el-form ref="billForm" :model="billForm" label-width="130px">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-form-item label="门店编码：" prop="shopcode" disabled>
                  {{ billForm.shopcode }}
                </el-form-item>

                <el-form-item
                  label="备用金类型："
                  prop="type"
                  style="display: inline-block"
                  :disabled="!isEdit"
                  :rules="[{ required: true, message: '请选择备用金类型' }]">
                  <el-select
                    value-key="id"
                    placeholder="请选择"
                    disabled
                    v-model.trim="billForm.type">
                    <el-option label="日常备用金" value="1"></el-option>
                    <el-option label="大额备用金" value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="申请金额："
                  width="150"
                  style="display: inline-block"
                  prop="money"
                  :disabled="!isEdit"
                  :rules="[{ required: true, message: '申请金额为空' }]">
                  <el-input
                    type="number"
                    v-model="billForm.money"
                    disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="一级科目："
                  width="150"
                  style="display: inline-block"
                  prop="ioitemPcode"
                  :disabled="!isEdit"
                  v-show="typeCheck"
                  :rules="[{ required: true, message: '请选择一级科目' }]">
                  <el-select
                    value-key="ioitemPcode"
                    placeholder="请选择"
                    disabled
                    v-model="billForm.ioitemPcode">
                    <el-option
                      :key="item.id"
                      :value="item.code"
                      :label="item.name"
                      v-for="item in ioitemPDataAll" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="二级科目："
                  width="150"
                  style="display: inline-block"
                  prop="ioitemCode"
                  v-show="typeCheck"
                  :rules="[{ required: true, message: '请选择二级科目' }]">
                  <el-select
                    value-key="ioitemCode"
                    placeholder="请选择"
                    disabled
                    v-model="billForm.ioitemCode">
                    <el-option
                      :key="item.id"
                      :value="item.code"
                      :label="item.name"
                      v-for="item in ioitemDataAll" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="二级科目备注："
                  prop="reason"
                  v-show="typeCheck"
                  :disabled="true">
                  <el-input
                    :disabled="true"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    v-model="billForm.ioitemCMemo">
                  </el-input>
                </el-form-item>

                <el-form-item
                  label="申请费所属周期："
                  prop="sTimeRange"
                  :disabled="true"
                  v-show="typeCheck"
                  width="150">
                  <el-date-picker
                    :clearable="true"
                    :disabled="true"
                    v-model="billForm.applyDateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label="申请原因："
                  prop="reason"
                  :disabled="!isEdit"
                  :rules="[{ required: true, message: '申请原因为空' }]">
                  <el-input
                    disabled
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="billForm.reason">
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="备注："
                  prop="reason"
                  v-show="!typeCheck"
                  :disabled="!isEdit">
                  <el-input
                    disabled
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="billForm.memo">
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="收款账户人："
                  width="150"
                  style="display: inline-block"
                  prop="payee"
                  disabled
                  v-show="typeCheck">
                  <el-input v-model="billForm.payee" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label=""
                  width="150"
                  disabled
                  style="display: inline-block"
                  v-show="typeCheck">
                  <el-select
                    value-key="landCode"
                    placeholder="请选择"
                    disabled
                    v-model="billForm.landCode">
                    <el-option
                      :key="item.id"
                      :value="item.code"
                      :label="item.payee"
                      v-for="item in accountDataAll" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="收款银行账号："
                  width="150"
                  prop="bankno"
                  :disabled="!isbankEdit"
                  v-show="typeCheck">
                  <el-input v-model="billForm.bankno" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="收款开户银行："
                  width="150"
                  prop="bank"
                  :disabled="!isbankEdit"
                  v-show="typeCheck">
                  <el-input v-model="billForm.bank" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="收款银行支行："
                  width="150"
                  prop="branchbank"
                  :disabled="!isbankEdit"
                  v-show="typeCheck">
                  <el-input v-model="billForm.branchbank" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="审批部门："
                  prop="orgcode"
                  disabled="true"
                  v-show="typeCheck">
                  <el-select
                    value-key="id"
                    placeholder="请选择"
                    disabled="true"
                    v-model.trim="billForm.orgcode">
                    <el-option label="财务部" value="0"></el-option>
                    <el-option label="信息部" value="1"></el-option>
                    <el-option label="美发部" value="2"></el-option>
                    <el-option label="美容部" value="3"></el-option>
                    <el-option label="工程部" value="4"></el-option>
                    <el-option label="物流部" value="5"></el-option>
                    <el-option label="市场部" value="6"></el-option>
                    <el-option label="拓展部" value="7"></el-option>
                    <el-option label="安全督查部" value="8"></el-option>
                    <el-option label="行政部" value="9"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="收款人是否匹配："
                  prop="isMatched"
                  :disabled="!isEdit"
                  v-show="typeCheck">
                  <el-select
                    value-key="id"
                    placeholder="请选择"
                    :disabled="true"
                    v-model.trim="billForm.isMatched">
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="未设置" value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="上传图片：" prop="photo">
                  <div
                    v-if="billForm.fundImages && billForm.fundImages.length > 0"
                    class="block"
                    style="width: 360px; margin-top: 16px">
                    <el-image
                      v-for="item in billForm.fundImages"
                      :key="item"
                      style="width: 100px; height: 100px"
                      :src="item.photopath"
                      :preview-src-list="photosrcList">
                    </el-image>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8"> </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-collapse-transition>
    <yid-dialog
      :title="lockRqDialog.title"
      :visible.sync="lockRqDialog.visible"
      @close="lockRqCancel"
      @opened="queryLockrq"
      width="900px">
      <el-row>
        <el-col>
          <yid-table
            pagination
            ref="tablelockRq"
            style="margin-top: 10px"
            class="store-table">
            <!-- <yid-table-column label="锁定日期" min-width="120" prop="rq">
                             <template slot-scope="scope">

                                 <el-date-picker
                                         v-model="scope.row.rq"
                                         type="date"
                                         value-format="yyyy-MM-dd"
                                         placeholder="请选择"
                                         :disabled="getIsEditCk(scope.row)"
                                         @change="changeLockRq(scope.row)"
                                 >
                                 </el-date-picker>
                             </template>

                         </yid-table-column>-->
            <yid-table-column label="解锁标志" min-width="200" prop="status">
              <template slot-scope="scope">
                <el-select
                  placeholder="请选择"
                  :disabled="true"
                  v-model="scope.row.status">
                  <el-option label="未锁定" value="0"></el-option>
                  <el-option label="已锁定" value="1"></el-option>
                </el-select>
              </template>
            </yid-table-column>
            <yid-table-column
              label="操作人"
              min-width="120"
              prop="createdBy"></yid-table-column>
            <yid-table-column
              label="操作时间"
              min-width="120"
              prop="createdTime"></yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col>
          <el-button
            type="primary"
            @click="lockrqSave()"
            style="margin-left: 300px"
            >确定</el-button
          >
          <el-button @click="lockRqCancel">取消</el-button>
        </el-col>
      </el-row>
    </yid-dialog>
    <yid-dialog title="修改汇总类型" :visible.sync="gatherVigsible">
      <el-row>
        <el-col>
          <el-form :model="billForm">
            <el-form-item label="" label-width="10px">
              已选中<span style="color: red">{{ selectedNum }}</span
              >条单据，选中的单据批量修改为
              <el-select v-model="billForm.gathertypes" placeholder="请选择">
                <el-option label="单笔" value="1"></el-option>
                <el-option label="汇总" value="2"></el-option>
                <el-option label="工资" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col>
          <el-button @click="gatherVigsible = false" style="margin-left: 200px"
            >取 消</el-button
          >
          <el-button type="primary" @click="changeGathertypeBatch()"
            >确 定</el-button
          >
        </el-col>
      </el-row>
    </yid-dialog>
    <yid-dialog
      title="查看操作记录"
      :visible.sync="dialogLogTableVisible"
      @opened="queryLockLog"
      width="900px">
      <el-tabs v-model="activeName" @tab-click="querygatherLockLog">
        <el-tab-pane label="锁定记录" name="first">
          <el-row>
            <el-col>
              <yid-table
                pagination
                ref="tablelockRq"
                style="margin-top: 10px"
                class="store-table">
                <!-- <yid-table-column label="锁定日期" min-width="120" prop="rq">
                                     <template slot-scope="scope">
                                     {{$yid.util.formatTime(scope.row.rq)}}
                                     </template>
                                 </yid-table-column>-->
                <yid-table-column prop="status" label="解锁标志" width="200">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">未锁定</span>
                    <span v-if="scope.row.status == 1">已锁定</span>
                  </template>
                </yid-table-column>
                <yid-table-column
                  label="操作人"
                  min-width="120"
                  prop="createdBy"></yid-table-column>
                <yid-table-column
                  label="操作时间"
                  min-width="120"
                  prop="createdTime"></yid-table-column>
              </yid-table>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="修改汇总类型记录" name="second">
          <el-row>
            <el-col>
              <yid-table
                pagination
                ref="tablegatherRq"
                style="margin-top: 10px"
                class="store-table">
                <yid-table-column
                  prop="gathertype"
                  label="修改汇总类型"
                  width="200">
                  <template slot-scope="scope">
                    <span v-if="scope.row.gathertype == 1">单笔</span>
                    <span v-if="scope.row.gathertype == 2">汇总</span>
                    <span v-if="scope.row.gathertype == 3">工资</span>
                  </template>
                </yid-table-column>
                <yid-table-column
                  label="单据编码"
                  min-width="120"
                  prop="billcode"></yid-table-column>
                <yid-table-column
                  label="操作人"
                  min-width="120"
                  prop="createdBy"></yid-table-column>
                <yid-table-column
                  label="操作时间"
                  min-width="120"
                  prop="createdTime"></yid-table-column>
              </yid-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import ElButton from '../../library/components/button/button'
import type from '@src/type'
import cache from '@src/library/helper/cache'
import download from '@src/library/http/download'
export default {
  components: { ElButton },
  name: 'fundFhBill',
  data() {
    return {
      upload: yid.config.API.UPLOAD,
      myheaders: {},
      activeName: 'first',
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      searchForm: {
        billcode: '',
        auditBy: '',
        status: '',
        auditTimeRange: [],
        shopcode: '',
        shopType: '',
        type: '',
        gathertype: '',
        orgcode: '',
        isphoto: '',
        reason: '',
        startmoney: '',
        endmoney: '',
        areacode: [],
        outcode: [],
        checkTimeRange: [],
        checkor: '',
        createdBy: '',
        createdTimeRange: []
      },
      statusList: [
        {
          value: '1',
          label: '未提交'
        },
        {
          value: '2',
          label: '已提交'
        },
        {
          value: '3',
          label: '已审核'
        },
        {
          value: '4',
          label: '已复核'
        },
        {
          value: '5',
          label: '已驳回'
        },
        {
          value: '9',
          label: '已作废'
        }
      ],
      billForm: {
        id: '',
        shopid: '',
        shopcode: '',
        shopname: '',
        shopType: '',
        brandId: '',
        brandCode: '',
        billcode: '',
        status: '',
        gathertype: '',
        money: '',
        type: '',
        reason: '',
        ioitemPid: '',
        ioitemPcode: '',
        ioitemPname: '',
        ioitemId: '',
        ioitemCode: '',
        ioitemName: '',
        startdate: '',
        enddate: '',
        contcode: '',
        payee: '',
        bank: '',
        bankno: '',
        branchbank: '',
        isMatched: '',
        orgcode: '',
        createdBy: '',
        createdTime: '',
        auditor: '',
        auditdate: '',
        rejectmemo: '',
        applyDateRange: [],
        fundImages: [],
        landCode: '',
        ioitemCMemo: '',
        gathertypes: '',
        memo: ''
      },
      lockRqDialog: {
        visible: false,
        title: '锁定备用金申请日期',
        status: '1',
        page: 1,
        limit: 10
      },
      lockGatherDialog: {
        page: 1,
        limit: 10
      },
      initsreservfund: '',
      sreservfund: '',
      ioitemPDataAll: [],
      ioitemDataAll: [],

      accountDataAll: [],
      financeAreaList: [],
      fundshop: {},
      showList: true,
      isEdit: true,
      isZc: false,
      isbankEdit: true,
      typeCheck: false,
      rules: {},
      billcodes: '',
      ids: '',
      gathertypes: '',
      selectedNum: '0',
      photosrcList: [],
      lockRqdata: {
        rq: '',
        type: '',
        status: ''
      },
      gatherVigsible: false,
      dialogLogTableVisible: false,
      printObj: {
        id: 'printId',
        popTitle: '',
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
      },
      options: [],
      value: [],
      list: [],
      loading: false
    }
  },
  created() {
    this.handleprint()
  },
  mounted() {
    /*this.myheaders={
                authorization:'Bearer ' + $yid.cache.get($yid.type.USER.TOKEN)
            };*/

    this.getioitemListAll()
    this.getioitemPListAll()
    this.getFinanceAreaList()
    // this.queryLockrq();
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.billcode = this.searchForm.billcode
      reqObj.auditBy = this.searchForm.auditBy
      reqObj.createdBy = this.searchForm.createdBy
      reqObj.status = this.searchForm.status
      reqObj.checkor = this.searchForm.checkor
      reqObj.orgcode = this.searchForm.orgcode
      reqObj.shopcode = this.searchForm.shopcode
      reqObj.type = this.searchForm.type
      reqObj.shopType = this.searchForm.shopType
      reqObj.reason = this.searchForm.reason
      reqObj.gathertype = this.searchForm.gathertype
      reqObj.isphoto = this.searchForm.isphoto
      reqObj.startmoney = this.searchForm.startmoney
      reqObj.endmoney = this.searchForm.endmoney

      if (this.searchForm.outcode && this.searchForm.outcode.length > 0) {
        reqObj.outcode = this.searchForm.outcode.toString()
      } else {
        reqObj.outcode = null
      }
      if (this.searchForm.areacode && this.searchForm.areacode.length > 0) {
        reqObj.areacode = this.searchForm.areacode.toString()
      } else {
        reqObj.areacode = null
      }

      let auditTimeRange = this.searchForm.auditTimeRange
      if (auditTimeRange != null && auditTimeRange.length > 0) {
        reqObj.auditTimeStart = this.searchForm.auditTimeRange[0]
        reqObj.auditTimeEnd = this.searchForm.auditTimeRange[1]
        reqObj.sCreatedTimeStart = this.getcreateDate(
          new Date(reqObj.auditTimeStart)
        )
      } else {
        reqObj.auditTimeStart = ''
        reqObj.auditTimeEnd = ''
        reqObj.sCreatedTimeStart = this.getcreateDate(new Date())
      }
      reqObj.sCreatedTimeEnd = this.getnowDate()
      let checkTimeRange = this.searchForm.checkTimeRange
      if (checkTimeRange != null && checkTimeRange.length > 0) {
        reqObj.sCheckStart = this.searchForm.checkTimeRange[0]
        reqObj.sCheckEnd = this.searchForm.checkTimeRange[1]
        reqObj.sCreatedTimeStart = this.getcreateDate(
          new Date(reqObj.sCheckStart)
        )
      } else {
        reqObj.sCheckStart = ''
        reqObj.sCheckEnd = ''
      }
      if (
        auditTimeRange != null &&
        auditTimeRange.length > 0 &&
        checkTimeRange != null &&
        checkTimeRange.length > 0
      ) {
        reqObj.sCreatedTimeStart = this.getcreateDate(
          new Date(reqObj.auditTimeStart)
        )
      }
      let createdTimeRange = this.searchForm.createdTimeRange
      if (createdTimeRange != null && createdTimeRange.length > 0) {
        reqObj.sCreatedTimeStart = this.searchForm.createdTimeRange[0]
        reqObj.sCreatedTimeEnd = this.searchForm.createdTimeRange[1]
      }
      return reqObj
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.ioitemDataAll.filter(item => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    rest() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.auditTimeRange = []
    },
    getData(reqParams) {
      const fetch = service.finance.fundFhBill.billListForchain
      const params = { ...this.pageInfo, ...reqParams }

      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchFormReq)
    },
    backsearch() {
      this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.fundFhBill.billListForchain
      const params = { ...this.pageInfo, ...this.searchFormReq }
      params.isDel = '0'
      this.$refs.table.reloadDataNoChangePage({
        fetch,
        params
      })
    },
    queryFundshopData(shopcode) {
      service.finance.fundFhBill
        .queryFundShop({ shopcode: shopcode })
        .then(res => {
          if (res.resp_code == '200') {
            this.fundshop = res.data
            this.billForm.breservfund = this.fundshop.breservfund
            this.billForm.sreservfund = this.fundshop.sreservfund
            this.billForm.initsreservfund = this.fundshop.initsreservfund
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },

    back() {
      this.backsearch()
      this.showList = true
    },
    handleprint(val) {
      //console.log(val)
    },

    editBill(row) {
      this.billForm.id = row.id
      this.billForm.shopcode = row.shopcode
      this.billForm.billcode = row.billcode
      this.billForm.type = row.type
      this.billForm.createdBy = row.createdBy
      this.billForm.createdTime = row.createdTime
      this.billForm.status = row.status
      this.billForm.auditor = row.auditor
      this.billForm.auditdate = row.auditdate
      this.billForm.money = row.money
      ;(this.billForm.reason = row.reason),
        (this.billForm.rejectmemo = row.rejectmemo),
        (this.billForm.ioitemPid = row.ioitemPid),
        (this.billForm.ioitemPcode = row.ioitemPcode),
        (this.billForm.ioitemPname = row.ioitemPname),
        (this.billForm.ioitemId = row.ioitemId),
        (this.billForm.ioitemCode = row.ioitemCode),
        (this.billForm.ioitemName = row.ioitemName),
        (this.billForm.startdate = row.startdate),
        (this.billForm.enddate = row.enddate),
        (this.billForm.payee = row.payee),
        (this.billForm.bank = row.bank),
        (this.billForm.bankno = row.bankno),
        (this.billForm.branchbank = row.branchbank),
        (this.billForm.isMatched = row.isMatched),
        (this.billForm.orgcode = row.orgcode),
        (this.billForm.fundImages = row.fundImages),
        (this.billForm.memo = row.memo),
        (this.showList = false)
      this.isEdit = row.status == '3'
      this.isZc = row.type == '2' && row.status == '4' && row.isLimit == '0'
      this.isbankEdit = row.status == '1'
      if (this.billForm.type == '1') {
        this.typeCheck = false
      } else if (this.billForm.type == '2') {
        this.typeCheck = true
      }
      this.photosrcList = []
      this.billForm.fundImages.find(item => {
        this.photosrcList.push(item.photopath)
      })
      this.billForm.applyDateRange = []
      if (!yid.util.isEmpty(this.billForm.startdate)) {
        this.billForm.applyDateRange.push(this.billForm.startdate)
      }
      if (!yid.util.isEmpty(this.billForm.enddate)) {
        this.billForm.applyDateRange.push(this.billForm.enddate)
      }
    },

    auditBillrow(row) {
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.status = row.status
      this.auditBill()
    },

    auditBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      if (!yid.util.isEmpty(billcode)) {
        yid.util.confirm(
          '您确定要复核[' + billcode + ']的单据?',
          '',
          '',
          () => {
            if (status == '4') {
              yid.util.error('已复核的单据不能再次进行复核')
              return
            } else if (status == '1') {
              yid.util.error('未提交的单据不能复核')
              return
            } else if (status == '2') {
              yid.util.error('已提交的单据不能进行审核')
              return
            } else {
              //调用审核单据接口
              service.finance.fundFhBill
                .auditFhBill({ id: id, billcode: billcode })
                .then(res => {
                  if (res.resp_code == '200') {
                    yid.util.success('复核成功')
                    // this.showList = true;
                    // this.search();
                    //   this.isEdit =false;
                    this.editBill(res.data)
                  } else {
                    yid.util.error(res.resp_msg)
                  }
                })
            }
          }
        )
      } else {
        yid.util.error('单据保存后再进行复核!')
        return
      }
    },

    handleSelectionChange(selection) {
      //获取所有选中项数组的长度
      this.selectedNum = selection.length
      //获取所有选中项的值
      this.billcodes = selection.map(item => item.billcode)
      this.ids = selection.map(item => item.id)
    },
    cancleFhBilllrow(row) {
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.status = row.status
      this.cancleFhBilll()
    },
    cancleFhBilll() {
      let id = []
      id.push(this.billForm.id)
      let billcode = []
      billcode.push(this.billForm.billcode)
      let status = this.billForm.status
      if (!yid.util.isEmpty(billcode)) {
        yid.util.confirm(
          '您确定要取消复核[' + billcode + ']的单据?',
          '',
          '',
          () => {
            if (status != '4') {
              yid.util.error('未复核的单据不能取消复核')
              return
            } else {
              //调用取消复核单据接口
              service.finance.fundFhBill
                .cancleFhBilllBatch({ ids: id, billcodes: billcode })
                .then(res => {
                  if (res.resp_code == '200') {
                    yid.util.success('审核成功')
                    this.backsearch()
                  } else {
                    yid.util.error(res.resp_msg)
                  }
                })
            }
          }
        )
      } else {
        yid.util.error('单据保存后再进行复核!')
        return
      }
    },
    cancleFhBilllBatch() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要批量取消复核的单据')
        return
      }
      let id = this.ids
      let billcode = this.billcodes
      if (!yid.util.isEmpty(billcode)) {
        //调用审核单据接口
        service.finance.fundFhBill
          .cancleFhBilllBatch({ ids: id, billcodes: billcode })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('审核成功')
              this.search()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要批量取消复核的单据')
        return
      }
    },

    changeGathertype(item) {
      let id = item.id
      let billcode = item.billcode
      let gathertype = item.gathertype
      if (!yid.util.isEmpty(billcode)) {
        //调用单据接口
        service.finance.fundFhBill
          .changeGathertype({
            id: id,
            billcode: billcode,
            gathertype: gathertype
          })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('调整成功')
              this.search()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要批量修改的单据')
        return
      }
    },
    selectChangeGather() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要批量修改的单据')
        return
      }
      this.gatherVigsible = true
    },
    changeGathertypeBatch() {
      let gathertype = this.billForm.gathertypes

      let id = this.ids
      let billcode = this.billcodes
      if (!yid.util.isEmpty(billcode)) {
        //调用单据接口
        service.finance.fundFhBill
          .changeGathertypeBatch({
            ids: id,
            billcodes: billcode,
            gathertype: gathertype
          })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('调整成功')
              this.gatherVigsible = false
              this.search()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要批量修改的单据')
        return
      }
    },
    setLimitbill(row) {
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.status = row.status
      let id = []
      id.push(this.billForm.id)
      let billcode = []
      billcode.push(this.billForm.billcode)
      if (!yid.util.isEmpty(billcode)) {
        //调用单据接口
        service.finance.fundFhBill
          .setLimitbillBatch({ ids: id, billcodes: billcode })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('设置成功')
              this.backsearch()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要设置的单据单据')
        return
      }
    },
    setLimitbillBatch() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要设置的单据单据')
        return
      }
      let id = this.ids
      let billcode = this.billcodes
      if (!yid.util.isEmpty(billcode)) {
        //调用单据接口
        service.finance.fundFhBill
          .setLimitbillBatch({ ids: id, billcodes: billcode })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('设置成功')
              this.backsearch()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要设置的单据单据')
        return
      }
    },
    setLimitbillInfo() {
      let id = []
      id.push(this.billForm.id)
      let billcode = []
      billcode.push(this.billForm.billcode)
      if (!yid.util.isEmpty(billcode)) {
        //调用单据接口
        service.finance.fundFhBill
          .setLimitbillBatch({ ids: id, billcodes: billcode })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('设置成功')
              this.isZc = false
              //this.search();
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要设置的单据单据')
        return
      }
    },
    lockrq() {
      this.lockRqDialog.visible = true
      this.lockRqDialog.title = '锁定备用金申请日期'
    },
    getIsEditCk(row) {
      if (yid.util.isEmpty(row.id)) {
        return false
      } else {
        return true
      }
    },
    changeLockRq(row) {
      this.lockRqdata.rq = row.rq
      this.lockRqdata.status = row.status
      this.lockRqdata.type = row.type
    },
    async queryLockrq() {
      const fetch = service.finance.fundFhBill.listForfund
      let params = {}
      params = {
        page: this.lockRqDialog.page,
        limit: this.lockRqDialog.limit
      }

      this.$refs['tablelockRq'].reloadData({
        fetch,
        params
      })
    },
    async queryLockLog() {
      //查询锁定日期记录
      const fetch = service.finance.fundFhBill.listfundlog
      let params = {}
      params = {
        page: this.lockRqDialog.page,
        limit: this.lockRqDialog.limit
      }

      this.$refs['tablelockRq'].reloadData({
        fetch,
        params
      })
    },
    querygatherLockLog(tab, event) {
      //查询修改汇总类型记录
      const fetch = service.finance.fundFhBill.listfundgtlog
      let params = {}
      params = {
        page: this.lockGatherDialog.page,
        limit: this.lockGatherDialog.limit
      }

      this.$refs['tablegatherRq'].reloadData({
        fetch,
        params
      })
    },

    lockRqCancel() {
      this.lockRqDialog.visible = false
      this.lockRqDialog.type = ''
      this.$refs['tablelockRq'].clearData({})
    },

    lockrqSave() {
      /*if(yid.util.isEmpty(this.lockRqdata.rq)){
                    yid.util.error("请先选中日期");
                    return false;
                }else{

                }*/
      service.finance.fundFhBill.saveFundLock(this.lockRqdata).then(res => {
        if (res.resp_code == '200') {
          yid.util.success('成功')
          this.lockRqCancel()
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },

    //批量复核
    auditFhBilllBatch() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要批量复核的单据')
        return
      }
      let id = this.ids
      let billcode = this.billcodes
      if (!yid.util.isEmpty(billcode)) {
        //调用审核单据接口
        service.finance.fundFhBill
          .auditFhBilllBatch({ ids: id, billcodes: billcode })
          .then(res => {
            if (res.resp_code == '200') {
              yid.util.success('审核成功')
              this.search()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      } else {
        yid.util.error('请先选中需要批量审批的单据')
        return
      }
    },
    openRjectrow(row) {
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.status = row.status
      this.openRject(1)
    },

    openRject(type) {
      if (type == 2 && this.selectedNum == 0) {
        yid.util.error('请先选中需要批量驳回的单据')
        return
      }
      this.$prompt('', '请输入驳回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          if (!yid.util.isEmpty(value)) {
            this.billForm.rejectmemo = value
            //驳回
            if (type == 1) {
              this.rejectBill()
              //批量驳回
            } else if (type == 2) {
              this.rejectBillBatch()
            }
          } else {
            yid.util.error('请先填写驳回原因')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },

    rejectBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      let rejectmemo = this.billForm.rejectmemo

      if (status == '4') {
        yid.util.error('已复核的单据不能驳回')
        return
      }
      //调用驳回单据接口
      service.finance.fundFhBill
        .rejectBill({ id: id, billcode: billcode, rejectmemo: rejectmemo })
        .then(res => {
          if (res.resp_code == '200') {
            yid.util.success('驳回成功')
            // this.showList = true;
            //this.backsearch();
            //this.isEdit =false;
            this.editBill(res.data)
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },
    rejectBillBatch() {
      if (this.selectedNum == 0) {
        yid.util.error('请先选中需要批量驳回的单据')
        return
      }
      let id = this.ids
      let billcode = this.billcodes
      let rejectmemo = this.billForm.rejectmemo

      //调用批量驳回单据接口
      service.finance.fundFhBill
        .rejectBillBatch({
          ids: id,
          billcodes: billcode,
          rejectmemo: rejectmemo
        })
        .then(res => {
          if (res.resp_code == '200') {
            yid.util.success('驳回成功')
            this.showList = true
            this.search()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },

    importBill() {
      //查询是否有数据
      const params = { ...this.pageInfo, ...this.searchFormReq }
      service.finance.fundFhBill.billListForchain(params).then(res => {
        if (res.resp_code == '200') {
          if (res.data.length > 0) {
            download(
              $yid.config.API.BASE +
                'api-finance/fundbillhead/expRecordsListFh',
              this.searchFormReq
            )
          } else {
            yid.util.error('查询数据为空!')
            return
          }
        }
      })
    },

    getioitemListAll() {
      service.finance.ioitem.jobAll({ status: '1', type: '2' }).then(res => {
        if (res.resp_code == 200) {
          this.ioitemDataAll = res.data
        }
      })
    },
    getioitemPListAll() {
      service.finance.pioitem.listAll({ status: '1', type: '2' }).then(res => {
        if (res.resp_code == 200 && res.data.length > 0) {
          this.ioitemPDataAll = res.data
        }
      })
    },

    getFinanceAreaList() {
      service.finance.dicFinancialArea
        .financeAreaAll({ status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.financeAreaList = res.data
          }
        })
    },

    getnowDate() {
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (Number(month) < 10) {
        month = '0' + month
      }
      if (Number(day) < 10) {
        day = '0' + day
      }
      let datenow = year + '-' + month + '-' + day

      return datenow
    },
    getcreateDate(d) {
      d.setMonth(d.getMonth() - 3)
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (Number(month) < 10) {
        month = '0' + month
      }
      if (Number(day) < 10) {
        day = '0' + day
      }
      let datenow = year + '-' + month + '-' + day

      return datenow
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 30px;
  /*overflow: auto;*/
  white-space: nowrap;
}
/deep/ .el-form .el-form-item--mini.el-form-item {
  margin-bottom: 5px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #151516;
}
/deep/ .el-textarea.is-disabled .el-textarea__inner {
  color: #151516;
}
/deep/ .el-range-editor.is-disabled input {
  color: #151516;
}
/deep/ .el-range-editor.is-disabled .el-range-separator {
  color: #151516;
}
</style>
