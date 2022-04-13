<template>
  <div class="app-container">
    <el-form ref="gatewayProductSearchForm" :inline="true" label-position="left" label-width="80px" :model="gatewayProductSearchForm">
      <el-row>
        <el-form-item prop="gatewayId">
          <el-input v-if="value" v-model="gatewayProductSearchForm.gatewayId" />
        </el-form-item>
        <el-form-item label="网关名称" prop="gatewayName">
          <el-input v-model="gatewayProductSearchForm.gatewayName" disabled @click.native="showGatewayChooser('search')" />
        </el-form-item>
        <el-form-item prop="productId">
          <el-input v-if="value" v-model="gatewayProductSearchForm.productId" />
        </el-form-item>
        <el-form-item label="系统套餐名称" prop="productName">
          <el-input v-model="gatewayProductSearchForm.productName" disabled @click.native="showProductChooser('search')" />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('gatewayProductSearchForm')">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchGatewayProductListData">查询</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addGatewayProductForm.visible = true">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeGatewayProduct()">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :data="gatewayProductTableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleGatewayProductTableSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="productName"
        label="系统套餐名称"
      />
      <el-table-column
        prop="flow"
        label="流量大小"
      />
      <el-table-column
        prop="code"
        label="产品编码"
      />
      <el-table-column
        prop="name"
        label="网关套餐名称"
      />
      <el-table-column
        prop="gatewayName"
        label="网关名称"
      />
      <el-table-column
        prop="desc"
        label="描述"
      />
      <el-table-column
        prop="createdDate"
        label="创建时间"
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
            @click.native.prevent="showEditGatewayProductDialog(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="gatewayProductSearchForm.pageNumber"
      :page-sizes="[10, 15, 30, 50, 100, 200, 300, 400]"
      :page-size="gatewayProductSearchForm.pageSize"
      :total="gatewayProductSearchForm.totalElements"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleProductTableSizeChange"
      @current-change="handleProductTableCurrentChange"
    />
    <el-dialog title="添加" :visible.sync="addGatewayProductForm.visible" width="50%">
      <el-form ref="addGatewayProductForm" :model="addGatewayProductForm" :rules="addGatewayProductRules">
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model="addGatewayProductForm.name" />
        </el-form-item>
        <el-form-item label="网关名称" label-width="120px" prop="gatewayName">
          <el-input v-model="addGatewayProductForm.gatewayName" disabled @click.native="showGatewayChooser('add')" />
        </el-form-item>
        <el-form-item label="套餐名称" label-width="120px" prop="productName">
          <el-input v-model="addGatewayProductForm.productName" disabled @click.native="showProductChooser('add')" />
        </el-form-item>
        <el-form-item label="流量大小（M）" label-width="120px" prop="flow">
          <el-input v-model="addGatewayProductForm.flow" />
        </el-form-item>
        <el-form-item label="产品代码" label-width="120px" prop="code">
          <el-input v-model="addGatewayProductForm.code" />
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="desc">
          <el-input v-model.trim="addGatewayProductForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGatewayProductForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="addGatewayProduct">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editGatewayProductForm.visible" width="50%">
      <el-form ref="editGatewayProductDialogForm" :model="editGatewayProductForm" :rules="editGatewayProductRules">
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model="editGatewayProductForm.name" />
        </el-form-item>
        <el-form-item label="网关名称" label-width="120px" prop="gatewayName">
          <el-input v-model="editGatewayProductForm.gatewayName" disabled @click.native="showGatewayChooser('edit')" />
        </el-form-item>
        <el-form-item label="套餐名称" label-width="120px" prop="productName">
          <el-input v-model="editGatewayProductForm.productName" disabled @click.native="showProductChooser('edit')" />
        </el-form-item>
        <el-form-item label="流量大小（M）" label-width="120px" prop="flow">
          <el-input v-model="editGatewayProductForm.flow" />
        </el-form-item>
        <el-form-item label="产品代码" label-width="120px" prop="code">
          <el-input v-model="editGatewayProductForm.code" />
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="desc">
          <el-input v-model.trim="editGatewayProductForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGatewayProductForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="updateGatewayProduct">确 定</el-button>
      </div>
    </el-dialog>
    <chooser
      :title="gatewayChooser.title"
      :visible="gatewayChooser.visible"
      :data="gatewayChooser.data"
      :columns="gatewayChooser.columns"
      :search-items="gatewayChooser.searchItems"
      :current-page="gatewayChooser.searchForm.pageNumber"
      :page-size="gatewayChooser.searchForm.pageSize"
      :total="gatewayChooser.searchForm.totalElements"
      @handleSizeChange="handleGatewayChooseSizeChange"
      @handleCurrentChange="handleGatewayChooseCurrentChange"
      @close="switchGatewayChooserVisible"
      @search="gatewayChooserSearch"
      @doSelect="getGatewayChooserData"
    />
    <chooser
      :title="productChooser.title"
      :visible="productChooser.visible"
      :data="productChooser.data"
      :columns="productChooser.columns"
      :search-items="productChooser.searchItems"
      :current-page="productChooser.searchForm.pageNumber"
      :page-size="productChooser.searchForm.pageSize"
      :total="productChooser.searchForm.totalElements"
      @handleSizeChange="handleProductChooseSizeChange"
      @handleCurrentChange="handleProductChooseCurrentChange"
      @close="switchProductChooserVisible"
      @search="productChooserSearch"
      @doSelect="getProductChooserData"
    />
  </div>
