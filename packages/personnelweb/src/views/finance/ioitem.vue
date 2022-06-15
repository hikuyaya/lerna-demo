<template>
  <div class="">
    <el-tabs v-model="activeName">
      <el-tab-pane label="子级支出项目维护" name="item">
        <el-collapse-transition>
          <div v-show="showList">
            <el-row>
              <el-button @click="jobAlert(false, '')" type="primary"
                >添加</el-button
              >
            </el-row>
            <div style="margin-top: -5px">
              <el-divider />
            </div>
            <el-form ref="searchForm" inline :model="searchForm">
              <el-form-item label="项目描述：" prop="name">
                <el-input
                  v-model="searchForm.name"
                  style="width: 150px"></el-input>
              </el-form-item>

              <el-form-item label="类型：" prop="type">
                <el-select
                  v-model="searchForm.type"
                  clearable
                  placeholder="请选择">
                  <el-option label="收入" value="1"></el-option>
                  <el-option label="支出" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态：" prop="status">
                <el-select
                  v-model="searchForm.status"
                  clearable
                  placeholder="请选择">
                  <el-option label="正常" value="1"></el-option>
                  <el-option label="停用" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button @click="search" type="primary">查询</el-button>
                <el-button @click="rest" type="primary">重置</el-button>
              </el-form-item>
            </el-form>
            <yid-table
              pagination
              ref="table"
              :data="jobData"
              style="margin-top: 15px"
              :row-class-name="$yid.util.getTableClass">
              <yid-table-column
                label="收支项目编码"
                min-width="100"
                prop="code"></yid-table-column>
              <yid-table-column
                label="收支项目描述"
                min-width="150"
                prop="name"></yid-table-column>
              <yid-table-column
                label="收支项目类型"
                min-width="150"
                prop="type">
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">收入</span>
                  <span v-if="scope.row.type == 2">支出</span>
                </template>
              </yid-table-column>
              <yid-table-column
                label="父级收支项目"
                min-width="150"
                prop="pname">
              </yid-table-column>
              <yid-table-column
                label="预算期初金额"
                min-width="150"
                prop="budget">
              </yid-table-column>

              <yid-table-column label="状态" min-width="50" prop="status">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">正常</span>
                  <span v-if="scope.row.status == 0" style="color: red"
                    >停用</span
                  >
                </template>
              </yid-table-column>
              <yid-table-column
                label="备注"
                min-width="250"
                prop="memo"></yid-table-column>
              <yid-table-column label="操作" min-width="150" prop="content">
                <template slot-scope="scope">
                  <el-link type="primary" @click="jobAlert(true, scope.row)"
                    >编辑</el-link
                  >
                  <!--
                            <el-link type="primary" @click="jobDelete(scope.row)" style="margin: 0 10px 0 10px;">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
