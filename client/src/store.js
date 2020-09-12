import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    groups: [],
    groupToJoin: null,
    userId: null,
    isRegisterModalOpen: false,
    isLoginModalOpen: false,
  },
  mutations: {
    setGroupToJoin(state, groupToJoin) {
      state.groupToJoin = groupToJoin;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    addGroup(state, group) {
      state.groups.push(group);
    },
    removeGroup(state, group) {
      state.groups.splice(state.groups.indexOf(group), 1);
    },
    setGroups(state, groups) {
      state.groups = groups;
    },
    openLoginModal(state) {
      state.isLoginModalOpen = true;
    },
    closeLoginModal(state) {
      state.isLoginModalOpen = false;
    },
    openRegisterModal(state) {
      state.isRegisterModalOpen = true;
    },
    closeRegisterModal(state) {
      state.isRegisterModalOpen = false;
    },
  },
  actions: {},
});
