<template>
  <el-dialog title="选择公司" :visible.sync="companyChooserVisible" @close="closeCompanyChooser">
    <el-form :inline="true" label-position="left" label-width="80px" :model="companyChooserSearchForm">
      <el-row>
        <el-form-item label="名称">
          <el-input v-model="companyChooserSearchForm.companyName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table ref="companyTable" :data="companyChooserData" @row-click="handlerRowClick">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column property="companyName" label="公司" />
      <el-table-column property="username" label="用户" />
    </el-table>
    <el-pagination
      :current-page="companyChooserSearchForm.pageNumber"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      :page-size="companyChooserSearchForm.pageSize"
      :total="companyChooserSearchForm.totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeCompanyChooser">取 消</el-button>
      <el-button type="primary" @click="doSelectConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCompany } from '@/api/console/company'
export default {
  name: 'CompanyChooser',
  props: {
    parentCompanyChooserVisible: {
      default: false,
      type: Boolean
    },
    platformId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      companyChooserVisible: false,
      companyChooserData: [],
      companyChooserSearchForm: {
        companyName: '',
        pageNumber: 1,
        pageSize: 5,
        totalPage: 5
      }
    }
  },
  watch: {
    parentCompanyChooserVisible() {
      this.companyChooserVisible = this.parentCompanyChooserVisible
      this.$emit('doCloseCompanyChooser', this.companyChooserVisible)
      if (this.parentCompanyChooserVisible) {
        this.loadData()
      }
    }
  },
  methods: {
    closeCompanyChooser() {
      this.$emit('doCloseCompanyChooser', false)
    },
    doSelectConfirm() {
      const _selectData = this.$refs.companyTable.selection
      if (_selectData.length !== 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
        return
      }
      this.$emit('doCompanyChooserSelect', _selectData)
      this.$refs.companyTable.clearSelection()
      this.closeCompanyChooser()
    },
    loadData() {
      const params = {
        'platformId': this.platformId,
        'userType': 3,
        'companyName': this.companyChooserSearchForm.companyName,
        'pageNumber': this.companyChooserSearchForm.pageNumber,
        'pageSize': this.companyChooserSearchForm.pageSize
      }

      getCompany(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.companyChooserData = data.content
          this.companyChooserSearchForm.totalPage = +data.totalPages
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) {
      this.companyChooserSearchForm.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.companyChooserSearchForm.pageNumber = val
      this.loadData()
    },
    handlerRowClick(row, column, event) {
      this.$refs.companyTable.toggleRowSelection(row)
    }

  }
}
</script>

<style scoped>

</style>