-->
                </template>
              </yid-table-column>
            </yid-table>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="!showList">
            <el-button @click="back" type="primary">返回</el-button>
            <el-button @click="saveJob" type="primary">保存</el-button>
            <div style="margin-top: -5px">
              <el-divider />
            </div>

            <el-form
              ref="positionForm"
              :model="positionForm"
              label-width="140px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item
                    label="收支项目编码："
                    prop="code"
                    :rules="[{ required: true, message: '收支项目编号为空' }]">
                    {{ positionForm.code }}
                  </el-form-item>
                  <el-form-item
                    label="收支项目类型："
                    prop="type"
                    :rules="[
                      { required: true, message: '请选择收支项目类型' }
                    ]">
                    <el-select
                      value-key="id"
                      placeholder="请选择"
                      v-model.trim="positionForm.type">
                      <el-option label="收入" value="1"></el-option>
                      <el-option label="支出" value="2"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="父级收支类型：" prop="pcode">
                    <el-select
                      value-key="pid"
                      placeholder="请选择"
                      v-model="positionForm.pcode"
                      :rules="[
                        { required: true, message: '请选择父级收支类型' }
                      ]">
                      <el-option
                        :key="item.id"
                        :value="item.code"
                        :label="item.name"
                        v-for="item in pioitems" />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="收支项目名称："
                    prop="name"
                    :rules="[{ required: true, message: '收支项目名称为空' }]">
                    <el-input
                      v-model="positionForm.name"
                      maxlength="32"
                      show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item
                    label="预算期初金额："
                    prop="budget"
                    :rules="[{ required: true, message: '预算期初金额为空' }]">
                    <el-input-number
                      :precision="2"
                      min="-1"
                      v-model="positionForm.budget"></el-input-number>
                    限制金额负数只能为:-1,表示不作限制
                  </el-form-item>

                  <el-form-item
                    label="状态："
                    prop="status"
                    :rules="[{ required: true, message: '请选择状态' }]">
                    <el-select
                      value-key="id"
                      placeholder="请选择"
                      v-model.trim="positionForm.status">
                      <el-option label="正常" value="1"></el-option>
                      <el-option label="停用" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注：" prop="memo">
                    <el-input
                      v-model="positionForm.memo"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 8 }"
                      maxlength="1000"
                      show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-transition>
      </el-tab-pane>

      <el-tab-pane label="父级支出项目维护" name="pitem">
        <el-collapse-transition>
          <div v-show="transactionShow">
            <el-row>
              <el-button @click="backP(true)" type="primary">添加</el-button>
            </el-row>
            <div style="margin-top: -5px">
              <el-divider />
            </div>
            <el-form ref="elsearchPForm" inline :model="searchPForm">
              <el-form-item label="项目描述：" prop="name">
                <el-input
                  v-model="searchPForm.name"
                  style="width: 150px"></el-input>
              </el-form-item>

              <el-form-item label="类型：" prop="type">
                <el-select
                  v-model="searchPForm.type"
                  clearable
                  placeholder="请选择">
                  <el-option label="收入" value="1"></el-option>
                  <el-option label="支出" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态：" prop="status">
                <el-select
                  v-model="searchPForm.status"
                  clearable
                  placeholder="请选择">
                  <el-option label="正常" value="1"></el-option>
                  <el-option label="停用" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button @click="searchP" type="primary">查询</el-button>
                <el-button @click="restP" type="primary">重置</el-button>
              </el-form-item>
            </el-form>
            <yid-table
              pagination
              ref="elTable"
              :data="jobData"
              style="margin-top: 15px"
              :row-class-name="$yid.util.getTableClass">
              <yid-table-column
                label="收支项目编码"
                min-width="100"
                prop="code"></yid-table-column>
              <yid-table-column
                label="收支项目描述"
                min-width="150"
                prop="name"></yid-table-column>
              <yid-table-column
                label="收支项目类型"
                min-width="150"
                prop="type">
                <template slot-scope="scope">
                  {{ scope.row.type == 1 ? '收入' : '支出' }}
                </template>
              </yid-table-column>
              <yid-table-column label="状态" min-width="50" prop="status">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">正常</span>
                  <span v-if="scope.row.status == 0" style="color: red"
                    >停用</span
                  >
                </template>
              </yid-table-column>
              <yid-table-column
                label="备注"
                min-width="250"
                prop="memo"></yid-table-column>
              <yid-table-column label="操作" min-width="150" prop="content">
                <template slot-scope="scope">
                  <el-link type="primary" @click="toEditP(scope.row)"
                    >编辑</el-link
                  >
                </template>
              </yid-table-column>
            </yid-table>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="!transactionShow">
            <el-button @click="backP(false)" type="primary">返回</el-button>
            <el-button @click="save" type="primary">保存</el-button>
            <div style="margin-top: -5px">
              <el-divider />
            </div>

            <el-form ref="elPioitemForm" :model="pioitem" label-width="140px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item
                    label="收支项目编码："
                    prop="code"
                    :rules="[{ required: true, message: '收支项目编号为空' }]">
                    {{ pioitem.code }}
                  </el-form-item>
                  <el-form-item
                    label="收支项目类型："
                    prop="type"
                    :rules="[
                      { required: true, message: '请选择收支项目类型' }
                    ]">
                    <el-select
                      value-key="id"
                      placeholder="请选择"
                      v-model.trim="pioitem.type">
                      <el-option label="收入" value="1"></el-option>
                      <el-option label="支出" value="2"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    label="收支项目名称："
                    prop="name"
                    :rules="[{ required: true, message: '收支项目名称为空' }]">
                    <el-input
                      v-model="pioitem.name"
                      maxlength="32"
                      show-word-limit></el-input>
                  </el-form-item>

                  <el-form-item
                    label="状态："
                    prop="status"
                    :rules="[{ required: true, message: '请选择状态' }]">
                    <el-select
                      value-key="id"
                      placeholder="请选择"
                      v-model.trim="pioitem.status">
                      <el-option label="正常" value="1"></el-option>
                      <el-option label="停用" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注：" prop="memo">
                    <el-input
                      v-model="pioitem.memo"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 8 }"
                      maxlength="1000"
                      show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
