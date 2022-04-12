<template>
  <div class="app-container">
    <el-form ref="userSearchForm" :inline="true" label-position="left" label-width="80px" :model="userSearchForm">
      <el-row>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userSearchForm.username" />
        </el-form-item>
        <el-form-item label="用户类型" prop="type">
          <el-select v-model="userSearchForm.type" placeholder="用户类型">
            <el-option label="-" value="" />
            <el-option label="系统用户" value="0" />
            <el-option label="平台用户" value="1" />
            <el-option label="客户用户" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="userSearchForm.status" placeholder="用户状态">
            <el-option label="-" value="" />
            <el-option label="禁用" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('userSearchForm')">重置</el-button>
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchUserListData">查询</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addUserForm.visible = true">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeUser()">删除</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="forceRemoveUser()">强制删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :data="userTableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleUserTableSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="username"
        label="用户名"
      />
      <el-table-column
        prop="typeString"
        label="类型"
      />
      <el-table-column
        prop="desc"
        label="备注"
      />
      <el-table-column
        prop="createdDate"
        label="创建时间"
      />
      <el-table-column
        prop="statusString"
        label="状态"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="switchUserStatus(scope.row)">{{ scope.row.statusString }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="showResetPasswordDialog(scope.row.idString)"
          >
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="userSearchForm.pageNumber"
      :page-sizes="[10, 15, 30, 50, 100, 200, 300, 400]"
      :page-size="userSearchForm.pageSize"
      :total="userSearchForm.totalElements"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleUserTableSizeChange"
      @current-change="handleUserTableCurrentChange"
    />
    <el-dialog title="添加用户" :visible.sync="addUserForm.visible" width="50%">
      <el-form ref="addUserForm" :model="addUserForm" :rules="addUserRules">
        <el-form-item label="用户类型" label-width="120px" prop="type">
          <el-select ref="type" v-model="addUserForm.type" placeholder="请选择用户类型" @change="addUserFormTypeChange">
            <el-option label="系统用户" value="0" />
            <el-option label="平台用户" value="1" />
            <el-option label="客户用户" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="addUserForm.showPlatform" label="平台" label-width="120px" prop="platformName">
          <el-input ref="platformName" v-model="addUserForm.platformName" disabled @click.native="platformChooser.visible = true" />
        </el-form-item>
        <el-form-item v-show="addUserForm.showCompany" label="公司" label-width="120px" prop="companyName">
          <el-input ref="companyName" v-model="addUserForm.companyName" disabled @click.native="showCompanyChooser" />
        </el-form-item>
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model.trim="addUserForm.username" placeholder="请输入用户名" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model.trim="addUserForm.password" placeholder="请输入密码" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户状态" label-width="120px" prop="status">
          <el-select ref="status" v-model="addUserForm.status" placeholder="请选择用户状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="desc">
          <el-input v-model.trim="addUserForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordDialog"
      width="30%"
    >
      <el-form>
        <el-form-item label="密码" :rules="[{ required: true, trigger: 'blur', message: '密码不能为空' }]">
          <el-input v-model.trim="newPassword" placeholder="请输入密码" type="text" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>
    <chooser
      :title="platformChooser.title"
      :visible="platformChooser.visible"
      :data="platformChooser.data"
      :columns="platformChooser.columns"
      :search-items="platformChooser.searchItems"
      :current-page="platformChooser.searchForm.pageNumber"
      :page-size="platformChooser.searchForm.pageSize"
      :total="platformChooser.searchForm.totalElements"
      @handleSizeChange="handlePlatformChooseSizeChange"
      @handleCurrentChange="handlePlatformChooseCurrentChange"
      @close="switchPlatformChooserVisible"
      @search="platformChooserSearch"
      @doSelect="getPlatformChooserData"
    />
    <chooser
      :title="companyChooser.title"
      :visible="companyChooser.visible"
      :data="companyChooser.data"
      :columns="companyChooser.columns"
      :search-items="companyChooser.searchItems"
      :current-page="companyChooser.searchForm.pageNumber"
      :page-size="companyChooser.searchForm.pageSize"
      :total="companyChooser.searchForm.totalElements"
      @handleSizeChange="handleCompanyChooseSizeChange"
      @handleCurrentChange="handleCompanyChooseCurrentChange"
      @close="switchCompanyChooserVisible"
      @search="companyChooserSearch"
      @doSelect="getCompanyChooserData"
    />
  </div>
</template>

<script>
import Chooser from '@/components/Chooser'
import { getUser, saveUser, deleteUser, forceRemoveUser, resetPassword, switchUserStatus } from '@/api/console/user'
import { getPlatform } from '@/api/console/platform'
import { getCompany } from '@/api/console/company'
import { isLength } from '@/utils/validate'
import { vrender, removeById } from '@/utils'
export default {
  name: 'ConsoleSystemUserList',
  components: {
    Chooser
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isLength(value, 1, 32)) {
        callback(new Error('用户名不合法！'))
      } else {
        getUser({ 'usernameEuq': value }).then(response => {
          if (response.code !== '25200' || response.data.content.length > 0) {
            callback(new Error('用户名已被占用！'))
          } else {
            callback()
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!isLength(value, 6, 32)) {
        callback(new Error('密码不合法！'))
      } else {
        callback()
      }
    }
    return {
      resetPasswordDialog: false,
      resetPasswordId: '',
      newPassword: '',
      userSearchForm: {
        username: '',
        type: '',
        status: '',
        pageNumber: 1,
        pageSize: 10,
        totalElements: 1
      },
      addUserForm: {
        visible: false,
        platformId: '',
        platformName: '',
        companyId: '',
        companyName: '',
        username: '',
        password: '',
        type: '',
        status: '',
        desc: '',
        showPlatform: false,
        showCompany: false
      },
      addUserRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        type: { required: true, trigger: 'blur', message: '请选择用户类型' },
        status: { required: true, trigger: 'blur', message: '请选择用户状态' }
      },
      userTableData: [],
      userTableMultipleSelection: [],
      platformChooser: {
        title: '选择平台',
        visible: false,
        data: [],
        columns: [
          {
            'number': 1,
            'property': 'name',
            'label': '平台'
          },
          {
            'number': 2,
            'property': 'username',
            'label': '用户'
          },
          {
            'number': 3,
            'property': 'companyName',
            'label': '公司名'
          }
        ],
        searchItems: [
          {
            'number': 1,
            'model': '',
            'label': '名称'
          }
        ],
        inputKey: '', // 控制选择器填入位置
        searchForm: {
          name: '',
          pageNumber: 1,
          pageSize: 5,
          totalElements: 1
        }
      },
      companyChooser: {
        title: '选择公司',
        visible: false,
        data: [],
        columns: [
          {
            'number': 1,
            'property': 'companyName',
            'label': '公司'
          },
          {
            'number': 2,
            'property': 'username',
            'label': '用户'
          }
        ],
        searchItems: [
          {
            'number': 1,
            'model': '',
            'label': '名称'
          }
        ],
        inputKey: '', // 控制选择器填入位置
        searchForm: {
          companyName: '',
          pageNumber: 1,
          pageSize: 5,
          totalElements: 1
        }
      }
    }
  },
  created() {
    this.searchUserListData()
    this.searchPlatformChooserListData()
    this.searchCompanyChooserListData()
  },
  methods: {
    removeUser() {
      // 拿到选中的数据
      const val = this.userTableMultipleSelection
      const irender = {
        '45010': '参数不合法！',
        '45020': '存在admin用户不可删除！',
        '45030': '不可以删除自己！',
        '45040': '存在公司管理员，请使用强制删除！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！',
        '55030': '操作失败，请稍后尝试或联系客服！'
      }
      removeById(this, val, irender, deleteUser, this.searchUserListData)
    },
    forceRemoveUser() {
      // 拿到选中的数据
      const val = this.userTableMultipleSelection
      const irender = {
        '45010': '参数不合法！',
        '45020': '存在admin用户不可删除！',
        '45030': '不可以删除自己！',
        '45040': '存在公司管理员，请使用强制删除！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！',
        '55030': '操作失败，请稍后尝试或联系客服！',
        '55040': '操作失败，请稍后尝试或联系客服！',
        '55050': '操作失败，请稍后尝试或联系客服！',
        '55060': '操作失败，请稍后尝试或联系客服！',
        '55070': '操作失败，请稍后尝试或联系客服！'
      }
      removeById(this, val, irender, forceRemoveUser, this.searchUserListData)
    },
    searchUserListData() {
      const params = {
        username: this.userSearchForm.username,
        type: this.userSearchForm.type,
        status: this.userSearchForm.status,
        pageNumber: this.userSearchForm.pageNumber,
        pageSize: this.userSearchForm.pageSize
      }
      getUser(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.userTableData = data.content
          this.userSearchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleUserTableSelectionChange(val) {
      this.userTableMultipleSelection = val
    },
    // 每页条数变化
    handleUserTableSizeChange(val) {
      this.userSearchForm.pageSize = val
      this.searchUserListData()
    },
    // 当前页变化
    handleUserTableCurrentChange(val) {
      this.userSearchForm.pageNumber = val
      this.searchUserListData()
    },
    // 添加用户
    addUser() {
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          this.loading = true
          const irender = {
            '45010': '类型不合法！',
            '45020': '用户名不合法！',
            '45030': '密码不合法！',
            '45040': '平台不合法！',
            '45050': '公司不合法！',
            '45060': '状态不合法！',
            '45070': '备注不合法！',
            '45409': '用户已经存在！',
            '55010': '操作失败，请稍后尝试或联系客服！',
            '55020': '操作失败，请稍后尝试或联系客服！'
          }
          const params = {
            'platformId': this.addUserForm.platformId,
            'companyId': this.addUserForm.companyId,
            'username': this.addUserForm.username,
            'password': this.addUserForm.password,
            'type': this.addUserForm.type,
            'status': this.addUserForm.status,
            'desc': this.addUserForm.desc
          }
          saveUser(params).then(response => {
            const code = response.code
            if (code !== '25200') {
              vrender(this, irender, code)
              return
            }
            this.resetForm('addUserForm')
            this.addUserForm.visible = false
            this.$message({ message: '保存成功！', type: 'success' })
            this.searchUserListData()
          }).catch(error => {
            console.log(error)
          })
          this.loading = false
        } else {
          return false
        }
      })
    },
    // 用户类型变化
    addUserFormTypeChange() {
      this.addUserForm.showPlatform = this.addUserForm.type > 0
      this.addUserForm.showCompany = this.addUserForm.type > 1
    },
    // 切换用户状态
    switchUserStatus(val) {
      this.$confirm('确定要' + (val.status === '1' ? '禁用' : '启用') + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const irender = {
          '45010': '参数不合法！',
          '45404': '用户不存在！',
          '55010': '操作失败，请稍后尝试或联系客服！',
          '55020': '操作失败，请稍后尝试或联系客服！'
        }
        switchUserStatus({ 'id': val.idString }).then(response => {
          const code = response.code
          if (code !== '25200') {
            this.$message.error(irender[code])
            return
          }
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.searchUserListData()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    showResetPasswordDialog(id) {
      this.resetPasswordId = id
      this.resetPasswordDialog = true
    },
    resetPassword() {
      const irender = {
        '45010': '用户不合法！',
        '45020': '密码不合法！',
        '45404': '用户不存在！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！'
      }
      resetPassword({ 'id': this.resetPasswordId, 'password': this.newPassword }).then(response => {
        const code = response.code
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.$message({
          message: '重置成功！',
          type: 'success'
        })
        this.resetPasswordDialog = false
        this.resetPasswordId = ''
        this.newPassword = ''
      }).catch(() => {})
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 平台选择器开始
    searchPlatformChooserListData() {
      const params = {
        name: this.platformChooser.searchForm.name,
        pageNumber: this.platformChooser.searchForm.pageNumber,
        pageSize: this.platformChooser.searchForm.pageSize
      }
      getPlatform(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.platformChooser.data = data.content
          this.platformChooser.searchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handlePlatformChooseSizeChange(val) {
      this.platformChooser.searchForm.pageSize = val
      this.searchPlatformChooserListData()
    },
    handlePlatformChooseCurrentChange(val) {
      this.platformChooser.searchForm.pageNumber = val
      this.searchPlatformChooserListData()
    },
    platformChooserSearch(val) {
      this.platformChooser.searchForm.name = val[0].model
      this.searchPlatformChooserListData()
    },
    switchPlatformChooserVisible(val) {
      this.platformChooser.visible = val
    },
    getPlatformChooserData(val) {
      this.addUserForm.platformId = val[0].idString
      this.addUserForm.platformName = val[0].name
    },
    // 平台选择器结束
    // 公司选择器开始
    showCompanyChooser() {
      if (this.addUserForm.platformId) {
        this.companyChooser.visible = true
        this.searchCompanyChooserListData()
      } else {
        this.$message.error('请先选择平台')
      }
    },
    searchCompanyChooserListData() {
      if (!this.addUserForm.platformId) {
        return
      }
      const params = {
        platformId: this.addUserForm.platformId,
        companyName: this.companyChooser.searchForm.companyName,
        pageNumber: this.companyChooser.searchForm.pageNumber,
        pageSize: this.companyChooser.searchForm.pageSize
      }

      getCompany(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.companyChooser.data = data.content
          this.companyChooser.searchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleCompanyChooseSizeChange(val) {
      this.companyChooser.searchForm.pageSize = val
      this.searchCompanyChooserListData()
    },
    handleCompanyChooseCurrentChange(val) {
      this.companyChooser.searchForm.pageNumber = val
      this.searchCompanyChooserListData()
    },
    companyChooserSearch(val) {
      this.companyChooser.searchForm.companyName = val[0].model
      this.searchCompanyChooserListData()
    },
    switchCompanyChooserVisible(val) {
      this.companyChooser.visible = val
    },
    getCompanyChooserData(val) {
      this.addUserForm.companyId = val[0].idString
      this.addUserForm.companyName = val[0].companyName
    }
    // 公司选择器结束
  }
}

</script>

<style scoped>

</style>
