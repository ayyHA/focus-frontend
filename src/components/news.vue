<template>
  <el-card shadow="never" class="card-background">
    <div slot="header" class="clearfix">
      <span>热点消息</span>
    </div>
    <div v-for="o in 3" :key="o" class="text item">
      <NewsComponent :newsContent="null" :newsUrl="null" />
    </div>
  </el-card>
</template>

<script>
import NewsComponent from "./newsComponent.vue";
export default {
  components: {
    NewsComponent,
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.card-header {
  margin-top: 10px;
}

.card-background {
  background-color: #f7f9f9;
}

span {
  font-family: "xingGuang";
  font-size: 25px;
}
</style>