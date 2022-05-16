<template>
  <div class="div-container">
    <div class="div-both-slides">
      <div class="div-box">
        <div class="div-box-left">
          <div class="div-avatar">
            <el-image
              :src="user.avatarUrl"
              style="border-radius: 50%"
            ></el-image>
          </div>
        </div>
        <div class="div-box-right">
          <div class="div-user-info">
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
              ></i>
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
export default {
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
  },
  data() {
    return {
      likeClass: true,
      likeAnimation: false,
      likePositionLeft: false,
      likePositionRight: false,
      heartShake: false,
      formatKeywords: null,
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
</style>