<template>
  <div class="user-info-container">
    <div class="user-info">
      <div class="user-avatar">
        <el-image
          class="image-avatar"
          :src="userInfo.avatarUrl"
          @click="jumpToUserDetail"
        ></el-image>
      </div>
      <div class="user-basic-info">
        <div class="basic-info">
          <div class="info">
            <div class="info-nickname">
              {{ userInfo.nickname }}
            </div>
            <div class="info-username">@{{ userInfo.username }}</div>
          </div>
          <FollowButton :userId="userInfo.id" />
          <!-- <div class="followButton">
            <el-button type="primary" round>关注</el-button>
          </div> -->
        </div>
        <div class="user-description">{{ userInfo.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import FollowButton from "@/components/FollowButton.vue";
export default {
  components: {
    FollowButton,
  },
  props: {
    userInfo: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 跳转到用户详情页
    jumpToUserDetail() {
      let userId = this.userInfo.id;
      // 当点击的用户是自己
      if (userId == this.$store.state.userInfo.id)
        this.$router.push({ path: "/profile" });
      // 当点击的用户是他人
      else this.$router.push({ name: "UserDetail", params: { userId } });
    },
  },
};
</script>

<style scoped>
.user-info-container {
  padding: 12px 48px;
  display: flex;
  /* cursor: pointer; */
}

.user-info-container:hover {
  background-color: #eee;
  transition: 0.25s linear;
}

.user-info {
  display: flex;
  flex-grow: 1;
}

.user-avatar {
  margin-right: 12px;
}

.image-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
}

.user-basic-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.basic-info {
  display: flex;
  justify-content: space-between;
}

.info {
  display: flex;
  flex-direction: column;
}

.info-nickname {
  font-weight: 600;
  font-size: 15px;
}

.info-username {
  font-size: 15px;
  color: #aaa;
}

.user-description {
  padding-top: 4px;
  font-size: 14px;
}
</style>