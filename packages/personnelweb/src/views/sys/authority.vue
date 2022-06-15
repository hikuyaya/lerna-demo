<template>
  <div class="authority">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="名称：" prop="name">
            <el-input
              clearable
              v-model="searchForm.name"
              placeholder="功能点"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="是否开启授权：" prop="status">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              v-model.trim="searchForm.isOpen"
              style="width: 120px">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 10px">
          <yid-table-column prop="name" label="功能点" width="200">
          </yid-table-column>
          <yid-table-column prop="brandName" label="品牌类型" width="200">
          </yid-table-column>
          <yid-table-column prop="roleNames" label="收银管理员" width="220">
          </yid-table-column>
          <yid-table-column label="特殊门店" width="220">
            <template slot-scope="scope">
              <span v-for="shop in scope.row.shoplist">
                <span> {{ shop.shopcode }}|{{ shop.shopname }}<br /> </span>
              </span>
            </template>
          </yid-table-column>
          <yid-table-column prop="isOpen" label="是否开启授权" width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isOpen"
                active-value="1"
                inactive-value="0"
                active-color="#339933"
                inactive-color="#DCDFE6"
                @change="updateIsOpen(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="editAuthority(scope.row)"
                >编辑</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button @click="saveBill" type="primary">保存</el-button>
        <el-divider />
        <div style="font-size: 15px">授权配置：{{ this.sname }}</div>
        <div>
          <el-form
            ref="authorityForm"
            :model="authorityForm"
            style="margin-top: 16px"
            label-width="150px"
            label-position="right">
            <el-form-item label="管理员角色：" prop="roles">
              <el-select
                clearable
                filterable
                placeholder="请选择"
                multiple
                v-model="authorityForm.roles"
                style="width: 500px">
                <el-option
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  v-for="item in roleList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="特殊门店：" prop="shops">
              <el-button type="primary" @click="selectMoShops(authorityForm)"
                >选择门店</el-button
              >
              <lable style="margin-left: 6px">
                共选中{{
                  authorityForm.shoplist ? authorityForm.shoplist.length : '0'
                }}家门店
              </lable>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-collapse-transition>
    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
      @close="shopDialog.visible = false"
      width="1100px">
      <el-row type="flex" justify="space-between">
        <el-form inline ref="queryShop">
          <el-form-item label="门店：">
            <el-input
              clearable
              v-model="shopDialog.shop"
              placeholder="门店名称/编码"
              style="width: 160px"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select clearable v-model="shopDialog.status">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select clearable v-model="shopDialog.type">
              <el-option label="美发" value="1"></el-option>
              <el-option label="美容" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="queryShop()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="14">
          <yid-table
            pagination
            ref="tableShop"
            style="margin-top: 10px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column
              label="门店编码"
              min-width="60"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column
              label="门店品牌"
              min-width="60"
              prop="brandName"></yid-table-column>
          </yid-table>
        </el-col>
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop()" type="primary" size="mini"
              ><i class="el-icon-right"></i>
            </el-button>
          </div>
        </el-col>
        <el-col :span="8" style="margin-left: 5px">
          <yid-table
            ref="table2"
            style="margin-top: 10px"
            :data="shopDialog.shoplist">
            <yid-table-column
              label="门店编码"
              min-width="80"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column label="业务组" min-width="80" prop="bbid">
              <template slot-scope="scope">
                {{ scope.row.bbid | formatBrand(branchList) }}
              </template>
            </yid-table-column>
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  style="margin: 0 10px 0 10px"
                  @click="deleteShop(scope.row, shopDialog.spname)"
                  >删除
                </el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="setShop()">选好了</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible = false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'

