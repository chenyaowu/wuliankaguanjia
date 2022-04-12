<template>
  <div class="app-container">
    <el-form ref="productSearchForm" :inline="true" label-position="left" label-width="80px" :model="productSearchForm">
      <el-row>
        <el-form-item label="名称" prop="name">
          <el-input v-model="productSearchForm.name" />
        </el-form-item>
        <el-form-item label="计费单位" prop="unit">
          <el-select v-model="productSearchForm.unit">
            <el-option label="-" value="" />
            <el-option label="月" value="月" />
            <el-option label="季度" value="季度" />
            <el-option label="半年" value="半年" />
            <el-option label="年" value="年" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐类型" prop="type">
          <el-select v-model="productSearchForm.type">
            <el-option label="-" value="" />
            <el-option label="测试期" value="0" />
            <el-option label="沉默期" value="1" />
            <el-option label="月独立" value="2" />
            <el-option label="长周期" value="3" />
            <el-option label="加油包" value="4" />
            <el-option label="短信" value="5" />
            <el-option label="语音" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input v-model="productSearchForm.price" />
        </el-form-item>
        <el-form-item label-width="240px" label="流量（M）/ 语音（分钟）/ 短信条数" prop="flow">
          <el-input v-model="productSearchForm.flow" />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('productSearchForm')">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchProductListData">查询</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addProductForm.visible = true">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeProduct()">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :data="productTableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleProductTableSelectionChange"
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
        prop="unit"
        label="计费单元"
      />
      <el-table-column
        prop="typeString"
        label="套餐类型"
      />
      <el-table-column
        prop="priceYuan"
        label="价格（元）"
      />
      <el-table-column
        prop="flow"
        label="大小(M/分钟/条)"
      />
      <el-table-column
        prop="charges"
        label="资费详情"
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
            @click.native.prevent="showEditProductDialog(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="productSearchForm.pageNumber"
      :page-sizes="[10, 15, 30, 50, 100, 200, 300, 400]"
      :page-size="productSearchForm.pageSize"
      :total="productSearchForm.totalElements"
      layout="total, sizes, prev, pager, next, jumper"
      next-text="下一页"
      prev-text="上一页"
      @size-change="handleProductTableSizeChange"
      @current-change="handleProductTableCurrentChange"
    />
    <el-dialog title="添加" :visible.sync="addProductForm.visible" width="50%">
      <el-form ref="addProductForm" :model="addProductForm" :rules="addProductRules">
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model="addProductForm.name" />
        </el-form-item>
        <el-form-item label="计费单位" label-width="120px" prop="unit">
          <el-select v-model="addProductForm.unit">
            <el-option label="-" value="" />
            <el-option label="月" value="月" />
            <el-option label="季度" value="季度" />
            <el-option label="半年" value="半年" />
            <el-option label="年" value="年" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐类型" label-width="120px" prop="type">
          <el-select v-model="addProductForm.type">
            <el-option label="-" value="" />
            <el-option label="测试期" value="0" />
            <el-option label="沉默期" value="1" />
            <el-option label="月独立" value="2" />
            <el-option label="长周期" value="3" />
            <el-option label="加油包" value="4" />
            <el-option label="短信" value="5" />
            <el-option label="语音" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格（元）" label-width="120px" prop="price">
          <el-input v-model="addProductForm.price" />
        </el-form-item>
        <el-form-item label="流量（M）/ 语音（分钟）/ 短信条数" label-width="120px" prop="flow">
          <el-input v-model="addProductForm.flow" />
        </el-form-item>
        <el-form-item label="资费详情" label-width="120px" prop="charges">
          <el-input v-model.trim="addProductForm.charges" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addProductForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="addProduct">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editProductForm.visible" width="50%">
      <el-form ref="editProductDialogForm" :model="editProductForm" :rules="editProductRules">
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model="editProductForm.name" />
        </el-form-item>
        <el-form-item label="计费单位" label-width="120px" prop="unit">
          <el-select v-model="editProductForm.unit">
            <el-option label="-" value="" />
            <el-option label="月" value="月" />
            <el-option label="季度" value="季度" />
            <el-option label="半年" value="半年" />
            <el-option label="年" value="年" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐类型" label-width="120px" prop="type">
          <el-select v-model="editProductForm.type">
            <el-option label="-" value="" />
            <el-option label="测试期" value="0" />
            <el-option label="沉默期" value="1" />
            <el-option label="月独立" value="2" />
            <el-option label="长周期" value="3" />
            <el-option label="加油包" value="4" />
            <el-option label="短信" value="5" />
            <el-option label="语音" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" label-width="120px" prop="price">
          <el-input v-model="editProductForm.price" />
        </el-form-item>
        <el-form-item label="流量（M）/ 语音（分钟）/ 短信条数" label-width="120px" prop="flow">
          <el-input v-model="editProductForm.flow" />
        </el-form-item>
        <el-form-item label="资费详情" label-width="120px" prop="charges">
          <el-input v-model.trim="editProductForm.charges" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editProductForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="updateProduct">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteProduct, getProduct, saveProduct, updateProduct } from '@/api/console/product'
