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

    <el-dialog title="添加资源" :visible.sync="addUriForm.visible" width="50%">
      <el-form ref="addUriDialogForm" :model="addUriForm">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model.trim="addUriForm.name" placeholder="请输入名称" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="标识符" label-width="80px" prop="value">
          <el-input v-model.trim="addUriForm.value" placeholder="请输入标识符" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" label-width="80px" prop="desc">
          <el-input v-model.trim="addUriForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <el-button @click="addUriForm.visible = false">取 消</el-button>
      <el-button type="primary" @click="doAddUri">确 定</el-button>
    </el-dialog>
    <el-dialog title="编辑资源" :visible.sync="editUriForm.visible" width="50%">
      <el-form ref="editUriDialogForm" :model="editUriForm">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model.trim="editUriForm.name" placeholder="请输入名称" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="标识符" label-width="80px" prop="value">
          <el-input v-model.trim="editUriForm.value" placeholder="请输入标识符" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" label-width="80px" prop="desc">
          <el-input v-model.trim="editUriForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <el-button @click="editUriForm.visible = false">取 消</el-button>
      <el-button type="primary" @click="doEditUri">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getUri, saveUri, updateUri, deleteUri } from '@/api/console/uri'
import { vrender } from '@/utils'
export default {
  name: 'ConsoleSystemUriList',
  data() {
    return {
      addUriForm: {
        visible: false,
        name: '',
        value: '',
        desc: '',
        nodeData: Object,
        node: Object
      },
      editUriForm: {
        visible: false,
        id: '',
        pid: '',
        name: '',
        value: '',
        desc: '',
        nodeData: Object
      },
      props: {
        label(data) {
          return data.name + ' - ' + data.value
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
      getUri({ 'pid': pid }).then(response => {
        const code = response.code
        const data = response.data
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        return resolve(data)
      }).catch(error => {
        console.log(error)
      })
    },
    append(node, data) {
      this.addUriForm.visible = true
      this.addUriForm.nodeData = data
      this.addUriForm.node = node
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
        deleteUri({ 'ids': data.id }).then(response => {
          const code = response.code
          if (code !== '25200') {
            vrender(this, irender, code)
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
        'pid': this.addUriForm.nodeData.id,
        'name': this.addUriForm.name,
        'value': this.addUriForm.value,
        'desc': this.addUriForm.desc
      }
      saveUri(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.addUriForm.visible = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        if (this.addUriForm.node.childNodes.length > 0) {
          this.appendNewNode(this.addUriForm.value)
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
      getUri({ 'value': value }).then(response => {
        const code = response.code
        const data = response.data
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.$refs.uriTree.append(data[0], this.addUriForm.nodeData)
      }).catch(error => {
        console.log(error)
      })
    },
    edit(node, data) {
      this.editUriForm.visible = true
      this.editUriForm.id = data.id
      this.editUriForm.name = data.name
      this.editUriForm.value = data.value
      this.editUriForm.pid = data.pid
      this.editUriForm.desc = data.desc
      this.editUriForm.nodeData = node
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
        'id': this.editUriForm.id,
        'pid': this.editUriForm.pid,
        'name': this.editUriForm.name,
        'value': this.editUriForm.value,
        'desc': this.editUriForm.desc
      }
      updateUri(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.addUriForm.visible = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.editUriForm.nodeData.data.value = this.editUriForm.value
        this.editUriForm.nodeData.data.name = this.editUriForm.name
        this.editUriForm.nodeData.data.desc = this.editUriForm.desc
        this.editUriForm.visible = false
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
