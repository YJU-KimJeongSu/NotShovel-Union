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
    <MeetingMinutes v-if="currentView === 'meetingMinutes'" :props="isOpen"></MeetingMinutes>
    <!-- 추후에 각 게시판 종류별로 컴포넌트 추가(ex: 차트, 오픈채팅 등) -->
    <!-- 각 뷰들을 구성하는데 필요한 데이터들은 여기서 각 컴포넌트로 props -->
    <Setting v-else-if="currentView === 'setting'" :props="isOpen"></Setting>
    <GanttChart v-else-if="currentView === 'ganttChart'" :props="isOpen"></GanttChart>
    <OpenChat v-else-if="currentView === 'openChat'" :isOpen="isOpen"
            :chatBoardId="boardId" :chatBoardName="boardName"
            :key="boardId"></OpenChat>
    <Modal v-if="showModal" @close="closeModal" @createBoard="createBoardItem"></Modal>
    
  </div>
  
</template>

<script>
import sidebar from '../components/SideBar.vue'
import meetingMinutes from '../components/MeetingMinutes.vue'
import ganttChart from '../components/GanttChart.vue'
import openChat from '../components/OpenChat.vue'
import modal from '../components/AddBoardModal.vue'
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
      boardId: "",
      boardName: "",
      boardOrder: null,
      showModal: false,
      dbData: {
        // bList: [
        // {name: '회의록', type: 'MeetingMinutes', icon: 'bx bx-folder', clickMethod: 'MeetingMinutes'},
        // {name: 'User', type: '', icon: 'bx bx-user', clickMethod: ''},
        // {name: 'Messages', type: 'openChat', icon: 'bx bx-chat', clickMethod: ''},
        // {name: 'Gantt Chart', type: 'ganttChart', icon: 'bx bx-pie-chart-alt-2', clickMethod: 'ganttChart'},
        // ],
        bList: [],
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
    
    axios.get('/api/project/authority/', {
      params: {
        member_id: sessionStorage.getItem('member_id')
      }
    })
    .then((res) => {
        const authData = res.data;
        this.dbData.admin_id = authData.admin_id;
        this.dbData.manager_ids = authData.manager_ids;
    })
    .catch((err) => console.log(err));

    // 게시판 리스트 겟요청
    axios.get('/api/board', {
    params: {
      project_id: this.project_id
    }
    })
    .then((res) => {
      const boardData = res.data;
      this.dbData.bList = res.data;
      // console.log(boardData[0].board_order);
      // console.log(boardData[1].board_order);
      // console.log(boardData[2].board_order);
    })
    .catch((err) => console.log(err));
    },
  components: {
    SideBar: sidebar,
    MeetingMinutes: meetingMinutes,
    Modal: modal,
    Setting: setting,
    GanttChart: ganttChart,
    OpenChat: openChat
  },
  methods: {
    changeView(view, boardId, boardName, index) {
      if(view === 'dashMain') {
        this.currentView = "";
        return;
      }
      this.currentView = view;
      this.boardId = boardId;
      this.boardName = boardName;
      this.boardOrder = index;
      sessionStorage.setItem('board_id', this.boardId);
      sessionStorage.setItem('currentView', this.currentView);
    },
    addOneBoard() {
      this.showModal = !this.showModal;
    },

    // 게시판 추가 모달 캔슬 동작
    closeModal() {
      this.showModal = !this.showModal;
    },

    // 게시판 추가
    async createBoardItem(boardInfo) {
      // console.log(`createBoardInfo: ${boardInfo.name}`);
      boardInfo.listIndex = this.dbData.bList.length; // 새로 추가된 게시판의 순서Index
      await axios.post('/api/board', boardInfo,{
        params: {
          project_id: this.project_id
        }
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    
      const board = boardInfo;
      let icon;
      switch (board.type) {
        case 'meetingMinutes': icon = 'bx bx-folder'; break;
        case 'openChatting': icon = 'bx bx-chat'; break;
        case 'gantChart': icon = 'bx bx-pie-chart-alt-2'; break;
        default: icon='';
      }
      if (board.type != '')
        this.dbData.bList.push({name: board.name, icon: icon});

      this.showModal = !this.showModal;
    },
    changeBar(event) {
      this.isOpen = event;
      let boardData = this.dbData.bList;
      // console.log(boardData[0].board_order);
      // console.log(boardData[1].board_order);
      // console.log(boardData[2].board_order);
    },
    async saveOrderItems(newOrder) {
      let bList = this.dbData.bList;
      for (let i = 0; i < bList.length; i++) {
        bList[i].newOrder = newOrder[i];
        console.log(`Blist newOrder: ${bList[i].newOrder}, name: ${bList[i].board_name}`);
      }
      console.log('save Event 수신');


      await axios.patch('/api/board/order', bList, {
        params: {
          project_id: this.project_id
        }
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}
</script>

<style scoped> 

</style>