import { removeById, vrender } from '@/utils'
import { isLength } from '@/utils/validate'
export default {
  name: 'ConsoleSystemProductList',
  data() {
    const validateProductName = (rule, value, callback) => {
      if (!isLength(value, 1, 32)) {
        callback(new Error('套餐名不合法！'))
      } else {
        getProduct({ 'name': value }).then(response => {
          if (response.code !== '25200' || response.data.content.length > 0) {
            callback(new Error('同名套餐已存在！'))
          } else {
            callback()
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
    return {
      productTableMultipleSelection: [],
      productTableData: [],
      productSearchForm: {
        name: '',
        unit: '',
        type: '',
        price: '',
        flow: '',
        pageNumber: 1,
        pageSize: 10,
        totalElements: 1
      },
      addProductForm: {
        visible: false,
        name: '',
        unit: '',
        type: '',
        price: '',
        flow: '',
        charges: ''
      },
      editProductForm: {
        visible: false,
        name: '',
        unit: '',
        type: '',
        price: '',
        flow: '',
        charges: ''
      },
      addProductRules: {
        name: [{ required: true, trigger: 'blur', validator: validateProductName }],
        unit: { required: true, trigger: 'blur', message: '请选择计费单位' },
        type: { required: true, trigger: 'blur', message: '请选择套餐类型' },
        price: { required: true, trigger: 'blur', message: '请输入价格' },
        flow: { required: true, trigger: 'blur', message: '此项不可为空' }
      },
      editProductRules: {
        name: { required: true, trigger: 'blur', message: '请输入套餐名' },
        unit: { required: true, trigger: 'blur', message: '请选择计费单位' },
        type: { required: true, trigger: 'blur', message: '请选择套餐类型' },
        price: { required: true, trigger: 'blur', message: '请输入价格' },
        flow: { required: true, trigger: 'blur', message: '此项不可为空' }
      }
    }
  },
  created() {
    this.searchProductListData()
  },
  methods: {
    searchProductListData() {
      const params = {
        name: this.productSearchForm.name,
        unit: this.productSearchForm.unit,
        type: this.productSearchForm.type,
        price: this.productSearchForm.price,
        flow: this.productSearchForm.flow,
        pageNumber: this.productSearchForm.pageNumber,
        pageSize: this.productSearchForm.pageSize
      }
      getProduct(params).then(response => {
        const code = response.code
        const data = response.data
        if (code === '25200') {
          this.productTableData = data.content
          this.productSearchForm.totalElements = +data.totalElements
        }
      }).catch(error => {
        console.log(error)
      })
    },
    removeProduct() {
      // 拿到选中的数据
      const val = this.productTableMultipleSelection
      // 如果选中数据存在
      const irender = {
        '45010': '参数不合法！',
        '45020': '该套餐已被绑定，不能删除！',
        '55010': '操作失败，请稍后尝试或联系客服！',
        '55020': '操作失败，请稍后尝试或联系客服！'
      }
      removeById(this, val, irender, deleteProduct, this.searchProductListData)
    },
    handleProductTableSelectionChange(val) {
      this.productTableMultipleSelection = val
    },
    handleProductTableSizeChange(val) {
      this.productSearchForm.pageSize = val
      this.searchProductListData()
    },
    handleProductTableCurrentChange(val) {
      this.productSearchForm.pageNumber = val
      this.searchProductListData()
    },
    addProduct() {
      this.$refs.addProductForm.validate(valid => {
        if (valid) {
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
            name: this.addProductForm.name,
            unit: this.addProductForm.unit,
            type: this.addProductForm.type,
            price: this.addProductForm.price,
            flow: this.addProductForm.flow,
            charges: this.addProductForm.charges,
            desc: ''
          }
          saveProduct(params).then(response => {
            const code = response.code
            if (code !== '25200') {
              vrender(this, irender, code)
              return
            }
            this.resetForm('addProductForm')
            this.addProductForm.visible = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.searchProductListData()
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    showEditProductDialog(data) {
      this.editProductForm.name = data.name
      this.editProductForm.unit = data.unit
      this.editProductForm.type = data.type
      this.editProductForm.price = data.priceYuan
      this.editProductForm.flow = data.flow
      this.editProductForm.charges = data.charges
      this.editProductForm.visible = true
    },
    updateProduct() {
      this.$refs.addProductForm.validate(valid => {
        if (valid) {
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
            name: this.addProductForm.name,
            unit: this.addProductForm.unit,
            type: this.addProductForm.type,
            price: this.addProductForm.price,
            flow: this.addProductForm.flow,
            charges: this.addProductForm.charges,
            desc: ''
          }
          updateProduct(params).then(response => {
            const code = response.code
            if (code !== '25200') {
              vrender(this, irender, code)
              return
            }
            this.resetForm('editProductDialogForm')
            this.editProductForm.visible = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.searchProductListData()
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