</template>

<script>
import Chooser from '@/components/Chooser'
import { getProduct } from '@/api/console/product'
import { removeById, vrender } from '@/utils'
import { getGateway } from '@/api/console/gateway'
import { getGatewayProduct, saveGatewayProduct, updateGatewayProduct, deleteGatewayProduct } from '@/api/console/gateway-product'
export default {
  name: 'ConsoleSystemGatewayProductList',
  components: {
    Chooser
  },
  data() {
    return {
      gatewayProductTableMultipleSelection: [],
      gatewayProductTableData: [],
      gatewayProductSearchForm: {
        gatewayId: '',
        gatewayName: '',
        productId: '',
        productName: '',
        pageNumber: 1,
        pageSize: 10,
        totalElements: 1
      },
      addGatewayProductForm: {
        visible: false,
        name: '',
        code: '',
        flow: '',
        desc: '',
        productId: '',
        productName: '',
        gatewayId: '',
        gatewayName: ''
      },
      editGatewayProductForm: {
        visible: false,
        id: '',
        gatewayId: '',
        gatewayName: '',
        productId: '',
        productName: '',
        flow: '',
        code: '',
        desc: ''
      },
      addGatewayProductRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        code: { required: true, trigger: 'blur', message: '请输入产品编码' },
        flow: { required: true, trigger: 'blur', message: '请输入流量大小' },
        productName: { required: true, trigger: 'blur', message: '请选择套餐' },
        gatewayName: { required: true, trigger: 'blur', message: '请选择网关' }
      },
      editGatewayProductRules: {
        name: { required: true, trigger: 'blur', message: '请输入套餐名' },
        code: { required: true, trigger: 'blur', message: '请输入产品编码' },
        flow: { required: true, trigger: 'blur', message: '请输入流量大小' },
        productName: { required: true, trigger: 'blur', message: '请选择套餐' },
        gatewayName: { required: true, trigger: 'blur', message: '请选择网关' }
      },
      gatewayChooser: {
        title: '选择网关',
        visible: false,
        data: [],
        columns: [
          {
            'number': 1,
            'property': 'name',
            'label': '网关'
          },
          {
            'number': 2,
            'property': 'desc',
            'label': '备注'
          }
        ],
        searchItems: [
          {
            'number': 1,
            'model': '',
            'label': '名称'
          }
        ],
        inputKey: '', // 控制选择器填入位置
        searchForm: {
          name: '',
          pageNumber: 1,
          pageSize: 5,
          totalElements: 1
        }
      },
      productChooser: {
        title: '选择套餐',
        visible: false,
        data: [],
        columns: [
          {
            'number': 1,
            'property': 'name',
            'label': '名称'
          },
          {
            'number': 2,
            'property': 'flow',
            'label': '大小'
          },
          {
            'number': 3,
            'property': 'priceYuan',
            'label': '价格'
          },
          {
            'number': 4,
            'property': 'unit',
            'label': '单位'
          },
          {
            'number': 5,
            'property': 'typeString',
            'label': '类型'
          },
          {
            'number': 6,
            'property': 'charges',
            'label': '详情'
          }
        ],
        searchItems: [
          {
            'number': 1,
            'model': '',
            'label': '名称'
          }
        ],
        inputKey: '', // 控制选择器填入位置
        searchForm: {
          name: '',
          pageNumber: 1,
          pageSize: 5,
          totalElements: 1
        }
      }
    }
  },
  created() {
    this.searchGatewayProductListData()
    this.searchProductChooserListData()
    this.searchGatewayChooserListData()
  },
  methods: {
    searchGatewayProductListData() {
      const params = {
        productId: this.gatewayProductSearchForm.productId,
        gatewayId: this.gatewayProductSearchForm.gatewayId,
        pageNumber: this.gatewayProductSearchForm.pageNumber,
        pageSize: this.gatewayProductSearchForm.pageSize
      }
      getGatewayProduct(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.gatewayProductTableData = data.content
          this.gatewayProductSearchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    removeGatewayProduct() {
      // 拿到选中的数据
      const val = this.gatewayProductTableMultipleSelection
      // 如果选中数据存在
      const irender = {
        '45010': '参数不合法！',
        '45020': '该套餐已被绑定，不能删除！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！'
      }
      removeById(this, val, irender, deleteGatewayProduct, this.searchGatewayProductListData)
    },
    handleGatewayProductTableSelectionChange(val) {
      this.gatewayProductTableMultipleSelection = val
    },
    handleProductTableSizeChange(val) {
      this.gatewayProductSearchForm.pageSize = val
      this.searchGatewayProductListData()
    },
    handleProductTableCurrentChange(val) {
      this.gatewayProductSearchForm.pageNumber = val
      this.searchGatewayProductListData()
    },
    addGatewayProduct() {
      this.$refs.addGatewayProductForm.validate(valid => {
        if (valid) {
          const irender = {
            '45010': '网关不合法！',
            '45020': '套餐不合法！',
            '45030': '流量大小不合法！',
            '45040': '名称不合法！',
            '45050': '产品编码不合法！',
            '45060': '备注不合法！',
            '45409': '该网关对应产品编码已经存在！',
            '55010': '操作失败，请稍后尝试或联系客服！',
            '55020': '操作失败，请稍后尝试或联系客服！'
          }
          const params = {
            name: this.addGatewayProductForm.name,
            gatewayId: this.addGatewayProductForm.gatewayId,
            productId: this.addGatewayProductForm.productId,
            flow: this.addGatewayProductForm.flow,
            code: this.addGatewayProductForm.code,
            desc: this.addGatewayProductForm.desc
          }
          saveGatewayProduct(params).then(response => {
            const code = response.code
            if (code !== '25200') {
              vrender(this, irender, code)
              return
            }
            this.resetForm('addGatewayProductForm')
            this.addGatewayProductForm.visible = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.searchGatewayProductListData()
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    showEditGatewayProductDialog(data) {
      this.editGatewayProductForm.id = data.id
      this.editGatewayProductForm.name = data.name
      this.editGatewayProductForm.gatewayId = data.gatewayId
      this.editGatewayProductForm.gatewayName = data.gatewayName
      this.editGatewayProductForm.productId = data.productId
      this.editGatewayProductForm.productName = data.productName
      this.editGatewayProductForm.flow = data.flow
      this.editGatewayProductForm.code = data.code
      this.editGatewayProductForm.desc = data.desc
      this.editGatewayProductForm.visible = true
    },
    updateGatewayProduct() {
      this.$refs.editGatewayProductDialogForm.validate(valid => {
        if (valid) {
          const irender = {
            '45010': '参数不合法！',
            '45020': '网关不合法！',
            '45030': '套餐不合法！',
            '45040': '流量大小不合法！',
            '45050': '名称不合法！',
            '45060': '产品编码不合法！',
            '45070': '备注不合法！',
            '45404': '记录不存在！',
            '45409': '该网关对应产品编码已经存在！',
            '55010': '操作失败，请稍后尝试或联系客服！',
            '55020': '操作失败，请稍后尝试或联系客服！',
            '55030': '操作失败，请稍后尝试或联系客服！'
          }
          const params = {
            id: this.editGatewayProductForm.id,
            name: this.editGatewayProductForm.name,
            gatewayId: this.editGatewayProductForm.gatewayId,
            productId: this.editGatewayProductForm.productId,
            flow: this.editGatewayProductForm.flow,
            code: this.editGatewayProductForm.code,
            desc: this.editGatewayProductForm.desc
          }
          updateGatewayProduct(params).then(response => {
            const code = response.code
            if (code !== '25200') {
              vrender(this, irender, code)
              return
            }
            this.resetForm('editGatewayProductDialogForm')
            this.editGatewayProductForm.visible = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.searchGatewayProductListData()
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
    },
    // 网关选择器开始
    showGatewayChooser(inputKey) {
      this.gatewayChooser.visible = true
      this.gatewayChooser.inputKey = inputKey
    },
    searchGatewayChooserListData() {
      const params = {
        name: this.gatewayChooser.searchForm.name,
        pageNumber: this.gatewayChooser.searchForm.pageNumber,
        pageSize: this.gatewayChooser.searchForm.pageSize
      }
      getGateway(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.gatewayChooser.data = data.content
          this.gatewayChooser.searchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleGatewayChooseSizeChange(val) {
      this.gatewayChooser.searchForm.pageSize = val
      this.searchGatewayChooserListData()
    },
    handleGatewayChooseCurrentChange(val) {
      this.gatewayChooser.searchForm.pageNumber = val
      this.searchGatewayChooserListData()
    },
    gatewayChooserSearch(val) {
      this.gatewayChooser.searchForm.name = val[0].model
      this.searchGatewayChooserListData()
    },
    switchGatewayChooserVisible(val) {
      this.gatewayChooser.visible = val
    },
    getGatewayChooserData(val) {
      if (this.gatewayChooser.inputKey === 'search') {
        this.gatewayProductSearchForm.gatewayId = val[0].idString
        this.gatewayProductSearchForm.gatewayName = val[0].name
      } else if (this.gatewayChooser.inputKey === 'add') {
        this.addGatewayProductForm.gatewayId = val[0].idString
        this.addGatewayProductForm.gatewayName = val[0].name
      } else if (this.gatewayChooser.inputKey === 'edit') {
        this.editGatewayProductForm.gatewayId = val[0].idString
        this.editGatewayProductForm.gatewayName = val[0].name
      }
    },
    // 网关选择器结束
    // 套餐选择器开始
    showProductChooser(inputKey) {
      this.productChooser.visible = true
      this.productChooser.inputKey = inputKey
    },
    searchProductChooserListData() {
      const params = {
        name: this.productChooser.searchForm.name,
        pageNumber: this.productChooser.searchForm.pageNumber,
        pageSize: this.productChooser.searchForm.pageSize
      }

      getProduct(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.productChooser.data = data.content
          this.productChooser.searchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleProductChooseSizeChange(val) {
      this.productChooser.searchForm.pageSize = val
      this.searchProductChooserListData()
    },
    handleProductChooseCurrentChange(val) {
      this.productChooser.searchForm.pageNumber = val
      this.searchProductChooserListData()
    },
    productChooserSearch(val) {
      this.productChooser.searchForm.name = val[0].model
      this.searchProductChooserListData()
    },
    switchProductChooserVisible(val) {
      this.productChooser.visible = val
    },
    getProductChooserData(val) {
      if (this.productChooser.inputKey === 'search') {
        this.gatewayProductSearchForm.productId = val[0].idString
        this.gatewayProductSearchForm.productName = val[0].name
      } else if (this.productChooser.inputKey === 'add') {
        this.addGatewayProductForm.productId = val[0].idString
        this.addGatewayProductForm.productName = val[0].name
      } else if (this.productChooser.inputKey === 'edit') {
        this.editGatewayProductForm.productId = val[0].idString
        this.editGatewayProductForm.productName = val[0].name
      }
    }
    // 套餐选择器结束
  }
}
</script>

<style scoped>

</style>
