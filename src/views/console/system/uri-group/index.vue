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
            @click="() => addUri(node, data)"
          >
            配置资源
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

    <el-dialog title="添加资源组" :visible.sync="addUriGroupForm.visible" width="50%">
      <el-form ref="addUriGroupDialogForm" :model="addUriGroupForm">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model.trim="addUriGroupForm.name" placeholder="请输入名称" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优先级" label-width="80px" prop="priority">
          <el-input v-model.trim="addUriGroupForm.priority" placeholder="请输入优先级" type="text" autocomplete="off" />
        </el-form-item>
      </el-form>
      <el-button @click="addUriGroupForm.visible = false">取 消</el-button>
      <el-button type="primary" @click="doAddUriGroup">确 定</el-button>
    </el-dialog>
    <el-dialog title="编辑资源组" :visible.sync="editUriForm.visible" width="50%">
      <el-form ref="editUriDialogForm" :model="editUriForm">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model.trim="editUriForm.name" placeholder="请输入名称" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优先级" label-width="80px" prop="priority">
          <el-input v-model.trim="editUriForm.priority" placeholder="请输入优先级" type="text" autocomplete="off" />
        </el-form-item>
      </el-form>
      <el-button @click="editUriForm.visible = false">取 消</el-button>
      <el-button type="primary" @click="doEditUri">确 定</el-button>
    </el-dialog>

    <el-dialog title="资源" :visible.sync="uriForm.visible" width="50%">
      <el-form :inline="true" label-position="left" :model="uriForm.searchForm">
        <el-row>
          <el-form-item>
            <el-input v-model="uriForm.searchForm.name" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="uriForm.searchForm.value" placeholder="标识符" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadUriByUriGroup">查询</el-button>
            <el-button type="success" icon="el-icon-edit" @click="showAddUriForm">添加</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table
        :data="uriForm.tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="名称"
          width="180"
        />
        <el-table-column
          prop="value"
          label="标识符"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="delUri(scope.row.idString, scope.row.name)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="uriForm.searchForm.pageNumber"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="uriForm.searchForm.pageSize"
        :total="uriForm.searchForm.totalElements"
        layout="total, sizes, prev, pager, next, jumper"
        next-text="下一页"
        prev-text="上一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uriForm.visible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加资源" :visible.sync="uriForm.addForm.visible" width="50%">
      <el-form :inline="true" label-position="left" :model="uriForm.addForm">
        <el-row>
          <el-form-item>
            <el-input v-model="uriForm.addForm.name" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="uriForm.addForm.value" placeholder="标识符" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadUriByUriGroup">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table
        ref="uriAddForm"
        :data="uriForm.addForm.tableData"
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        @row-click="handlerRowClick"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="名称"
          width="180"
        />
        <el-table-column
          prop="value"
          label="标识符"
        />
      </el-table>
      <el-pagination
        :current-page="uriForm.addForm.pageNumber"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="uriForm.addForm.pageSize"
        :total="uriForm.addForm.totalElements"
        layout="total, sizes, prev, pager, next, jumper"
        next-text="下一页"
        prev-text="上一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="uriForm.addForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="doSelectAddFormConfirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUriGroup, saveUriGroup, updateUriGroup, deleteUriGroup } from '@/api/console/uri-group'
