<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-27 12:42:00
 * @FilePath: \personnelweb\src\views\salary-plan\shop-limit\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" label-width="90px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="选择门店" prop="shopName">
            <el-input disabled v-model="info.shopName"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="operateType !== 'detail'" :span="1" class="pd-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseShopVisible = true"></el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店编码" prop="shopCode">
            <el-input disabled v-model="info.shopCode" class="w90"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择年月" prop="date">
            <el-date-picker
              v-model="info.date"
              type="month"
              format="yyyy年MM月"
              placement="bottom"
              value-format="yyyy-MM"
              class="w90">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对公打款" prop="money">
            <el-input-number
              v-model="info.money"
              :controls="false"
              :min="0"
              class="w90" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="info.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="选择门店"
      :visible.sync="chooseShopVisible"
      :close-on-click-modal="false"
      append-to-body
      width="600px">
      <choose-single-item
        v-if="chooseShopVisible"
        :columns="chooseShopColumns"
        :actionUrl="chooseSingleShopActionUrl"
        :conditions="chooseShopConditions"
        @select="handleSelectShop"></choose-single-item>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleItem from '@src/components/business/ChooseSingleItem.vue'
import service from '@src/service'
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    operateType: {
      type: String
    }
  },
  components: {
    ChooseSingleItem
  },
  data() {
    return {
      info: {},
      tableData: [],
      chooseShopVisible: false,
      chooseShopColumns: [
        { label: '门店编码', prop: 'shopcode' },
        { label: '门店名称', prop: 'shopname' }
      ],
      chooseSingleShopActionUrl: service.chain.shop.shopListWithPage,
      chooseShopConditions: [
        {
          label: '门店编码', // 标签
          prop: 'pcodename', // 绑定的字段
          // label宽度
          type: 'input',
          width: '50%', // 整个组件占的宽度
          placeholder: '门店编码/门店名称'
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        }
      ]
    }
  },
  methods: {
    handleSelectShop(shop) {
      console.log(shop)
      this.info = {
        shopName: shop.shopname,
        shopCode: shop.shopcode
      }
      this.chooseShopVisible = false
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        const [effectYear, effectMonth] = this.info.date.split('-')
        debugger
        return {
          ...this.info,
          effectYear,
          effectMonth
        }
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
    'info.sx': {
      handler: function (val) {
        if (val == 1) {
          //
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.font-size-22px {
  font-size: 22px;
}
</style>
