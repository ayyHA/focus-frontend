<template>
  <div>
    <div class="profile-style">
      <div class="profile-header">
        <vue-hover-mask @click="clickBackground">
          <el-image :src="profileImageUrl" />
          <CutBackground
            ref="profileBackground"
            :autoCropWidth="700"
            :autoCropHeight="150"
            @getUrl="getBackgroundUrl"
          />
          <template v-slot:action>
            <i class="iconfont focus-icon-bianji"> 编辑</i>
          </template>
        </vue-hover-mask>
      </div>
      <div class="profile-bottom">
        <el-button
          type="primary"
          plain
          class="profile-bottom-button"
          @click="clickUserInfo"
          >设置个人信息</el-button
        >
        <ProfileEditInfo ref="profileEditInfo" />
        <SignButton class="profile-bottom-sign" />
        <div class="profile-bottom-name">
          <div class="nickname">
            {{ profileNickname }}
            <span v-if="this.$store.state.userInfo.gender == 'female'"
              ><i class="iconfont focus-icon-nv"></i
            ></span>
            <span v-else-if="this.$store.state.userInfo.gender == 'male'"
              ><i class="iconfont focus-icon-nan"></i
            ></span>
          </div>
          <div class="username">@{{ profileUsername }}</div>
        </div>
        <div class="profile-bottom-detail">
          <el-row style="padding-top: 10px">
            <el-col :span="4" style="font-weight: 600">个人简介</el-col>
            <el-col :span="20">
              <p
                style="
                  word-wrap: break-word;
                  margin: 0px 5px;
                  margin-right: 10px;
                "
              >
                {{ profileDescription }}
              </p>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="profile-medium">
        <el-image
          :src="profileAvatar"
          @click="clickAvatar"
          style="cursor: pointer"
        />
        <CutPortrait @getUrl="getUrl" ref="profileCutPortrait" />
      </div>
    </div>
  </div>
</template>

<script>
import CutPortrait from "@/components/CutPortrait.vue";
import CutBackground from "@/components/CutBackground.vue";
import ProfileEditInfo from "@/components/profileEditInfo.vue";
import VueHoverMask from "@/components/VueHoverMask.vue";
import SignButton from "@/components/SignButton.vue";
export default {
  components: {
    CutPortrait,
    ProfileEditInfo,
    CutBackground,
    VueHoverMask,
    SignButton,
  },
  data() {
    return {};
  },
  computed: {
    profileAvatar() {
      return this.$store.state.userInfo.avatarUrl;
    },
    profileNickname() {
      return this.$store.state.userInfo.nickname;
    },
    profileUsername() {
      return this.$store.state.userInfo.username;
    },
    profileDescription() {
      return this.$store.state.userInfo.description;
    },
    profileImageUrl() {
      return this.$store.state.userInfo.profileImageUrl;
    },
  },
  methods: {
    // 获取头像裁剪组件返回的路径
    getUrl(path) {
      this.$store.state.userInfo.avatarUrl = path;
    },
    // 父组件调用子组件里的方法,设置头像
    clickAvatar() {
      this.$refs.profileCutPortrait.showDialog();
    },
    // 父组件调用子组件里的方法,设置个人信息
    clickUserInfo() {
      this.$refs.profileEditInfo.showForm();
    },
    clickBackground() {
      this.$refs.profileBackground.showDialog();
    },
    // 获取背景图
    getBackgroundUrl(path) {
      this.$store.state.userInfo.profileImageUrl = path;
    },
  },
};
</script>

<style scoped>
/* avatar的样式 */
.profile-medium ::v-deep .el-image {
  width: 100px;
  height: 100px;
  background-size: 100px 100px;
  border-radius: 50%;
  border: 5px solid #fff;
}

.profile-medium ::v-deep .el-image:hover {
  background-color: #d3d3d3;
  border: 5px solid #d3d3d3;
  transition: all 0.3s linear;
}

/* profile四兄弟的控制 */
.profile-style {
  height: 300px;
  margin: auto 30px;
  position: relative;
}

.profile-header {
  height: 150px;
}

.profile-bottom {
  background-color: #fff;
  height: 150px;
}

.profile-medium {
  position: absolute;
  top: 100px;
  margin: 0px 10px;
}

.profile-bottom-button {
  float: right;
  margin: 10px 5px;
  border-radius: 25px;
}

.profile-bottom-name {
  padding-top: 10px;
  padding-left: 150px;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
}

.username {
  font-size: 15px;
  color: #536471;
}

.profile-bottom-detail {
  padding-left: 32px;
}

.profile-header ::v-deep .el-image {
  width: 700px;
  height: 150px;
}

.profile-bottom-sign {
  float: right;
  margin: 10px 5px;
}

/* .profile-header ::v-deep .el-image:hover {
} */
</style>