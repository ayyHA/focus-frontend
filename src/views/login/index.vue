<template>
  <div class="login-container">
    <div class="f-login login-form">
      <div class="f-login-left">
        <div class="left-column">
          <el-image :src="loginPic"></el-image>
          <div v-if="type === 'register'" class="left-text">
            加入focus<br />看见不一样的世界
          </div>
        </div>
      </div>

      <el-form
        v-show="type === 'login'"
        ref="loginForm"
        label-width="80px"
        status-icon
        class="f-login-right"
        :rules="rules"
        :model="loginForm"
      >
        <div class="f-login-form">
          <h2 class="login-title">登录</h2>
          <el-form-item prop="username" class="f-form-item">
            <el-input
              prefix-icon="el-icon-user"
              v-model="loginForm.username"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="f-form-item">
            <el-input
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>

          <el-form-item class="f-form-item">
            <el-button type="primary" @click="submitLoginForm('loginForm')"
              >登录</el-button
            >
            <el-button type="primary" @click="changeToRegister">注册</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-form
        v-show="type === 'register'"
        ref="registerForm"
        label-width="80px"
        status-icon
        class="f-login-right"
        :rules="rules"
        :model="registerForm"
      >
        <div class="f-register-form">
          <h2 class="login-title">注册</h2>
          <el-form-item prop="username" class="f-form-item">
            <el-input
              prefix-icon="el-icon-user"
              v-model="registerForm.username"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="f-form-item">
            <el-input
              prefix-icon="el-icon-lock"
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword" class="f-form-item">
            <el-input
              prefix-icon="el-icon-lock"
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="nickname" class="f-form-item">
            <el-input
              prefix-icon="el-icon-s-custom"
              v-model="registerForm.nickname"
              placeholder="昵称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email" class="f-form-item">
            <el-input
              prefix-icon="el-icon-message"
              v-model="registerForm.email"
              placeholder="邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item class="f-form-item">
            <el-button type="primary" @click="changeToLogin">登录</el-button>
            <el-button
              type="primary"
              @click="submitRegisterForm('registerForm')"
              >注册</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
  <script>
import authApi from "@/axios/auth.js";
export default {
  data() {
    // 验证密码的规则
    var checkPassword = (rule, value, callback) => {
      const regPassword = /^(?!\D+$)(?![^a-zA-Z]+$)\S{8,16}$/;
      // const regPassword = /([0-9A-Za-z]){6,16}/;
      if (regPassword.test(value)) return callback(); // 合法的密码
      callback(new Error("密码需要是8-16位数字和字母的组合"));
      // callback(new Error("密码位数需要6-16位"));
    };
    // 验证二次输入密码的规则
    var checkConfirmPassowrd = (rule, value, callback) => {
      if (value === this.registerForm.password) return callback();
      callback(new Error("两次密码不一致"));
    };
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.com){1}/;
      if (regEmail.test(value)) return callback(); // 合法的邮箱
      callback(new Error("请输入合法的邮箱"));
    };
    return {
      loginPic: require("@/assets/loginPic.png"),
      type: "login",
      loginForm: { username: "", password: "" },
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        email: "",
      },

      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 16, message: "用户名3-16位", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" },
        ],
        confirmPassword: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            validator: checkConfirmPassowrd,
            trigger: "blur",
          },
        ],
        nickname: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
          { min: 3, max: 16, message: "昵称3-16位", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitLoginForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 登录，判断是否信息正确
          let token = await authApi.signIn(this.loginForm);
          // 失败，通过$message打印错误信息
          if (token.data.code === 1002) {
            // UsernamePassword错误
            this.$message.error({ message: token.data.msg, duration: 1000 });
            this.$refs[formName].resetFields();
          } else if (token.data.code === 1003) {
            // grantType错误
            this.$message.error({ meesage: token.data.msg, duration: 1000 });
            this.$refs[formName].resetFields();
          } else if (token.data.code === 1001) {
            // 客户端错误
            this.$message.error({ message: token.data.msg, duration: 1000 });
            this.$refs[formName].resetFields();
          } else {
            // 认证成功,将token存入localStorage，通过发送请求前的拦截器将其加于请求头上
            let auth = token.data.token_type + " " + token.data.access_token;
            localStorage.setItem("Authorization", auth);
            localStorage.setItem("username", this.loginForm.username);
            // 以下添加的是页数
            localStorage.setItem("page", 0);
            // 跳转到首页
            this.$router.push({ path: "/" });
          }
          return true;
        } else {
          this.$message.error("用户名或密码存在格式错误");
          this.$refs[formName].resetFields();
          return false;
        }
      });
    },
    changeToRegister() {
      this.type = "register";
    },
    changeToLogin() {
      this.type = "login";
    },
    submitRegisterForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let registerMsg = await authApi.signUp(this.registerForm);
          if (registerMsg.data.code === 1006) {
            // 用户名重复
            this.$message.error(registerMsg.data.msg);
            this.$refs[formName].resetFields();
          } else {
            this.$message.success("注册成功");
            this.type = "login";
            console.log(registerMsg);
          }
          return true;
        } else {
          this.$message.error("注册信息存在错误");
          this.$refs[formName].resetFields();
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 800px;
  margin: 120px auto;
}

/* 背景 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgb(172, 240, 187);
  background: linear-gradient(
    90deg,
    rgba(172, 240, 187, 1) 0%,
    rgba(159, 164, 251, 1) 100%
  );
}

/* 标题 */
.login-title {
  color: #303133;
  text-align: center;
}

.f-login {
  display: flex;
}

.f-login-left {
  width: 50%;
  background-color: darkblue;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  box-shadow: -2px 0px 10px grey, 0px -2px 10px grey, 0px 2px 10px grey;
}

.left-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-text {
  /* height: 150px; */
  /* display: flex; */
  /* align-items: center; */
  color: mintcream;
  font-size: 30px;
  font-weight: 600;
  line-height: 40px;
  padding-bottom: 60px;
}

.f-login-right {
  width: 50%;
  background-color: rgb(255, 255, 255);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 2px 0px 10px grey, 0px -2px 10px grey, 0px 2px 10px grey;
}

.f-login-form {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.f-register-form {
  height: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.f-form-item ::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
</style>