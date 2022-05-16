<template>
  <div
    :style="{ height: this.fullScreenHeight - 10 + 'px' }"
    class="chat-container"
  >
    <div class="search-container">
      <div class="search-left">
        <span class="iconfont focus-icon-sousuo"></span>
      </div>
      <div class="search-right">
        <input
          class="search-input"
          placeholder="找些什么"
          v-model="searchInput"
          @keyup.enter="goForSearch"
        />
      </div>
    </div>
    <div class="divider"></div>
    <div
      :style="{
        height: this.fullScreenHeight - 55 + 'px',
        'overflow-y': 'scroll',
      }"
      class="focus-aside"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
    >
      <div v-for="chatUserInfo in chatUserInfos" :key="chatUserInfo.id">
        <ChatListInfo :chatUserInfo="chatUserInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import fixMixin from "@/components/fixMixin.vue";
import ChatListInfo from "@/components/ChatListInfo.vue";
import searchApi from "@/axios/search.js";
export default {
  components: {
    ChatListInfo,
  },
  data() {
    return {
      // 搜索框内容
      searchInput: "",
      /* 测试用 */
      tests: {
        nickname: "ayy",
        datetime: "2022-5-16 21:21:39",
        userAvatar: this.$store.state.userInfo.avatarUrl,
      },
      // 聊天集合用户信息
      chatUserInfos: [],
    };
  },
  computed: {
    disabled() {
      return false;
    },
  },
  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  created() {},
  methods: {
    // 监听输入框的enter事件【需要修改】
    async goForSearch() {
      // 根据nickname进行搜索
      this.isLoading = true;
      let resData = await searchApi.searchByNickname(this.searchInput);
      resData = resData.data;
      // 获取信息成功
      if (resData.code == 2020) {
        this.userInfos = resData.data.userInfoDtos;
      }
      // 获取信息失败(没找到相关数据的意思)
      else {
        this.userInfos = null;
      }
      this.isLoading = false;
    },
    load() {
      this.chatUserInfos.push(this.tests);
      console.log("I COMING IN " + new Date().getTime());
    },
  },
};
</script>

<style scoped>
.chat-container {
  border-right: #e6e6e6 1px solid;
}

.search-container {
  display: flex;
  background-color: rgb(239, 243, 244);
  border-radius: 9999px;
  height: 32px;
  align-items: center;
  border: 1px solid rgb(239, 243, 244);
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
}

.search-container:focus-within {
  border: 1px solid rgb(29, 155, 240);
  background-color: #fff;
}

.search-left {
  display: flex;
  justify-content: center;
  padding-left: 10px;
}

.search-right {
  display: flex;
  flex-grow: 1;
}

.search-input {
  flex-grow: 1;
  padding-left: 5px;
  width: 50px;
  font-size: 15px;
}

/* 清除原input样式 */
.search-right input {
  background: none;
  outline: none;
  border: 0px;
}

.focus-icon-sousuo {
  font-size: 16px;
}

.divider {
  border-bottom: 1px #e6e6e6 solid;
  padding: 5px;
}

.focus-aside::-webkit-scrollbar {
  /* display: none; */
  width: 10px;
}

.focus-aside::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #eee;
}
</style>