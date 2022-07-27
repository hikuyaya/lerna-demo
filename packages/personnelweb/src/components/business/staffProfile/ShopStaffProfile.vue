<!--
 * @Author: wqy
 * @Date: 2022-07-14 17:34:04
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-27 14:55:10
 * @FilePath: \personnelweb\src\components\business\staffProfile\ShopStaffProfile.vue
 * @Description: 门店员工资料维护新增、修改
-->
<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="100px">
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="选择员工" prop="staffInfo">
            <el-input disabled v-model="staffInfo"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="operateType !== 'detail'" :span="4" class="mg-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseStaffVisible = true"></el-button>
        </el-col>
      </el-row>
      <title-header title="基本信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="姓名" prop="eeName">
            <el-input v-model="info.eeName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="别名" prop="aliasName">
            <el-input v-model="info.aliasName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="info.sex" disabled class="w100">
              <el-option
                v-for="(item, index) in sexOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="籍贯" prop="origin">
            <el-input v-model="info.origin" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="info.birthday"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              style="width: calc(100% - 80px)"
              disabled>
            </el-date-picker>
            <el-input-number
              v-model="info.age"
              :controls="false"
              :min="1"
              :max="120"
              style="width: 50px; margin-left: 4px"
              disabled></el-input-number
            >&nbsp;岁
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="民族" prop="ethnic">
            <el-input v-model="info.ethnic" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="证件类型" prop="cardType">
            <el-select v-model="info.cardType" filterable disabled class="w100">
              <el-option
                v-for="item in cardTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号" prop="cardNumber">
            <el-input v-model="info.cardNumber" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件有效期" prop="cardTermValidity">
            <el-date-picker
              v-model="info.cardTermValidity"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              class="w100"
              :disabled="operateType === 'detail'">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="家庭地址" prop="address">
            <el-input v-model="info.address" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="info.mobile" :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急联系人" prop="emcontacts">
            <el-input v-model="info.emcontacts" :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="常用邮箱" prop="email">
            <el-input v-model="info.email" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="健康证有效期" prop="healthdate">
            <el-date-picker
              v-model="info.healthdate"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              class="w100"
              :disabled="operateType === 'detail'">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急人电话" prop="emtel">
            <el-input v-model="info.emtel" :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <title-header title="账户信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="开户银行" ref="bankCode" prop="bankCode">
            <el-select
              v-model="info.bankCode"
              filterable
              clearable
              class="w100"
              :disabled="operateType === 'detail'">
              <el-option
                v-for="item in bankData"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行卡号" ref="bankAccount" prop="bankAccount">
            <el-input v-model="info.bankAccount" :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户人" prop="accountname">
            <el-input v-model="info.accountname" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="社保卡号" prop="ssaccount">
            <el-input v-model="info.ssaccount" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否股东" prop="shareholder">
            <el-radio-group v-model="info.shareholder" :disabled="operateType === 'detail'">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分红帐号" prop="fhaccount">
            <el-input v-model="info.fhaccount" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="附件信息" />
      <div class="flex mg-t-12">
        <!-- <img-item title="大头照" :url.sync="url"></img-item> -->
        <template v-if="!hasPhoto && operateType === 'detail'">
          未上传附件
        </template>
        <template v-else>
          <img-item
            title="大头照"
            v-if="!(operateType === 'detail' && !info.photo)"
            :operateType="operateType"
            :allowReupload="false"
            :url.sync="info.photo"></img-item>
          <img-item
            title="身份证正面"
            v-if="!(operateType === 'detail' && !info.idphoto1)"
            :operateType="operateType"
            :url.sync="info.idphoto1"></img-item>
          <img-item
            title="身份证反面"
            v-if="!(operateType === 'detail' && !info.idphoto2)"
            :operateType="operateType"
            :url.sync="info.idphoto2"></img-item>
          <img-item
            title="银行卡正面"
            v-if="!(operateType === 'detail' && !info.idphoto3)"
            :operateType="operateType"
            :url.sync="info.idphoto3"></img-item>
          <img-item
            title="健康证"
            v-if="!(operateType === 'detail' && !info.idphoto4)"
            :operateType="operateType"
            :url.sync="info.idphoto4"></img-item>
          <img-item
            title="毕业证"
            v-if="!(operateType === 'detail' && !info.idphoto5)"
            :operateType="operateType"
            :url.sync="info.idphoto5"></img-item>
        </template>
      </div>
    </el-form>
    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <choose-single-item
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseSingleStaffActionUrl"
        :conditions="chooseStaffConditions"
        @select="handleSelectStaff"></choose-single-item>
    </el-dialog>
  </div>
</template>

<script>
import TitleHeader from '@src/components/base/TitleHeader'
import ChooseSingleItem from '@src/components/business/ChooseSingleItem.vue'
import ImgItem from './ImgItem'
import { getAge } from '@src/library/helper/util'
import { scrollToError } from '@src/library/helper/business'
import service from '@src/service'

