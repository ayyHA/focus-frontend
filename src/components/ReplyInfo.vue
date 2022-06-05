<template>
  <el-card shadow="hover" class="card-style">
    <div class="reply-both-slides">
      <div class="reply-container">
        <div class="reply-container-left">
          <el-image :src="user.avatarUrl" class="left-avatar"></el-image>
        </div>
        <div class="reply-container-right">
          <div
            :class="{
              'reply-content-container': isContentOther,
              'reply-user-content-container': isContentUser,
            }"
          >
            <div class="reply-user-operate">
              <div class="reply-user">
                <div class="user-nickname">{{ user.nickname }}</div>
                <div class="user-date">{{ message.createAt }}</div>
              </div>
              <div class="reply-operate"></div>
            </div>
            <div class="reply-content">{{ message.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      require: true,
    },
    message: {
      type: Object,
      require: true,
    },
  },
  //  watch: {
  //   message.createAt() {
  //     if (this.createAt != null)
  //       this.createAt = this.transformTimestamp(this.createAt);
  //   },
  // },
  data() {
    return {
      isContentUser: false,
      isContentOther: true,
    };
  },
  created() {
    if (this.message.createAt != null && this.message.createAt != "刚刚")
      this.message.createAt = this.transformTimestamp(this.message.createAt);
    if (this.user.id == this.message.inReplyToAuthorId) {
      this.isContentUser = true;
      this.isContentOther = false;
    }
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
.card-style ::v-deep .el-card__body {
  padding: 0px;
}

.reply-both-slides {
  padding: 12px 16px;
}

.reply-container {
  display: flex;
}

.reply-container-left {
  margin-right: 12px;
}

.left-avatar {
  border-radius: 50%;
  width: 48px;
  height: 48px;
}

.reply-container-right {
  flex-grow: 1;
}

.reply-content-container {
  background-color: RGB(249, 249, 249);
  border: 1px solid RGB(249, 249, 249);
  min-height: 100px;
  height: auto;
  border-radius: 8px;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
}

.reply-user-content-container {
  background-color: RGB(246, 249, 254);
  border: 1px solid RGB(246, 249, 254);
  min-height: 100px;
  height: auto;
  border-radius: 8px;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
}

.reply-user-operate {
  display: flex;
  justify-content: space-between;
}

.reply-user {
  display: flex;
}

.user-nickname {
  color: RGB(97, 144, 232);
  font-weight: 500;
}

.user-date {
  color: RGB(164, 164, 164);
  padding-left: 5px;
}

.reply-operate {
  display: flex;
  justify-content: flex-end;
}

.reply-content {
  padding-top: 8px;
}
</style>