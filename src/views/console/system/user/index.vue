<template>
  <div class="app-container">
    <el-form :inline="true" label-position="left" label-width="80px" :model="userSearchForm">
      <el-row>
        <el-form-item label="用户名">
          <el-input v-model="userSearchForm.username" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="userSearchForm.type" placeholder="用户类型">
            <el-option label="-" value="" />
            <el-option label="系统用户" value="0" />
            <el-option label="平台用户" value="1" />
            <el-option label="客户用户" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="userSearchForm.status" placeholder="用户状态">
            <el-option label="-" value="" />
            <el-option label="禁用" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addUserDialogForm.visible = true">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delUser()">删除</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delUserAnyway()">强制删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="userTableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
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
      :page-sizes="[15, 30, 50, 100, 200, 300, 400]"
      :page-size="userSearchForm.pageSize"
      :total="userSearchForm.totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="添加用户" :visible.sync="addUserDialogForm.visible" width="50%">
      <el-form ref="addUserDialogForm" :model="addUserDialogForm" :rules="addUserRules">
        <el-form-item label="用户类型" label-width="120px" prop="type">
          <el-select ref="type" v-model="addUserDialogForm.type" placeholder="请选择用户类型" @change="addUserDialogFormTypeChange">
            <el-option label="系统用户" value="0" />
            <el-option label="平台用户" value="1" />
            <el-option label="客户用户" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="addUserDialogForm.showPlatform" label="平台" label-width="120px" prop="platformName">
          <el-input ref="platformName" v-model="addUserDialogForm.platformName" disabled @click.native="platformChooserVisible = true" />
        </el-form-item>
        <el-form-item v-show="addUserDialogForm.showCompany" label="公司" label-width="120px" prop="companyName">
          <el-input ref="companyName" v-model="addUserDialogForm.companyName" disabled @click.native="showCompanyChooser" />
        </el-form-item>
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model.trim="addUserDialogForm.username" placeholder="请输入用户名" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model.trim="addUserDialogForm.password" placeholder="请输入密码" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户状态" label-width="120px" prop="status">
          <el-select ref="status" v-model="addUserDialogForm.status" placeholder="请选择用户状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="desc">
          <el-input v-model.trim="addUserDialogForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="doSaveAddUserDialog">确 定</el-button>
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
    <platform-chooser :parent-platform-chooser-visible="platformChooserVisible" @doClosePlatformChooser="switchPlatformChooserVisible" @doPlatformChooserSelect="getPlatformChooserData" />
    <company-chooser :parent-company-chooser-visible="companyChooserVisible" :platform-id="addUserDialogForm.platformId" @doCloseCompanyChooser="switchCompanyChooserVisible" @doCompanyChooserSelect="getCompanyChooserData" />
  </div>
</template>

<script>
import PlatformChooser from '@/views/console/components/PlatformChooser'
import CompanyChooser from '@/views/console/components/CompanyChooser'
import { getUser, saveUser, deleteUser, deleteUserAnyway, resetPassword, switchUserStatus } from '@/api/console/user'
import { isLength } from '@/utils/validate'
export default {
  name: 'ConsoleSystemUserList',
  components: {
    PlatformChooser,
    CompanyChooser
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
      platformChooserVisible: false,
      companyChooserVisible: false,
      resetPasswordDialog: false,
      resetPasswordId: '',
      newPassword: '',
      userSearchForm: {
        username: '',
        type: '',
        status: '',
        pageNumber: 1,
        pageSize: 15,
        totalPage: 100
      },
      addUserDialogForm: {
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
      multipleSelection: [],
      size: ''
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    delUser() {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 拿到选中的数据
        const val = this.multipleSelection
        // 如果选中数据存在
        if (val) {
          const irender = {
            '45010': '参数不合法！',
            '45020': '存在admin用户不可删除！',
            '45030': '不可以删除自己！',
            '45040': '存在公司管理员，请使用强制删除！',
            '55010': '操作失败，请稍后尝试或联系客服！',
            '55020': '操作失败，请稍后尝试或联系客服！',
            '55030': '操作失败，请稍后尝试或联系客服！'
          }
          // 将选中数据遍历
          let ids = ''
          val.forEach(val => { ids += val.idString + ',' })
          deleteUser({ 'ids': ids }).then(response => {
            const code = response.code
            if (code !== '25200') {
              this.$message.error(irender[code])
              return
            }
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.loadData()
          }).catch(error => {
            console.log(error)
          })
        }
      }).catch(() => {})
    },
    delUserAnyway() {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 拿到选中的数据
        const val = this.multipleSelection
        // 如果选中数据存在
        if (val) {
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
          // 将选中数据遍历
          let ids = ''
          val.forEach(val => { ids += val.idString + ',' })
          deleteUserAnyway({ 'ids': ids }).then(response => {
            const code = response.code
            if (code !== '25200') {
              this.$message.error(irender[code])
              return
            }
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.loadData()
          }).catch(error => {
            console.log(error)
          })
        }
      }).catch(() => {})
    },
    loadData() {
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
          this.userSearchForm.totalPage = +data.totalPages
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    switchPlatformChooserVisible(val) {
      this.platformChooserVisible = val
    },
    switchCompanyChooserVisible(val) {
      this.companyChooserVisible = val
    },
    // 每页条数变化
    handleSizeChange(val) {
      this.userSearchForm.pageSize = val
      this.loadData()
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.userSearchForm.pageNumber = val
      this.loadData()
    },
    getPlatformChooserData(val) {
      this.addUserDialogForm.platformId = val[0].idString
      this.addUserDialogForm.platformName = val[0].name
    },
    getCompanyChooserData(val) {
      console.log(val)
      this.addUserDialogForm.companyId = val[0].idString
      this.addUserDialogForm.companyName = val[0].companyName
    },
    doSaveAddUserDialog() {
      this.$refs.addUserDialogForm.validate(valid => {
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
        if (valid) {
          this.loading = true
          const params = {
            'platformId': this.addUserDialogForm.platformId,
            'companyId': this.addUserDialogForm.companyId,
            'username': this.addUserDialogForm.username,
            'password': this.addUserDialogForm.password,
            'type': this.addUserDialogForm.type,
            'status': this.addUserDialogForm.status,
            'desc': this.addUserDialogForm.desc
          }
          saveUser(params).then(response => {
            const code = response.code
            if (code !== '25200') {
              this.$message.error(irender[code])
              return
            }
            this.$refs['addUserDialogForm'].resetFields()
            this.addUserDialogForm.visible = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.loadData()
          }).catch(error => {
            console.log(error)
          })
          this.loading = false
        } else {
          return false
        }
      })
    },
    showCompanyChooser() {
      if (this.addUserDialogForm.platformId) {
        this.companyChooserVisible = true
      } else {
        this.$message.error('请先选择平台')
      }
    },
    // 用户类型变化
    addUserDialogFormTypeChange() {
      this.addUserDialogForm.showPlatform = this.addUserDialogForm.type > 0
      this.addUserDialogForm.showCompany = this.addUserDialogForm.type > 1
    },
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
          this.loadData()
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
          this.$message.error(irender[code])
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
    }

  }
}

</script>

<style scoped>

</style>
