import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuHeader: ["首页", "搜索", "通知", "聊天", "个人中心", null],
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
    selectedUserInfo: null,
    isUpdateChatList: false,
    deleteMessageId: null,
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
    setSelectedUserInfo(state, _selectedUserInfo) {
      state.selectedUserInfo = _selectedUserInfo;
    },
    // 更新ChatList
    updateChatList(state) {
      state.isUpdateChatList = !state.isUpdateChatList;
    },
    // 更新盾盾币
    updateDunDunCoin(state, _coin) {
      state.userInfo.dunDunCoin += _coin;
    },
    // 设置deleteMessageId
    setDeleteMessageId(state, _messageId) {
      state.deleteMessageId = _messageId;
    },
  },
  actions: {
  },
  modules: {
  }
})
