<template>
  <div class="chat-list-info-container">
    <div class="chat-list-info-left">
      <el-image :src="chatUserInfo.avatarUrl" class="userAvatar"></el-image>
    </div>
    <div class="chat-list-info-right">
      <div class="right-nickname">{{ chatUserInfo.nickname }}</div>
      <div class="right-datetime" v-if="createAt != null">{{ createAt }}</div>
      <div class="right-email" v-else>@{{ chatUserInfo.username }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chatUserInfo: {
      type: Object,
      require: true,
    },
    createAt: {
      type: Date,
      require: false,
    },
  },
  data() {
    return {
      // chatUserInfo: {
      //   nickname: "ayy",
      //   datetime: "2022-5-16 21:21:39",
      //   userAvatar: this.$store.state.userInfo.avatarUrl,
      // },
    };
  },
  created() {
    if (this.createAt != null)
      this.createAt = this.transformTimestamp(this.createAt);
  },
  methods: {
    // 时间转换
    transformTimestamp(timestamp) {
      let a = new Date(timestamp).getTime();
      const date = new Date(a);
      const Y = date.getFullYear() + "-";
      const M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      const D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "  ";
      const h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      const m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      // const s = date.getSeconds(); // 秒
      const dateString = Y + M + D + h + m;
      // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
      return dateString;
    },
  },
};
</script>

<style scoped>
.chat-list-info-container {
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
}
.chat-list-info-container:hover {
  background-color: #efefef;
  transition: 0.25s linear;
}
.chat-list-info-left {
  display: flex;
  align-items: center;
  padding: 0px 5px;
}
.userAvatar {
  width: 40px;
  height: 40px;
  border-radius: 15%;
}
.chat-list-info-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 5px;
}
.right-nickname {
  font-size: 16px;
  font-weight: 600;
}
.right-datetime {
  font-size: 14px;
  color: #bbb;
}
.right-email {
  font-size: 14px;
  color: #888;
}
</style>