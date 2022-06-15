<template>
  <el-dialog :title="t('crud.excelBtn')"
             lock-scroll
             :modal-append-to-body="false"
             append-to-body
             class="avue-dialog"
             :visible.sync="box"
             :width="crud.isMobile?'100%':'30%'">

    <avue-form v-model="form"
               :option="option"></avue-form>


    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 :size="crud.isMediumSize"
                 @click="handleSubmit">{{ t('crud.filter.submitBtn') }}</el-button>
      <el-button @click="box = false"
                 :size="crud.isMediumSize">{{ t('crud.filter.cancelBtn') }}</el-button>  </span>

  </el-dialog>
</template>

<script>
import locale from "../../core/common/locale";
import Vue from 'vue'
import DialogProgress from './dialog-excel-progress';

export default {
  name: 'crud',
  mixins: [locale],
  inject: ['crud'],
  data() {
    return {
      box: false,
      form: {
        name: this.crud.tableOption.excelTitle
      },
      data: null,
      searchFormat: null,
      present: 0,
      progressFlag: false
    }
  },
  computed: {
    name() {
      return this.crud.tableOption.excelTitle;
    },
    columnOption() {
      let column = this.deepClone(this.crud.columnOption).filter(item => item.hide == true)
      column.forEach(ele => {
        let children = ele.children
        if (children && !Array.isArray(children)) {
          delete ele.children
        }
      })
      return column;
    },
    columnList() {
      if (!this.form.params) return []
      if (this.form.params.includes('headers')) {
        return this.crud.propOption
      } else {
        let result = [];
        const findProp = (list = []) => {
          list.forEach((ele, index) => {
            if (ele.children) findProp(ele.children)
            else result.push(ele)
          })
        }
        findProp(this.columnOption);
        return result;
      }
    },
    columns() {
      let columns = this.deepClone(this.columnOption);
      if (!this.form.params) return []
      if (this.form.params.includes('headers')) {
        const findProp = (list = []) => {
          list.forEach((ele, index) => {
            if (ele.children) {
              findProp(ele.children)
            } else if (!this.form.prop.includes(ele.prop)) {
              list.splice(index, 1);
            }
          })
        }
        findProp(columns);
        return columns
      } else {
        let result = [];
        const findProp = (list = []) => {
          list.forEach((ele, index) => {
            if (ele.children) {
              findProp(ele.children)
            } else if (this.form.prop.includes(ele.prop)) {
              result.push(ele)
            }
          })
        }
        findProp(columns);
        return result
      }
    },
    option() {
      return {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: '文件名',
            prop: 'name',
            span: 24,
          },
          //  {
          //   label: '选择数据',
          //   prop: "type",
          //   span: 24,
          //   type: 'select',
          //   value: this.crud.tableOption.page ? 1 : 0,
          //   disabled:true,
          //   dicData: this.crud.tableOption.page ? [{label: '分次下载所有数据',value: 1}] : [{label: '当前数据(当前页全部的数据)',value: 0}]
          // },
          {
            label: '选择字段',
            prop: "prop",
            type: 'tree',
            multiple: true,
            checkStrictly: true,
            span: 24,
            props: {
              value: 'prop'
            },
            dicData: this.columnOption
          }, {
            label: '参数设置',
            prop: 'params',
            type: 'checkbox',
            span: 24,
            value: ['header', 'data'].concat((() => {
              let result = []
              if (this.crud.isHeader) result.push('headers')
              if (this.crud.isShowSummary) result.push('sum')
              return result
            })()),
            dicData: [{
              label: '表头',
              disabled: true,
              value: 'header'
            }, {
              label: '数据源',
              disabled: true,
              value: 'data'
            }].concat((() => {
              let result = []
              result.push({
                label: '复杂表头',
                value: 'headers',
                disabled: !this.crud.isHeader
              })
              result.push({
                label: '合计统计',
                value: 'sum',
                disabled: !this.crud.isShowSummary
              })
              return result
            })())
          }
        ]
      }
    }
  },

  watch: {
    columnList() {
      this.form.prop = this.columnList.map(ele => ele.prop)
    }
  },
  methods: {
    handleShow(data, searchFormat) {
      this.box = true,
          this.form.name = this.name;
      this.data = data;
      this.searchFormat = searchFormat;

      this.present = 0;
    },
    async handleSubmit() {
      this.progressFlag = true;
      let data = await this.handleSum();
      this.$Export.excel({
        title: this.form.name,
        columns: this.columns,
        data: data,
        searchFormat:this.searchFormat,
        search: this.data
      });
      this.box = false;
    },
    //计算统计
    async handleSum() {
      const option = this.crud.tableOption;
      const columnOption = this.crud.propOption;
      let count = 0;
      let sumsList = [...this.crud.sumsList];
      let list = [];

      if (!this.crud.option.page) {         //判断报表是否分页，分页的要调接口
        list = this.crud.list
      } else {
        // if(this.form.type ==0){
        //   list = this.crud.list
        // } else if(this.form.type ==1){

        this.present = 1;
        // let elp = h(DialogProgress, {
        //   props: {DialogProgress: this.percentage,},
        //   percentage: this.present,
        //   parent: this
        // });

        //  var para = document.createElement("div");
        //  para.id="ididid";
        //
        //  document.body.appendChild(para)
        // debugger
        //  let elp=new DialogProgress({el:"#ididid",data:{percentage:this.present}});
        //  debugger
        const ToastConstructor = Vue.extend(DialogProgress);
        const elp = new ToastConstructor();
        elp.$mount(document.createElement('div'));
        document.body.appendChild(elp.$el);
        elp.show();
        let total = this.crud.page.total;
        let size = 500;

        let num = Math.ceil(total / size + 1);
        for (let i = 1; i < num; i++) {

          await this.crud.excelAll({...this.crud.search, pageNo: i, pageSize: size}).then(data => {

            if (data) {
              list = [...list, ...data.data]
            }
          }).catch(e => {

            console.error(e);
          })

          elp.setPercentage((Math.floor(i / num * 100)));
        }
        // let index = 0;
        // request.forEach(item => {
        //   item.then(() => {
        //     index++;
        //     elp.setPercentage((index / num) * 100);
        //   })
        // });
        //
        //
        // await Promise.all(request).then(data => {
        //
        //   data.forEach(item => {
        //
        //     if (item.data) {
        //       list = [...list, ...item.data]
        //     }
        //   })


        // }).catch(e => {
        //
        //   elp.hide();
        // });
        elp.hide();

      }
      // let list = this.form.type == 0 ? this.crud.list :
      let data = []
      if (this.form.params.includes('data')) {
        list.forEach(ele => {
          let obj = this.deepClone(ele);
          columnOption.forEach(column => {
            if (column.bind) obj[column.prop] = getAsVal(obj, column.bind);
            if (!this.validatenull(obj['$' + column.prop])) obj[column.prop] = obj['$' + column.prop];
          })
          data.push(obj);
        })
      }
      if (option.index) count++;
      if (option.selection) count++;
      if (option.expand) count++;
      sumsList.splice(0, count);
      sumsList.splice(sumsList.length - 1, 1);
      if (this.form.params.includes('sum') && option.showSummary) {
        let sumsObj = {};
        sumsList.forEach((ele, index) => {
          if ((columnOption[index] || {}).prop) {
            sumsObj[columnOption[index].prop] = ele;
          }
        });
        data.push(sumsObj);
      }

      return data;
    },
  }
}
</script>
