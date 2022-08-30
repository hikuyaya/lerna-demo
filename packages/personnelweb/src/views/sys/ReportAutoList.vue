<template>
  <avue-crud
    ref="crud"
    :option.sync="aoption"
    :aoption_column="aoption.column"
    :data.sync="data"
    :page.sync="page"
    @refresh-change="refresh"
    :cell-style="cellStyle"
    :table-loading="columnLoading"
    size="small"
    @update:search="searchData"
    @search-change="searchChange"
    @hideChange="hideChange"
    @sort-change="sortChange"
    :summary-method="summaryMethod"
    :span-method="spanMethod"
    :excel-all="loadexcel"
    @search-reset="searchReset"
    @on-load="onLoad">
    <template slot="tips" v-if="reportHead.isContent">
      <div class="bottom_content" v-html="reportHead.content"></div>
    </template>
    <template
      v-for="item in reportItems"
      :slot="item.fieldName"
      slot-scope="scope">
      {{ cellformat(item, scope.row) }}
    </template>
    <!--      <template slot="menuRight" slot-scope="{size}">-->
    <!--        <el-button icon="el-icon-download" class="is-circle" :size="size"></el-button>-->
    <!--      </template>-->
  </avue-crud>
  <!--  <el-skeleton :rows="10" animated :loading.sync="columnLoading">  </el-skeleton>-->
</template>

<script>
import service from '@src/service'
import moment from 'moment'

import { filterObj, math } from './components/dataUtils'
import yid from '@src/library'

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

//定义wappered boolean值是为了区别我自己定义的同名方法，可忽略
const calcHeightx = function (value, wappered = true) {
  //项目自定义的公共header部分的高度，可忽略
  let header = 50
  // let header = variable.headerHeight;
  //value为动态计算table界面高度时，减去的其他空白部分，需自行在调试找到临界值，剩下的就是table表格的高度（包含header+body部分）
  value = value == undefined ? 100 : value
  let res =
    window.innerHeight -
    parseInt(header.substring(0, header.indexOf('px'))) -
    value
  if (wappered) {
    //通过原生方法，获取dom节点的高度------获取element-ui table表格body的元素
    let wapper = window.document.getElementsByClassName(
      'el-table__body-wrapper'
    )
    //通过原生方法，获取dom节点的高度------获取element-ui table表格header的元素
    let header = window.document.getElementsByClassName(
      'el-table__header-wrapper'
    )
    //必须加延时，要不然赋不上去值
    setTimeout(() => {
      //通过上边计算得到的table高度的value值，减去table表格的header高度，剩下的通过dom节点直接强行赋给table表格的body
      wapper[0].style.height = value - header[0].clientHeight + 'px'
    }, 100)
  }
  return res
}

