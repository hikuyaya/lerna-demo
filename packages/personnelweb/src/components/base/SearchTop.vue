<!--
 * @Author: wqy
 * @Date: 2022-06-16 17:03:39
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 14:23:34
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
        :labelWidth="option.labelWidth || '1rem'">
        <el-select
          v-if="option.type === 'select'"
          v-model="params[option.prop]"
          clearable
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
          format="yyyy 年 MM 月 dd 日"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placement="bottom"
          value-format="timestamp"
          :style="{
            width: option.widgetWidth ? option.widgetWidth : '100%'
          }">
        </el-date-picker>

        <el-input
          v-else
          v-model="params[option.prop]"
          :type="option.type"
          clearable
          :placeholder="
            option.placeholder
              ? `请输入${option.placeholder}`
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
            :labelWidth="option.labelWidth || '1rem'">
            <el-select
              v-if="option.type === 'select'"
              v-model="params[option.prop]"
              clearable
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
              format="yyyy 年 MM 月 dd 日"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placement="bottom"
              value-format="timestamp"
              :style="{
                width: option.widgetWidth ? option.widgetWidth : '100%'
              }">
            </el-date-picker>

            <el-input
              v-else
              v-model="params[option.prop]"
              :type="option.type"
              clearable
              :placeholder="
                option.placeholder
                  ? `请输入${option.placeholder}`
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
import FormArea from '@src/components/base/FormArea.vue'
import FormItem from '@src/components/base/FormItem.vue'
import { deepClone } from '@src/library/helper/util'
import TreeSelect from '@src/components/base/TreeSelect.vue'

export default {
  name: 'SearchTop',
  props: {
    options: {
      type: Array
    },
    advance: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    advanceOptions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    FormItem,
    FormArea,
    TreeSelect
  },
  data() {
    return {
      page: {
        page: 1,
        limit: 10
      },
      params: {},
      showAdvance: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    getSearchParams() {
      return { ...this.params, ...this.page }
    },
    reset() {
      this.params = {}
      this.page.page = 1
    },
    onOpenAdvance() {
      this.showAdvance = !this.showAdvance
    }
  },
  watch: {
    options: {
      handler: function (val) {
        if (!val) {
          return
        }
        this.params = deepClone(val)
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
