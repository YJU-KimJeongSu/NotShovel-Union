<template>
  <div class="editor-all">
    <div class="editor-form">
      <div class="editor-menu">
        <input type="text" class="form-control editor-title" v-model="title" placeholder="제목">
        <input type="date" class="form-control editor-date" v-model="date"> 
        <input type="text" class="form-control editor-date" v-model="location" placeholder="장소">
      </div>
      <div class="editor-content">
        <Editor ref="toastEditor" initialEditType="wysiwyg" height="550px" previewStyle="vertical" />
      </div>
    </div>
    <div class="editor-right">
      <div class="editor-right-menu">
        <button type="submit" class="btn btn-outline-primary" @click="save()">작성완료</button>
        <button type="button" class="btn btn-outline-secondary" @click="goMeetingNoteMain()">나가기</button>
      </div>
      <div class="editor-chat">
        <div class="editor-chat-content">
          채팅내용
        </div>
        <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="채팅" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">전송</button>
      </div>
    </div>
    </div>
  </div>
</template>
 
<script>
import axios from 'axios'
import { Editor } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/toastui-editor.css' // Editor style

export default {
  data() {
    return {
      title: '',
      date: '',
      location: '',
      main: false, 
    }
  },
  props:{
    isWrite: Boolean
  },
  components: {
    Editor,
  },
  mounted() {
    this.date = new Date().toISOString().slice(0,10);
	  window.addEventListener('beforeunload', this.leave)
  }, 
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.leave)
  },
  methods: {
    leave(event) {
      // 리스트에 있거나 나가기 버튼 외에 새로고침 방지 메소드
      if (this.main === false && this.isWrite === true) {
      event.preventDefault();
      event.returnValue = '';
      }
    },
    async save() {
      if(this.title == '' || this.date == '' || this.place == ''){
        alert('빈 값을 다 채워주세요');
        return;
      }
      try {
        const project_id = sessionStorage.getItem('project_id');
        
        // 추후 수정
        const board_name = 'test';
        const board_order = 1;

        await axios.post('/api/meeting', {
          project_id,
          board_name,
          board_order,
          title: this.title,
          date: this.date,
          context: this.getContent(),
          place: this.place
        })
        this.main = true;
        alert('회의록 저장 완료');
        this.$router.go();
      } catch (err) {
        console.error(err);
        alert('회의록 저장 실패');
      }
    },
    goMeetingNoteMain(){
      this.main = true;
      const chk = confirm('저장되지 않은 변경 사항이 있습니다. 정말 나가시겠습니까?');
      if(chk) {
        this.$router.go();
      }
      else return;
    },
    getContent() {
      return this.$refs.toastEditor.invoke('getMarkdown');
    },
    setContent(content) {
      this.$refs.toastEditor.invoke('setMarkdown', content);
    },
  },
}
</script>
<style scoped>
.editor-all {
  display: flex;
  width: 80%;
  /* height: 90vh; */
  align-items: center;
  justify-content: center;
}

.editor-form {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.editor-menu {
  margin: 10px;
  display: flex;
  height: 5vh;
  width: 100%;
}

.editor-title {
  width: 70%;
  margin-right: 10px;
}
.editor-content {
  width: 100%;
}

.editor-date {
  width: 30%;
  margin-right: 10px;
}
.editor-location {
  width: 30%;
}
.editor-right {
  margin-left: 10px;
  height: 90vh;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.editor-right-menu {
  margin: 10px;
  height: 5vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.editor-chat{
  border: 1px solid #ccc;
  height: 550px;
  width: 100%;
  border-radius: 10px;
}
.editor-chat-content{
  height: 512px;
}

.btn {
  margin-left: 10px;
}
</style>