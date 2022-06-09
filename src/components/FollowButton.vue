<template>
  <div v-if="userId != this.$store.state.userInfo.id">
    <el-button v-if="!isFollow" type="primary" plain round @click="followUser"
      >关注</el-button
    >
    <el-button v-else type="info" plain round @click="unFollowUser"
      >已关注</el-button
    >
  </div>
</template>

<script>
import userApi from "@/axios/user.js";
export default {
  props: {
    userId: {
      require: true,
    },
  },
  data() {
    return {
      isFollow: false,
      sourceId: this.$store.state.userInfo.id,
    };
  },
  created() {
    this.getFollowStatus();
  },
  methods: {
    async getFollowStatus() {
      let resData = await userApi.getFollowStatus(this.sourceId, this.userId);
      resData = resData.data;
      this.isFollow = resData.data;
    },
    async followUser() {
      let date = Date.now();
      let resData = await userApi.followUser(this.sourceId, this.userId, date);
      resData = resData.data;
      if (resData.code == "2036") {
        this.isFollow = true;
        this.$message.success(resData.msg);
      } else {
        this.$message.error(resData.msg);
      }
    },
    async unFollowUser() {
      let date = Date.now();
      let resData = await userApi.unFollowUser(
        this.sourceId,
        this.userId,
        date
      );
      resData = resData.data;
      if (resData.code == "2038") {
        this.isFollow = false;
        this.$message.success(resData.msg);
      } else {
        this.$message.error(resData.msg);
      }
    },
  },
};
</script>

<style scoped>
</style>