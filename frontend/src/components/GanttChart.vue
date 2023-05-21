<template>
  <div class="section" v-bind:class="{ open: props }">
    <div class="menu">
      <h4>{{ board_name }}</h4>
      <button @click="saveActivity()" class="btn btn-outline-primary">저장</button>
    </div>
    <div class="container" ref="gantt">
      <div class="left-container" :tasks="tasks">
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { gantt } from 'dhtmlx-gantt';

export default {
  props: ['props'],

  data() {
    return {
      project_id: null,
      board_name: null,
      board_id: null,
      activity_list: [],
      tasks: {
        data: [ 
          // { id: 1, text: '작업 #1', start_date: '2020-01-17', duration: 3, progress: 0.6 },
        ],
        links: [
          // { id: 1, source: 1, target: 2, type: '0' }
        ]
      },
    }
  },
  created() {
    this.project_id = sessionStorage.getItem('project_id');
    this.board_name = sessionStorage.getItem('board_name');
    this.board_id = sessionStorage.getItem('board_id');
  },
  async mounted() {
    gantt.config.xml_date = '%Y-%m-%d';
    gantt.init(this.$refs.gantt);

    await this.fetchGanttData();
    this.$nextTick(() => {
        gantt.clearAll();
        gantt.parse(this.tasks);
    });
  },
  methods: {
    async fetchGanttData() {
      try {
        const res = await axios.get(`/api/gantt/${this.board_id}`);
        const ganttData = res.data;
        this.tasks.data = ganttData.gantt_data.data.map(item => ({
          id: item.id,
          text: item.activity_name,
          start_date: item.activity_start_date,
          duration: item.activity_duration,
          progress: item.activity_progress,
          parent: item.parent
        }));
        this.tasks.links = ganttData.gantt_data.links;
        // console.log(this.tasks);
      } catch (error) {
        console.error(error);
      }
    },

    async saveActivity() {
      this.activity_list = [];
      
      const taskDataStore = gantt.getDatastore("task");
      taskDataStore.eachItem((task) => {
        const activity = {
          id: task.id, // 고유한 ID
          activity_name: task.text,
          activity_start_date: task.start_date,
          activity_duration: task.duration,
          activity_progress: task.progress,
          parent: task.parent
        };

        this.activity_list.push(activity);
      });
      console.log(this.activity_list);

      await axios.post('/api/gantt', {
        board_id: this.board_id,
        gantt_data: {
          data: this.activity_list,
          links: gantt.getLinks()
        }
      })
        .then((res) => {
          alert('저장 완료!');
          this.activity_list = [];
          console.log(res)
          this.$router.go();
        })
        .catch((err) => {
          alert('서버 문제로 저장에 실패하였습니다. 잠시 후 다시 시도해주세요');
          console.log(err)
        });
    }
  }

}
</script>
<style scoped>
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";

@media all and (max-width: 768px) {
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
}

.menu {
  margin-top: 10px;
  height: 5vh;
  width: 80%;
  display: flex;
  justify-content: space-between;
}
.container {
  margin-top: 20px;
  height: 80vh;
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

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>