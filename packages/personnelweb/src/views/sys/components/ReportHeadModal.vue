<template>
  <div>
    <el-dialog
        :title="title"
        width="1200px"
        :destroyOnClose="true"
        :maskClosable="false"
        cancelText="关闭"
        fullscreen
        :visible="true"
        @close="handleClose">


      <avue-form ref="form" v-model="formobj" :option="option" :loading="loading" @submit="submit" @error="error"
                 @keydown.s="saveContent"
                 v-loading.fullscreen.lock="confirmLoading">


        <template slot-scope="scope" slot="reportSql">
          <el-row style="width: 100%;">
            <el-col :span="22">
              <!-- 代码编辑器 -->
              <codeeditor
                  ref="reportSql"
                  language="sql"
                  :fullScreen="true"
                  :lineNumbers="true"
                  placeholder="请输入查询SQL"
                  style="min-height: 120px;"
                  @input="handleInputCgrSql"/>

              <textarea :hidden="true" v-model="scope" name="reportSql"/>
            </el-col>
            <el-col :span="2">

              <el-button type="primary" @click="handleSQLAnalyze">SQL解析</el-button>
              <el-button type="primary" @click="handleSQLAnalyzeResult">解析结果</el-button>
            </el-col>
          </el-row>
        </template>
        <template slot-scope="scope" slot="reportJs">
          <el-row style="width: 100%;">
            <el-col :span="22">
              <!-- 代码编辑器 -->
              <codeeditor2
                  ref="jsCodeEditor"
                  language="javascript"
                  :fullScreen="true"
                  :lineNumbers="true"
                  @input="handleInputJs"
                  :language-change="false"></codeeditor2>

              <textarea :hidden="true" v-model="scope" name="reportJs"/>
            </el-col>
            <el-col :span="2">

              <el-button type="primary" @click="handleJsAnalyze">js语法验证</el-button>
            </el-col>
          </el-row>

        </template>

        <template slot-scope="scope" slot="items">

          <avue-crud ref="crud" :option="option2" @row-update="rowUpdate" @row-del="rowDel" @row-save="rowSave"
                     v-model="form2" :before-open="beforeOpen"
                     :data.sync="itemList">

            <!--            <template slot="menuLeft" slot-scope="{size}">-->
            <!--              <el-button type="danger" icon="el-icon-delete" :size="size" @click="deleteSelect">批量保存</el-button>-->
            <!--            </template>-->

          </avue-crud>
        </template>

        <template slot-scope="scope" slot="menuForm">
          <el-button @click="handleClose">取消</el-button>
        </template>
      </avue-form>


    </el-dialog>
  </div>
</template>

<script>
import codeeditor from './CodeEditor.vue'
import codeeditor2 from './CodeEditor.vue'
import service from '@src/service'
import yid from "@src/library";
import DEFAULT from './default'
import {filterObj} from './dataUtils'


