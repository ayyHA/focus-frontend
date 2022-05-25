<template>
  <div class="content-info-container">
    <div v-show="isSelf">
      <div class="self-user">
        <div class="chat-avatar">
          <el-image
            class="user-avatar"
            :src="chatInfo.sourceUser.avatarUrl"
          ></el-image>
        </div>
        <div class="chat-self-part">
          <div class="part-self-content">{{ chatInfo.text }}</div>
          <div class="part-self-date">{{ chatInfo.createAt }}</div>
        </div>
      </div>
    </div>
    <div v-show="!isSelf">
      <div class="chat-user">
        <div class="chat-avatar">
          <el-image
            class="user-avatar"
            :src="chatInfo.sourceUser.avatarUrl"
          ></el-image>
        </div>
        <div class="chat-part">
          <div class="part-content">{{ chatInfo.text }}</div>
          <div class="part-date">{{ chatInfo.createAt }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isSelf: {
      type: Boolean,
      require: true,
    },
    chatInfo: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.content-info-container {
  margin-bottom: 5px;
  margin-top: 5px;
}

.self-user {
  display: flex;
  flex-direction: row-reverse;
}
.chat-user {
  display: flex;
  flex-direction: row;
}

.chat-avatar {
  margin: 0px 10px;
}
.user-avatar {
  border-radius: 50%;
  width: 38px;
  height: 38px;
}
.chat-part {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 200px;
  align-items: flex-start;
}

.chat-self-part {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 200px;
  align-items: flex-end;
}

.part-self-content {
  display: flex;
  flex-direction: row-reverse;
  font-size: 16px;
  font-weight: 500;
  background-color: #9eea6a;
  border-radius: 8px;
  padding: 10px;
}

.part-content {
  font-size: 16px;
  font-weight: 500;
  background-color: #9eea6a;
  border-radius: 8px;
  padding: 10px;
}

.part-self-date {
  display: flex;
  flex-direction: row-reverse;
  font-size: 12px;
  color: #bbb;
  margin-top: 5px;
}

.part-date {
  font-size: 12px;
  color: #bbb;
  margin-top: 5px;
}
</style>