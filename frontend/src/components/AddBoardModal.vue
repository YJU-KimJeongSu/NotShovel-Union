<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel">게시판 추가</h1>
              <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">게시판 이름</label>
                <input type="text" class="form-control" placeholder="ex) Union Project 회의록"
                  v-model="boardInfo.name" required>
              </div>

              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">게시판 종류</label>
                <select class="form-select form-select mb-3" v-model="boardInfo.type">
                  <option selected disabled>종류를 선택해주세요</option>
                  <option value="meetingMinutes" >회의록</option>
                  <option value="gantChart">간트 차트</option>
                  <option value="openChatting">오픈 채팅</option>
                </select>
              </div>

            </div>
            <!-- <div class="modal-footer"> -->
              <button class="btn btn-dark" @click="createBoard()">Create</button>
            <!-- </div> -->
          </div>
          
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import $ from 'jquery';
export default {
  data() {
    return {
      boardInfo: {name: '', type: ''}
    }
  },
  methods: {
    close: function() {
      this.$emit('close');
    },
    createBoard: function() {
      this.$emit('createBoard', this.boardInfo);
      this.$router.go();
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}


.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>