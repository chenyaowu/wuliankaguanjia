<template>
  <el-dialog :title="title" :visible.sync="myVisible" width="80%" @close="close">
    <el-form :inline="true" label-position="left" label-width="80px">
      <el-row>
        <el-form-item v-for="item in mySearchItems" :key="item.number" :label="item.label">
          <el-input v-model="item.model" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table ref="myTable" :data="data" @row-click="handlerRowClick">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column v-for="item in columns" :key="item.number" :property="item.property" :label="item.label" />
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="doSelectConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Chooser',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      default: false,
      type: Boolean
    },
    data: {
      default: () => [],
      type: Array
    },
    searchItems: {
      default: () => [],
      type: Array
    },
    columns: {
      default: () => [],
      type: Array
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    inputKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myVisible: false,
      mySearchItems: this.searchItems,
      name: ''
    }
  },
  watch: {
    visible() {
      this.myVisible = this.visible
      this.$emit('doClosePlatformChooser', this.myVisible)
    }
  },
  methods: {
    search() {
      this.$emit('search', this.mySearchItems)
    },
    close() {
      this.$emit('close', false)
    },
    doSelectConfirm() {
      const _selectData = this.$refs.myTable.selection
      if (_selectData.length !== 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
        return
      }
      this.$emit('doSelect', _selectData, this.inputKey)
      this.$refs.myTable.clearSelection()
      this.close()
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
    handlerRowClick(row) {
      this.$refs.myTable.toggleRowSelection(row)
    }

  }
}
</script>

<style scoped>

</style>
