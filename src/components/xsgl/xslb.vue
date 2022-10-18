<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索选项卡片视图区 -->
    <el-card>
      <el-form label-width="60px">
        <el-row>
          <!-- 要搜索学生的学号 -->
          <el-col :span="6">
            <el-form-item label="学号">
              <el-input v-model="studentNumber" placeholder="请输入学生学号" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 要搜索学生的姓名 -->
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="studentName" placeholder="请输入学生姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 要搜索的宿舍号 -->
          <el-col :span="6">
            <el-form-item label="宿舍号">
              <el-input v-model="susheNumber" placeholder="请输入宿舍号" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 要搜索的楼宇 -->
          <el-col :span="6">
            <el-form-item label="楼宇">
              <el-input v-model="lyNumber" placeholder="请输入楼宇号" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 要搜索的学院 -->
          <el-col :span="6">
            <el-form-item label="学院">
              <el-input v-model="xueyuan" placeholder="请输入学院" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 要搜索的班级 -->
          <el-col :span="5">
            <el-form-item label="班级">
              <el-input v-model="className" placeholder="请输入班级名字" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 搜索按钮 -->
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-col>
          <!-- 添加按钮 -->
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible=true">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 学生列表卡片视图区 -->
    <el-card>
      <el-row></el-row>
      <!-- 列表数据 -->
      <el-table :data="studentlist" stripe border height="310">
        <el-table-column type="index" width="40px"></el-table-column>
        <el-table-column label="姓名" prop="name" width="70px"></el-table-column>
        <el-table-column label="学号" prop="uname"></el-table-column>
        <el-table-column label="性别" prop="sex" width="45px"></el-table-column>
        <el-table-column label="联系电话" prop="tel"></el-table-column>
        <el-table-column label="学院" prop="campus"></el-table-column>
        <el-table-column label="班级" prop="class"></el-table-column>
        <el-table-column label="楼宇号" prop="lynumber"></el-table-column>
        <el-table-column label="宿舍号" prop="dom"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="查看/编辑学生详细信息" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeStudentById(scope.row.id)"
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
        :page-sizes="[1, 2, 5, 10,100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name"></el-input>
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
          <el-form-item label="学号" prop="uname">
            <el-input v-model="addForm.uname"></el-input>
          </el-form-item>
          <el-form-item label="学院" prop="campus">
            <el-input v-model="addForm.campus"></el-input>
          </el-form-item>
          <el-form-item label="班级" prop="class">
            <el-input v-model="addForm.class"></el-input>
          </el-form-item>
          <el-form-item label="楼宇号" prop="lynumber">
            <el-input v-model="addForm.lynumber"></el-input>
          </el-form-item>
          <el-form-item label="宿舍号" prop="dom">
            <el-input v-model="addForm.dom"></el-input>
          </el-form-item>
          <el-form-item label="辅导员" prop="fdy">
            <el-input v-model="addForm.fdy"></el-input>
          </el-form-item>
          <el-form-item label="辅导员电话" prop="fdytel">
            <el-input v-model="addForm.fdytel"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人" prop="family">
            <el-input v-model="addForm.family"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人电话" prop="familytel">
            <el-input v-model="addForm.familytel"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看/编辑学生详细信息的对话框 -->
      <el-dialog
        title="查看/编辑学生详细信息"
        :visible.sync="viewdialogVisible"
        width="90%"
        @close="viewDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form :model="viewForm" ref="viewFormRef" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="学号" prop="uname">
                <el-input v-model="viewForm.uname" disabled></el-input>
              </el-form-item>
              <el-form-item label="学院" prop="campus">
                <el-input v-model="viewForm.campus" clearable></el-input>
              </el-form-item>
              <el-form-item label="紧急联系人" prop="family">
                <el-input v-model="viewForm.family" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="viewForm.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="班级" prop="class">
                <el-input v-model="viewForm.class" clearable></el-input>
              </el-form-item>
              <el-form-item label="紧急联系人电话" prop="familytel">
                <el-input v-model="viewForm.familytel" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别" prop="sex">
                <el-input v-model="viewForm.sex" disabled></el-input>
              </el-form-item>
              <el-form-item label="所在楼宇" prop="lyNumber">
                <el-input v-model="viewForm.lynumber" clearable></el-input>
              </el-form-item>
              <el-form-item label="辅导员" prop="fdy">
                <el-input v-model="viewForm.fdy" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="viewForm.tel" clearable></el-input>
              </el-form-item>
              <el-form-item label="所在宿舍" prop="dom">
                <el-input v-model="viewForm.dom" clearable></el-input>
              </el-form-item>
              <el-form-item label="辅导员电话" prop="fdytel">
                <el-input v-model="viewForm.fdytel" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="viewdialogVisible = false">取 消</el-button>
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
      // 学生列表
      studentlist: [],
      // 要搜索学生的学号
      studentNumber: "",
      // 要搜索学生的姓名
      studentName: "",
      // 要搜索的宿舍号
      susheNumber: "",
      // 要搜索的学院
      xueyuan: "",
      // 要搜索的楼宇号
      lyNumber: "",
      // 要搜索的班级名字
      className: "",
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前页每页显示多少条数据
        pagesize: 5
      },
      // 总页数
      total: 0,
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        pass: "123456",
        state: 1,
        uname: "",
        name: "",
        sex: "",
        tel: "",
        dom: "",
        campus: "",
        class: "",
        lyNumber: "",
        fdy: "",
        fdytel: "",
        family: "",
        familytel: ""
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        uname: [
          { required: true, message: "请输入学号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        campus: [
          { required: true, message: "请填写学院名字", trigger: "blur" }
        ],
        class: [{ required: true, message: "请填写班级名称", trigger: "blur" }],
        fdy: [{ required: true, message: "请填写辅导员姓名", trigger: "blur" }],
        fdytel: [
          { required: true, message: "请填写辅导员电话", trigger: "blur" }
        ],
        family: [
          { required: true, message: "请填写紧急联系人姓名", trigger: "blur" }
        ],
        familytel: [
          { required: true, message: "请填写紧急联系人电话", trigger: "blur" }
        ],
        lynumber: [
          {
            required: true,
            message: "请填写楼宇号,格式为“新区*号楼”",
            trigger: "blur"
          }
        ],
        dom: [
          { required: true, message: "请填写宿舍号，例如101", trigger: "blur" }
        ]
      },
      // 控制查看/修改学生信息的对话框的显示与隐藏
      viewdialogVisible: false,
      // 查看学生信息的表单数据
      viewForm: {
        id: "",
        uname: "",
        name: "",
        sex: "",
        tel: "",
        dom: "",
        campus: "",
        class: "",
        lynumber: "",
        fdy: "",
        fdytel: "",
        family: "",
        familytel: ""
      }
    };
  },
  created() {
    this.oneQuest();
    this.selectAll();
  },
  methods: {
    selectAll(){
      var _this = this;
      this.$http
        .get("http://localhost/xslbAll")
        .then(function(response) {
          console.log(response.data);
          if (response.data) {
            _this.total = response.data.length;
          }
        });
    },
    // 封装页面加载请求函数
    oneQuest() {
      var _this = this;
      const data={
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
      }
      this.$http
        .post("http://localhost/xslb", {
          data
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data) {
            _this.studentlist = response.data;
          }
        });
    },
    search() {
      var _this = this;
      const data={
          uname: this.studentNumber,
          name: this.studentName,
          dom: this.susheNumber,
          campus: this.xueyuan,
          lynumber: this.lyNumber,
          class: this.className,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
      }
      this.$http
        .post("http://localhost/xslb/search", {
          data
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data) {
            _this.studentlist = response.data;
            _this.selectAll();
          }
        });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.oneQuest();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.oneQuest();
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      // this.$refs.addFormRef.resetFields();
    },
    //点击确定按钮，添加新用户
    addUser() {
      var _this = this;
      this.$refs.addFormRef.validate(valid => {
        console.log(valid);
        if (!valid) return;
        const data={
           name : this.addForm.name,
           uname : this.addForm.uname,
           sex : this.addForm.sex,
           tel : this.addForm.tel,
           dom : this.addForm.dom,
           campus : this.addForm.campus,
           lynumber : this.addForm.lynumber,
           class : this.addForm.class,
           fdy : this.addForm.fdy,
           fdytel : this.addForm.fdytel,
           family : this.addForm.family,
           familytel : this.addForm.familytel
        }
        // 如果预校验成功则发起添加用户请求
        // this.studentlist.unshift(this.addForm);
        this.$http
          .post("http://localhost/xslb/add", {data})
          .then(function(response) {
            console.log(response.data);
            if (response.data) {
              _this.oneQuest();
              // _this.selectAll();
              _this.reload();
              _this.$message({
                showClose: true,
                message: "添加学生成功",
                type: "success"
              });
            }else{
              _this.$message({
                showClose: true,
                message: "添加学生失败",
                type: "error"
              });
            }
          });
        this.addDialogVisible = false;
      });
    },
    // 展示查看/修改学生信息的对话框
    showEditDialog(user) {
      this.viewdialogVisible = true;
      console.log(user);
      // 此处不应该这样渲染，应该根据用户id发起请求，得到用户信息后再渲染
      this.viewForm.name = user.name;
      this.viewForm.uname = user.uname;
      this.viewForm.sex = user.sex;
      this.viewForm.tel = user.tel;
      this.viewForm.dom = user.dom;
      this.viewForm.campus = user.campus;
      this.viewForm.class = user.class;
      this.viewForm.lynumber = user.lynumber;
      this.viewForm.fdy = user.fdy;
      this.viewForm.fdytel = user.fdytel;
      this.viewForm.family = user.family;
      this.viewForm.familytel = user.familytel;
      this.viewForm.id = user.id;
      // 根据用户id发起请求，得到用户信息
    },
    // 监听查看/修改学生信息对话框关闭事件
    viewDialogClosed() {
      // this.$refs.viewFormRef.resetFields();
    },
    // 查看/修改学生信息对话框确定按钮事件
    editUserInfo() {
      var _this = this;
      const data={
        tel:this.viewForm.tel,
        campus:this.viewForm.campus,
        class:this.viewForm.class,
        lynumber:this.viewForm.lynumber,
        dom:this.viewForm.dom,
        fdy:this.viewForm.fdy,
        fdytel:this.viewForm.fdytel,
        family:this.viewForm.family,
        familytel:this.viewForm.familytel,
        id:this.viewForm.id
      }
      this.$refs.viewFormRef.validate(valid => {
        
        if (!valid) return;
        // 如果预校验成功则发起修改用户信息的请求
        this.$http
          .post("http://localhost/xslb/edit", {data})
          .then(function(response) {
            // console.log(response.data);
            if (response.data!=='error') {
              _this.oneQuest();
              _this.$message({
                showClose: true,
                message: "更新数据成功",
                type: "success"
              });
            }else {
              _this.$message({
                showClose: true,
                message: "更新数据失败",
                type: "error"
              });
            }
          });

        this.viewdialogVisible = false;
      });
    },
    // 根据学生的id删除学生信息
    async removeStudentById(id) {
      var _this = this;
      // 弹框询问用户是否删除数据
      const cofirmResult = await this.$confirm(
        "此操作将永久删除该学生信息, 是否继续?",
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
      const data={
        id:id
      }
      // 如果点击了确认按钮则发起请求删除对应数据
      this.$http
        .post("http://localhost/xslb/del", {
          data
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data) {
            // _this.$http
            //   .post("http://localhost:3000/xslb/search", {
            //     studentNumber: _this.studentNumber,
            //     studentName: _this.studentName,
            //     susheNumber: _this.susheNumber,
            //     xueyuan: _this.xueyuan,
            //     lyNumber: _this.lyNumber,
            //     className: _this.className,
            //     pagenum: _this.queryInfo.pagenum,
            //     pagesize: _this.queryInfo.pagesize
            //   })
            //   .then(function(response) {
            //     console.log(response.data);
            //     if (response.data.code == 200) {
            //       _this.studentlist = response.data.data;
            //       _this.total = response.data.total;
            //     }
            //   });
            _this.reload();
            return _this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          }
        });
    }
  }
};
</script>

<style lang="css" scoped>
.el-button {
  margin-left: 30px;
}
</style>