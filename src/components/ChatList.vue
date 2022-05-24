<template>
  <div class="container">
    <div class="chat-container">
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
        class="focus-scroll"
      >
        <div
          v-show="!isSearch"
          v-for="(chatUserInfo, index) in chatUserInfos"
          :key="index"
          @click="selectListInfo(index)"
        >
          <ChatListInfo
            :chatUserInfo="chatUserInfo.targetUser"
            :createAt="chatUserInfo.createAt"
          />
        </div>
        <div v-show="isSearch" class="search-list">
          <div class="out-of-search-list">
            <i class="el-icon-arrow-left leftArrow" @click="outOfSearch"></i>
          </div>
          <div
            v-for="(searchUserInfo, index) in searchUserInfos"
            :key="index"
            @click="selectListInfo(index)"
          >
            <ChatListInfo :chatUserInfo="searchUserInfo" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="column-divider"
      :style="{
        height: this.fullScreenHeight + 'px',
      }"
    ></div>
  </div>
</template>

<script>
import fixMixin from "@/components/fixMixin.vue";
import ChatListInfo from "@/components/ChatListInfo.vue";
import searchApi from "@/axios/search.js";
import chatApi from "@/axios/chat.js";
export default {
  components: {
    ChatListInfo,
  },
  watch: {
    statusChatList() {
      this.loadChatListInfo();
    },
  },
  data() {
    return {
      // 是否正在搜索
      isSearch: false,
      // 搜索框内容
      searchInput: "",
      // 搜索到的用户消息
      searchUserInfos: null,
      /* 测试用 */
      tests: {
        nickname: "ayy",
        avatarUrl: this.$store.state.userInfo.avatarUrl,
      },
      /* 测试用 */
      // createAt: "2022-5-16 21:21:39",
      createAt: "2022-04-18T12:44:37.000+0000",
      // 聊天集合用户信息
      chatUserInfos: null,
      // 被选中的聊天用户
      selectedUserInfo: null,
    };
  },
  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  created() {},
  computed: {
    statusChatList() {
      return this.$store.state.isUpdateChatList;
    },
  },
  methods: {
    // 监听输入框的enter事件，按下即为搜索【需要修改】
    async goForSearch() {
      // 将搜索状态变更为true
      this.isSearch = true;
      // 根据nickname进行搜索
      this.isLoading = true;
      let resData = await searchApi.searchByNickname(this.searchInput);
      resData = resData.data;
      // 获取信息成功
      if (resData.code == 2020) {
        this.searchUserInfos = resData.data.userInfoDtos;
      }
      // 获取信息失败(没找到相关数据的意思)
      else {
        this.searchUserInfos = null;
      }
      this.isLoading = false;
    },
    // 获取聊天列表信息
    async loadChatListInfo() {
      let userId = this.$store.state.userInfo.id;
      let resData = await chatApi.getChatList(userId);
      resData = resData.data;
      // 获取信息成功
      if (resData.code == 2022) {
        this.chatUserInfos = resData.data.chatDtos;
      }
      // 获取信息失败
      else {
        this.$message.info(resData.msg);
      }
    },
    // 离开搜索
    outOfSearch() {
      this.isSearch = false;
    },
    // 选择聊天列表中的用户，并更新Vuex里的选中用户
    selectListInfo(index) {
      if (!this.isSearch) this.selectedUserInfo = this.chatUserInfos[index];
      else this.selectedUserInfo = this.searchUserInfos[index];
      this.$store.commit("setSelectedUserInfo", this.selectedUserInfo);
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
}
.chat-container {
  /* border-right: #e6e6e6 1px solid; */
  flex-grow: 1;
}

.column-divider {
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

.focus-scroll::-webkit-scrollbar {
  width: 10px;
}

.focus-scroll::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #eee;
}

.out-of-search-list {
  height: 18px;
  width: 100%;
}

.leftArrow {
  cursor: pointer;
}
</style>