import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import userApi from '@/axios/user'
import store from '@/store'
import authApi from '@/axios/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    // name: 'Home',
    component: () => import('@/views/home.vue'),
    children: [
      {
        path: '/',
        name: 'Homepage',
        component: () => import('@/views/page/homePage.vue'),
        meta: { menu: "0" },
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/page/searchPage.vue'),
        meta: { menu: "1" },
      },
      {
        path: '/notification',
        name: 'Notification',
        component: () => import('@/views/page/notificationPage.vue'),
        meta: { menu: "2" },
      },
      {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/page/chatPage.vue'),
        meta: { menu: "3" },
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/page/profilePage.vue'),
        meta: { menu: "4" },
      },

    ],
  },

]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  /*当用户无token，跳转到登录页 */
  let token = localStorage.getItem("Authorization");

  if (token == null) {
    if (to.name === "Login") {
      next();
    }
    next({ path: "/login" });
  }
  console.log("PRE CHECK:", localStorage.getItem(username));
  /*当用户有token，但过期，移除Authorization、username，跳转到login*/
  let tokenState = await authApi.checkToken(token);
  if (tokenState.data.code == 1004) {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("username");
    next({ path: "/login" });
  }

  /* 以下是当用户有token且未过期 */
  /* 获取username */
  let username = localStorage.getItem("username");
  console.log(username);

  /* 初始化全局的用户名 */
  store.commit("initUsername", username);
  /* 获取userInfo */
  let userInfo = await userApi.getUserInfo(
    store.state.userInfo.username
  );
  /* 初始化全局的userInfo */
  store.commit("initUserInfo", userInfo.data);
  /* 设置菜单名 */
  store.commit("setMenuName", to.meta.menu);
  //**** 
  console.log("id", store.state.userInfo.id);
  console.log("gender", store.state.userInfo.gender);
  console.log("dunDunCoin", store.state.userInfo.dunDunCoin);
  console.log("birthday", store.state.userInfo.birthday);
  console.log("gender", store.state.userInfo.gender);
  console.log("CreatAt", store.state.userInfo.createAt);
  //**** 
  /* 当用户有token且将去login，跳到首页；否则去用户想去的路径 */
  if (to.name === "Login") {
    next({ path: "/" });
  }

  next();
})

export default router
