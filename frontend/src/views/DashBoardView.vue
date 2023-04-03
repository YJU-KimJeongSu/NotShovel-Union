<template>
  <div>
    <!-- SideBar에서 게시판 선택에 따른 뷰 전환 -->
    <SideBar @changeBoard="changeView" @addBoard="addOneBoard" :propsdata="bList" @openBar="changeBar"></SideBar>
    <MeetingNotes v-if="currentView === 'meetingNotes'" :props="isOpen"></MeetingNotes>
    <!-- 추후에 각 게시판 종류별로 컴포넌트 추가(ex: 차트, 오픈채팅 등) -->
    <!-- 각 뷰들을 구성하는데 필요한 데이터들은 여기서 각 컴포넌트로 props -->
    <Modal v-if="showModal" @close="closeModal"></Modal>
  </div>
  
</template>

<script>
import sidebar from '../components/SideBar.vue'
import meetingNotes from '../components/MeetingNotes.vue'
import modal from '../components/AddBoardModal.vue'

export default {
  data: function() {
    return {
      isOpen: false,
      currentView: "",
      showModal: false,
      bList: [
        {name: '회의록', type: 'meetingNotes', icon: 'bx bx-folder', clickMethod: 'meetingNotes'},
        {name: 'User', type: '', icon: 'bx bx-user', clickMethod: ''},
        {name: 'Messages', type: 'openChat', icon: 'bx bx-chat', clickMethod: ''},
        {name: 'Gant Chart', type: 'gantChart', icon: 'bx bx-pie-chart-alt-2', clickMethod: ''},
        {name: 'Setting', type: 'setting', icon: 'bx bx-cog', clickMethod: ''},
      ],
    }
  },
  components: {
    SideBar: sidebar,
    MeetingNotes: meetingNotes,
    Modal: modal
  },
  methods: {
    changeView: function(view) {
      if(view === 'dashMain') {
        this.currentView = "";
        return;
      }
      this.currentView = view;
    },
    addOneBoard: function() {
      this.showModal = !this.showModal;
    },
    closeModal: function(boardInfo) {
      const board = boardInfo;
      let icon;
      switch(board.type) {
        case 'meetingNotes': icon = 'bx bx-folder'; break;
        case 'openChatting': icon = 'bx bx-chat'; break;
        case 'gantChart': icon = 'bx bx-pie-chart-alt-2'; break;
        default: icon='';
      }
      if(board.type != '')
        this.bList.push({name: board.name, icon: icon});
      this.showModal = !this.showModal;
    },
    changeBar: function(event) {
      this.isOpen = event;
    }
    
  }
}
</script>

<style scoped> 

</style>