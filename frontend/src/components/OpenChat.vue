<template>
  <div class="container" v-bind:class="{ open: isOpen }">
    <section class="chat">
      <div class="header-chat">
        <i class="icon fa fa-user-o" aria-hidden="true"></i>
        <p class="name">{{ chatBoardName }}</p>

      </div>
      <div class="messages-chat">
        <!-- 
        <div class="message">
          <div class="photo" style="background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);">
            <div class="online"></div>
          </div>
          <p class="text"> Hi, how are you ? </p>
        </div>
        -->


        <div class="chat-box" ref="chatBox">
          <div v-for="(log, index) in logs" :key="index">
            <div v-if="log.member_id === member_id" class="message text-only">
              <div class="response">
                <p class="text"> {{ log.context }}</p>
                  <div class="img-wrap" v-show="log.attached_file.file_name !== ''">
                    <img :src="getImgUrl(log.attached_file.file_name)" alt="" class="rounded float-end">
                  </div>
              </div>
            </div>

            <div v-else class="message text-only">
              <p class="text">{{ log.context }}</p>
              <div class="img-wrap" v-show="log.attached_file.file_name !== ''">
                <img :src="getImgUrl(log.attached_file.file_name)" alt="" class="rounded float-start">
              </div>
            </div>
          </div>
        </div>


          <!-- <div class="message text-only">
              <div class="response">
                <img :src="getImgUrl(log.attached_file.file_name)" alt="">
              </div>
            </div> -->
        <!-- <p class="time"> 14h58</p>
        <div class="message text-only">
          <div class="response">
            <p class="text"> Hey Megan ! It's been a while 😃</p>
          </div>
        </div>
        <div class="message text-only">
          <div class="response">
            <p class="text"> When can we meet ?</p>
          </div>
        </div>
        <p class="response-time time"> 15h04</p>
        <div class="message">
          <div class="photo" style="background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);">
            <div class="online"></div>
          </div>
          <p class="text"> 9 pm at the bar if possible 😳</p>
        </div>
        <p class="time"> 15h09</p>

        
        -->
      </div>
      <div class="footer-chat">
        <i class="icon fa fa-smile-o clickable" style="font-size:25pt;" aria-hidden="true" @click="showUploadForm()">
          <input type="file" style="display:none" ref="file" accept="image/*" @change="saveImage()">
        </i>
        <input type="text" class="write-message" placeholder="Type your message here" v-model="context"
          @keyup.enter="send($event)" />
        <i class="icon send fa fa-paper-plane-o clickable" aria-hidden="true" @click="send($event)"></i>
      </div>
    </section>
  </div>
</template>

<script>

import io from "socket.io-client";
import axios from "axios";

export default {

  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    chatBoardId: {
      type: String,
      required: true
    },
    chatBoardName: {
      type: String,
      required: true
    },
  },
  data: function () {
    return {
      socket: null, // 소켓 클라이언트
      context: "",
      roomName: "",
      logs: [],
      member_id: "",
      member_name: "",
      boardName: "",
      image: "",
      uploadFileName: ""
    }
  },
  created() {
    this.member_id = sessionStorage.getItem("member_id");
    this.member_name = sessionStorage.getItem("member_name");
  },

  beforeMount() {

  },

  mounted() {
    const list = axios.get('/api/chat/list', {
      params: {
        boardId: this.$props.chatBoardId
      }, headers: this.$store.getters.headers
    })
      .then((res) => {
        this.logs = res.data.chattings;
        this.$nextTick(() => {
          this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        });
      })
      .catch((err) => console.log(err));
    console.log(list.data);

    const boardId = this.$props.chatBoardId;
    
    // 다른 네트워크 주소로 통신할 경우 url을 변경해줘야함
    const serverUrl = 'http://localhost:3000';
    this.socket = io(serverUrl);
    this.socket.on("welcome", () => { console.log("new member join!") });
    this.socket.emit("enter_openChat", boardId);
    this.socket.on("new_message", chat => {
      // console.log(`${chat.msg}`);
      this.logs.push(chat);
      this.$nextTick(() => {
        // 모든 DOM 업데이트가 완료된 후에 실행
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      });
    });
    this.roomName = boardId;
  },
  beforeUnmount() {
    this.socket.off('new_message');
    this.socket.off("welcome");
    this.socket.disconnect();
  },
  methods: {
    send(event) {
      event.stopPropagation(); // 이벤트 전파를 멈춥니다.
      if (this.context !== "") {
        const chat = {
          boardId: this.$props.chatBoardId,
          roomName: this.roomName,
          context: this.context,
          member_id: this.member_id,
          member_name: this.member_name,
          type: 'normal',
          attached_file: {
            file_name: this.uploadFileName
          },
        };
        this.socket.emit("new_message", chat, () => {
          this.logs.push(chat);
          this.$nextTick(() => {
            // 모든 DOM 업데이트가 완료된 후에 실행
            // this.scrollToBottom();
            this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
            axios.post('/api/chat', chat, {
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
        this.context = "";
      }

    },
    showUploadForm() {
      this.$refs.file.click();
    },
    async saveImage() {
      try {
        const selectedFile = this.$refs.file.files[0];
        const maxSize = 5 * 1024 * 1024;
        const fileSize = selectedFile.size;
        if (fileSize > maxSize) {
          alert("첨부파일 사이즈는 5MB 이내로 등록 가능합니다.");
          return;
        }
        const filename = selectedFile.name;
        const filetype = selectedFile.type;
        this.context = filename;
        const res = await axios.get('/api/s3/url', {
          params: { filename, filetype },
          headers: this.$store.getters.headers
        });
        const encodedFileName = res.data.encodedFileName
        const presignedUrl = res.data.presignedUrl;
        this.uploadFileName = encodedFileName;

        await axios.put(presignedUrl, selectedFile)
          .then((res) => {
            this.image = `https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/public/` + encodedFileName;
            console.log(res);
            console.log('이미지 업로드 완료');
          })

      } catch (err) {
        if (err.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        } 
        else console.error('이미지 업로드 오류:', err);
      }
      
    },
    getImgUrl(file_name) {
      const url = `https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/public/` + file_name;
      return url;
    }     
  },
  watch: {
    // logs(newVal, oldVal) {
    //   console.log("값 추가 감지");
    //   this.scrollToBottom();
    //   // this.$nextTick( ()  => {

    //   //   const chatBox = this.$refs.chatBox1;
    //   //   console.log(chatBox);
    //   //   chatBox.scrollIntoView({top: chatBox.scrollHeight, behavior: 'smooth'});
    //   // });
    // }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css');
@import url('../assets/css/openChattingStyle.css');


.container {
  position: relative;
  animation-name: close;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.container.open {
  position: relative;
  animation-name: open;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes open {
  from {
    left: 3%;
  }

  to {
    left: 12%;
  }
}

@keyframes close {
  from {
    left: 12%;
  }

  to {
    left: 3%;
  }
}
.img-wrap img {
  width: 80px;
  height: 80px;
  position: relative;
  right: 30px;
}
</style>