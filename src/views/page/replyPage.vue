<template>
  <div
    v-if="message != null"
    :style="{
      height: this.fullScreenHeight + 'px',
      'overflow-y': 'auto',
    }"
    class="focus-scroll"
  >
    <div class="back-container">
      <span class="back-style" @click="jumpToHome">
        <i class="el-icon-back"></i>
      </span>
      <span class="back-text">消息</span>
    </div>
    <MessageShow
      :user="message.user"
      :message="message.message"
      :operateCount="message.operateCount"
      :operateStatus="message.operateStatus"
    />
    <div class="reply-both-slides">
      <div class="reply-container">
        <div class="reply-container-left">
          <el-image :src="userAvatarUrl" class="left-avatar"></el-image>
        </div>
        <div class="reply-container-right">
          <el-input
            v-model="replyTextarea"
            class="reply-textarea"
            resize="none"
            type="textarea"
            id="textarea"
            rows="3"
            placeholder="说点什么"
            @keyup.enter.native="sendReply"
          ></el-input>
          <div class="reply-button">
            <el-button
              type="primary"
              class="send-button"
              icon="el-icon-s-promotion"
              @click="sendReply"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="row-divider"></div>
    <div v-for="reply in replies_" :key="reply.messageDto.id">
      <ReplyInfo :message="reply.messageDto" :user="reply.userInfoDto" />
    </div>
    <div v-if="noReplyStatus" class="no-reply-container">
      <div class="no-reply-column">该消息暂时没有人回复:(</div>
    </div>
  </div>
</template>

<script>
import MessageShow from "@/components/MessageShow.vue";
import ReplyInfo from "@/components/ReplyInfo.vue";
import fixMixin from "@/components/fixMixin.vue";
import messageApi from "@/axios/message.js";
export default {
  components: {
    MessageShow,
    ReplyInfo,
  },
  data() {
    return {
      // 通过localStorage存储的消息
      message: null,
      // 输入框的回复内容
      replyTextarea: null,
      // 回复的容器，后端获取
      replies_: [],
      // 回复的图片信息[暂时没有]
      images: null,
      // 消息的类型 replied_to
      messageType: 1,
      // 回复的关键字
      keywords: null,
      // 授权类型，暂定为全部人可看
      grantType: 3,
      // 暂未有评论信息
      noReplyStatus: false,
    };
  },
  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  created() {
    // 获取localStorage存储的消息
    this.message = JSON.parse(localStorage.getItem("messageInfo"));
    // 获取历史评论消息
    this.getReplys();
  },
  computed: {
    // 当前用户的头像，用于发表回复/评论
    userAvatarUrl() {
      return this.$store.state.userInfo.avatarUrl;
    },
  },
  methods: {
    // 返回首页
    jumpToHome() {
      this.$router.push({ path: "/" });
    },
    // 获取历史评论
    async getReplys() {
      let authorId = this.message.user.id;
      let messageId = this.message.message.id;
      let resData = await messageApi.getReplies(authorId, messageId);
      resData = resData.data;
      // 该消息暂未有评论
      if (resData.code == 2041) {
        this.noReplyStatus = true;
        console.log("该讯息暂未有评论消息");
      } else if (resData.code == 2042) {
        this.replies_.push(...resData.data.replies);
      }
    },
    // 发送回复/评论
    async sendReply() {
      // 评论不符合要求
      if (!this.checkReplyContent(this.replyTextarea)) {
        this.$message.error("回复内容不可为空！");
        this.replyTextarea = null;
      }
      // 获取组装好的评论内容
      let messageDto = this.buildToMessageDto();
      // 发送评论
      let resData = await messageApi.publishMessage(messageDto);
      resData = resData.data;
      // 检测评论是否发送成功
      if (resData.code == 2006) {
        // 评论发送成功，更新当前显示
        let userInfoDto = this.$store.state.userInfo;
        messageDto.createAt = "刚刚";
        let msg = {
          userInfoDto: userInfoDto,
          messageDto: messageDto,
        };
        this.replies_.unshift(msg);
        // 文本框置空
        this.replyTextarea = null;
        // 无评论/回复状态为false
        this.noReplyStatus = false;
        // 增加评论数
        this.message.operateCount.replyCount += 1;
      } else if (resData.code == 2005) {
        this.$message.error(resData.msg);
        this.replyTextarea = null;
      }
    },
    // 检测评论是否可以发送
    checkReplyContent(content) {
      if (content == null || content == "") return false;
      let content_ = String(content);
      if (content_.trim() == "") return false;
      return true;
    },
    buildToMessageDto() {
      let messageDto = {
        text: this.replyTextarea,
        images: this.images,
        authorId: this.$store.state.userInfo.id,
        type: this.messageType,
        conversationId: this.message.message.id,
        inReplyToAuthorId: this.message.user.id,
        keywords: this.keywords,
        grantType: this.grantType,
      };
      return messageDto;
    },
  },
};
</script>

<style scoped>
.focus-scroll::-webkit-scrollbar {
  display: none;
  width: 10px;
}

.focus-scroll::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #eee;
}

.back-container {
  display: flex;
  padding: 0px 16px;
  padding-top: 5px;
  align-items: center;
}

.back-style {
  width: 30px;
  height: 30px;
  font-size: 24px;
  text-align: center;
  cursor: pointer;
}

.back-style:hover {
  border-radius: 50%;
  background-color: rgb(231, 231, 232);
}

.back-text {
  font-size: 24px;
  padding-left: 30px;
  font-weight: 500;
}

.reply-both-slides {
  padding: 0px 16px;
  padding-top: 12px;
}

.reply-container {
  display: flex;
}

.reply-container-left {
  margin-right: 12px;
}

.left-avatar {
  border-radius: 50%;
  width: 48px;
  height: 48px;
}

.reply-container-right {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.reply-textarea ::v-deep .el-textarea__inner {
  font-size: 16px;
}

.reply-button {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.send-button {
  height: 20px;
  width: 80px;
  padding-bottom: 20px;
  padding-top: 8px;
  padding-left: 11px;
}

.row-divider {
  padding-top: 10px;
  border-bottom: 1px solid #ececec;
}

.no-reply-container {
  display: flex;
  justify-content: center;
}

.no-reply-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 24px;
  font-weight: 500;
  color: #ccc;
  padding-top: 10px;
}
</style>