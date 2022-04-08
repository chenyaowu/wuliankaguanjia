<template>
  <div class="app-container">
    <el-form :inline="true" label-position="left" label-width="80px" :model="userConfigSearchForm">
      <el-row>
        <el-form-item label="用户名">
          <el-input v-model="userConfigSearchForm.username" clearable />
        </el-form-item>
        <el-form-item label="配置项">
          <el-input v-model="userConfigSearchForm.name" clearable />
        </el-form-item>
        <el-form-item label="配置键">
          <el-input v-model="userConfigSearchForm.key" clearable />
        </el-form-item>
        <el-form-item label="配置值">
          <el-input v-model="userConfigSearchForm.value" clearable />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delUserConfig">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="userConfigTableData"
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
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="doUserValue(scope.row)">{{ scope.row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="配置项"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="doValue(scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="键（KEY）"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="doEdit(scope.row)">{{ scope.row.key }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="value"
        label="值（VALUE）"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="doEdit(scope.row)">{{ scope.row.value }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="备注"
      />
      <el-table-column
        prop="createdDate"
        label="创建时间"
      />
      <div slot="append">
        <el-form ref="userConfigEditForm" :inline="true" :model="userConfigEditForm">
          <el-row class="add-form-div">
            <el-form-item class="add-form-item" prop="username">
              <el-input v-model="userConfigEditForm.username" placeholder="用户名" disabled @click.native="userChooser.visible = true" />
            </el-form-item>
            <el-form-item class="add-form-item" prop="name">
              <el-input v-model="userConfigEditForm.name" placeholder="配置项" />
            </el-form-item>
            <el-form-item class="add-form-item" prop="key">
              <el-input v-model="userConfigEditForm.key" placeholder="配置键" />
            </el-form-item>
            <el-form-item class="add-form-item" prop="value">
              <el-input v-model="userConfigEditForm.value" placeholder="配置值" />
            </el-form-item>
            <el-form-item class="add-form-item" prop="desc">
              <el-input v-model="userConfigEditForm.desc" placeholder="备注" />
            </el-form-item>
            <el-form-item class="add-form-item">
              <el-button type="success" icon="el-icon-edit" @click="addUserConfig">添加</el-button>
              <el-button type="warning" icon="el-icon-delete" @click="updateUserConfig">更新</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-table>
    <el-pagination
      :current-page="userConfigSearchForm.pageNumber"
      :page-sizes="[10, 15, 30, 50, 100, 200, 300, 400]"
      :page-size="userConfigSearchForm.pageSize"
      :total="userConfigSearchForm.totalElements"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <chooser
      :title="userChooser.title"
      :visible="userChooser.visible"
      :data="userChooser.data"
      :columns="userChooser.columns"
      :search-items="userChooser.searchItems"
      :current-page="userChooser.searchForm.pageNumber"
      :page-size="userChooser.searchForm.pageSize"
      :total="userChooser.searchForm.totalElements"
      @handleSizeChange="handleUserChooseSizeChange"
      @handleCurrentChange="handleUserChooseCurrentChange"
      @close="switchUserChooserVisible"
      @search="userChooserSearch"
      @doSelect="getUserChooserData"
    />
  </div>
</template>

<script>
import Chooser from '@/components/Chooser'
import { getUserConfig, saveUserConfig, updateUserConfig, delUserConfig } from '@/api/console/user-config'
import { getUser } from '@/api/console/user'

export default {
  name: 'ConsoleSystemUserConfigList',
  components: {
    Chooser
  },
  data() {
    return {
      labelPosition: 'right',
      userConfigSearchForm: {
        userId: '',
        username: '',
        name: '',
        key: '',
        value: '',
        pageNumber: 1,
        pageSize: 10,
        totalElements: 100
      },
      userConfigEditForm: {
        id: '',
        userId: '',
        username: '',
        name: '',
        key: '',
        value: '',
        desc: ''
      },
      addDialogFormVisible: false,
      userConfigTableData: [],
      multipleSelection: [],
      userChooser: {
        title: '选择用户',
        visible: false,
        data: [],
        columns: [
          {
            'number': 1,
            'property': 'username',
            'label': '用户名'
          },
          {
            'number': 2,
            'property': 'statusString',
            'label': '状态'
          },
          {
            'number': 3,
            'property': 'desc',
            'label': '备注'
          }
        ],
        searchItems: [
          {
            'number': 1,
            'model': '',
            'label': '用户名'
          }
        ],
        inputKey: '', // 控制选择器填入位置
        searchForm: {
          name: '',
          pageNumber: 1,
          pageSize: 5,
          totalElements: 5
        }
      }
    }
  },
  watch: {
    userConfigSearchForm: function(newUserConfigSearchForm) {
      if (newUserConfigSearchForm.username === '') {
        this.userConfigSearchForm.userId = ''
      }
    }
  },
  created() {
    this.loadData()
    this.loadUserChooserData()
  },
  methods: {
    loadData() {
      const params = {
        userId: this.userConfigSearchForm.username === '' ? '' : this.userConfigSearchForm.userId,
        name: this.userConfigSearchForm.name,
        key: this.userConfigSearchForm.key,
        value: this.userConfigSearchForm.value,
        pageNumber: this.userConfigSearchForm.pageNumber,
        pageSize: this.userConfigSearchForm.pageSize
      }
      getUserConfig(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.userConfigTableData = data.content
          this.userConfigSearchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    doValue(val) {
      this.userConfigSearchForm.name = val.name
      this.loadData()
    },
    doEdit(val) {
      this.userConfigEditForm.id = val.idString
      this.userConfigEditForm.userId = val.userIdString
      this.userConfigEditForm.username = val.username
      this.userConfigEditForm.name = val.name
      this.userConfigEditForm.key = val.key
      this.userConfigEditForm.value = val.value
      this.userConfigEditForm.desc = val.desc
    },
    doUserValue(val) {
      this.userConfigSearchForm.userId = val.userIdString
      this.userConfigSearchForm.username = val.username
      this.loadData()
    },
    // 每页条数变化
    handleSizeChange(val) {
      this.userConfigSearchForm.pageSize = val
      this.loadData()
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.userConfigSearchForm.pageNumber = val
      this.loadData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addUserConfig() {
      const irender = {
        '45010': '参数不合法！',
        '45020': '名称不合法！',
        '45030': '键不合法！',
        '45040': '值不合法！',
        '45050': '备注不合法！',
        '45409': '相同键已经存在！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！'
      }
      const params = {
        userId: this.userConfigEditForm.userId,
        name: this.userConfigEditForm.name,
        key: this.userConfigEditForm.key,
        value: this.userConfigEditForm.value,
        desc: this.userConfigEditForm.desc
      }
      saveUserConfig(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.$refs['userConfigEditForm'].resetFields()
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.loadData()
      }).catch(error => {
        console.log(error)
      })
    },
    updateUserConfig() {
      const irender = {
        '45010': '参数不合法！',
        '45020': '名称不合法！',
        '45030': '键不合法！',
        '45040': '值不合法！',
        '45050': '备注不合法！',
        '45404': '记录不存在！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！'
      }
      const params = {
        userId: this.userConfigEditForm.userId,
        name: this.userConfigEditForm.name,
        key: this.userConfigEditForm.key,
        value: this.userConfigEditForm.value,
        desc: this.userConfigEditForm.desc
      }
      updateUserConfig(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.$refs['userConfigEditForm'].resetFields()
        this.$message({
          message: '更新成功！',
          type: 'success'
        })
        this.loadData()
      }).catch(error => {
        console.log(error)
      })
    },
    delUserConfig() {
      // 拿到选中的数据
      const val = this.multipleSelection
      if (val.length > 0) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const irender = {
            '45010': '参数不合法！',
            '55010': '操作失败，请稍后尝试或联系客服！',
            '55020': '操作失败，请稍后尝试或联系客服！',
            '55030': '操作失败，请稍后尝试或联系客服！'
          }
          // 将选中数据遍历
          let ids = ''
          val.forEach(val => { ids += val.idString + ',' })
          delUserConfig({ 'ids': ids }).then(response => {
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
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
    },
    // 用户选择器开始
    loadUserChooserData() {
      const params = {
        username: this.userChooser.searchForm.name,
        pageNumber: this.userChooser.searchForm.pageNumber,
        pageSize: this.userChooser.searchForm.pageSize
      }
      getUser(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.userChooser.data = data.content
          this.userChooser.searchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleUserChooseSizeChange(val) {
      this.userChooser.searchForm.pageSize = val
      this.loadUserChooserData()
    },
    handleUserChooseCurrentChange(val) {
      this.userChooser.searchForm.pageNumber = val
      this.loadUserChooserData()
    },
    userChooserSearch(val) {
      this.userChooser.searchForm.name = val[0].model
      this.loadUserChooserData()
    },
    switchUserChooserVisible(val) {
      this.userChooser.visible = val
    },
    getUserChooserData(val) {
      this.userConfigEditForm.userId = val[0].idString
      this.userConfigEditForm.username = val[0].username
    }
    // 用户选择器结束
  }
}

</script>

<style scoped>
  .add-form-div{
    margin-left: 55px;
    width: 100%;
    margin-top: 10px;
    display: flex;
  }
  .add-form-item{
    flex: 1;
  }
</style>
