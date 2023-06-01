import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    // meetingMinute: {},
  },
  getters: {
    // getMeetingMinute(state) {
    //   return state.meetingMinute;
    // },
    getToken(state) {
      return state.token;
    },
    headers(state) {
      return {
        Authorization: `Bearer ${state.token}`,
      };
    },
  },
  mutations: {
    // setMeetingMinute(state, meetingMinute) {
    //   state.meetingMinute = meetingMinute;
    // },
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      sessionStorage.removeItem('member_id');
      sessionStorage.removeItem('member_name');
      state.token = null;
    },
    
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    },
    handleTokenExpired({ commit }) {
      alert('로그인 세션이 만료되었습니다. 다시 로그인 후 이용해주세요');
      commit('clearToken');
      location.href = '/';
    },
  },
  plugins: [createPersistedState()],
})
