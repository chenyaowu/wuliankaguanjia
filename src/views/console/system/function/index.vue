<template>
  <div class="app-container">
    <el-form ref="functionSearchForm" :inline="true" label-position="left" label-width="80px" :model="functionSearchForm">
      <el-row>
        <el-form-item label="名称" prop="name">
          <el-input v-model="functionSearchForm.name" />
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-input v-model="functionSearchForm.type" />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('functionSearchForm')">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchFunctionListData">查询</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addFunctionForm.visible = true">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeFunction()">删除</el-button>
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
    <el-dialog title="添加功能" :visible.sync="addFunctionForm.visible" width="50%">
      <el-form ref="addFunctionForm" :model="addFunctionForm" :rules="addFunctionRules">
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model.trim="addFunctionForm.name" placeholder="请输入名称" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" label-width="120px" prop="type">
          <el-input v-model.trim="addFunctionForm.type" placeholder="请输入类型" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="desc">
          <el-input v-model.trim="addFunctionForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFunctionForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="doSaveAddFunctionDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteFunction, getFunction, saveFunction } from '@/api/console/function'
import { removeById, vrender } from '@/utils'
export default {
  name: 'ConsoleSystemFunctionList',
  data() {
    return {
      functionMultipleSelection: [],
      functionTableData: [],
      functionSearchForm: {
        name: '',
        type: '',
        pageNumber: 1,
        pageSize: 10,
        totalElements: 1
      },
      addFunctionForm: {
        visible: false,
        name: '',
        type: '',
        desc: ''
      },
      addFunctionRules: {
        name: { required: true, trigger: 'blur', message: '请输入名称' },
        type: { required: true, trigger: 'blur', message: '请输入类型' }
      }
    }
  },
  created() {
    this.searchFunctionListData()
  },
  methods: {
    searchFunctionListData() {
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
    removeFunction() {
      // 拿到选中的数据
      const val = this.functionMultipleSelection
      const irender = {
        '45010': '参数不合法！',
        '45020': '存在admin用户不可删除！',
        '45030': '不可以删除自己！',
        '45040': '存在公司管理员，请使用强制删除！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！',
        '55030': '操作失败，请稍后尝试或联系客服！'
      }
      removeById(this, val, irender, deleteFunction, this.searchFunctionListData)
    },
    handleSelectionChange(val) {
      this.functionMultipleSelection = val
    },
    handleSizeChange(val) {
      this.functionSearchForm.pageSize = val
      this.searchFunctionListData()
    },
    handleCurrentChange(val) {
      this.functionSearchForm.pageNumber = val
      this.searchFunctionListData()
    },
    doSaveAddFunctionDialog() {
      this.$refs.addFunctionForm.validate(valid => {
        if (valid) {
          const irender = {
            '45010': '名称不合法！',
            '45020': '备注不合法！',
            '45030': '类型不合法！',
            '55010': '操作失败，请稍后尝试或联系客服！'
          }
          const params = {
            name: this.addFunctionForm.name,
            type: this.addFunctionForm.type,
            desc: this.addFunctionForm.desc
          }
          saveFunction(params).then(response => {
            const code = response.code
            if (code !== '25200') {
              vrender(this, irender, code)
              return
            }
            this.resetForm('addFunctionForm')
            this.addFunctionForm.visible = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.searchFunctionListData()
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
