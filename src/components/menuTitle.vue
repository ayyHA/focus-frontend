<template>
  <div class="divider" v-if="title != '搜索' && title != '聊天'">
    <div class="menuTitle menuMargin">
      {{ title }}
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  computed: {
    title() {
      return this.$store.state.menuName;
    },
  },
};
</script>

<style scoped>
.menuTitle {
  font-family: "xingGuang";
  font-size: 25px;
}

.menuMargin {
  margin: 20px 50px;
  margin-bottom: -6px;
}

.divider ::v-deep .el-divider--horizontal {
  margin: 24px 0px 0px 0px;
}
</style>