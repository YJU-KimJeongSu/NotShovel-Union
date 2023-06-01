<template>
  <div class="editor-all">
    <div class="editor-form">
      <div class="editor-menu">
        <input type="text" class="form-control editor-title" v-model="title" placeholder="제목">
        <input type="date" class="form-control editor-date" v-model="date">
        <input type="text" class="form-control editor-date" v-model="place" placeholder="장소">
      </div>
      <div class="editor-content">
        <Editor ref="toastEditor" initialEditType="wysiwyg" height="550px" previewStyle="vertical" :options="options" />
      </div>
    </div>
    <div class="editor-right">
      <div class="editor-right-menu">
        <button type="submit" class="btn btn-outline-primary" @click="save()">작성완료</button>
        <button type="button" class="btn btn-outline-secondary" @click="deleteMeetingMinutes()">삭제</button>
      </div>
      <div class="editor-chat">
        <div class="editor-chat-content" ref="chatBox">
          채팅내용
          <div v-for="(log, index) in logs" :key="index">
            <div>
              <p class="text">{{ log.name }}: {{ log.context }}</p>
            </div>
          </div>
        </div>
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="채팅" aria-describedby="button-addon2"
            @keyup.enter="send($event)" v-model="context">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="send($event)">전송</button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import axios from 'axios'
import { Editor } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/toastui-editor.css' // Editor style
import io from "socket.io-client"