export default {
  components: { TitleHeader, ImgItem, ChooseSingleItem },
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    operateType: {
      type: String
    },
    treeData: {
      type: Array
    },
    educationData: {
      type: Array
    },
    bankData: {
      type: Array
    },
    inductionwayData: {
      type: Array
    }
  },
  computed: {
    hasPhoto: function () {
      return (
        this.info.photo ||
        this.info.idphoto1 ||
        this.info.idphoto2 ||
        this.info.idphoto3 ||
        this.info.idphoto4 ||
        this.info.idphoto5
      )
    },
    staffInfo: function () {
      console.log(346, this.info.eeCode)
      if (this.info.eeCode) {
        const name = this.info.eeName + '-' + this.info.eeCode
        this.$set(this.info, 'staffInfo', name)
        return name
      }
      return ''
    }
  },
  data() {
    const validateIdCard = (rule, value, callback) => {
      // 等于身份证时进行身份证合法性校验
      if (this.info.cardType === 1) {
        const reg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('身份证格式不正确'))
        }
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else {
        const reg = new RegExp(/^1[3456789]\d{9}$/)
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入11位手机号'))
        }
      }
    }
    return {
      chooseStaffVisible: false,
      info: {},
      staff: {}, // 选择人员相关
      rules: {
        staffInfo: [{ required: true, message: '请选择人员' }],
        psname: [{ required: true, message: '请选择人员' }],
        userName: [{ required: true, message: '请输入姓名' }],
        eeName: [{ required: true, message: '请输入姓名' }],
        sex: [{ required: true, message: '请选择性别' }],
        origin: [{ required: true, message: '请输入籍贯' }],
        birthday: [{ required: true, message: '请选择出生日期' }],
        ethnic: [{ required: true, message: '请输入名族' }],
        cardType: [{ required: true, message: '请选择证件类型' }],
        cardNumber: [{ required: true, validator: validateIdCard }],
        cardTermValidity: [{ required: true, message: '请选择证件有效期' }],
        address: [{ required: true, message: '请输入家庭地址' }],
        mobile: [{ required: true, validator: validateMobile }],
        educode: [{ required: true, message: '请选择学历' }],
        graduated: [{ required: true, message: '请输入毕业院校' }],
        shareholder: [{ required: true, message: '请选择' }],
        entrydate: [{ required: true, message: '请选择入职日期' }]
      },
      cardTypeOptions: [
        { label: '身份证', value: 1 },
        { label: '护照', value: 2 },
        { label: '其他', value: 3 }
      ],
      sexOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      chooseSingleStaffActionUrl: service.staff.shop.getListByLoginUser,
      chooseStaffColumns: [
        { prop: 'eename', label: '员工姓名' },
        { prop: 'eecode', label: '编码' },
        { prop: 'shopcode', label: '机构编码' },
        { prop: 'shopname', label: '机构名称' },
        { prop: 'psname', label: '职务' },
        {
          prop: 'status',
          label: '状态',
          render: row => {
            if (row.status == 1) {
              return '在职'
            } else if (row.status == 2) {
              return '离职'
            } else {
              return '其他'
            }
          }
        }
      ],
      chooseStaffConditions: [
        {
          label: '员工姓名', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '30%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input', // 搜索类型
          width: '30%'
        }
      ]
    }
  },
  methods: {
    async handleSelectStaff(selectRow) {
      console.log(selectRow)
      const { data } = await service.staff.profile.detail(selectRow.eecode)
      this.chooseStaffVisible = false
      this.staff = Object.assign({}, selectRow)
      this.info = {
        ...this.info,
        ...data
      }
    },
    async getData() {
      const result = await this.$refs.form.validate().catch(err => {
        scrollToError()
      })
      if (result) {
        return {
          ...this.info
        }
      }
    },
    bankValidate() {
      if (!this.rules.hasOwnProperty('bankAccount')) {
        const bankAccount = [
          { required: true, message: '请输入银行卡号', trigger: 'change' }
        ]
        this.$set(this.rules, 'bankAccount', bankAccount)
      }
      if (!this.rules.hasOwnProperty('bankCode')) {
        const bankCode = [
          { required: true, message: '请选择开户银行', trigger: 'change' }
        ]
        this.$set(this.rules, 'bankCode', bankCode)
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    'info.birthday': {
      handler: function (val) {
        if (!val) {
          // 点击清空时
          this.$set(this.info, 'age', undefined)
        } else {
          // 正常选择时
          const birth = new Date(val).formatDate().split('-')
          console.log(birth)
          const age = getAge(birth)?.[0]
          this.$set(this.info, 'age', age)
        }
      }
    },
    'info.bankCode': {
      handler: function (val) {
        if (
          (val && !this.info.bankAccount) ||
          (!val && this.info.bankAccount) ||
          (val && this.info.bankAccount)
        ) {
          this.bankValidate()
        } else {
          this.$delete(this.rules, 'bankAccount')
          this.$delete(this.rules, 'bankCode')
          this.$refs.bankAccount.clearValidate()
        }
      }
    },
    'info.bankAccount': {
      handler: function (val) {
        if (
          (val && !this.info.bankCode) ||
          (!val && this.info.bankCode) ||
          (val && this.info.bankCode)
        ) {
          this.bankValidate()
        } else {
          this.$delete(this.rules, 'bankAccount')
          this.$delete(this.rules, 'bankCode')
          this.$refs.bankCode.clearValidate()
        }
      }
    }
  }
}
</script>
