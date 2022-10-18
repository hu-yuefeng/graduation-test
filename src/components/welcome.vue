<template>
  <div>
    <el-card>
      <div class="logo">
        <h1>办一所对学生最负责任的大学</h1>
      </div>
      <!-- 轮播图 -->
      <el-carousel height="300px" type="card" :interval="2000">
        <el-carousel-item>
          <img src="../assets/img/14.jpg" alt />
        </el-carousel-item>
        <el-carousel-item>
          <img src="../assets/img/9.jpg" alt />
        </el-carousel-item>
        <el-carousel-item>
          <img src="../assets/img/10.jpg" alt />
        </el-carousel-item>
        <el-carousel-item>
          <img src="../assets/img/6.jpg" alt />
        </el-carousel-item>
      </el-carousel>
      <h2 class="welcome">欢迎您！使用宿舍管理系统</h2>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="css" scoped>
.el-carousel__item img {
  height: 100%;
  width: 100%;
}
.welcome {
  text-align: center;
  margin: 40px 0px;
}
.logo {
  padding-bottom:20px ;
  
  
}
.logo img {
  height: 100%;
}
.logo h1 {
  /* display: inline-block; */
  text-align: center;
}
</style>