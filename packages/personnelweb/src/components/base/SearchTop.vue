<!--
 * @Author: wqy
 * @Date: 2022-06-16 17:03:39
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-19 11:30:42
 * @FilePath: \personnelweb\src\components\base\SearchTop.vue
 * @Description: 
-->
<template>
  <div class="search-area">
    <div class="search-row pd-r-12">
      <form-item
        v-for="option in options"
        :key="option.prop"
        :label="option.label"
        prefix="："
        :width="option.width"
        :required="option.required"
        :labelWidth="option.labelWidth || '1rem'">
        <el-select
          v-if="option.type === 'select'"
          v-model="params[option.prop]"
          clearable
          filterable
          :style="{ width: option.widgetWidth ? option.widgetWidth : '100%' }">
          <el-option
            v-for="(item, index) in option.options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <tree-select
          v-else-if="option.type === 'treeselect'"
          v-model="params[option.prop]"
          :props="option.defaultProps ? option.defaultProps : defaultProps"
          :data="option.treeSelectData || []"
          :defaultExpand="true"
          :style="{
            width: option.widgetWidth ? option.widgetWidth : '100%'
          }"></tree-select>

        <el-date-picker
          v-else-if="option.type === 'daterange'"
          v-model="params[option.prop]"
          type="daterange"
          format="yyyy年MM月dd日"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placement="bottom"
          :value-format="option['value-format'] || 'yyyy-MM-dd'"
          :style="{
            width: option.widgetWidth ? option.widgetWidth : '100%'
          }">
        </el-date-picker>

        <el-date-picker
          v-else-if="option.type === 'date'"
          v-model="params[option.prop]"
          :type="option.dateType"
          :format="option.format || 'yyyy年MM月dd日'"
          placement="bottom"
          :value-format="option['value-format'] || 'yyyy-MM-dd'"
          :placeholder="
            option.placeholder
              ? `${option.placeholder}`
              : `请输入${option.label}`
          "
          :style="{
            width: option.widgetWidth ? option.widgetWidth : '100%'
          }">
          ></el-date-picker
        >

        <el-input-number
          v-else-if="option.type === 'input-number'"
          v-model="params[option.prop]"
          :placeholder="
            option.placeholder
              ? `${option.placeholder}`
              : `请输入${option.label}`
          "
          :controls="option.controls"
          :min="option.min"
          :max="option.max"
          :style="{
            width: option.widgetWidth ? option.widgetWidth : '100%'
          }">
        </el-input-number>

        <el-input
          v-else
          v-model="params[option.prop]"
          :type="option.type"
          clearable
          :placeholder="
            option.placeholder
              ? `${option.placeholder}`
              : `请输入${option.label}`
          "
          :style="{
            width: option.widgetWidth ? option.widgetWidth : '100%'
          }"></el-input>
      </form-item>
      <!-- <form-area :options="options" /> -->

      <slot name="inlineBtn"></slot>
      <div v-if="advance" class="flex flex-alignitems__center mg-l-12">
        <el-button
          type="default"
          :icon="showAdvance ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          round
          @click="onOpenAdvance"
          >高级查询</el-button
        >
      </div>
    </div>
    <template v-if="advance">
      <el-collapse-transition>
        <!-- <transition name="el-zoom-in-top"> -->
        <div
          class="search-row search-advance"
          v-show="showAdvance && advanceOptions.length > 0">
          <form-item
            v-for="option in advanceOptions"
            :key="option.prop"
            :label="option.label"
            prefix="："
            :width="option.width"
            :required="option.required"
            :labelWidth="option.labelWidth || '1rem'">
            <el-select
              v-if="option.type === 'select'"
              v-model="params[option.prop]"
              clearable
              filterable
              @change="val => handleSelectChange(val, option.prop, 'advance')"
              :style="{
                width: option.widgetWidth ? option.widgetWidth : '100%'
              }">
              <el-option
                v-for="(item, index) in option.options"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <tree-select
              v-else-if="option.type === 'treeselect'"
              v-model="params[option.prop]"
              :props="option.defaultProps ? option.defaultProps : defaultProps"
              :data="option.treeSelectData || []"
              :defaultExpand="true"
              :style="{
                width: option.widgetWidth ? option.widgetWidth : '100%'
              }"></tree-select>

            <el-date-picker
              v-else-if="option.type === 'daterange'"
              v-model="params[option.prop]"
              type="daterange"
              format="yyyy年MM月dd日"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placement="bottom"
              :value-format="option['value-format'] || 'yyyy-MM-dd'"
              :style="{
                width: option.widgetWidth ? option.widgetWidth : '100%'
              }">
            </el-date-picker>

            <el-date-picker
              v-else-if="option.type === 'date'"
              v-model="params[option.prop]"
              :type="option.dateType"
              :format="option.format || 'yyyy年MM月dd日'"
              placement="bottom"
              :value-format="option['value-format'] || 'yyyy-MM-dd'"
              :placeholder="
                option.placeholder
                  ? `${option.placeholder}`
                  : `请输入${option.label}`
              "
              :style="{
                width: option.widgetWidth ? option.widgetWidth : '100%'
              }">
              ></el-date-picker
            >

            <el-input-number
              v-else-if="option.type === 'input-number'"
              v-model="params[option.prop]"
              :placeholder="
                option.placeholder
                  ? `${option.placeholder}`
                  : `请输入${option.label}`
              "
              :controls="option.controls"
              :min="option.min"
              :max="option.max"
              :style="{
                width: option.widgetWidth ? option.widgetWidth : '100%'
              }">
            </el-input-number>

            <el-input
              v-else
              v-model="params[option.prop]"
              :type="option.type"
              clearable
              :placeholder="
                option.placeholder
                  ? `${option.placeholder}`
                  : `请输入${option.label}`
              "
              :style="{
                width: option.widgetWidth ? option.widgetWidth : '100%'
              }"></el-input>
          </form-item>
          <div class="close-folder" v-if="false">
            <el-button type="text">收起</el-button>
          </div>
        </div>
        <!-- </transition> -->
      </el-collapse-transition>
    </template>
  </div>
