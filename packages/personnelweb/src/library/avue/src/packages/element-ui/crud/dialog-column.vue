<template>
  <el-drawer :class="[b('dialog'),b('column')]"
             lock-scroll
             :modal-append-to-body="false"
             append-to-body
             class="avue-dialog"
             :title="t('crud.showTitle')"
             @opened="rowDrop"
             style="top:0"
             @closed="handleClose"
    :size="crud.isMobile?'100%':dialogwidth"
    :visible.sync="columnBox">
    <div style="height:calc(100% - 5px)">
      <el-table :data="list"
                ref="table"
                :key="Math.random()"
                height="100%"
                size="small"
                border>
        <el-table-column align="center"
                         width="100"
                         header-align="center"
                         prop="label"
                         :label="t('crud.column.name')">
        </el-table-column>
        <template v-for="(item,index) in crud.defaultColumn">
          <el-table-column :prop="item.prop"
                           :key="index"
                           align="center"
                           header-align="center"
                           v-if="item.hide==true"
                           :label="item.label">
            <template slot-scope="{row}">
              <el-checkbox v-model="crudlist[row.prop][item.prop]"  @change="change=true"></el-checkbox>
              <!-- <el-checkbox v-model="crud.objectOption[row.prop][item.prop]"  @change="change=true"></el-checkbox> -->
            </template>
          </el-table-column>
        </template>

      </el-table>
    </div>
  </el-drawer>
</template>
<script>
import create from "../../../core/create";
import config from "./config.js";
import locale from "../../core/common/locale";
import {arraySort} from '../../../utils/util'

export default create({
  name: 'crud',
  mixins: [locale],
  inject: ["crud"],
  data() {
    return {
      columnBox: false,
      change: false,
      crudlist:{}
    };
  },
  computed: {
    dialogwidth() {

      return (10 + this.crud.defaultColumn.length * 5) + "%"
    },

    list() {
      let list = [];
      let newarr = []
      // console.log(this.crud.objectOption,this.crudlist)
      this.crudlist = this.deepClone(this.crud.objectOption)
      for (var o in this.crud.objectOption) {
        const ele = this.crud.objectOption[o]
        if (ele.showColumn != false) {
          list.push(Object.assign(ele, {prop: o}))
          newarr.push(ele)
        }
        
      }
      if(newarr!=[]){
        if(newarr.findIndex(target=>target.hide===true)==-1){
          newarr.findIndex(item=>{item.hide=true})
        }
      }
    
      list = arraySort(list, 'index', (a, b) => this.crud.objectOption[a.prop].index - this.crud.objectOption[b.prop].index)
      return list;
      
    }
  },
  created() {
   setTimeout(() => {
      this.crudlist = this.deepClone(this.crud.objectOption)
    },500);
  },
  methods: {

    handleClose() {

      if (this.change){
        this.$emit("dialogClose",this.crudlist)
        this.change = false
      }

    },
    rowDrop() {
      const el = this.$refs.table.$el.querySelectorAll(config.dropRowClass)[0]
      this.crud.tableDrop(el, evt => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        this.crud.headerSort(oldIndex, newIndex)
        this.$nextTick(() => this.rowDrop())
      })
    },
  }
});
</script>

