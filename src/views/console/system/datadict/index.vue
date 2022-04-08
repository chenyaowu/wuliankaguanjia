<template>
  <div class="app-container">
    <el-tree
      ref="uriTree"
      :props="props"
      :load="loadNode"
      node-key="id"
      accordion
      lazy
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(node, data)"
          >
            添加
          </el-button>
          <el-button
            type="text"
            @click="() => edit(node, data)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="() => remove(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog title="添加字典" :visible.sync="addUriDialogForm.visible" width="50%">
      <el-form ref="addUriDialogForm" :model="addUriDialogForm">
        <el-form-item label="配置项" label-width="120px" prop="name">
          <el-input v-model.trim="addUriDialogForm.name" placeholder="请输入配置项" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="键(KEY)" label-width="120px" prop="key">
          <el-input v-model.trim="addUriDialogForm.key" placeholder="请输入键(KEY)" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="值(VALUE)" label-width="120px" prop="value">
          <el-input v-model.trim="addUriDialogForm.value" placeholder="请输入值(VALUE)" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="desc">
          <el-input v-model.trim="addUriDialogForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <el-button @click="addUriDialogForm.visible = false">取 消</el-button>
      <el-button type="primary" @click="doAddUri">确 定</el-button>
    </el-dialog>
    <el-dialog title="编辑资源" :visible.sync="editUriDialogForm.visible" width="50%">
      <el-form ref="editUriDialogForm" :model="editUriDialogForm">
        <el-form-item label="配置项" label-width="80px" prop="name">
          <el-input v-model.trim="editUriDialogForm.name" placeholder="请输入名称" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="键(KEY)" label-width="80px" prop="key">
          <el-input v-model.trim="editUriDialogForm.key" placeholder="请输入键(KEY)" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="值(VALUE)" label-width="80px" prop="value">
          <el-input v-model.trim="editUriDialogForm.value" placeholder="请输入值(VALUE)" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" label-width="80px" prop="desc">
          <el-input v-model.trim="editUriDialogForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <el-button @click="editUriDialogForm.visible = false">取 消</el-button>
      <el-button type="primary" @click="doEditUri">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getDatadict, saveDatadict, updateDatadict, deleteDatadict } from '@/api/console/datadict'
export default {
  name: 'ConsoleSystemUriList',
  data() {
    return {
      addUriDialogForm: {
        visible: false,
        key: '',
        name: '',
        value: '',
        desc: '',
        nodeData: Object,
        node: Object
      },
      editUriDialogForm: {
        visible: false,
        id: '',
        pid: '',
        name: '',
        key: '',
        value: '',
        desc: '',
        nodeData: Object
      },
      props: {
        label(data) {
          if (data.desc !== '') {
            return data.name + '【' + data.key + '】' + data.value + ' - ' + data.desc
          }
          return data.name + '【' + data.key + '】' + data.value
        },
        children: 'zones',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    loadNode(node, resolve) {
      let pid = 0
      if (node.level !== 0) {
        pid = node.data.id
      }
      const irender = {
        '55010': '操作失败，请稍后尝试或联系客服！'
      }
      getDatadict({ 'pid': pid }).then(response => {
        const code = response.code
        const data = response.data
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        return resolve(data)
      }).catch(error => {
        console.log(error)
      })
    },
    append(node, data) {
      this.addUriDialogForm.visible = true
      this.addUriDialogForm.nodeData = data
      this.addUriDialogForm.node = node
    },
    remove(node, data) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const irender = {
          '45010': '参数不合法！',
          '55010': '操作失败，请稍后尝试或联系客服！'
        }
        deleteDatadict({ 'ids': data.id }).then(response => {
          const code = response.code
          if (code !== '25200') {
            this.$message.error(irender[code])
            return
          }
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          node.remove()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    doAddUri() {
      const irender = {
        '45010': '参数不合法！',
        '45020': '名称不合法！',
        '45030': '标识符不合法！',
        '45040': '备注不合法！',
        '45409': '该标识符已经存在！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！'
      }
      const params = {
        'pid': this.addUriDialogForm.nodeData.id,
        'name': this.addUriDialogForm.name,
        'key': this.addUriDialogForm.key,
        'value': this.addUriDialogForm.value,
        'desc': this.addUriDialogForm.desc
      }
      saveDatadict(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.addUriDialogForm.visible = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })

        if (this.addUriDialogForm.node.childNodes.length > 0) {
          this.appendNewNode(this.addUriDialogForm.value)
        }
        this.$refs['addUriDialogForm'].resetFields()
      }).catch(error => {
        console.log(error)
      })
    },
    appendNewNode(value) {
      const irender = {
        '55010': '操作失败，请稍后尝试或联系客服！'
      }
      getDatadict({ 'value': value }).then(response => {
        const code = response.code
        const data = response.data
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.$refs.uriTree.append(data[0], this.addUriDialogForm.nodeData)
      }).catch(error => {
        console.log(error)
      })
    },
    edit(node, data) {
      this.editUriDialogForm.visible = true
      this.editUriDialogForm.id = data.id
      this.editUriDialogForm.name = data.name
      this.editUriDialogForm.key = data.key
      this.editUriDialogForm.value = data.value
      this.editUriDialogForm.pid = data.pid
      this.editUriDialogForm.desc = data.desc
      this.editUriDialogForm.nodeData = node
    },
    doEditUri() {
      const irender = {
        '45010': '参数不合法！',
        '45020': '名称不合法！',
        '45030': '标识符不合法！',
        '45040': '备注不合法！',
        '45404': '标识符不存在！',
        '45409': '该标识符已经存在！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！',
        '55030': '操作失败，请稍后尝试或联系客服！'
      }
      const params = {
        'id': this.editUriDialogForm.id,
        'pid': this.editUriDialogForm.pid,
        'name': this.editUriDialogForm.name,
        'key': this.editUriDialogForm.key,
        'value': this.editUriDialogForm.value,
        'desc': this.editUriDialogForm.desc
      }
      updateDatadict(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.addUriDialogForm.visible = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.editUriDialogForm.nodeData.data.value = this.editUriDialogForm.value
        this.editUriDialogForm.nodeData.data.name = this.editUriDialogForm.name
        this.editUriDialogForm.nodeData.data.key = this.editUriDialogForm.key
        this.editUriDialogForm.nodeData.data.desc = this.editUriDialogForm.desc
        this.editUriDialogForm.visible = false
        this.$refs['editUriDialogForm'].resetFields()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  padding-right: 8px;
}

</style>
