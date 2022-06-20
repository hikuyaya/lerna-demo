<!--
 * @Author: wqy
 * @Date: 2022-06-16 17:03:39
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-17 17:59:49
 * @FilePath: \personnelweb\src\components\base\SearchTop.vue
 * @Description: 
-->
<template>
  <div class="search-area">
    <div class="search-row">
      <form-item
        v-for="option in options"
        :key="option.prop"
        :label="option.label"
        prefix="："
        :width="option.width"
        :labelWidth="option.labelWidth || '80px'">
        <el-select
          v-if="option.type === 'select'"
          v-model="params[option.prop]"
          :style="{ width: option.widgetWidth ? option.widgetWidth : 'auto' }">
          <el-option v-for="(item, index) in option.options" :key="index">
          </el-option>
        </el-select>

        <el-input
          v-else
          v-model="params[option.prop]"
          :placeholder="
            option.placeholder
              ? `请输入${option.placeholder}`
              : `请输入${option.label}`
          "
          :style="{
            width: option.widgetWidth ? option.widgetWidth : '100%'
          }"></el-input>
      </form-item>

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
      <template v-if="advance">
        <el-collapse-transition>
          <!-- <transition name="el-zoom-in-top"> -->
          <div
            class="search-row search-advance"
            v-show="showAdvance && advanceOptions.length > 0">
            <form-area :options="advanceOptions"> </form-area>

            <div class="close-folder" v-if="false">
              <el-button type="text">收起</el-button>
            </div>
          </div>
          <!-- </transition> -->
        </el-collapse-transition>
      </template>
    </div>
  </div>
</template>

<script>
import FormArea from '@src/components/base/FormArea.vue'
import FormItem from '@src/components/base/FormItem.vue'
import { deepClone } from '@src/library/helper/util'
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
    FormArea
  },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 12
      },
      params: {},
      showAdvance: false
    }
  },
  methods: {
    getSearchParams() {
      return { ...this.params, ...this.page }
    },
    reset() {
      this.params = {}
      this.page.pageNo = 1
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
  margin-bottom: 12px;
  .search-row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .search-item {
      margin: 8px;
      width: 24%;
    }
  }
  .search-advance {
    position: relative;
    padding: 8px 12px 8px 0;
    margin-top: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .close-folder {
      position: absolute;
      bottom: 0;
      right: 12px;
    }
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
