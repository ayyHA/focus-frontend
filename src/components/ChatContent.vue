<template>
  <div>
    <div
      v-if="selectedUserInfo != null"
      class="chat-content-container"
      :style="{
        height: this.fullScreenHeight + 'px',
      }"
    >
      <div class="chat-content-title">
        <div class="title-nickname">{{ selectedUserInfo.nickname }}</div>
      </div>
      <div class="divider"></div>
      <div class="chat-content-history focus-scroll" style="overflow-y: scroll">
        <div class="history-content">
          <div v-for="(chatInfo, index) in chatInfos" :key="index">
            <ChatContentInfo :isSelf="isSelfs[index]" :chatInfo="chatInfo" />
          </div>
        </div>
      </div>
      <div class="chat-content-input">
        <el-popover placement="top-start" trigger="click" class="input-emoji">
          <div class="emotionList">
            <a
              href="javascript:void(0);"
              @click="getEmoji(index)"
              v-for="(item, index) in faceList"
              :key="index"
              class="emotionItem"
              >{{ item }}</a
            >
          </div>
          <span class="iconfont focus-icon-xiaolian" slot="reference"></span>
        </el-popover>
        <el-input
          v-model="chatTextarea"
          class="input-textarea"
          resize="none"
          type="textarea"
          id="textarea"
          rows="7"
          @keyup.enter.native="sendInfo"
        ></el-input>
        <div class="input-submit">
          <el-button
            type="primary"
            class="send-button"
            icon="el-icon-s-promotion"
            @click="sendInfo"
          >
            发送</el-button
          >
        </div>
      </div>
    </div>
    <div
      v-else
      class="no-user-container"
      :style="{
        height: this.fullScreenHeight + 'px',
      }"
    >
      <div class="no-user">无聊天用户:)</div>
    </div>
  </div>
</template>