</template>

<script>
import FormItem from '@src/components/base/FormItem.vue'
import { deepClone } from '@src/library/helper/util'
import TreeSelect from '@src/components/base/TreeSelect.vue'

export default {
  name: 'SearchTop',
  props: {
    options: {
      type: Array
    },
    advanceOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    defaultParams: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  components: {
    FormItem,
    TreeSelect
  },
  data() {
    return {
      page: {
        page: 1,
        limit: 10
      },
      params: {},
      advance: false,
      showAdvance: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {},
  methods: {
    handleSelectChange(val, field, conditionType) {
      const condition =
        conditionType === 'advance' ? this.advanceOptions : this.condition
      const item = condition.find(v => v.prop === field)
      if (item && item.emit) {
        this.$emit('paramsChange', val, field)
      }
    },
    requiredValidate() {
      let flag = true
      const requiredItems = this.options
        .filter(v => v.required)
        ?.map(v => {
          return v.prop
        })
      if (requiredItems.length && !Object.keys(this.params).length) {
        return false
      }
      for (const i in requiredItems) {
        if (Object.hasOwnProperty.call(requiredItems, i)) {
          const key = requiredItems[i]
          const value = this.params[key]
          if (value === '' || value === undefined || value === null) {
            flag = false
            break
          }
        }
      }
      return flag
    },
    getSearchParams() {
      const params = {}
      for (const key in this.params) {
        if (Object.hasOwnProperty.call(this.params, key)) {
          if (!(typeof key === 'string' && key)) {
            params[key] = this.params[key]
          }
        }
      }
      return { ...this.params, ...this.page }
    },
    reset() {
      for (const key in this.params) {
        if (Object.hasOwnProperty.call(this.params, key)) {
          this.$set(this.params, key, undefined)
        }
      }
      this.page.page = 1
    },
    onOpenAdvance() {
      this.showAdvance = !this.showAdvance
    }
  },
  watch: {
    options: {
      handler: function (val) {
        if (!val || val instanceof Array) {
          return
        }
        this.params = deepClone(val)
      }
    },
    advanceOptions: {
      immediate: true,
      handler: function (val) {
        if (val?.length) {
          this.advance = true
        }
      }
    },
    defaultParams: {
      immediate: true,
      handler: function (val) {
        if (val) {
          const params = JSON.parse(JSON.stringify(this.params))
          this.params = {
            ...params,
            ...val
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-area {
  margin-bottom: 0.12rem;
  .search-row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .search-item {
      margin: 0.08rem;
      width: 24%;
    }
  }
  .search-advance {
    position: relative;
    padding: 0.08rem 0.12rem 0.08rem 0;
    margin-top: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .close-folder {
      position: absolute;
      bottom: 0;
      right: 0.12rem;
    }
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
