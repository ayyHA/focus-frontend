<template>
  <div
    :style="{
      height: this.fullScreenHeight - 68 + 'px',
      'overflow-y': 'auto',
    }"
    class="focus-scroll"
  >
    <div class="profile-style">
      <div class="profile-header">
        <vue-hover-mask @click="clickBackground">
          <el-image :src="profileImageUrl" />
          <CutBackground
            ref="profileBackground"
            :autoCropWidth="700"
            :autoCropHeight="150"
            @getUrl="getBackgroundUrl"
          />
          <template v-slot:action>
            <i class="iconfont focus-icon-bianji"> 编辑</i>
          </template>
        </vue-hover-mask>
      </div>
      <div class="profile-bottom">
        <el-button
          type="primary"
          plain
          class="profile-bottom-button"
          @click="clickUserInfo"
          >设置个人信息</el-button
        >
        <ProfileEditInfo ref="profileEditInfo" />
        <SignButton class="profile-bottom-sign" />
        <div class="profile-bottom-name">
          <div class="nickname">
            {{ profileNickname }}
            <span v-if="this.$store.state.userInfo.gender == 'female'"
              ><i class="iconfont focus-icon-nv"></i
            ></span>
            <span v-else-if="this.$store.state.userInfo.gender == 'male'"
              ><i class="iconfont focus-icon-nan"></i
            ></span>
          </div>
          <div class="username">@{{ profileUsername }}</div>
        </div>
        <div class="profile-bottom-detail">
          <el-row style="padding-top: 10px">
            <el-col :span="4" style="font-weight: 600">个人简介</el-col>
            <el-col :span="15">
              <p
                style="
                  word-wrap: break-word;
                  margin: 0px 5px;
                  margin-right: 10px;
                "
              >
                {{ profileDescription }}
              </p>
            </el-col>
            <el-col :span="5" class="coin-container">
              <div style="font-weight: 600">盾盾币：</div>
              {{ dunDunCoin }}
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="profile-medium">
        <el-image
          :src="profileAvatar"
          @click="clickAvatar"
          style="cursor: pointer"
        />
        <CutPortrait @getUrl="getUrl" ref="profileCutPortrait" />
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
      <!-- <div v-if="pageBoom || elementTop"><center>没有更多了</center></div> -->
      <div
        v-if="noPublishStatus"
        class="no-publish-container"
        :style="{ height: this.fullScreenHeight - 369 + 'px' }"
      >
        <div class="no-publish-column">
          <span class="no-publish-style">暂时没有内容:(</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CutPortrait from "@/components/CutPortrait.vue";
import CutBackground from "@/components/CutBackground.vue";
import ProfileEditInfo from "@/components/profileEditInfo.vue";
import VueHoverMask from "@/components/VueHoverMask.vue";
import SignButton from "@/components/SignButton.vue";
import fixMixin from "@/components/fixMixin.vue";
import messageApi from "@/axios/message.js";
import MessageShow from "@/components/MessageShow.vue";
export default {
  components: {
    CutPortrait,
    ProfileEditInfo,
    CutBackground,
    VueHoverMask,
    SignButton,
    MessageShow,
  },
  data() {
    return {
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
  created() {
    this.page = Number(localStorage.getItem("page"));
    this.getPinnedMessage();
  },
  computed: {
    profileAvatar() {
      return this.$store.state.userInfo.avatarUrl;
    },
    profileNickname() {
      return this.$store.state.userInfo.nickname;
    },
    profileUsername() {
      return this.$store.state.userInfo.username;
    },
    profileDescription() {
      return this.$store.state.userInfo.description;
    },
    profileImageUrl() {
      return this.$store.state.userInfo.profileImageUrl;
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
    dunDunCoin() {
      return this.$store.state.userInfo.dunDunCoin;
    },
  },
  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  methods: {
    // 获取头像裁剪组件返回的路径
    getUrl(path) {
      this.$store.state.userInfo.avatarUrl = path;
    },
    // 父组件调用子组件里的方法,设置头像
    clickAvatar() {
      this.$refs.profileCutPortrait.showDialog();
    },
    // 父组件调用子组件里的方法,设置个人信息
    clickUserInfo() {
      this.$refs.profileEditInfo.showForm();
    },
    clickBackground() {
      this.$refs.profileBackground.showDialog();
    },
    // 获取背景图
    getBackgroundUrl(path) {
      this.$store.state.userInfo.profileImageUrl = path;
    },
    // 加载历史消息
    async load() {
      this.scrollLoading = true;
      let messageInfos = await messageApi.getUserMessages(
        this.$store.state.userInfo.id,
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
        let pinnedMsgId = this.$store.state.userInfo.pinnedMessageId;
        let messages = messageInfos.data.msgInfoDtos;
        console.log(messages);
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
        console.log(
          "page:",
          this.page,
          "maxpages:",
          this.maxPages,
          "maxElements",
          this.maxElements
        );
      }
    },
    async getPinnedMessage() {
      let resData = await messageApi.getPinnedMessage(
        this.$store.state.userInfo.id
      );
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

.profile-medium ::v-deep .el-image:hover {
  background-color: #d3d3d3;
  border: 5px solid #d3d3d3;
  transition: all 0.3s linear;
}

/* profile四兄弟的控制 */
.profile-style {
  height: 300px;
  margin: auto 30px;
  position: relative;
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

.profile-bottom-button {
  float: right;
  margin: 10px 5px;
  border-radius: 25px;
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

.profile-bottom-sign {
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

.coin-container {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}
/* .profile-header ::v-deep .el-image:hover {
} */
</style>