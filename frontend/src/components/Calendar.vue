<template>
  <div class="fullcalendar-container">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
    
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        eventClick: this.handleEventClick,
        dateClick: this.handleDateClick,
        headerToolbar: {
          start: '',
          center: '',
          end: 'today prev,next'
        },
        events: [
          { title: '1', date: '2023-05-14', customData: '11' },
          { title: '2', date: '2023-05-15' },
          { title: '3', date: '2023-05-16' },
          { title: '4', date: '2023-05-15' },
          { title: '5', date: '2023-05-15' },
          { title: '5', date: '2023-05-15' },
          { title: '5', date: '2023-05-15' },
          { title: '5', date: '2023-05-15' },
          { title: '5', date: '2023-05-15' },
          { title: '5', date: '2023-05-15' },
        ]
      }
    }
  },
  methods: {
    handleEventClick(arg) {
      console.log(arg.event.extendedProps.customData);
    },
    handleDateClick(arg) {
      console.log(arg);
    },
    setEvents(events) {
      console.log(events);
    }
  }
}
</script>
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
</style>