export default {
  name: 'dept',
  data() {
    return {
      activeName: 'item',
      showList: true,
      transactionShow: true,
      type: '1',
      searchForm: {
        type: '',
        status: '',
        name: ''
      },
      searchPForm: { name: '', type: '', status: '' },
      status: '2',
      positionForm: {
        code: '',
        type: '',
        pcode: '',
        name: '',
        memo: '',
        status: '',
        budget: ''
      },
      pioitem: { id: '', code: '', name: '', type: '', status: '', memo: '' },
      pageInfo: { page: 1, limit: 10 },
      maxCode: 0,
      ioitemData: [],
      ioitemDataAll: [],
      pilist: [],
      polist: [],
      jobData: [],
      jobDataAll: []
    }
  },
  created() {},
  computed: {
    pioitems: function () {
      if (this.positionForm.type == '1') return this.pilist
      if (this.positionForm.type == '2') return this.polist
      return []
    }
  },
  mounted() {
    this.getjobList()
    $yid.service.finance.pioitem.listAll({ status: '1' }).then(res => {
      if (res.resp_code == 200 && res.data.length > 0) {
        this.pilist = res.data.filter(p => p.type == '1')
        this.polist = res.data.filter(p => p.type == '2')
        this.ioitemDataAll = res.data
      }
    })
  },
  methods: {
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchForm)
    },
    rest() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.name = ''
      this.searchForm.type = ''
      this.searchForm.status = ''
      this.search()
    },

    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.ioitem.jobList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },

    getjobList(type) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.ioitem.jobList
      const params = this.pageInfo
      params.type = type

      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    getjobListAll() {
      service.finance.ioitem.jobAll({}).then(res => {
        if (res.resp_code == 200) {
          this.jobDataAll = res.data
        }
      })
    },

    getJobMaxId() {
      service.finance.ioitem.getJobMaxId().then(res => {
        this.positionForm.code = res.data
      })
    },

    jobAlert(tag, row) {
      this.showList = false

      if (tag == false) {
        this.positionForm.id = ''
        /**获取最大职务id+1**/
        this.getJobMaxId()
        //this.$refs['positionForm'].resetFields();
        this.positionForm.code = ''
        this.positionForm.name = ''
        this.positionForm.type = ''
        this.positionForm.status = ''
        this.positionForm.memo = ''
        this.positionForm.budget = ''
        this.positionForm.pcode = ''
        this.positionForm.pid = ''
      } else {
        this.positionForm.id = row.id
        this.positionForm.code = row.code
        this.positionForm.name = row.name
        this.positionForm.type = row.type
        this.positionForm.status = row.status
        this.positionForm.memo = row.memo
        this.positionForm.budget = row.budget
        this.positionForm.pcode = row.pcode
      }
    },
    saveJob() {
      this.$refs['positionForm'].validate(valid => {
        if (valid) {
          let budget = this.positionForm.budget

          if (Number(budget) < 0 && Number(budget) != -1) {
            yid.util.error('限制金额不能为负数(负数只能为:-1)!')
            return
          }
          //获取部门id
          let pobj = {}
          let pcode = this.positionForm.pcode
          pobj = this.ioitemDataAll.find(item => {
            return item.code === pcode
          })
          if (!yid.util.isEmpty(pcode)) {
            this.positionForm.pid = pobj.id
          }

          service.finance.ioitem.saveJob(this.positionForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success(res.resp_msg)
              this.back()
              this.getjobList()
            } else {
              yid.util.error(res.resp_msg)
            }
          })
        }
      })
    },
    back() {
      this.$refs['positionForm'].resetFields()
      this.showList = true
    },

    searchP() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs['elTable'].Pagination.internalPageSize
      const fetch = $yid.service.finance.pioitem.page
      const params = { ...this.pageInfo, ...this.searchPForm }
      this.$refs['elTable'].reloadData({
        fetch,
        params
      })
    },
    restP() {
      this.$refs['elsearchPForm'].resetFields()
    },
    toEditP(row) {
      this.pioitem = row
      this.transactionShow = !this.transactionShow
    },
    backP(tag) {
      this.pioitem = {
        id: '',
        code: '',
        name: '',
        type: '',
        status: '',
        memo: ''
      }
      if (tag) {
        $yid.service.finance.pioitem.nextCode().then(res => {
          if (res.resp_code == 200) this.pioitem.code = res.data
          this.transactionShow = !this.transactionShow
        })
      } else {
        this.transactionShow = !this.transactionShow
      }
    },
    save() {
      this.$refs['elPioitemForm'].validate(valid => {
        if (valid) {
          $yid.service.finance.pioitem.save(this.pioitem).then(res => {
            if (res.resp_code == 200) {
              $yid.util.success(res.resp_msg)
              this.backP()
              this.searchP()
            } else {
              $yid.util.error(res.resp_msg)
            }
          })
        }
      })
    }
    /* jobDelete(row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.name+'吗？', '','', ()=> {
                    const job = {};
                    job.id = row.id;
                    if(row.status == '1'){//如果是正常-禁用
                        job.status = '0';
                    }else if(row.status == '0'){//如果是禁用-恢复
                        job.status = '1';
                    }else{
                        yid.util.info("收支["+row.bname+"]状态异常")
                        return;
                    }
                    service.finance.ioitem.updateStatusJob(job).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg)
                            return
                        }
                        this.getjobList("");
                    });
                })
            }*/
  }
}
</script>

<style scoped></style>
