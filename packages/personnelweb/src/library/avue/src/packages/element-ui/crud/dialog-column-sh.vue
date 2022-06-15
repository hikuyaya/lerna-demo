<template>
  <el-dialog :class="[b('dialog'),b('column')]" lock-scroll :modal-append-to-body="false" append-to-body
    class="avue-dialog" :title="t('crud.showTitle')" style="top:0" @closed="handleClose"
    :size="crud.isMobile?'100%':dialogwidth" :visible.sync="columnBox">
    <div style="height:calc(100% - 5px);display:flex;flex-wrap: wrap;width:76%;">
      <template>
        <div class="labelBox" v-for="(item,index) in list" :key='index'>
          <template>
            <el-checkbox v-model="crudlist[item.prop].hide" @change="checkboxChange(item.prop)"></el-checkbox>
            <span>{{item.label}}</span>
          </template>
        </div>
      </template>
    </div>
    <div class="sortbox">
      <div class="sortext">已选字段</div>
      <el-table :data="sortlist" ref="table" :key="Math.random()" height="100%" size="small" :show-header="false"
        :border="false" row-key="id">
        <el-table-column align="left" width="140" prop="label" :label="t('crud.column.name')"
          :key="t('crud.column.name')">
        </el-table-column>
        <template v-for="(item,index) in crud.defaultColumn">
          <el-table-column :prop="item.prop" :key="index" align="center" v-if="item.hide!=true" :label="item.label">
            <template slot-scope="{row}">
              <i class="el-icon-close" @click="deleteItem(crudlist[row.prop])"></i>
            </template>

          </el-table-column>
        </template>

      </el-table>
    </div>
  </el-dialog>
</template>
<script>
  import create from "../../../core/create";
  import config from "./config.js";
  import locale from "../../core/common/locale";
  import {
    arraySort
  } from '../../../utils/util'
  import Sortable from 'sortablejs'

  export default create({
    name: 'crud',
    mixins: [locale],
    inject: ["crud"],
    data() {
      return {
        columnBox: false,
        change: false,
        crudlist: {},
        sortlist: []
      };
    },
    computed: {
      dialogwidth() {

        return (10 + this.crud.defaultColumn.length * 5) + "%"
      },

      list() {
        let list = [];
        let newarr = []

        this.crudlist = this.deepClone(this.crud.objectOption)
        for (var o in this.crud.objectOption) {
          const ele = this.crud.objectOption[o]
          if (ele.showColumn != false) {
            list.push(Object.assign(ele, {
              prop: o
            }))
            newarr.push(ele)
          }

        }
        if (newarr != []) {
          if (newarr.findIndex(target => target.hide === true) == -1) {
            newarr.findIndex(item => {
              item.hide = true
            })
          }
        }

        list = arraySort(list, 'index', (a, b) => this.crud.objectOption[a.prop].index - this.crud.objectOption[b.prop].index)

        this.sortlist = list.filter(item => item.hide == true)

        return list;

      }
    },
    beforeUpdate(){
        //  setTimeout(() => {
        //    const el = document.querySelector('.sortbox')
        //    if(el){
        //       this.rowDrop()
        //    }
        //  },500)
    },
    created(){
      setTimeout(() => {
        this.crudlist = this.deepClone(this.crud.objectOption)
        this.sortlist = this.list.filter(item => item.hide == true)

      }, 500);
    },
    methods: {

      handleClose() {

        if (this.change) {
          this.$emit("dialogClose", this.sortlist)
          this.change = false
        }

      },
    rowDrop() {
      const el = document.querySelectorAll('.sortbox .el-table__body-wrapper tbody')          //当打开多个带列显隐的页面时，document.querySelectorAll取最后一个就是当前tab的列显隐窗口
      // console.log(el)
      const _this = this
      var sortable = new Sortable(el[el.length-1], {
        sort: true,
        draggable: ".el-table__row",
        onEnd:function({ newIndex, oldIndex }) {
          console.log(newIndex,oldIndex)
          const currRow = _this.sortlist.splice(oldIndex, 1)[0]
          _this.sortlist.splice(newIndex, 0, currRow)
          _this.crud.column = _this.sortlist
          _this.change = true
        }
      })
    },
      checkboxChange(e) {
        this.change = true
        if (this.crudlist[e].hide) { //勾上了，显示
          this.sortlist.push(this.crudlist[e])
        } else { //没勾，删掉
          let index = this.sortlist.findIndex(item => item.prop == e)
          this.sortlist.splice(index, 1);
        }
        this.$forceUpdate();
      },
      deleteItem(e) {
        this.crudlist[e.prop].hide = false
        let index = this.sortlist.findIndex(item => item.prop == e.prop)
        this.sortlist.splice(index, 1);
      }
    }
  });
</script>

<style scoped lang="scss">
  /deep/.el-dialog {
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    height: auto !important;
    width: 80% !important;
  }

  .labelBox {
    display: inline-block;
    width: 25%;
    // margin-right: 1%;
    // text-align: center;
  }

  /deep/.el-dialog__body {
    padding-left: 20px !important;
    display: flex;
    overflow-y: hidden;
  }

  .sortbox {
    // flex: 1;
    width: 24%;
    border-left: 1px solid #ccc;
    // height: 100%;
    padding-bottom: 26px;
    .sortext{
      padding-left: 10px;
      margin-bottom: 10px;
      font-weight: 600;
    }
  }

  /deep/.el-table td.el-table__cell {
    border: none !important;
  }
  

  /deep/.el-table {
    border: none !important;

    &:before {
      height: 0px !important;
    }
  }
</style>