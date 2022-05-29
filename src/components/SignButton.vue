<template>
  <div>
    <el-button v-if="!isSign" type="primary" plain round @click="doSign"
      >签到</el-button
    >
    <el-button v-else type="info" plain round @click="doSign">已签到</el-button>
    <el-dialog
      title="🎉签到成功"
      center
      :visible.sync="showSignDialog"
      width="30%"
      class="sign-dialog"
      :showClose="false"
      v-if="signInfo != null"
    >
      <el-row class="row-style">
        <el-col :span="10" class="col-style" :offset="2"
          >连续签到：{{ signInfo.signContinuous }}天</el-col
        >
        <el-col :span="10" class="col-style" :offset="2"
          >总签到：{{ signInfo.signCount }}天</el-col
        >
      </el-row>
      <el-row>
        <el-col class="col-style" :span="12" :offset="2"
          >获得：{{ signInfo.signDunDunCoin }}盾盾币</el-col
        >
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="showSignDialog = false" size="medium">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/axios/user.js";
export default {
  data() {
    return {
      // 是否已经签到，按钮样式相关
      isSign: false,
      // 签到后显示对话框
      showSignDialog: false,
      // 签到信息
      signInfo: null,
    };
  },
  created() {
    this.getSignStatus();
  },
  methods: {
    // 签到
    async doSign() {
      let userId = this.$store.state.userInfo.id;
      let date = Date.now();
      let resData = await userApi.doSign(userId, date);
      resData = resData.data;
      // 签到成功dialog，并更改签到状态位true
      if (resData.code == 2028) {
        this.signInfo = resData.data;
        this.showSignDialog = true;
        this.isSign = true;
      }
      // 今日已签到提示消息
      else {
        this.$message.success(resData.msg);
      }
    },
    // 获取签到状态
    async getSignStatus() {
      let userId = this.$store.state.userInfo.id;
      let date = Date.now();
      let resData = await userApi.getSignStatus(userId, date);
      resData = resData.data;
      console.log(resData);
      // 表示已签到
      if (resData.data == true) {
        this.isSign = true;
      }
      // 表示未签到
      else {
        this.isSign = false;
      }
    },
  },
};
</script>

<style scoped>
.sign-dialog ::v-deep .el-dialog {
  border-radius: 8px;
}

.row-style {
  margin-bottom: 10px;
}

.col-style {
  font-size: 20px;
  font-weight: 600;
}
</style>