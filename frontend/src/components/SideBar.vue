<template>
  <div class="sidebar">
    <div class="nav-container">
      <div class="logo-details">
        <i class='bx bxl-c-plus-plus icon'></i>
        <div class="logo_name">{{ project_name }}</div>
        <i class='bx bx-menu' id="btn" @click="btnClick"></i>
      </div>
      <ul class="nav-list">
        <draggable v-if="member_id == admin_id">
          <li v-for="(board, index) in propsdata" :key="index" @click="clickBoard(board.clickMethod)">
            <a href="#">
              <i v-bind:class="board.icon"></i>
              <!-- <i class='bx bx-folder' ></i> -->
              <span class="links_name">{{ board.name }}</span>
            </a>
            <span class="tooltip">{{ board.name }}</span>
          </li>
        </draggable>
        <li v-if="member_id != admin_id" v-for="(board, index) in propsdata" :key="index"
          @click="clickBoard(board.clickMethod)">
          <a href="#">
            <i v-bind:class="board.icon"></i>
            <!-- <i class='bx bx-folder' ></i> -->
            <span class="links_name">{{ board.name }}</span>
          </a>
          <span class="tooltip">{{ board.name }}</span>
        </li>
        <div id="edit" v-if="member_id == admin_id">
          <li @click="addBoard">
            <a href="#">
              <i class='bx bx-plus'></i>
              <span class="links_name">게시판 추가</span>
            </a>
            <span class="tooltip">게시판 추가</span>
          </li>

          <li @click="addBoard" id="edit">
            <a href="#">
              <i class='bx bx-edit'></i>
              <span class="links_name">게시판 편집</span>
            </a>
            <span class="tooltip">게시판 편집</span>
          </li>
        </div>

        <li @click="exitProject()" class="exit-btn">
          <a href="#">
            <i class="bx bx-exit"></i>
            <span class="links_name">프로젝트 나가기</span>
          </a>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import axios from "axios";
import router from '@/router';

export default {
  data(){
    return {
      member_id: "",
      project_name: "이름 없음",
      admin_id: "",
      manager_ids: []
    }
  }, 
  props: ['propsdata'],
  components: {
    draggable,
  },
  created() {
    this.project_name = sessionStorage.getItem('project_name');
    this.member_id = sessionStorage.getItem('member_id');
  },
  mounted() {
    console.log('axios 요청 시도 from sidebar');
    axios.get('/api/project/authority/', {
      params: {
        member_id: sessionStorage.getItem('member_id')
      }
    })
      .then((res) => {
        const authData = res.data;
        this.admin_id = authData.admin_id;
        this.manager_ids = authData.manager_ids;
        console.log("result: " + authData.admin_id);
      })
      .catch((err) => console.log(err));
  },
  methods: {
    menuBtnChange: function() {
      let sidebar = document.querySelector(".sidebar");
      let closeBtn = document.querySelector("#btn");
      if(sidebar.classList.contains("open")){
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
      }else {
      closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
      }
    },
    searchClick: function() {
      let sidebar = document.querySelector(".sidebar");
      sidebar.classList.toggle("open");
      this.menuBtnChange();
    },
    btnClick: function() {
      let sidebar = document.querySelector(".sidebar");
      sidebar.classList.toggle("open");
      this.menuBtnChange();
      if(sidebar.classList.contains('open'))
        this.$emit('openBar', true);
      else
        this.$emit('openBar', false);
    },

    //  아이콘 클릭에 따라, 각 이벤트 정보를 담고 DashBoard.vue로 emit
    clickBoard: function(event) {
      this.$emit('changeBoard', event);
    },
    addBoard: function() {
      this.$emit('addBoard');
    },

    exitProject() {
      axios.delete('/api/project/exit', {
        data: {
          member_id: sessionStorage.getItem('member_id'),
          project_id: sessionStorage.getItem('project_id'),
        }
      })
        .then(() => {
          alert('프로젝트에서 탈퇴 되었습니다.');
          sessionStorage.removeItem('project_description');
          sessionStorage.removeItem('project_id');
          sessionStorage.removeItem('project_name');
          location.href = '/';
        })
        .catch((err) => {
          if (err.response.status === 403) {
            alert('관리자는 탈퇴할 수 없습니다.');
          } else {
            alert('알 수 없는 에러');
          }
        })
    }
  },
}
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 78px;
  background: #11101D;
  padding: 6px 14px;
  z-index: 99;
  transition: all 0.5s ease;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar.open {
  /* 250px */
  width: 235px;
  
}

