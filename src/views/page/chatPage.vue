<template>
  <div>
    <el-row>
      <el-col :span="7"><ChatList /></el-col>
      <el-col :span="17"><ChatContent /></el-col>
    </el-row>
  </div>
</template>

<script>
import ChatList from "@/components/ChatList.vue";
import ChatContent from "@/components/ChatContent.vue";
export default {
  components: {
    ChatList,
    ChatContent,
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