const groupBy = (array, f) => {
  const groups = {}
  array.forEach(function (o) {
    //注意这里必须是forEach 大写
    const group = o[f]
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return groups
}
export default {
  name: 'ReportAutoList',
  data() {
    return {
      defaults: {},
      search: {},
      currentLimit: false,
      minTime: null,
      timeLimit: 60,
      aoption: {
        // defaultSort: {
        //   prop: 'code',
        //   order: 'descending'
        // },
        height: 'auto',
        selection: false,
        searchMenuSpan: 6,
        searchIndex: 0,
        searchIcon: false,
        searchShow: false,
        searchShowBtn: false,
        // title: '1111',
        excelTitle: '',
        header: true,
        showStripe: true,
        highlightCurrentRow: false,
        expand: false,
        border: true,
        showSummary: false,
        dateBtn: false,
        printBtn: true,
        excelBtn: false,
        sortable: false,
        filterBtn: false,
        align: 'center',
        refreshBtn: false,
        columnBtn: true,
        addBtn: false,
        menu: false,
        page: false,
        column: [],
        dialogColumn: ['hide'],
        searchLabelWidth: 120,
        size: 'mini',
        clearExclude: []
      },
      data: [],
      page: {
        currentPage: 0,
        total: 0,
        // simplePage: true,
        // layout: "total,pager,prev,next",
        // background: false,
        pageSize: 10,
        background: false,
        pageSizes: [10, 15, 30, 40, 50, 100],
        unload: true
      },
      columnLoading: true,
      udiy: [],
      reportItems: [],
      reportHead: {},
      queryParam: {},
      hideList: [],
      needParams: [],
      js: null,
      test: false,
      math: math,
      defaultParams: {},
      moneyList: []
    }
  },
  mounted() {
    this.initTable()
  },
  computed: {
    crud() {
      return this.$refs.crud
    },
    form() {
      return this.$refs.crud.$refs.headerSearch.$refs.form
    }
  },
  methods: {
    getColumn(name) {
      return this.findObject(this.aoption.column, name)
    },
    fetch({ method, url, params, callback }) {
      if (method == 'GET') {
        yid.http.get(url, {}).then(data => callback(this, data))
      } else if (method == 'POST') {
        yid.http.post(url, params).then(data => callback(this, data))
      }
    },
    vaildErrorItem(filed, error) {
      this.$refs.crud.vaildErrorItem(filed, error)
    },
    searchData(value) {
      this.search = value
      this.page.currentPage = 1
    },
    searchReset() {
      this.page.currentPage = 1
    },
    async sortChange(val) {
      //val.prop;
      //val.order ascending descending
      this.page.currentPage = 1
      const params = this.$refs.crud.getParameters()

      let datap = {
        columnOrder: val.prop,
        specification: val.order == 'ascending' ? 'ASC' : 'DESC',
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...params
      }

      this.loadData(datap)
    },
    async hideChange(columns) {
      // console.log(this.aoption.column,columns)

      let filter = this.aoption.column
        .filter(item => item.showColumn)
        .map(item => item.prop)
        .filter(item => {
          return columns.indexOf(item) == -1
        })

      // let allColumn = []
      // for (let i = 0; i < this.crud.columnOption.length; i++) {
      //   allColumn.push(this.crud.columnOption[i].prop)
      // }
      // let filter = [...allColumn].filter(x => [...columns].every(y => y !== x));
      this.hideList = filter

      let itemdata = {}
      itemdata.id = null
      itemdata.fields = filter
      itemdata.headid = this.$route.params.code

      // let column_temp = []
      // columns.forEach(item => {
      //   this.aoption.column.filter(item2 => {
      //     if (item2.prop == item) {
      //       column_temp.push(item2)
      //     }
      //   })
      // })

      // function diffrence(a, b) {
      //   a = a.map(JSON.stringify);
      //   b = b.map(JSON.stringify);
      //   return a.concat(b).filter(v => !a.includes(v) || !b.includes(v)).map(JSON.parse)
      // }

      // let column_temp2 = diffrence(this.aoption.column, column_temp);

      // this.aoption.column = [...column_temp, ...column_temp2]
      try {
        await service.report.addUdiyList(itemdata)
      } catch (err) {}
    },

    async initTable() {
      let that = this
      if (!this.$route.params.code) {
        return false
      }
      for (const thatKey in this.$route.params) {
        this.queryParam[thatKey] = this.$route.params[thatKey]
      }

      delete this.queryParam['code']
      this.test = this.$route.query.test

      const roles = this.$store.getters['user/userInfo'].roleIds
      //获取报表ID
      this.reportCode = this.$route.params.code
      await service.report
        .getColumns(this.$route.params.code, this.$route.query.test || false)
        .then(res => {
          let { columns, head, udiy } = res.data
          that.reportItems = columns.filter(
            item => item.isSearch == true || item.isShow == true
          )
          // console.error(that.$route.meta.title)
          // if (head.name)
          //   that.$route.meta.title = head.name;
          that.reportHead = head
          this.aoption.excelTitle = head.name
          if (head.isDel == '1') {
            this.$alert('当前报表已停用', '错误', {
              confirmButtonText: '知道了',
              callback: action => {
                that.$router.go(-1)
              }
            })
            throw new Error('当前报表已停用')
          }

          this.aoption.printBtn = head.isPrint
          this.aoption.excelBtn = head.isExcel
          this.aoption.showSummary = head.isSummary
          this.aoption.searchShow = !head.isHideQuery
          this.aoption.columnBtn = head.isUdiy
          this.aoption.page = !head.isPage

          // if (head.isPage) {
          //   this.page.pageSize = 1000;
          // }

          try {
            //var str = "{ 'init':function(obj){    obj.haha='aaaa' ;}, 'cellstyle': function(obj){   return obj ;}, 'cellformat': function(obj){   return obj ;} },'summary':function(obj){   return obj ;} }"
            that.js = eval('(' + that.reportHead.reportJs + ')')
            that.js.init(
              that,
              that.queryParam,
              that.defaults,
              that.defaultParams
            )
          } catch (e) {
            console.error(e)
          }

          // this.$route.meta.title=head.name;
          // that.aoption.title=head.name;
          let columnlist = []

          let sorted = groupBy(columns, 'fieldGroup')

          const addItem = (list, columnData) => {
            let item = {
              label: columnData.fieldTxt,
              prop: columnData.fieldName,
              search: columnData.isSearch,
              showOverflowTooltip: true,
              overHidden: true,
              hide: columnData.isShow,
              minWidth: columnData.fieldWidth || 30,
              showColumn: columnData.isShow,
              sortable: columnData.isOrder ? 'custom' : false,
              searchRange: columnData.isRange,
              fixed: columnData.isFixed,
              type: columnData.fieldType,
              align: columnData.fieldType == 'money' ? 'right' : 'center',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              props: {
                label: columnData.dictKey,
                value: columnData.dictValue
              },
              // detail: true,
              memo: columnData.memo ? columnData.memo : false,
              disabled: false,
              dicUrl: columnData.dictUrl,
              dicMethod: columnData.dictMethod,
              renderHeader: (h, { column, index }) => {
                let l = column.label.length
                let f = 16 //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
                //文字 尺寸 14 pending 10
                //排序标 宽 24
                column.minWidth = Math.max(
                  20 + f * l + (column.sortable == 'custom' ? 24 : 0),
                  columnData.fieldWidth || 30
                )
                //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
                //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全

                return h(
                  'div',
                  {
                    class: 'table-head',
                    style: { width: '100%', display: 'inline' }
                  },
                  [column.label]
                )
              },

              pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                  if (maxDate && minDate) {
                    let maxDateMoment = moment(maxDate.toDate())
                    let minDateMoment = moment(minDate.toDate())
                    let diff = maxDateMoment.diff(minDateMoment, 'days')
                    if (diff >= this.timeLimit) {
                      this.$refs.crud.vaildErrorItem(
                        columnData.fieldName,
                        '时间范围不能超过' + this.timeLimit + '天'
                      )
                      throw new Error('时间超过范围')
                    }
                  }
                },
                disabledDate: time => {
                  if (this.minTime) {
                    return (
                      moment(this.minTime).toDate().getTime() <
                        moment()
                          .subtract(this.timeLimit, 'days')
                          .toDate()
                          .getTime() || time.getTime() > Date.now()
                    )
                  } else if (this.currentLimit)
                    return (
                      time.getTime() <
                        moment()
                          .subtract(this.timeLimit, 'days')
                          .toDate()
                          .getTime() || time.getTime() > Date.now()
                    )

                  return time.getTime() > Date.now()
                }
              },
              filterable: columnData.fieldType == 'select' ? true : false,
              dicQuery: columnData.dictQuery
                ? JSON.parse(columnData.dictQuery)
                : {},
              typeformat: (item, labelKey, valueKey) => {
                if (
                  columnData.fieldType == 'select' &&
                  columnData.fieldName == 'shopcode'
                ) {
                  return item[valueKey] + '    ' + item[labelKey]
                }
                return item[labelKey]
              },
              searchRules: [
                {
                  required: columnData.isNonull,
                  validator: (rule, value, callback) => {
                    //columnData.isNonull

                    try {
                      let error = that.js.validator(
                        that,
                        columnData.fieldName,
                        rule,
                        value,
                        callback
                      )

                      if (error) {
                        callback(new Error(error))
                      } else {
                        callback()
                      }
                    } catch (e) {
                      console.error(e)
                      callback()
                    }
                  },
                  trigger: 'blur'
                }
              ]
            }

            if (
              that.defaults[item.prop] &&
              isObject(that.defaults[item.prop])
            ) {
              Object.assign(item, that.defaults[item.prop])
            }
            if (
              (that.defaults[item.prop] && that.defaults[item.prop].noChange) ||
              columnData.isNonull
            ) {
              that.aoption.clearExclude.push(item.prop)
            }

            if (columnData.isNonull) {
              that.needParams.push(columnData.fieldName)
            }

            //筛选用户权限
            if (!columnData.fieldRole) {
              list.push(item)
            } else {
              let split = columnData.fieldRole.split(',')

              let flag = false
              split.forEach(r => {
                flag = flag || (r && roles.indexOf(r) != -1)
              })
              if (flag) {
                list.push(item)
              }
            }

            // that.search[columnData.fieldName]='';
            if (columnData.isShow === 0)
              that.hideList.push(columnData.fieldName)
            that.queryParam[columnData.fieldName] = !that.$route.query[
              columnData.fieldName
            ]
              ? ''
              : that.$route.query[columnData.fieldName]
          }

          for (let key in sorted) {
            if (key == 'null') {
              sorted[key].forEach(column => addItem(columnlist, column))
            } else {
              /**
             * label: '多级表头',
             children: [{
             label: '信息',
             children: [{
             label: '年龄',
             prop: 'age'
             }, {
                label: '手机号',
                prop: 'phone',
              }]
             */

              let children = []
              sorted[key].forEach(column => addItem(children, column))

              columnlist.push({
                label: key,
                children: children
              })
            }
          }
          that.aoption.column = columnlist.filter(
            item => item.search == true || item.hide == true
          )

          that.udiy = udiy
          if (udiy) {
            that.udiy.forEach(item => {
              try {
                let filter = that.aoption.column.filter(
                  item2 => item2.prop === item
                )
                if (filter && filter.length >= 1) {
                  that.hideList.push(item)
                  filter[0].hide = false
                }
              } catch (e) {}
            })
          }

          this.$nextTick(() => {
            this.columnLoading = false
            this.$refs.crud.init()
          })

          if (this.reportHead.isAuto) {
            this.onLoad(this.page, this.search)
          }

          // this.$route.meta.title=this.cgreportHeadName;
        })
    },
    created() {
      // window.addEventListener('resize', () => {
      //   this.aoption.height = calcHeightx(387);
      // });
      // this.aoption.height = calcHeightx(387);
    },

    async onLoad(page, params) {
      let queryParam = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...params,
        ...this.search
      }

      this.loadData(queryParam)
    },
    formatParams(params) {
      for (let key in params) {
        if (params[key] instanceof Array) {
          const obj = params[key]
          if (obj[0] && obj[1]) {
            params[key + 'Min'] = obj[0]
            let time = null
            if (obj[2]) {
              time = moment(obj[1]).endOf('month').format('YYYY-MM-DD 23:59:59')
            } else {
              time = moment(obj[1]).format('YYYY-MM-DD 23:59:59')
            }
            params[key + 'Max'] = time
            if (obj[2] != undefined) params['mtype'] = obj[2]
          }

          delete params[key]
        }
      }

      const requestData = filterObj({
        ...params
        // hide: hide
      })
      let flag = false
      try {
        flag = this.js.loadbefore(this, requestData)
      } catch (e) {
        console.error(e)
      }
      if (flag) {
        //loadbefore 内部阻止 请求继续
        throw new Error('request stop')
      }

      // const hide = this.hideList.join(",");
      if (this.reportHead.isPage) {
        delete requestData['pageNo']
        delete requestData['pageSize']
      } else {
        if (this.page.total > 0) {
          requestData['pageTotal'] = this.page.total
        }
      }

      return requestData
    },
    async loadData(params) {
      if (this.defaultParams) {
        Object.assign(params, this.defaultParams)
      }
      let requestData = this.formatParams(params)

      if (this.test) {
        requestData['test'] = 'true'
      }
      let res = await service.report.getDataFromService(
        this.reportHead.dbSource,
        this.$route.params.code,
        requestData
      )
      const data = res.data
      // if (!this.reportHead.isPage) {
      this.page.total = res.count
      // } else {
      //   this.page.total = 0;
      // }
      try {
        this.js.loadafter(this, data, requestData)
      } catch (e) {
        console.error(e)
      }
      this.data = data
      this.$refs.crud.doLayout()
    },
    async loadexcel(params) {
      // const hide = this.hideList.join(",");
      let queryParam = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...params,
        ...this.search
      }

      if (this.defaultParams) {
        Object.assign(queryParam, this.defaultParams)
      }
      let requestData = this.formatParams(queryParam)

      if (this.test) {
        requestData['test'] = 'true'
      }
      let res = await service.report.getDataFromService(
        this.reportHead.dbSource,
        this.$route.params.code,
        requestData
      )

      if (this.js) {
        try {
          this.js.loadafter(this, res.data, requestData)
        } catch (e) {
          console.error(e)
        }
        //格式化输出所有数据
        for (let i = 0; i < res.data.length; i++) {
          let resKey = res.data[i]
          for (let resKeyKey in resKey) {
            try {
              resKey[resKeyKey] = this.js.cellformat(this, resKeyKey, resKey)
            } catch (e) {}
          }
        }
      }
      return res
    },
    async searchChange(params, done) {
      this.page.pageNo = 1
      this.page.total = 0
      //const hide = this.hideList.join(",");
      //hide: hide,
      let datap = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...params
      }
      await this.loadData(datap).catch(() => done())
      done()
    },
    refresh() {
      // this.searchForm = {};
    },

    summaryMethod({ columns, data }) {
      try {
        if (this.js) {
          let sumArr = []
          sumArr = this.js.summary(this, columns, data)
          for (let i = 0; i < sumArr.length; i++) {
            if (String(sumArr[i]).indexOf('.') != -1) {
              sumArr[i] = parseFloat(sumArr[i]).toFixed(2)
            }
          }
          // return this.js.summary(this, columns, data);
          return sumArr
        }
      } catch (e) {
        console.error(e)
        return ''
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      try {
        if (this.js)
          return this.js.spanMethod(this, row, column, rowIndex, columnIndex)
      } catch (e) {
        console.error(e)
        return [1, 1]
      }
    },
    cellformat(column, row) {
      try {
        if (column.fieldType == 'money') {
          return parseFloat(row[column.fieldName]).toFixed(2)
        }
        if (this.js) {
          return this.js.cellformat(this, column.fieldName, row)
        }
      } catch (e) {
        console.error(e)
        return row[column.fieldName]
      }
    },

    cellStyle({ row, column }) {
      try {
        if (column.property && this.js) {
          return this.js.cellstyle(this, row, column.property)
        }
      } catch (e) {
        console.error(e)
        return {}
      }
    }
  }
}
</script>
<style scoped lang="scss">
.div {
  display: flex;
  align-items: center;
  height: 500px;
}

