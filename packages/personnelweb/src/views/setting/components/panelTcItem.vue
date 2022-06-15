<template>
  <div>
    <el-row
      style="background-color: #f5f7fa; line-height: 30px; padding-left: 15px">
      <label>类型：</label>
      <el-radio v-model="itemtype" label="1" v-show="prtcode == '001'"
        >提成项</el-radio
      >
      <el-radio v-model="itemtype" label="2" v-show="prtcode == '001'"
        >服务项目</el-radio
      >
      <el-radio v-model="itemtype" label="3" v-show="prtcode == '005'"
        >提成项</el-radio
      >
      <el-radio v-model="itemtype" label="4" v-show="prtcode == '005'"
        >外卖产品</el-radio
      >
      <el-radio v-model="itemtype" label="5" v-show="prtcode == '002'"
        >提成项</el-radio
      >
      <el-radio v-model="itemtype" label="6" v-show="prtcode == '002'"
        >套餐</el-radio
      >
      <el-radio v-model="itemtype" label="7" v-show="prtcode == '003'"
        >提成项</el-radio
      >
      <el-radio v-model="itemtype" label="8" v-show="prtcode == '003'"
        >资格卡类型</el-radio
      >
      <el-radio v-model="itemtype" label="9" v-show="prtcode == '004'"
        >提成项</el-radio
      >
      <el-radio v-model="itemtype" label="10" v-show="prtcode == '004'"
        >储值卡类型</el-radio
      >
      <el-radio v-model="itemtype" label="11" v-show="prtcode == '006'"
        >提成项</el-radio
      >
      <el-radio v-model="itemtype" label="12" v-show="prtcode == '001'"
        >服务项目分类</el-radio
      >
      <el-radio v-model="itemtype" label="13" v-show="prtcode == '005'"
        >外卖产品分类</el-radio
      >
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '1'">
      <tree-royalty-norm
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="001"
        :defaultCheckedKeys="defaultCheckedKeys"
        :normList="treeData"
        ref="fwyj"></tree-royalty-norm>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '2'">
      <tree-service
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="001"
        ref="serv"
        :defaultCheckedKeys="defaultCheckedKeys"></tree-service>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '3'">
      <tree-royalty-norm
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="005"
        :defaultCheckedKeys="defaultCheckedKeys"
        :normList="treeData"
        ref="wmyj"></tree-royalty-norm>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '4'">
      <tree-product
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="005"
        ref="prod"
        :defaultCheckedKeys="defaultCheckedKeys"></tree-product>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '5'">
      <tree-royalty-norm
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="002"
        :defaultCheckedKeys="defaultCheckedKeys"
        :normList="treeData"
        ref="taocanyj"></tree-royalty-norm>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '6'">
      <tree-serpac
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="002"
        ref="taocan"
        :defaultCheckedKeys="defaultCheckedKeys"></tree-serpac>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '7'">
      <tree-royalty-norm
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="003"
        :defaultCheckedKeys="defaultCheckedKeys"
        :normList="treeData"
        ref="zigeyj"></tree-royalty-norm>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '8'">
      <tree-card
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="003"
        ref="zige"
        :defaultCheckedKeys="defaultCheckedKeys"></tree-card>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '9'">
      <tree-royalty-norm
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="004"
        :defaultCheckedKeys="defaultCheckedKeys"
        :normList="treeData"
        ref="chuzhiyj"></tree-royalty-norm>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '10'">
      <tree-card
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="004"
        ref="chuzhi"
        :defaultCheckedKeys="defaultCheckedKeys"></tree-card>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '11'">
      <tree-royalty-norm
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="006"
        :defaultCheckedKeys="defaultCheckedKeys"
        :normList="treeData"
        ref="jiangjin"></tree-royalty-norm>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '12'">
      <tree-service-type
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="001"
        ref="servtype"
        :defaultCheckedKeys="defaultCheckedKeys"></tree-service-type>
    </el-row>
    <el-row
      style="max-height: 330px; overflow-x: scroll; margin-top: 10px"
      v-show="itemtype == '13'">
      <tree-category
        :itemtype.sync="itemtype"
        :type.sync="type"
        prtcode="005"
        ref="category"
        :defaultCheckedKeys="defaultCheckedKeys"></tree-category>
    </el-row>
    <el-row style="text-align: center; margin-top: 15px">
      <el-button type="primary" @click="submit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import service from '@src/service'
