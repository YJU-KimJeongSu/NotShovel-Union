<template>
  <div>
    <!-- SideBar에서 게시판 선택에 따른 뷰 전환 -->
    <SideBar @changeBoard="changeView"></SideBar>
    <MeetingNotes v-if="currentView === 'meetingNotes'"></MeetingNotes>
    <!-- 추후에 각 게시판 종류별로 컴포넌트 추가(ex: 차트, 오픈채팅 등) -->
    <!-- 각 뷰들을 구성하는데 필요한 데이터들은 여기서 각 컴포넌트로 props -->
  </div>
  
</template>

<script>
import sidebar from './SideBar.vue'
import meetingNotes from './MeetingNotes.vue'

export default {
  data: function() {
    return {
      currentView: ""
    }
  },
  components: {
    SideBar: sidebar,
    MeetingNotes: meetingNotes
  },
  methods: {
    changeView: function(view) {
      // 대쉬보드를 따로 구성할지 말지?
      if(view === 'dashMain') {
        this.currentView = "";
        return;
      }
      this.currentView = view;
    }
    
  }
}
</script>

<style scoped> 

</style>