///deep/ .el-table--mini, .el-input--mini {
//  font-size: 13px;
//}

.el-table .cell {
  webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 8px;
  padding-right: 5px;
  padding-left: 5px;
}

/deep/ .el-table {
  display: flex;
  flex-direction: column; //垂直排列
}

/deep/ .el-table__body-wrapper {
  flex: 1; //表格高度自适应，因为flex布局的原因，会自动撑满
  position: relative;
  z-index: 1;
}

// /deep/ .el-table__body{
//   height: 100%;
// }
///deep/ .el-table__cell {
//  height: 40px !important;
//}

/deep/ .el-table__empty-block {
  position: absolute;
  top: 0;
}

/deep/ .el-date-editor .el-range-input {
  width: 45%;
}

/deep/ .el-date-editor--daterange {
  width: 220px !important;
}

//带时间的日期范围控件长度
/deep/ .el-date-editor--datetimerange {
  width: 350px !important;
}

/deep/ .monthday {
  width: 260px;
}

/deep/ .el-table__header {
  thead {
    .is-right {
      text-align: center;
    }
  }
}

/deep/ .el-form-item__error {
  z-index: 9999999;
}

/deep/ .avue-crud__pagination {
  position: relative;
  padding: 10px 0 0px 20px !important;
  text-align: right;
}

/deep/ .avue-crud__menu {
  display: inline-flex;
  position: absolute;
  /* display: flex; */
  -webkit-box-pack: justify;
  right: 10px;
  top: 20px;
  z-index: 999;
  -ms-flex-pack: justify;
  justify-content: space-between;
  /* position: relative; */
  width: auto;
  height: auto;
  overflow: hidden;
  background-color: transparent;
}

/deep/ .avue-form {
  position: relative;
  margin: 0 auto;
  margin-bottom: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

//
///deep/ .el-table__cell {
//  padding: 2px 0;
//}
//
///deep/ .el-table--small {
//  font-size: 13px !important;;
//}
//
///deep/ .el-form-item__label {
//  font-size: 13px !important;
//}
//
///deep/ .el-input--small {
//  font-size: 13px !important;
//}

.bottom_content {
  margin-top: 5px;
  width: 100%;
  padding-left: 10px;
  margin-bottom: 5px;
}

/deep/ .avue-crud__search .el-card__body .avue-form {
  margin: 0 !important;
}
</style>
