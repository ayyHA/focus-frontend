<template>
  <div>
    <el-button plain type="primary" round @click="showPayDialog"
      >打赏</el-button
    >
    <el-dialog
      title="打赏作者，为创作出力"
      center
      :visible.sync="isPayDialog"
      width="30%"
      class="pay-dialog"
      :showClose="false"
    >
      <div class="pay-dialog-container">
        <div class="pay-count">
          <el-input
            v-model="payCoinCount"
            class="pay-count-input"
            oninput="value=value.replace(/[^\d]/g,' ')"
            maxLength="4"
          >
            <template slot="append">盾盾币</template>
          </el-input>
        </div>
        <div class="pay-tips">当前共有{{ dunDunCoin }}盾盾币</div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="doReward" size="medium">
          确 定
        </el-button>
        <el-button type="info" @click="hidePayDialog" size="medium">
          取 消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import payApi from "@/axios/pay.js";
export default {
  props: {
    userId: {
      require: true,
    },
  },
  data() {
    return {
      isPayDialog: false,
      payCoinCount: null,
      sourceId: this.$store.state.userInfo.id,
    };
  },
  computed: {
    dunDunCoin() {
      return this.$store.state.userInfo.dunDunCoin;
    },
  },
  methods: {
    showPayDialog() {
      this.isPayDialog = true;
    },
    hidePayDialog() {
      this.isPayDialog = false;
      this.payCoinCount = null;
    },
    async doReward() {
      // 对输入数据进行类型校验
      let checkPayCount = Number(this.payCoinCount);
      if (isNaN(checkPayCount)) {
        this.payCoinCount = null;
        this.$message.error("请输入正确的打赏币数");
        return;
      }
      // 打赏币数为空或为0
      if (checkPayCount == 0 || checkPayCount == null) {
        this.payCoinCount = null;
        this.$message.error("打赏币数不能为空");
        return;
      }
      // 盾盾币是否足够
      let selfCoin = this.$store.state.userInfo.dunDunCoin;
      if (selfCoin < checkPayCount) {
        this.payCoinCount = null;
        this.$message.error("盾盾币不足");
        return;
      }
      // 校验成功后执行
      let resData = await payApi.doReward(
        this.sourceId,
        this.userId,
        checkPayCount
      );
      resData = resData.data;
      if (resData.code == 2040) {
        this.$store.commit("updateDunDunCoin", -resData.data);
        this.$message.success(resData.msg);
      } else if (resData.code == 2039) {
        this.$message.error(resData.msg);
      }
      // 清空数据，隐藏对话框
      this.isPayDialog = false;
      this.payCoinCount = null;
    },
  },
};
</script>

<style scoped>
.pay-dialog ::v-deep .el-dialog {
  border-radius: 8px;
}

.pay-dialog ::v-deep .el-dialog--center .el-dialog__body {
  padding-bottom: 5px;
  padding-top: 20px;
}

.pay-dialog-container {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.pay-count {
  display: flex;
  flex-direction: row;
}

.pay-count-input ::v-deep .el-input__inner {
  width: 100px;
  height: 30px;
}

.pay-count-input ::v-deep .el-input-group__append {
  padding: 0 8px;
}

.pay-tips {
  padding-top: 20px;
  color: #ccc;
  font-size: 12px;
}
</style>