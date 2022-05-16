<template>
  <div>
    <el-row>
      <el-col :span="7"><ChatList /></el-col>
      <el-col :span="17" style="background: #0f0">b</el-col>
    </el-row>
  </div>
</template>

<script>
import ChatList from "@/components/ChatList.vue";
export default {
  components: {
    ChatList,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style scoped>
</style>