var DIC = {
  db: [

    {
      label: '会员',
      value: 'member-center'
    }, {
      label: '基础',
      value: 'base-center'
    }, {
      label: '收银',
      value: 'cashier-center'
    }, {
      label: '人事',
      value: 'personnel-center'
    }, {
      label: '库存',
      value: 'stock-center'
    }, {
      label: '连锁',
      value: 'chain-center'
    }, {
      label: '预约',
      value: 'yy-center'
    }, {
      label: '报表',
      value: 'report-center'
    }, {
      label: '财务',
      value: 'finance-center'
    }
  ], TYPE: [
    {
      label: '默认文本',
      value: 'input'
    },
    {
      label: '数字',
      value: 'number'
    },
    {
      label: '选择',
      value: 'select'
    },
    {
      label: '开关',
      value: 'switch'
    },
    {
      label: '日期',
      value: 'date',
    },
    {
      label: "月",
      value: "month",
    }, {
      label: "年",
      value: "year",
    },
    {
      label: '日期时间',
      value: 'datetime',
    },
    {
      label: '时间',
      value: 'time',
    },
    {
      label: '时间日期范围',
      value: 'datetimerange',
    }
    , {
      label: "日期范围",
      value: "daterange",
    }
    , {
      label: "自动日或月",
      value: "monthday",
    },
    {
      label: '图片',
      value: 'img',
    },
    {
      label: '级联选择器',
      value: 'cascader',
    },
    {
      label: '区部处',
      value: 'organize',
    },
    {
      label: '金额',
      value: 'money'
    }
  ], HTTP: [{
    label: 'get',
    value: 'get',
  },
    {
      label: 'post',
      value: 'post',
    },]
}
export default {
  name: 'ReportHeadModal',
  components: {
    codeeditor,
    codeeditor2,
  },
  computed: {

    form() {
      return this.$refs["form"]
    }
  },
  data() {
    return {
      confirmLoading: false,
      report: {},
      loading: false,
      form2: {},
      formobj: {
        items: [],
        reportSql: '',
        name: "",
        code: '',
        reportJs: DEFAULT,
        dbSource: '',
        content: '',
        isAuto: false,
        isExcel: true,
        autoQuery: false,
        isPage: false,
        isPrint: true,
        isContent: false,
        isSummary: false,
        isUdiy: false,
        isRange: false
      },
      itemList: [],
      jsValue: "",
      option: {
        size: 'mini',
        mockBtn: false,
        submitText: '保存',
        cancelBtnText: '取消',
        emptyBtn: false,
        labelWidth: 120,
        printBtn: false,
        column: [
          //     {
          //   label: "报表编码",
          //   prop: "code",
          //   span: 6,
          //   maxlength: 20,
          //   minlength: 2,
          //   rules: [{
          //     required: true,
          //     message: "请输入用户名",
          //     trigger: "blur"
          //   }],
          // },
          {
            label: "报表名字",
            prop: "name",
            disabled: false,
            maxlength: 20,
            minlength: 2,
            rules: [{
              required: true,
              message: "请输入报表名字",
              trigger: "blur"
            }],
            span: 6
          },

          {
            label: "数据源",
            prop: "dbSource",
            type: "select",
            dicData: DIC.db,
            span: 6,
            rules: [{
              required: true,
              message: "请选择数据源",
              trigger: "blur"
            }],
          }
          , {
            label: "加载自动查询",
            prop: "isAuto",
            span: 3,
            value: false,
            mock: {
              type: 'autoQuery'
            },
            type: "switch",
            hide: true,
            row: false,
          },
          {
            label: "隐藏查询条件",
            prop: "autoQuery",
            span: 3,
            type: "switch",
            value: false,
            mock: {
              type: 'autoQuery'
            },
            hide: true,
            row: false,
          },
          {
            label: "禁用分页",
            prop: "isPage",
            span: 3,
            value: false,
            type: "switch",
            mock: {
              type: 'nopage'
            },
            hide: true,
            row: false,
            control: (val, form) => {
              if (val === true) {
                return {
                  isSummary: {
                    display: true,
                  },
                  isPrint: {
                    display: true,
                  },
                }
              } else {
                return {
                  isSummary: {
                    disabled: false,
                  },
                  isPrint: {
                    disabled: false,
                  },
                }
              }
            },
          },
          {
            label: "显示合计",
            prop: "isSummary",
            span: 3,
            value: false,
            type: "switch",
            hide: true,
            row: false,
          }, {
            label: "支持打印",
            prop: "isPrint",
            span: 3,
            value: false,
            type: "switch",
            hide: true,
            row: false,
          },
          {
            label: "支持下载",
            prop: "isExcel",
            span: 3,
            value: false,
            type: "switch",
            hide: true,
            row: false,
          },
          {
            label: "支持自选列",
            prop: "isUdiy",
            span: 3,
            type: "switch",
            value: false,
            hide: true,
            row: false,
          },
          {
            label: "显示描述",
            prop: "isContent",
            span: 3,
            value: false,
            type: "switch",
            hide: true,
            row: false,
          },
          {
            label: "描述",
            prop: "content",
            span: 24,
            hide: true,
            type: 'textarea',
            row: true,
            rules: [{
              required: false,
              message: "请输入描述",
              trigger: "blur"
            }],
          },
          {
            label: "测试参数",
            prop: "params",
            span: 24,
            hide: true,
            type: 'textarea',
            row: true,
            rules: [{
              required: false,
              message: "请输入描述",
              trigger: "blur"
            }],
          },
          {
            label: '报表sql',
            prop: 'reportSql',
            formslot: true,
            row: true,
            span: 24,
            rules: [{
              required: true,
              message: "请输入sql",
              trigger: "blur"
            }]
          },
          {
            label: '报表js',
            prop: 'reportJs',
            formslot: true,
            row: true,
            span: 24,
            default: "111",
            rules: [{
              required: true,
              message: "请输入js",
              trigger: "blur"
            }]
          },
          {
            label: '报表字段',
            prop: 'items',
            formslot: true,
            row: true,
            span: 24
          }
        ]
      },
      option2: {
        size: 'mini',
        searchShow: false,
        refreshBtn: false,
        columnBtn: false,
        addRowBtn: false,
        addBtn: true,
        cellBtn: false,
        delBtn: true,
        sortable: true,
        selection: false,
        viewBtn: true,
        menu: true,
        column: [
          {
            label: '字段名',
            prop: 'fieldName',
            // cell: true,
            rules: [
              {
                required: true,
                message: '请输入字段名',
                trigger: 'blur',

              }
            ]
          },
          {
            label: '字段文本',
            prop: 'fieldTxt',
            rules: [
              {
                required: true,
                message: '请输入字段文本',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '字段宽度',
            prop: 'fieldWidth',
            hide: false,
          },
          {
            label: '类型',
            prop: 'fieldType',
            dicData: DIC.TYPE,
            type: 'select',
            rules: [
              {
                required: true,
                message: '请输入类型',
                trigger: 'blur'
              }
            ]
          },

          {
            label: '范围查询',
            prop: 'isRange',
            type: 'switch',
          },
          {
            label: '字典接口',
            prop: 'dictUrl',
            hide: false,
            rules: [
              {
                required: false,
                message: '请输入字典接口',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '字典key属性',
            prop: 'dictKey',
            hide: false,
            rules: [
              {
                required: false,
                message: '请输入字典key',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '字典value属性',
            prop: 'dictValue',
            hide: false,
            rules: [
              {
                required: false,
                message: '请输入字典code',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '请求方法',
            prop: 'dictMethod',
            dicData: DIC.HTTP,
            type: 'select',
            hide: false,
            rules: [
              {
                required: false,
                message: '请输入字典code',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '请求参数',
            prop: 'dictQuery',
            hide: false,
            rules: [
              {
                required: false,
                message: '请输入字典code',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '组标题',
            prop: 'fieldGroup',
            hide: false,
          },
          {
            label: '字段解释',
            prop: 'memo',
            hide: false,
          },
          {
            label: '是否显示',
            prop: 'isShow',
            type: 'switch',
          },
          {
            label: '是否查询',
            prop: 'isSearch',
            type: 'switch',
          },
          {
            label: '支持排序',
            prop: 'isOrder',
            type: 'switch',
          },
          {
            label: '固定列',
            prop: 'isFixed',
            type: 'switch',
          },
          {
            label: '查询必填',
            prop: 'isNonull',
            type: 'switch'
          },
          {
            label: '角色权限',
            prop: 'fieldRole',
            type: 'select',
            multiple: true,
            remote: true,
            props: {
              label: 'name',
              value: 'id'
            },
            dicUrl: `api-user/roles/getSysRoleList`,
            rules: [
              {
                required: false,
                message: '请选择角色',
                trigger: 'blur'
              }
            ]
          }
        ],
      },
      title: '编辑',
      visibles: false,
      reportSql: '',

    }
  },
  async mounted() {
    document.addEventListener("keydown", this.doSave);
  },

  beforeDestroy() {
    document.removeEventListener("keydown", this.doSave);
  },

  watch: {
    report: {
      handler(newValue) {
        if (newValue) {
          let that = this;
          this.$nextTick(() => {   //此处使用这个可以等节点渲染后再获取节点
            that.$refs.reportSql.setCodeContent(newValue.reportSql || '')
            that.$refs.jsCodeEditor.setCodeContent(newValue.reportJs || DEFAULT)
          })
        }
      }
    }
  },

  methods: {
    async doSave(e) {
      if (!(e.keyCode === 83 && e.ctrlKey)) {
        return;
      }

      e.preventDefault();

      if (!this.formobj.isPage && (this.formobj.isPrint || this.formobj.isSummary)) {

        yid.util.error('报表支持分页将不能打印、合计')
        return;
      }

      let that = this;

      this.itemList.forEach(item => {
        item.orderNumber = item.$index + 1;
        item.headId = that.formobj.id;
      })
      let params = {head: this.formobj, items: this.itemList, params: []}
      const resp = await service.report.saveOrUpdate(params);
      if (resp.resp_code == 200) {
        if (resp.data) {
          this.formobj.id = resp.data;
          this.report.id = resp.data;
        }
        this.$yid.util.alert("保存成功");
      }

    },

    async edit(record) {
      this.loading = true
      this.title = record.name;
      await this.getFileds();
      this.loading = false;
    },

    //提交表单
    async submit(form, done) {

      if (!form.isPage && (form.isPrint || form.isSummary)) {

        yid.util.error('报表支持分页将不能打印、合计')
        done();
        return;
      }

      let that = this;

      this.itemList.forEach(item => {
        filterObj(item);
        item.orderNumber = item.$index + 1;
        item.headId = that.formobj.id;
        if (item.fieldRole instanceof Array) {
          item.fieldRole = item.fieldRole.join();
        }

      })
      let params = {head: this.formobj, items: this.itemList, params: []}
      let resp = await service.report.saveOrUpdate(params).catch(err => {
        done()
      });
      done();
      if (resp.resp_code == 200) {
        this.handleClose();
      }

    },
    formatUrl(url) {
      let result = {};
      let split = url.split("&");
      for (let i = 0; i < split.length; i++) {
        var aParam = split[i].split("=");
        result[aParam[0]] = aParam[1]
      }
      return result;
    },
    /** SQL解析 */
    async handleSQLAnalyze() {


      let params = this.formobj.params;
      let data = {};

      try {

        data = JSON.parse(params);
      } catch (e) {
        //years=2021-01-01+00:00:00&pageNo=1&pageSize=10
        if (params.indexOf("&") != -1) {
          data = this.formatUrl(params);
        }

      }
      if (this.formobj.dbSource.length == 0) {
        this.$yid.util.info("请选择数据源")
        return;
      }
      this.confirmLoading = true;
      let that = this;
      const res = await service.report.parseSql(this.formobj.dbSource, {
        sql: this.formobj.reportSql,
        // dbKey: this.formobj.dbSource,
        // params: JSON.stringify(data)
        ...data
      }).catch(() => {
        that.confirmLoading = false;
      });

      try {

        let list = res.data;
        for (var i = 0; i < list.length; i++) {

          let listElement = {
            fieldName: list[i],
            fieldType: "input",
            fieldTxt: list[i],
            orderNumber: i,
            isOrder: false,
            isRange: false,
            isSearch: false,
            isShow: true,
            isNonull: false,
            isFixed: false
          };
          let fieldName = listElement.fieldName;
          let filterElement = that.itemList.filter(item => item.fieldName == fieldName);
          if (!filterElement || filterElement.length == 0) {
            listElement.headId = this.report.id;
            that.itemList.push(listElement);
          }

        }
      } catch (e) {
        console.error(e)
      }
      that.confirmLoading = false;
    },
    async handleSQLAnalyzeResult() {
      let params = this.formobj.params;
      let data = {};


      try {

        data = JSON.parse(params);
      } catch (e) {
        //years=2021-01-01+00:00:00&pageNo=1&pageSize=10
        if (params.indexOf("&") != -1) {
          data = this.formatUrl(params);
        }

      }
      if (this.formobj.dbSource.length == 0) {
        this.$yid.util.info("请选择数据源")
        return;
      }
      this.confirmLoading = true;
      let that = this;
      const res = await service.report.parseSqlResult(this.formobj.dbSource, {
        sql: this.formobj.reportSql,
        ...data
      }).catch(() => {
        that.confirmLoading = false;
      });
      that.confirmLoading = false;
      if (res && res.data) {
        const h = this.$createElement;
        this.$msgbox({
          title: '解析结果',
          message:
              h('div', {style: 'overflow:scroll;max-height:350px;'}, res.data),
          dangerouslyUseHTMLString: true,
          confirmButtonText: "复制"
        }).then(({value}) => {

          this.$Clipboard({
            text: res.data
          }).then(() => {
            this.$message.success('复制成功')
          }).catch(() => {
            this.$message.error('复制失败')
          });
        });
      }

    },
    /** js 验证 */
    handleJsAnalyze() {
      try {
        eval("(" + this.formobj.reportJs + ")");
        this.$yid.util.info("验证通过")
      } catch (e) {
        console.error(e)
        this.$yid.util.error("验证失败");

      }
    },

    async getFileds() {

      const resp = await service.report.getFields(this.report.id)

      this.itemList = resp.data;

    },
    rowAdd(value) {
      this.$message.success('正在添加，请稍后')
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.$refs.crud.rowCellAdd({
            name: '0',
          });
        }
      }, 500)
    },

    beforeOpen(done, type) {
      if (type == 'add') {
        this.form2.fieldType = "input";
        this.form2.isOrder = false;
        this.form2.isRange = false;
        this.form2.isSearch = true;
        this.form2.isShow = false;
        this.form2.isNonull = true;
        this.form2.isFixed = false;
      }
      done();

    },
    rowSave(form, done) {


      this.itemList.push(form);
      done();
    },

    rowDel(form, index) {
      // this.$confirm(`此操作将永久删除序号${index + 1}, 是否继续?`, '提示', {
      //   type: 'warning'
      // }).then(() => {
      this.itemList.splice(index, 1);
      // })
    },
    rowUpdate(form, index, done, loading) {
      // console.error(form)
      Object.assign(this.itemList[index], form)
      // this.$forceUpdate();
      this.$refs.crud.refreshTable();
      done()
    },

    selectionChange() {

    },
    handleInputCgrSql(value) {
      this.formobj.reportSql = value;//.setFieldsValue({ cgrSql: value })
    },
    handleInputJs(value) {
      this.formobj.reportJs = value;//.setFieldsValue({ cgrSql: value })
    },
    error(err) {
      this.$message.error('内容填写不完整');
      console.log(err)
    },
    handleClose() {
      this.$emit('closed');
      //关闭后自己销毁
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }
  },
}

</script>

<style scoped>

</style>
