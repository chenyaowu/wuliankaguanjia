# 物联卡管家前端应用
## 开发
### 克隆项目
git clone https://github.com/chenyaowu/wuliankaguanjia.git

### 进入项目目录
cd wuliankaguanjia

### 安装依赖
npm install

### 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

### 启动服务
npm run dev

浏览器访问 http://localhost:9527

### 命名规范
#### 变量命名
1. 搜索表单以,模块名+SearchForm为对象。例如：按用户名搜索用户，命名为"userSearchForm.username"
2. 添加表单以，模块名+AddForm为对象。例如：按用户名搜索用户，命名为"userAddForm.username"
3. 编辑表单以，模块名+EditForm为对象。例如：按用户名搜索用户，命名为"userEditForm.username"
4. table数据，模块名+TableData。例如：用户table，命名为"userTableData"
#### 方法命名
1. 搜索方法以，search+模块名+ListData。例如：搜索用户方法：searchUserListData
2. 删除方法以，remove+模块名。例如：搜索用户方法：removeUser
3. 打开对话框，show+功能+dialog。例如：打开添加用户对话框：showAddUserDialog
4. 