export default {
  name: 'authority',
  data() {
    return {
      showList: true,
      pageInfo: { page: 1, limit: 10 },
      searchForm: {
        name: '',
        brandId: '',
        isOpen: ''
      },
      sname: '',
      authorityForm: {
        id: '',
        code: '',
        name: '',
        brandId: '',
        brandCode: '',
        brandName: '',
        roles: [],
        roleIds: '',
        roleNames: '',
        shoplist: []
      },
      roleList: [],
      brands: [],
      branchList: [], //部门list
      shopDialog: {
        id: '',
        spname: '',
        title: '',
        visible: false,
        shop: '',
        type: '',
        brandId: '',
        region: '',
        shoplist: [],
        status: '1',
        page: 1,
        limit: 10
      }
    }
  },
  mounted() {
    this.getData()
    this.getRoleList()
    this.getBrandList()
    this.getBranchList()
  },
  filters: {
    formatBrand(str, stsList) {
      let label = ''
      stsList.map(m => {
        if (Number(m.id) == str) {
          label = m.bname
        }
      })
      if (label) {
        return label
      } else {
        return str
      }
    }
  },
  methods: {
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchForm)
    },
    getData(reqParams) {
      const fetch = service.chain.authority.listBypage
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    getRoleList() {
      service.sysRole.rolelist().then(res => {
        if (res.resp_code == 200) {
          this.roleList = res.data
        }
      })
    },
    getBrandList() {
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        this.brands = res.data
      })
    },
    getBranchList() {
      service.branch.list({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.branchList = res.data
        }
      })
    },
    updateIsOpen(data) {
      service.chain.authority.saveAuthority(data).then(res => {
        if (res.resp_code == 200) {
          let page = this.$refs.table.Pagination.internalCurrentPage
          this.pageInfo.page = page
          this.getData(this.searchForm)
        }
      })
    },
    editAuthority(row) {
      this.sname = row.name
      this.authorityForm.id = row.id
      this.authorityForm.code = row.code
      this.authorityForm.name = row.name
      this.authorityForm.brandId = row.brandId
      this.authorityForm.brandCode = row.brandCode
      this.authorityForm.brandName = row.brandName
      this.authorityForm.roleIds = row.roleIds
      this.authorityForm.roleNames = row.roleNames
      if (!yid.util.isEmpty(row.roleIds)) {
        let roles = row.roleIds.split(',')
        this.authorityForm.roles = roles
      } else {
        this.authorityForm.roles = []
      }
      this.authorityForm.shoplist = row.shoplist
      this.showList = false
    },
    back() {
      this.showList = true
      this.getData()
    },
    saveBill() {
      const roles = this.authorityForm.roles
      if (roles.length == 0) {
        yid.util.error('请选择管理员角色！')
        return false
      }
      let roleIds = ''
      let roleNames = ''
      if (roles.length > 0) {
        roles.forEach(r => {
          roleIds = roleIds + r + ','
          this.roleList.forEach(role => {
            if (role.id === r) {
              roleNames = roleNames + role.name + ','
            }
          })
        })
      }
      if (roleIds.length > 0) {
        roleIds = roleIds.substring(0, roleIds.length - 1)
      }
      if (roleNames.length > 0) {
        roleNames = roleNames.substring(0, roleNames.length - 1)
      }

      this.authorityForm.roleIds = roleIds
      this.authorityForm.roleNames = roleNames
      service.chain.authority.editAuthority(this.authorityForm).then(res => {
        if (res.resp_code == 200) {
          yid.util.success('更新成功!')
          this.back()
        }
      })
    },
    selectMoShops(authority) {
      this.shopDialog.shoplist = []
      if (null != authority.shoplist && authority.shoplist.length > 0) {
        authority.shoplist.forEach(m => {
          this.shopDialog.shoplist.push({
            shopid: m.shopid,
            shopcode: m.shopcode,
            shopname: m.shopname,
            bbid: m.bbid
          })
        })
      }
      this.shopDialog.visible = true
      this.$refs['tableShop'].clearData()
      this.$refs['queryShop'].resetFields()
    },
    handleSelectionChange(rows) {
      this.selectShops = rows
    },
    queryShop() {
      const fetch = service.chain.servShop.queryShop
      const params = {
        page: this.shopDialog.page,
        limit: this.shopDialog.limit,
        shop: this.shopDialog.shop,
        type: this.shopDialog.type,
        status: this.shopDialog.status,
        brandId: this.authorityForm.brandId
      }
      this.$refs['tableShop'].reloadData({
        fetch,
        params
      })
    },
    addShop() {
      this.selectShops.map(m => {
        let flag = true
        this.shopDialog.shoplist.forEach(p => {
          if (p.id == m.id || p.shopid == m.id) {
            flag = false
          }
        })
        if (flag) {
          service.branch
            .getListByShopType({
              shopid: m.id,
              type: m.type,
              isDel: '0',
              status: '1'
            })
            .then(res => {
              if (res.resp_code == 200) {
                res.data.forEach(e => {
                  this.shopDialog.shoplist.push({
                    shopid: m.id,
                    shopcode: m.shopcode,
                    shopname: m.shopname,
                    bbid: e.id
                  })
                })
              }
            })
        }
      })
    },
    deleteShop(row) {
      let i = -1
      this.shopDialog.shoplist.forEach((p, index) => {
        if (p.shopid == row.shopid) {
          i = index
        }
      })
      this.shopDialog.shoplist.splice(i, 1)
    },
    setShop() {
      this.authorityForm.shoplist = this.shopDialog.shoplist
      this.shopDialog.visible = false
    }
  }
}
</script>

<style scoped lang="scss"></style>