.sidebar .logo-details {
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
}

.sidebar .logo-details .icon {
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar .logo-details .logo_name {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar.open .logo-details .icon,
.sidebar.open .logo-details .logo_name {
  opacity: 1;
}

.sidebar .logo-details #btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 22px;
  transition: all 0.4s ease;
  font-size: 23px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;
}

.sidebar.open .logo-details #btn {
  text-align: right;
}

.sidebar i {
  color: #fff;
  height: 60px;
  min-width: 50px;
  font-size: 28px;
  text-align: center;
  line-height: 60px;
}

.sidebar .nav-list {
  margin-top: 20px;
  height: 80%;
}

.sidebar li {
  position: relative;
  margin: 8px 0;
  list-style: none;
}

.sidebar li .tooltip {
  position: absolute;
  top: -20px;
  left: calc(100% + 15px);
  z-index: 3;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 400;
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;
  transition: 0s;
}

.sidebar li:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar.open li .tooltip {
  display: none;
}

.sidebar input {
  font-size: 15px;
  color: #FFF;
  font-weight: 400;
  outline: none;
  height: 50px;
  width: 100%;
  width: 50px;
  border: none;
  border-radius: 12px;
  transition: all 0.5s ease;
  background: #1d1b31;
}

.sidebar.open input {
  padding: 0 20px 0 50px;
  width: 100%;
}

.sidebar .bx-search {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 22px;
  background: #1d1b31;
  color: #FFF;
}

.sidebar.open .bx-search:hover {
  background: #1d1b31;
  color: #FFF;
}

.sidebar .bx-search:hover {
  background: #FFF;
  color: #11101d;
}

.sidebar li a {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  align-items: center;
  text-decoration: none;
  transition: all 0.4s ease;
  background: #11101D;
}

.sidebar li a:hover {
  background: #FFF;
}

.sidebar li a .links_name {
  color: #fff;
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s;
}

.sidebar.open li a .links_name {
  opacity: 1;
  pointer-events: auto;
}

.sidebar li a:hover .links_name,
.sidebar li a:hover i {
  transition: all 0.5s ease;
  color: #11101D;
}

.sidebar li i {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  border-radius: 12px;
}

.sidebar li.profile {
  position: fixed;
  height: 60px;
  width: 78px;
  left: 0;
  bottom: -8px;
  padding: 10px 14px;
  background: #1d1b31;
  transition: all 0.5s ease;
  overflow: hidden;
}

.sidebar.open li.profile {
  width: 250px;
}

.sidebar li .profile-details {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.sidebar li img {
  height: 45px;
  width: 45px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
}

.sidebar li.profile .name,
.sidebar li.profile .job {
  font-size: 15px;
  font-weight: 400;
  color: #fff;
  white-space: nowrap;
}

.sidebar li.profile .job {
  font-size: 12px;
}

.sidebar .profile #log_out {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: #1d1b31;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-radius: 0px;
  transition: all 0.5s ease;
}

.sidebar.open .profile #log_out {
  width: 50px;
  background: none;
}

.home-section {
  position: relative;
  background: #E4E9F7;
  min-height: 100vh;
  top: 100px;
  left: 78px;
  width: calc(100% - 78px);
  transition: all 0.5s ease;
  z-index: 2;
}

.sidebar.open~.home-section {
  left: 250px;
  width: calc(100% - 250px);
}

.home-section .text {
  display: inline-block;
  color: #11101d;
  font-size: 25px;
  font-weight: 500;
  margin: 18px
}

/* #edit {
  
  top: 20vmin;
} */

.nav-container {
  position: relative;
  top: 59px;
}

@media (max-width: 420px) {
  .sidebar li .tooltip {
    display: none;
  }
}
</style>