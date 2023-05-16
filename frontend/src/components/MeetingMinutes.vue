<template>
  <div class="section" v-bind:class="{ open: props }">
    <!-- 글 작성 -->
    <div class="meeting-form" v-show="isWrite">
      <MeetingMinuteEditor :isWrite="this.isWrite"></MeetingMinuteEditor>
    </div>
    <div class="meeting-form" v-show="!isWrite">
      <button type="button" class="btn btn-outline-secondary" @click="goEditor()">글 작성</button>
      <!-- 테이블 -->
      <table>
        <thead>
          <tr>
            <th class="title">제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meetingMinute in meetingMinuteList">
            <td>{{ meetingMinute.title }}</td>
            <td>{{ meetingMinute.writer_name }}</td>
            <td>{{ String(meetingMinute.date).slice(5,10) }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 테이블 -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import meetingMinuteEditor from "@/components/MeetingMinuteEditor.vue"
import axios from "axios";

export default {
  data() {
    return {
      isWrite: false,
      board_id: null,
      member_id: null,
      meetingMinuteList: [],
    }
  },
  props: ['props'],
  components: {
    MeetingMinuteEditor: meetingMinuteEditor
  },
  mounted() {
    this.member_id = sessionStorage.getItem('member_id');
    this.board_id = sessionStorage.getItem('board_id');
  }, 
  methods: {
    async goEditor(){  
      try {
        this.isWrite=true;
        const board_id = this.board_id;
        const member_id = this.member_id;

        await axios.post('/api/meeting', {
          board_id,
          title: null,
          date: null,
          context: null,
          place: null,
          member_id 
        })
        .then((res)=> {
          const data = res.data.result.meeting_minutes;
          sessionStorage.setItem('meetingMinuteId', data[data.length-1]._id);
        })   
      } catch (err) {
        console.error(err);
      }
    },
  },
  async mounted() {
    try {
      const boardId = sessionStorage.getItem('board_id')
      const res = await axios.get("/api/meeting/" + boardId);
      this.meetingMinuteList = res.data;
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style scoped>
@import url('https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css');

body {
  padding: 1.5em;
  background: #f5f5f5
}

table {
  border: 1px 11101C solid;
  font-size: .9em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
  width: 75%;
  border-collapse: collapse;
  border-radius: 5px;
  overflow: hidden;
}

th {
  text-align: left;
}

thead {
  font-weight: bold;
  color: #fff;
  background: #11101C;
}

td,
th {
  padding: 1em .5em;
  vertical-align: middle;
}

td {
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  background: #fff;
}


@media all and (max-width: 768px) {

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  th {
    text-align: right;
  }

  table {
    position: relative;
    padding-bottom: 0;
    border: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
  }

  thead {
    float: left;
    white-space: nowrap;
  }

  tbody {
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    white-space: nowrap;
  }

  tr {
    display: inline-block;
    vertical-align: top;
  }

  th {
    border-bottom: 1px solid #a39485;
  }

  td {
    border-bottom: 1px solid #e5e5e5;
  }


}

.meeting-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.section {
  position: relative;
  animation-name: close;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.section.open {
  position: relative;
  animation-name: open;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.btn {
  margin: 1rem 13.5% 1rem;
  align-self: flex-end;
}

.title {
  width: 80%;
}

th, td {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@keyframes open {
  from {
    left: 0;
  }

  to {
    left: 9%;
  }
}

@keyframes close {
  from {
    left: 9%;
  }

  to {
    left: 0;
  }
}</style>