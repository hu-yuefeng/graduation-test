<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>宿舍管理</el-breadcrumb-item>
      <el-breadcrumb-item>宿舍列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <div class="btn11">{{name}}</div> -->
    <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入宿舍号" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search(queryInfo.query)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addSushe=true">新增宿舍</el-button>
        </el-col>
      </el-row>
    <el-dialog title="添加宿舍" :visible.sync="addSushe" width="50%">
        <!-- 内容主体区 -->
        <el-form :model="addForm" ref="addFormRef1" :rules="addFormRules" label-width="80px">
          <el-form-item label="宿舍号" prop="sushe">
            <el-input v-model="addForm.sushe"></el-input>
          </el-form-item>
          <el-form-item label="宿舍长" prop="ssz">
            <el-input v-model="addForm.ssz"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserdom">确 定</el-button>
        </span>
      </el-dialog>
    <!-- 宿舍详细信息展示区域 -->
    <el-card>
      <el-table
        :data="sslist"
        style="width: 100%"
        stripe
        border
        height="380"
      >
        <el-table-column prop="sushe" label="宿舍号"></el-table-column>
        <el-table-column prop="ssz" label="宿舍长"></el-table-column>
        <el-table-column prop="member" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.number< 4">未满</el-tag>
            <el-tag type="danger" v-else>已满</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <!-- 查看按钮 -->
            <el-tooltip effect="dark" content="查看" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-view" size="mini" @click="rowClik(scope.row)"></el-button>
            </el-tooltip>
            
            <!-- 添加学生按钮 -->
            <el-tooltip effect="dark" content="分配学生" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-plus"
                size="mini"
                v-if="scope.row.number < 4 ? true:false"
                @click="addStudent(scope.row.sushe)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSs(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="宿舍信息" :visible.sync="dialogTableVisible">
        <el-table :data="gridData" stripe border>
          <el-table-column property="name" label="姓名"></el-table-column>
          <el-table-column property="class" label="班级"></el-table-column>
          <el-table-column property="campus" label="学院"></el-table-column>
          <el-table-column property="number" label="学号"></el-table-column>
          <el-table-column property="tel" label="联系电话"></el-table-column>
          <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <!-- 查看按钮 -->
                <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="rowDelClik(scope.row)"></el-button>
                </el-tooltip>
              </template>
          </el-table-column>
        </el-table>
      </el-dialog>
     
      
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
      
      <el-dialog title="学生信息" :visible.sync="dialogForm">
        <el-form :model="formStudent" :rules="studentrules" ref="formStudent">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formStudent.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="班级" :label-width="formLabelWidth" prop="class"> 
            <el-input v-model="formStudent.class" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="学院" :label-width="formLabelWidth" prop="campus">
            <el-input v-model="formStudent.campus" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="学号" :label-width="formLabelWidth" prop="number">
            <el-input v-model="formStudent.number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" :label-width="formLabelWidth" prop="tel">
            <el-input v-model="formStudent.tel" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
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
      formLabelWidth: '120px',
      dialogForm:false,
      sslist:[],
      // 宿舍列表
      gridData:[],
      queryInfo: {
        // 当前页数
        pagenum: 1,
        // 当前页每页显示多少条数据
        pagesize: 5
      },
      // 总页数
      total: 0,
      addSushe:false,
      // 控制分配学生的对话框的显示与隐藏
      addDialogVisible: false,
      // 分配学生的表单数据
      addForm: {
        sushe:"",
        ssz:""
      },
      formStudent:{
        name:"",
        class:"",
        campus:"",
        number:"",
        tel:"",
      },
      middle:"",
      dialogTableVisible:false,
      // 添加表单的验证规则对象
      studentrules: {
        name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
        number: [
          { required: true, message: "请输入学生学号", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        campus: [{ required: true, message: "请输入学院", trigger: "blur" }],
        class: [{ required: true, message: "请输入班级", trigger: "blur" }]
      },
      addFormRules:{
        sushe: [
          { required: true, message: "请输入宿舍号", trigger: "blur" }
        ],
        ssz: [
          { required: true, message: "请输入宿舍长", trigger: "blur" }
        ],
      },
      // 控制编辑的对话框的显示与隐藏
      editdialogVisible: false,
      // 编辑学生信息的表单数据
      editForm: {
        name: "",
        uname: "",
        tel: "",
        fdy: "",
        fdytel: "",
        xueyuan: "",
        banji: ""
      },

    };
  },
  created() {
      this.getDetial();
  },
  methods: {
    deleteSs(index){
      var _this=this;
      console.log(index);
      const data={
        id:index.id
      }
      this.$http
              .post("http://localhost/domList/del", {data
              })
              .then(function(response) {
                console.log(response.data);
                if (response) {
                  _this.$message({
                  title: "成功",
                  message: "删除宿舍成功",
                  type: "success"
                });
                _this.addSushe = false;
                _this.reload();
                  }
              });
    },
    addUserdom(){
      var _this = this;
      this.$refs.addFormRef1.validate(valid => {
        if(valid){
           const data=this.addForm
            this.$http
              .post("http://localhost/domList/add", {data
              })
              .then(function(response) {
                console.log(response.data);
                if (response) {
                  _this.$message({
                  title: "成功",
                  message: "添加宿舍成功",
                  type: "success"
                });
                _this.addSushe = false;
                _this.reload();
                  }
              });
        }
      })
    },
    // 点击搜索按钮发起请求
    getDetial(){
      var that = this;
      const data={
      pagenum: this.queryInfo.pagenum,
      pagesize: this.queryInfo.pagesize
    }
    this.$http
      .post("http://localhost/domList", {data
      })
      .then(function(response) {
        console.log(response.data);
        if (response) {
          that.sslist = response.data;
        }
      });
    this.$http
      .get("http://localhost/domListShow", {data
      })
      .then(function(response) {
        console.log(response.data);
        if (response) {
          that.total = response.data.length;
        }
      });
    },
    rowClik(index){
      this.dialogTableVisible=true;
      var that =this;
      console.log(index.sushe);
      const data={
        dom : index.sushe
      };
       this.$http
      .post("http://localhost/ssuser", {data
      })
      .then(function(response) {
        console.log(response.data);
        if (response) {
          that.gridData = response.data;
        }
      })
    },
    rowDelClik(index){
      var that =this;
      console.log(index);
      const data ={
        id:index.id
      };
      this.$http
      .post("http://localhost/ssglDelete", {data
      })
      .then(function(response) {
        console.log(response.data);
        if (response) {
          that.gridData = response.data;
          that.$message({
                showClose: true,
                message: "更新数据成功",
                type: "success"
              },
              that.reload()
              );
          
        }
      })
    },
    search(sushe) {
      // console.log(sushe);
      if(sushe!== undefined){
        var _this = this;
        // 点击搜索按钮发起请求，得到搜索后的数据
        const data={
            sushe: sushe,
            pagenum: this.queryInfo.pagenum,
            pagesize: this.queryInfo.pagesize
        }
        this.$http
          .post("http://localhost/dormList/search", {data})
          .then(function(response) {
            console.log(response.data);
            _this.sslist = response.data;
            _this.total = response.data.length;
          });
      }
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      var _this = this;
      const data={
          pagenum: this.queryInfo.pagenum,
          pagesize: newSize
      }
      this.$http
        .post("http://localhost/domList", {
          data
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data) {
            _this.sslist = response.data;
          }
        });
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      var _this = this;
      const data={
          pagenum: newPage,
          pagesize: this.queryInfo.pagesize
      }
      this.$http
        .post("http://localhost/domList", {
          data
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data) {
            _this.sslist = response.data;
            // _this.total = response.data.pagetotal;
          }
        });
    },
    // 分配学生按钮添加事件
    addStudent(index) {
      console.log(index);
      this.middle=index;
      console.log(this.middle);
      this.dialogForm = true;
    },
    // 监听分配学生对话框的关闭事件
    // addDialogClosed() {
    //   this.$refs.addFormRef.resetFields();
    // },
    // 分配学生对话框确定按钮事件
    addUser() {
      this.$refs.formStudent.validate(valid => {
        console.log(this.middle);
        if (!valid) return;
        // 如果预校验成功则发起添加用户请求
        // this.studentlist.unshift(this.addForm);
        var _this = this;
        const data ={
          name:this.formStudent.name,
          class:this.formStudent.class,
          campus:this.formStudent.campus,
          number:this.formStudent.number,
          tel:this.formStudent.tel,
          dom:this.middle
        }
        this.$http
          .post("http://localhost/addssuser", {data})
          .then(function(response) {
            console.log(response.data);
            if (response.data) {
              _this.$message({
                message: "分配学生成功",
                type: "success"
              });
              _this.dialogForm = false;
              _this.reload();
            
            }
          });
      });
    },
    // 根据id删除对应学生信息
    async removelyInfoById(id) {
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
      // 如果点击了确认按钮则发起请求删除对应数据
      this.$http
        .post("http://localhost:3000/dormList/del", {
          id: id
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data.code == 200) {
            _this.$http
              .post("http://localhost:3000/dormList/search", {
                lynumber: _this.lynumber,
                ssnumber: _this.ssnumber,
                pagenum: _this.queryInfo.pagenum,
                pagesize: _this.queryInfo.pagesize
              })
              .then(function(response) {
                console.log(response.data);
                if (response.data.code == 200) {
                  _this.sslist = response.data.data;
                  _this.total = response.data.pagetotal;
                }
              });
            return _this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          }
        });
      console.log("确认了删除");
    },
    // 监听编辑楼宇信息对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑楼宇对话框确定按钮事件
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        console.log(valid);
        if (!valid) return;
        // 如果预校验成功则发起修改用户信息的请求
        this.editdialogVisible = false;
      });
    },
    // 点击编辑按钮展示编辑信息对话框
    showEditDialog(user) {
      this.editdialogVisible = true;
      console.log(user);
      // 此处不应该这样渲染，应该根据用户id发起请求，得到用户信息后再渲染
      this.editForm.name = user.name;
      this.editForm.uname = user.uname;
      this.editForm.tel = user.tel;
      this.editForm.fdy = user.fdy;
      this.editForm.fdytel = user.fdytel;
      this.editForm.xueyuan = user.xueyuan;
      this.editForm.banji = user.banji;
      // 根据用户id发起请求，得到用户信息
    }
  }
};
</script>

<style lang="css" scoped>
.el-button {
  margin-left: 30px;
}
.btn11{
  width:100px;
  height: 50px;
  background-color: rgba(255,0,0,0.8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>