<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel">게시판 수정</h1>
              <button type="button" class="btn-close" @click="close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">게시판 이름</label>
                <input type="text" class="form-control" placeholder="ex) Union Project 회의록"
                  v-model="changeBoardName" value="aazz" required>
              </div>

            </div>
            <!-- <div class="modal-footer"> -->
              <button class="btn btn-dark" @click="updateBoard">게시판 이름 수정</button>
            <!-- </div> -->
          </div>
          
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'

export default {
  props: ['propsdata'],
  created() {
    this.board = this.propsdata;
    this.changeBoardName = localStorage.getItem('boardName');
  },
  data() {
    return {
      board: null,
      changeBoardName: null
    }
  },
  methods: {
    close: function() {
      this.$emit('editClose');
    },
    async updateBoard() {
      // this.$emit('createBoard', this.boardInfo);
      this.board.board_name = this.changeBoardName;
      axios.patch(`${process.env.VUE_APP_SERVER_URL}/api/board`, this.board);

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