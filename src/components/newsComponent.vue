<template>
  <div class="newsContainer">
    <div class="newsText">{{ newsContent }}</div>
    <el-image class="newsPic" :src="newsUrl" fit="cover"> </el-image>
  </div>
</template>

<script>
export default {
  props: {
    newsContent: {
      require: true,
      type: String,
    },
    newsUrl: {
      require: true,
      type: String,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.newsContainer {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.newsContainer:hover {
  background-color: #eee;
  transition: 0.25s linear;
}

.newsText {
  width: calc(100% - 100px);
}
.newsPic {
  width: 100px;
  height: 100px;
}
</style>