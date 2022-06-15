<template>
  <div class="dept">
    <el-tabs v-model="activeName" @tab-click="handleClick" v-show="!detailShow">
      <el-tab-pane label="群发短信" name="msg">
        <el-form :model="qfForm" label-width="140px" ref="qfForm">
          <el-form-item label="自动发送短信：">
            <el-alert title="" type="info" :closable="false">
              提示：单条短信最多54个字(含标点符号)，内容最长不能超过185个字。支持长短信，55个字至118个字系统将以2条短信计费。119个字至185个字系统将以3条短信计费，但在发送对象手机上仍以一条显示。适合给客人发送通知，节假日祝福信息等。
              尊敬的客户，由于中国信息产业部对垃圾短信的严厉打击，所以现在群发短信必须先将手机号码提交给中国移动中心报备（由系统平台客服代办，办理时间两天左右，报备通过后客服将通知您发送！客服电话：0755-28288128）
            </el-alert>
          </el-form-item>
          <el-form-item label="发送对象：">
            <el-button @click="objAlert">选择发送对象</el-button>
            <explain>发送对象为空时默认为全部会员。</explain>
          </el-form-item>
          <el-form-item label="自动称谓：">
            <el-radio v-model="qfForm.addcw" label="1">加称谓</el-radio>
            <el-radio v-model="qfForm.addcw" label="2">不加称谓</el-radio>
          </el-form-item>
          <el-form-item
            prop="messageContent"
            :rules="{
              required: true,
              min: 2,
              max: 128,
              message: '亲,至少要输入两个字',
              trigger: 'blur'
            }"
            label="短信内容：">
            <el-input
              v-model="qfForm.messageContent"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              style="width: 50%" />
          </el-form-item>
          <el-form-item label="发送时间：">
            <el-radio v-model="qfForm.sendtype" label="1">立即发送</el-radio>
            <el-radio v-model="qfForm.sendtype" label="2">定时发送</el-radio>

            <el-date-picker
              v-model="qfForm.sendtime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendmessage">确定发送</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="服务项目回访短信模板" name="temp">
        <el-button @click="tempAlert" type="primary">新增</el-button>

        <yid-table
          pagination
          ref="mbTable"
          style="margin-top: 15px"
          :data="modelAddForm.tempData">
          <yid-table-column
            label="模板编号"
            min-width="100"
            prop="id"></yid-table-column>
          <yid-table-column
            label="短信内容"
            min-width="150"
            prop="scontent"></yid-table-column>
          <yid-table-column
            label="部门"
            min-width="150"
            prop="branchname"></yid-table-column>
          <yid-table-column
            label="对应类别"
            min-width="150"
            prop="servnames"></yid-table-column>
          <yid-table-column label="发送时间" min-width="150" prop="afterDay">
            <template slot-scope="scope">
              消费完成 {{ scope.row.afterDay }} 天后
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>
      <el-tab-pane label="会员生日自动提醒" name="remind">
        <el-form label-width="140px" ref="birthdayFrom">
          <el-form-item label="自动发送短信：">
            <el-switch
              v-model="birthdayFrom.autosend"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="祝福短信内容：">
            <el-input
              v-model="birthdayFrom.autoMessage"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              style="width: 50%">
            </el-input>
          </el-form-item>
          <el-form-item style="color: #666">
            <p>
              生日祝福短信最多54个字,短信内容不必包含称谓,系统会自动组合称谓，比如：'尊敬的刘小姐:'，'尊敬的张先生:'
            </p>
            <p>设置示例:</p>
            <p>
              愿将一切最美好的祝愿都送给您，VMOD
              SALON全员祝您：生日快乐！人生幸福美满，永浴欢乐年华！越活越年轻越来越漂亮。
            </p>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="saveAuto">确认设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="短信发送记录" name="logs">
        <el-form inline ref="sendRecord">
          <el-form-item label="门店：">
            <el-select
              clearable
              @clear="clearFormShop"
              @blur="clearFormShop"
              v-model.trim="sendRecord.shopid"
              filterable
              :filter-method="filterShop"
              placeholder="请选择"
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
          <el-form-item label="短信类型:">
            <el-select v-model="sendRecord.typeValue">
              <el-option
                v-for="item in sendRecord.typeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送时间段:">
            <el-date-picker
              v-model="sendRecord.datasrc"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <br />
          <el-form-item label="发送状态:">
            <el-select v-model="sendRecord.statusValue">
              <el-option
                v-for="item in sendRecord.statusoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码:">
            <el-input v-model="sendRecord.mobile" />
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" @click="queryRecord">查询</el-button>
          </el-form-item>
        </el-form>
        <el-alert title="" type="info" :closable="false">
          本次查询已发送短信 <span style="color: red">321</span> 条
        </el-alert>
        <yid-table
          pagination
          ref="sendTable"
          style="margin-top: 15px"
          :data="sendRecord.recordData">
          <yid-table-column
            label="发送对象（号码数）"
            min-width="150"
            prop="object">
            <template slot-scope="scope">
              <span v-if="scope.row.ptype == 1"
                >会员顾客({{ scope.row.sendcount }})</span
              >
              <span v-if="scope.row.ptype == 2"
                >员工({{ scope.row.sendcount }})</span
              >
              <span v-if="scope.row.ptype == 3"
                >自定义({{ scope.row.sendcount }})</span
              >
            </template>
          </yid-table-column>
          <yid-table-column label="发送状态" min-width="100" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">待发送</span>
              <span v-if="scope.row.status == 1">发送中</span>
              <span v-if="scope.row.status == 2">已发送</span>
              <span v-if="scope.row.status == 3">取消发送</span>
            </template>
          </yid-table-column>

          <yid-table-column label="短信内容" min-width="350" prop="scontent">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet == 1">
                <el-input
                  size="mini"
                  v-model="sendRecord.newConnet"
                  placeholder="请输入内容">
                </el-input>
              </span>
              <span v-else>{{ scope.row.scontent }}</span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="短信条数"
            min-width="150"
            prop="total"></yid-table-column>
          <yid-table-column label="操作" min-width="250" prop="content">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                v-if="scope.row.status == 0"
                @click="deleteTask(scope.row.id)"
                >取消发送</el-link
              >

              <el-link
                style="margin: 0 10px 0 10px"
                v-if="scope.row.status == 0"
                type="primary"
                @click="contentChange(scope.row, scope.$index, true)">
                {{ scope.row.isSet ? '保存' : '修改' }}
              </el-link>

              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="replyAlert(scope.row.id)"
                >回复记录</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </el-tab-pane>

      <el-tab-pane label="短信充值" name="charging">
        <MsgPay />
      </el-tab-pane>

      <el-tab-pane label="短信分配" name="assign">
        <MsgAssign />
      </el-tab-pane>

      <el-tab-pane label="短信统计" name="statistics">
        <MsgStatistics />
      </el-tab-pane>
    </el-tabs>

    <yid-dialog
      :title="tempDialog.title"
      :visible.sync="tempDialog.visible"
      @close=""
      width="600px">
      <el-form :model="modelAddForm" label-width="140px" ref="modelAddForm">
        <el-form-item label="编号："> 自动生成 </el-form-item>
        <el-form-item
          prop="modelText"
          label="模板内容"
          :rules="{
            required: true,
            min: 2,
            max: 128,
            message: '亲,至少要输入两个字',
            trigger: 'blur'
          }">
          <el-input
            name="modelText"
            type="textarea"
            v-model="modelAddForm.modelText"
            :rows="4"
            placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <el-form-item label="对应类别：">
          <el-select
            @change="modelchangedep"
            v-model="modelAddForm.modelbranchid"
            placeholder="请选择部门">
            <el-option
              v-for="item in modelAddForm.branchdepoptions"
              :key="item.id"
              :label="item.bname"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            placeholder="服务类别（可多选）"
            multiple
            v-model.trim="modelAddForm.modelservice"
            @change="selectGetFn"
            style="margin-left: 20px">
            <el-option
              v-for="item in modelAddForm.servicetypes"
              :key="item.id"
              :label="item.sname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间：">
          消费完成
          <el-input-number
            type="text"
            v-model="modelAddForm.xfday"
            :min="1"
            :max="10" />
          天后
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savemodeltempclose">保存</el-button>
          <el-button @click="modeltempclose">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>

    <yid-dialog
      title="回复记录"
      :visible.sync="replyDialog.visible"
      @close=""
      width="600px">
      <el-alert type="info" :closable="false"></el-alert>
      <yid-table
        pagination
        ref="table"
        style="margin-top: 15px"
        :data="replyData">
        <yid-table-column
          label="回复时间"
          min-width="33%"
          prop="time"></yid-table-column>
        <yid-table-column
          label="回复人"
          min-width="33%"
          prop="mobile"></yid-table-column>
        <yid-table-column
          label="回复内容"
          min-width="34%"
          prop="mcontent"></yid-table-column>
      </yid-table>
    </yid-dialog>

    <yid-dialog
      title="发送明细"
      :visible.sync="detailDialog.visible"
      @close=""
      width="600px">
      <el-alert type="info" :closable="false">
        <div>群发短信</div>
        <div>会员顾客：233</div>
      </el-alert>
      <yid-table
        pagination
        ref="table"
        style="margin-top: 15px"
        :data="detailData">
        <yid-table-column
          label="姓名"
          min-width="50%"
          prop="name"></yid-table-column>
        <yid-table-column
          label="手机号"
          min-width="50%"
          prop="phone"></yid-table-column>
      </yid-table>
    </yid-dialog>

    <yid-dialog
      title="选择发送对象"
      :visible.sync="objDialog.visible"
      @close=""
      width="750px">
      <el-form :model="tempDialog.model" label-width="120px" ref="copyForm">
        <el-form-item label="类型：">
          <el-select v-model="typeValue">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="typeValue == 1">
          <el-form-item label="是否办卡：">
            <el-radio-group v-model="qfForm.isBk">
              <el-radio label="1">未办卡</el-radio>
              <el-radio label="2">全部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卡类：">
            <el-select v-model="qfForm.ptype">
              <el-option
                v-for="item in qfForm.cardtypeobj"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="最少消费次数：">
            <el-input-number
              :min="0"
              :max="10"
              v-model="qfForm.xfcs"
              style="width: 70%" />
          </el-form-item>
          <el-form-item label="最少消费总额：">
            <el-input type="text" v-model="qfForm.xfze" style="width: 70%" />
          </el-form-item>
          <el-form-item label="消费日期区段：">
            <el-date-picker
              v-model="qfForm.datasrc"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="typeValue == 2">
          <el-form-item label="部门：">
            <el-select
              @change="changedep"
              v-model="qfForm.branchid"
              placeholder="请选择">
              <el-option
                v-for="item in qfForm.branchdepoptions"
                :key="item.id"
                :label="item.bname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-transfer
              v-model="qfForm.selectemployees"
              :data="qfForm.employees"
              :props="{
                key: 'id',
                label: 'eename'
              }"
              :titles="['可选员工', '已选员工']"
              :button-texts="['删除', '选择']"></el-transfer>
          </el-form-item>
        </template>
        <template v-if="typeValue == 3">
          <el-form-item label="群发号码：">
            <el-input
              v-model="qfForm.sendtels"
              type="textarea"
              :rows="4"
              placeholder="请在框中输入你要发送的手机号，手机之间用逗号或换行回车符分开">
            </el-input>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button @click="tempCancel" type="primary">保存</el-button>
          <el-button @click="tempCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '../../service'
