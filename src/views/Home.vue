<template>
  <div>
    <el-row>
      <el-col :span="6">
        <Menu />
      </el-col>
      <el-col :span="12">
        <el-row><MenuTitle /></el-row>
        <el-row><router-view /></el-row>
      </el-col>
      <el-col :span="6">
        <News />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Menu from "@/components/menu.vue";
import News from "@/components/news.vue";
import MenuTitle from "@/components/menuTitle.vue";
import Stomp from "stompjs";

export default {
  data() {
    return {
      client: null,
    };
  },
  components: {
    Menu,
    News,
    MenuTitle,
  },
  created() {
    // 初始化连接
    this.connect();
  },
  methods: {
    // 点赞通知
    likeNotification(msg) {
      this.$notify({
        title: "点赞消息",
        message: msg,
        duration: 10,
      });
    },
    // 连接成功的回调函数
    onConnected(frame) {
      console.log("Connected: " + frame);
      // 绑定exchange和routingKey
      let exchange = "/exchange/like_exchange/" + this.$store.state.userInfo.id;
      // 订阅对应的交换机,通过路由键找到对应的队列,后面是接收消息和失败的回调函数
      this.client.subscribe(exchange, this.onReceived, this.onFailed);
    },
    // 连接失败的回调函数
    onFailed(frame) {
      console.log("Failed: " + frame);
      // 重连
      window.setTimeout(() => {
        this.connect();
      }, 5000);
    },
    // 收到消息后的回调函数
    onReceived(frame) {
      console.log("收到的消息 msg=>" + frame.body);
      this.likeNotification(frame.body);
    },
    // 连接RabbitMQ
    connect() {
      this.client = Stomp.client("ws://localhost:15674/ws");
      let headers = {
        login: "ayyHA",
        passcode: "123456aa",
        host: "/",
      };
      // 创建连接，放入连接成功和失败的回调函数
      this.client.connect(headers, this.onConnected, this.onFailed);
    },
  },
};
</script>

<style>
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>