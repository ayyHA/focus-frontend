<template>
  <div class="div-container">
    <div class="div-both-slides">
      <div class="div-box">
        <div class="div-box-left">
          <div v-if="showPinnedIcon" class="pinned-icon-container">
            <i class="iconfont focus-icon-zhiding"></i>
          </div>
          <div v-if="isReply" class="pinned-icon-container">
            <i class="iconfont focus-icon-31pinglun"></i>
          </div>
          <div v-if="isRetweet" class="pinned-icon-container">
            <i class="iconfont focus-icon-zhuanfa1"></i>
          </div>
          <div class="div-avatar">
            <el-image
              :src="user.avatarUrl"
              @click="jumpToUserDetail"
              class="div-user-avatar"
            ></el-image>
          </div>
        </div>
        <div class="div-box-right">
          <div v-if="showPinnedIcon" class="pinned-icon-text">置顶消息</div>
          <div v-if="isReply" class="pinned-icon-text">评论消息</div>
          <div v-if="isRetweet" class="pinned-icon-text">转发消息</div>
          <div v-if="isProfile" class="div-user-operate">
            <div class="div-user-info">
              <div style="font-weight: 600">{{ user.nickname }}</div>
              <div style="color: #888">
                @{{ user.username }} · {{ message.createAt }}
              </div>
            </div>
            <div class="div-operate-info">
              <MessageDeleteButton :msgId="message.id" />
            </div>
          </div>
          <div v-else class="div-user-info">
            <div style="font-weight: 600">{{ user.nickname }}</div>
            <div style="color: #888">
              @{{ user.username }} · {{ message.createAt }}
            </div>
          </div>
          <div class="div-message-text">{{ message.text }}</div>
          <div class="div-message-keywords" v-if="formatKeywords != null">
            <div
              class="message-keyword"
              v-for="keyword in formatKeywords"
              :key="keyword"
            >
              #{{ keyword }}&nbsp;
            </div>
          </div>
          <div v-if="message.images != null">
            <el-row :gutter="10">
              <el-col
                :span="8"
                v-for="image in message.images"
                :key="message.images.indexOf(image)"
              >
                <el-image
                  :src="image"
                  fit="cover"
                  class="message-image"
                  :preview-src-list="message.images"
                ></el-image>
              </el-col>
            </el-row>
          </div>
          <div v-if="retweetedMessage">
            <el-card shadow="hover" class="card-style">
              <div class="retweet-both-slides">
                <div class="retweet-container">
                  <div class="retweet-container-left">
                    <el-image
                      :src="retweetedMessage.userInfoDto.avatarUrl"
                      class="left-avatar"
                    ></el-image>
                  </div>
                  <div class="retweet-container-right">
                    <div>
                      <div class="retweet-user-operate">
                        <div class="retweet-user">
                          <div class="user-nickname">
                            {{ retweetedMessage.userInfoDto.nickname }}
                          </div>
                          <div class="user-date">
                            {{ retweetedMessage.messageDto.createAt }}
                          </div>
                        </div>
                        <div class="retweet-operate"></div>
                      </div>
                      <div class="retweet-content">
                        {{ retweetedMessage.messageDto.text }}
                      </div>
                      <div v-if="retweetedMessage.messageDto.images != null">
                        <el-row :gutter="10">
                          <el-col
                            :span="8"
                            v-for="image in retweetedMessage.messageDto.images"
                            :key="
                              retweetedMessage.messageDto.images.indexOf(image)
                            "
                          >
                            <el-image
                              :src="image"
                              fit="cover"
                              class="message-image"
                              :preview-src-list="
                                retweetedMessage.messageDto.images
                              "
                            ></el-image>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="div-mutual">
            <div>
              <div
                :class="{
                  like: likeClass,
                  is_animating: likeAnimation,
                  'like-position-left': likePositionLeft,
                  'like-position-right': likePositionRight,
                  animate__animated: heartShake,
                  animate__heartBeat: heartShake,
                }"
                @click="clickLike"
                @mouseenter="heartShake = true"
                @mouseleave="heartShake = false"
              ></div>
              <span v-if="operateStatus.likeStatus" style="color: #e11">{{
                operateCount.likeCount
              }}</span>
              <span v-else>{{ operateCount.likeCount }}</span>
            </div>
            <div>
              <i
                class="iconfont focus-icon-pinglun2"
                style="cursor: pointer"
                @click="jumpToReply"
              ></i>
              <span>{{ operateCount.replyCount }}</span>
            </div>
            <div>
              <i
                v-if="operateStatus.retweetStatus"
                class="iconfont focus-icon-zhuanfa"
                style="color: #90ee90; cursor: pointer"
              ></i>
              <i
                v-else
                class="iconfont focus-icon-zhuanfa"
                style="cursor: pointer"
                @click="showRetweetEdit"
              ></i>
              <RetweetEdit ref="retweetEdit" />
              <span v-if="operateStatus.retweetStatus" style="color: #90ee90">{{
                operateCount.retweetCount
              }}</span>
              <span v-else>{{ operateCount.retweetCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import messageApi from "@/axios/message.js";
import MessageDeleteButton from "@/components/MessageDeleteButton.vue";
import RetweetEdit from "@/components/RetweetEdit.vue";
export default {
  components: {
    MessageDeleteButton,
    RetweetEdit,
  },
  props: {
    //传入的数据
    // 讯息发送者基本信息
    user: {
      type: Object,
      require: true,
      // default() {
      //   return {
      //     username:"",
      //     nickname:"",
      //     avatarUrl:"",
      //   };
      // },
    },
    // 讯息内容，发布时间
    message: {
      type: Object,
      require: true,
      // default() {
      //   return {
      //     // 传入的时候需要处理一下时间格式!
      //     createAt: "2021-09-02",
      //     text:"",
      //     images:"",(Array)
      //   };
      // },
    },
    operateCount: {
      type: Object,
      require: true,
      // default() {
      //   return {
      //     likeCount: "",
      //     retweetCount: "",
      //     replyCount: "",
      //   };
      // },
    },
    operateStatus: {
      type: Object,
      require: true,
      // default() {
      //   return {
      //     likeStatus: "",
      //     retweetStatus: "",
      //   };
      // },
    },
    showPinnedIcon: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      likeClass: true,
      likeAnimation: false,
      likePositionLeft: false,
      likePositionRight: false,
      heartShake: false,
      formatKeywords: null,
      isReply: false,
      isRetweet: false,
      retweetedMessage: null,
    };
  },
  created() {
    if (this.operateStatus.likeStatus) {
      this.likePositionLeft = false;
      this.likePositionRight = true;
    } else {
      this.likePositionLeft = true;
      this.likePositionRight = false;
    }
    // 将图片转换为Array
    if (this.message.images != null)
      this.message.images = this.imagesArray(this.message.images);
    // 修改时间格式
    this.message.createAt = this.transformTimestamp(this.message.createAt);
    // 修改keywords格式
    if (this.message.keywords != "" && this.message.keywords != null) {
      this.message.keywords = String(this.message.keywords);
      this.formatKeywords = this.message.keywords.split(",");
    }
    // 是否是评论型讯息
    if (this.message.type == "replied_to") this.isReply = true;
    // 是否是转发型讯息
    if (this.message.type == "retweeted") {
      this.isRetweet = true;
      this.getRetweetedMessage();
    }
  },
  computed: {
    isProfile() {
      return "个人中心" == this.$store.state.menuName;
    },
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
    // 将图片的参数数组化
    imagesArray(images) {
      let imagesStr = String(images);
      let imagesArr = imagesStr.split(",");
      return imagesArr;
    },
    // 点赞
    async clickLike() {
      // let messageId = this.message.id;
      // let userId = this.$store.state.userInfo.id;
      // console.log("messageId: ", messageId, " userId: ", userId);
      // 点赞讯息
      if (this.operateStatus.likeStatus == false) {
        this.likeAnimation = true;
        this.likePositionLeft = false;
        this.likePositionRight = true;
        this.operateCount.likeCount += 1;
        this.operateStatus.likeStatus = true;
        // 后端交互
        let messageId = this.message.id;
        let userId = this.$store.state.userInfo.id;
        let likeNum = this.operateCount.likeCount;
        console.log("likeNum", likeNum);
        let res = await messageApi.saveLike(messageId, userId, likeNum);
        res = res.data;
        // 更新likeCount数据，与后端实时同步
        this.operateCount.likeCount = res.data.likeCount;
        // 取消点赞
      } else {
        this.likeAnimation = false;
        this.likePositionLeft = true;
        this.likePositionRight = false;
        this.operateStatus.likeStatus = false;
        this.operateCount.likeCount -= 1;
        // 后端交互
        let messageId = this.message.id;
        let userId = this.$store.state.userInfo.id;
        let likeNum = this.operateCount.likeCount;
        let res = await messageApi.saveUnlike(messageId, userId, likeNum);
        res = res.data;
        // 更新likeCount数据，与后端实时同步
        this.operateCount.likeCount = res.data.likeCount;
      }
    },
    // 跳转到用户详情页
    jumpToUserDetail() {
      let userId = this.user.id;
      // 当点击的用户是自己
      if (userId == this.$store.state.userInfo.id)
        this.$router.push({ path: "/profile" });
      // 当点击的用户是他人
      else this.$router.push({ name: "UserDetail", params: { userId } });
    },
    // 跳转到用户评论页
    jumpToReply() {
      let messageInfo = {
        user: this.user,
        message: this.message,
        operateCount: this.operateCount,
        operateStatus: this.operateStatus,
      };
      localStorage.setItem("messageInfo", JSON.stringify(messageInfo));
      this.$router.push({ name: "Reply" });
    },
    // 显示转发的对话框
    showRetweetEdit() {
      // 显示前先传入conversationId和inReplyToAuthorId
      let retweetMessage = {
        messageId: this.message.id,
        authorId: this.message.authorId,
      };
      this.$store.commit("updateRetweetedMessage", retweetMessage);
      this.$refs.retweetEdit.showRetweetDialog();
    },
    // 获取转发推文的基本信息
    async getRetweetedMessage() {
      let resData = await messageApi.getRetweetedMessage(
        this.message.conversationId
      );
      resData = resData.data;
      if (resData.code == 2044) {
        this.retweetedMessage = resData.data;
        this.retweetedMessage.messageDto.createAt = this.transformTimestamp(
          this.retweetedMessage.messageDto.createAt
        );
        // 将图片转换为Array
        if (this.retweetedMessage.messageDto.images != null)
          this.retweetedMessage.messageDto.images = this.imagesArray(
            this.retweetedMessage.messageDto.images
          );
      }
    },
  },
};
</script>

<style scoped>
.div-container {
  width: 100%;
  border-bottom: 1px solid;
  border-bottom-color: #dcdcdc;
}
.div-container:hover {
  background-color: #eee;
  transition: 0.25s linear;
}

.div-both-slides {
  padding: 0 16px;
  padding-top: 12px;
}
.div-box {
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.div-box-left {
  margin-right: 12px;
  display: flex;
  flex-direction: column;
}
.div-avatar {
  width: 48px;
  height: 48px;
}
.div-box-right {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 12px;
}
.div-user-info {
  font-size: 15px;
  height: 22px;
}
.div-user-info > div {
  display: inline-block;
}
.div-message-text {
  font-size: 15px;
  padding-bottom: 10px;
}

.message-image {
  height: 200px;
  border-radius: 5%;
}

.div-mutual {
  margin-top: 12px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
}
.div-mutual > div {
  display: flex;
  align-items: center;
}

.div-mutual > div > span {
  margin-left: 5px;
}

.div-mutual > div > div {
  display: inline-block;
}

.like {
  margin: -10px -15px;
  cursor: pointer;
  height: 50px;
  width: 50px;
  background-image: url("http://qny.ayyha.store/like.png");
  /* background-position: left; */
  background-repeat: no-repeat;
  background-size: 2900%;
}

.like-position-left {
  background-position: left;
}

.like-position-right {
  background-position: right;
}

@keyframes heart-burst {
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
}

.is_animating {
  animation: heart-burst 0.8s steps(28) 1;
}

.div-message-keywords {
  display: flex;
  margin-bottom: 10px;
}

.message-keyword {
  color: cornflowerblue;
  cursor: pointer;
}

.pinned-icon-container {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 5px;
}

.focus-icon-zhiding {
  color: #536471;
}

.focus-icon-31pinglun {
  color: #536471;
  font-weight: 500;
}

.pinned-icon-text {
  font-size: 14px;
  font-weight: 500;
  color: #536471;
  padding-bottom: 5px;
}

.div-user-avatar {
  border-radius: 50%;
  cursor: pointer;
}

.div-user-operate {
  display: flex;
  justify-content: space-between;
}

.div-operate-info {
  display: flex;
}

.card-style {
  /* padding: 0px; */
  border-radius: 8px;
  /* cursor: pointer; */
}

.retweet-both-slides {
  padding: 12px 16px;
}

.retweet-container {
  display: flex;
}

.retweet-container-left {
  margin-right: 12px;
}

.left-avatar {
  border-radius: 50%;
  width: 48px;
  height: 48px;
}

.retweet-container-right {
  flex-grow: 1;
}

.retweet-user-operate {
  display: flex;
  justify-content: space-between;
}

.retweet-user {
  display: flex;
}

.user-nickname {
  color: RGB(97, 144, 232);
  font-weight: 500;
}

.user-date {
  color: RGB(164, 164, 164);
  padding-left: 5px;
}

.retweet-operate {
  display: flex;
  justify-content: flex-end;
}

.retweet-content {
  padding-top: 8px;
}
</style>