export default {
  data() {
    return {
      board_id: null,
      member_id: null,
      title: null,
      date: null,
      place: null,
      main: false,
      logs: [],
      roomName: null,
      context: null,
      options: {
        language: "ko",
        hooks: {
          addImageBlobHook: this.onUploadImage
        }
      },
    }
  },
  props: {
    isWrite: Boolean
  },
  components: {
    Editor
  },
  async mounted() {
    // const savedMeetingMinute = this.$store.getters.getMeetingMinute;
    this.member_id = sessionStorage.getItem('member_id');
    this.board_id = sessionStorage.getItem('board_id');
    // this.roomName = sessionStorage.getItem('meetingMinuteId');

    // 작성 버튼 -> 나가기만해도 date가 있어서 저장이 되는 관계로 삭제
    // this.date = new Date().toISOString().slice(0, 10);
    // window.addEventListener('beforeunload', this.leave);
  },
  // beforeUnmount() {
  //   window.removeEventListener('beforeunload', this.leave);
  // },
  async beforeDestroy() {
    const meetingMinuteId = sessionStorage.getItem('meetingMinuteId');
    if (meetingMinuteId == null) return;
    
    if ((this.title == null || this.title == "")
      && (this.date == null || this.date == "")
      && (this.place == null || this.place == "")) {
      await axios.delete(`/api/meeting?board_id=${this.board_id}&meetingMinuteId=${meetingMinuteId}`, {
        headers: this.$store.getters.headers
      })
      .catch((err)=>{
        if (err.response.status === 419) {
            this.$store.dispatch('handleTokenExpired');
        }
      });
    } else {
      await this.save();
    }
  },
  methods: {
    // leave(event) {
    //   // 리스트에 있거나 나가기 버튼 외에 새로고침 방지 메소드
    //   if (this.main === false && this.isWrite === true) {
    //     event.preventDefault();
    //     event.returnValue = '';
    //   }
    // },
    async onUploadImage(blob, callback) {
      const formData = new FormData();
      formData.append('file', blob);

      try {
        const imageUrl = await this.saveImage(formData);
        callback(imageUrl);
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
        throw error;
      }
    },
    async saveImage(formData) {
      try {
        const res = await axios.get('/api/s3/url', {
          params: { filename: formData.get('file').name },
          headers: this.$store.getters.headers
        });
        const encodedFileName = res.data.encodedFileName;
        const presignedUrl = res.data.presignedUrl;

        await axios.put(presignedUrl, formData.get('file'));
        const imageUrl = `https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/public/${encodedFileName}`;
        console.log('이미지 업로드 완료');
        return imageUrl;
      } catch (error) {
        if (err.response.status === 419) {
            this.$store.dispatch('handleTokenExpired');
          }
        else console.error('이미지 업로드 오류:', error);
        throw error;
      }
    },

    async save() {
      if ((this.title == null || this.title == "")
      && (this.date == null || this.date == "")
      && (this.place == null || this.place == "")) {
        alert('빈 값을 다 채워주세요');
        return;
      }
      try {
        const board_id = this.board_id;
        const member_id = this.member_id;
        const meetingMinuteId = sessionStorage.getItem('meetingMinuteId');

        await axios.patch('/api/meeting', {
          board_id,
          title: this.title,
          date: this.date,
          context: this.getContent(),
          place: this.place,
          member_id,
          meetingMinuteId
        }, {
          headers: this.$store.getters.headers
        })
        this.main = true;
        alert('회의록 저장 완료');
        sessionStorage.removeItem('meetingMinuteId');
        this.$router.go();
      } catch (err) {
        if (err.response.status === 419) {
            this.$store.dispatch('handleTokenExpired');
          }
        else {
          console.error(err);
          alert('회의록 저장 실패');
        }
      }
    },
    async deleteMeetingMinutes() {
      try {
        const meetingMinuteId = sessionStorage.getItem('meetingMinuteId');
        const chk = confirm('삭제하면 되돌릴 수 없습니다. 정말 삭제하시겠습니까?');
        if (chk) {
          await axios.delete(`/api/meeting?board_id=${this.board_id}&meetingMinuteId=${meetingMinuteId}`, {
            headers: this.$store.getters.headers
          });
          this.main = true;
          this.$router.go();
        }
        else return;
      } catch (err) {
        if (err.response.status === 419) {
            this.$store.dispatch('handleTokenExpired');
          }
        else console.log(err);
      }

    },
    getContent() {
      return this.$refs.toastEditor.invoke('getMarkdown');
    },
    setContent(content) {
      this.$refs.toastEditor.invoke('setMarkdown', content);
    },
    loadSavedMeetingMinute(meetingMinute) {
      this.title = meetingMinute.title;
      this.setContent(meetingMinute.context);
      this.date = meetingMinute.date.slice(0, 10);
      this.place = meetingMinute.place;
      sessionStorage.setItem('meetingMinuteId', meetingMinute._id);

      console.log('sessionId load 체크: ' + sessionStorage.getItem('meetingMinuteId'));

      console.log('대화요청');
      // console.log(this.minute_id);
      console.log('session MinuteId: ' + sessionStorage.getItem('meetingMinuteId'));
      axios.get('/api/meeting/chat', {
        params: {
          board_id: sessionStorage.getItem('board_id'),
          minute_id: sessionStorage.getItem('meetingMinuteId')
        }, headers: this.$store.getters.headers
      })
        .then((res) => {
          console.log(res);
          this.logs = res.data;
          this.$nextTick(() => {
            this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
          });
        })
        .catch((err) => {
          if (err.response.status === 419) {
            this.$store.dispatch('handleTokenExpired');
          }
          else console.log(err)
        });

      const serverUrl = 'http://localhost:3000';
      this.socket = io(serverUrl);
      this.socket.on("welcome", () => { console.log("new member join!") });
      this.socket.emit("enter_openChat", sessionStorage.getItem('meetingMinuteId'));
      this.socket.on("new_message", chat => {
        // console.log(`${chat.context}`);
        this.logs.push(chat);
        this.$nextTick(() => {
          // 모든 DOM 업데이트가 완료된 후에 실행
          this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        });
      });
    },

    send(event) {
      event.stopPropagation(); // 이벤트 전파를 멈춥니다.
      console.log("room체크: " + sessionStorage.getItem('meetingMinuteId'));
      if (this.context !== "") {
        const chat = {
          roomName: sessionStorage.getItem('meetingMinuteId'),
          context: this.context,
          member_id: this.member_id,
          name: sessionStorage.getItem('member_name'),
          type: 'normal'
        };
        this.logs.push(chat);
        // this.logs.member_id.push(chat);
        this.context = "";
        this.socket.emit("new_message", chat, () => {
          this.$nextTick(() => {
            // 모든 DOM 업데이트가 완료된 후에 실행
            // this.scrollToBottom();
            // this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
            chat.board_id = this.board_id;
            chat.minute_id = sessionStorage.getItem('meetingMinuteId');
            axios.post('/api/meeting/chat', chat, {
              headers: this.$store.getters.headers
            })
              .then((res) => console.log(res))
              .catch((err) => {
                if (err.response.status === 419) {
                  this.$store.dispatch('handleTokenExpired');
                }
                else console.log(err)
              });
          });
        });

      }
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

.editor-chat {
  border: 1px solid #ccc;
  height: 550px;
  width: 100%;
  border-radius: 10px;
}

.editor-chat-content {
  height: 512px;
  overflow: scroll;
}

.btn {
  margin-left: 10px;
}
</style>