import { searchSelectedUri, searchUnselectUri } from '@/api/console/uri'
import { batchSaveUriGroupMap, deleteUriGroupMap } from '@/api/console/uri-group-map'
import { vrender } from '@/utils'
export default {
  name: 'ConsoleSystemUriGroupList',
  data() {
    return {
      addUriGroupForm: {
        visible: false,
        name: '',
        priority: '',
        nodeData: Object,
        node: Object
      },
      editUriForm: {
        visible: false,
        id: '',
        pid: '',
        name: '',
        priority: '',
        nodeData: Object
      },
      uriForm: {
        nodeData: Object,
        visible: false,
        tableData: [],
        searchForm: {
          name: '',
          value: '',
          pageNumber: 1,
          pageSize: 5,
          totalElements: 10
        },
        addForm: {
          visible: false,
          name: '',
          value: '',
          tableData: [],
          multipleSelection: [],
          pageNumber: 1,
          pageSize: 5,
          totalElements: 10
        }
      },
      props: {
        label(data) {
          return data.name + ' - ' + data.priority
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
      getUriGroup({ 'pid': pid }).then(response => {
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
      this.addUriGroupForm.visible = true
      this.addUriGroupForm.nodeData = data
      this.addUriGroupForm.node = node
    },
    remove(node, data) {
      this.$confirm('确定要删除【' + data.name + '】吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const irender = {
          '45010': '参数不合法！',
          '55010': '操作失败，请稍后尝试或联系客服！'
        }
        deleteUriGroup({ 'ids': data.id }).then(response => {
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
    doAddUriGroup() {
      const irender = {
        '45010': '参数不合法！',
        '45020': '名称不合法！',
        '45030': '标识符不合法！',
        '45040': '备注不合法！',
        '45409': '该标识符已经存在！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！'
      }
      console.log(this.addUriGroupForm.nodeData)
      const params = {
        'name': this.addUriGroupForm.name,
        'type': this.addUriGroupForm.nodeData.type,
        'pid': this.addUriGroupForm.nodeData.id,
        'priority': this.addUriGroupForm.priority
      }
      saveUriGroup(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.addUriGroupForm.visible = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        if (this.addUriGroupForm.node.childNodes.length > 0) {
          this.appendNewNode(this.addUriGroupForm.nodeData.id, this.addUriGroupForm.name)
        }
        this.$refs['addUriGroupDialogForm'].resetFields()
      }).catch(error => {
        console.log(error)
      })
    },
    appendNewNode(pid, name) {
      const irender = {
        '55010': '操作失败，请稍后尝试或联系客服！'
      }
      getUriGroup({ 'pid': pid, 'name': name }).then(response => {
        const code = response.code
        const data = response.data
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.$refs.uriTree.append(data[0], this.addUriGroupForm.nodeData)
      }).catch(error => {
        console.log(error)
      })
    },
    edit(node, data) {
      this.editUriForm.visible = true
      this.editUriForm.id = data.id
      this.editUriForm.name = data.name
      this.editUriForm.priority = data.priority
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
        'name': this.editUriForm.name,
        'id': this.editUriForm.id,
        'priority': this.editUriForm.priority
      }
      updateUriGroup(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          this.$message.error(irender[code])
          return
        }
        this.addUriGroupForm.visible = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.editUriForm.nodeData.data.priority = this.editUriForm.priority
        this.editUriForm.nodeData.data.name = this.editUriForm.name
        this.editUriForm.nodeData.data.id = this.editUriForm.id
        this.editUriForm.visible = false
        this.$refs['editUriDialogForm'].resetFields()
      }).catch(error => {
        console.log(error)
      })
    },
    loadUriByUriGroup() {
      const irender = {
        '45010': '参数不合法！',
        '55010': '操作失败，请稍后尝试或联系客服！'
      }
      const params = {
        uriGroupId: this.uriForm.nodeData.data.id,
        name: this.uriForm.searchForm.name,
        value: this.uriForm.searchForm.value,
        pageNumber: this.uriForm.searchForm.pageNumber,
        pageSize: this.uriForm.searchForm.pageSize
      }
      searchSelectedUri(params).then(response => {
        const code = response.code
        const data = response.data
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.uriForm.tableData = data.content
        this.uriForm.searchForm.totalElements = +data.totalElements
      }).catch(error => {
        console.log(error)
      })
    },
    // 每页条数变化
    handleSizeChange(val) {
      this.uriForm.searchForm.pageSize = val
      this.loadUriByUriGroup()
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.uriForm.searchForm.pageNumber = val
      this.loadUriByUriGroup()
    },
    addUri(data) {
      this.uriForm.visible = true
      this.uriForm.nodeData = data
      this.loadUriByUriGroup()
    },
    delUri(id, name) {
      this.$confirm('确定要删除【' + name + '】吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const irender = {
          '45010': '参数不合法！',
          '45020': '参数不合法！',
          '55010': '操作失败，请稍后尝试或联系客服！'
        }
        const params = {
          uriGroupId: this.uriForm.nodeData.data.id,
          uriId: id
        }

        deleteUriGroupMap(params).then(response => {
          const code = response.code
          if (code !== '25200') {
            vrender(this, irender, code)
            return
          }
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.loadUriByUriGroup()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    showAddUriForm() {
      this.uriForm.addForm.visible = true
      this.loadUnselectUri()
    },
    loadUnselectUri() {
      const irender = {
        '45010': '参数不合法！',
        '55010': '操作失败，请稍后尝试或联系客服！'
      }
      const params = {
        uriGroupId: this.uriForm.nodeData.data.id,
        name: this.uriForm.addForm.name,
        value: this.uriForm.addForm.value,
        pageNumber: this.uriForm.addForm.pageNumber,
        pageSize: this.uriForm.addForm.pageSize
      }
      searchUnselectUri(params).then(response => {
        const code = response.code
        const data = response.data
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.uriForm.addForm.tableData = data.content
        this.uriForm.addForm.totalElements = +data.totalElements
      }).catch(error => {
        console.log(error)
      })
    },
    handlerRowClick(row) {
      this.$refs.uriAddForm.toggleRowSelection(row)
    },
    handleSelectionChange(val) {
      this.uriForm.addForm.multipleSelection = val
    },
    doSelectAddFormConfirm() {
      // 拿到选中的数据
      const val = this.uriForm.addForm.multipleSelection
      if (val.length === 0) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
      // 将选中数据遍历
      let uriIds = ''
      val.forEach(val => { uriIds += val.idString + ',' })
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
        'uriGroupId': this.uriForm.nodeData.data.id,
        'uriIds': uriIds
      }
      batchSaveUriGroupMap(params).then(response => {
        const code = response.code
        if (code !== '25200') {
          vrender(this, irender, code)
          return
        }
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.loadUnselectUri()
        this.loadUriByUriGroup()
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
