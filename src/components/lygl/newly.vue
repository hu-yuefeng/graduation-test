<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>楼宇管理</el-breadcrumb-item>
      <el-breadcrumb-item>楼宇列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索选项卡片视图区 -->
    <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入楼宇号" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search(queryInfo.query)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
    <!-- 楼宇列表卡片视图区 -->
    <el-card>
      <!-- 列表数据 -->
      <el-table :data="lylist" stripe border height="355">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="楼宇号" prop="lynumber"></el-table-column>
        <el-table-column label="负责人" prop="leader"></el-table-column>
        <el-table-column label="性别" prop="sex"></el-table-column>
        <el-table-column label="联系电话" prop="tel"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removelyInfoById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加楼宇的对话框 -->
      <el-dialog title="添加楼宇" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item label="楼宇号" prop="lynumber">
            <el-input v-model="addForm.lynumber"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="addForm.leader"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="addForm.sex" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="addForm.tel"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看/编辑楼宇信息的对话框 -->
      <el-dialog
        title="查看/编辑楼宇详细信息"
        :visible.sync="editdialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="120px">
          <el-form-item label="楼宇号" prop="lynumber">
            <el-input v-model="editForm.lynumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="楼宇负责人" prop="leader">
            <el-input v-model="editForm.leader" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="editForm.sex" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="editForm.tel" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  inject:['reload'],
  data() {
    // 添加手机号的验证规则
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则表达式
      // const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 楼宇全部信息列表
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前页每页显示多少条数据
        pagesize: 5
      },
      lylist:[],
      // 总页数
      total: 0,
      // 控制添加楼宇的对话框的显示与隐藏
      addDialogVisible: false,
      // 添加楼宇的表单数据
      addForm: {
        lynumber: "",
        leader: "",
        sex: "",
        tel: ""
      },
      // addexl:[],
      // 添加表单的验证规则对象
      addFormRules:{
        lynumber: [
          { required: true, message: "请输入楼宇号", trigger: "blur" }
        ],
        leader: [
          { required: true, message: "请输入负责人", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "请输入性别", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      },
      // 控制编辑的对话框的显示与隐藏
      editdialogVisible: false,
      // 编辑楼宇的表单数据
      editForm: {
        id: "",
        lynumber: "",
        leader: "",
        sex: "",
        tel: ""
      },
      // 编辑表单的验证规则对象
      editFormRules: {
        leader: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    search(index){
      // console.log(index);
      var that = this;
      var data={
            lynumber:index,
            pagenum: this.queryInfo.pagenum,
            pagesize: this.queryInfo.pagesize
      }
      this.$http
        .post("http://localhost/lygl/search",{data})
        .then(function(response) {
          console.log(response);
            that.total = response.data.length;
            that.lylist = response.data;
        });
    },  
    getDetial(){
    var that = this;
    var data={
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
    }
    this.$http
      .get("http://localhost/NewlyAll")
      .then(function(response) {
        console.log(response);
          that.total = response.data.length;
          // _this.total = response.data.total;
        
      });
    this.$http
      .post("http://localhost/Newly",{data})
      .then(function(response) {
        console.log(response);
          that.lylist = response.data;
          // _this.total = response.data.total;
        
      })
    },
    
    // 监听pageSize每页显示多少条数据改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      var that=this;
      this.queryInfo.pagesize = newSize;
      var data={
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
    }
      this.$http
        .post("http://localhost/Newly", {data})
        .then(function(response) {
          console.log(response.data);
          that.lylist = response.data;
        });
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      var that=this;
      this.queryInfo.pagenum = newPage;
      var data={
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
    }
      this.$http
        .post("http://localhost/Newly", {data})
        .then(function(response) {
          console.log(response.data);
          that.lylist = response.data;
        });
    },
   
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加楼宇对话框确定按钮事件
    addUser() {
      var _this = this;
      this.$refs.addFormRef.validate(valid => {
        console.log(valid);
        const data =this.addForm;
        if (!valid) return;
        // 如果预校验成功则发起添加用户请求
        this.$http
          .post("http://localhost/newly/add", {data})
          .then(function(response) {
            console.log(response.data);
            if (response!=='error') {
              _this.$message({
                title: "成功",
                message: "添加楼宇信息成功",
                type: "success"
              });
              _this.addDialogVisible = false;
              _this.reload();
            } else {
              _this.$message({
                title: "失败",
                message: "添加楼宇信息失败",
                type: "error"
              });
              _this.addDialogVisible = false;
            }
          });
      });
    },
    // 点击编辑按钮展示编辑信息对话框
    showEditDialog(id) {
      // 根据用户id发起请求，得到用户信息
      var _this = this;
      this.editdialogVisible = true;
      console.log(id);
      const data={
        id:id
      };
      this.$http
        .post("http://localhost/newlyShow",{data})
        .then(function(response) {
          // console.log(response.data[0].tel);
          _this.editForm = response.data[0];
        });
    },

    // 编辑楼宇对话框确定按钮事件
    editUserInfo() {
      var that =this;
      this.$refs.editFormRef.validate(valid => {
        console.log(valid);
        if (!valid) return;
        // 如果预校验成功则发起修改用户信息的请求
        const data={
            leader: this.editForm.leader,
            sex:this.editForm.sex,
            tel:this.editForm.tel,
            id:this.editForm.id
        }
        this.$http
          .post("http://localhost/updateNewly",{data})
          .then(function(response) {
            if(response.data){
                that.$message({
                showClose: true,
                message: "更新数据成功",
                type: "success"
              },
              that.reload()
              );
            }else
            {
                that.$message({
                showClose: true,
                message: "更新数据失败",
                type: "error"
              });
            }
          });
        this.editdialogVisible = false;
      });
    },

    // 监听编辑楼宇信息对话框的关闭事件
    editDialogClosed() {
      // this.$refs.editFormRef.resetFields();
    },

    // 根据id删除对应楼宇信息
    async removelyInfoById(id) {
      console.log(id);
      var that = this;
      const data={
        id:id
      }
      const cofirmResult = await this.$confirm(
        "此操作将永久删除该楼宇信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果用户确认删除，则返回字符串 confirm
      // 如果取消删除，则返回字符串 cancel
      // console.log(cofirmResult)
      if (cofirmResult !== "confirm") {
        return this.$message({
          showClose: true,
          message: "已取消删除",
          type: "info"
        });
      }
      // 如果点击了确认按钮则发起请求删除对应数据
      this.$http
        .post("http://localhost/newlyAllDelete", {
          data
        })
        .then(function(response) {
          console.log(response.data);
            that.lylist = response.data;
            that.total=that.lylist.length;
            that.getDetial();
            that.$message({
              showClose: true,
              message: "已删除该楼宇信息",
              type: "error"
            });
        });
    },
    
  },
  created() {
    this.getDetial()
  }
};
</script>

<style lang="css" scoped>
.el-button {
  margin-left: 30px;
}
.cardBg {
  background: red;
}
</style>