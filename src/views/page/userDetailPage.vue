<template>
  <div
    :style="{
      height: this.fullScreenHeight + 'px',
      'overflow-y': 'auto',
    }"
    class="focus-scroll"
  >
    <div class="profile-style">
      <div class="profile-header">
        <el-image
          :src="profileImageUrl"
          v-if="userInfo"
          class="profile-image-url"
        />
      </div>
      <div class="profile-bottom">
        <FollowButton class="profile-bottom-follow" :userId="userId" />
        <PayButton class="profile-bottom-pay" :userId="userId" />
        <div class="profile-bottom-name">
          <div class="nickname" v-if="userInfo">
            {{ profileNickname }}
            <span v-if="this.userInfo.gender == 'female'"
              ><i class="iconfont focus-icon-nv"></i
            ></span>
            <span v-else-if="this.userInfo.gender == 'male'"
              ><i class="iconfont focus-icon-nan"></i
            ></span>
          </div>
          <div class="username" v-if="userInfo">@{{ profileUsername }}</div>
        </div>
        <div class="profile-bottom-detail">
          <el-row style="padding-top: 10px">
            <el-col :span="4" style="font-weight: 600">个人简介</el-col>
            <el-col :span="20">
              <p
                v-if="userInfo"
                style="
                  word-wrap: break-word;
                  margin: 0px 5px;
                  margin-right: 10px;
                "
              >
                {{ profileDescription }}
              </p>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="profile-medium">
        <el-image :src="profileAvatar" v-if="userInfo" />
      </div>
    </div>
    <div class="row-divider"></div>
    <div
      infinite-scroll-disabled="disabled"
      v-infinite-scroll="load"
      infinite-scroll-distance="5"
    >
      <div v-for="message in messages_" :key="message.messageDto.id">
        <MessageShow
          :user="message.userInfoDto"
          :message="message.messageDto"
          :operateCount="message.messagePublicDataDto"
          :operateStatus="message.messageStatusDto"
          :showPinnedIcon="message.showPinnedIcon"
        />
      </div>
      <div v-if="scrollLoading">
        <div><center v-loading="scrollLoading">加载中...</center></div>
      </div>
      <div
        v-if="noPublishStatus"
        class="no-publish-container"
        :style="{ height: this.fullScreenHeight - 311 + 'px' }"
      >
        <div class="no-publish-column">
          <span class="no-publish-style">暂时没有内容:(</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fixMixin from "@/components/fixMixin.vue";
import MessageShow from "@/components/MessageShow.vue";
import messageApi from "@/axios/message.js";
import userApi from "@/axios/user.js";
import FollowButton from "@/components/FollowButton.vue";
import PayButton from "@/components/PayButton.vue";
export default {
  components: { MessageShow, FollowButton, PayButton },
  data() {
    return {
      userId: this.$route.params.userId,
      userInfo: null,
      page: -1,
      maxPages: -1,
      maxElements: 2,
      scrollLoading: false,
      // 存储多条讯息数据
      messages_: [],
      // 当用户暂未发布过消息时显示的内容
      noPublishStatus: false,
    };
  },
  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  created() {
    this.getUserInfo();
    this.page = Number(localStorage.getItem("page"));
    this.getPinnedMessage();
  },
  computed: {
    profileAvatar() {
      return this.userInfo.avatarUrl;
    },
    profileNickname() {
      return this.userInfo.nickname;
    },
    profileUsername() {
      return this.userInfo.username;
    },
    profileDescription() {
      return this.userInfo.description;
    },
    profileImageUrl() {
      return this.userInfo.profileImageUrl;
    },
    // page达到上限了(数据库的上限)
    pageBoom() {
      return this.maxPages == this.page;
    },
    // message达到上限
    elementTop() {
      return this.messages_.length >= this.maxElements;
    },
    disabled() {
      return this.scrollLoading || this.pageBoom || this.elementTop;
    },
  },
  methods: {
    // 获取用户基本信息
    async getUserInfo() {
      let resData = await userApi.getUserInfoById(this.userId);
      this.userInfo = resData.data;
    },
    // 加载历史消息
    async load() {
      this.scrollLoading = true;
      let messageInfos = await messageApi.getUserMessages(
        this.userId,
        this.page
      );
      messageInfos = messageInfos.data;
      // 用户暂未发布过消息
      if (messageInfos.code == "2029") {
        // 让inifinieScroll禁止加载
        this.page = -1;
        // 显示暂未发布过消息
        this.noPublishStatus = true;
        // 停止转圈
        this.scrollLoading = false;
      }
      // 用户成功获取消息
      else if (messageInfos.code == "2030") {
        let pinnedMsgId = this.userInfo.pinnedMessageId;
        let messages = messageInfos.data.msgInfoDtos;
        if (pinnedMsgId == "" || pinnedMsgId == null) {
          this.messages_.push(...messages);
        } else {
          for (let message of messages) {
            if (message.messageDto.id == pinnedMsgId) continue;
            this.messages_.push(message);
          }
        }
        this.scrollLoading = false;
        this.page += 1;
        this.maxPages = messages[0].maxPages;
        this.maxElements = messages[0].maxElements;
      }
    },
    // 获取置顶消息
    async getPinnedMessage() {
      let resData = await messageApi.getPinnedMessage(this.userId);
      resData = resData.data;
      if (resData.code == "2032") {
        let message = resData.data;
        message.showPinnedIcon = true;
        this.messages_.push(message);
      }
    },
  },
};
</script>

<style scoped>
/* avatar的样式 */
.profile-medium ::v-deep .el-image {
  width: 100px;
  height: 100px;
  background-size: 100px 100px;
  border-radius: 50%;
  border: 5px solid #fff;
}

/* .profile-medium ::v-deep .el-image:hover {
  background-color: #d3d3d3;
  border: 5px solid #d3d3d3;
  transition: all 0.3s linear;
} */

/* profile四兄弟的控制 */
.profile-style {
  height: 300px;
  margin: auto 30px;
  position: relative;
  margin-top: 10px;
}

.profile-header {
  height: 150px;
}

.profile-bottom {
  background-color: #fff;
  height: 150px;
}

.profile-medium {
  position: absolute;
  top: 100px;
  margin: 0px 10px;
}

.profile-bottom-pay {
  float: right;
  margin: 10px 5px;
}

.profile-bottom-name {
  padding-top: 10px;
  padding-left: 150px;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
}

.username {
  font-size: 15px;
  color: #536471;
}

.profile-bottom-detail {
  padding-left: 32px;
}

.profile-header ::v-deep .el-image {
  width: 700px;
  height: 150px;
}

.profile-bottom-follow {
  float: right;
  margin: 10px 5px;
}

.focus-scroll::-webkit-scrollbar {
  display: none;
  width: 10px;
}

.focus-scroll::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #eee;
}

.row-divider {
  border-bottom: 1px #dcdcdc solid;
}

.no-publish-container {
  display: flex;
  align-items: center;
}

.no-publish-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.no-publish-style {
  font-size: 48px;
  color: #bbb;
}

.profile-image-url {
  border-radius: 8px;
}
</style>