<script>
import fixMixin from "@/components/fixMixin.vue";
import ChatContentInfo from "@/components/ChatContentInfo.vue";
import chatApi from "@/axios/chat.js";
const appData = require("../../public/emoji.json");
export default {
  components: {
    ChatContentInfo,
  },
  data() {
    return {
      showEmoji: false,
      faceList: [],
      chatTextarea: "",
      wsClient: null,
      chatInfos: [],
      isSelfs: [],
    };
  },
  watch: {
    selectedUserInfo() {
      this.getChatHistory();
    },
  },

  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  created() {
    // 初始化websocket连接
    this.initWSClient();
  },
  mounted() {
    for (let i in appData) {
      this.faceList.push(appData[i].char);
    }
  },
  destroyed() {
    this.wsClient.close();
  },
  computed: {
    selectedUserInfo() {
      return this.$store.state.selectedUserInfo;
    },
  },
  methods: {
    // 将emoji表情放置进文本的对应位置
    getEmoji(index) {
      var textArea = document.getElementById("textarea");
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str);
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length;
          textArea.focus();
        } else if (document.selection) {
          // IE浏览器
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea, this.faceList[index]);
      this.chatTextarea = textArea.value; // 要同步data中的数据
      console.log(this.faceList[index]);
      return;
    },
    // 发送消息
    sendInfo() {
      if (this.chatTextarea.trim() == "") {
        this.$message.error("消息为空，不可以发送");
        return;
      }
      let sourceId = this.$store.state.userInfo.id;
      let targetId = this.selectedUserInfo.id;
      let createAt = Date.now();
      let chatEntityObject = this.setChatEntityJSON(
        sourceId,
        targetId,
        createAt,
        this.chatTextarea
      );
      // 发送消息
      this.wsClient.send(JSON.stringify(chatEntityObject));
      this.chatTextarea = "";
    },
    // 获取历史聊天记录
    async getChatHistory() {
      this.chatInfos = [];
      this.isSelfs = [];
      let userId = this.$store.state.userInfo.id;
      let talkId = this.selectedUserInfo.id;
      console.log(this.selectedUserInfo.nickname);
      let resData = await chatApi.getChatHistory(userId, talkId);
      resData = resData.data;
      if (resData.code == 2024) {
        let chatDtos = resData.data.chatDtos;
        for (let idx in chatDtos) {
          let chatDto = chatDtos[idx];
          console.log(chatDto);
          let sourceId = chatDto.sourceUser.id;
          if (sourceId == userId) {
            this.isSelfs.push(true);
          } else {
            this.isSelfs.push(false);
          }
          chatDto.createAt = this.transformTimestamp(chatDto.createAt);
          this.chatInfos.push(chatDto);
        }
      } else {
        this.chatInfos = [];
        this.isSelfs = [];
      }
    },
    // 初始化websockt连接
    initWSClient() {
      const userId = this.$store.state.userInfo.id;
      const wsUri = "ws://localhost:9006/home/" + userId;
      this.wsClient = new WebSocket(wsUri);
      this.wsClient.onopen = this.wsOnOpen;
      this.wsClient.onclose = this.wsOnClose;
      this.wsClient.onerror = this.wsOnError;
      this.wsClient.onmessage = this.wsOnMessage;
    },
    // 建立连接
    wsOnOpen() {
      // 重设当前的聊天用户为null
      this.$store.commit("setSelectedUserInfo", null);
      // 设置ChatList状态，以获取更新后的ChatList
      this.$store.commit("updateChatList");
      console.log("建立聊天的ws连接");
    },
    // 断开连接
    wsOnClose() {
      console.log("断开聊天的ws连接");
    },
    // 连接出错，重连
    wsOnError() {
      this.initWSClient();
    },
    // 接收消息,并展示
    wsOnMessage(e) {
      let chatDto = JSON.parse(e.data);
      let userId = this.$store.state.userInfo.id;
      let sourceId = chatDto.sourceUser.id;
      if (sourceId == userId) {
        this.isSelfs.push(true);
      } else {
        this.isSelfs.push(false);
      }
      chatDto.createAt = this.transformTimestamp(chatDto.createAt);
      this.chatInfos.push(chatDto);
      this.$store.commit("updateChatList");
    },

    // 格式化发送的内容
    setChatEntityJSON(sourceId, targetId, createAt, text) {
      return {
        chatId: {
          sourceId: sourceId,
          targetId: targetId,
        },
        createAt: createAt,
        text: text,
        status: 0,
      };
    },
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
  },
};
</script>
<style lang="scss">
/* el-popover是和app同级的，所以scoped的局部属性设置了无效 */
.el-popover {
  height: 200px;
  width: 400px;
  overflow: scroll;
  overflow-x: auto;
}
</style>
<style scoped>
.emotionList {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}
.emotionItem {
  width: 10%;
  font-size: 20px;
  text-align: center;
}
/*包含以下四种的链接*/
.emotionItem {
  text-decoration: none;
}
/*正常的未被访问过的链接*/
.emotionItem:link {
  text-decoration: none;
}
/*已经访问过的链接*/
.emotionItem:visited {
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
.emotionItem:hover {
  text-decoration: none;
}
/* 正在点击的链接*/
.emotionItem:active {
  text-decoration: none;
}

.chat-content-container {
  display: flex;
  flex-direction: column;
}

.chat-content-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  padding-top: 10px;
  padding: 5px;
  padding: 5px;
  background-color: #f5f5f5;
}

.title-nickname {
  font-weight: 500;
  font-size: 24px;
}

.divider {
  border-bottom: 1px #e6e6e6 solid;
  padding: 5px;
  background-color: #f5f5f5;
}

.chat-content-history {
  height: 450px;
  background-color: #f5f5f5;
}

.history-content {
  display: flex;
  flex-direction: column;
}

.focus-scroll::-webkit-scrollbar {
  width: 10px;
}

.focus-scroll::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #eee;
}

.chat-content-input {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.input-emoji {
  padding-left: 10px;
  padding-top: 10px;
  border-top: 1px #e6e6e6 solid;
}
.focus-icon-xiaolian {
  font-size: 24px;
  cursor: pointer;
}
.input-textarea ::v-deep .el-textarea__inner {
  border: none;
  font-size: 15px;
}

.input-textarea::v-deep .el-textarea__inner::-webkit-scrollbar {
  /* display: none; */
  width: 10px;
}

.input-textarea::v-deep .el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #eee;
}

.input-submit {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 10px;
}

.send-button {
  height: 20px;
  width: 80px;
  padding-bottom: 20px;
  padding-top: 8px;
  padding-left: 11px;
}

.no-user-container {
  display: flex;
  align-items: center;
}

.no-user {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 48px;
  color: #bbb;
}
</style>