import treeRoyaltyNorm from './treeRoyaltyNorm'
import treeProduct from './treeProduct'
import treeService from './treeService'
import treeServiceType from './treeServiceType'
import treeCard from './treeCard'
import treeSerpac from './treeSerpac'
import treeCategory from './treeCategory'

export default {
  components: {
    treeRoyaltyNorm,
    treeProduct,
    treeService,
    treeCard,
    treeSerpac,
    treeServiceType,
    treeCategory
  },
  name: 'panelTcItem',
  props: ['prtcode', 'type', 'tcxData', 'func'],
  data: function () {
    return {
      itemtype: '',
      items: [],
      treeData: []
    }
  },
  computed: {
    defaultCheckedKeys: function () {
      let keys = []
      this.tcxData.map(tcx => {
        keys.push(tcx.itemid)
      })
      return keys
    }
  },
  mounted() {
    this.itemtype = this.type
    service.chain.royaltyNorm.normList().then(res => {
      this.treeData = res.data
    })
  },
  watch: {
    type(v) {
      this.itemtype = v
    }
  },
  methods: {
    submit() {
      this.items = []

      if (this.itemtype == '1') {
        //  提成指标
        this.$refs.fwyj.get().map(prn => {
          this.items.push({
            itemid: prn.prnid,
            itemcode: prn.prncode,
            itemname: prn.prnname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '2') {
        //  服务项目
        this.$refs.serv.get().map(servivce => {
          this.items.push({
            itemid: servivce.id,
            itemcode: servivce.servcode,
            itemname: servivce.servname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '3') {
        this.$refs.wmyj.get().map(prn => {
          this.items.push({
            itemid: prn.prnid,
            itemcode: prn.prncode,
            itemname: prn.prnname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '4') {
        //  外卖
        this.$refs.prod.get().map(product => {
          console.log(product)
          this.items.push({
            itemid: product.id,
            itemcode: product.pcode,
            itemname: product.pname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '5') {
        this.$refs.taocanyj.get().map(prn => {
          this.items.push({
            itemid: prn.prnid,
            itemcode: prn.prncode,
            itemname: prn.prnname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '6') {
        //  套餐卡
        this.$refs.taocan.get().map(taocao => {
          this.items.push({
            itemid: taocao.id,
            itemcode: taocao.spcode,
            itemname: taocao.spname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '7') {
        this.$refs.zigeyj.get().map(prn => {
          this.items.push({
            itemid: prn.prnid,
            itemcode: prn.prncode,
            itemname: prn.prnname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '8') {
        //  套餐卡
        this.$refs.zige.get().map(zige => {
          this.items.push({
            itemid: zige.id,
            itemcode: zige.cpcode,
            itemname: zige.cpname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '9') {
        this.$refs.chuzhiyj.get().map(prn => {
          this.items.push({
            itemid: prn.prnid,
            itemcode: prn.prncode,
            itemname: prn.prnname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '10') {
        //  套餐卡
        this.$refs.chuzhi.get().map(chuzhi => {
          this.items.push({
            itemid: chuzhi.id,
            itemcode: chuzhi.cpcode,
            itemname: chuzhi.cpname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '11') {
        this.$refs.jiangjin.get().map(prn => {
          this.items.push({
            itemid: prn.prnid,
            itemcode: prn.prncode,
            itemname: prn.prnname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '12') {
        this.$refs.servtype.get().map(prn => {
          this.items.push({
            itemid: prn.id,
            itemcode: prn.scode,
            itemname: prn.sname,
            itemtype: this.itemtype
          })
        })
      } else if (this.itemtype == '13') {
        this.$refs.category.get().map(prn => {
          this.items.push({
            itemid: prn.id,
            itemcode: prn.ccode,
            itemname: prn.cname,
            itemtype: this.itemtype
          })
        })
      }
      if (this.items.length > 0) this.func(this.items)
    },
    clean() {
      this.itemtype = ''
    }
  }
}
</script>
