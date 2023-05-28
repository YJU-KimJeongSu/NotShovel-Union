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
    }
  },
  mutations: {
    // setMeetingMinute(state, meetingMinute) {
    //   state.meetingMinute = meetingMinute;
    // },
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    }
  },
  plugins: [createPersistedState()],
})
