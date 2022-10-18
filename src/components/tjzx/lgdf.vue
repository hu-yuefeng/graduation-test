<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计中心</el-breadcrumb-item>
      <el-breadcrumb-item>宿舍打分</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 查找板块 -->
      <el-form :model="searchForm" ref="addFormRef" label-width="60px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="楼宇号" prop="lyNumber">
              <el-input v-model="searchForm.lyNumber" placeholder="请输入楼宇号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="宿舍号" prop="dom">
              <el-input v-model="searchForm.dom" placeholder="请输入宿舍号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible=true">打分</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 标签页 -->
      <el-tabs type="border-card">
        <el-tab-pane label="数据表展示">
          <!-- 数据列表 -->
          <el-table
            :data="datalist"
            stripe
            border
            maxheight="350px"
            :default-sort="{prop: 'time',prop: 'health',prop: 'discipline',prop: 'dormitoryculture',prop: 'total', order: 'descending'}"
          >
            <el-table-column label="楼宇号" prop="lynumber" width="90px"></el-table-column>
            <el-table-column label="宿舍号" prop="dom" width="90px"></el-table-column>
            <el-table-column label="评分时间" prop="time" sortable></el-table-column>
            <el-table-column label="卫生（分）" prop="ws" sortable width="110px"></el-table-column>
            <el-table-column label="纪律（分）" prop="jl" sortable width="110px"></el-table-column>
            <el-table-column label="宿舍文化（分）" prop="wh" sortable></el-table-column>
            <el-table-column label="总分（分）" prop="zf" sortable width="110px"></el-table-column>
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
        </el-tab-pane>
      </el-tabs>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加评价" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="楼宇号" prop="lyNumber">
            <el-select v-model="addForm.lyNumber" placeholder="请选择楼宇号" >
              <el-option v-for="(item,index) in getly" :key="index" :value="item.lynumber"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="楼宇号" prop="lyNumber">
            <el-input v-model="addForm.lyNumber"></el-input>
          </el-form-item> -->
          <el-form-item label="宿舍号" prop="dom">
            <el-input v-model="addForm.dom"></el-input>
          </el-form-item>
          <!-- 选择日期 -->
            <el-form-item label="评分日期" prop="data">
              <el-date-picker
                v-model="addForm.data"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          <el-form-item label="卫生分" prop="ws">
            <el-input v-model="addForm.ws"></el-input>
          </el-form-item>
          <el-form-item label="纪律分" prop="jl">
            <el-input v-model="addForm.jl"></el-input>
          </el-form-item>
          <el-form-item label="文化分" prop="wh">
            <el-input v-model="addForm.wh"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  inject:['reload'],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      // 宿舍评分查询表单数据
      searchForm: {
        lyNumber: "",
        dom: ""
      },
      getly:[],
      // 添加用户的表单数据
      addForm: {
        lyNumber: "",
        dom:'',
        ws:'',
        jl:'',
        wh:'',
        // 要选择的日期
        data: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        dom: [
          { required: true, message: "请输入宿舍号", trigger: "blur" },
        ],
        data: [{ required: true, message: "请选择评分日期", trigger: "blur" }],
  
        jl: [
          { required: true, message: "请填写纪律分", trigger: "blur" }
        ],
        wh: [
          { required: true, message: "请填写宿舍文化分", trigger: "blur" }
        ],
        ws: [
          { required: true, message: "请填写卫生分", trigger: "blur" }
        ],
        lyNumber: [
          {
            required: true,
            message: "请填写楼宇号",
            trigger: "blur"
          }
        ]
      },
      // 数据列表
      datalist: [],
      queryInfo: {
        // 当前页数
        pagenum: 1,
        // 当前页每页显示多少条数据
        pagesize: 5
      },
      // 宿舍号
      sushe: [],
      // 卫生分
      health: [],
      // 纪律分
      discipline: [],
      // 宿舍文化分
      culture: [],
      // 总页数
      total: 0,
      // 默认展示的标签页
      activeName: "second",
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
    };
  },
  created() {
    this.oneQuest();
    this.getAll();
    this.getLy();
  },
  methods: {
    getLy(){
        var _this = this;
        this.$http
          .get("http://localhost/sspf/ly")
          .then(function(response) {
            // console.log(response.data);
            if (response.data) {
              _this.getly=response.data;
              console.log(_this.getly);
            }
          });
    },
    getAll(){
      var _this = this;
      this.$http
        .get("http://localhost/sspf/searchAll")
        .then(function(response) {
          // console.log(response.data);
          if (response.data) {
            _this.total = response.data.length;
            _this.cunzhu = response.data;
          }
        });
    
    },
    // 封装页面加载请求函数
    oneQuest() {
      var _this = this;
      const data ={
        pagenum: _this.queryInfo.pagenum,
        pagesize: _this.queryInfo.pagesize
      }
      this.$http
        .post("http://localhost/sspf", {
          data
          // lynumber: _this.searchForm.lyNumber,
          // sushe: _this.searchForm.sushe,
          // xueyuan: _this.searchForm.xueyuan,
          // banji: _this.searchForm.banji,
        })
        .then(function(response) {
          // console.log(response.data);
          if (response.data) {
            _this.datalist = response.data;
            // 渲染 echarts 统计图
            
          }
        });
    },
    // 搜索按钮事件
    search(){
      var _this = this;
      const data ={
        lynumber: _this.searchForm.lyNumber,
        sushe: _this.searchForm.dom,
        pagenum: _this.queryInfo.pagenum,
        pagesize: _this.queryInfo.pagesize
      }
      this.$http
        .post("http://localhost/lgdf/search", {
          data
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data) {
            _this.datalist = response.data;
            // _this.sushe = response.data.dom;
            // _this.health = response.data.ws;
            // _this.discipline = response.data.jl;
            // _this.culture = response.data.wh;
            // 渲染 echarts 统计图
            
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
    //点击确定按钮，添加评分
    addUser() {
      var _this = this;
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid);
        if (!valid) return;
        // 如果预校验成功则发起添加用户请求
        // this.studentlist.unshift(this.addForm);
        const data ={
          time:this.addForm.data,
          ws:this.addForm.ws,
          jl:this.addForm.jl,
          wh:this.addForm.wh,
          lynumber:this.addForm.lyNumber,
          dom:this.addForm.dom,
          zf:(Number(this.addForm.ws)+Number(this.addForm.jl)+Number(this.addForm.wh))
        }
        this.$http
          .post("http://localhost/lgdf/add", {data})
          .then(function(response) {
            console.log(response.data);
            if (!response.err) {
              _this.$message({
                showClose: true,
                message: "添加评分成功",
                type: "success"
              });
            }else{
              _this.$message({
                showClose: true,
                message: "添加评分失败",
                type: "error"
              });
            }
          });
      });
      
      this.reload();
    },
  }
};
</script>

<style lang="css" scoped>
.el-button {
  margin-left: 20px;
}
</style>