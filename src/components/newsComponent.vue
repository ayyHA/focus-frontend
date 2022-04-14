<template>
  <div class="divPaPa">
    <div class="divText">{{ newsContent }}</div>
    <el-image class="imageProps" :src="newsUrl" fit="cover"> </el-image>
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
.divPaPa {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
}
.divText {
  flex-grow: 1;
  background-color: royalblue;
}
.imageProps {
  width: 100px;
  height: 100px;
}
</style>