<template>
  <div
    :style="{
      height: this.fullScreenHeight - 68 + 'px',
      'overflow-y': 'scroll',
    }"
    class="el-aside"
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
      />
    </div>
    <div v-if="scrollLoading">
      <!-- <div><center>加载中...</center></div> -->
      <div v-loading="isLoading" class="load-style"></div>
    </div>
    <!-- <div v-if="pageBoom || elementTop"><center>没有更多了</center></div> -->
  </div>
</template>

<script>
import MessageShow from "@/components/MessageShow.vue";
import fixMixin from "@/components/fixMixin.vue";
import messageApi from "@/axios/message.js";
export default {
  components: {
    MessageShow,
  },
  watch: {
    messagesUpdate() {
      this.updateMessages_();
    },
  },
  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  data() {
    return {
      page: -1,
      maxPages: -1,
      maxElements: 2,
      scrollLoading: false,
      // 存储多条讯息数据
      messages_: [],
      // 加载
      isLoading: false,
    };
  },
  created() {
    this.page = Number(localStorage.getItem("page"));
  },
  computed: {
    // page达到上限了(数据库的上限)
    pageBoom() {
      return this.maxPages == this.page;
    },
    // message达到上限(规定展示讯息的上限)
    elementTop() {
      return this.messages_.length >= this.maxElements;
    },
    disabled() {
      return this.scrollLoading || this.pageBoom || this.elementTop;
    },
    messagesUpdate() {
      return this.$store.state.isUpdateMessages_;
    },
  },
  methods: {
    async load() {
      this.scrollLoading = true;
      this.isLoading = true;
      let messageInfos = await messageApi.getMessageInfoList(this.page);
      messageInfos = messageInfos.data;
      console.log(messageInfos);
      if (messageInfos.code == "2011") this.$message.error(messageInfos.msg);
      else if (messageInfos.code == "2012") {
        let messages = messageInfos.data.messageInfoDtos;
        this.messages_.push(...messages);
        this.isLoading = false;
        this.scrollLoading = false;
        this.page += 1;
        this.maxPages = messages[0].maxPages;
        this.maxElements = messages[0].maxElements;
        // console.log(
        //   "page:",
        //   this.page,
        //   "maxpages:",
        //   this.maxPages,
        //   "maxElements",
        //   this.maxElements
        // );
      }
    },
    updateMessages_() {
      let msgInfoDto = JSON.parse(localStorage.getItem("updateMessageInfoDto"));
      this.messages_.unshift(msgInfoDto);
    },
  },
};
</script>

<style scoped>
/* 隐藏滚动条 */
.el-aside::-webkit-scrollbar {
  display: none;
}

.load-style ::v-deep .el-loading-spinner {
  margin-top: 0px;
}
</style>