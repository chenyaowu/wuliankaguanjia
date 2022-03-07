<template>
  <el-dialog title="收货地址" :visible.sync="platformChooserVisible" @close="closePlatformChooser">
    <el-table :data="platformChooserData">
      <el-table-column property="date" label="日期" width="150" />
      <el-table-column property="name" label="姓名" width="200" />
      <el-table-column property="address" label="地址" />
    </el-table>
  </el-dialog>
</template>

<script>
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
      platformChooserData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  watch: {
    parentPlatformChooserVisible() {
      this.platformChooserVisible = this.parentPlatformChooserVisible
      this.$emit('doClosePlatformChooser', this.platformChooserVisible)
    }
  },
  methods: {
    closePlatformChooser() {
      this.$emit('doClosePlatformChooser', false)
    }
  }
}
</script>

<style scoped>

</style>
