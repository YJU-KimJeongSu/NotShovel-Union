<template>
  <div class="section" v-bind:class="{ open: props }">
     <div class="menu">
      <h4>{{ board_name }}</h4>
     </div>
    <div class="toggle-radio" v-show="!isWrite">
      <input type="radio" name="default" id="default_Option1" value="list" v-model="toggle">
      <label for="default_Option1" class="label-txt">리스트</label>
      <input type="radio" name="default" id="default_Option2" value="calendar" v-model="toggle">
      <label for="default_Option2" class="label-txt">캘린더</label>
    </div>
    <!-- 글 작성 -->
    <div class="meeting-form" v-show="isWrite">
      <MeetingMinuteEditor :isWrite="this.isWrite" ref="meetingMinuteEditor"></MeetingMinuteEditor>
    </div>
    <!-- 캘린더 형식 글 보기 -->
    <div class="calendar" v-show="!isWrite && toggle == 'calendar'">
      <div class="fullcalendar-container">
        <FullCalendar :key="calendarKey" :options="calendarOptions"></FullCalendar>
      </div>
    </div>
    <div class="meeting-form" v-show="!isWrite && toggle == 'list'">
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
          <tr v-for="meetingMinute in meetingMinuteList" @click="getDetailMeetingMinute(meetingMinute._id)">
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
import meetingMinuteEditor from "@/components/MeetingMinuteEditor.vue"
import axios from "axios";
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        eventClick: this.handleEventClick,
        // dateClick: this.handleDateClick,
        headerToolbar: {
          start: '',
          center: '',
          end: 'today prev,next'
        },
        events: [],
      },
      isWrite: false,
      board_name: null,
      board_id: null,
      member_id: null,
      meetingMinuteList: [],
      toggle: 'list',
      calendarKey: 1,
    }
  },
  props: ['props'],
  components: {
    MeetingMinuteEditor: meetingMinuteEditor,
    FullCalendar,
  },
  watch: {
    toggle(newValue) {
      if (newValue === 'calendar') {
        this.calendarKey += 1;
      }
    }
  },
  methods: {
    async goEditor() {  
      try {
        this.isWrite = true;
        // this.$store.commit('setMeetingMinute', null);

        await axios.post('/api/meeting', {
          board_id: sessionStorage.getItem('board_id'),
          title: null,
          date: null,
          context: null,
          place: null,
          member_id: sessionStorage.getItem('member_id')
        })
        .then((res)=> {
          const data = res.data.result.meeting_minutes;
          sessionStorage.setItem('meetingMinuteId', data[data.length-1]._id);
        })   
      } catch (err) {
        console.error(err);
      }
    },
    async getDetailMeetingMinute(_id) {
      try {
        const boardId = sessionStorage.getItem('board_id');
        const res = await axios.get(`/api/meeting/${boardId}/${_id}`);
        this.$refs.meetingMinuteEditor.loadSavedMeetingMinute(res.data);


        
    
        // this.$store.commit('setMeetingMinute', res.data);
        this.isWrite = true;
      } catch (err) {
        console.log(err);
      }
    },
    async handleEventClick(arg) {
      // console.log(arg);
      await this.getDetailMeetingMinute(arg.event.extendedProps._id);
    },
    setEvents(events) {
      console.log(events);
    },
  },
  async mounted() {
    this.board_name = sessionStorage.getItem('board_name');
    this.member_id = sessionStorage.getItem('member_id');
    this.board_id = sessionStorage.getItem('board_id');
    // this.$store.commit('setMeetingMinute', null);
    try {
      const boardId = sessionStorage.getItem('board_id');
      const res = await axios.get("/api/meeting/" + boardId);
      this.meetingMinuteList = res.data;

      this.meetingMinuteList.forEach((m) => {
        const event = {
          title: m.title,
          date: String(m.date).slice(0, 10),
          _id: m._id,
        };
        this.calendarOptions.events.push(event);
      });
    } catch (err) {
      console.log(err);
    }
  },
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
  margin-bottom: 75px;
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

.calendar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

th,
td {
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
}

.toggle-radio {
  background: #f5f5f5;
  border: 1px solid #ccc;
  position: absolute;
  margin: 15px;
  margin-left: 175px;
}

.toggle-radio>input:checked+label {
  background: burlywood;
}

.toggle-radio>input+label:not(:last-of-type) {
  border-right: 1px solid #ccc;
}

.toggle-radio {
  border-radius: 4px;
  z-index: 1;
}

.toggle-radio {
  display: inline-flex;
}

.toggle-radio>input[type='radio'] {
  display: none;
}

.toggle-radio>input[disabled]+label {
  opacity: 0.50;
}

.toggle-radio>input[disabled]+label:hover {
  cursor: not-allowed;
}

.toggle-radio>input+label {
  display: inline-block;
  margin-bottom: 0;
  padding: 5px 10px;
  float: left;
  cursor: pointer;
}

.toggle-radio>input:checked+label {
  transition: background 300ms linear;
}

.toggle-radio[data-style='rounded'] {
  border-radius: 500px;
}

.toggle-radio[data-style='square'] {
  border-radius: 0;
}

.label-txt {
  font-weight: 600;
  color: #11101C;
}
</style>
<!-- scoped 있으면 FullCalendar에 안먹어서 따로 지정 -->
<style>
.fullcalendar-container > * {
  width: 100%;
  height: 80%;
}

.fc .fc-daygrid-day-frame {
  min-height: 100%;
  max-height: 100%;
  height: 100%;
  overflow-y: scroll;
}

.fc .fc-daygrid-day-frame::-webkit-scrollbar {
  width: 4px;
}

.fc .fc-daygrid-day-frame::-webkit-scrollbar-thumb {
  background-color: #c8c8c8;
  border-radius: 10px;
}

.fc-scrollgrid-sync-table > tbody > tr {
  height: 100px;
}

.fullcalendar-container {
  width: 80%;
  height: 100%;
  padding: 2%;
}

.fc-view-harness {
  height: 100vh !important;
}

.menu {
  margin-top: 10px;
  height: 5vh;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>