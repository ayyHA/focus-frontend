<template>
  <div style="position: relative">
    <el-menu
      class="menu-style"
      :default-active="activeIndex"
      @select="handleSelect"
      :style="{ height: this.fullScreenHeight + 'px' }"
    >
      <el-image
        :src="logo"
        style="width: 100%; height: 50px; margin-top: 10px"
        class="logo-style"
        fit="contain"
      ></el-image>
      <el-menu-item index="0">
        <div class="menu-item-style">
          <i class="iconfont focus-icon-shouye"></i>
          <span slot="title"> 首页</span>
        </div>
      </el-menu-item>
      <el-menu-item index="1">
        <div class="menu-item-style">
          <i class="iconfont focus-icon-huatifuhao"></i>
          <span slot="title"> 搜索</span>
        </div>
      </el-menu-item>
      <el-menu-item index="2">
        <div class="menu-item-style">
          <i class="iconfont focus-icon-xiaoxizhongxin"></i>
          <span slot="title"> 通知</span>
        </div>
      </el-menu-item>
      <el-menu-item index="3">
        <div class="menu-item-style">
          <i class="iconfont focus-icon-xiaoxi"></i>
          <span slot="title"> 聊天</span>
        </div>
      </el-menu-item>
      <el-menu-item index="4">
        <div class="menu-item-style">
          <i class="iconfont focus-icon-account-circle-line"></i>
          <span slot="title"> 个人中心</span>
        </div>
      </el-menu-item>
      <el-button
        class="menu-item-button"
        type="primary"
        round
        @click="clickMessageButton"
        >讯息</el-button
      >
      <MessageEdit ref="messageEditDialog" />
    </el-menu>
    <div
      class="user-thumb"
      :class="{ animate__animated: shake, animate__headShake: shake }"
      @mouseenter="shake = true"
      @mouseleave="shake = false"
      @click="clickUserThumb"
    >
      <div style="float: left">
        <el-image :src="thumbSrc" class="thumb-style"></el-image>
      </div>
      <div style="float: right; margin-left: 10px">
        <div class="thumb-nickname">{{ thumbNickname }}</div>
        <div class="thumb-username">@{{ thumbUsername }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import fixMixin from "./fixMixin.vue";
import MessageEdit from "@/components/MessageEdit.vue";
export default {
  data() {
    return {
      logo: require("@/assets/logo.png"),
      shake: false,
    };
  },
  components: {
    MessageEdit,
  },
  created() {
    this.activeIndex = "0";
  },
  computed: {
    activeIndex() {
      return this.$store.state.menuHeader.indexOf(this.$store.state.menuName);
    },
    thumbSrc() {
      return this.$store.state.userInfo.avatarUrl;
    },
    thumbNickname() {
      return this.$store.state.userInfo.nickname;
    },
    thumbUsername() {
      return this.$store.state.userInfo.username;
    },
  },

  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  methods: {
    handleSelect(key, keyPath) {
      // this.activeIndex = key;
      this.$store.commit("setMenuName", key);
      if (key === "0") this.$router.push({ path: "/" });
      if (key === "1") this.$router.push({ path: "/search" });
      if (key === "2") this.$router.push({ path: "/notification" });
      if (key === "3") this.$router.push({ path: "/chat" });
      if (key === "4") this.$router.push({ path: "/profile" });
    },
    clickUserThumb() {
      this.$router.push({ path: "/profile" });
    },
    clickMessageButton() {
      this.$refs.messageEditDialog.showDialog();
    },
  },
};
</script>

<style scoped>
.menu-style .menu-item-style {
  margin: 10px 80px;
}

.menu-item-button {
  margin: 15px 25%;
  width: 50%;
  font-family: "xingGuang";
  font-size: 25px;
}

span {
  font-family: "xingGuang";
  font-size: 25px;
}

.logo-style {
  margin: 0px auto;
}

.user-thumb {
  margin: 0px 30%;
  position: absolute;
  bottom: 50px;
}

.thumb-style {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.thumb-username {
  color: #536471;
}

.thumb-nickname {
  font-weight: 600;
}
</style>