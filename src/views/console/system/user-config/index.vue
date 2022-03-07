<template>
  <div class="app-container">
    <el-form :inline="true" label-position="left" label-width="80px" :model="userConfigForm">
      <el-row>
        <el-form-item label="用户名">
          <el-input v-model="userConfigForm.userId" />
        </el-form-item>
        <el-form-item label="配置项">
          <el-input v-model="userConfigForm.name" />
        </el-form-item>
        <el-form-item label="配置键">
          <el-input v-model="userConfigForm.key" />
        </el-form-item>
        <el-form-item label="配置值">
          <el-input v-model="userConfigForm.value" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addDialogFormVisible = true">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delMulData()">删除</el-button>
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
        prop="date"
        label="日期"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="1000"
    />
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" width="50%">
      <el-form :model="addDialogForm">
        <el-form-item label="平台" label-width="120px">
          <el-input v-model="addDialogForm.platformId" disabled @click.native="platformChooserVisible = true" />
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="addDialogForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="addDialogForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户类型" label-width="120px">
          <el-select v-model="addDialogForm.type" placeholder="请选择用户类型">
            <el-option label="系统用户" value="0" />
            <el-option label="平台用户" value="1" />
            <el-option label="客户用户" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" label-width="120px">
          <el-select v-model="addDialogForm.status" placeholder="请选择用户状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <platform-chooser :parent-platform-chooser-visible="platformChooserVisible" @doClosePlatformChooser="test" />
  </div>
</template>

<script>
import PlatformChooser from '@/components/PlatformChooser'
export default {
  name: 'ConsoleSystemUserConfigList',
  components: {
    PlatformChooser
  },
  data() {
    return {
      labelPosition: 'right',
      addDialogFormVisible: false,
      platformChooserVisible: false,
      userConfigForm: {
        userId: '',
        name: '',
        key: '',
        value: ''
      },
      addDialogForm: {
        platformId: '',
        username: '',
        password: '',
        type: '',
        status: ''
      },
      userTableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      multipleSelection: [],
      size: ''
    }
  },
  methods: {
    delMulData() {
      // 拿到选中的数据
      const val = this.multipleSelection
      // 如果选中数据存在
      if (val) {
        // 将选中数据遍历
        val.forEach(val => {
          // 遍历源数据
          this.userTableData.forEach((v, i) => {
            // 如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if (val.id === v.id) {
              this.userTableData.splice(i, 1)
            }
          })
        })
      }
      // 清除选中状态
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    test(val) {
      this.platformChooserVisible = val
    }
  }
}

</script>

<style scoped>

</style>
