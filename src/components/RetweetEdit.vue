<template>
  <el-dialog
    title="转发"
    :visible.sync="isRetweetStatus"
    width="30%"
    class="retweet-dialog"
    @close="closeRetweetDialog"
  >
    <div class="retweet-container">
      <div class="retweet-container-left">
        <el-image :src="userAvatarUrl" class="left-avatar"></el-image>
      </div>
      <div class="retweet-container-right">
        <el-input
          v-model="retweetTextarea"
          class="retweet-textarea"
          resize="none"
          type="textarea"
          id="textarea"
          rows="3"
          placeholder="说点什么"
        ></el-input>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" size="medium" @click="doRetweet">
        转 发
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import messageApi from "@/axios/message.js";
export default {
  data() {
    return {
      isRetweetStatus: false,
      retweetTextarea: null,
      // 组装数据需要
      messageType: 2,
      images: null,
      keywords: null,
      grantType: 3,
    };
  },
  computed: {
    userAvatarUrl() {
      return this.$store.state.userInfo.avatarUrl;
    },
  },
  methods: {
    // 显示对话框
    showRetweetDialog() {
      this.isRetweetStatus = true;
    },
    // 关闭对话框，清空内容
    closeRetweetDialog() {
      this.isRetweetStatus = false;
      this.retweetTextarea = null;
    },
    // 发送消息
    async doRetweet() {
      // 检测内容是否可以发送
      let isSend = this.checkRetweetContent(this.retweetTextarea);
      if (!isSend) {
        this.$message.error("转发内容不能为空");
        this.closeRetweetDialog();
        return;
      }
      // 构造messageDto
      let msgDto = this.buildMessageDto();
      console.log("msgDto>>>");
      console.log(msgDto);
      // 发送内容
      let resData = await messageApi.publishMessage(msgDto);
      console.log("<<<<<<,");
      console.log(resData);
      resData = resData.data;
      // 发送成功实时更新
      if (resData.code == 2006) {
        localStorage.setItem(
          "updateMessageInfoDto",
          JSON.stringify(resData.data)
        );
        this.$store.commit("updateMessages_");
      }
      // 发送失败
      else if (resData.code == 2005) {
        this.$message.error(resData.msg);
      }
      // 关闭dialog
      this.closeRetweetDialog();
    },
    // 检测转发的内容是否可以发送
    checkRetweetContent(content) {
      if (content == null || content == "") return false;
      let content_ = String(content);
      if (content_.trim() == "") return false;
      return true;
    },
    buildMessageDto() {
      let messageDto = {
        text: this.retweetTextarea,
        images: this.images,
        authorId: this.$store.state.userInfo.id,
        type: this.messageType,
        keywords: this.keywords,
        grantType: this.grantType,
        conversationId: this.$store.state.retweetMsgId,
        inReplyToAuthorId: this.$store.state.retweetAuthorId,
      };
      return messageDto;
    },
  },
};
</script>

<style scoped>
.retweet-dialog ::v-deep .el-dialog {
  border-radius: 8px;
}

.retweet-container {
  display: flex;
}

.retweet-container-left {
  margin-right: 12px;
}

.left-avatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.retweet-container-right {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.retweet-textarea ::v-deep .el-textarea__inner {
  font-size: 16px;
}
</style>