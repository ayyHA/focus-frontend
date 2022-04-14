<template>
  <el-dialog
    title="编辑个人信息"
    :visible.sync="showFormVariable"
    width="500px"
  >
    <el-form :model="userInfoForm" ref="userInfoForm" label-width="100px">
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="userInfoForm.nickname"
          v-if="isEditNickname"
          maxlength="16"
          show-word-limit
          style="width: 300px"
          @blur="blurNickname"
        ></el-input>
        <span v-else
          >{{ nickname
          }}<i class="iconfont focus-icon-bianji" @click="clickNickname"></i
        ></span>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-if="isEditGender"
          v-model="genderType"
          placeholder=""
          style="width: 300px"
          @blur="blurGender"
        >
          <el-option
            v-for="item in options"
            :key="String(item.value)"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span v-else
          >{{ gender
          }}<i class="iconfont focus-icon-bianji" @click="clickGender"></i
        ></span>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-if="isEditBirthday"
          v-model="userInfoForm.birthday"
          type="date"
          placeholder="日期选择"
          style="width: 300px"
          @blur="blurBirthday"
        >
        </el-date-picker>
        <span v-else
          >{{ birthday
          }}<i class="iconfont focus-icon-bianji" @click="clickBirthday"></i
        ></span>
      </el-form-item>
      <el-form-item label="个人简介" prop="description">
        <el-input
          v-if="isEditDescription"
          v-model="userInfoForm.description"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 7 }"
          maxlength="120"
          show-word-limit
          style="width: 300px; padding-bottom: 15px"
          @blur="blurDescription"
        ></el-input>
        <span v-else
          >{{ description
          }}<i class="iconfont focus-icon-bianji" @click="clickDescription"></i
        ></span>
      </el-form-item>
      <el-form-item label="置顶讯息" prop="pinned_message_id">
        <el-input
          v-if="isEditPinnedMessageId"
          v-model="userInfoForm.pinned_message_id"
          style="width: 300px"
          placeholder="@username/messageID"
          @blur="blurPinnedMessageId"
        ></el-input>
        <span v-else
          >{{ pinnedMessageId
          }}<i
            class="iconfont focus-icon-bianji"
            @click="clickPinnedMessageId"
          ></i
        ></span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeForm">取 消</el-button>
      <el-button
        type="primary"
        @click="submitUserInfoForm"
        v-loading.fullscreen.lock="isLoading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import userApi from "@/axios/user.js";
export default {
  data() {
    return {
      showFormVariable: false,
      userInfoForm: {
        nickname: "",
        gender: null,
        birthday: "",
        description: "",
        pinned_message_id: null,
      },
      isEditNickname: false,
      isEditGender: false,
      isEditBirthday: false,
      isEditDescription: false,
      isEditPinnedMessageId: false,
      genderOptions: ["女", "男", "保密"],
      isLoading: false,
      genderType: null,
      options: [
        {
          value: 0,
          label: "女",
        },
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "保密",
        },
      ],
    };
  },
  computed: {
    nickname() {
      if (this.userInfoForm.nickname == "")
        this.userInfoForm.nickname = this.$store.state.userInfo.nickname;
      return this.userInfoForm.nickname;
    },
    gender() {
      if (this.genderType == null)
        this.genderType = this.$store.state.genderArray.indexOf(
          this.$store.state.userInfo.gender
        );
      return this.genderOptions[this.genderType];
    },
    birthday() {
      if (this.userInfoForm.birthday == "")
        return this.$store.state.userInfo.birthday;
      else return this.convertToDate(this.userInfoForm.birthday);
    },
    description() {
      if (this.userInfoForm.description == "")
        this.userInfoForm.description = this.$store.state.userInfo.description;
      return this.userInfoForm.description;
    },
    pinnedMessageId() {
      if (this.userInfoForm.pinned_message_id == "")
        this.userInfoForm.pinned_message_id =
          this.$store.state.userInfo.pinned_message_id;
      return this.userInfoForm.pinned_message_id;
    },
  },
  methods: {
    showForm() {
      this.showFormVariable = true;
    },
    closeForm() {
      this.showFormVariable = false;
      // this.$refs.userInfoForm.resetFields();
      this.resetMyFields();
      console.log("resetFields", this.userInfoForm);
    },
    clickNickname() {
      this.isEditNickname = true;
    },
    blurNickname() {
      this.isEditNickname = false;
    },
    clickGender() {
      this.isEditGender = true;
    },
    blurGender() {
      this.isEditGender = false;
    },
    clickBirthday() {
      this.isEditBirthday = true;
    },
    blurBirthday() {
      this.isEditBirthday = false;
      console.log(this.userInfoForm.birthday);
    },
    clickDescription() {
      this.isEditDescription = true;
    },
    blurDescription() {
      this.isEditDescription = false;
    },
    clickPinnedMessageId() {
      this.isEditPinnedMessageId = true;
    },
    blurPinnedMessageId() {
      this.isEditPinnedMessageId = false;
    },
    monthConversion(m) {
      return m < 10 ? "0" + m : m;
    },
    convertToDate(dateStr) {
      let date = new Date(dateStr);
      let resDate =
        date.getFullYear() +
        "-" +
        this.monthConversion(date.getMonth() + 1) +
        "-" +
        this.monthConversion(date.getDate());
      return resDate;
    },
    async submitUserInfoForm() {
      this.isLoading = true;
      let userInfoDto = {
        nickname: this.userInfoForm.nickname,
        description: this.userInfoForm.description,
        gender: this.genderType,
        pinnedMessageId: this.userInfoForm.pinned_message_id,
        birthday: this.userInfoForm.birthday,
      };
      let resDto = await userApi.updateUserDetails(userInfoDto);
      resDto = resDto.data;
      // 更新个人信息失败
      if (resDto.code == 2009) {
        this.$message.error(resDto.msg);
      }
      // 更新个人信息成功
      else if (resDto.code == 2010) {
        let finalDto = resDto.data.userInfoDto;
        this.$store.commit("initUserInfo", finalDto);
      }
      // 清除输入框内部的内容
      // this.$refs.userInfoForm.resetFields();
      this.resetMyFields();
      // close dialog
      this.showFormVariable = false;
      // loading finished
      this.isLoading = false;
    },
    resetMyFields() {
      this.userInfoForm = {
        nickname: "",
        gender: null,
        birthday: "",
        description: "",
        pinned_message_id: null,
      };
    },
  },
};
</script>

<style scoped>
span {
  line-height: 36px;
}
/* span i {
  margin-left: 220px;
} */
span i:hover {
  border-radius: 100%;
  background-color: #dcdcdc;
  transition: linear 0.2s;
}
</style>