import MsgAssign from './components/msgAssign'
import MsgPay from './components/msgPay'
import MsgStatistics from './components/msgStatistics'
export default {
  name: 'dept',
  components: {
    MsgAssign,
    MsgPay,
    MsgStatistics
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      form: {},
      knowledge: [],

      activeName: 'msg',
      typeValue: 1,

      sendRecord: {
        recordData: [
          /*   {
                            object: '会员顾客 （332）',
                            status: '待发送',
                            time: '58分钟后',
                            content: '愿将一切最美好的祝愿都送给您，VMOD SALON全员祝您：生日快乐！人生幸福美满，永浴欢乐年华！越活越年轻越来越漂亮。',
                            number: 1
                        }*/
        ],
        typeoptions: [
          {
            value: '',
            label: '所有'
          },
          {
            value: 1,
            label: '会员顾客'
          },
          {
            value: 2,
            label: '员工'
          },
          {
            value: 3,
            label: '自定义号码'
          }
        ],
        datasrc: '',
        shopid: '',
        typeValue: '',

        mobile: '',
        statusValue: '',
        statusoptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 0,
            label: '待发送'
          },
          {
            value: 1,
            label: '发送中'
          },
          {
            value: 2,
            label: '已发送'
          }
        ],

        replyData: [
          {
            time: '2020-1-12 13:29:30',
            person: '杨阳洋  18647362472',
            content: 'x休闲鞋'
          }
        ]
      },

      options: [
        {
          value: 1,
          label: '会员顾客'
        },
        {
          value: 2,
          label: '员工'
        },
        {
          value: 3,
          label: '自定义号码'
        }
      ],

      tempDialog: {
        title: '',
        visible: false
      },
      replyDialog: {
        title: '',
        visible: false
      },
      detailDialog: {
        title: '',
        visible: false
      },
      objDialog: {
        title: '',
        visible: false
      },

      modelAddForm: {
        modelbranchid: '0',
        modelservice: '',
        modelText: '',
        xfday: 1,
        modelbranchname: '',
        branchdepoptions: [],
        servicetypes: [],
        servids: '',
        servnames: '',
        tempData: [],
        newConnet: ''
      },

      qfForm: {
        ptype: '1',
        cardtypeobj: [
          {
            value: '1',
            label: '储值卡'
          },
          {
            value: '2',
            label: '资格卡'
          }
        ],
        xfcs: 0,
        xfze: 0,
        datasrc: '',
        sendtype: '1',
        sendtime: '',
        branchid: '0',
        branchdepoptions: [],
        employees: [],

        selectemployees: [],
        sendtels: '',
        addcw: '1',
        messageContent: '',
        isBk: ''
      },

      modelbranchid: '0',
      modelservice: '',
      detailData: [
        {
          name: '杨阳洋',
          phone: '18647362472'
        }
      ],
      value1: '',
      birthdayFrom: {
        id: '',
        autosend: false,
        autoMessage: ''
      },
      chargingList: [],

      worksNameArr: '',

      pageInfo: { page: 1, limit: 20 },
      allShopList: [],
      filterShopList: []
    }
  },

  mounted() {
    console.log('部门')

    const params = { status: '1', isDel: '0' }
    yid.service.sms
      .getBranchByTenantId(params)
      .then(res => {
        // 存储登录信息到本地缓存
        console.log('sssss', res.data)
        let firstAll = { id: '0', bname: '请选择' }
        res.data.unshift(firstAll)
        this.qfForm.branchdepoptions = res.data
      })
      .catch(res => {})
    yid.service.sms
      .getBranchByTenantId2(params)
      .then(res => {
        // 存储登录信息到本地缓存
        console.log('ssssschain', res.data)
        let firstAll = { id: '0', bname: '请选择' }
        res.data.unshift(firstAll)
        this.modelAddForm.branchdepoptions = res.data
      })
      .catch(res => {})

    this.getShopList()
  },

  methods: {
    contentChange(row, index, cg) {
      if (row.isSet == false) {
        row.isSet = true
      } else {
        let pm = { id: row.id, scontent: this.sendRecord.newConnet }
        yid.service.sms
          .updateTaskConnetById(pm)
          .then(res => {
            row.scontent = this.sendRecord.newConnet
          })
          .catch(res => {})
        row.isSet = false
      }
    },
    queryRecord() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.sendTable.Pagination.internalPageSize
      const reqParams = {
        shopid: this.sendRecord.shopid,
        status: this.sendRecord.statusValue,
        mobile: this.sendRecord.mobile,
        ptype: this.sendRecord.typeValue
      }
      const params = { ...this.pageInfo, ...reqParams }
      const fetch = yid.service.sms.getSmsRecordList

      this.$refs.sendTable.reloadData({
        fetch,
        params
      })
    },
    levelDelete() {},
    selectGetFn(val) {
      this.tempsid = ''
      this.tempsname = ''
      for (let i = 0; i <= val.length - 1; i++) {
        this.modelAddForm.servicetypes.find(item => {
          //这里的options就是数据源
          if (item.id == val[i]) {
            this.tempsid += item.id + ','
            this.tempsname += item.sname + ','
          }
        })
      }
      var reg = /,$/gi
      this.modelAddForm.servids = this.tempsid.replace(reg, '')
      this.modelAddForm.servnames = this.tempsname.replace(reg, '')
    },

    changedep() {
      let params = { bbid: this.qfForm.branchid, status: '1' }
      console.log('sssss')
      yid.service.sms
        .getemployeeByBranhid(params)
        .then(res => {
          // 存储登录信息到本地缓存
          console.log('部门下的员工', res.data)
          console.log('employees', this.qfForm.employees)
          this.qfForm.employees = res.data
        })
        .catch(res => {})
    },

    modelchangedep(val) {
      console.log('下拉val', val)
      let obj = {}
      obj = this.modelAddForm.branchdepoptions.find(item => {
        return item.id === val
      })

      this.modelAddForm.modelbranchname = obj.bname

      this.modelservice = ''
      let params = { branch: this.modelAddForm.modelbranchid }
      yid.service.sms
        .getServiceTypeeByBranhid2(params)
        .then(res => {
          // 存储登录信息到本地缓存
          console.log('部门下项目分类', res.data)
          this.modelAddForm.servicetypes = res.data
        })
        .catch(res => {})
    },
    saveAuto() {
      console.log('这里调用自动发送', this.birthdayFrom.autosend)

      let autovalue = 0
      if (this.birthdayFrom.autosend) {
        autovalue = 1
      } else {
        autovalue = 0
      }

      let birthdayParm = {
        id: this.birthdayFrom.id,
        isAuto: autovalue,
        scontent: this.birthdayFrom.autoMessage
      }

      yid.service.sms
        .saveBirthdaySms(birthdayParm)
        .then(res => {
          console.log('ddd', res.data)
        })
        .catch(res => {})
    },
    sendmessage() {
      console.log('按会员发送', this.qfForm.datasrc)

      this.$refs.qfForm.validate(valid => {
        if (valid) {
          console.log('验证通过', this.qfForm.datasrc)
          console.log('typeValue', this.typeValue)

          let params = {
            isAutoName: this.qfForm.addcw,
            scontent: this.qfForm.messageContent,
            ptype: this.typeValue,
            ttype: this.qfForm.sendtype,
            sentTime: this.qfForm.sendtime
          }

          if (this.typeValue == 1) {
            console.log('按会员发送', this.qfForm.datasrc)
            params.cardId = this.qfForm.ptype
            params.minSerNum = this.qfForm.xfcs
            params.minMoney = this.qfForm.xfze
            if (this.qfForm.datasrc != '') {
              params.stime = this.qfForm.datasrc[0]
              params.etime = this.qfForm.datasrc[1]
            }

            let qobjparrm = {
              cardId: this.qfForm.ptype,
              minSerNum: this.qfForm.xfcs,
              minMoney: this.qfForm.xfze
            }
            if (this.qfForm.datasrc != '') {
              qobjparrm.stime = this.qfForm.datasrc[0]
              qobjparrm.etime = this.qfForm.datasrc[1]
            }

            yid.service.sms
              .findConditionSms(qobjparrm)
              .then(res => {
                params.memberVos = res.data

                if (res.data.length == 0) {
                  this.$message({
                    type: 'error',
                    message: '这是一个无效的群发,没有找到条件的会员'
                  })

                  return
                }
                yid.service.sms
                  .sendSmsMessage(params)
                  .then(res => {
                    this.$message({ type: 'success', message: '已成功执行' })
                  })
                  .catch(res => {})
              })
              .catch(res => {})
          }
          if (this.typeValue == 2) {
            params.branchid = this.branchid
            //   params.selectemployees = this.qfForm.selectemployees;
            console.log('selectemployees', this.qfForm.selectemployees)

            yid.service.sms
              .getAllByIds(this.qfForm.selectemployees)
              .then(res => {
                console.log('ids', res.data)

                params.employeeVos = res.data

                if (res.data.length == 0) {
                  this.$message({
                    type: 'error',
                    message: '这是一个无效的群发,没有找到条件的员工'
                  })

                  return
                }
                console.log('提交的', params)
                yid.service.sms
                  .sendSmsMessage(params)
                  .then(res => {
                    this.$message({ type: 'success', message: '已成功执行' })
                  })
                  .catch(res => {})
              })
              .catch(res => {})
          }
          if (this.typeValue == 3) {
            params.tels = this.qfForm.sendtels
            yid.service.sms
              .sendSmsMessage(params)
              .then(res => {
                if (this.qfForm.sendtels == '') {
                  this.$message({
                    type: 'error',
                    message: '这是一个无效的群发,请确认输入了自定义的号码'
                  })
                  return
                }

                this.$message({ type: 'success', message: '已成功执行' })
              })
              .catch(res => {})
          }
        } else {
          console.log('验证不通过')
          return false
        }
      })
    },
    tempAlert(tag = false) {
      this.tempDialog.title = '项目回访短信模板'
      this.tempDialog.visible = true
    },
    modeltempclose(tag = false) {
      // this.tempDialog.title = '项目回访短信模板';
      this.tempDialog.visible = false
    },
    savemodeltempclose(tag = false) {
      this.$refs.modelAddForm.validate(valid => {
        if (valid) {
          let parm = {
            servnames: this.modelAddForm.servnames,
            servids: this.modelAddForm.servids,
            scontent: this.modelAddForm.modelText,
            afterDay: this.modelAddForm.xfday,
            branchid:
              this.modelAddForm.modelbranchid == '0'
                ? ''
                : this.modelAddForm.modelbranchid,
            branchname: this.modelAddForm.modelbranchname,
            isDel: '0'
          }
          yid.service.sms
            .savesmsreturn(parm)
            .then(res => {
              this.$message({ type: 'success', message: '已成功执行' })
              this.tempDialog.visible = false
              const returnparams = { page: 1, limit: 20 }
              yid.service.sms
                .getSmsreturnPage(returnparams)
                .then(res => {
                  // 存储登录信息到本地缓存
                  console.log('sssss', res.data)
                  this.modelAddForm.tempData = res.data
                })
                .catch(res => {})
            })
            .catch(res => {})

          console.log('验证通过')
        } else {
          console.log('验证不通过')
          return false
        }
      })
    },
    tempCancel() {
      //   this.objDialog.visible = true;
      this.objDialog.visible = false
    },
    objAlert() {
      this.objDialog.visible = true
    },
    jobDelete() {
      $yid.util.confirm('你确定要删除此条数据吗？', '', '', () => {})
    },
    replyAlert(id) {
      this.replyDialog.visible = selmodel
      let params = { page: 1, limit: 20, ptid: id }

      yid.service.sms
        .getstaskreply(params)
        .then(res => {
          // 存储登录信息到本地缓存
          this.replyData = res.data
          //     console.log("记录",res.data)
        })
        .catch(res => {})
    },
    deleteTask(id) {
      console.log('id', id)
      $yid.util.confirm('你确定要删除此条数据吗？', '', '', () => {
        yid.service.sms
          .deleteTaskByID(id)
          .then(res => {
            // 存储登录信息到本地缓存
            console.log('res', res)
            this.$message({ type: 'success', message: '已成功执行' })

            this.queryRecord()

            /*const smsRecordParams = {page:1,limit:20}
                        yid.service.sms.getSmsRecordList(smsRecordParams).then(res => {
                            // 存储登录信息到本地缓存
                            console.log("记录",res.data)
                            this.sendRecord.recordData=res.data


                        }).catch((res)=> {

                        });*/
          })
          .catch(res => {})
      })
    },

    handleClick(tab, event) {
      console.log('tab.name', tab.name)
      if (tab.name == 'temp') {
        //第二个
        /*const returnParams = {page:1,limit:20}
                    yid.service.sms.getSmsreturnPage(returnParams).then(res => {
                        // 存储登录信息到本地缓存
                        console.log("模板的",res.data)
                        this.modelAddForm.tempData=res.data

                    }).catch((res)=> {

                    });*/
        this.pageInfo.page = 1
        this.pageInfo.limit = this.$refs.mbTable.Pagination.internalPageSize
        const fetch = yid.service.sms.getSmsreturnPage
        const params = this.pageInfo
        this.$refs.mbTable.reloadData({
          fetch,
          params
        })
      }
      if (tab.name == 'remind') {
        //第三个
        yid.service.sms
          .getBirthdaySms()
          .then(res => {
            // 存储登录信息到本地缓存
            console.log('sssss', res.data)
            this.birthdayFrom.id = res.data.id
            if (res.data.isAuto == '1') {
              this.birthdayFrom.autosend = true
            } else {
              this.birthdayFrom.autosend = false
            }
            this.birthdayFrom.autoMessage = res.data.scontent
          })
          .catch(res => {})
      }
      if (tab.name == 'logs') {
        //第四个
        this.queryRecord()

        /*const smsRecordParams = {page:1,limit:20}
                    yid.service.sms.getSmsRecordList(smsRecordParams).then(res => {
                        // 存储登录信息到本地缓存
                        console.log("记录",res.data)

                        this.sendRecord.recordData=res.data


                    }).catch((res)=> {

                    });*/
      }
      if (tab.name == 'charging') {
        const chargingParams = { page: 1, limit: 20 }
        yid.service.sms
          .getCharging(chargingParams)
          .then(res => {
            // 存储登录信息到本地缓存
            console.log('记录', res.data)
            this.chargingList = res.data
          })
          .catch(res => {})

        //第五个
      }
      if (tab.name == 'msg') {
        //第一个
      }
    },
    getShopList() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    clearFormShop() {
      setTimeout(() => {
        if (this.sendRecord.shopid == '') {
          this.sendRecord.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  background: #e5e9f2;
  padding: 15px 20px;
  text-align: center;
  font-size: 16px;
  color: #969896;
  .b {
    font-size: 20px;
    color: #1e2332;
  }
}
</style>
