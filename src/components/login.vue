<template>
  <div class="login">
    <h1>高校宿舍管理系统</h1>
    <div class="loginBox">
      <!-- 登录表单区域 -->
      <el-form
        @keyup.enter.native="login"
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="name">
          <el-input
            v-model="loginForm.name"
            placeholder="请输入用户名"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登录注册按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" >登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      //登录表单数据绑定对象
      loginForm: {
        name: "",
        password: "",
      },
      // 登录表单数据验证规则对象
      rules: {
        name: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入合法的密码", trigger: "blur" },
        ],
      },
    };
  },
  created(){
    // if(x=1){};
    // var str="what is this";
  },
  methods: {
    // 点击重置按钮重置表单
    reset() {
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录按钮先预校验,校验成功后发起请求,请求成功跳转到首页
    login() {
      this.$http
        .get("http://localhost/user")
        .then((res) => {
          console.log(res.data);

          for (const i in res.data) {
            console.log(res.data[i].number);
            if (
              res.data[i].number == this.loginForm.name &&
              res.data[i].password === this.loginForm.password
            ) {
              window.sessionStorage.setItem("token", this.loginForm.name);
              window.sessionStorage.setItem("id", res.data[i].id);
              this.$router.push({
                path:"/home", 
              });
              this.$message({
                message: "登录成功",
                type: "success",
              });
            }
          }

          var sum = 0;
          for (const i in res.data) {
            if (res.data[i].number != this.loginForm.name) {
              sum++;
            }
          }
          if (sum === res.data.length) {
            this.$message.error("用户名错误！");
          }
          for (const i in res.data) {
            if (
              res.data[i].number == this.loginForm.name &&
              res.data[i].password !== this.loginForm.password
            ) {
              this.$message.error("密码输入错误！");
            }
          }
        })
        .catch((err) => {
          console.log("获取失败" + err);
        });
      
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}
.login {
  width: 100%;
  height: 100%;
  background: url("../assets/img/10.jpg") center center no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}
.login h1 {
  text-align: center;
  color: white;
  font-size: 42px;
  margin-top: 45px;
  letter-spacing: 0.2em;
}
.loginBox {
  width: 500px;
  height: 300px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.4);
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -250px;
  margin-top: -150px;
}
.loginLogo {
  width: 130px;
  height: 130px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  position: absolute;
  top: 0%;
  left: 50%;
  margin-left: -65px;
  margin-top: -65px;
}
.loginLogo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0px;
  width: 80%;
  margin-left: 10%;
}
</style>
