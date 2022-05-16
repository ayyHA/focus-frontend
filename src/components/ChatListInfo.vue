<template>
  <div class="chat-list-info-container">
    <div class="chat-list-info-left">
      <el-image :src="chatUserInfo.userAvatar" class="userAvatar"></el-image>
    </div>
    <div class="chat-list-info-right">
      <div class="right-nickname">{{ chatUserInfo.nickname }}</div>
      <div class="right-datetime">{{ chatUserInfo.datetime }}</div>
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
  created() {},
  methods: {},
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
</style>