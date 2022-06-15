<template>
  <div>
    <el-page-header
      @back="closePaySettingPage"
      :content="title"></el-page-header>
    <el-tabs v-model="tabsValue">
      <el-tab-pane label="支付方式费率设置" name="rate"
        ><PayRateSetting ref="payRateSettingPage"
      /></el-tab-pane>
      <el-tab-pane label="业务类别付款设置" name="business"
        ><PayBusinessSetting ref="payBusinessPage"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PayRateSetting from './payRateSetting'
import PayBusinessSetting from './payBusinessSetting'
export default {
  name: 'paySetting',
  components: {
    PayRateSetting,
    PayBusinessSetting
  },
  data() {
    return {
      tabsValue: 'rate',
      payTheadId: ''
    }
  },
  methods: {
    async initData(data) {
      this.payTheadId = data.id
      this.$refs.payRateSettingPage.initData(data)
      this.$refs.payBusinessPage.initData(data)
    },
    closePaySettingPage() {
      this.$emit('onClose')
    }
  }
}
</script>

<style scoped></style>
