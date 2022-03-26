<template>
  <el-dialog title="选择平台" :visible.sync="platformChooserVisible" @close="closePlatformChooser">
    <el-form :inline="true" label-position="left" label-width="80px" :model="platformChooserSearchForm">
      <el-row>
        <el-form-item label="名称">
          <el-input v-model="platformChooserSearchForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table ref="platformTable" :data="platformChooserData" @row-click="handlerRowClick">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column property="name" label="平台" />
      <el-table-column property="username" label="用户" />
      <el-table-column property="companyName" label="公司" />
    </el-table>
    <el-pagination
      :current-page="platformChooserSearchForm.pageNumber"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      :page-size="platformChooserSearchForm.pageSize"
      :total="platformChooserSearchForm.totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="closePlatformChooser">取 消</el-button>
      <el-button type="primary" @click="doSelectConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPlatform } from '@/api/console/platform'
export default {
  name: 'PlatformChooser',
  props: {
    parentPlatformChooserVisible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      platformChooserVisible: false,
      platformChooserData: [],
      platformChooserSearchForm: {
        name: '',
        pageNumber: 1,
        pageSize: 5,
        totalPage: 5
      }
    }
  },
  watch: {
    parentPlatformChooserVisible() {
      this.platformChooserVisible = this.parentPlatformChooserVisible
      this.$emit('doClosePlatformChooser', this.platformChooserVisible)
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    closePlatformChooser() {
      this.$emit('doClosePlatformChooser', false)
    },
    doSelectConfirm() {
      const _selectData = this.$refs.platformTable.selection
      if (_selectData.length !== 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
        return
      }
      this.$emit('doPlatformChooserSelect', _selectData)
      this.$refs.platformTable.clearSelection()
      this.closePlatformChooser()
    },
    loadData() {
      getPlatform(this.platformChooserSearchForm).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.platformChooserData = data.content
          this.platformChooserSearchForm.totalPage = +data.totalPages
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) {
      this.platformChooserSearchForm.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.platformChooserSearchForm.pageNumber = val
      this.loadData()
    },
    handlerRowClick(row, column, event) {
      this.$refs.platformTable.toggleRowSelection(row)
    }

  }
}
</script>

<style scoped>

</style>
