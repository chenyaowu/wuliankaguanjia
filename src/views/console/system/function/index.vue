<template>
  <div class="app-container">
    <el-form :inline="true" label-position="left" label-width="80px" :model="functionSearchForm">
      <el-row>
        <el-form-item label="名称">
          <el-input v-model="functionSearchForm.name" />
        </el-form-item>
        <el-form-item label="类别">
          <el-input v-model="functionSearchForm.type" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addFunctionDialogForm.visible = true">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delFunction()">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="functionTableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="type"
        label="类别"
      />
      <el-table-column
        prop="desc"
        label="备注"
      />
      <el-table-column
        prop="createdDate"
        label="创建时间"
      />
    </el-table>
    <el-pagination
      :current-page="functionSearchForm.pageNumber"
      :page-sizes="[10, 15, 30, 50, 100, 200, 300, 400]"
      :page-size="functionSearchForm.pageSize"
      :total="functionSearchForm.totalElements"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="添加功能" :visible.sync="addFunctionDialogForm.visible" width="50%">
      <el-form ref="addFunctionDialogForm" :model="addFunctionDialogForm">
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model.trim="addFunctionDialogForm.name" placeholder="请输入名称" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" label-width="120px" prop="type">
          <el-input v-model.trim="addFunctionDialogForm.type" placeholder="请输入类型" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="desc">
          <el-input v-model.trim="addFunctionDialogForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFunctionDialogForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="doSaveAddFunctionDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteFunction, getFunction, saveFunction } from '@/api/console/function'
export default {
  name: 'ConsoleSystemFunctionList',
  data() {
    return {
      multipleSelection: [],
      functionTableData: [],
      functionSearchForm: {
        name: '',
        type: '',
        pageNumber: 1,
        pageSize: 10,
        totalElements: 100
      },
      addFunctionDialogForm: {
        visible: false,
        name: '',
        type: '',
        desc: ''
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const params = {
        name: this.functionSearchForm.name,
        type: this.functionSearchForm.type,
        pageNumber: this.functionSearchForm.pageNumber,
        pageSize: this.functionSearchForm.pageSize
      }
      getFunction(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.functionTableData = data.content
          this.functionSearchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    delFunction() {
      // 拿到选中的数据
      const val = this.multipleSelection
      if (val.length > 0) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 如果选中数据存在
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
          deleteFunction({ 'ids': ids }).then(response => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.functionSearchForm.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.functionSearchForm.pageNumber = val
      this.loadData()
    },
    doSaveAddFunctionDialog() {
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
        name: this.addFunctionDialogForm.name,
        type: this.addFunctionDialogForm.type,
        desc: this.addFunctionDialogForm.desc
      }
      saveFunction(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.$refs['addFunctionDialogForm'].resetFields()
        this.addFunctionDialogForm.visible = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.loadData()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>
