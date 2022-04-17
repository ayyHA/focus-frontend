<template>
  <div>
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
    <div class="tabs-container">
      <el-tabs v-model="activeTabName" stretch="true">
        <el-tab-pane label="相关用户" name="byUser">
          <div
            v-loading="isLoading"
            v-for="userInfo in userInfos"
            :key="userInfo.id"
          >
            <UserShow :userInfo="userInfo" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="相关讯息" name="byMessage">
          <div
            v-loading="isLoading"
            v-for="message in messageInfos"
            :key="message.messageDto.id"
          >
            <MessageShow
              :user="message.userInfoDto"
              :message="message.messageDto"
              :operateCount="message.messagePublicDataDto"
              :operateStatus="message.messageStatusDto"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import UserShow from "@/components/UserShow.vue";
import MessageShow from "@/components/MessageShow.vue";
import searchApi from "@/axios/search.js";
export default {
  components: {
    UserShow,
    MessageShow,
  },
  data() {
    return {
      // 搜索框内容
      searchInput: "",
      // 标签页的选择
      activeTabName: "byUser",
      // 用户信息集
      userInfos: null,
      // 讯息信息集
      messageInfos: null,
      // 是否显示loading中
      isLoading: false,
    };
  },
  methods: {
    // 监听输入框的enter事件
    async goForSearch() {
      // 根据nickname进行搜索
      if (this.activeTabName == "byUser") {
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
      }
      // 根据keywords搜索
      else if (this.activeTabName == "byMessage") {
        this.isLoading = true;
        let resData = await searchApi.searchByKeywords(this.searchInput);
        resData = resData.data;
        // 获取信息成功
        if (resData.code == 2018) {
          this.messageInfos = resData.data.messageInfoDtos;
        }
        // 获取信息失败(没找到相关数据的意思)
        else {
          this.messageInfos = null;
        }
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.search-container {
  display: flex;
  margin: 18px 120px;
  background-color: rgb(239, 243, 244);
  border-radius: 9999px;
  height: 48px;
  align-items: center;
  border: 1px solid rgb(239, 243, 244);
}

.search-container:focus-within {
  border: 1px solid rgb(29, 155, 240);
  background-color: #fff;
}

.search-left {
  display: flex;
  justify-content: center;
  margin: auto 20px;
}

.search-right {
  display: flex;
  flex-grow: 1;
}

.search-input {
  flex-grow: 1;
  margin-right: 20px;
  font-size: 15px;
}

/* 清除原input样式 */
.search-right input {
  background: none;
  outline: none;
  border: 0px;
}
</style>