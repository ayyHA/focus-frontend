<template>
  <div>
    <span class="close-icon-style" @click="showCloseDialog">
      <i class="el-icon-close"></i>
    </span>
    <el-dialog
      center
      :visible.sync="isCloseDialog"
      width="25%"
      class="close-dialog"
      :showClose="false"
    >
      <div slot="title">
        <i class="el-icon-warning-outline"></i>
        <span class="title-text">确认是否删除</span>
      </div>
      <span slot="footer">
        <el-button
          type="danger"
          @click="deleteMessage"
          size="medium"
          class="button-style"
        >
          删 除
        </el-button>
        <el-button
          type="info"
          @click="hideCloseDialog"
          size="medium"
          class="button-style"
        >
          取 消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import messageApi from "@/axios/message.js";
export default {
  props: {
    msgId: {
      require: true,
      type: Number,
    },
  },
  data() {
    return {
      isCloseDialog: false,
    };
  },
  methods: {
    showCloseDialog() {
      this.isCloseDialog = true;
    },
    hideCloseDialog() {
      this.isCloseDialog = false;
    },
    async deleteMessage() {
      // 后端删除元素
      let resData = await messageApi.deleteMessageById(this.msgId);
      resData = resData.data;
      // 删除成功，同步移除前端该信息
      if (resData.code == 2040) {
        // 移除前端该信息显示
        this.$store.commit("setDeleteMessageId", this.msgId);
        this.$message.success(resData.msg);
      }
      // 删除失败
      else if (resData.code == 2039) {
        this.$message.error(resData.msg);
      }
      // 隐藏对话框
      this.isCloseDialog = false;
    },
  },
};
</script>

<style scoped>
.close-icon-style {
  cursor: pointer;
}

.close-icon-style:hover {
  color: tomato;
}

.close-dialog ::v-deep .el-dialog {
  border-radius: 8px;
}

.close-dialog ::v-deep .el-dialog--center .el-dialog__body {
  padding-bottom: 5px;
  padding-top: 5px;
}

.el-icon-warning-outline {
  font-weight: 600;
}

.title-text {
  font-weight: 600;
}

.button-style {
  padding: 8px 12px;
  margin: 0px 8px;
}
</style>