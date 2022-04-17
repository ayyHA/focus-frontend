<template>
  <div>
    <div class="box">
      <el-image class="box-image" :src="user.avatarUrl"></el-image>
      <div class="content-container">
        <div>
          <span class="content-nickname">{{ user.nickname }}</span>
          <span>&nbsp;点赞了你的讯息&nbsp;</span>
          <span class="content-text">{{ message.text }}</span>
        </div>
        <div>
          <span class="content-time">{{ createAt }}</span>
        </div>
      </div>
    </div>
    <div class="div-bottom"></div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      require: true,
      type: Object,
    },
    user: {
      require: true,
      type: Object,
    },
    createAt: {
      require: true,
      type: String,
    },
  },
  data() {
    return {};
  },
  created() {
    this.createAt = this.transformTimestamp(this.createAt);
    this.message.text = String(this.message.text);
    this.message.text = this.message.text.slice(0, 7) + "...";
    console.log(this.message.text);
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
  },
};
</script>

<style scoped>
.box {
  width: 100%;
  display: flex;
  margin: 10px 0;
}

.box-image {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 0px 10px;
  margin-left: 40px;
}

.content-container {
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.content-nickname {
  font-weight: 600;
  color: rgb(75, 75, 175);
  cursor: pointer;
}

.content-text {
  font-weight: 600;
  color: rgb(75, 75, 175);
  cursor: pointer;
}

.content-time {
  color: #bbb;
  margin-right: 25px;
}

.div-bottom {
  border-bottom: 1px solid #ddd;
}
</style>