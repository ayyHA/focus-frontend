<template>
  <div
    v-loading="isLoading"
    :style="{
      height: this.fullScreenHeight - 77 + 'px',
      'overflow-y': 'auto',
    }"
    class="focus-scroll"
  >
    <div v-for="likeDto in likeDtos" :key="likeDto.messageDto.id">
      <NotificationShow
        :user="likeDto.userInfoDto"
        :message="likeDto.messageDto"
        :createAt="likeDto.createAt"
      />
    </div>
  </div>
</template>

<script>
import NotificationShow from "@/components/notificationShow.vue";
import messageApi from "@/axios/message.js";
import fixMixin from "@/components/fixMixin.vue";
export default {
  components: {
    NotificationShow,
  },
  // 混入组件，生命周期、函数、data都混进来
  mixins: [fixMixin],
  data() {
    return {
      isLoading: false,
      likeDtos: null,
    };
  },
  async created() {
    this.isLoading = true;
    let userId = this.$store.state.userInfo.id;
    let resData = await messageApi.getLikeData(userId);
    resData = resData.data;
    if (resData.data != null) {
      this.likeDtos = resData.data.likedtos;
    }
    this.isLoading = false;
  },
  methods: {},
};
</script>

<style scoped>
.focus-scroll::-webkit-scrollbar {
  width: 10px;
}

.focus-scroll::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #eee;
}
</style>