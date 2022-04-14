<template>
  <div class="login-container">
    <el-form
      v-show="type === 'login'"
      ref="loginForm"
      label-width="80px"
      class="login-form"
      status-icon
      :rules="rules"
      :model="loginForm"
    >
      <h2 class="login-title">登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input
          prefix-icon="el-icon-user"
          v-model="loginForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          v-model="loginForm.password"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitLoginForm('loginForm')"
          >登录</el-button
        >
        <el-button type="primary" @click="changeToRegister">注册</el-button>
      </el-form-item>
    </el-form>

    <el-form
      v-show="type === 'register'"
      ref="registerForm"
      label-width="80px"
      class="login-form"
      status-icon
      :rules="rules"
      :model="registerForm"
    >
      <h2 class="login-title">注册</h2>
      <el-form-item label="用户名" prop="username">
        <el-input
          prefix-icon="el-icon-user"
          v-model="registerForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          v-model="registerForm.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          prefix-icon="el-icon-lock"
          v-model="registerForm.confirmPassword"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          prefix-icon="el-icon-s-custom"
          v-model="registerForm.nickname"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          prefix-icon="el-icon-message"
          v-model="registerForm.email"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeToLogin">登录</el-button>
        <el-button type="primary" @click="submitRegisterForm('registerForm')"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
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
  width: 350px;
  margin: 160px auto; /* 上下间距160px，左右自动居中*/
  background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
  padding: 30px;
  border-radius: 20px; /* 圆角 */
}

/* 背景 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: sandybrown;
  /* background: url("../../assets/login.png"); */
}

/* 标题 */
.login-title {
  color: #303133;
  text-align: center;
}
</style>