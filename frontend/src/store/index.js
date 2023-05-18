import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // meetingMinute: {}, // MeetingMinutes에서 MeetingMinuteEditor 페이지로 이동할 때 사용
  },
  getters: {
    // getMeetingMinute(state) {
    //   return state.meetingMinute;
    // }
  },
  mutations: {
    // setMeetingMinute(state, meetingMinute) {
    //   state.meetingMinute = meetingMinute;
    // },
  },
  actions: {

  },
  modules: {
  },
  plugins: [createPersistedState()],
})