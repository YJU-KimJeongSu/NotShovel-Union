<template>
  <div>
<!--
      SideBar에서 게시판 선택에 따른 뷰 전환(changeView),
      게시판 추가(addBoard),
      사이드 바 열렸을 시 오른쪽으로 밀기 위해, 클릭 이벤트 캐치(openBar),
      게시판 순서 저장(saveOrder)
-->
    <SideBar :propsdata="dbData"
              @changeBoard="changeView"
              @addBoard="addOneBoard"
              @openBar="changeBar"
              @saveOrder="saveOrderItems"
    ></SideBar>
    <MeetingNotes v-if="currentView === 'meetingNotes'" :props="isOpen"></MeetingNotes>
    <!-- 추후에 각 게시판 종류별로 컴포넌트 추가(ex: 차트, 오픈채팅 등) -->
    <!-- 각 뷰들을 구성하는데 필요한 데이터들은 여기서 각 컴포넌트로 props -->
    <Setting v-else-if="currentView === 'setting'" :props="isOpen"></Setting>
    <GanttChart v-else-if="currentView === 'ganttChart'" :props="isOpen"></GanttChart>
    <Modal v-if="showModal" @close="closeModal"></Modal>
  </div>
  
</template>

<script>
import sidebar from '../components/SideBar.vue'
import meetingNotes from '../components/MeetingNotes.vue'
import modal from '../components/AddBoardModal.vue'
import ganttChart from '../components/GanttChart.vue'
import setting from '../components/Setting.vue'
import { eventBus } from '../main.js';
import axios from "axios";

export default {
  data: function() {
    return {
      project: null,
      project_id: null,
      isOpen: false,
      currentView: "",
      showModal: false,
      dbData: {
        bList: [
        {name: '회의록', type: 'meetingNotes', icon: 'bx bx-folder', clickMethod: 'meetingNotes'},
        {name: 'User', type: '', icon: 'bx bx-user', clickMethod: ''},
        {name: 'Messages', type: 'openChat', icon: 'bx bx-chat', clickMethod: ''},
        {name: 'Gantt Chart', type: 'ganttChart', icon: 'bx bx-pie-chart-alt-2', clickMethod: 'ganttChart'},
        {name: 'Setting', type: 'setting', icon: 'bx bx-cog', clickMethod: 'setting'},
        ],
        admin_id: "",
        manager_ids: [],
        member_id: "",
        project_name: "이름 없음",
      },
      
    }
  },
  created: function() {
    eventBus.$on('project', (project)=>{
      this.project = project;
      console.log(project);
    });
    this.project_id = sessionStorage.getItem('project_id');
    this.currentView = sessionStorage.getItem('currentView');
    this.dbData.project_name = sessionStorage.getItem('project_name');
    this.dbData.member_id = sessionStorage.getItem('member_id');
  },
  mounted: function() {
    console.log('axios 요청 시도 from sidebar');
    axios.get('/api/project/authority/', {
      params: {
        member_id: sessionStorage.getItem('member_id')
      }
    })
      .then((res) => {
        const authData = res.data;
        this.dbData.admin_id = authData.admin_id;
        this.dbData.manager_ids = authData.manager_ids;
        console.log("result: " + authData.admin_id);
      })
      .catch((err) => console.log(err));
  },
  components: {
    SideBar: sidebar,
    MeetingNotes: meetingNotes,
    Modal: modal,
    Setting: setting,
    GanttChart: ganttChart,
  },
  methods: {
    changeView: function(view) {
      if(view === 'dashMain') {
        this.currentView = "";
        return;
      }
      this.currentView = view;
      sessionStorage.setItem('currentView', this.currentView);
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
    },
    saveOrderItems: function() {
      
    }
    
  }
}
</script>

<style scoped> 

</style>