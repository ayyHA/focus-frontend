import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuHeader: ["首页", "搜索", "通知", "消息", "个人中心"],
    menuName: "首页",
    userInfo: {
      id: "",
      username: "",
      nickname: "",
      avatarUrl: "",
      email: "",
      createAt: "",
      description: "",
      gender: null,
      pinnedMessageId: "",
      profileImageUrl: "",
      dunDunCoin: null,
      birthday: "",
    },
    genderArray: ["female", "male", "others"],
  },
  mutations: {
    setMenuName(state, _index) {
      state.menuName = state.menuHeader[_index];
    },
    initUsername(state, _username) {
      state.userInfo.username = _username;
    },
    initUserInfo(state, _userInfo) {
      state.userInfo = _userInfo;
    },
  },
  actions: {
  },
  modules: {
  }
})
